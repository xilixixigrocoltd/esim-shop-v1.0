import fs from 'fs'
import path from 'path'

export type Product = {
  id: string | number
  name: string
  nameEn?: string
  type: string
  countries: { code: string; name: string }[]
  dataSize: number
  validDays: number
  price: number
  isHot?: boolean
  features?: string[]
}

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
  SN: '塞内加尔', CI: '科特迪瓦', CM: '喀麦隆', GA: '加蓬', CD: '刚果(金)',
  CG: '刚果(布)', CF: '中非', TD: '乍得', ML: '马里', BF: '布基纳法索',
  GN: '几内亚', GW: '几内亚比绍', LR: '利比里亚', SL: '塞拉利昂',
  GM: '冈比亚', MW: '马拉维', BJ: '贝宁', TG: '多哥', BW: '博茨瓦纳',
  SZ: '斯威士兰', SD: '苏丹', MR: '毛里塔尼亚',
  AU: '澳大利亚', NZ: '新西兰', FJ: '斐济', PG: '巴布亚新几内亚',
  WS: '萨摩亚', TO: '汤加', VU: '瓦努阿图', NR: '瑙鲁',
  BR: '巴西', AR: '阿根廷', CL: '智利', CO: '哥伦比亚', PE: '秘鲁',
  VE: '委内瑞拉', EC: '厄瓜多尔', BO: '玻利维亚', UY: '乌拉圭',
  PY: '巴拉圭', SR: '苏里南', GY: '圭亚那', GF: '法属圭亚那',
  CR: '哥斯达黎加', PA: '巴拿马', GT: '危地马拉', HN: '洪都拉斯',
  SV: '萨尔瓦多', NI: '尼加拉瓜', BZ: '伯利兹', JM: '牙买加',
  TT: '特立尼达和多巴哥', BB: '巴巴多斯', LC: '圣卢西亚',
  VC: '圣文森特', KN: '圣基茨', AG: '安提瓜', DM: '多米尼克',
  GD: '格林纳达', HT: '海地', DO: '多米尼加', CU: '古巴',
  PR: '波多黎各', USPR: '波多黎各', BM: '百慕大', KY: '开曼群岛',
  TC: '特克斯和凯科斯', AW: '阿鲁巴', CW: '库拉索', BQ: '博内尔',
  SX: '圣马丁岛(荷)', MF: '圣马丁岛(法)', BL: '圣巴泰勒米',
  GP: '瓜德罗普', MQ: '马提尼克', MS: '蒙特塞拉特',
  VG: '英属维尔京群岛', AI: '安圭拉',
  PF: '法属波利尼西亚', RE: '留尼汪', YT: '马约特',
  XK: '科索沃', GG: '根西', JE: '泽西', IM: '马恩岛',
  FO: '法罗群岛', GL: '格陵兰',
}

function getCountryName(code: string): string {
  return COUNTRY_NAMES[code] || code
}

let _cache: { local: Record<string, Product[]>; regional: Product[]; global: Product[] } | null = null

function loadData() {
  if (_cache) return _cache
  const filePath = path.join(process.cwd(), 'pages/api/products/by-country/products.json')
  const raw = JSON.parse(fs.readFileSync(filePath, 'utf-8'))

  const local: Record<string, Product[]> = {}
  for (const [code, items] of Object.entries(raw.local as Record<string, any[]>)) {
    // 过滤掉非标准国家代码（地区/省级代码如 GP-MG, GB-SCT）
    if (code.length !== 2 || code.includes('-')) continue
    local[code] = items.map(normalizeProduct)
  }
  const regional: Product[] = (raw.regional as any[]).map(normalizeProduct)
  const global: Product[] = (raw.global as any[]).map(normalizeProduct)

  _cache = { local, regional, global }
  return _cache
}

function normalizeProduct(p: any): Product {
  // Extract operator name from nameEn (e.g. "Moshi Moshi - 1 GB - 7 days" → "Moshi Moshi")
  let operatorName: string | undefined
  if (p.nameEn && typeof p.nameEn === 'string') {
    const parts = p.nameEn.split(' - ')
    if (parts.length >= 2) {
      operatorName = parts[0].trim()
    }
  }
  return {
    id: p.id,
    name: p.name,
    nameEn: operatorName,
    type: p.type,
    countries: (p.countries || []).map((c: any) => ({ code: c.code, name: getCountryName(c.code) })),
    dataSize: p.dataSize ?? 0,
    validDays: p.validDays ?? 0,
    price: parseFloat(p.price) || 0,
    isHot: p.isHot ?? false,
    features: p.features,
  }
}

export function getAllProducts(): Product[] {
  const data = loadData()
  return [...Object.values(data.local).flat(), ...data.regional, ...data.global]
}

export function getProductsByCountry(code: string) {
  const data = loadData()
  return {
    local: data.local[code] || [],
    regional: data.regional.filter(p => p.countries.some(c => c.code === code)),
    global: data.global.filter(p => p.countries.some(c => c.code === code)),
  }
}

export function getProductById(id: string | number): Product | null {
  return getAllProducts().find(p => String(p.id) === String(id)) || null
}

export function searchProducts(query: string): Product[] {
  if (!query.trim()) return []
  const q = query.toLowerCase()
  return getAllProducts().filter(p =>
    p.name.toLowerCase().includes(q) ||
    p.countries.some(c => c.name.toLowerCase().includes(q) || c.code.toLowerCase().includes(q))
  )
}

export function getAllCountries(): { code: string; name: string; productCount: number }[] {
  const data = loadData()
  return Object.entries(data.local).map(([code, products]) => ({
    code,
    name: getCountryName(code),
    productCount: products.length,
  }))
}
