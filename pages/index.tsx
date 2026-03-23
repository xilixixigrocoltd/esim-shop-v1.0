import { GetStaticProps } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { getAllProducts, getAllCountries, Product } from '../lib/data'
import ProductCard, { getFlagEmoji } from '../components/ProductCard'
import { useI18n } from '../lib/i18n-context'

type CountryInfo = { code: string; name: string; productCount: number }

const POPULAR = [
  { code: 'JP' }, { code: 'KR' }, { code: 'TH' }, { code: 'SG' },
  { code: 'US' }, { code: 'GB' }, { code: 'FR' }, { code: 'DE' },
  { code: 'AU' }, { code: 'AE' },
]

interface Props { hotProducts: Product[]; countries: CountryInfo[] }

export default function Home({ hotProducts, countries }: Props) {
  const { t, locale } = useI18n()
  const router = useRouter()
  const [q, setQ] = useState('')
  const cMap = Object.fromEntries(countries.map(c => [c.code, c]))

  function search(e: React.FormEvent) {
    e.preventDefault()
    if (q.trim()) router.push(`/products?search=${encodeURIComponent(q.trim())}`)
  }

  const TESTIMONIALS = [
    { name: t('testimonials.1name'), loc: t('testimonials.1loc'), text: t('testimonials.1text'), stars: 5 },
    { name: t('testimonials.2name'), loc: t('testimonials.2loc'), text: t('testimonials.2text'), stars: 5 },
    { name: t('testimonials.3name'), loc: t('testimonials.3loc'), text: t('testimonials.3text'), stars: 5 },
  ]

  return (
    <>
      <Head>
        <title>SimRyoko — 全球eSIM套餐，出发前搞定 | 150+国家境外流量</title>
        <meta name="description" content="SimRyoko提供150+国家eSIM套餐，日本/韩国/泰国/美国等热门目的地，出国流量即买即用，支持USDT等加密货币支付，无需换卡，手机直接激活海外网络。" />
        <link rel="canonical" href="https://simryoko.com" />
        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://simryoko.com" />
        <meta property="og:title" content="SimRyoko - 全球eSIM，出发前搞定" />
        <meta property="og:description" content="150+国家eSIM套餐，USDT支付，即买即用。日本/韩国/泰国/美国境外流量，秒速激活，出国不换卡。" />
        <meta property="og:image" content="https://simryoko.com/og-image.jpg" />
        <meta property="og:site_name" content="SimRyoko" />
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="SimRyoko - 全球eSIM，出发前搞定" />
        <meta name="twitter:description" content="150+国家eSIM套餐，USDT支付，即买即用" />
        <meta name="twitter:image" content="https://simryoko.com/og-image.jpg" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "OnlineStore",
          "name": "SimRyoko",
          "description": "全球150+国家eSIM套餐，出国流量即买即用，支持USDT加密货币支付",
          "url": "https://simryoko.com",
          "logo": "https://simryoko.com/favicon.svg",
          "sameAs": [],
          "potentialAction": {
            "@type": "SearchAction",
            "target": "https://simryoko.com/products?search={search_term_string}",
            "query-input": "required name=search_term_string"
          }
        })}} />
      </Head>

      {/* ── HERO ── */}
      <section className="relative bg-gradient-to-br from-[#1e3a5f] via-[#1a4980] to-[#0d2d4f] text-white overflow-hidden">
        {/* Decorative blobs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4 pointer-events-none" />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 py-20 md:py-28 text-center">
          {/* Badges */}
          <div className="flex flex-wrap justify-center gap-2 mb-7">
            {[t('hero.badge1'), t('hero.badge2'), t('hero.badge3')].map(b => (
              <span key={b} className="bg-white/10 backdrop-blur border border-white/20 px-3 py-1 rounded-full text-sm font-medium">{b}</span>
            ))}
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-5 leading-tight">
            {t('hero.title')}
          </h1>
          <p className="text-lg sm:text-xl text-blue-200 mb-10 max-w-2xl mx-auto">
            {t('hero.subtitle')}
          </p>

          {/* Search */}
          <form onSubmit={search} className="flex gap-2 max-w-xl mx-auto mb-8">
            <input
              value={q} onChange={e => setQ(e.target.value)}
              placeholder={t('hero.search')}
              className="flex-1 px-5 py-4 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 text-base shadow-lg"
            />
            <button type="submit"
              className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-6 py-4 rounded-2xl transition-colors shadow-lg whitespace-nowrap">
              {t('hero.searchBtn')}
            </button>
          </form>

          {/* Quick destinations */}
          <div className="flex flex-wrap justify-center gap-2">
            {POPULAR.slice(0, 6).map(p => {
              const c = cMap[p.code]
              return c ? (
                <Link key={p.code} href={`/products?country=${p.code}`}
                  className="bg-white/10 hover:bg-white/20 border border-white/20 px-4 py-2 rounded-xl text-sm font-medium transition-colors">
                  {getFlagEmoji(p.code)} {c.name}
                </Link>
              ) : null
            })}
          </div>
        </div>
      </section>

      {/* ── TRUST BAR ── */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            {[
              { icon: '👥', title: t('trust.users'), desc: t('trust.usersDesc') },
              { icon: '⚡', title: t('trust.instant'), desc: t('trust.instantDesc') },
              { icon: '💬', title: t('trust.support'), desc: t('trust.supportDesc') },
              { icon: '💳', title: t('trust.usdt'), desc: t('trust.usdtDesc') },
            ].map(item => (
              <div key={item.title} className="flex items-center gap-3">
                <span className="text-2xl">{item.icon}</span>
                <div>
                  <div className="font-semibold text-gray-900 text-sm">{item.title}</div>
                  <div className="text-xs text-gray-400">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── POPULAR DESTINATIONS ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">{t('popular.title')}</h2>
          <Link href="/products" className="text-orange-500 text-sm font-medium hover:text-orange-600">
            {t('popular.viewAll')} →
          </Link>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-3 -mx-1 px-1" style={{ scrollbarWidth: 'none' }}>
          {POPULAR.map(p => {
            const c = cMap[p.code]
            if (!c) return null
            return (
              <Link key={p.code} href={`/products?country=${p.code}`}
                className="flex-shrink-0 bg-white border border-gray-100 hover:border-orange-300 hover:shadow-md rounded-2xl p-4 w-28 text-center transition-all group">
                <div className="text-4xl mb-2 group-hover:scale-110 transition-transform">{getFlagEmoji(p.code)}</div>
                <div className="text-xs font-semibold text-gray-900">{c.name}</div>
                <div className="text-[10px] text-gray-400 mt-1">{c.productCount} {t('common.plans')}</div>
              </Link>
            )
          })}
        </div>
      </section>

      {/* ── PLAN TYPES ── */}
      <section className="bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('planTypes.title')}</h2>
            <p className="text-gray-500">{t('planTypes.subtitle')}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { type: 'local', icon: '📍', color: 'bg-emerald-500', href: '/products', title: t('planTypes.local'), desc: t('planTypes.localDesc') },
              { type: 'regional', icon: '🌏', color: 'bg-blue-500', href: '/products?type=regional', title: t('planTypes.regional'), desc: t('planTypes.regionalDesc') },
              { type: 'global', icon: '🌍', color: 'bg-purple-500', href: '/products?type=global', title: t('planTypes.global'), desc: t('planTypes.globalDesc') },
            ].map(item => (
              <Link key={item.type} href={item.href}>
                <div className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-xl hover:border-orange-200 hover:-translate-y-1 transition-all h-full">
                  <div className={`w-14 h-14 ${item.color} rounded-2xl flex items-center justify-center text-3xl mb-5 shadow-lg`}>
                    {item.icon}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-500 text-sm mb-5">{item.desc}</p>
                  <span className="text-orange-500 text-sm font-medium">{t('planTypes.viewAll')} →</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOT PRODUCTS ── */}
      {hotProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">🔥 {t('hotPlans.title')}</h2>
            <Link href="/products" className="text-orange-500 text-sm font-medium hover:text-orange-600">{t('hotPlans.viewAll')} →</Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {hotProducts.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}

      {/* ── HOW IT WORKS ── */}
      <section className="bg-[#1e3a5f] text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16 text-center">
          <h2 className="text-2xl font-bold mb-2">{t('howItWorks.title')}</h2>
          <p className="text-blue-300 mb-12">{t('howItWorks.subtitle')}</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connector line (desktop) */}
            <div className="hidden md:block absolute top-10 left-1/6 right-1/6 h-0.5 bg-orange-500/30 z-0" />
            {[
              { n: '01', icon: '🔍', title: t('howItWorks.step1Title'), desc: t('howItWorks.step1Desc') },
              { n: '02', icon: '📲', title: t('howItWorks.step2Title'), desc: t('howItWorks.step2Desc') },
              { n: '03', icon: '🌐', title: t('howItWorks.step3Title'), desc: t('howItWorks.step3Desc') },
            ].map(s => (
              <div key={s.n} className="relative z-10">
                <div className="w-20 h-20 bg-orange-500 rounded-3xl flex flex-col items-center justify-center mx-auto mb-5 shadow-xl">
                  <span className="text-3xl">{s.icon}</span>
                </div>
                <div className="text-orange-400 text-xs font-bold mb-1">{s.n}</div>
                <h4 className="font-bold text-lg mb-2">{s.title}</h4>
                <p className="text-blue-300 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
          <p className="text-blue-400 text-xs mt-10">{t('howItWorks.devices')}</p>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('testimonials.title')}</h2>
          <p className="text-gray-500">{t('testimonials.subtitle')}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((rev, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-1 mb-4">
                {'★★★★★'.split('').map((s, j) => <span key={j} className="text-orange-400">{s}</span>)}
              </div>
              <p className="text-gray-700 text-sm leading-relaxed mb-5 italic">"{rev.text}"</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {rev.name[0]}
                </div>
                <div>
                  <div className="font-semibold text-sm text-gray-900">{rev.name}</div>
                  <div className="text-xs text-gray-400">{rev.loc}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('faq.title')}</h2>
            <p className="text-gray-500">{t('faq.subtitle')}</p>
          </div>
          <div className="space-y-3">
            {[1,2,3,4,5].map(n => (
              <details key={n} className="bg-white rounded-2xl border border-gray-100 group overflow-hidden">
                <summary className="flex items-center justify-between px-6 py-4 cursor-pointer font-semibold text-gray-900 select-none list-none">
                  {t(`faq.q${n}`)}
                  <svg className="w-5 h-5 text-gray-400 group-open:rotate-180 transition-transform flex-shrink-0 ml-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="px-6 pb-5 text-gray-600 text-sm leading-relaxed border-t border-gray-50 pt-3">
                  {t(`faq.a${n}`)}
                </div>
              </details>
            ))}
          </div>
          <div className="text-center mt-8">
            <p className="text-gray-500 text-sm mb-3">{t('faq.more')}</p>
            <a href="https://t.me/simryoko" target="_blank" rel="noopener"
              className="inline-flex items-center gap-2 bg-orange-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-orange-600 transition-colors">
              💬 {t('faq.contact')}
            </a>
          </div>
        </div>
      </section>
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const all = getAllProducts()
  const popularCodes = ['JP', 'KR', 'TH', 'SG', 'US', 'GB']
  const hot: Product[] = []
  for (const code of popularCodes) {
    const p = all.find(x => x.type === 'local' && x.countries[0]?.code === code && x.dataSize === 5120)
      || all.find(x => x.type === 'local' && x.countries[0]?.code === code)
    if (p) hot.push(p)
    if (hot.length >= 6) break
  }
  return {
    props: { hotProducts: JSON.parse(JSON.stringify(hot)), countries: JSON.parse(JSON.stringify(getAllCountries())) },
    revalidate: 3600,
  }
}
