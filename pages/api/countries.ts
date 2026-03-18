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
    // 只获取前 3 页（300 个产品）用于国家列表，避免超时
    const allProducts: Product[] = [];
    for (let page = 1; page <= 3; page++) {
      const response = await b2bApi.getProducts(page, 100);
      allProducts.push(...response.list);
      if (response.list.length < 100) break;
    }

    const countryMap = new Map<string, CountryWithProducts>();
    console.log(`[countries] 获取到 ${allProducts.length} 个产品`);
    console.log(`[countries] 第一个产品类型：${allProducts[0]?.type}`);
    console.log(`[countries] 第一个产品国家：${JSON.stringify(allProducts[0]?.countries)}`);

    allProducts.forEach((product) => {
      console.log(`[countries] 产品 ${product.id}: type=${product.type}, countries=${!!product.countries}`);
      if (product.type === 'local' && product.countries) {
        product.countries.forEach((country: any) => {
          // B2B API 返回的字段是 cn/en/code，不是 name/nameEn/code
          const name = country.cn || country.name || 'Unknown';
          const nameEn = country.en || country.nameEn || 'Unknown';
          const code = country.code;
          
          if (!countryMap.has(code)) {
            countryMap.set(code, {
              code,
              name,
              nameEn,
              productCount: 0,
            });
          }
          countryMap.get(code)!.productCount++;
        });
      }
    });
    
    console.log(`[countries] 最终国家数：${countryMap.size}`);

    const countries = Array.from(countryMap.values())
      .filter(c => c.name) // 过滤掉没有 name 的国家
      .sort((a, b) => (a.name || '').localeCompare(b.name || '', 'zh-CN'));
    return res.status(200).json({ success: true, data: countries });
  } catch (error: any) {
    console.error('Failed to fetch countries:', error?.message || error);
    return res.status(500).json({ success: false, error: `获取国家列表失败：${error?.message || '未知错误'}` });
  }
}
