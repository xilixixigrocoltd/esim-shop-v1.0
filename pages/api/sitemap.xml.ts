import type { NextApiRequest, NextApiResponse } from 'next'
import { getAllProducts, getAllCountries } from '../../lib/data'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const BASE = 'https://simryoko.com'
  const today = new Date().toISOString().split('T')[0]

  const staticPages = [
    { url: `${BASE}/`, priority: '1.0', changefreq: 'daily' },
    { url: `${BASE}/products`, priority: '0.9', changefreq: 'daily' },
    { url: `${BASE}/countries`, priority: '0.9', changefreq: 'weekly' },
    { url: `${BASE}/help`, priority: '0.8', changefreq: 'monthly' },
    { url: `${BASE}/blog`, priority: '0.8', changefreq: 'weekly' },
  ]

  const products = getAllProducts()
  const productPages = products.map(p => ({
    url: `${BASE}/product/${p.id}`,
    priority: p.isHot ? '0.8' : '0.6',
    changefreq: 'monthly',
  }))

  const countries = getAllCountries()
  const countryPages = countries.map(c => ({
    url: `${BASE}/country/${c.code.toLowerCase()}`,
    priority: '0.7',
    changefreq: 'weekly',
  }))

  const allUrls = [...staticPages, ...countryPages, ...productPages]

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls.map(u => `  <url>
    <loc>${u.url}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join('\n')}
</urlset>`

  res.setHeader('Content-Type', 'application/xml; charset=utf-8')
  res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate')
  res.status(200).send(xml)
}
