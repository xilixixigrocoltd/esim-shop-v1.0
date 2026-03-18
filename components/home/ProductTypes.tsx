'use client';

import { Globe, Map, MapPin } from 'lucide-react';
import Link from 'next/link';

const productTypes = [
  { id: 'local', name: '本地套餐', description: '单个国家使用，价格实惠', icon: MapPin, color: 'from-blue-500 to-blue-600', href: '/countries', stats: '2,552款' },
  { id: 'regional', name: '区域套餐', description: '多国通用，畅游整个区域', icon: Map, color: 'from-green-500 to-green-600', href: '/products/regional', stats: '134款' },
  { id: 'global', name: '全球套餐', description: '全球通用，商务出行首选', icon: Globe, color: 'from-purple-500 to-purple-600', href: '/products/global', stats: '34款' },
];

export default function ProductTypes() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">选择适合您的套餐</h2>
          <p className="text-gray-600">根据您的出行需求，选择本地、区域或全球套餐</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {productTypes.map((type) => (
            <Link key={type.id} href={type.href} className="group bg-white border border-gray-200 rounded-2xl p-6 hover:border-orange-300 hover:shadow-lg transition-all">
              <div className="w-14 h-14 bg-gray-50 rounded-xl flex items-center justify-center mb-4">
                <type.icon className="w-7 h-7 text-gray-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{type.name}</h3>
              <p className="text-gray-600 mb-4">{type.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-500">{type.stats}</span>
                <span className="text-orange-600 font-medium group-hover:translate-x-1 transition-transform">查看全部 →</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
