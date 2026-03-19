// 生成 sitemap.xml 的脚本
// 运行：node scripts/generate-sitemap.js

const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://esim-shop-v1.vercel.app';

// 静态页面
const staticPages = [
  { path: '/', priority: '1.0', changefreq: 'daily' },
  { path: '/products', priority: '0.9', changefreq: 'daily' },
  { path: '/countries', priority: '0.9', changefreq: 'weekly' },
  { path: '/help', priority: '0.7', changefreq: 'monthly' },
  { path: '/cart', priority: '0.3', changefreq: 'monthly' },
  { path: '/checkout', priority: '0.3', changefreq: 'monthly' },
  { path: '/success', priority: '0.1', changefreq: 'monthly' },
];

// 生成 sitemap XML
function generateSitemap() {
  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;

  const today = new Date().toISOString().split('T')[0];

  // 添加静态页面
  staticPages.forEach(page => {
    xml += `  <url>
    <loc>${BASE_URL}${page.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>
`;
  });

  // 注意：国家页和产品页需要动态生成
  // 这里只添加示例，实际需要通过 API 获取完整列表
  // 建议：使用 Vercel Edge Function 或 GitHub Actions 定期生成完整 sitemap

  xml += `  <!-- 国家页面示例（完整列表需通过 API 生成） -->
  <url>
    <loc>${BASE_URL}/country/jp</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${BASE_URL}/country/us</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${BASE_URL}/country/kr</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${BASE_URL}/country/gb</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${BASE_URL}/country/fr</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
`;

  xml += `  <!-- 产品页面示例（2720 个产品，建议分批生成） -->
  <url>
    <loc>${BASE_URL}/product/1</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
`;

  xml += `  <!-- 注意：完整 sitemap 包含 123 个国家页 + 2720 个产品页 -->
  <!-- 建议使用自动化脚本定期更新 -->
`;

  xml += `</urlset>
`;

  return xml;
}

// 写入文件
const sitemapPath = path.join(__dirname, '..', 'public', 'sitemap.xml');
const sitemap = generateSitemap();
fs.writeFileSync(sitemapPath, sitemap, 'utf-8');

console.log('✅ sitemap.xml 生成成功！');
console.log(`📍 文件位置：${sitemapPath}`);
console.log(`📊 包含：7 个静态页面 + 5 个国家示例 + 1 个产品示例`);
console.log(`💡 提示：完整 sitemap 需通过 API 获取所有产品和国家后生成`);
