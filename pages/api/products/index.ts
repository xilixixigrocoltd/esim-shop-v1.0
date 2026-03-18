import type { NextApiRequest, NextApiResponse } from 'next';
import { b2bApi } from '@/lib/api';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { page = '1', pageSize = '100' } = req.query;
    const response = await b2bApi.getProducts(Number(page), Number(pageSize));
    const products = response.products;

    res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate');
    return res.status(200).json({ success: true, data: products });
  } catch (error: any) {
    console.error('Failed to fetch products:', error);
    return res.status(500).json({ error: `获取产品失败：${error.message}` });
  }
}
