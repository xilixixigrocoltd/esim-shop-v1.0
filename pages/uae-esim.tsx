import { GetStaticProps } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { getProductsByCountry } from '@/lib/data'
import type { Product } from '@/lib/data'
import { useI18n } from '@/lib/i18n-context'
import ProductCard from '@/components/ProductCard'


interface PageProps {
  products: Product[]
  minPrice: number
}

const COUNTRY_INFO = {
  code: 'AE',
  slug: 'uae-esim',
  nameCn: '阿联酋',
  nameEn: 'UAE',
  flag: '🇦🇪',
  carriers: 'Etisalat (e&) / du',
  highlight: '沙漠明珠，购物天堂迪拜',
  ctaCountry: 'AE',
  faqs: [
    { q: '阿联酋eSIM用哪个运营商网络？', a: '我们的阿联酋eSIM运行在Etisalat、du等主流网络上，覆盖迪拜、阿布扎比等主要城市。' },
    { q: '迪拜哈利法塔信号怎么样？', a: '迪拜市区4G/5G信号覆盖极佳，哈利法塔、迪拜购物中心等热门景点均可正常使用。' },
    { q: '阿联酋对VoIP有限制吗？', a: '阿联酋对Skype、WhatsApp通话等VoIP服务有限制，建议使用当地通话方式。数据上网正常无限制。' },
    { q: '流量用完了怎么办？', a: '流量用完后可在SimRyoko购买新套餐，重新安装二维码即可继续使用。' },
  ],
  related: [
    { slug: 'japan-esim', name: '日本', flag: '🇯🇵' },
    { slug: 'thailand-esim', name: '泰国', flag: '🇹🇭' },
    { slug: 'singapore-esim', name: '新加坡', flag: '🇸🇬' },
  ],
}

export default function UaeEsimPage({ products, minPrice }: PageProps) {
  const { t } = useI18n()
  const info = COUNTRY_INFO
  const siteUrl = 'https://simryoko.com'
  const pageUrl = `${siteUrl}/${info.slug}`
  const title = `${info.nameCn}eSIM套餐 | 落地即用，最低$${minPrice.toFixed(2)}起 | SimRyoko`
  const description = `去${info.nameCn}旅行？SimRyoko提供${info.nameCn}eSIM套餐，${info.carriers}网络，落地即用，无需换卡。最低$${minPrice.toFixed(2)}起，支持信用卡/USDT支付。`

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: `${info.nameCn} eSIM套餐`,
    description,
    brand: { '@type': 'Brand', name: 'SimRyoko' },
    offers: {
      '@type': 'AggregateOffer',
      lowPrice: minPrice.toFixed(2),
      priceCurrency: 'USD',
      offerCount: products.length,
      url: pageUrl,
    },
    image: `${siteUrl}/og-default.jpg`,
  }

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={pageUrl} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:image" content={`${siteUrl}/og-default.jpg`} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="SimRyoko" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={`${siteUrl}/og-default.jpg`} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </Head>

      {/* Hero */}
      <section className="bg-gradient-to-br from-orange-50 via-white to-orange-50 py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-8xl mb-4">{info.flag}</div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
            {info.nameCn} eSIM套餐
          </h1>
          <p className="text-lg text-gray-600 mb-2">{info.carriers} · 最低 <span className="text-orange-500 font-bold">${minPrice.toFixed(2)}</span> 起</p>
          <p className="text-sm text-orange-600 font-medium mb-8">{info.highlight} · 落地即用 · 无需换卡</p>
          <Link
            href={`/products?country=${info.ctaCountry}`}
            className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-bold text-lg px-10 py-4 rounded-2xl shadow-lg transition-all active:scale-95"
          >
            立即购买 {info.flag}
          </Link>
        </div>
      </section>

      {/* 套餐列表 */}
      <section className="py-12 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 text-center">
            {info.nameCn} eSIM套餐列表
          </h2>
          <p className="text-gray-500 text-center mb-8">共 {products.length} 款套餐，按价格从低到高排列</p>
          {products.length === 0 ? (
            <div className="text-center py-10 text-gray-400">暂无套餐，请稍后再试</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map((p, i) => (
                <ProductCard key={p.id} product={p} isLowestPrice={i === 0} />
              ))}
            </div>
          )}
          <div className="text-center mt-8">
            <Link href={`/products?country=${info.ctaCountry}`} className="text-orange-500 hover:text-orange-600 font-medium underline">
              查看全部 {info.nameCn} 套餐 →
            </Link>
          </div>
        </div>
      </section>

      {/* 为什么选 SimRyoko */}
      <section className="py-12 px-4 bg-orange-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center">为什么选 SimRyoko？</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: '✈️', title: '落地即用', desc: '到达目的地即可连接网络，无需排队买卡' },
              { icon: '₿', title: 'USDT支付', desc: '支持USDT加密货币支付，安全便捷' },
              { icon: '🔄', title: '7天退款', desc: '未激活套餐7天无理由退款保障' },
              { icon: '💬', title: '24/7客服', desc: '全天候在线客服，随时解决您的问题' },
            ].map(f => (
              <div key={f.title} className="bg-white rounded-2xl p-5 text-center shadow-sm">
                <div className="text-4xl mb-3">{f.icon}</div>
                <div className="font-bold text-gray-900 mb-1">{f.title}</div>
                <div className="text-xs text-gray-500">{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 安装步骤 */}
      <section className="py-12 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center">如何安装 eSIM</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><span>🍎</span> iPhone 安装步骤</h3>
              <ol className="space-y-3">
                {['购买后邮件收到二维码', '进入 设置 → 蜂窝网络 → 添加eSIM → 扫描二维码', `到达{info.nameCn}后开启eSIM数据即可使用`].map((s, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="w-7 h-7 rounded-full bg-orange-100 text-orange-600 font-bold flex items-center justify-center flex-shrink-0 text-sm">{i + 1}</span>
                    <span className="text-gray-600 text-sm">{s}</span>
                  </li>
                ))}
              </ol>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><span>🤖</span> Android 安装步骤</h3>
              <ol className="space-y-3">
                {['购买后邮件收到二维码', '进入 设置 → 网络 → SIM卡 → 添加eSIM → 扫描二维码', `到达{info.nameCn}后在移动网络设置中切换至eSIM`].map((s, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="w-7 h-7 rounded-full bg-orange-100 text-orange-600 font-bold flex items-center justify-center flex-shrink-0 text-sm">{i + 1}</span>
                    <span className="text-gray-600 text-sm">{s}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-12 px-4 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center">{info.nameCn} eSIM 常见问题</h2>
          <div className="space-y-4">
            {info.faqs.map((faq, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-sm">
                <h3 className="font-bold text-gray-900 mb-2">Q: {faq.q}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">A: {faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 相关推荐 */}
      <section className="py-12 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">其他热门目的地</h2>
          <div className="flex flex-wrap gap-4 justify-center">
            {info.related.map(r => (
              <Link key={r.slug} href={`/${r.slug}`}
                className="flex items-center gap-2 bg-orange-50 hover:bg-orange-100 text-gray-800 font-medium px-6 py-3 rounded-xl transition-colors">
                <span className="text-2xl">{r.flag}</span>
                <span>{r.name} eSIM</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const { local, regional } = getProductsByCountry('AE')
  const all = [...local, ...regional]
  const sorted = all.sort((a, b) => a.price - b.price)
  const minPrice = sorted.length > 0 ? sorted[0].price : 4.00
  return {
    props: {
      products: sorted.slice(0, 12),
      minPrice,
    },
  }
}
