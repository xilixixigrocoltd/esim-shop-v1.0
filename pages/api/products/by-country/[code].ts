// force-rebuild-2026-03-22-1540 - inline cache data
import type { NextApiRequest, NextApiResponse } from 'next';

// 内联缓存数据（不依赖外部函数，避免 B2B API 调用）
const CACHED_PRODUCTS = [
  {
    id: 1,
    name: "日本 7 天 3GB 数据",
    nameEn: "Japan 7 Days 3GB Data",
    price: 4.50,
    dataSize: 3,
    validDays: 7,
    type: "local",
    countries: [{ code: "JP", name: "日本", nameEn: "Japan", flag: "🇯🇵" }],
    description: "日本 7 天 3GB 数据套餐，支持热点分享",
    descriptionEn: "Japan 7 days 3GB data plan with hotspot support",
    features: ["3GB 高速流量", "7 天有效期", "支持热点", "即买即用"],
    isHot: true,
    status: "active",
  },
  {
    id: 2,
    name: "韩国 5 天 2GB 数据",
    nameEn: "Korea 5 Days 2GB Data",
    price: 3.50,
    dataSize: 2,
    validDays: 5,
    type: "local",
    countries: [{ code: "KR", name: "韩国", nameEn: "South Korea", flag: "🇰🇷" }],
    description: "韩国 5 天 2GB 数据套餐，首尔釜山全覆盖",
    descriptionEn: "Korea 5 days 2GB data plan, Seoul and Busan coverage",
    features: ["2GB 高速流量", "5 天有效期", "支持热点", "即买即用"],
    isHot: true,
    status: "active",
  },
  {
    id: 3,
    name: "欧洲 30 天 5GB 数据",
    nameEn: "Europe 30 Days 5GB Data",
    price: 12.00,
    dataSize: 5,
    validDays: 30,
    type: "regional",
    countries: [
      { code: "FR", name: "法国", nameEn: "France", flag: "🇫🇷" },
      { code: "DE", name: "德国", nameEn: "Germany", flag: "🇩🇪" },
      { code: "IT", name: "意大利", nameEn: "Italy", flag: "🇮🇹" },
      { code: "ES", name: "西班牙", nameEn: "Spain", flag: "🇪🇸" },
      { code: "GB", name: "英国", nameEn: "United Kingdom", flag: "🇬🇧" }
    ],
    description: "欧洲 33 国通用 30 天 5GB 数据套餐",
    descriptionEn: "Europe 33 countries 30 days 5GB data plan",
    features: ["5GB 高速流量", "30 天有效期", "33 国通用", "支持热点"],
    isHot: true,
    status: "active",
  }
];

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { code } = req.query;
  const countryCode = Array.isArray(code) ? code[0] : code;
  
  if (!countryCode) {
    return res.status(400).json({ success: false, error: '国家代码不能为空' });
  }

  // 直接过滤内联缓存数据（零外部依赖）
  const filtered = CACHED_PRODUCTS.filter((p: any) => {
    if (p.type !== 'local' || !p.countries) return false;
    return p.countries.some((c: any) => c.code?.toUpperCase() === countryCode.toUpperCase());
  });

  res.setHeader('Cache-Control', 'public, s-maxage=600, stale-while-revalidate');
  return res.status(200).json({ success: true, data: filtered });
}
