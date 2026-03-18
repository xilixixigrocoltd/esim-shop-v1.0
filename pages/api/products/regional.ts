import type { NextApiRequest, NextApiResponse } from 'next';
import { b2bApi } from '@/lib/api';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const allProducts = [];
    
    // 获取全部 28 页产品
    for (let page = 1; page <= 28; page++) {
      const result = await b2bApi.getProducts(page, 100);
      if (!result || !result.products) break;
      
      // 筛选 regional 类型
      const filtered = result.products.filter((p: any) => p.type === 'regional');
      allProducts.push(...filtered);
      
      if (result.products.length < 100) break;
    }

    res.setHeader('Cache-Control', 'public, s-maxage=600, stale-while-revalidate');
    return res.status(200).json({ success: true, data: allProducts });
  } catch (error: any) {
    console.error('Failed to fetch regional products:', error);
    return res.status(500).json({ error: `获取区域套餐失败：${error.message}` });
  }
}
