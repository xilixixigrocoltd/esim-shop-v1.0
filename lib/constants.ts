export const SITE_CONFIG = {
  name: "SimRyoko",
  description: "全球eSIM，即时连接",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://simryoko.com",
  email: "xilixi@xigrocoltd.com",
  telegram: "https://t.me/Simryokoesimbot",
};

export const POPULAR_COUNTRIES = [
  { code: "CN", name: "中国", nameEn: "China", flag: "🇨🇳" },
  { code: "JP", name: "日本", nameEn: "Japan", flag: "🇯🇵" },
  { code: "KR", name: "韩国", nameEn: "Korea", flag: "🇰🇷" },
  { code: "TH", name: "泰国", nameEn: "Thailand", flag: "🇹🇭" },
  { code: "US", name: "美国", nameEn: "United States", flag: "🇺🇸" },
  { code: "GB", name: "英国", nameEn: "United Kingdom", flag: "🇬🇧" },
];

export const REGIONS = [
  { id: "asia", name: "亚洲", countries: ["CN", "JP", "KR", "TH", "SG", "MY", "ID", "PH", "VN", "HK", "TW", "MO"] },
  { id: "europe", name: "欧洲", countries: ["GB", "DE", "FR", "IT", "ES", "NL", "CH", "AT", "BE", "DK", "SE", "NO", "FI", "PL", "CZ", "HU", "GR", "PT", "IE"] },
  { id: "americas", name: "美洲", countries: ["US", "CA", "MX", "BR", "AR", "CL", "CO", "PE"] },
  { id: "oceania", name: "大洋洲", countries: ["AU", "NZ", "FJ"] },
  { id: "mea", name: "中东非洲", countries: ["AE", "SA", "QA", "ZA", "EG", "TR"] },
];

export const PRODUCT_TYPE_LABELS: Record<string, string> = {
  local: "本地套餐",
  regional: "区域套餐",
  global: "全球套餐",
};

export const DATA_SIZE_OPTIONS = [
  { value: "all", label: "全部" },
  { value: "1", label: "1GB" },
  { value: "3", label: "3GB" },
  { value: "5", label: "5GB" },
  { value: "10", label: "10GB" },
  { value: "20", label: "20GB+" },
];

export const VALID_DAYS_OPTIONS = [
  { value: "all", label: "全部" },
  { value: "3", label: "3天" },
  { value: "7", label: "7天" },
  { value: "15", label: "15天" },
  { value: "30", label: "30天" },
  { value: "365", label: "365天" },
];
