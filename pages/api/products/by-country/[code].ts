import type { NextApiRequest, NextApiResponse } from 'next';
import { POPULAR_PRODUCTS } from '@/lib/products-cache';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { code } = req.query;
  const countryCode = Array.isArray(code) ? code[0] : code;
  
  if (!countryCode) {
    return res.status(400).json({ success: false, error: '国家代码不能为空' });
  }

  // 直接从缓存筛选产品（绕过 B2B API）
  const filtered = POPULAR_PRODUCTS.filter((p: any) => {
    if (!p.countries) return false;
    return p.countries.some((c: any) => c.code?.toUpperCase() === countryCode.toUpperCase());
  });

  res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate');
  return res.status(200).json({ 
    success: true, 
    data: filtered,
    note: '当前显示缓存产品，B2B API 维护中'
  });
}
