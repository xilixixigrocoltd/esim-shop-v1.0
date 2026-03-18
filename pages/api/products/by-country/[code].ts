import type { NextApiRequest, NextApiResponse } from 'next';
import { b2bApi } from '@/lib/api';
import type { Product } from '@/types';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { code } = req.query;
  if (!code || typeof code !== 'string') {
    return res.status(400).json({ error: 'Country code required' });
  }

  try {
    console.log(`[by-country] 请求国家：${code}`);
    const products = await b2bApi.getProductsByCountry(code);
    console.log(`[by-country] 找到产品数：${products.length}`);
    return res.status(200).json({ success: true, data: products });
  } catch (error: any) {
    console.error('Failed to fetch products by country:', error?.message || error);
    return res.status(500).json({ success: false, error: `获取产品失败：${error?.message || '未知错误'}` });
  }
}
