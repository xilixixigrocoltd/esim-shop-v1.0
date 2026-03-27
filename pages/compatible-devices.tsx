import Head from 'next/head'
import Link from 'next/link'

const DEVICES = [
  {
    brand: '🍎 Apple iPhone',
    models: [
      { name: 'iPhone 16 / 16 Plus / 16 Pro / 16 Pro Max', note: 'eSIM-only in US' },
      { name: 'iPhone 15 / 15 Plus / 15 Pro / 15 Pro Max', note: 'eSIM-only in US' },
      { name: 'iPhone 14 / 14 Plus / 14 Pro / 14 Pro Max', note: 'eSIM-only in US' },
      { name: 'iPhone 13 / 13 mini / 13 Pro / 13 Pro Max' },
      { name: 'iPhone 12 / 12 mini / 12 Pro / 12 Pro Max' },
      { name: 'iPhone SE (2022, 3rd gen)' },
      { name: 'iPhone 11 / 11 Pro / 11 Pro Max' },
      { name: 'iPhone XS / XS Max / XR' },
    ],
  },
  {
    brand: '🍎 Apple iPad',
    models: [
      { name: 'iPad Pro (all models since 2018)' },
      { name: 'iPad Air (3rd gen and later)' },
      { name: 'iPad mini (5th gen and later)' },
      { name: 'iPad (7th gen and later)' },
    ],
  },
  {
    brand: '🌟 Samsung Galaxy',
    models: [
      { name: 'Galaxy S24 / S24+ / S24 Ultra' },
      { name: 'Galaxy S23 / S23+ / S23 Ultra' },
      { name: 'Galaxy S22 / S22+ / S22 Ultra' },
      { name: 'Galaxy S21 / S21+ / S21 Ultra' },
      { name: 'Galaxy S20 / S20+ / S20 Ultra' },
      { name: 'Galaxy Z Fold 2, 3, 4, 5, 6' },
      { name: 'Galaxy Z Flip 3, 4, 5, 6' },
      { name: 'Galaxy Note 20 / Note 20 Ultra' },
      { name: 'Galaxy A54 5G, A35 5G', note: 'Select markets only' },
    ],
  },
  {
    brand: '🟢 Google Pixel',
    models: [
      { name: 'Pixel 9 / 9 Pro / 9 Pro XL / 9 Pro Fold' },
      { name: 'Pixel 8 / 8 Pro / 8a' },
      { name: 'Pixel 7 / 7 Pro / 7a' },
      { name: 'Pixel 6 / 6 Pro / 6a' },
      { name: 'Pixel 5 / 5a (5G)' },
      { name: 'Pixel 4 / 4 XL / 4a (5G)' },
    ],
  },
  {
    brand: '🔵 Motorola',
    models: [
      { name: 'Motorola Razr (2019, 2020, 2022, 2023)' },
      { name: 'Moto G (2023)' },
      { name: 'Edge+ (2020, 2022)' },
    ],
  },
  {
    brand: '⚫ Other Android',
    models: [
      { name: 'Huawei P40 / P40 Pro', note: 'No Google services' },
      { name: 'OnePlus 12 / 12R', note: 'Select regions' },
      { name: 'OPPO Find X6 / X7', note: 'Select regions' },
    ],
  },
]

export default function CompatibleDevices() {
  const siteUrl = 'https://simryoko.com'
  const pageUrl = `${siteUrl}/compatible-devices`
  const title = 'eSIM Compatible Devices — Check if Your Phone Supports eSIM | SimRyoko'
  const description = 'Check if your iPhone, Samsung Galaxy, Google Pixel or other Android device supports eSIM. Full list of compatible devices for SimRyoko eSIM plans.'

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: title,
    description,
    url: pageUrl,
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </Head>

      {/* Hero */}
      <section className="bg-gradient-to-br from-orange-50 via-white to-orange-50 py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-8xl mb-4">📱</div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
            eSIM Compatible Devices
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Check if your device supports eSIM before purchasing
          </p>
        </div>
      </section>

      {/* Important Note */}
      <section className="py-8 px-4 bg-orange-50">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-2xl p-6 border border-orange-200">
            <h2 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
              <span className="text-xl">⚠️</span> Important: Check Your Device
            </h2>
            <ul className="space-y-2 text-gray-600 text-sm">
              <li>• Your device must be <strong>carrier-unlocked</strong> to use third-party eSIMs</li>
              <li>• Some Chinese (domestic) variants of phones do NOT support eSIM</li>
              <li>• iPhone XS and newer support eSIM; older models do not</li>
              <li>• Having eSIM hardware ≠ carrier unlocked — both conditions required</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Device Lists */}
      <section className="py-12 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center">
            Supported Devices
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {DEVICES.map((brand, i) => (
              <div key={i} className="bg-gray-50 rounded-2xl p-6">
                <h3 className="font-bold text-gray-900 mb-4 text-lg">{brand.brand}</h3>
                <ul className="space-y-2">
                  {brand.models.map((model, j) => (
                    <li key={j} className="flex items-start gap-2">
                      <span className="text-green-500 flex-shrink-0 mt-0.5">✓</span>
                      <div>
                        <span className="text-gray-700 text-sm">{model.name}</span>
                        {model.note && (
                          <span className="ml-2 text-xs text-orange-500 bg-orange-50 px-2 py-0.5 rounded-full">
                            {model.note}
                          </span>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How to Check */}
      <section className="py-12 px-4 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center">
            How to Check if Your Device Supports eSIM
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span>🍎</span> iPhone
              </h3>
              <ol className="space-y-2">
                {[
                  'Go to Settings → General → About',
                  'Scroll down to find "Available SIM" or "Digital SIM"',
                  'If you see an EID number, your device supports eSIM',
                ].map((step, i) => (
                  <li key={i} className="flex gap-2 text-sm text-gray-600">
                    <span className="w-5 h-5 rounded-full bg-orange-100 text-orange-600 font-bold flex items-center justify-center flex-shrink-0 text-xs">{i + 1}</span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span>🤖</span> Android
              </h3>
              <ol className="space-y-2">
                {[
                  'Go to Settings → About Phone → Status',
                  'Look for "EID" in the list',
                  'If EID exists, your device supports eSIM',
                ].map((step, i) => (
                  <li key={i} className="flex gap-2 text-sm text-gray-600">
                    <span className="w-5 h-5 rounded-full bg-orange-100 text-orange-600 font-bold flex items-center justify-center flex-shrink-0 text-xs">{i + 1}</span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 px-4 bg-orange-500 text-white text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Your device is compatible?</h2>
          <p className="text-orange-100 mb-8">Great! Browse our eSIM plans and get connected in 5 minutes</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/products" className="bg-white text-orange-500 font-bold px-8 py-3 rounded-xl hover:bg-orange-50 transition-colors">
              Browse Plans
            </Link>
            <Link href="/how-to-install" className="border-2 border-white text-white font-bold px-8 py-3 rounded-xl hover:bg-orange-600 transition-colors">
              How to Install
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
