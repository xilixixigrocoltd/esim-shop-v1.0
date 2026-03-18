import type { NextApiRequest, NextApiResponse } from 'next';
import { b2bApi } from '@/lib/api';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // 获取所有产品
    const allProducts = await b2bApi.getAllProducts();
    
    // 统计类型
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
    
    // 按类型分组示例产品
    const sampleByType: any = {};
    ['local', 'regional', 'global'].forEach(type => {
      const products = allProducts.filter(p => p.type === type);
      sampleByType[type] = products.slice(0, 3).map(p => ({
        name: p.name,
        countries: p.countries?.map(c => c.cn).slice(0, 3),
        price: p.price,
      }));
    });
    
    return res.status(200).json({
      success: true,
      totalProducts: allProducts.length,
      typeCount,
      countriesCount: countrySet.size,
      sampleByType,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: error?.message || 'Unknown error',
    });
  }
}
