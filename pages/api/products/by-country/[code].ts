// 2026-03-22 17:20 - B2B 缓存数据 (5723 产品，210 国家)
import type { NextApiRequest, NextApiResponse } from 'next';
import productsData from './products.json';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const code = (req.query.code as string)?.toUpperCase();
  if (!code) return res.status(400).json({ success: false, message: '缺少国家代码' });
  const products = (productsData as any)[code] || [];
  return res.status(200).json({ success: true, data: products, total: products.length, countryCode: code });
}
