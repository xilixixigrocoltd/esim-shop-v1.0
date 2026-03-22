import type { NextApiRequest, NextApiResponse } from 'next';
import { b2bApi } from '@/lib/api';
import { getCachedProducts } from '@/lib/products-cache';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { code } = req.query;
  const countryCode = Array.isArray(code) ? code[0] : code;
  
  if (!countryCode) {
    return res.status(400).json({ success: false, error: '国家代码不能为空' });
  }

  try {
    // 先尝试 B2B API
    const allProducts = await b2bApi.getAllProducts();
    const filtered = allProducts.filter((p: any) => {
      if (p.type !== 'local' || !p.countries) return false;
      return p.countries.some((c: any) => c.code?.toUpperCase() === countryCode.toUpperCase());
    });

    res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate');
    return res.status(200).json({ success: true, data: filtered });
  } catch (b2bError: any) {
    // B2B API 失败，降级到缓存
    console.warn('[ByCountry API] B2B API 失败，使用缓存:', b2bError.message);
    
    const allProducts = await getCachedProducts();
    const filtered = allProducts.filter((p: any) => {
      if (p.type !== 'local' || !p.countries) return false;
      return p.countries.some((c: any) => c.code?.toUpperCase() === countryCode.toUpperCase());
    });

    res.setHeader('Cache-Control', 'public, s-maxage=600, stale-while-revalidate');
    return res.status(200).json({ 
      success: true, 
      data: filtered,
      warning: 'B2B API 不可用，显示缓存产品'
    });
  }
}
