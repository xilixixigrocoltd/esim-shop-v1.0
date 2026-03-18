'use client';

import Link from 'next/link';
import { Mail, MessageCircle } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">SR</span>
              </div>
              <span className="text-xl font-bold text-white">SimRyoko</span>
            </div>
            <p className="text-sm text-gray-400 mb-4">全球eSIM，即时连接</p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">产品</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/countries" className="hover:text-white">国家套餐</Link></li>
              <li><Link href="/help" className="hover:text-white">帮助中心</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">联系我们</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2"><Mail className="w-4 h-4" /> xilixi@xigrocoltd.com</li>
              <li className="flex items-center gap-2"><MessageCircle className="w-4 h-4" /> @Simryokoesimbot</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-sm text-gray-500 text-center">
          <p>&copy; 2026 SimRyoko. Xigro Co Limited</p>
        </div>
      </div>
    </footer>
  );
}
