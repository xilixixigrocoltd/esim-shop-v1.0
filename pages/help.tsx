import { Mail, MessageCircle } from 'lucide-react';

export default function HelpPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 text-center mb-8">帮助中心</h1>

        <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-6 text-white mb-8">
          <h2 className="text-xl font-bold mb-4">需要帮助？</h2>
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
          <h2 className="text-xl font-bold text-gray-900 mb-6">常见问题</h2>
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">什么是eSIM？</h3>
              <p className="text-gray-600">eSIM是嵌入式SIM卡，无需实体卡片，通过二维码即可激活使用。</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">我的设备支持eSIM吗？</h3>
              <p className="text-gray-600">iPhone XS及更新机型、iPad Pro/Air/Mini (蜂窝版)、Google Pixel 3+、Samsung Galaxy S20+ 等设备支持。</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">如何安装eSIM？</h3>
              <ol className="list-decimal list-inside text-gray-600 mt-2 space-y-1">
                <li>购买后查收邮件，保存二维码</li>
                <li>打开手机设置 - 蜂窝网络</li>
                <li>点击添加eSIM</li>
                <li>扫描二维码完成安装</li>
                <li>开启数据漫游即可使用</li>
              </ol>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">可以退款吗？</h3>
              <p className="text-gray-600">未激活的eSIM可在7天内申请退款。已安装或已激活的eSIM不可退款。</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">联系我们</h2>
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
  );
}
