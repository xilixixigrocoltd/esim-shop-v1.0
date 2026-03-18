import type { NextApiRequest, NextApiResponse } from 'next';
import { b2bApi } from '@/lib/api';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { type } = req.query;

  try {
    const allProducts = [];
    
    // 获取全部 28 页产品
    for (let page = 1; page <= 28; page++) {
      const result = await b2bApi.getProducts(page, 100);
      if (!result || !result.products) break;
      
      // 筛选全球套餐
      const globalProducts = result.products.filter((p: any) => p.type === 'global');
      
      // 按套餐类型筛选
      const filtered = globalProducts.filter((p: any) => {
        const hasOnlyData = p.features?.some((f: string) => f.includes('仅数据') || f.includes('仅流量'));
        if (type === 'data-only') return hasOnlyData;
        if (type === 'data-voice-sms') return !hasOnlyData;
        return true;
      });
      
      allProducts.push(...filtered);
      if (result.products.length < 100) break;
    }

    res.setHeader('Cache-Control', 'public, s-maxage=600, stale-while-revalidate');
    return res.status(200).json({ success: true, data: allProducts });
  } catch (error: any) {
    console.error('Failed to fetch global products by plan type:', error);
    return res.status(500).json({ error: `获取全球套餐失败：${error.message}` });
  }
}
