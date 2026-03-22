import type { NextApiRequest, NextApiResponse } from 'next';
import { getCachedProducts } from '@/lib/products-cache';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // 从缓存获取全部产品
    const allProducts = await getCachedProducts();
    
    // 筛选 regional 类型
    const regionalProducts = allProducts.filter((p: any) => p.type === 'regional');

    res.setHeader('Cache-Control', 'public, s-maxage=600, stale-while-revalidate');
    return res.status(200).json({ success: true, data: regionalProducts });
  } catch (error: any) {
    console.error('Failed to fetch regional products:', error);
    return res.status(500).json({ error: `获取区域套餐失败：${error.message}` });
  }
}
