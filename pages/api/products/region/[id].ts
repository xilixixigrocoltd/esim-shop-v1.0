import type { NextApiRequest, NextApiResponse } from 'next';
import { b2bApi } from '@/lib/api';

// 区域国家映射
const REGION_COUNTRIES: Record<string, string[]> = {
  asia: ['JP', 'KR', 'CN', 'HK', 'TH', 'VN', 'SG', 'MY', 'IN', 'ID', 'KH', 'LA', 'MO', 'BD', 'MM', 'PH', 'TW', 'LK', 'NP', 'PK'],
  europe: ['GB', 'FR', 'DE', 'IT', 'ES', 'PT', 'NL', 'BE', 'AT', 'CH', 'GR', 'CZ', 'PL', 'HU', 'SE', 'NO', 'DK', 'FI', 'IE', 'IS', 'HR', 'SI', 'SK', 'RO', 'BG', 'RS', 'UA', 'TR'],
  americas: ['US', 'CA', 'MX', 'BR', 'AR', 'CL', 'CO', 'PE', 'CR', 'SV', 'GT', 'PA', 'EC', 'UY', 'PY', 'BO', 'VE', 'DO', 'JM', 'TT'],
  'middle-east': ['AE', 'SA', 'IL', 'TR', 'QA', 'KW', 'BH', 'OM', 'JO', 'LB', 'IQ', 'IR', 'YE'],
  africa: ['ZA', 'EG', 'KE', 'NG', 'MA', 'TZ', 'UG', 'GH', 'ET', 'DZ', 'TN', 'ZW', 'MU', 'RE', 'SN', 'CI', 'CM', 'AO'],
  oceania: ['AU', 'NZ', 'FJ', 'PG', 'NC', 'PF', 'WS', 'TO', 'VU', 'SB'],
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { id } = req.query;
  const countries = REGION_COUNTRIES[id as string] || [];

  try {
    const allProducts = [];
    
    // 获取全部 28 页产品
    for (let page = 1; page <= 28; page++) {
      const result = await b2bApi.getProducts(page, 100);
      if (!result || !result.products) break;
      
      // 筛选区域产品
      const filtered = result.products.filter((p: any) => {
        if (p.type !== 'regional' || !p.countries) return false;
        // 检查产品覆盖的国家是否与区域有交集
        const productCountries = p.countries.map((c: any) => c.code);
        return productCountries.some((code: string) => countries.includes(code));
      });
      
      allProducts.push(...filtered);
      if (result.products.length < 100) break;
    }

    res.setHeader('Cache-Control', 'public, s-maxage=600, stale-while-revalidate');
    return res.status(200).json({ success: true, data: allProducts });
  } catch (error: any) {
    console.error('Failed to fetch regional products:', error);
    return res.status(500).json({ error: `获取区域产品失败：${error.message}` });
  }
}
