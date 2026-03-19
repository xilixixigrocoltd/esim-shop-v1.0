import { Mail, MessageCircle } from 'lucide-react';
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
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">{t('faq.what_is_esim.q')}</h3>
              <p className="text-gray-600">{t('faq.what_is_esim.a')}</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">{t('faq.check_compatibility.q')}</h3>
              <p className="text-gray-600">{t('faq.check_compatibility.a')}</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">{t('faq.installation.q')}</h3>
              <ol className="list-decimal list-inside text-gray-600 mt-2 space-y-1">
                <li>{t('product.detail.terms.item1')}</li>
                <li>{t('help.install.iphone')}</li>
                <li>{t('product.detail.installation')}</li>
                <li>{t('product.detail.coverage')}</li>
              </ol>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">{t('faq.refund.q')}</h3>
              <p className="text-gray-600">{t('faq.refund.a')}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">{t('help.contact.title')}</h2>
          <div className="space-y-3 text-gray-600">
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-orange-500" />
                <span>xilixi@xigrocoltd.com</span>
              </li>
              <li className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-orange-500" />
                <span>Telegram: @Simryokoesimbot</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
