// 2026-03-22 17:00 - 静态数据版本（B2B API 500 错误，临时方案）
import type { NextApiRequest, NextApiResponse } from 'next';

// 模拟 2720 个产品的数据结构 - 按国家分类
const PRODUCTS_BY_COUNTRY: Record<string, any[]> = {
  JP: [
    { id: 1, name: "日本 3GB/7 天", price: 4.50, type: "local", dataSize: "3GB", validityDays: 7, countries: [{ code: "JP", cn: "日本" }] },
    { id: 2, name: "日本 5GB/15 天", price: 7.00, type: "local", dataSize: "5GB", validityDays: 15, countries: [{ code: "JP", cn: "日本" }] },
    { id: 3, name: "日本 10GB/30 天", price: 12.00, type: "local", dataSize: "10GB", validityDays: 30, countries: [{ code: "JP", cn: "日本" }] },
    { id: 4, name: "日本 20GB/30 天", price: 20.00, type: "local", dataSize: "20GB", validityDays: 30, countries: [{ code: "JP", cn: "日本" }] },
  ],
  KR: [
    { id: 5, name: "韩国 2GB/5 天", price: 3.50, type: "local", dataSize: "2GB", validityDays: 5, countries: [{ code: "KR", cn: "韩国" }] },
    { id: 6, name: "韩国 5GB/10 天", price: 6.00, type: "local", dataSize: "5GB", validityDays: 10, countries: [{ code: "KR", cn: "韩国" }] },
    { id: 7, name: "韩国 10GB/30 天", price: 10.00, type: "local", dataSize: "10GB", validityDays: 30, countries: [{ code: "KR", cn: "韩国" }] },
  ],
  DE: [
    { id: 8, name: "欧洲 33 国 5GB/30 天", price: 12.00, type: "regional", dataSize: "5GB", validityDays: 30, countries: [{ code: "DE" }, { code: "FR" }, { code: "GB" }, { code: "IT" }, { code: "ES" }] },
    { id: 9, name: "欧洲 33 国 10GB/30 天", price: 18.00, type: "regional", dataSize: "10GB", validityDays: 30, countries: [{ code: "DE" }, { code: "FR" }, { code: "GB" }] },
    { id: 10, name: "欧洲 33 国 20GB/30 天", price: 30.00, type: "regional", dataSize: "20GB", validityDays: 30, countries: [{ code: "DE" }] },
  ],
  US: [
    { id: 11, name: "美国 5GB/15 天", price: 8.00, type: "local", dataSize: "5GB", validityDays: 15, countries: [{ code: "US" }] },
    { id: 12, name: "美国 10GB/30 天", price: 15.00, type: "local", dataSize: "10GB", validityDays: 30, countries: [{ code: "US" }] },
    { id: 13, name: "美国 20GB/30 天", price: 25.00, type: "local", dataSize: "20GB", validityDays: 30, countries: [{ code: "US" }] },
  ],
  TH: [
    { id: 14, name: "泰国 5GB/15 天", price: 6.00, type: "local", dataSize: "5GB", validityDays: 15, countries: [{ code: "TH" }] },
    { id: 15, name: "泰国 10GB/30 天", price: 10.00, type: "local", dataSize: "10GB", validityDays: 30, countries: [{ code: "TH" }] },
  ],
  GB: [
    { id: 16, name: "英国 5GB/30 天", price: 10.00, type: "local", dataSize: "5GB", validityDays: 30, countries: [{ code: "GB" }] },
    { id: 17, name: "英国 10GB/30 天", price: 16.00, type: "local", dataSize: "10GB", validityDays: 30, countries: [{ code: "GB" }] },
  ],
  FR: [
    { id: 18, name: "法国 5GB/30 天", price: 10.00, type: "local", dataSize: "5GB", validityDays: 30, countries: [{ code: "FR" }] },
  ],
  IT: [
    { id: 19, name: "意大利 5GB/30 天", price: 10.00, type: "local", dataSize: "5GB", validityDays: 30, countries: [{ code: "IT" }] },
  ],
  ES: [
    { id: 20, name: "西班牙 5GB/30 天", price: 10.00, type: "local", dataSize: "5GB", validityDays: 30, countries: [{ code: "ES" }] },
  ],
  CN: [
    { id: 21, name: "中国 3GB/7 天", price: 5.00, type: "local", dataSize: "3GB", validityDays: 7, countries: [{ code: "CN" }] },
    { id: 22, name: "中国 5GB/15 天", price: 8.00, type: "local", dataSize: "5GB", validityDays: 15, countries: [{ code: "CN" }] },
    { id: 23, name: "中国 10GB/30 天", price: 14.00, type: "local", dataSize: "10GB", validityDays: 30, countries: [{ code: "CN" }] },
  ],
  AU: [
    { id: 24, name: "澳大利亚 5GB/30 天", price: 12.00, type: "local", dataSize: "5GB", validityDays: 30, countries: [{ code: "AU" }] },
  ],
  SG: [
    { id: 25, name: "新加坡 5GB/15 天", price: 8.00, type: "local", dataSize: "5GB", validityDays: 15, countries: [{ code: "SG" }] },
  ],
  MY: [
    { id: 26, name: "马来西亚 5GB/15 天", price: 7.00, type: "local", dataSize: "5GB", validityDays: 15, countries: [{ code: "MY" }] },
  ],
  ID: [
    { id: 27, name: "印度尼西亚 5GB/15 天", price: 7.00, type: "local", dataSize: "5GB", validityDays: 15, countries: [{ code: "ID" }] },
  ],
  PH: [
    { id: 28, name: "菲律宾 5GB/15 天", price: 7.00, type: "local", dataSize: "5GB", validityDays: 15, countries: [{ code: "PH" }] },
  ],
  VN: [
    { id: 29, name: "越南 5GB/15 天", price: 7.00, type: "local", dataSize: "5GB", validityDays: 15, countries: [{ code: "VN" }] },
  ],
  IN: [
    { id: 30, name: "印度 5GB/15 天", price: 6.00, type: "local", dataSize: "5GB", validityDays: 15, countries: [{ code: "IN" }] },
  ],
  AE: [
    { id: 31, name: "阿联酋 5GB/15 天", price: 9.00, type: "local", dataSize: "5GB", validityDays: 15, countries: [{ code: "AE" }] },
  ],
  GLOBAL: [
    { id: 32, name: "全球 157 国 1GB/7 天", price: 5.00, type: "global", dataSize: "1GB", validityDays: 7, countries: [{ code: "GLOBAL" }] },
    { id: 33, name: "全球 157 国 3GB/30 天", price: 12.00, type: "global", dataSize: "3GB", validityDays: 30, countries: [{ code: "GLOBAL" }] },
    { id: 34, name: "全球 157 国 5GB/30 天", price: 18.00, type: "global", dataSize: "5GB", validityDays: 30, countries: [{ code: "GLOBAL" }] },
    { id: 35, name: "全球 198 国 10GB/30 天", price: 28.00, type: "global", dataSize: "10GB", validityDays: 30, countries: [{ code: "GLOBAL" }] },
  ],
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const code = (req.query.code as string)?.toUpperCase();
    
    if (!code) {
      return res.status(400).json({ success: false, message: '缺少国家代码' });
    }

    // 获取对应国家的产品
    const products = PRODUCTS_BY_COUNTRY[code] || [];

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
