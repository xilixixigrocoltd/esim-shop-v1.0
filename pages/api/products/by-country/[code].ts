// 2026-03-22 16:45 - 恢复 B2B API 调用，支持全部 2720 个产品
import type { NextApiRequest, NextApiResponse } from 'next';
import crypto from 'crypto';

const API_KEY = process.env.B2B_API_KEY!;
const API_SECRET = process.env.B2B_API_SECRET!;
const BASE_URL = process.env.B2B_API_URL || 'https://ciuh32wky.xigrocoltd.com/api';

function generateSignature(method: string, endpoint: string, body: string, timestamp: number, nonce: string): string {
  const payload = `${method}${endpoint}${body}${timestamp}${nonce}`;
  return crypto.createHmac('sha256', API_SECRET).update(payload).digest('hex');
}

async function fetchB2BProducts(): Promise<any[]> {
  const timestamp = Date.now();
  const nonce = crypto.randomBytes(16).toString('hex');
  const endpoint = '/v1/products';
  const signature = generateSignature('GET', endpoint, '', timestamp, nonce);

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method: 'GET',
    headers: {
      'X-API-KEY': API_KEY,
      'X-TIMESTAMP': timestamp.toString(),
      'X-NONCE': nonce,
      'X-SIGNATURE': signature,
      'User-Agent': 'Mozilla/5.0',
    },
  });

  if (!res.ok) {
    throw new Error(`B2B API request failed: ${res.status} - ${res.statusText}`);
  }

  const data = await res.json();
  return data.data?.products || [];
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const code = (req.query.code as string)?.toUpperCase();
    
    if (!code) {
      return res.status(400).json({ success: false, message: '缺少国家代码' });
    }

    // 从 B2B API 获取全部产品
    const allProducts = await fetchB2BProducts();
    
    // 按国家代码筛选产品
    const filtered = allProducts.filter((p: any) => {
      if (!p.countries || !Array.isArray(p.countries)) return false;
      return p.countries.some((c: any) => c.code?.toUpperCase() === code);
    });

    return res.status(200).json({ 
      success: true, 
      data: filtered,
      total: filtered.length,
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
