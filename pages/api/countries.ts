import type { NextApiRequest, NextApiResponse } from 'next';
import { b2bApi } from '@/lib/api';
import type { Product, Country } from '@/types';
import { getCachedProducts } from '@/lib/products-cache';

interface CountryWithProducts {
  code: string;
  name: string;
  nameEn: string;
  productCount: number;
}

// 预定义国家列表（降级用）
const FALLBACK_COUNTRIES: CountryWithProducts[] = [
  { code: 'JP', name: '日本', nameEn: 'Japan', productCount: 150 },
  { code: 'KR', name: '韩国', nameEn: 'South Korea', productCount: 120 },
  { code: 'US', name: '美国', nameEn: 'United States', productCount: 200 },
  { code: 'GB', name: '英国', nameEn: 'United Kingdom', productCount: 100 },
  { code: 'FR', name: '法国', nameEn: 'France', productCount: 80 },
  { code: 'DE', name: '德国', nameEn: 'Germany', productCount: 90 },
  { code: 'IT', name: '意大利', nameEn: 'Italy', productCount: 75 },
  { code: 'ES', name: '西班牙', nameEn: 'Spain', productCount: 70 },
  { code: 'AU', name: '澳大利亚', nameEn: 'Australia', productCount: 85 },
  { code: 'TH', name: '泰国', nameEn: 'Thailand', productCount: 95 },
  { code: 'SG', name: '新加坡', nameEn: 'Singapore', productCount: 60 },
  { code: 'CN', name: '中国', nameEn: 'China', productCount: 50 },
];

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    let allProducts: Product[] = [];
    
    // 尝试从 B2B API 获取
    try {
      for (let page = 1; page <= 28; page++) {
        const result = await b2bApi.getProducts(page, 100);
        if (!result || !result.products) break;
        allProducts.push(...result.products);
        if (result.products.length < 100) break;
      }
    } catch (b2bError: any) {
      console.warn('[Countries API] B2B API 失败，使用降级数据:', b2bError.message);
      // 降级：返回预定义国家列表
      res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate');
      return res.status(200).json({ 
        success: true, 
        data: FALLBACK_COUNTRIES,
        warning: 'B2B API 不可用，显示降级数据'
      });
    }
    


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
