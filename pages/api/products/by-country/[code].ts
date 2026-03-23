import type { NextApiRequest, NextApiResponse } from 'next';
import { getCachedProducts } from '@/lib/products-cache';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const code = ((req.query.code as string) || '').toUpperCase();
  if (!code) return res.status(400).json({ success: false, error: '国家代码不能为空' });

  try {
    const allProducts = await getCachedProducts();
    const sortByPrice = (a: any, b: any) => (parseFloat(a.price) || 0) - (parseFloat(b.price) || 0);

    const local = allProducts
      .filter(p => p.type === 'local' && p.countries?.some((c: any) => c.code?.toUpperCase() === code))
      .sort(sortByPrice);
    const regional = allProducts
      .filter(p => p.type === 'regional' && p.countries?.some((c: any) => c.code?.toUpperCase() === code))
      .sort(sortByPrice);
    const global_p = allProducts
      .filter(p => p.type === 'global' || (!p.type && p.countries?.length > 50))
      .sort(sortByPrice);

    res.setHeader('Cache-Control', 'public, s-maxage=600, stale-while-revalidate');
    return res.status(200).json({ success: true, data: { local, regional, global: global_p } });
  } catch (error: any) {
    return res.status(500).json({ error: `获取产品失败：${error.message}` });
  }
}
