'use client';
import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'
import { Search, ChevronLeft, Wifi, Phone } from 'lucide-react'
import { getAllProducts, getAllCountries, Product } from '../lib/data'
import ProductCard, { getFlagEmoji } from '../components/ProductCard'
import { useI18n } from '../lib/i18n-context'
import { GetStaticProps } from 'next'

// 七大洲
const CONTINENTS = [
  { id: 'asia',      icon: '🌏', zh: '亚洲',  en: 'Asia',       codes: ['JP','KR','CN','HK','TW','MO','SG','TH','VN','MY','ID','PH','IN','PK','BD','LK','NP','KH','LA','MM','BN','AF','MN','AZ','AM','GE','KZ','UZ','KG','TJ','TL'] },
  { id: 'europe',    icon: '🇪🇺', zh: '欧洲',  en: 'Europe',     codes: ['GB','FR','DE','IT','ES','PT','NL','BE','CH','AT','SE','NO','DK','FI','PL','CZ','HU','RO','BG','GR','TR','UA','RU','RS','HR','SK','SI','LT','LV','EE','IE','IS','MT','CY','LU','AL','MK','ME','BA'] },
  { id: 'americas',  icon: '🌎', zh: '美洲',  en: 'Americas',   codes: ['US','CA','MX','BR','AR','CL','CO','PE','VE','EC','BO','UY','PY','CR','PA','GT','HN','SV','NI','BZ','JM','TT','DO'] },
  { id: 'mideast',   icon: '🕌', zh: '中东',  en: 'Middle East', codes: ['AE','SA','QA','KW','BH','OM','IL','JO','IQ','LB'] },
  { id: 'africa',    icon: '🌍', zh: '非洲',  en: 'Africa',     codes: ['ZA','NG','KE','GH','EG','TZ','UG','RW','MA','TN','DZ'] },
  { id: 'oceania',   icon: '🏝️', zh: '大洋洲', en: 'Oceania',   codes: ['AU','NZ','FJ','PG'] },
]

// 热门国家
const POPULAR_COUNTRIES = [
  { code: 'JP', name: '日本' }, { code: 'KR', name: '韩国' }, { code: 'TH', name: '泰国' },
  { code: 'SG', name: '新加坡' }, { code: 'US', name: '美国' }, { code: 'GB', name: '英国' },
  { code: 'AU', name: '澳大利亚' }, { code: 'DE', name: '德国' }, { code: 'FR', name: '法国' },
  { code: 'IT', name: '意大利' }, { code: 'MY', name: '马来西亚' }, { code: 'VN', name: '越南' },
  { code: 'ID', name: '印尼' }, { code: 'PH', name: '菲律宾' }, { code: 'HK', name: '香港' },
  { code: 'TW', name: '台湾' }, { code: 'AE', name: '阿联酋' }, { code: 'TR', name: '土耳其' },
]

function hasVoice(product: Product): boolean {
  return product.features?.some((f: string) =>
    f.toLowerCase().includes('voice') || f.toLowerCase().includes('call') ||
    f.includes('语音') || f.includes('通话') || f.includes('电话')
  ) || false
}

type Tab = 'popular' | 'all' | 'regional' | 'global'

interface Props {
  allProducts: Product[]
  countries: { code: string; name: string; productCount: number }[]
}

export default function ProductsPage({ allProducts, countries }: Props) {
  const { t, locale } = useI18n()
  const router = useRouter()

  const [tab, setTab] = useState<Tab>('popular')
  const [search, setSearch] = useState('')
  const [selectedContinent, setSelectedContinent] = useState<string | null>(null)
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null)
  const [globalType, setGlobalType] = useState<'data' | 'voice'>('data')

  useEffect(() => {
    const { tab: t, country, search: s } = router.query
    if (t) setTab(t as Tab)
    if (country) { setTab('popular'); setSelectedCountry(country as string) }
    if (s) setSearch(s as string)
  }, [router.query])

  const countryMap = useMemo(() => Object.fromEntries(countries.map(c => [c.code, c])), [countries])

  // 当前显示的产品
  const displayProducts = useMemo(() => {
    let list: Product[] = []

    if (search.trim()) {
      const q = search.toLowerCase()
      return allProducts.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.countries.some(c => (c.name || '').toLowerCase().includes(q) || c.code.toLowerCase().includes(q))
      )
    }

    if (tab === 'all') {
      list = allProducts
    } else if (tab === 'popular') {
      if (selectedCountry) {
        list = allProducts.filter(p => p.countries.some(c => c.code === selectedCountry))
      } else {
        list = []
      }
    } else if (tab === 'regional') {
      list = allProducts.filter(p => p.type === 'regional')
      if (selectedContinent) {
        const codes = CONTINENTS.find(c => c.id === selectedContinent)?.codes || []
        list = list.filter(p => p.countries.some(c => codes.includes(c.code)))
      }
    } else if (tab === 'global') {
      list = allProducts.filter(p => p.type === 'global')
      if (globalType === 'data') {
        list = list.filter(p => !hasVoice(p))
      } else {
        list = list.filter(p => hasVoice(p))
      }
    }

    return [...list].sort((a, b) => parseFloat(String(a.price)) - parseFloat(String(b.price)))
  }, [allProducts, tab, search, selectedCountry, selectedContinent, globalType])

  const tabs = [
    { id: 'popular', label: locale === 'zh' ? '热门国家' : locale === 'ja' ? '人気の国' : locale === 'ko' ? '인기 국가' : 'Popular' },
    { id: 'all', label: locale === 'zh' ? '全部' : locale === 'ja' ? 'すべて' : locale === 'ko' ? '전체' : 'All' },
    { id: 'regional', label: locale === 'zh' ? '区域' : locale === 'ja' ? '地域' : locale === 'ko' ? '지역' : 'Regional' },
    { id: 'global', label: locale === 'zh' ? '全球' : locale === 'ja' ? 'グローバル' : locale === 'ko' ? '글로벌' : 'Global' },
  ]

  return (
    <>
      <Head>
        <title>{locale === 'zh' ? '全球eSIM套餐' : locale === 'ja' ? 'グローバルeSIMプラン' : locale === 'ko' ? '글로벌 eSIM 요금제' : 'Global eSIM Plans'} - SimRyoko</title>
      </Head>
      <div className="min-h-screen bg-gray-50">
        {/* 搜索 + Tab 导航 */}
        <div className="sticky top-0 z-40 bg-white border-b border-gray-100 shadow-sm">
          <div className="max-w-5xl mx-auto px-4 py-3">
            {/* 搜索框 */}
            <div className="relative mb-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                value={search}
                onChange={e => { setSearch(e.target.value); setSelectedCountry(null); setSelectedContinent(null) }}
                placeholder={locale === 'zh' ? '搜索国家或套餐...' : locale === 'ja' ? '国やプランを検索...' : locale === 'ko' ? '국가 또는 요금제 검색...' : 'Search country or plan...'}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 text-sm"
              />
            </div>
            {/* 热门搜索词 */}
            {!search && (
              <div className="flex flex-wrap gap-1.5 mb-2">
                <span className="text-xs text-gray-400 self-center mr-1">Popular:</span>
                {[
                  { label: 'Japan 🇯🇵', country: 'JP' },
                  { label: 'Thailand 🇹🇭', country: 'TH' },
                  { label: 'Korea 🇰🇷', country: 'KR' },
                  { label: 'USA 🇺🇸', country: 'US' },
                  { label: 'Europe 🇪🇺', type: 'regional', continent: 'europe' },
                  { label: 'Global 🌐', type: 'global' },
                ].map(tag => (
                  <button
                    key={tag.label}
                    onClick={() => {
                      if (tag.type === 'global') { setTab('global'); setSelectedCountry(null); setSelectedContinent(null); setSearch('') }
                      else if (tag.type === 'regional' && tag.continent) { setTab('regional'); setSelectedContinent(tag.continent); setSelectedCountry(null); setSearch('') }
                      else if (tag.country) { setTab('popular'); setSelectedCountry(tag.country); setSelectedContinent(null); setSearch('') }
                    }}
                    className="text-xs bg-orange-50 text-orange-600 border border-orange-200 px-2.5 py-1 rounded-full hover:bg-orange-100 transition-colors font-medium"
                  >
                    {tag.label}
                  </button>
                ))}
              </div>
            )}
            {/* Tab */}
            <div className="flex gap-2 overflow-x-auto pb-0.5 scrollbar-hide">
              {tabs.map(t => (
                <button key={t.id} onClick={() => { setTab(t.id as Tab); setSelectedCountry(null); setSelectedContinent(null); setSearch('') }}
                  className={`flex-shrink-0 px-5 py-2 rounded-full text-sm font-medium transition-all ${tab === t.id ? 'bg-orange-500 text-white shadow' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                  {t.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 py-5">

          {/* 搜索结果 */}
          {search.trim() && (
            <div>
              <p className="text-sm text-gray-500 mb-4">{locale === 'zh' ? `找到 ${displayProducts.length} 个结果` : `${displayProducts.length} results`}</p>
              {(() => {
                const minPrice = Math.min(...displayProducts.map(p => p.price))
                return (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {displayProducts.map(p => <ProductCard key={p.id} product={p} isLowestPrice={p.price === minPrice} />)}
                  </div>
                )
              })()}
              {displayProducts.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-5xl mb-4">🔍</div>
                  <p className="text-gray-500 font-medium mb-2">{locale === 'zh' ? '没有找到相关套餐' : 'No plans found'}</p>
                  <p className="text-gray-400 text-sm mb-6">{locale === 'zh' ? '试试其他关键词或浏览全部套餐' : 'Try different keywords or browse all plans'}</p>
                  <p className="text-sm font-semibold text-gray-600 mb-3">🌟 Try these popular destinations</p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {[
                      { label: 'Japan 🇯🇵', country: 'JP' },
                      { label: 'Thailand 🇹🇭', country: 'TH' },
                      { label: 'Korea 🇰🇷', country: 'KR' },
                      { label: 'USA 🇺🇸', country: 'US' },
                      { label: 'Singapore 🇸🇬', country: 'SG' },
                    ].map(dest => (
                      <button key={dest.country} onClick={() => { setSearch(''); setTab('popular'); setSelectedCountry(dest.country) }}
                        className="bg-orange-50 text-orange-600 border border-orange-200 px-4 py-2 rounded-full text-sm font-medium hover:bg-orange-100 transition-colors">
                        {dest.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 热门国家 tab */}
          {!search && tab === 'popular' && (
            <div>
              {!selectedCountry ? (
                <>
                  <h2 className="text-base font-semibold text-gray-700 mb-4">
                    {locale === 'zh' ? '🔥 选择目的地' : locale === 'ja' ? '🔥 目的地を選択' : locale === 'ko' ? '🔥 목적지 선택' : '🔥 Choose Destination'}
                  </h2>
                  <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3">
                    {POPULAR_COUNTRIES.map(c => (
                      <button key={c.code} onClick={() => setSelectedCountry(c.code)}
                        className="flex flex-col items-center gap-1.5 p-3 bg-white rounded-2xl border border-gray-200 hover:border-orange-400 hover:shadow-md transition-all">
                        <span className="text-3xl">{getFlagEmoji(c.code)}</span>
                        <span className="text-xs font-medium text-gray-700 text-center leading-tight">{c.name}</span>
                      </button>
                    ))}
                  </div>
                </>
              ) : (
                <>
                  <button onClick={() => setSelectedCountry(null)} className="flex items-center gap-1 text-orange-500 mb-4 hover:text-orange-600 text-sm font-medium">
                    <ChevronLeft className="w-4 h-4" />
                    {locale === 'zh' ? '返回国家列表' : 'Back'}
                  </button>
                  <div className="flex items-center gap-3 mb-5">
                    <span className="text-4xl">{getFlagEmoji(selectedCountry)}</span>
                    <h2 className="text-xl font-bold text-gray-900">
                      {countryMap[selectedCountry]?.name || selectedCountry} {locale === 'zh' ? '套餐' : 'Plans'}
                    </h2>
                    <span className="text-sm text-gray-500">({displayProducts.length}{locale === 'zh' ? '款' : ' plans'})</span>
                  </div>
                  {(() => {
                    const minPrice = displayProducts.length > 0 ? Math.min(...displayProducts.map(p => p.price)) : Infinity
                    return (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {displayProducts.map(p => <ProductCard key={p.id} product={p} isLowestPrice={p.price === minPrice} />)}
                      </div>
                    )
                  })()}
                  {displayProducts.length === 0 && <div className="text-center py-12 text-gray-400">{locale === 'zh' ? '暂无套餐' : 'No plans'}</div>}
                </>
              )}
            </div>
          )}

          {/* 全部 tab - 按国家网格选择 */}
          {!search && tab === 'all' && (
            <div>
              {!selectedCountry ? (
                <>
                  <h2 className="text-base font-semibold text-gray-700 mb-4">
                    {locale === 'zh' ? '🌍 选择目的地国家' : locale === 'ja' ? '🌍 目的地を選択' : locale === 'ko' ? '🌍 목적지 선택' : '🌍 Choose Country'}
                  </h2>
                  <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-7 gap-2">
                    {countries.sort((a,b) => a.name.localeCompare(b.name, 'zh')).map(c => (
                      <button key={c.code} onClick={() => setSelectedCountry(c.code)}
                        className="flex flex-col items-center gap-1 p-2.5 bg-white rounded-xl border border-gray-200 hover:border-orange-400 hover:shadow-md transition-all">
                        <span className="text-2xl">{getFlagEmoji(c.code)}</span>
                        <span className="text-xs font-medium text-gray-700 text-center leading-tight truncate w-full">{c.name}</span>
                        <span className="text-xs text-gray-400">{c.productCount}</span>
                      </button>
                    ))}
                  </div>
                </>
              ) : (
                <>
                  <button onClick={() => setSelectedCountry(null)} className="flex items-center gap-1 text-orange-500 mb-4 hover:text-orange-600 text-sm font-medium">
                    <ChevronLeft className="w-4 h-4" />
                    {locale === 'zh' ? '返回国家列表' : 'Back'}
                  </button>
                  <div className="flex items-center gap-3 mb-5">
                    <span className="text-4xl">{getFlagEmoji(selectedCountry)}</span>
                    <h2 className="text-xl font-bold text-gray-900">
                      {countryMap[selectedCountry]?.name || selectedCountry} {locale === 'zh' ? '套餐' : 'Plans'}
                    </h2>
                    <span className="text-sm text-gray-500">({displayProducts.length}{locale === 'zh' ? '款' : ' plans'})</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {displayProducts.map(p => <ProductCard key={p.id} product={p} />)}
                  </div>
                  {displayProducts.length === 0 && <div className="text-center py-12 text-gray-400">{locale === 'zh' ? '暂无套餐' : 'No plans'}</div>}
                </>
              )}
            </div>
          )}

          {/* 区域 tab - 七大洲 */}
          {!search && tab === 'regional' && (
            <div>
              {!selectedContinent ? (
                <>
                  <h2 className="text-base font-semibold text-gray-700 mb-4">
                    {locale === 'zh' ? '🗺️ 选择大洲' : locale === 'ja' ? '🗺️ 大陸を選択' : locale === 'ko' ? '🗺️ 대륙 선택' : '🗺️ Select Region'}
                  </h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
                    {CONTINENTS.map(c => (
                      <button key={c.id} onClick={() => setSelectedContinent(c.id)}
                        className="flex flex-col items-center gap-2 p-5 bg-white rounded-2xl border border-gray-200 hover:border-orange-400 hover:shadow-lg transition-all">
                        <span className="text-5xl">{c.icon}</span>
                        <span className="text-sm font-semibold text-gray-800">{locale === 'zh' ? c.zh : c.en}</span>
                      </button>
                    ))}
                  </div>
                  {/* 所有区域套餐 */}
                  <h3 className="text-sm font-medium text-gray-500 mb-3">{locale === 'zh' ? '所有区域套餐' : 'All Regional Plans'} ({allProducts.filter(p=>p.type==='regional').length})</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {allProducts.filter(p=>p.type==='regional').map(p => <ProductCard key={p.id} product={p} />)}
                  </div>
                </>
              ) : (
                <>
                  <button onClick={() => setSelectedContinent(null)} className="flex items-center gap-1 text-orange-500 mb-4 hover:text-orange-600 text-sm font-medium">
                    <ChevronLeft className="w-4 h-4" />
                    {locale === 'zh' ? '返回大洲列表' : 'Back to Continents'}
                  </button>
                  <div className="flex items-center gap-3 mb-5">
                    <span className="text-4xl">{CONTINENTS.find(c=>c.id===selectedContinent)?.icon}</span>
                    <h2 className="text-xl font-bold text-gray-900">
                      {locale === 'zh' ? CONTINENTS.find(c=>c.id===selectedContinent)?.zh : CONTINENTS.find(c=>c.id===selectedContinent)?.en} {locale === 'zh' ? '区域套餐' : 'Regional Plans'}
                    </h2>
                    <span className="text-sm text-gray-500">({displayProducts.length})</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {displayProducts.map(p => <ProductCard key={p.id} product={p} />)}
                  </div>
                  {displayProducts.length === 0 && <div className="text-center py-12 text-gray-400">{locale === 'zh' ? '暂无套餐' : 'No plans'}</div>}
                </>
              )}
            </div>
          )}

          {/* 全球 tab - 纯流量 vs 流量+语音+短信 */}
          {!search && tab === 'global' && (
            <div>
              {/* 类型切换 */}
              <div className="flex gap-3 mb-6">
                <button onClick={() => setGlobalType('data')}
                  className={`flex items-center gap-2 px-5 py-3 rounded-xl border-2 font-medium transition-all ${globalType === 'data' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}>
                  <Wifi className="w-5 h-5" />
                  <div className="text-left">
                    <div className="text-sm font-semibold">{locale === 'zh' ? '纯数据流量' : locale === 'ja' ? 'データのみ' : locale === 'ko' ? '데이터 전용' : 'Data Only'}</div>
                    <div className="text-xs opacity-70">{locale === 'zh' ? '仅上网，无通话' : 'Internet only'}</div>
                  </div>
                </button>
                <button onClick={() => setGlobalType('voice')}
                  className={`flex items-center gap-2 px-5 py-3 rounded-xl border-2 font-medium transition-all ${globalType === 'voice' ? 'border-green-500 bg-green-50 text-green-700' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}>
                  <Phone className="w-5 h-5" />
                  <div className="text-left">
                    <div className="text-sm font-semibold">{locale === 'zh' ? '流量+语音+短信' : locale === 'ja' ? 'データ+音声+SMS' : locale === 'ko' ? '데이터+음성+SMS' : 'Data+Voice+SMS'}</div>
                    <div className="text-xs opacity-70">{locale === 'zh' ? '支持通话和短信' : 'Calls & SMS included'}</div>
                  </div>
                </button>
              </div>

              <p className="text-sm text-gray-500 mb-4">{displayProducts.length} {locale === 'zh' ? '款套餐' : 'plans'}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {displayProducts.map(p => <ProductCard key={p.id} product={p} />)}
              </div>
              {displayProducts.length === 0 && (
                <div className="text-center py-16 text-gray-400">
                  {locale === 'zh' ? '暂无此类型套餐' : 'No plans of this type'}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const allProducts = getAllProducts()
  const countries = getAllCountries()
  return { props: { allProducts, countries }, revalidate: 3600 }
}
