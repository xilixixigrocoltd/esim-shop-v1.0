#!/usr/bin/env node
/**
 * sync-products.js
 *
 * Fetches all products from the B2B API and updates products.json cache.
 * Can be triggered via Vercel Cron or run manually: node scripts/sync-products.js
 *
 * Usage:
 *   node scripts/sync-products.js
 *   node scripts/sync-products.js --dry-run   # Print stats without writing
 */

const fs = require('fs');
const path = require('path');

const B2B_API_URL = process.env.B2B_API_URL || 'https://ciuh32wky.xigrocoltd.com';
const B2B_USERNAME = process.env.B2B_USERNAME || 'lx001';
const B2B_PASSWORD = process.env.B2B_PASSWORD || '123123';
const DRY_RUN = process.argv.includes('--dry-run');

const OUTPUT_FILE = path.join(__dirname, '../pages/api/products/by-country/products.json');

// ─── Country name map ─────────────────────────────────────────────────────────
const COUNTRY_NAMES = {
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
  DO: '多米尼加', HT: '海地', CU: '古巴', PR: '波多黎各',
  XK: '科索沃', GG: '根西', JE: '泽西', IM: '马恩岛',
  FO: '法罗群岛', GL: '格陵兰', KY: '开曼群岛', BM: '百慕大',
  TC: '特克斯', AW: '阿鲁巴', CW: '库拉索',
  SN: '塞内加尔', CI: '科特迪瓦', CM: '喀麦隆', GA: '加蓬',
  CD: '刚果(金)', CG: '刚果(布)', CF: '中非', TD: '乍得',
  ML: '马里', BF: '布基纳法索', GN: '几内亚',
  LR: '利比里亚', SL: '塞拉利昂', GM: '冈比亚', MW: '马拉维',
  BJ: '贝宁', TG: '多哥', BW: '博茨瓦纳', SZ: '斯威士兰',
  SD: '苏丹', MR: '毛里塔尼亚',
};

function getCountryName(code) {
  return COUNTRY_NAMES[code] || code;
}

function isValidCountryCode(code) {
  return (
    typeof code === 'string' &&
    code.length === 2 &&
    !code.includes('-') &&
    /^[A-Z]{2}$/.test(code.toUpperCase())
  );
}

function normalizeProduct(p) {
  const countries = (p.countries || [])
    .map(c => {
      const code = (c.code || c.countryCode || '').toUpperCase();
      return { code, name: c.name || c.cn || getCountryName(code) };
    })
    .filter(c => isValidCountryCode(c.code));

  const type = p.type || (countries.length > 1 ? 'regional' : 'local');

  return {
    id: p.id,
    name: p.name || p.nameZh || '',
    nameEn: p.nameEn || p.name || '',
    type,
    countries,
    dataSize: Number(p.dataSize ?? p.data_size ?? 0),
    validDays: Number(p.validDays ?? p.valid_days ?? p.validityDays ?? 0),
    price: String(parseFloat(String(p.price ?? p.retailPrice ?? 0)).toFixed(2)),
    isHot: Boolean(p.isHot ?? p.is_hot ?? false),
    features: Array.isArray(p.features) ? p.features : [],
    status: p.status || 'active',
  };
}

async function login() {
  console.log('🔑 Logging in to B2B API…');
  const res = await fetch(`${B2B_API_URL}/api/agent/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: B2B_USERNAME, password: B2B_PASSWORD }),
  });
  if (!res.ok) throw new Error(`Login failed: HTTP ${res.status}`);
  const data = await res.json();
  if (!data.success || !data.data?.token) throw new Error('Login failed: ' + JSON.stringify(data));
  console.log('✅ Login successful');
  return data.data.token;
}

async function fetchPage(token, page) {
  const res = await fetch(`${B2B_API_URL}/api/products?limit=200&page=${page}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(`Page ${page} fetch failed: HTTP ${res.status}`);
  return res.json();
}

async function syncProducts() {
  console.log(`\n🚀 Starting product sync (${DRY_RUN ? 'DRY RUN' : 'LIVE'})\n`);

  const token = await login();
  const all = [];

  // Fetch page 1 to get total pages
  const firstData = await fetchPage(token, 1);
  const rawFirst = firstData.data || {};
  const productsFirst = Object.values(rawFirst);
  all.push(...productsFirst);

  const pagination = firstData.pagination || firstData.meta || {};
  const totalPages = Number(pagination.pages || pagination.totalPages || pagination.last_page || 1);
  console.log(`📄 Total pages: ${totalPages} (first page: ${productsFirst.length} products)`);

  for (let page = 2; page <= Math.min(totalPages, 40); page++) {
    process.stdout.write(`\r  Fetching page ${page}/${totalPages}…`);
    const data = await fetchPage(token, page);
    const raw = data.data || {};
    const products = Object.values(raw);
    if (!products.length) break;
    all.push(...products);
    await new Promise(r => setTimeout(r, 150)); // rate limit
  }
  console.log(`\n\n📦 Total raw products: ${all.length}`);

  // Normalize and filter
  const normalized = all
    .map(normalizeProduct)
    .filter(p => p.status !== 'inactive' && p.countries.length > 0);

  console.log(`✅ Valid products after filter: ${normalized.length}`);

  // Organize into by-country structure
  const local = {};
  const regional = [];
  const global = [];

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

  const output = {
    local,
    regional,
    global,
    updatedAt: new Date().toISOString(),
  };

  const localCountries = Object.keys(local).length;
  const totalProducts = Object.values(local).reduce((s, a) => s + a.length, 0) + regional.length + global.length;
  console.log(`\n📊 Summary:`);
  console.log(`   Local: ${totalProducts - regional.length - global.length} products across ${localCountries} countries`);
  console.log(`   Regional: ${regional.length} products`);
  console.log(`   Global: ${global.length} products`);
  console.log(`   Total: ${totalProducts} products`);

  if (DRY_RUN) {
    console.log('\n🔍 Dry run — no files written.');
    return;
  }

  // Write to file
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(output, null, 2), 'utf-8');
  console.log(`\n💾 Saved to ${OUTPUT_FILE}`);
  console.log(`✨ Sync complete!\n`);
}

syncProducts().catch(err => {
  console.error('\n❌ Sync failed:', err.message);
  process.exit(1);
});
