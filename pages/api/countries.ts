import type { NextApiRequest, NextApiResponse } from 'next';
import { b2bApi } from '@/lib/api';
import type { Product, Country } from '@/types';

interface CountryWithProducts {
  code: string;
  name: string;
  nameEn: string;
  productCount: number;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const allProducts: Product[] = [];
    for (let page = 1; page <= 10; page++) {
      const result = await b2bApi.getProducts(page, 100);
      if (!result || !result.products) break;
      allProducts.push(...result.products);
      if (result.products.length < 100) break;
    }
    
    console.log(`[countries] 获取到 ${allProducts.length} 个产品`);

    const countryMap = new Map<string, CountryWithProducts>();

    allProducts.forEach((product) => {
      if (product.type === 'local' && product.countries) {
        product.countries.forEach((country: any) => {
          const name = country.cn || country.name || 'Unknown';
          const nameEn = country.en || country.nameEn || 'Unknown';
          const code = country.code;
          
          if (!countryMap.has(code)) {
            countryMap.set(code, { code, name, nameEn, productCount: 0 });
          }
          countryMap.get(code)!.productCount++;
        });
      }
    });
    
    console.log(`[countries] 最终国家数：${countryMap.size}`);

    const countries = Array.from(countryMap.values())
      .filter(c => c.name)
      .sort((a, b) => (a.name || '').localeCompare(b.name || '', 'zh-CN'));
    
    res.setHeader('Cache-Control', 'public, s-maxage=600, stale-while-revalidate');
    return res.status(200).json({ success: true, data: countries });
  } catch (error: any) {
    const errorMsg = typeof error === 'object' ? JSON.stringify(error) : (error?.message || '未知错误');
    console.error('Failed to fetch countries:', errorMsg);
    return res.status(500).json({ success: false, error: `获取国家列表失败：${errorMsg}` });
  }
}
