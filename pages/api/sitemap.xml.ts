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
    // Country landing pages
    { url: `${BASE}/japan-esim`, priority: '0.9', changefreq: 'weekly' },
    { url: `${BASE}/korea-esim`, priority: '0.9', changefreq: 'weekly' },
    { url: `${BASE}/thailand-esim`, priority: '0.9', changefreq: 'weekly' },
    { url: `${BASE}/singapore-esim`, priority: '0.9', changefreq: 'weekly' },
    { url: `${BASE}/usa-esim`, priority: '0.9', changefreq: 'weekly' },
    { url: `${BASE}/uk-esim`, priority: '0.9', changefreq: 'weekly' },
    { url: `${BASE}/europe-esim`, priority: '0.9', changefreq: 'weekly' },
    { url: `${BASE}/australia-esim`, priority: '0.9', changefreq: 'weekly' },
    { url: `${BASE}/hong-kong-esim`, priority: '0.9', changefreq: 'weekly' },
    { url: `${BASE}/taiwan-esim`, priority: '0.9', changefreq: 'weekly' },
    { url: `${BASE}/vietnam-esim`, priority: '0.9', changefreq: 'weekly' },
    { url: `${BASE}/malaysia-esim`, priority: '0.9', changefreq: 'weekly' },
    // Blog posts
    { url: `${BASE}/blog/what-is-esim`, priority: '0.8', changefreq: 'monthly' },
    { url: `${BASE}/blog/esim-vs-sim-card`, priority: '0.8', changefreq: 'monthly' },
    { url: `${BASE}/blog/how-to-use-esim`, priority: '0.8', changefreq: 'monthly' },
    { url: `${BASE}/blog/best-esim-japan-2026`, priority: '0.8', changefreq: 'monthly' },
    { url: `${BASE}/blog/japan`, priority: '0.8', changefreq: 'monthly' },
    { url: `${BASE}/blog/korea`, priority: '0.8', changefreq: 'monthly' },
    { url: `${BASE}/blog/europe`, priority: '0.8', changefreq: 'monthly' },
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
