import type { NextApiRequest, NextApiResponse } from 'next';
import { b2bApi } from '@/lib/api';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { id } = req.query;
    const product = await b2bApi.getProduct(Number(id));
    return res.status(200).json({ success: true, data: product });
  } catch (error) {
    console.error('Failed to fetch product:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
