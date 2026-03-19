// 产品数据缓存（当 B2B API 不可用时使用）
// 最后更新：2026-03-19

import type { Product } from '@/types';

// 热门产品（手动精选）
export const POPULAR_PRODUCTS: Product[] = [
  {
    id: 1,
    name: "日本 7 天 3GB 数据",
    price: 4.50,
    originalPrice: 5.00,
    currency: "USD",
    dataAmount: "3GB",
    validityDays: 7,
    type: "local",
    countries: [{ code: "JP", name: "日本", flag: "🇯🇵" }],
    planType: "data-only",
    coverage: "Japan",
    description: "日本 7 天 3GB 数据套餐，支持热点分享",
    features: ["3GB 高速流量", "7 天有效期", "支持热点", "即买即用"],
    image: "/images/products/japan-7d-3gb.jpg",
    inStock: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 2,
    name: "韩国 5 天 2GB 数据",
    price: 3.50,
    originalPrice: 4.00,
    currency: "USD",
    dataAmount: "2GB",
    validityDays: 5,
    type: "local",
    countries: [{ code: "KR", name: "韩国", flag: "🇰🇷" }],
    planType: "data-only",
    coverage: "South Korea",
    description: "韩国 5 天 2GB 数据套餐，首尔釜山全覆盖",
    features: ["2GB 高速流量", "5 天有效期", "支持热点", "即买即用"],
    image: "/images/products/korea-5d-2gb.jpg",
    inStock: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 3,
    name: "欧洲 30 天 5GB 数据",
    price: 12.00,
    originalPrice: 15.00,
    currency: "USD",
    dataAmount: "5GB",
    validityDays: 30,
    type: "regional",
    countries: [
      { code: "FR", name: "法国", flag: "🇫🇷" },
      { code: "DE", name: "德国", flag: "🇩🇪" },
      { code: "IT", name: "意大利", flag: "🇮🇹" },
      { code: "ES", name: "西班牙", flag: "🇪🇸" },
      { code: "GB", name: "英国", flag: "🇬🇧" }
    ],
    planType: "data-only",
    coverage: "33 个欧洲国家",
    description: "欧洲 33 国通用 30 天 5GB 数据套餐",
    features: ["5GB 高速流量", "30 天有效期", "33 国通用", "支持热点"],
    image: "/images/products/europe-30d-5gb.jpg",
    inStock: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// 获取缓存产品（带降级）
export async function getCachedProducts(): Promise<Product[]> {
  // 优先尝试从 B2B API 获取
  try {
    const res = await fetch(`${process.env.B2B_API_URL}/api/v1/products?limit=100`, {
      headers: {
        'x-api-key': process.env.API_KEY || '',
        'Content-Type': 'application/json',
      },
      // 5 秒超时
      signal: AbortSignal.timeout(5000)
    });
    
    if (res.ok) {
      const data = await res.json();
      if (data.success && data.message?.products) {
        return data.message.products;
      }
    }
  } catch (error) {
    console.log('[Products] B2B API 不可用，使用缓存数据');
  }
  
  // 降级：返回缓存的热门产品
  return POPULAR_PRODUCTS;
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
