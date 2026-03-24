import Head from 'next/head'
import Link from 'next/link'

export default function TermsPage() {
  return (
    <>
      <Head>
        <title>Terms of Service – SimRyoko</title>
        <meta name="description" content="SimRyoko Terms of Service – Xigro Co Limited" />
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Terms of Service</h1>
            <p className="text-sm text-gray-400 mb-1">服务条款</p>
            <p className="text-sm text-gray-400 mb-8">Last updated: March 2026 | Effective: March 1, 2026</p>

            <div className="prose prose-gray max-w-none space-y-8 text-gray-700 text-sm leading-relaxed">

              <section>
                <h2 className="text-lg font-semibold text-gray-900 mb-3">1. About Us</h2>
                <p>
                  SimRyoko is operated by <strong>Xigro Co Limited</strong>, a company incorporated in Hong Kong
                  (hereinafter "we", "us", or "the Company"). Our website is{' '}
                  <a href="https://simryoko.com" className="text-orange-500 hover:underline">simryoko.com</a> and
                  our contact email is{' '}
                  <a href="mailto:xilixi@xigrocoltd.com" className="text-orange-500 hover:underline">xilixi@xigrocoltd.com</a>.
                </p>
                <p className="mt-2">
                  By accessing our website or purchasing any product, you ("User" or "Customer") agree to be bound by
                  these Terms of Service ("Terms"). If you do not agree, please do not use our services.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-gray-900 mb-3">2. Service Description</h2>
                <p>We provide:</p>
                <ul className="list-disc pl-5 space-y-1 mt-2">
                  <li>Global eSIM data plans (digital goods) for international travel</li>
                  <li>Regional and country-specific data packages</li>
                  <li>Delivery of eSIM QR codes and activation instructions via email or Telegram bot</li>
                  <li>Customer support for activation and connectivity issues</li>
                </ul>
                <p className="mt-2">
                  eSIM plans are <strong>digital products</strong> and are delivered electronically. No physical SIM
                  card will be shipped.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-gray-900 mb-3">3. Eligibility & User Responsibilities</h2>
                <ul className="list-disc pl-5 space-y-2">
                  <li>You must be at least 18 years old to purchase our products.</li>
                  <li>You must ensure your device is eSIM-compatible and carrier-unlocked before purchase.</li>
                  <li>You are responsible for providing a valid and accurate email address for delivery.</li>
                  <li>You are responsible for safeguarding your activation QR code. We are not responsible for loss
                    resulting from your failure to keep it secure.</li>
                  <li>eSIM plans are for personal, non-commercial use only unless explicitly stated otherwise.</li>
                  <li>You agree to comply with all applicable local laws in the countries where you use the eSIM.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-gray-900 mb-3">4. Prohibited Activities</h2>
                <p>You may not use our services to:</p>
                <ul className="list-disc pl-5 space-y-2 mt-2">
                  <li>Resell, sub-license, or redistribute eSIM plans without prior written consent</li>
                  <li>Use the service for any illegal activity, including but not limited to fraud, money laundering,
                    or financing terrorism</li>
                  <li>Abuse, interfere with, or attempt to circumvent the network infrastructure of our partner carriers</li>
                  <li>Use automated tools to scrape, exploit, or abuse our platform</li>
                  <li>Provide false identity or payment information</li>
                  <li>Use the eSIM for tethering or hotspot sharing where prohibited by the specific plan terms</li>
                </ul>
                <p className="mt-2">
                  Violation of these prohibitions may result in immediate suspension of service without refund and
                  may be reported to relevant authorities.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-gray-900 mb-3">5. Payment</h2>
                <ul className="list-disc pl-5 space-y-2">
                  <li>We accept payments via <strong>Stripe</strong> (credit/debit cards), <strong>USDT</strong> (Tether),
                    and <strong>TON</strong> (Telegram Open Network).</li>
                  <li>All prices are displayed in USD unless otherwise stated. Currency conversion rates are determined
                    at the time of transaction.</li>
                  <li>Cryptocurrency payments are final and non-reversible on the blockchain. Refunds for crypto
                    payments will be processed via the same channel where technically possible, or via an alternative
                    mutually agreed method.</li>
                  <li>We reserve the right to cancel orders where we suspect fraudulent payment activity.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-gray-900 mb-3">6. Device Compatibility</h2>
                <p>
                  It is your sole responsibility to verify eSIM compatibility before purchase. We strongly recommend
                  checking your device model against our compatibility list or contacting support prior to purchase.
                  Common requirements include:
                </p>
                <ul className="list-disc pl-5 space-y-1 mt-2">
                  <li>Device must support eSIM technology</li>
                  <li>Device must be carrier-unlocked</li>
                  <li>Operating system must support eSIM profile installation</li>
                </ul>
                <p className="mt-2">
                  Refunds due to device incompatibility will be assessed on a case-by-case basis in accordance with
                  our <Link href="/refund" className="text-orange-500 hover:underline">Refund Policy</Link>.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-gray-900 mb-3">7. Service Limitations & Disclaimer</h2>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Advertised speeds are theoretical maximums. Actual speeds vary based on local network conditions,
                    congestion, and device capability.</li>
                  <li>We do not guarantee uninterrupted service. Coverage maps are indicative and may not reflect
                    real-time conditions.</li>
                  <li>We are not liable for service disruptions caused by force majeure events including but not
                    limited to: natural disasters, government actions, carrier network outages, or regulatory changes.</li>
                  <li>Some plans may not support voice calls or SMS. Please verify plan specifications before purchase.</li>
                  <li>To the maximum extent permitted by applicable law, our total liability to you shall not exceed
                    the amount you paid for the specific product giving rise to the claim.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-gray-900 mb-3">8. Intellectual Property</h2>
                <p>
                  All content on simryoko.com, including but not limited to text, graphics, logos, and software, is
                  the property of Xigro Co Limited or its licensors and is protected by applicable intellectual
                  property laws. You may not reproduce, distribute, or create derivative works without our written consent.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-gray-900 mb-3">9. Modifications to Terms</h2>
                <p>
                  We reserve the right to update these Terms at any time. Changes will be effective upon posting to
                  this page with an updated date. Continued use of our services after changes constitutes acceptance
                  of the new Terms. For material changes, we will endeavour to notify registered users via email.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-gray-900 mb-3">10. Governing Law & Dispute Resolution</h2>
                <p>
                  These Terms are governed by and construed in accordance with the laws of the <strong>Hong Kong
                  Special Administrative Region</strong>, without regard to its conflict of law provisions.
                </p>
                <p className="mt-2">
                  In the event of any dispute arising from or in connection with these Terms or our services, the
                  parties shall first attempt to resolve the matter amicably through negotiation. If unresolved
                  within 30 days, the dispute shall be submitted to the exclusive jurisdiction of the courts of
                  Hong Kong.
                </p>
                <p className="mt-2">
                  For EU/UK consumers, nothing in these Terms affects your statutory rights under applicable consumer
                  protection laws.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-gray-900 mb-3">11. Contact Us</h2>
                <p>For questions regarding these Terms, please contact:</p>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li>
                    <strong>Xigro Co Limited</strong> — Hong Kong
                  </li>
                  <li>
                    Email:{' '}
                    <a href="mailto:xilixi@xigrocoltd.com" className="text-orange-500 hover:underline">
                      xilixi@xigrocoltd.com
                    </a>
                  </li>
                  <li>
                    Telegram:{' '}
                    <a href="https://t.me/Simryokoesimbot" target="_blank" rel="noopener" className="text-orange-500 hover:underline">
                      @Simryokoesimbot
                    </a>
                  </li>
                </ul>
                <p className="mt-3 text-gray-500 text-xs">
                  Also see: <Link href="/privacy" className="text-orange-500 hover:underline">Privacy Policy</Link>
                  {' '}|{' '}
                  <Link href="/refund" className="text-orange-500 hover:underline">Refund Policy</Link>
                </p>
              </section>

            </div>
          </div>
        </div>
      </div>
    </>
  )
}
