import Head from 'next/head'
import Link from 'next/link'

export default function RefundPage() {
  return (
    <>
      <Head>
        <title>Refund Policy – SimRyoko</title>
        <meta name="description" content="SimRyoko Refund Policy – eSIM digital goods. Unactivated eSIMs eligible for full refund." />
      </Head>
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-3xl mx-auto px-4">
          <div className="mb-6">
            <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-orange-500 transition-colors">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Home
            </Link>
          </div>
          <div className="bg-white rounded-2xl shadow-sm p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Refund Policy</h1>
            <p className="text-sm text-gray-400 mb-1">退款政策</p>
            <p className="text-sm text-gray-400 mb-8">Last updated: March 2026 | Effective: March 1, 2026</p>

            <div className="space-y-8 text-gray-700 text-sm leading-relaxed">

              {/* Quick summary banner */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-green-600 text-xl">✅</span>
                    <span className="font-semibold text-green-800">Full Refund Eligible</span>
                  </div>
                  <p className="text-green-700 text-xs">eSIM not yet activated — full refund available within 30 days of purchase</p>
                </div>
                <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-red-500 text-xl">❌</span>
                    <span className="font-semibold text-red-800">No Refund</span>
                  </div>
                  <p className="text-red-700 text-xs">eSIM already activated — digital goods cannot be returned once used</p>
                </div>
              </div>

              <section>
                <h2 className="text-lg font-semibold text-gray-900 mb-3">1. Digital Goods Notice</h2>
                <p>
                  SimRyoko sells <strong>eSIM data plans</strong>, which are <strong>digital products</strong> delivered
                  electronically. Once an eSIM QR code is scanned and activated on your device, the service has been
                  consumed and is no longer returnable — just like a used prepaid SIM card.
                </p>
                <p className="mt-2">
                  By completing a purchase, you acknowledge the digital nature of the product and agree to this policy.
                  Where you are an EU/UK consumer, by requesting immediate access to the digital content, you agree
                  that your right of withdrawal is lost upon activation.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-gray-900 mb-3">2. Full Refund — Eligible Cases</h2>
                <p>You are entitled to a <strong>full refund</strong> in the following situations:</p>
                <ul className="list-disc pl-5 space-y-2 mt-2">
                  <li>
                    <strong>eSIM not activated</strong> – You have not scanned the QR code or installed the eSIM
                    profile on any device, and you request a refund within <strong>30 days</strong> of purchase
                  </li>
                  <li>
                    <strong>Technical delivery failure</strong> – We failed to deliver the eSIM QR code or activation
                    instructions within 24 hours of purchase due to a technical error on our end
                  </li>
                  <li>
                    <strong>Duplicate order</strong> – You were charged twice for the same order due to a payment
                    system error (duplicate charge refund processed within 5 business days)
                  </li>
                  <li>
                    <strong>Device incompatibility (verified)</strong> – Your device does not support eSIM and this
                    was not disclosed in our compatibility warnings at the time of purchase
                    <span className="italic text-gray-500 text-xs ml-1">(assessed on a case-by-case basis)</span>
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-gray-900 mb-3">3. No Refund — Ineligible Cases</h2>
                <p>Refunds will <strong>not</strong> be issued for:</p>
                <ul className="list-disc pl-5 space-y-2 mt-2">
                  <li>eSIM that has been activated (QR code scanned and installed)</li>
                  <li>Data already consumed, even partially</li>
                  <li>Poor network performance due to local carrier conditions (outside our control)</li>
                  <li>User error (e.g., deleted eSIM profile, bought wrong region plan)</li>
                  <li>Device incompatibility where our compatibility warning was clearly displayed</li>
                  <li>Change of travel plans</li>
                  <li>Plans purchased more than 30 days ago (unactivated)</li>
                  <li>Requests made after the eSIM plan has expired</li>
                </ul>
                <div className="mt-3 bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-800">
                  <strong>Note:</strong> If you accidentally deleted your eSIM profile, we may be able to reissue the
                  eSIM at no extra charge (subject to carrier support). Please contact us before assuming a refund
                  is required.
                </div>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-gray-900 mb-3">4. Partial Refunds</h2>
                <p>Partial refunds may be granted at our sole discretion in the following situations:</p>
                <ul className="list-disc pl-5 space-y-2 mt-2">
                  <li>
                    <strong>Prolonged network outage</strong> – If a network outage by our partner carrier lasting
                    more than 48 continuous hours is confirmed, we may issue a pro-rata credit or partial refund
                  </li>
                  <li>
                    <strong>Significantly under-delivered data</strong> – If the total data delivered is measurably
                    less than 50% of the purchased plan due to a technical error (not normal speed variation)
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-gray-900 mb-3">5. How to Request a Refund</h2>
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center font-bold text-xs">1</span>
                    <div>
                      <p className="font-semibold text-gray-800">Contact us</p>
                      <p>Email <a href="mailto:xilixi@xigrocoltd.com" className="text-orange-500 hover:underline">xilixi@xigrocoltd.com</a> or
                      message <a href="https://t.me/Simryokoesimbot" target="_blank" rel="noopener" className="text-orange-500 hover:underline">@Simryokoesimbot</a> on Telegram</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center font-bold text-xs">2</span>
                    <div>
                      <p className="font-semibold text-gray-800">Provide your order details</p>
                      <p>Include your order ID, email address or Telegram ID, and a brief description of the issue</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center font-bold text-xs">3</span>
                    <div>
                      <p className="font-semibold text-gray-800">We review within 1–3 business days</p>
                      <p>Our team will assess your request and confirm eligibility</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center font-bold text-xs">4</span>
                    <div>
                      <p className="font-semibold text-gray-800">Refund processed</p>
                      <p>Approved refunds are processed within <strong>5–7 business days</strong> to the original
                      payment method (card or crypto wallet where technically possible)</p>
                    </div>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-gray-900 mb-3">6. Cryptocurrency Payment Refunds</h2>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    USDT (Tether) and TON refunds will be returned to the wallet address used for the original
                    payment, where technically possible
                  </li>
                  <li>Blockchain transaction fees are non-refundable</li>
                  <li>
                    If the original wallet cannot be verified or is inaccessible, an alternative refund method
                    (e.g., store credit or alternative wallet) may be agreed upon
                  </li>
                  <li>
                    Refund amounts are based on the USD value at the time of the original transaction, not at the
                    time of refund (to protect against crypto volatility)
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-gray-900 mb-3">7. Chargebacks & Disputes</h2>
                <p>
                  We encourage you to contact us <strong>before</strong> initiating a chargeback with your card
                  issuer or payment provider. Most issues can be resolved quickly through direct communication.
                </p>
                <p className="mt-2">
                  If a chargeback is filed without prior contact, we reserve the right to:
                </p>
                <ul className="list-disc pl-5 space-y-1 mt-2">
                  <li>Suspend access to the eSIM service pending investigation</li>
                  <li>Provide evidence to the payment processor demonstrating service delivery</li>
                  <li>Pursue recovery of fraudulent chargebacks through appropriate legal channels</li>
                </ul>
                <p className="mt-2">
                  Unresolved disputes shall be governed by Hong Kong law. See our{' '}
                  <Link href="/terms" className="text-orange-500 hover:underline">Terms of Service</Link> for the
                  full dispute resolution process.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-gray-900 mb-3">8. Contact</h2>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Email: <a href="mailto:xilixi@xigrocoltd.com" className="text-orange-500 hover:underline">xilixi@xigrocoltd.com</a></li>
                  <li>Telegram: <a href="https://t.me/Simryokoesimbot" target="_blank" rel="noopener" className="text-orange-500 hover:underline">@Simryokoesimbot</a></li>
                  <li>Response time: within 1 business day (Mon–Fri, GMT+8)</li>
                </ul>
              </section>

              <div className="border-t border-gray-100 pt-4">
                <p className="text-gray-500 text-xs">
                  Related:{' '}
                  <Link href="/terms" className="text-orange-500 hover:underline">Terms of Service</Link>
                  {' '}|{' '}
                  <Link href="/privacy" className="text-orange-500 hover:underline">Privacy Policy</Link>
                </p>
              </div>

            </div>
          </div>
        </div>
      </div>
    </>
  )
}
