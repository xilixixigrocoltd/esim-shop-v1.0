// 生成完整 sitemap.xml 的脚本（静态版本）
// 运行：node scripts/generate-full-sitemap.js

const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://esim-shop-v1.vercel.app';
const today = new Date().toISOString().split('T')[0];

let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;

// 1. 静态页面
const staticPages = [
  { path: '/', priority: '1.0', changefreq: 'daily' },
  { path: '/products', priority: '0.9', changefreq: 'daily' },
  { path: '/countries', priority: '0.9', changefreq: 'weekly' },
  { path: '/help', priority: '0.7', changefreq: 'monthly' },
];

staticPages.forEach(page => {
  xml += `  <url>
    <loc>${BASE_URL}${page.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>
`;
});

// 2. 123 个国家（基于实际数据）
const countries = [
  'jp', 'kr', 'us', 'gb', 'fr', 'de', 'it', 'es', 'th', 'vn',
  'sg', 'my', 'au', 'ca', 'nl', 'hk', 'mo', 'tw', 'in', 'id',
  'ph', 'ae', 'sa', 'tr', 'eg', 'za', 'br', 'mx', 'ar', 'cl',
  'nz', 'fj', 'ch', 'at', 'be', 'pt', 'gr', 'cz', 'pl', 'hu',
  'se', 'no', 'dk', 'fi', 'ie', 'is', 'ru', 'ua', 'ro', 'bg',
  'hr', 'si', 'sk', 'lt', 'lv', 'ee', 'cy', 'mt', 'lu', 'li',
  'mc', 'sm', 'va', 'ad', 'gi', 'im', 'je', 'gg', 'fo', 'gl',
  'ax', 'pm', 'wf', 'tf', 'bv', 'gs', 'hm', 'ck', 'nu', 'tk',
  'to', 'tv', 'vu', 'ws', 'ki', 'nr', 'pw', 'fm', 'mh', 'mp',
  'gu', 'as', 'vi', 'pr', 'ai', 'ag', 'aw', 'bs', 'bb', 'bz',
  'bm', 'bo', 'bq', 'vg', 'ky', 'cr', 'cu', 'cw', 'dm', 'do',
  'ec', 'sv', 'gd', 'gp', 'gt', 'gy', 'ht', 'hn', 'jm', 'mq',
  'ms', 'ni', 'pa', 'py', 'pe', 'bl', 'kn', 'lc', 'mf', 'vc',
  'sx', 'tt', 'tc', 'uy', 've', 'aq', 'pf', 'nc', 'pg', 'sb',
  'tl', 'bn', 'kh', 'la', 'mm', 'bd', 'pk', 'lk', 'mv', 'np',
  'bt', 'af', 'ir', 'iq', 'jo', 'kw', 'lb', 'om', 'qa', 'sy',
  'ye', 'il', 'ps', 'bh', 'dz', 'ao', 'bj', 'bw', 'bf', 'bi',
  'cv', 'cm', 'cf', 'td', 'km', 'cg', 'cd', 'ci', 'dj', 'gq',
  'er', 'sz', 'et', 'ga', 'gm', 'gh', 'gn', 'gw', 'ke', 'ls',
  'lr', 'ly', 'mg', 'mw', 'ml', 'mr', 'mu', 'yt', 'ma', 'mz',
  'na', 'ne', 'ng', 're', 'rw', 'sh', 'st', 'sn', 'sc', 'sl',
  'so', 'ss', 'sd', 'tz', 'tg', 'tn', 'ug', 'eh', 'zm', 'zw'
];

console.log(`🌍 添加 ${countries.length} 个国家页面...`);
countries.forEach(code => {
  xml += `  <url>
    <loc>${BASE_URL}/country/${code}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
`;
});

// 3. 产品页面（2720 个产品，ID 从 1 到 2720）
console.log('📦 添加 2720 个产品页面...');
for (let i = 1; i <= 2720; i++) {
  xml += `  <url>
    <loc>${BASE_URL}/product/${i}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
`;
}

xml += `</urlset>
`;

// 写入文件
const sitemapPath = path.join(__dirname, '..', 'public', 'sitemap.xml');
fs.writeFileSync(sitemapPath, xml, 'utf-8');

const lines = xml.split('\n').length;
const urls = (xml.match(/<url>/g) || []).length;
const fileSize = (xml.length / 1024 / 1024).toFixed(2);

console.log('\n✅ sitemap.xml 生成成功！');
console.log(`📍 文件位置：${sitemapPath}`);
console.log(`📊 包含 URL 数量：${urls} 个`);
console.log(`📄 文件大小：${fileSize} MB`);
console.log(`📝 XML 行数：${lines} 行`);
console.log('\n💡 下一步：提交到 Google Search Console');
