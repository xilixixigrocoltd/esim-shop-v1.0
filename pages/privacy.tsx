import Head from 'next/head'
import Link from 'next/link'

export default function PrivacyPage() {
  return (
    <>
      <Head>
        <title>隐私政策 - SimRyoko</title>
        <meta name="description" content="SimRyoko 隐私政策" />
      </Head>
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-3xl mx-auto px-4">
          <div className="mb-6">
            <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-orange-500 transition-colors">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              返回首页
            </Link>
          </div>
          <div className="bg-white rounded-2xl shadow-sm p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">隐私政策</h1>
            <p className="text-sm text-gray-400 mb-8">最后更新：2026年3月</p>

            <div className="space-y-6 text-gray-700 text-sm leading-relaxed">
              <section>
                <h2 className="text-lg font-semibold text-gray-900 mb-2">1. 我们收集的信息</h2>
                <ul className="list-disc pl-5 space-y-1">
                  <li><strong>邮箱地址</strong>：用于发送 eSIM 激活码及订单确认</li>
                  <li><strong>支付信息</strong>：通过 Stripe 处理，我们不存储您的卡号</li>
                  <li><strong>订单信息</strong>：购买记录、使用的套餐类型</li>
                </ul>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-gray-900 mb-2">2. 信息使用方式</h2>
                <ul className="list-disc pl-5 space-y-1">
                  <li>完成订单处理和 eSIM 交付</li>
                  <li>提供客户支持服务</li>
                  <li>发送重要的服务通知（如套餐到期提醒）</li>
                </ul>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-gray-900 mb-2">3. 信息共享</h2>
                <p>我们不会出售您的个人信息。仅在以下情况下共享：</p>
                <ul className="list-disc pl-5 mt-1 space-y-1">
                  <li>eSIM 供应商（仅为完成服务所需的最少信息）</li>
                  <li>支付处理商（Stripe）</li>
                  <li>法律要求的情况</li>
                </ul>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-gray-900 mb-2">4. 数据安全</h2>
                <p>我们采用行业标准的加密技术保护您的数据。支付信息由 Stripe 的 PCI-DSS 合规基础设施处理。</p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-gray-900 mb-2">5. Cookie</h2>
                <p>我们使用必要的 Cookie 维持您的购物车状态和语言偏好，不用于追踪广告目的。</p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-gray-900 mb-2">6. 您的权利</h2>
                <p>您可以随时要求查看、修改或删除您的个人信息。请联系我们的客服团队。</p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-gray-900 mb-2">7. 联系我们</h2>
                <ul className="list-disc pl-5 space-y-1">
                  <li>邮箱：<a href="mailto:xilixi@xigrocoltd.com" className="text-orange-500 hover:underline">xilixi@xigrocoltd.com</a></li>
                  <li>Telegram：<a href="https://t.me/Simryokoesimbot" target="_blank" rel="noopener" className="text-orange-500 hover:underline">@Simryokoesimbot</a></li>
                </ul>
              </section>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
