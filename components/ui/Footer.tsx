'use client';

import Link from 'next/link';
import { Mail, MessageCircle, Globe, Shield } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">SR</span>
              </div>
              <span className="text-xl font-bold text-white">SimRyoko</span>
            </div>
            <p className="text-sm text-gray-400 mb-4">全球 eSIM，即时连接</p>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Shield className="w-4 h-4" />
              <span>Stripe 安全支付</span>
            </div>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">产品</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/products?tab=all" className="hover:text-white">全部产品</Link></li>
              <li><Link href="/products?tab=regional" className="hover:text-white">区域套餐</Link></li>
              <li><Link href="/products?tab=global" className="hover:text-white">全球套餐</Link></li>
              <li><Link href="/countries" className="hover:text-white">国家列表</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">支持</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/help" className="hover:text-white">帮助中心</Link></li>
              <li><Link href="/help#installation" className="hover:text-white">安装教程</Link></li>
              <li><Link href="/help#faq" className="hover:text-white">常见问题</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">联系我们</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <MessageCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <a href="https://t.me/Simryokoesimbot" target="_blank" rel="noopener noreferrer" className="hover:text-white">
                  Telegram 客服
                </a>
              </li>
              <li className="flex items-start gap-2">
                <Mail className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <a href="mailto:xilixi@xigrocoltd.com" className="hover:text-white">
                  xilixi@xigrocoltd.com
                </a>
              </li>
              <li className="flex items-start gap-2">
                <Globe className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>7×24 小时服务</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-sm text-gray-500">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p>&copy; 2026 SimRyoko. Xigro Co Limited. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <Link href="/help" className="hover:text-white">服务条款</Link>
              <Link href="/help" className="hover:text-white">隐私政策</Link>
              <Link href="/help" className="hover:text-white">退款政策</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
