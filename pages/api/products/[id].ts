import type { NextApiRequest, NextApiResponse } from 'next';
import { getCachedProducts } from '@/lib/products-cache';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { id } = req.query;
    const allProducts = await getCachedProducts();
    const product = allProducts.find((p: any) => String(p.id) === String(id));

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.setHeader('Cache-Control', 'public, s-maxage=600, stale-while-revalidate');
    return res.status(200).json({ success: true, data: product });
  } catch (error) {
    console.error('Failed to fetch product:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
