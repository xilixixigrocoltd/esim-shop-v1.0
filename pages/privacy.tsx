import Head from 'next/head'
import Link from 'next/link'

export default function PrivacyPage() {
  return (
    <>
      <Head>
        <title>Privacy Policy – SimRyoko</title>
        <meta name="description" content="SimRyoko Privacy Policy – Xigro Co Limited. GDPR and PDPO compliant." />
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
            <p className="text-sm text-gray-400 mb-1">隐私政策</p>
            <p className="text-sm text-gray-400 mb-2">Last updated: March 2026 | Effective: March 1, 2026</p>
            <p className="text-xs text-gray-400 mb-8 bg-blue-50 border border-blue-100 rounded-lg p-3">
              This Privacy Policy complies with the <strong>Hong Kong Personal Data (Privacy) Ordinance (PDPO, Cap. 486)</strong>{' '}
              and, to the extent applicable, the <strong>EU General Data Protection Regulation (GDPR)</strong> and{' '}
              the <strong>UK GDPR</strong>.
            </p>

            <div className="space-y-8 text-gray-700 text-sm leading-relaxed">

              <section>
                <h2 className="text-lg font-semibold text-gray-900 mb-3">1. Data Controller</h2>
                <p>
                  The data controller responsible for your personal data is:
                </p>
                <div className="mt-2 bg-gray-50 rounded-lg p-4 text-sm">
                  <p><strong>Xigro Co Limited</strong></p>
                  <p>Registered in Hong Kong</p>
                  <p>Website: <a href="https://simryoko.com" className="text-orange-500 hover:underline">simryoko.com</a></p>
                  <p>Contact: <a href="mailto:xilixi@xigrocoltd.com" className="text-orange-500 hover:underline">xilixi@xigrocoltd.com</a></p>
                </div>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-gray-900 mb-3">2. Data We Collect</h2>
                <p>We collect only the data necessary to provide our services:</p>

                <div className="mt-3 space-y-4">
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">2.1 Data You Provide Directly</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      <li><strong>Email address</strong> – required to deliver your eSIM activation code and order confirmations</li>
                      <li><strong>Payment information</strong> – processed by Stripe (for card payments); we do not store your card number, CVV, or bank details</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">2.2 Data Collected via Telegram Bot</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      <li><strong>Telegram user ID (TG ID)</strong> – unique identifier used to associate your order with your Telegram account</li>
                      <li><strong>Telegram username</strong> – used for customer support communication</li>
                      <li>We do not collect your Telegram phone number or contacts</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">2.3 Data Collected Automatically</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      <li><strong>IP address</strong> – used for fraud prevention and AML (Anti-Money Laundering) compliance</li>
                      <li><strong>Browser type and device information</strong> – for security and compatibility purposes</li>
                      <li><strong>Cookies</strong> – limited to session management and language preference (no advertising cookies)</li>
                      <li><strong>Transaction data</strong> – for cryptocurrency payments: wallet address, transaction hash (tx_hash), and amount</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">2.4 Data We Do NOT Collect</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>We do not collect passport, national ID, or government-issued documents</li>
                      <li>We do not collect biometric data</li>
                      <li>We do not collect data on children under 18</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-gray-900 mb-3">3. How We Use Your Data</h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs border-collapse mt-2">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="text-left p-2 border border-gray-200 font-semibold">Purpose</th>
                        <th className="text-left p-2 border border-gray-200 font-semibold">Data Used</th>
                        <th className="text-left p-2 border border-gray-200 font-semibold">Legal Basis (GDPR)</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="p-2 border border-gray-200">Order fulfilment & eSIM delivery</td>
                        <td className="p-2 border border-gray-200">Email, TG ID</td>
                        <td className="p-2 border border-gray-200">Contract performance</td>
                      </tr>
                      <tr className="bg-gray-50">
                        <td className="p-2 border border-gray-200">Payment processing</td>
                        <td className="p-2 border border-gray-200">Payment data, IP address</td>
                        <td className="p-2 border border-gray-200">Contract performance</td>
                      </tr>
                      <tr>
                        <td className="p-2 border border-gray-200">Customer support</td>
                        <td className="p-2 border border-gray-200">Email, TG username, order info</td>
                        <td className="p-2 border border-gray-200">Legitimate interest</td>
                      </tr>
                      <tr className="bg-gray-50">
                        <td className="p-2 border border-gray-200">Fraud prevention & AML compliance</td>
                        <td className="p-2 border border-gray-200">IP address, tx_hash, payment method</td>
                        <td className="p-2 border border-gray-200">Legal obligation / Legitimate interest</td>
                      </tr>
                      <tr>
                        <td className="p-2 border border-gray-200">Service improvement</td>
                        <td className="p-2 border border-gray-200">Aggregated, anonymised usage data</td>
                        <td className="p-2 border border-gray-200">Legitimate interest</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-gray-900 mb-3">4. Data Sharing</h2>
                <p>We <strong>do not sell</strong> your personal data. We share data only as follows:</p>
                <ul className="list-disc pl-5 space-y-2 mt-2">
                  <li>
                    <strong>eSIM network partners</strong> – minimum data (email or activation code delivery reference)
                    necessary to provision the eSIM service
                  </li>
                  <li>
                    <strong>Stripe, Inc.</strong> – payment processing. Subject to Stripe's own{' '}
                    <a href="https://stripe.com/privacy" target="_blank" rel="noopener" className="text-orange-500 hover:underline">
                      Privacy Policy
                    </a>
                  </li>
                  <li>
                    <strong>Blockchain networks</strong> – cryptocurrency transaction data (wallet address, tx_hash) is
                    recorded on public blockchains (USDT/TON) as an inherent feature of the technology
                  </li>
                  <li>
                    <strong>Legal authorities</strong> – when required by law, court order, or regulatory request in
                    Hong Kong or applicable jurisdictions
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-gray-900 mb-3">5. Data Retention</h2>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Order records and associated personal data are retained for <strong>7 years</strong> to comply
                    with Hong Kong tax and business record-keeping requirements</li>
                  <li>AML transaction logs (including IP address, tx_hash) are retained for <strong>6 years</strong>{' '}
                    in accordance with applicable financial regulations</li>
                  <li>Marketing communications data (if any) is deleted upon unsubscribe request</li>
                  <li>Session cookies are deleted when you close your browser</li>
                </ul>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-gray-900 mb-3">6. Your Rights</h2>
                <p>Depending on your jurisdiction, you have the following rights:</p>
                <ul className="list-disc pl-5 space-y-2 mt-2">
                  <li><strong>Access</strong> – request a copy of the personal data we hold about you</li>
                  <li><strong>Correction</strong> – request correction of inaccurate data (PDPO Data Protection Principle 3)</li>
                  <li><strong>Erasure / Right to be Forgotten</strong> – request deletion of your data, subject to our
                    legal retention obligations (GDPR Art. 17)</li>
                  <li><strong>Restriction</strong> – request that we restrict processing of your data</li>
                  <li><strong>Portability</strong> – receive your data in a machine-readable format (GDPR Art. 20)</li>
                  <li><strong>Objection</strong> – object to processing based on legitimate interest</li>
                  <li><strong>Opt-out of marketing</strong> – at any time, free of charge</li>
                </ul>
                <p className="mt-3">
                  To exercise any right, email us at{' '}
                  <a href="mailto:xilixi@xigrocoltd.com" className="text-orange-500 hover:underline">
                    xilixi@xigrocoltd.com
                  </a>{' '}
                  with subject line "Privacy Request". We will respond within <strong>30 days</strong> (or 40 days
                  for complex requests under PDPO).
                </p>
                <p className="mt-2">
                  <strong>Deletion requests:</strong> We can delete your email, TG ID, and username from our active
                  databases upon request. Note that transaction records required for legal compliance cannot be deleted
                  during their mandatory retention period.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-gray-900 mb-3">7. Security</h2>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Data is encrypted in transit (TLS 1.2+) and at rest</li>
                  <li>Payment data is handled by PCI-DSS compliant Stripe infrastructure</li>
                  <li>Access to personal data is restricted to authorised personnel only</li>
                  <li>We conduct periodic security reviews of our systems</li>
                </ul>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-gray-900 mb-3">8. International Transfers</h2>
                <p>
                  Your data may be processed in servers located outside Hong Kong (e.g., cloud infrastructure in the US
                  or EU). When transferring data outside the EEA, we ensure appropriate safeguards are in place, such as
                  Standard Contractual Clauses (SCCs) approved by the European Commission.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-gray-900 mb-3">9. Cookies</h2>
                <p>We use only essential cookies:</p>
                <ul className="list-disc pl-5 space-y-1 mt-2">
                  <li><strong>Shopping cart session</strong> – maintains cart contents during your visit</li>
                  <li><strong>Language preference</strong> – remembers your language selection</li>
                  <li><strong>Authentication token</strong> – keeps you logged in during a session</li>
                </ul>
                <p className="mt-2">We do not use advertising, tracking, or third-party analytics cookies.</p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-gray-900 mb-3">10. Complaints</h2>
                <p>
                  If you believe we have not handled your personal data correctly, you may lodge a complaint with:
                </p>
                <ul className="list-disc pl-5 space-y-1 mt-2">
                  <li>
                    <strong>Hong Kong:</strong> Office of the Privacy Commissioner for Personal Data (PCPD) –{' '}
                    <a href="https://www.pcpd.org.hk" target="_blank" rel="noopener" className="text-orange-500 hover:underline">
                      www.pcpd.org.hk
                    </a>
                  </li>
                  <li>
                    <strong>EU/UK residents:</strong> Your local Data Protection Authority
                  </li>
                </ul>
                <p className="mt-2">
                  We encourage you to contact us first at{' '}
                  <a href="mailto:xilixi@xigrocoltd.com" className="text-orange-500 hover:underline">
                    xilixi@xigrocoltd.com
                  </a>{' '}
                  and we will do our best to resolve any concern promptly.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-gray-900 mb-3">11. Changes to This Policy</h2>
                <p>
                  We may update this Privacy Policy from time to time. Significant changes will be notified via email
                  or a prominent notice on our website at least 14 days before taking effect.
                </p>
              </section>

              <div className="border-t border-gray-100 pt-4">
                <p className="text-gray-500 text-xs">
                  Related:{' '}
                  <Link href="/terms" className="text-orange-500 hover:underline">Terms of Service</Link>
                  {' '}|{' '}
                  <Link href="/refund" className="text-orange-500 hover:underline">Refund Policy</Link>
                </p>
              </div>

            </div>
          </div>
        </div>
      </div>
    </>
  )
}
