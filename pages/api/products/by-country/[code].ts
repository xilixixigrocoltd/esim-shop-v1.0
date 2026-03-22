// 2026-03-22 17:30 - 按类型分类：本地/区域/全球
import type { NextApiRequest, NextApiResponse } from 'next';
import productsData from './products.json';

// 转换 B2B API 字段到前端期望的格式
function normalizeProduct(p: any): any {
  return {
    ...p,
    validDays: p.validityDays || p.validDays,
    dataSize: p.dataSize || 0,
    features: p.features || [],
    nameEn: p.nameEn || p.name,
    description: p.description || '',
    image: p.image || p.imageUrl || '',
  };
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const code = (req.query.code as string)?.toUpperCase();
  if (!code) return res.status(400).json({ success: false, message: '缺少国家代码' });

  const data = productsData as any;
  
  // 本地套餐（仅该国家）
  const localProducts = (data.local[code] || []).map(normalizeProduct);
  
  // 区域套餐（包含该国家的）
  const regionalProducts = data.regional
    .filter((p: any) => p.countries.some((c: any) => c.code === code))
    .map(normalizeProduct);
  
  // 全球套餐（全部显示）
  const globalProducts = data.global.map(normalizeProduct);

  return res.status(200).json({
    success: true,
    data: {
      local: localProducts,
      regional: regionalProducts,
      global: globalProducts
    },
    total: localProducts.length + regionalProducts.length + globalProducts.length,
    countryCode: code,
    stats: {
      local: localProducts.length,
      regional: regionalProducts.length,
      global: globalProducts.length
    }
  });
}
