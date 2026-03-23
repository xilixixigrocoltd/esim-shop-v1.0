import { Mail, MessageCircle, Smartphone, AlertCircle } from 'lucide-react';
import { useI18n } from '@/lib/i18n-context';
import SEO from '@/components/ui/SEO';

export default function HelpPage() {
  const { t } = useI18n();

  return (
    <>
      <SEO
        title="帮助中心 - eSIM 安装教程与常见问题"
        description="SimRyoko 帮助中心，提供 eSIM 安装教程、设备兼容性查询、退款政策说明。遇到问题？联系我们的 24 小时客服。"
        canonical="/help"
      />
      <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 text-center mb-8">{t('help.title')}</h1>

        <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-6 text-white mb-8">
          <h2 className="text-xl font-bold mb-4">{t('help.contact.title')}</h2>
          <div className="flex flex-col sm:flex-row gap-4">
            <a href="mailto:xilixi@xigrocoltd.com" className="flex items-center gap-2 bg-white/20 rounded-xl px-4 py-3 hover:bg-white/30">
              <Mail className="w-5 h-5" />
              <span>xilixi@xigrocoltd.com</span>
            </a>
            <a href="https://t.me/Simryokoesimbot" target="_blank" rel="noopener" className="flex items-center gap-2 bg-white/20 rounded-xl px-4 py-3 hover:bg-white/30">
              <MessageCircle className="w-5 h-5" />
              <span>@Simryokoesimbot</span>
            </a>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">{t('home.faq.title')}</h2>
          <div className="space-y-6">
            {[
              { q: 'faq.what_is_esim.q', a: 'faq.what_is_esim.a' },
              { q: 'faq.check_compatibility.q', a: 'faq.check_compatibility.a' },
              { q: 'faq.installation.q', a: 'faq.installation.a' },
              { q: 'faq.usage.q', a: 'faq.usage.a' },
              { q: 'faq.refund.q', a: 'faq.refund.a' },
              { q: 'faq.topup.q', a: 'faq.topup.a' },
              { q: 'faq.contact.q', a: 'faq.contact.a' },
            ].map(({ q, a }, idx) => (
              <div key={idx} className="border-b border-gray-100 pb-6 last:border-0 last:pb-0">
                <h3 className="font-semibold text-gray-900 mb-2">{t(q)}</h3>
                <p className="text-gray-600">{t(a)}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Installation guide */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6" id="install">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            <span className="inline-flex items-center gap-2"><Smartphone className="w-5 h-5 text-orange-500" />eSIM 安装教程</span>
          </h2>
          <div className="space-y-5">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">📱 iPhone 安装步骤</h3>
              <ol className="text-gray-600 text-sm space-y-1.5 list-decimal pl-5">
                <li>前往「设置」→「蜂窝网络」→「添加 eSIM」</li>
                <li>选择「使用 QR 码」，扫描邮件中的二维码</li>
                <li>按提示完成激活，等待几分钟生效</li>
                <li>出发前在「蜂窝网络」中将旅行 eSIM 设为主要数据线路</li>
              </ol>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">🤖 Android 安装步骤</h3>
              <ol className="text-gray-600 text-sm space-y-1.5 list-decimal pl-5">
                <li>前往「设置」→「网络和互联网」→「SIM 卡」→「添加 SIM 卡」</li>
                <li>选择「扫描二维码」，扫描邮件中的二维码</li>
                <li>按提示完成激活</li>
                <li>在设置中将旅行 eSIM 设为数据 SIM 卡</li>
              </ol>
            </div>
          </div>
        </div>

        {/* Troubleshooting FAQ */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6" id="trouble">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            <span className="inline-flex items-center gap-2"><AlertCircle className="w-5 h-5 text-orange-500" />常见安装问题</span>
          </h2>
          <div className="space-y-5">
            {[
              {
                q: '扫描二维码后提示"无效的激活码"？',
                a: '每个 eSIM 二维码只能扫描一次。如果之前已尝试安装但失败，请联系客服重新获取激活码。'
              },
              {
                q: '已安装但到目的地后没有网络？',
                a: '请检查：①手机「蜂窝网络」中已选择旅行 eSIM 作为数据线路；②确保已开启「数据漫游」；③尝试重启手机后等待 1-2 分钟。'
              },
              {
                q: '手机显示不支持 eSIM？',
                a: '部分设备（如部分中国大陆销售的安卓机）不支持 eSIM，或 eSIM 被运营商锁定。请先在设置中确认是否有"添加 eSIM"选项。如确认不支持，购买前请联系客服确认。'
              },
              {
                q: '流量用完了怎么办？',
                a: '部分套餐支持续费，请在产品详情页查看。也可以重新购买新的套餐使用同一设备激活（设备一般支持多个 eSIM）。'
              },
              {
                q: '购买后多久收到激活码？',
                a: 'Stripe 支付成功后一般 5 分钟内邮件到达。USDT 支付确认后人工处理，通常在 30 分钟内。如超过 1 小时未收到，请联系客服。'
              },
            ].map(({ q, a }, idx) => (
              <div key={idx} className="border-b border-gray-100 pb-5 last:border-0 last:pb-0">
                <h3 className="font-semibold text-gray-900 mb-2 text-sm">❓ {q}</h3>
                <p className="text-gray-600 text-sm">{a}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">{t('help.contact.title')}</h2>
          <div className="space-y-3 text-gray-600">
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-orange-500" />
                <a href="mailto:xilixi@xigrocoltd.com" className="hover:text-orange-500 transition-colors">xilixi@xigrocoltd.com</a>
              </li>
              <li className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-orange-500" />
                <a href="https://t.me/Simryokoesimbot" target="_blank" rel="noopener" className="hover:text-orange-500 transition-colors">Telegram: @Simryokoesimbot</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
