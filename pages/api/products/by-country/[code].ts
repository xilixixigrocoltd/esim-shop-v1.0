// 2026-03-22 17:15 - 使用 B2B API 缓存数据（1000 个产品，210 国家）
import type { NextApiRequest, NextApiResponse } from 'next';
import productsData from './products.json';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const code = (req.query.code as string)?.toUpperCase();
    
    if (!code) {
      return res.status(400).json({ success: false, message: '缺少国家代码' });
    }

    // 从缓存数据获取产品
    const products = (productsData as any)[code] || [];

    return res.status(200).json({ 
      success: true, 
      data: products,
      total: products.length,
      countryCode: code,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('by-country API error:', error);
    return res.status(500).json({ 
      success: false, 
      message: `获取产品失败：${error.message}`,
      code: 500
    });
  }
}
