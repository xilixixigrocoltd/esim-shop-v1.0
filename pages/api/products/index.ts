import type { NextApiRequest, NextApiResponse } from 'next';
import { getCachedProducts } from '@/lib/products-cache';

function normalizeProduct(p: any): any {
  return {
    ...p,
    validDays: p.validityDays || p.validDays,
    dataSize: p.dataSize || 0,
    features: p.features || [],
  };
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { page = '1', pageSize = '100', search = '' } = req.query;
    const pageNum = Number(page);
    const pageSizeNum = Math.min(Number(pageSize), 2000);

    // Fetch from live B2B API (with 5-min in-memory cache), fallback to static JSON
    const allProducts = (await getCachedProducts()).map(normalizeProduct);

    // Detect source
    const source = (allProducts as any)._source || 'live';

    // Search filter
    let filtered = allProducts;
    if (search) {
      const q = (search as string).toLowerCase();
      filtered = allProducts.filter((p: any) =>
        p.name?.toLowerCase().includes(q) ||
        p.nameEn?.toLowerCase().includes(q) ||
        p.countries?.some((c: any) =>
          c.name?.toLowerCase().includes(q) ||
          c.nameEn?.toLowerCase().includes(q) ||
          c.code?.toLowerCase().includes(q)
        )
      );
    }

    // Pagination
    const total = filtered.length;
    const start = (pageNum - 1) * pageSizeNum;
    const data = pageSizeNum >= 2000 ? filtered : filtered.slice(start, start + pageSizeNum);

    res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=60');
    return res.status(200).json({
      success: true,
      data,
      source,
      pagination: {
        total,
        page: pageNum,
        pageSize: pageSizeNum,
        totalPages: Math.ceil(total / pageSizeNum),
      },
    });
  } catch (error: any) {
    return res.status(500).json({ error: `获取产品失败：${error.message}` });
  }
}
