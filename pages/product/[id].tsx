import { GetStaticPaths, GetStaticProps } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { getAllProducts, getProductById, Product } from '../../lib/data'
import { getFlagEmoji, formatData } from '../../components/ProductCard'
import { useI18n } from '../../lib/i18n-context'

interface Props { product: Product; related: Product[] }

export default function ProductDetail({ product, related }: Props) {
  const { t } = useI18n()
  const router = useRouter()
  const [adding, setAdding] = useState(false)
  const [added, setAdded] = useState(false)

  if (router.isFallback) {
    return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-10 w-10 border-4 border-orange-500 border-t-transparent" /></div>
  }

  const primaryFlag = getFlagEmoji(product.countries[0]?.code || '')
  const allFlags = product.countries.slice(0, 5).map(c => getFlagEmoji(c.code)).join(' ')

  const CART_KEY = 'cart'

  function addToCart() {
    setAdding(true)
    setTimeout(() => {
      try {
        const cart: Array<Product & { qty: number }> = JSON.parse(localStorage.getItem(CART_KEY) || '[]')
        const idx = cart.findIndex((i) => String(i.id) === String(product.id))
        if (idx >= 0) cart[idx].qty = (cart[idx].qty || 1) + 1
        else cart.push({ ...product, qty: 1 })
        localStorage.setItem(CART_KEY, JSON.stringify(cart))
        window.dispatchEvent(new Event('cart-updated'))
        setAdded(true)
        setTimeout(() => setAdded(false), 2000)
      } catch {}
      setAdding(false)
    }, 600)
  }

  function buyNow() {
    try {
      const cart: Array<Product & { qty: number }> = JSON.parse(localStorage.getItem(CART_KEY) || '[]')
      const idx = cart.findIndex((i) => String(i.id) === String(product.id))
      if (idx >= 0) cart[idx].qty = (cart[idx].qty || 1) + 1
      else cart.push({ ...product, qty: 1 })
      localStorage.setItem(CART_KEY, JSON.stringify(cart))
      window.dispatchEvent(new Event('cart-updated'))
    } catch {}
    router.push('/checkout')
  }

  const typeLabel = { local: t('product.local'), regional: t('product.regional'), global: t('product.global') }[product.type] || product.type
  const typeColor = { local: 'bg-emerald-100 text-emerald-700', regional: 'bg-blue-100 text-blue-700', global: 'bg-purple-100 text-purple-700' }[product.type] || ''

  const dataMb = product.dataSize
  const dataStr = formatData(dataMb, t)

  return (
    <>
      <Head>
        <title>{product.name} - eSIM套餐 | SimRyoko</title>
        <meta name="description" content={`${product.name}，${dataStr}流量，有效期${product.validDays}天，仅需$${product.price} USD。境外流量即买即用，支持USDT支付，出国必备eSIM。`} />
        <link rel="canonical" href={`https://simryoko.com/product/${product.id}`} />
        <meta property="og:type" content="product" />
        <meta property="og:url" content={`https://simryoko.com/product/${product.id}`} />
        <meta property="og:title" content={`${product.name} - eSIM套餐 | SimRyoko`} />
        <meta property="og:description" content={`${dataStr}流量，${product.validDays}天有效，$${product.price} USD起。出国流量eSIM，即买即用。`} />
        <meta property="og:image" content="https://simryoko.com/og-image.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${product.name} - eSIM套餐 | SimRyoko`} />
        <meta name="twitter:description" content={`${dataStr}流量，${product.validDays}天有效，$${product.price} USD起`} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Product",
          "name": product.name,
          "description": `${product.name}，${dataStr}流量，有效期${product.validDays}天，境外流量eSIM套餐，即买即用`,
          "image": "https://simryoko.com/og-image.jpg",
          "brand": { "@type": "Brand", "name": "SimRyoko" },
          "offers": {
            "@type": "Offer",
            "price": product.price.toFixed(2),
            "priceCurrency": "USD",
            "availability": "https://schema.org/InStock",
            "url": `https://simryoko.com/product/${product.id}`,
            "seller": { "@type": "Organization", "name": "SimRyoko" }
          }
        })}} />
      </Head>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
          <Link href="/products" className="hover:text-orange-500 transition-colors">{t('product.backToProducts')}</Link>
          <span>/</span>
          <span className="text-gray-600 truncate max-w-[200px]">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left: details */}
          <div className="lg:col-span-3 space-y-6">
            {/* Hero card */}
            <div className="bg-gradient-to-br from-[#1e3a5f] to-[#0d2d4f] rounded-3xl p-8 text-white">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <div className="text-6xl mb-3">{allFlags}</div>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${typeColor}`}>{typeLabel}</span>
                </div>
                {product.isHot && (
                  <span className="bg-red-500 text-white text-xs px-3 py-1 rounded-full font-bold">🔥 {t('product.hot')}</span>
                )}
              </div>
              <h1 className="text-xl font-bold leading-snug mb-4">{product.name}</h1>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: t('product.data'), val: dataStr },
                  { label: t('product.validity'), val: `${product.validDays} ${t('product.days')}` },
                  { label: t('product.countries2'), val: `${product.countries.length}` },
                ].map(s => (
                  <div key={s.label} className="bg-white/10 rounded-2xl p-3 text-center">
                    <div className="font-bold text-lg">{s.val}</div>
                    <div className="text-blue-300 text-xs mt-0.5">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* China phone warning */}
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
              <p className="font-semibold text-amber-800 mb-1">{t('warning.chinaPhone')}</p>
              <p className="text-amber-700 text-sm leading-relaxed">{t('warning.chinaPhoneDesc')}</p>
            </div>

            {/* Features */}
            {product.features && product.features.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <h3 className="font-bold text-gray-900 mb-4">{t('product.features')}</h3>
                <ul className="space-y-2">
                  {product.features.map((f, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-gray-700">
                      <span className="w-5 h-5 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <svg className="w-3 h-3 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Coverage */}
            {product.countries.length > 1 && (
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <h3 className="font-bold text-gray-900 mb-4">{t('product.coverage')} ({product.countries.length})</h3>
                <div className="flex flex-wrap gap-2">
                  {product.countries.map(c => (
                    <span key={c.code} className="flex items-center gap-1 bg-gray-50 border border-gray-100 px-3 py-1.5 rounded-full text-sm">
                      {getFlagEmoji(c.code)} {c.name || c.code}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* How to install */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h3 className="font-bold text-gray-900 mb-5">{t('product.install')}</h3>
              <ol className="space-y-3">
                {[t('product.installStep1'), t('product.installStep2'), t('product.installStep3'), t('product.installStep4')].map((s, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="w-6 h-6 bg-orange-500 text-white text-xs font-bold rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">{i+1}</span>
                    <span className="text-sm text-gray-700 leading-relaxed">{s}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          {/* Right: sticky purchase panel */}
          <div className="lg:col-span-2">
            <div className="sticky top-24 bg-white rounded-3xl border border-gray-100 shadow-xl p-6 space-y-4">
              <div className="text-center pb-4 border-b border-gray-100">
                <div className="text-4xl font-extrabold text-orange-500">${product.price}</div>
                <div className="text-sm text-gray-400 mt-1">USD</div>
              </div>

              <div className="space-y-2.5 text-sm">
                {[
                  { label: t('product.data'), val: dataStr },
                  { label: t('product.validity'), val: `${product.validDays} ${t('product.days')}` },
                  { label: t('product.countries2'), val: `${product.countries.length}` },
                ].map(row => (
                  <div key={row.label} className="flex justify-between text-gray-600">
                    <span>{row.label}</span>
                    <span className="font-semibold text-gray-900">{row.val}</span>
                  </div>
                ))}
              </div>

              <button onClick={buyNow}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 rounded-2xl text-lg transition-colors shadow-lg active:scale-[0.98] min-h-[56px]">
                {t('product.buy')}
              </button>

              <button onClick={addToCart} disabled={adding}
                className="w-full border-2 border-orange-500 text-orange-500 font-bold py-3.5 rounded-2xl transition-colors hover:bg-orange-50 active:scale-[0.98] min-h-[52px] flex items-center justify-center gap-2">
                {adding ? (
                  <><span className="animate-spin rounded-full h-4 w-4 border-2 border-orange-500 border-t-transparent" />{t('checkout.processing')}</>
                ) : added ? t('product.addedToCart') : t('product.addCart')}
              </button>

              <p className="text-center text-xs text-gray-400">{t('checkout.security')}</p>
            </div>
          </div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div className="mt-14">
            <h2 className="text-xl font-bold text-gray-900 mb-5">{t('product.related')}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {related.map(p => (
                <Link key={p.id} href={`/product/${p.id}`}>
                  <div className="bg-white rounded-2xl border border-gray-100 p-4 hover:shadow-md hover:border-orange-200 transition-all">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{getFlagEmoji(p.countries[0]?.code || '')}</span>
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-medium text-gray-900 truncate">{p.name}</div>
                        <div className="text-xs text-gray-400 mt-0.5">{formatData(p.dataSize, t)} · {p.validDays}{t('product.days')}</div>
                      </div>
                      <span className="text-orange-500 font-bold flex-shrink-0">${p.price}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Mobile sticky bottom bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 flex gap-3 z-40 shadow-2xl">
        <button onClick={addToCart} disabled={adding}
          className="flex-1 border-2 border-orange-500 text-orange-500 font-bold py-3 rounded-xl text-sm active:scale-[0.98] flex items-center justify-center min-h-[48px]">
          {adding ? <span className="animate-spin rounded-full h-4 w-4 border-2 border-orange-500 border-t-transparent" /> : added ? t('product.addedToCart') : t('product.addCart')}
        </button>
        <button onClick={buyNow}
          className="flex-1 bg-orange-500 text-white font-bold py-3 rounded-xl text-sm hover:bg-orange-600 active:scale-[0.98] min-h-[48px]">
          {t('product.buy')} · ${product.price}
        </button>
      </div>
      <div className="lg:hidden h-20" />
    </>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const products = getAllProducts()
  return {
    paths: products.slice(0, 200).map(p => ({ params: { id: String(p.id) } })),
    fallback: true,
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const id = params?.id as string
  const product = getProductById(id)
  if (!product) return { notFound: true }

  // Related: same country or same type, max 3
  const all = getAllProducts()
  const related = all.filter(p =>
    String(p.id) !== id &&
    (p.countries.some(c => product.countries.some(pc => pc.code === c.code)) || p.type === product.type)
  ).slice(0, 3)

  return {
    props: { product: JSON.parse(JSON.stringify(product)), related: JSON.parse(JSON.stringify(related)) },
    revalidate: 3600,
  }
}
