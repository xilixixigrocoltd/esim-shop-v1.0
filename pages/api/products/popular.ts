import type { NextApiRequest, NextApiResponse } from 'next';
import { getCachedProducts } from '@/lib/products-cache';

// 热门亚洲国家代码
const POPULAR_COUNTRY_CODES = ['JP', 'KR', 'CN', 'HK', 'TH', 'VN', 'SG', 'MY'];

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { country } = req.query;

  try {
    // 从缓存获取全部产品
    const allProducts = getCachedProducts();
    
    // 筛选热门国家的 local 产品
    const filtered = allProducts.filter((p: any) => {
      if (p.type !== 'local' || !p.countries) return false;
      return p.countries.some((c: any) => POPULAR_COUNTRY_CODES.includes(c.code));
    });

    res.setHeader('Cache-Control', 'public, s-maxage=600, stale-while-revalidate');
    return res.status(200).json({ success: true, data: filtered });
  } catch (error: any) {
    console.error('Failed to fetch popular products:', error);
    return res.status(500).json({ error: `获取热门国家产品失败：${error.message}` });
  }
}
