'use client';
import { useState } from 'react';
import { Search, Wifi, Clock, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/router';

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
  { code: 'MY', name: '马来西亚', emoji: '🇲🇾' },
  { code: 'VN', name: '越南', emoji: '🇻🇳' },
  { code: 'ID', name: '印尼', emoji: '🇮🇩' },
  { code: 'PH', name: '菲律宾', emoji: '🇵🇭' },
  { code: 'TW', name: '台湾', emoji: '🇹🇼' },
  { code: 'HK', name: '香港', emoji: '🇭🇰' },
  { code: 'AE', name: '阿联酋', emoji: '🇦🇪' },
  { code: 'TR', name: '土耳其', emoji: '🇹🇷' },
  { code: 'CA', name: '加拿大', emoji: '🇨🇦' },
  { code: 'ES', name: '西班牙', emoji: '🇪🇸' },
];

function formatData(size: number) {
  if (!size) return '无限流量';
  if (size >= 1024) return `${(size / 1024).toFixed(0)}GB`;
  return `${size}MB`;
}

export default function FeaturedProducts({ initialProducts = [] }: { initialProducts?: any[] }) {
  const [search, setSearch] = useState('');
  const router = useRouter();

  const handleSearch = () => {
    if (search.trim()) {
      router.push(`/products?search=${encodeURIComponent(search)}`);
    }
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* 搜索框 */}
        <div className="max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-2">找到你的目的地套餐</h2>
          <p className="text-center text-gray-500 mb-6">覆盖 150+ 国家，即买即用</p>
          <div className="relative">
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="搜索国家或地区，如：日本、泰国..."
              className="w-full pl-5 pr-32 py-4 rounded-2xl border border-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400 text-base"
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
            />
            <button
              onClick={handleSearch}
              className="absolute right-2 top-1/2 -translate-y-1/2 px-5 py-2.5 bg-orange-500 text-white rounded-xl text-sm font-medium hover:bg-orange-600 transition-colors"
            >
              搜索
            </button>
          </div>
        </div>

        {/* 热门目的地 */}
        <div className="mb-12">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">🔥 热门目的地</h3>
          <div className="flex gap-3 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {POPULAR_DESTINATIONS.map(dest => (
              <Link
                key={dest.code}
                href={`/products?country=${dest.code}`}
                className="flex-shrink-0 flex flex-col items-center gap-1 px-4 py-3 bg-white rounded-2xl border border-gray-200 hover:border-orange-400 hover:shadow-md transition-all min-w-[72px]"
              >
                <span className="text-3xl">{dest.emoji}</span>
                <span className="text-xs font-medium text-gray-700 whitespace-nowrap">{dest.name}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* 热销套餐 */}
        {initialProducts.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-700">⚡ 热销套餐</h3>
              <Link href="/products" className="flex items-center gap-1 text-orange-500 hover:text-orange-600 text-sm font-medium">
                查看全部 <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {initialProducts.map((product: any) => (
                <Link
                  key={product.id}
                  href={`/product/${product.id}`}
                  className="group bg-white rounded-2xl border border-gray-200 p-4 hover:border-orange-400 hover:shadow-lg transition-all"
                >
                  <div className="flex items-center gap-2 mb-3">
                    {product.countries?.slice(0, 3).map((c: any) => (
                      <span key={c.code} className="text-2xl">
                        {c.code?.length === 2 ? c.code.toUpperCase().replace(/./g, (ch: string) =>
                          String.fromCodePoint(ch.charCodeAt(0) + 127397)) : '🌐'}
                      </span>
                    ))}
                    {product.isHot && (
                      <span className="ml-auto px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">热销</span>
                    )}
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-orange-600 text-sm min-h-[2.5rem]">
                    {product.name}
                  </h4>
                  <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
                    <span className="flex items-center gap-1">
                      <Wifi className="w-3 h-3 text-orange-400" />
                      {formatData(product.dataSize)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-orange-400" />
                      {product.validDays || product.validityDays}天
                    </span>
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
          </div>
        )}

        {/* 没有产品时显示入口 */}
        {initialProducts.length === 0 && (
          <div className="text-center">
            <Link href="/products"
              className="inline-flex items-center gap-2 px-8 py-4 bg-orange-500 text-white font-semibold rounded-2xl hover:bg-orange-600 transition-colors">
              浏览全部套餐 <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
