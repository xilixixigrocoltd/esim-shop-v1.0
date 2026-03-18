import type { NextApiRequest, NextApiResponse } from 'next';
import { b2bApi } from '@/lib/api';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { code } = req.query;
  
  // 确保 code 是字符串且转为大写
  const countryCode = Array.isArray(code) ? code[0] : code;
  if (!countryCode) {
    return res.status(400).json({ success: false, error: '国家代码不能为空' });
  }

  try {
    const allProducts = [];
    
    // 获取前 15 页产品
    for (let page = 1; page <= 15; page++) {
      const result = await b2bApi.getProducts(page, 100);
      if (!result || !result.products) break;
      
      // 筛选指定国家的产品（包含所有类型：local/regional/global）
      const filtered = result.products.filter((p: any) => {
        if (!p.countries) return false;
        return p.countries.some((c: any) => c.code?.toUpperCase() === countryCode.toUpperCase());
      });
      
      allProducts.push(...filtered);
      if (result.products.length < 100) break;
    }

    res.setHeader('Cache-Control', 'public, s-maxage=600, stale-while-revalidate');
    return res.status(200).json({ success: true, data: allProducts });
  } catch (error: any) {
    console.error('Failed to fetch products by country:', error);
    return res.status(500).json({ error: `获取产品失败：${error.message}` });
  }
}
