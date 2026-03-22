'use client';

import { useState, useEffect } from 'react';
import { Search, Wifi, Clock, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { getCountryFlag, formatDataSize } from '@/lib/api';

const POPULAR_DESTINATIONS = [
  { code: 'JP', name: '日本', emoji: '🇯🇵' },
  { code: 'KR', name: '韩国', emoji: '🇰🇷' },
  { code: 'TH', name: '泰国', emoji: '🇹🇭' },
  { code: 'SG', name: '新加坡', emoji: '🇸🇬' },
  { code: 'US', name: '美国', emoji: '🇺🇸' },
  { code: 'GB', name: '英国', emoji: '🇬🇧' },
  { code: 'AU', name: '澳大利亚', emoji: '🇦🇺' },
  { code: 'DE', name: '德国', emoji: '🇩🇪' },
  { code: 'FR', name: '法国', emoji: '🇫🇷' },
  { code: 'IT', name: '意大利', emoji: '🇮🇹' },
];

export default function FeaturedProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch('/api/products?pageSize=6')
      .then(r => r.json())
      .then(d => {
        const list = Array.isArray(d.data) ? d.data.slice(0, 6) : [];
        setProducts(list);
        setLoading(false);
      })
      .catch((err) => {
        console.error('FeaturedProducts fetch error:', err);
        setLoading(false);
      });
  }, []);

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* 搜索框 */}
        <div className="max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-3">找到你的目的地套餐</h2>
          <p className="text-center text-gray-500 mb-6">覆盖 150+ 国家，即买即用</p>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="搜索国家或地区..."
              className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400 text-lg"
              onKeyDown={e => {
                if (e.key === 'Enter' && search.trim()) {
                  window.location.href = `/products?search=${encodeURIComponent(search)}`;
                }
              }}
            />
            {search && (
              <button
                onClick={() => window.location.href = `/products?search=${encodeURIComponent(search)}`}
                className="absolute right-3 top-1/2 -translate-y-1/2 px-4 py-2 bg-orange-500 text-white rounded-xl text-sm font-medium hover:bg-orange-600"
              >
                搜索
              </button>
            )}
          </div>
        </div>

        {/* 热门目的地横向滚动 */}
        <div className="mb-12">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">🔥 热门目的地</h3>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {POPULAR_DESTINATIONS.map(dest => (
              <Link
                key={dest.code}
                href={`/country/${dest.code.toLowerCase()}`}
                className="flex-shrink-0 flex flex-col items-center gap-1 px-4 py-3 bg-white rounded-2xl border border-gray-200 hover:border-orange-400 hover:shadow-md transition-all min-w-[80px]"
              >
                <span className="text-3xl">{dest.emoji}</span>
                <span className="text-xs font-medium text-gray-700">{dest.name}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* 热销套餐 */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-700">⚡ 热销套餐</h3>
            <Link href="/products" className="flex items-center gap-1 text-orange-500 hover:text-orange-600 text-sm font-medium">
              查看全部 <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1,2,3].map(i => (
                <div key={i} className="bg-white rounded-xl border border-gray-200 p-4 animate-pulse">
                  <div className="h-8 bg-gray-200 rounded mb-3 w-1/2" />
                  <div className="h-4 bg-gray-200 rounded mb-2" />
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map(product => (
                <Link
                  key={product.id}
                  href={`/product/${product.id}`}
                  className="group bg-white rounded-xl border border-gray-200 p-4 hover:border-orange-400 hover:shadow-lg transition-all"
                >
                  <div className="flex items-center gap-2 mb-3">
                    {product.countries?.slice(0, 3).map((c: any) => (
                      <span key={c.code} className="text-2xl">{getCountryFlag(c.code)}</span>
                    ))}
                    {product.isHot && (
                      <span className="ml-auto px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">热销</span>
                    )}
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-orange-600 text-sm">
                    {product.name}
                  </h4>
                  <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
                    <span className="flex items-center gap-1"><Wifi className="w-3 h-3 text-orange-400" />{formatDataSize(product.dataSize)}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3 text-orange-400" />{product.validDays || product.validityDays}天</span>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <span className="text-xl font-bold text-orange-600">${Number(product.price || 0).toFixed(2)}</span>
                    <span className="px-3 py-1.5 bg-orange-50 text-orange-600 text-xs font-medium rounded-lg group-hover:bg-orange-500 group-hover:text-white transition-colors">
                      立即购买
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
