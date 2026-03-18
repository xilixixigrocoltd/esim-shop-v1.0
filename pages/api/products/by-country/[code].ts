import type { NextApiRequest, NextApiResponse } from 'next';
import { b2bApi } from '@/lib/api';
import type { Product } from '@/types';

// 内存缓存（Vercel 函数实例级别）
const cache = new Map<string, { data: Product[]; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 分钟

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { code } = req.query;
  if (!code || typeof code !== 'string') {
    return res.status(400).json({ error: 'Country code required' });
  }

  const cacheKey = code.toLowerCase();
  
  // 检查缓存
  const cached = cache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    console.log(`[by-country] 缓存命中：${code}`);
    return res.status(200).json({ success: true, data: cached.data });
  }

  try {
    console.log(`[by-country] 请求国家：${code}`);
    const products = await b2bApi.getProductsByCountry(code);
    console.log(`[by-country] 找到产品数：${products.length}`);
    
    // 写入缓存
    cache.set(cacheKey, { data: products, timestamp: Date.now() });
    
    res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600');
    
    return res.status(200).json({ success: true, data: products });
  } catch (error: any) {
    console.error('Failed to fetch products by country:', error?.message || error);
    return res.status(500).json({ success: false, error: `获取产品失败：${error?.message || '未知错误'}` });
  }
}
