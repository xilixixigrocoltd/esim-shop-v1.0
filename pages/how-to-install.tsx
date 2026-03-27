import Head from 'next/head'
import Link from 'next/link'

export default function HowToInstall() {
  const siteUrl = 'https://simryoko.com'
  const pageUrl = `${siteUrl}/how-to-install`
  const title = 'How to Install eSIM — Step-by-Step Guide | SimRyoko'
  const description = 'Learn how to install your SimRyoko eSIM on iPhone or Android in minutes. Step-by-step guide with screenshots and troubleshooting tips.'

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'How to Install eSIM',
    description,
    url: pageUrl,
    step: [
      { '@type': 'HowToStep', name: 'Purchase eSIM', text: 'Buy your eSIM plan from SimRyoko and receive a QR code via email.' },
      { '@type': 'HowToStep', name: 'Scan QR Code', text: 'Go to Settings → Cellular → Add eSIM → Scan QR Code.' },
      { '@type': 'HowToStep', name: 'Enable eSIM', text: 'After arrival at your destination, enable the eSIM data plan in settings.' },
    ],
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
          <div className="text-8xl mb-4">📲</div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
            How to Install Your eSIM
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Get connected in 5 minutes — no SIM card, no queues
          </p>
          <Link
            href="/products"
            className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-bold text-lg px-10 py-4 rounded-2xl shadow-lg transition-all active:scale-95"
          >
            Browse eSIM Plans
          </Link>
        </div>
      </section>

      {/* Pre-install Checklist */}
      <section className="py-12 px-4 bg-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 text-center">
            ✅ Before You Start
          </h2>
          <div className="bg-orange-50 rounded-2xl p-6">
            <ul className="space-y-3">
              {[
                { icon: '📶', text: 'Your device supports eSIM (check compatible devices below)' },
                { icon: '🔓', text: 'Your device is carrier-unlocked (contact your carrier if unsure)' },
                { icon: '📡', text: 'You have a working Wi-Fi connection during installation' },
                { icon: '📧', text: 'You have received your eSIM QR code from SimRyoko via email' },
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="text-xl flex-shrink-0">{item.icon}</span>
                  <span className="text-gray-700">{item.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* iPhone Steps */}
      <section className="py-12 px-4 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center">
            🍎 iPhone — Install eSIM
          </h2>
          <p className="text-gray-500 text-center mb-8">Supported: iPhone XS or newer (iOS 12.1+)</p>
          <div className="space-y-4">
            {[
              { title: 'Open Settings', desc: 'Tap the ⚙️ Settings app on your iPhone.' },
              { title: 'Go to Cellular / Mobile Data', desc: 'Tap Cellular (or Mobile Data in some regions).' },
              { title: 'Add eSIM', desc: 'Tap Add eSIM (or Add Cellular Plan).' },
              { title: 'Scan QR Code', desc: 'Choose Use QR Code and scan the QR code from SimRyoko. No camera? Tap Enter Details Manually.' },
              { title: 'Confirm & Label', desc: 'Tap Continue, give the plan a label (e.g. "SimRyoko Japan"), and tap Done.' },
              { title: 'Enable Data Roaming', desc: 'Go back to Cellular → SimRyoko plan → Turn on Data Roaming. Required for international use.' },
            ].map((step, i) => (
              <div key={i} className="bg-white rounded-2xl p-5 shadow-sm flex gap-4">
                <span className="w-9 h-9 rounded-full bg-orange-500 text-white font-bold flex items-center justify-center flex-shrink-0">
                  {i + 1}
                </span>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">{step.title}</h3>
                  <p className="text-gray-600 text-sm">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Android Steps */}
      <section className="py-12 px-4 bg-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center">
            🤖 Android — Install eSIM
          </h2>
          <p className="text-gray-500 text-center mb-8">Samsung, Google Pixel, and other eSIM-compatible Android devices</p>
          <div className="space-y-4">
            {[
              { title: 'Open Settings', desc: 'Tap the Settings app on your Android device.' },
              { title: 'Go to Network & Internet', desc: 'Tap Network & Internet (or Connections on Samsung).' },
              { title: 'Find SIM / eSIM Settings', desc: 'Tap SIM cards, then Add SIM (or + icon).' },
              { title: 'Scan QR Code', desc: 'Select Download a SIM and scan the QR code from SimRyoko.' },
              { title: 'Confirm', desc: 'Follow on-screen prompts to confirm and activate the eSIM.' },
              { title: 'Enable Data Roaming', desc: 'Go to Mobile Network settings → select SimRyoko plan → enable Data Roaming.' },
            ].map((step, i) => (
              <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex gap-4">
                <span className="w-9 h-9 rounded-full bg-orange-500 text-white font-bold flex items-center justify-center flex-shrink-0">
                  {i + 1}
                </span>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">{step.title}</h3>
                  <p className="text-gray-600 text-sm">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Troubleshooting */}
      <section className="py-12 px-4 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center">
            🔧 Troubleshooting
          </h2>
          <div className="space-y-4">
            {[
              { q: 'QR code not scanning?', a: 'Make sure lighting is good and the QR code fills most of the frame. Try the manual entry option.' },
              { q: 'eSIM installed but no signal?', a: 'Make sure Data Roaming is enabled. Try toggling Airplane Mode on/off. Restart your device.' },
              { q: 'Plan says "no service"?', a: 'The eSIM may need to be manually set as default data. Go to Settings → Cellular and select the SimRyoko plan.' },
              { q: 'Device says "eSIM not supported"?', a: 'Check if your device model supports eSIM in our compatible devices list. Note that some carrier-locked devices may not support third-party eSIMs.' },
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-sm">
                <h3 className="font-bold text-gray-900 mb-2">Q: {item.q}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">A: {item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 px-4 bg-orange-500 text-white text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to get connected?</h2>
          <p className="text-orange-100 mb-8">Browse our eSIM plans — starting from just $4</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/products" className="bg-white text-orange-500 font-bold px-8 py-3 rounded-xl hover:bg-orange-50 transition-colors">
              Browse Plans
            </Link>
            <Link href="/compatible-devices" className="border-2 border-white text-white font-bold px-8 py-3 rounded-xl hover:bg-orange-600 transition-colors">
              Check Compatible Devices
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
