import Head from 'next/head'
import Link from 'next/link'

export default function TermsPage() {
  return (
    <>
      <Head>
        <title>服务条款 - SimRyoko</title>
        <meta name="description" content="SimRyoko 服务条款" />
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">服务条款</h1>
            <p className="text-sm text-gray-400 mb-8">最后更新：2026年3月</p>

            <div className="prose prose-gray max-w-none space-y-6 text-gray-700 text-sm leading-relaxed">
              <section>
                <h2 className="text-lg font-semibold text-gray-900 mb-2">1. 服务说明</h2>
                <p>SimRyoko（以下简称"我们"）由 Xigro Co Limited 运营，提供全球 eSIM 数据套餐的销售服务。购买我们的产品即表示您同意本服务条款。</p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-gray-900 mb-2">2. 产品使用</h2>
                <ul className="list-disc pl-5 space-y-1">
                  <li>eSIM 套餐仅限个人合法使用</li>
                  <li>购买后将通过邮件发送激活码及安装教程</li>
                  <li>eSIM 激活后即开始计算有效期</li>
                  <li>部分套餐不支持通话和短信，请购买前确认</li>
                </ul>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-gray-900 mb-2">3. 退款政策</h2>
                <ul className="list-disc pl-5 space-y-1">
                  <li>eSIM 激活前如遇技术问题，可申请全额退款</li>
                  <li>eSIM 一旦激活使用，不支持退款</li>
                  <li>退款申请请联系客服，处理时间为 1-3 个工作日</li>
                </ul>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-gray-900 mb-2">4. 设备兼容性</h2>
                <p>请在购买前确认您的设备支持 eSIM 功能，且未被运营商锁定。因设备不兼容导致无法使用，我们将酌情处理退款申请。</p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-gray-900 mb-2">5. 免责声明</h2>
                <p>我们不对因不可抗力（如当地运营商网络故障、政策变动）导致的服务中断承担责任。实际网速受当地网络环境影响，仅供参考。</p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-gray-900 mb-2">6. 联系我们</h2>
                <p>如有疑问，请联系：</p>
                <ul className="list-disc pl-5 mt-1 space-y-1">
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
