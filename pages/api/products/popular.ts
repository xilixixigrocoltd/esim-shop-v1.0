import type { NextApiRequest, NextApiResponse } from 'next';
import { b2bApi } from '@/lib/api';

// 热门亚洲国家代码
const POPULAR_COUNTRY_CODES = ['JP', 'KR', 'CN', 'HK', 'TH', 'VN', 'SG', 'MY'];

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const allProducts = [];
    
    // 获取前 10 页产品
    for (let page = 1; page <= 10; page++) {
      const result = await b2bApi.getProducts(page, 100);
      if (!result || !result.products) break;
      
      // 筛选热门国家的 local 产品
      const filtered = result.products.filter((p: any) => {
        if (p.type !== 'local' || !p.countries) return false;
        return p.countries.some((c: any) => POPULAR_COUNTRY_CODES.includes(c.code));
      });
      
      allProducts.push(...filtered);
      if (result.products.length < 100) break;
    }

    res.setHeader('Cache-Control', 'public, s-maxage=600, stale-while-revalidate');
    return res.status(200).json({ success: true, data: allProducts });
  } catch (error: any) {
    console.error('Failed to fetch popular products:', error);
    return res.status(500).json({ error: `获取热门国家产品失败：${error.message}` });
  }
}
