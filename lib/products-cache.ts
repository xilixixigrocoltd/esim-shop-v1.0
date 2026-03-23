/**
 * products-cache.ts
 *
 * Priority:
 *   1. In-memory live cache (from B2B API, TTL = 5 min)
 *   2. Static JSON fallback (products.json on disk)
 *
 * Token is cached for 25 days (JWT valid for ~30 days).
 */

import type { Product } from '@/types';

// ─── Static JSON fallback ────────────────────────────────────────────────────
import productsData from '../pages/api/products/by-country/products.json';

function getAllProductsFromStaticCache(): Product[] {
  const data = productsData as any;
  const localProducts = Object.values(data.local || {}).flat() as Product[];
  const regionalProducts = Array.isArray(data.regional) ? (data.regional as Product[]) : [];
  const globalProducts = Array.isArray(data.global) ? (data.global as Product[]) : [];
  return [...localProducts, ...regionalProducts, ...globalProducts];
}

// ─── JWT token cache ─────────────────────────────────────────────────────────
let _token: string | null = null;
let _tokenExpiry = 0;

async function getToken(): Promise<string> {
  if (_token && Date.now() < _tokenExpiry - 5 * 60_000) return _token;

  const res = await fetch(
    `${process.env.B2B_API_URL || 'https://ciuh32wky.xigrocoltd.com'}/api/agent/login`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: process.env.B2B_USERNAME || 'lx001',
        password: process.env.B2B_PASSWORD || '123123',
      }),
      // Abort after 8 s to avoid serverless cold-start timeout
      signal: AbortSignal.timeout ? AbortSignal.timeout(8_000) : undefined,
    }
  );

  if (!res.ok) throw new Error(`Login failed: ${res.status}`);
  const data = await res.json();
  if (!data.success || !data.data?.token) {
    throw new Error('Login response missing token: ' + JSON.stringify(data).slice(0, 120));
  }

  _token = data.data.token as string;
  _tokenExpiry = Date.now() + 25 * 24 * 60 * 60_000; // 25 days
  return _token;
}

// ─── Country name map (Chinese) ──────────────────────────────────────────────
const COUNTRY_NAMES: Record<string, string> = {
  JP: '日本', KR: '韩国', CN: '中国', HK: '香港', TW: '台湾', MO: '澳门',
  SG: '新加坡', TH: '泰国', VN: '越南', MY: '马来西亚', ID: '印度尼西亚',
  PH: '菲律宾', IN: '印度', PK: '巴基斯坦', BD: '孟加拉国', LK: '斯里兰卡',
  NP: '尼泊尔', KH: '柬埔寨', LA: '老挝', MM: '缅甸', BN: '文莱',
  TL: '东帝汶', AF: '阿富汗', MN: '蒙古',
  US: '美国', CA: '加拿大', MX: '墨西哥', GB: '英国', FR: '法国',
  DE: '德国', IT: '意大利', ES: '西班牙', PT: '葡萄牙', NL: '荷兰',
  BE: '比利时', CH: '瑞士', AT: '奥地利', SE: '瑞典', NO: '挪威',
  DK: '丹麦', FI: '芬兰', PL: '波兰', CZ: '捷克', HU: '匈牙利',
  RO: '罗马尼亚', BG: '保加利亚', GR: '希腊', TR: '土耳其', UA: '乌克兰',
  RU: '俄罗斯', BY: '白俄罗斯', RS: '塞尔维亚', HR: '克罗地亚',
  SK: '斯洛伐克', SI: '斯洛文尼亚', LT: '立陶宛', LV: '拉脱维亚',
  EE: '爱沙尼亚', IE: '爱尔兰', IS: '冰岛', MT: '马耳他', CY: '塞浦路斯',
  LU: '卢森堡', AL: '阿尔巴尼亚', MK: '北马其顿', ME: '黑山', BA: '波黑',
  AD: '安道尔', SM: '圣马力诺', LI: '列支敦士登', MC: '摩纳哥',
  GI: '直布罗陀', GE: '格鲁吉亚', AM: '亚美尼亚', AZ: '阿塞拜疆',
  KZ: '哈萨克斯坦', UZ: '乌兹别克斯坦', KG: '吉尔吉斯斯坦', TJ: '塔吉克斯坦',
  AE: '阿联酋', SA: '沙特阿拉伯', QA: '卡塔尔', KW: '科威特',
  BH: '巴林', OM: '阿曼', IL: '以色列', JO: '约旦', IQ: '伊拉克',
  LB: '黎巴嫩', SY: '叙利亚', YE: '也门', IR: '伊朗', PS: '巴勒斯坦',
  EG: '埃及', MA: '摩洛哥', TN: '突尼斯', DZ: '阿尔及利亚', LY: '利比亚',
  ZA: '南非', NG: '尼日利亚', KE: '肯尼亚', GH: '加纳', ET: '埃塞俄比亚',
  TZ: '坦桑尼亚', UG: '乌干达', RW: '卢旺达', ZM: '赞比亚', ZW: '津巴布韦',
  MG: '马达加斯加', MU: '毛里求斯', SC: '塞舌尔', CV: '佛得角',
  AU: '澳大利亚', NZ: '新西兰', FJ: '斐济', PG: '巴布亚新几内亚',
  WS: '萨摩亚', TO: '汤加', VU: '瓦努阿图', NR: '瑙鲁',
  BR: '巴西', AR: '阿根廷', CL: '智利', CO: '哥伦比亚', PE: '秘鲁',
  VE: '委内瑞拉', EC: '厄瓜多尔', BO: '玻利维亚', UY: '乌拉圭',
  PY: '巴拉圭', CR: '哥斯达黎加', PA: '巴拿马', GT: '危地马拉',
  HN: '洪都拉斯', SV: '萨尔瓦多', NI: '尼加拉瓜', BZ: '伯利兹',
  JM: '牙买加', TT: '特立尼达和多巴哥', BB: '巴巴多斯',
  XK: '科索沃', GG: '根西', JE: '泽西', IM: '马恩岛',
  FO: '法罗群岛', GL: '格陵兰', KY: '开曼群岛', BM: '百慕大',
};

function getCountryName(code: string): string {
  return COUNTRY_NAMES[code] || code;
}

function normalizeB2BProduct(p: any): Product {
  // Filter invalid country codes (must be exactly 2 alpha chars, no '-')
  const countries = (p.countries || [])
    .map((c: any) => {
      const code = (c.code || c.countryCode || '').toUpperCase();
      return { code, name: c.name || c.cn || getCountryName(code) };
    })
    .filter((c: { code: string }) => c.code.length === 2 && !c.code.includes('-') && /^[A-Z]{2}$/.test(c.code));

  const type = (p.type || (countries.length > 1 ? 'regional' : 'local')) as 'local' | 'regional' | 'global';

  return {
    id: p.id,
    name: p.name || p.nameZh || '',
    nameEn: p.nameEn || p.name || '',
    description: p.description,
    type,
    countries,
    dataSize: Number(p.dataSize ?? p.data_size ?? 0),
    validDays: Number(p.validDays ?? p.valid_days ?? p.validityDays ?? 0),
    price: parseFloat(String(p.price ?? p.retailPrice ?? 0)),
    isHot: Boolean(p.isHot ?? p.is_hot ?? false),
    features: Array.isArray(p.features) ? p.features : [],
    status: p.status || 'active',
  };
}

// ─── Live products cache ──────────────────────────────────────────────────────
let _liveCache: Product[] | null = null;
let _liveCacheAt = 0;
const LIVE_TTL_MS = 5 * 60_000; // 5 minutes

async function fetchLiveProducts(): Promise<Product[]> {
  const token = await getToken();
  const base = process.env.B2B_API_URL || 'https://ciuh32wky.xigrocoltd.com';
  const all: Product[] = [];
  let page = 1;

  // First request to get total pages
  const firstRes = await fetch(`${base}/api/products?limit=200&page=1`, {
    headers: { Authorization: `Bearer ${token}` },
    signal: AbortSignal.timeout ? AbortSignal.timeout(15_000) : undefined,
  });
  if (!firstRes.ok) throw new Error(`Products fetch failed: ${firstRes.status}`);
  const firstData = await firstRes.json();

  const rawFirst = firstData.data || {};
  const productsFirst = Object.values(rawFirst) as any[];
  all.push(...productsFirst.map(normalizeB2BProduct));

  const pagination = firstData.pagination || firstData.meta || {};
  const totalPages = Number(pagination.pages || pagination.totalPages || pagination.last_page || 1);

  // Fetch remaining pages (up to 40 to be safe)
  for (page = 2; page <= Math.min(totalPages, 40); page++) {
    const res = await fetch(`${base}/api/products?limit=200&page=${page}`, {
      headers: { Authorization: `Bearer ${token}` },
      signal: AbortSignal.timeout ? AbortSignal.timeout(15_000) : undefined,
    });
    if (!res.ok) break;
    const data = await res.json();
    const raw = data.data || {};
    const products = Object.values(raw) as any[];
    if (!products.length) break;
    all.push(...products.map(normalizeB2BProduct));
    // Small delay to avoid hammering the API
    await new Promise(r => setTimeout(r, 100));
  }

  // Filter out inactive and products with no valid countries
  return all.filter(p => p.status !== 'inactive' && p.countries.length > 0);
}

export async function getCachedProducts(): Promise<Product[]> {
  // Return live cache if still fresh
  if (_liveCache && Date.now() - _liveCacheAt < LIVE_TTL_MS) {
    return _liveCache;
  }

  // Try to fetch live data
  try {
    const live = await fetchLiveProducts();
    if (live.length > 0) {
      _liveCache = live;
      _liveCacheAt = Date.now();
      console.log(`[products-cache] Live: ${live.length} products fetched`);
      return live;
    }
  } catch (err: any) {
    console.warn('[products-cache] Live fetch failed, using static cache:', err.message);
  }

  // Fallback: static JSON
  return getAllProductsFromStaticCache();
}

export function getCachedProductsByCountry(code: string): {
  local: Product[];
  regional: Product[];
  global: Product[];
  source?: string;
} {
  // Sync version using live cache if available, otherwise static
  const all = _liveCache && Date.now() - _liveCacheAt < LIVE_TTL_MS
    ? _liveCache
    : getAllProductsFromStaticCache();

  const upper = code.toUpperCase();
  return {
    local: all.filter(p => p.type === 'local' && p.countries?.some((c: any) => c.code?.toUpperCase() === upper)),
    regional: all.filter(p => p.type === 'regional' && p.countries?.some((c: any) => c.code?.toUpperCase() === upper)),
    global: all.filter(p => p.type === 'global'),
  };
}

export async function getCachedProductsByCountryAsync(code: string): Promise<{
  local: Product[];
  regional: Product[];
  global: Product[];
  source: string;
}> {
  const all = await getCachedProducts();
  const upper = code.toUpperCase();
  const isLive = _liveCache !== null && Date.now() - _liveCacheAt < LIVE_TTL_MS;
  return {
    local: all.filter(p => p.type === 'local' && p.countries?.some((c: any) => c.code?.toUpperCase() === upper)),
    regional: all.filter(p => p.type === 'regional' && p.countries?.some((c: any) => c.code?.toUpperCase() === upper)),
    global: all.filter(p => p.type === 'global'),
    source: isLive ? 'live' : 'cache',
  };
}

export function getCachedProduct(id: number | string): Product | undefined {
  const all = _liveCache && Date.now() - _liveCacheAt < LIVE_TTL_MS
    ? _liveCache
    : getAllProductsFromStaticCache();
  return all.find(p => String(p.id) === String(id));
}
