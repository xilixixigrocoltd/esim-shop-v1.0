import type { NextApiRequest, NextApiResponse } from 'next';
import { b2bApi } from '@/lib/api';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // 获取前 2 页产品
    const allProducts: any[] = [];
    for (let page = 1; page <= 2; page++) {
      const response = await b2bApi.getProducts(page, 100);
      const result = await b2bApi.getProducts(page, 100);
      allProducts.push(...result.products);
      if (result.products.length < 100) break;
    }

    console.log(`[test-countries] 获取到 ${allProducts.length} 个产品`);

    // 统计类型
    const typeCount: Record<string, number> = {};
    allProducts.forEach(p => {
      typeCount[p.type] = (typeCount[p.type] || 0) + 1;
    });

    // 测试国家提取
    const countryMap = new Map();
    allProducts.forEach((product) => {
      if (product.type === 'local' && product.countries) {
        product.countries.forEach((country: any) => {
          const code = country.code;
          const name = country.cn || country.name || 'NO_NAME';
          if (!countryMap.has(code)) {
            countryMap.set(code, { code, name, count: 0 });
          }
          countryMap.get(code).count++;
        });
      }
    });

    const countries = Array.from(countryMap.values());

    return res.status(200).json({
      totalProducts: allProducts.length,
      typeCount,
      localProducts: allProducts.filter(p => p.type === 'local').length,
      productsWithCountries: allProducts.filter(p => p.countries && p.countries.length > 0).length,
      countriesCount: countries.length,
      sampleCountries: countries.slice(0, 10),
      sampleProduct: allProducts[0] ? {
        id: allProducts[0].id,
        type: allProducts[0].type,
        countries: allProducts[0].countries,
      } : null,
    });
  } catch (error: any) {
    return res.status(500).json({
      error: error?.message || 'Unknown error',
      stack: error?.stack,
    });
  }
}
