import { GetStaticProps } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState, useMemo, useEffect } from 'react'
import { getAllProducts, getAllCountries, Product } from '../lib/data'
import ProductCard, { getFlagEmoji } from '../components/ProductCard'
import { useI18n } from '../lib/i18n-context'

type CountryInfo = { code: string; name: string; productCount: number }

const CONTINENTS: Record<string, string[]> = {
  asia: ['JP','KR','CN','HK','TW','MO','SG','TH','VN','MY','ID','PH','IN','PK','BD','LK','NP','KH','LA','MM','BN','TL','AF','MN','AZ','AM','GE','KZ','UZ','KG','TJ'],
  europe: ['GB','FR','DE','IT','ES','PT','NL','BE','CH','AT','SE','NO','DK','FI','PL','CZ','HU','RO','BG','GR','TR','UA','RU','BY','RS','HR','SK','SI','LT','LV','EE','IE','IS','MT','CY','LU','AL','MK','ME','BA','AD','SM','LI','MC','GI','XK','GG','JE','IM','FO','GL'],
  americas: ['US','CA','MX','BR','AR','CL','CO','PE','VE','EC','BO','UY','PY','SR','GY','CR','PA','GT','HN','SV','NI','BZ','JM','TT','BB','LC','VC','KN','AG','DM','GD','HT','DO','CU','PR','USPR','BM','KY','TC','AW','CW','BQ','SX','MF','BL','GP','MQ'],
  middleEast: ['AE','SA','QA','KW','BH','OM','IL','JO','IQ','LB','SY','YE','IR','PS','EG','MA','TN','DZ','LY'],
  oceania: ['AU','NZ','FJ','PG','WS','TO','VU','NR'],
  africa: ['ZA','NG','KE','GH','ET','TZ','UG','RW','ZM','ZW','MG','MU','SC','CV','SN','CI','CM','GA','CD','CG','CF','TD','ML','BF','GN','GW','LR','SL','GM','MW','BJ','TG','BW','SZ','SD','MR'],
}

interface Props { allProducts: Product[]; countries: CountryInfo[] }

export default function ProductsPage({ allProducts, countries }: Props) {
  const { t } = useI18n()
  const router = useRouter()

  // Read filters from URL
  const countryParam = router.query.country as string || ''
  const typeParam = router.query.type as string || ''
  const searchParam = router.query.search as string || ''

  const [search, setSearch] = useState(searchParam)
  const [continent, setContinent] = useState('')
  const [expandedCountry, setExpandedCountry] = useState(countryParam)

  useEffect(() => {
    setSearch(searchParam)
    if (countryParam) setExpandedCountry(countryParam)
  }, [searchParam, countryParam])

  const cMap = useMemo(() => Object.fromEntries(countries.map(c => [c.code, c])), [countries])

  // Derived filtered products
  const filtered = useMemo(() => {
    let list = allProducts
    if (typeParam === 'regional') list = list.filter(p => p.type === 'regional')
    else if (typeParam === 'global') list = list.filter(p => p.type === 'global')
    else if (!typeParam) list = list // all

    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.countries.some(c => c.name.toLowerCase().includes(q) || c.code.toLowerCase().includes(q))
      )
    }
    return list
  }, [allProducts, typeParam, search])

  // For country-grid view (local plans grouped by country)
  const localCountries = useMemo(() => {
    let codes = countries
    if (continent) {
      const allowed = CONTINENTS[continent] || []
      codes = codes.filter(c => allowed.includes(c.code))
    }
    if (search.trim()) {
      const q = search.toLowerCase()
      codes = codes.filter(c => c.name.toLowerCase().includes(q) || c.code.toLowerCase().includes(q))
    }
    return codes
  }, [countries, continent, search])

  const showCountryGrid = !typeParam && !searchParam
  const showingProducts = typeParam || searchParam

  const continentKeys = ['', 'asia', 'europe', 'americas', 'middleEast', 'oceania', 'africa']
  const continentLabels = [t('products.all'), t('products.asia'), t('products.europe'), t('products.americas'), t('products.middleEast'), t('products.oceania'), t('products.africa')]

  // Products for selected country
  const countryProducts = useMemo(() => {
    if (!expandedCountry) return []
    return allProducts.filter(p => p.countries.some(c => c.code === expandedCountry))
  }, [allProducts, expandedCountry])

  return (
    <>
      <Head>
        <title>SimRyoko — {t('products.title')}</title>
        <meta name="description" content={t('hero.subtitle')} />
      </Head>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Page title */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            {typeParam === 'regional' ? t('nav.regional') : typeParam === 'global' ? t('nav.global') : t('products.title')}
          </h1>
        </div>

        {/* Search + type tabs */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              value={search} onChange={e => setSearch(e.target.value)}
              placeholder={t('products.searchPlaceholder')}
              className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent text-sm"
            />
          </div>
          <div className="flex gap-2 flex-shrink-0">
            {[
              { val: '', label: t('products.all') },
              { val: 'regional', label: t('products.regional') },
              { val: 'global', label: t('products.global') },
            ].map(tab => (
              <button key={tab.val}
                onClick={() => router.push(tab.val ? `/products?type=${tab.val}` : '/products', undefined, { shallow: true })}
                className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${typeParam === tab.val ? 'bg-orange-500 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-orange-300'}`}>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Country-grid mode */}
        {showCountryGrid && !search && (
          <>
            {/* Continent filter */}
            <div className="flex gap-2 overflow-x-auto pb-2 mb-6" style={{ scrollbarWidth: 'none' }}>
              {continentKeys.map((k, i) => (
                <button key={k}
                  onClick={() => { setContinent(k); setExpandedCountry('') }}
                  className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${continent === k ? 'bg-orange-500 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-orange-300'}`}>
                  {continentLabels[i]}
                </button>
              ))}
            </div>

            {/* Country grid */}
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 mb-8">
              {localCountries.map(c => (
                <button key={c.code}
                  onClick={() => setExpandedCountry(expandedCountry === c.code ? '' : c.code)}
                  className={`bg-white rounded-2xl border p-3 text-center transition-all hover:shadow-md ${expandedCountry === c.code ? 'border-orange-400 shadow-md bg-orange-50' : 'border-gray-100 hover:border-orange-200'}`}>
                  <div className="text-3xl mb-1">{getFlagEmoji(c.code)}</div>
                  <div className="text-xs font-medium text-gray-900 leading-tight">{c.name}</div>
                  <div className="text-[10px] text-gray-400 mt-0.5">{c.productCount}+</div>
                </button>
              ))}
            </div>

            {/* Expanded country plans */}
            {expandedCountry && countryProducts.length > 0 && (
              <div className="mb-10">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl">{getFlagEmoji(expandedCountry)}</span>
                  <h2 className="text-xl font-bold text-gray-900">
                    {cMap[expandedCountry]?.name || expandedCountry}
                  </h2>
                  <span className="text-sm text-gray-400">({countryProducts.length} {t('common.plans')})</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {countryProducts.map(p => <ProductCard key={p.id} product={p} />)}
                </div>
              </div>
            )}
          </>
        )}

        {/* Search / type filter results */}
        {(showingProducts || search) && (
          <div>
            <p className="text-sm text-gray-500 mb-4">
              {t('products.count', { count: filtered.length })}
            </p>
            {filtered.length === 0 ? (
              <div className="text-center py-20 text-gray-400">
                <div className="text-5xl mb-4">🔍</div>
                <div className="font-medium">{t('products.noProducts')}</div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {filtered.map(p => <ProductCard key={p.id} product={p} />)}
              </div>
            )}
          </div>
        )}
      </div>
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const allProducts = getAllProducts()
  const countries = getAllCountries()
  return {
    props: { allProducts: JSON.parse(JSON.stringify(allProducts)), countries: JSON.parse(JSON.stringify(countries)) },
    revalidate: 3600,
  }
}
