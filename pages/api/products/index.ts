import type { NextApiRequest, NextApiResponse } from 'next';
import { b2bApi } from '@/lib/api';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { page = '1', pageSize = '100', country } = req.query;

    let products;
    if (country) {
      products = await b2bApi.getProductsByCountry(country as string);
    } else {
      const response = await b2bApi.getProducts(Number(page), Number(pageSize));
      products = response.list;
    }

    return res.status(200).json({ success: true, data: products });
  } catch (error) {
    console.error('Failed to fetch products:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
