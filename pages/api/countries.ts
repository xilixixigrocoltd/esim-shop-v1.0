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
    const products = await b2bApi.getAllProducts();
    const countryMap = new Map<string, CountryWithProducts>();

    products.forEach((product) => {
      if (product.type === 'local' && product.countries) {
        product.countries.forEach((country: Country) => {
          if (!countryMap.has(country.code)) {
            countryMap.set(country.code, {
              code: country.code,
              name: country.name,
              nameEn: country.nameEn,
              productCount: 0,
            });
          }
          countryMap.get(country.code)!.productCount++;
        });
      }
    });

    const countries = Array.from(countryMap.values()).sort((a, b) => a.name.localeCompare(b.name, 'zh-CN'));
    return res.status(200).json({ success: true, data: countries });
  } catch (error) {
    console.error('Failed to fetch countries:', error);
    return res.status(500).json({ success: false, error: '获取国家列表失败' });
  }
}
