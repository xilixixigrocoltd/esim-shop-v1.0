// 产品数据缓存（当 B2B API 不可用时使用）
// 最后更新：2026-03-22

import type { Product } from '@/types';
import productsData from '../pages/api/products/by-country/products.json';

// 从缓存文件提取所有产品（合并 local + regional + global）
function getAllProductsFromCache(): Product[] {
  const data = productsData as any;
  // local 是对象：{JP: [...], KR: [...]}，需要展开
  const localProducts = Object.values(data.local || {}).flat();
  // regional 和 global 是数组
  const regionalProducts = Array.isArray(data.regional) ? data.regional : [];
  const globalProducts = Array.isArray(data.global) ? data.global : [];
  return [...localProducts, ...regionalProducts, ...globalProducts];
}

// 热门产品（用于默认展示）
export const POPULAR_PRODUCTS: Product[] = [
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

// 获取缓存产品（返回完整产品列表）
export async function getCachedProducts(): Promise<Product[]> {
  // 直接从缓存文件读取所有产品
  return getAllProductsFromCache();
}

// 获取单个产品
export function getCachedProduct(id: number): Product | undefined {
  return POPULAR_PRODUCTS.find(p => p.id === id);
}

// 按国家获取产品
export function getProductsByCountry(countryCode: string): Product[] {
  return POPULAR_PRODUCTS.filter(p => 
    p.countries?.some(c => c.code.toLowerCase() === countryCode.toLowerCase())
  );
}
