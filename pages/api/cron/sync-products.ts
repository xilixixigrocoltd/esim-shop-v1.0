/**
 * /api/cron/sync-products
 *
 * Vercel Cron endpoint to refresh the product cache by calling the B2B API.
 * Schedule: every 6 hours (see vercel.json crons config)
 *
 * Can also be called manually:
 *   curl -X POST https://simryoko.com/api/cron/sync-products \
 *     -H "Authorization: Bearer <CRON_SECRET>"
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

const CRON_SECRET = process.env.CRON_SECRET || '';

interface Country {
  code: string;
  name: string;
}

interface Product {
  id: number | string;
  name: string;
  nameEn: string;
  type: string;
  countries: Country[];
  dataSize: number;
  validDays: number;
  price: string;
  isHot: boolean;
  features: string[];
  status: string;
}

const COUNTRY_NAMES: Record<string, string> = {
  JP: '日本', KR: '韩国', CN: '中国', HK: '香港', TW: '台湾', MO: '澳门',
  SG: '新加坡', TH: '泰国', VN: '越南', MY: '马来西亚', ID: '印度尼西亚',
  PH: '菲律宾', IN: '印度', US: '美国', CA: '加拿大', GB: '英国', FR: '法国',
  DE: '德国', IT: '意大利', ES: '西班牙', AU: '澳大利亚', NZ: '新西兰',
  AE: '阿联酋', SA: '沙特阿拉伯', JP2: '日本',
};

function getCountryName(code: string): string {
  return COUNTRY_NAMES[code] || code;
}

function isValidCode(code: string): boolean {
  return typeof code === 'string' && code.length === 2 && !code.includes('-') && /^[A-Z]{2}$/.test(code.toUpperCase());
}

function normalizeProduct(p: any): Product {
  const countries: Country[] = (p.countries || [])
    .map((c: any) => {
      const code = (c.code || c.countryCode || '').toUpperCase();
      return { code, name: c.name || c.cn || getCountryName(code) };
    })
    .filter((c: Country) => isValidCode(c.code));

  return {
    id: p.id,
    name: p.name || p.nameZh || '',
    nameEn: p.nameEn || p.name || '',
    type: p.type || (countries.length > 1 ? 'regional' : 'local'),
    countries,
    dataSize: Number(p.dataSize ?? 0),
    validDays: Number(p.validDays ?? p.validityDays ?? 0),
    price: String(parseFloat(String(p.price ?? 0)).toFixed(2)),
    isHot: Boolean(p.isHot ?? false),
    features: Array.isArray(p.features) ? p.features : [],
    status: p.status || 'active',
  };
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Allow GET (Vercel Cron) or POST (manual trigger)
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Verify auth (Vercel sends Authorization header for cron jobs)
  const authHeader = req.headers.authorization;
  if (CRON_SECRET && authHeader !== `Bearer ${CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const startTime = Date.now();

  try {
    const base = process.env.B2B_API_URL || 'https://ciuh32wky.xigrocoltd.com';

    // Login
    const loginRes = await fetch(`${base}/api/agent/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: process.env.B2B_USERNAME || 'lx001',
        password: process.env.B2B_PASSWORD || '123123',
      }),
    });
    const loginData = await loginRes.json();
    if (!loginData.success || !loginData.data?.token) {
      throw new Error('Login failed: ' + JSON.stringify(loginData).slice(0, 100));
    }
    const token = loginData.data.token as string;

    // Fetch all products
    const allRaw: any[] = [];
    let page = 1;
    let totalPages = 1;

    do {
      const pRes = await fetch(`${base}/api/products?limit=200&page=${page}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!pRes.ok) break;
      const pData = await pRes.json();
      const raw = pData.data || {};
      const items = Object.values(raw) as any[];
      if (!items.length) break;
      allRaw.push(...items);

      const pagination = pData.pagination || pData.meta || {};
      totalPages = Number(pagination.pages || pagination.totalPages || 1);
      page++;

      if (page <= totalPages) await new Promise(r => setTimeout(r, 100));
    } while (page <= Math.min(totalPages, 40));

    // Normalize and organize
    const normalized = allRaw
      .map(normalizeProduct)
      .filter((p: Product) => p.status !== 'inactive' && p.countries.length > 0);

    const local: Record<string, Product[]> = {};
    const regional: Product[] = [];
    const global: Product[] = [];

    for (const p of normalized) {
      if (p.type === 'local') {
        const code = p.countries[0]?.code;
        if (code) {
          if (!local[code]) local[code] = [];
          local[code].push(p);
        }
      } else if (p.type === 'regional') {
        regional.push(p);
      } else {
        global.push(p);
      }
    }

    const output = { local, regional, global, updatedAt: new Date().toISOString() };

    // Write to products.json
    const outputFile = path.join(process.cwd(), 'pages/api/products/by-country/products.json');
    fs.writeFileSync(outputFile, JSON.stringify(output), 'utf-8');

    const elapsed = Date.now() - startTime;
    const totalCount = normalized.length;

    return res.status(200).json({
      success: true,
      total: totalCount,
      local: Object.keys(local).length + ' countries',
      regional: regional.length,
      global: global.length,
      elapsed: `${elapsed}ms`,
      updatedAt: output.updatedAt,
    });
  } catch (err: any) {
    console.error('[cron/sync-products] Error:', err.message);
    return res.status(500).json({
      success: false,
      error: err.message,
      elapsed: `${Date.now() - startTime}ms`,
    });
  }
}
