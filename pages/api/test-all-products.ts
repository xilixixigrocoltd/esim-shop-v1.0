import type { NextApiRequest, NextApiResponse } from 'next';
import { b2bApi } from '@/lib/api';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // 测试获取第 1 页
    const firstPage = await b2bApi.getProducts(1, 100);
    console.log('[test] 第 1 页产品数:', firstPage.products.length);
    console.log('[test] 分页信息:', JSON.stringify(firstPage.pagination));
    
    // 获取所有产品
    const allProducts = await b2bApi.getAllProducts();
    
    // 统计
    const typeCount = {
      local: allProducts.filter(p => p.type === 'local').length,
      regional: allProducts.filter(p => p.type === 'regional').length,
      global: allProducts.filter(p => p.type === 'global').length,
    };
    
    // 统计国家
    const countrySet = new Set<string>();
    allProducts.forEach(p => {
      if (p.countries) {
        p.countries.forEach(c => countrySet.add(c.code));
      }
    });
    
    return res.status(200).json({
      success: true,
      totalProducts: allProducts.length,
      pagination: firstPage.pagination,
      typeCount,
      countriesCount: countrySet.size,
      sampleProduct: allProducts[0],
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: error?.message || 'Unknown error',
    });
  }
}
