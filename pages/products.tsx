'use client';

import { useState, useEffect } from 'react';
import { Search, ChevronLeft, Wifi, Clock, MapPin, Globe } from 'lucide-react';
import type { Product } from '@/types';
import SEO from '@/components/ui/SEO';
import Link from 'next/link';

// 大洲分类
const CONTINENTS = [
  {
    id: 'asia', name: '亚洲', icon: '🌏',
    countries: [
      { code: 'JP', name: '日本', flag: '🇯🇵' },
      { code: 'KR', name: '韩国', flag: '🇰🇷' },
      { code: 'TH', name: '泰国', flag: '🇹🇭' },
      { code: 'SG', name: '新加坡', flag: '🇸🇬' },
      { code: 'MY', name: '马来西亚', flag: '🇲🇾' },
      { code: 'VN', name: '越南', flag: '🇻🇳' },
      { code: 'ID', name: '印度尼西亚', flag: '🇮🇩' },
      { code: 'PH', name: '菲律宾', flag: '🇵🇭' },
      { code: 'IN', name: '印度', flag: '🇮🇳' },
      { code: 'HK', name: '香港', flag: '🇭🇰' },
      { code: 'TW', name: '台湾', flag: '🇹🇼' },
      { code: 'MO', name: '澳门', flag: '🇲🇴' },
      { code: 'KH', name: '柬埔寨', flag: '🇰🇭' },
      { code: 'MM', name: '缅甸', flag: '🇲🇲' },
      { code: 'LK', name: '斯里兰卡', flag: '🇱🇰' },
    ]
  },
  {
    id: 'europe', name: '欧洲', icon: '🇪🇺',
    countries: [
      { code: 'GB', name: '英国', flag: '🇬🇧' },
      { code: 'FR', name: '法国', flag: '🇫🇷' },
      { code: 'DE', name: '德国', flag: '🇩🇪' },
      { code: 'IT', name: '意大利', flag: '🇮🇹' },
      { code: 'ES', name: '西班牙', flag: '🇪🇸' },
      { code: 'PT', name: '葡萄牙', flag: '🇵🇹' },
      { code: 'NL', name: '荷兰', flag: '🇳🇱' },
      { code: 'CH', name: '瑞士', flag: '🇨🇭' },
      { code: 'AT', name: '奥地利', flag: '🇦🇹' },
      { code: 'GR', name: '希腊', flag: '🇬🇷' },
      { code: 'SE', name: '瑞典', flag: '🇸🇪' },
      { code: 'NO', name: '挪威', flag: '🇳🇴' },
      { code: 'TR', name: '土耳其', flag: '🇹🇷' },
    ]
  },
  {
    id: 'americas', name: '美洲', icon: '🌎',
    countries: [
      { code: 'US', name: '美国', flag: '🇺🇸' },
      { code: 'CA', name: '加拿大', flag: '🇨🇦' },
      { code: 'MX', name: '墨西哥', flag: '🇲🇽' },
      { code: 'BR', name: '巴西', flag: '🇧🇷' },
      { code: 'AR', name: '阿根廷', flag: '🇦🇷' },
      { code: 'CL', name: '智利', flag: '🇨🇱' },
      { code: 'CO', name: '哥伦比亚', flag: '🇨🇴' },
    ]
  },
  {
    id: 'mideast', name: '中东', icon: '🕌',
    countries: [
      { code: 'AE', name: '阿联酋', flag: '🇦🇪' },
      { code: 'SA', name: '沙特', flag: '🇸🇦' },
      { code: 'IL', name: '以色列', flag: '🇮🇱' },
      { code: 'QA', name: '卡塔尔', flag: '🇶🇦' },
      { code: 'KW', name: '科威特', flag: '🇰🇼' },
      { code: 'BH', name: '巴林', flag: '🇧🇭' },
      { code: 'OM', name: '阿曼', flag: '🇴🇲' },
    ]
  },
  {
    id: 'africa', name: '非洲', icon: '🌍',
    countries: [
      { code: 'ZA', name: '南非', flag: '🇿🇦' },
      { code: 'EG', name: '埃及', flag: '🇪🇬' },
      { code: 'KE', name: '肯尼亚', flag: '🇰🇪' },
      { code: 'MA', name: '摩洛哥', flag: '🇲🇦' },
    ]
  },
  {
    id: 'oceania', name: '大洋洲', icon: '🏝️',
    countries: [
      { code: 'AU', name: '澳大利亚', flag: '🇦🇺' },
      { code: 'NZ', name: '新西兰', flag: '🇳🇿' },
    ]
  },
  {
    id: 'global', name: '全球套餐', icon: '🌐',
    countries: []
  },
];

type Level = 'continent' | 'country' | 'products';

function formatData(size: number) {
  if (!size) return '无限';
  if (size >= 1024) return `${(size / 1024).toFixed(0)}GB`;
  return `${size}MB`;
}

export default function ProductsPage() {
  const [level, setLevel] = useState<Level>('continent');
  const [selectedContinent, setSelectedContinent] = useState<typeof CONTINENTS[0] | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<{ code: string; name: string; flag: string } | null>(null);
  const [products, setProducts] = useState<{ local: Product[], regional: Product[], global: Product[] }>({ local: [], regional: [], global: [] });
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState<Product[] | null>(null);
  const [activeType, setActiveType] = useState<'local' | 'regional' | 'global'>('local');

  // 选择大洲
  const selectContinent = (c: typeof CONTINENTS[0]) => {
    if (c.id === 'global') {
      setSelectedContinent(c);
      setLevel('products');
      loadGlobal();
    } else {
      setSelectedContinent(c);
      setLevel('country');
    }
  };

  // 选择国家
  const selectCountry = async (country: { code: string; name: string; flag: string }) => {
    setSelectedCountry(country);
    setLevel('products');
    setLoading(true);
    setActiveType('local');
    try {
      const res = await fetch(`/api/products/by-country/${country.code}`);
      const json = await res.json();
      if (json.success) {
        setProducts({
          local: json.data.local || [],
          regional: json.data.regional || [],
          global: json.data.global || [],
        });
        // 自动选择有产品的tab
        if ((json.data.local || []).length > 0) setActiveType('local');
        else if ((json.data.regional || []).length > 0) setActiveType('regional');
        else setActiveType('global');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  // 加载全球套餐
  const loadGlobal = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/products/global');
      const json = await res.json();
      setProducts({ local: [], regional: [], global: json.data || [] });
      setActiveType('global');
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  // 搜索
  const handleSearch = async () => {
    if (!search.trim()) { setSearchResults(null); return; }
    setLoading(true);
    try {
      const res = await fetch(`/api/products?search=${encodeURIComponent(search)}&pageSize=100`);
      const json = await res.json();
      setSearchResults(json.data || []);
    } catch (e) {
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  const currentProducts = activeType === 'local' ? products.local
    : activeType === 'regional' ? products.regional
    : products.global;

  return (
    <>
      <SEO title="全球 eSIM 套餐 - 150+ 国家" description="覆盖150+国家的eSIM套餐" canonical="/products" />
      <div className="min-h-screen bg-gray-50">

        {/* 顶部搜索 */}
        <div className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
          <div className="max-w-4xl mx-auto px-4 py-3">
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSearch()}
                  placeholder="搜索国家或套餐..."
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
              </div>
              <button onClick={handleSearch} className="px-4 py-2.5 bg-orange-500 text-white rounded-xl font-medium hover:bg-orange-600">
                搜索
              </button>
              {searchResults && (
                <button onClick={() => { setSearchResults(null); setSearch(''); }} className="px-3 py-2.5 bg-gray-100 text-gray-600 rounded-xl">
                  清除
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-6">

          {/* 搜索结果 */}
          {searchResults && (
            <div>
              <p className="text-sm text-gray-500 mb-4">找到 {searchResults.length} 个结果</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {searchResults.map(p => <ProductCard key={p.id} product={p} />)}
              </div>
            </div>
          )}

          {/* 第一级：大洲选择 */}
          {!searchResults && level === 'continent' && (
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-4">选择目的地</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {CONTINENTS.map(c => (
                  <button key={c.id} onClick={() => selectContinent(c)}
                    className="bg-white rounded-2xl p-5 border border-gray-200 hover:border-orange-400 hover:shadow-md transition-all text-center">
                    <span className="text-4xl mb-2 block">{c.icon}</span>
                    <p className="font-semibold text-gray-900">{c.name}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 第二级：国家选择 */}
          {!searchResults && level === 'country' && selectedContinent && (
            <div>
              <button onClick={() => setLevel('continent')} className="flex items-center gap-1 text-orange-500 mb-4 hover:text-orange-600">
                <ChevronLeft className="w-4 h-4" /> 返回大洲
              </button>
              <h2 className="text-lg font-bold text-gray-900 mb-4">{selectedContinent.icon} {selectedContinent.name}</h2>
              <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-3">
                {selectedContinent.countries.map(c => (
                  <button key={c.code} onClick={() => selectCountry(c)}
                    className="bg-white rounded-2xl p-4 border border-gray-200 hover:border-orange-400 hover:shadow-md transition-all text-center">
                    <span className="text-3xl mb-1 block">{c.flag}</span>
                    <p className="text-xs font-medium text-gray-700">{c.name}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 第三级：产品列表 */}
          {!searchResults && level === 'products' && (
            <div>
              <button onClick={() => {
                if (selectedContinent?.id === 'global') setLevel('continent');
                else setLevel('country');
              }} className="flex items-center gap-1 text-orange-500 mb-4 hover:text-orange-600">
                <ChevronLeft className="w-4 h-4" /> 返回{selectedContinent?.id === 'global' ? '大洲' : '国家列表'}
              </button>

              <div className="flex items-center gap-3 mb-4">
                {selectedCountry && <span className="text-3xl">{selectedCountry.flag}</span>}
                <h2 className="text-lg font-bold text-gray-900">
                  {selectedCountry?.name || '全球'} 套餐
                </h2>
              </div>

              {/* 类型 tab */}
              <div className="flex gap-2 mb-5">
                {[
                  { key: 'local', label: `本地 (${products.local.length})` },
                  { key: 'regional', label: `区域 (${products.regional.length})` },
                  { key: 'global', label: `全球 (${products.global.length})` },
                ].filter(t => {
                  if (t.key === 'local') return products.local.length > 0;
                  if (t.key === 'regional') return products.regional.length > 0;
                  return products.global.length > 0;
                }).map(t => (
                  <button key={t.key} onClick={() => setActiveType(t.key as any)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      activeType === t.key ? 'bg-orange-500 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:border-orange-300'
                    }`}>
                    {t.label}
                  </button>
                ))}
              </div>

              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="bg-white rounded-2xl p-4 border animate-pulse">
                      <div className="h-4 bg-gray-200 rounded mb-2 w-3/4" />
                      <div className="h-3 bg-gray-200 rounded mb-1 w-1/2" />
                      <div className="h-6 bg-gray-200 rounded mt-3 w-1/3" />
                    </div>
                  ))}
                </div>
              ) : currentProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {currentProducts.map(p => <ProductCard key={p.id} product={p} />)}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-400">暂无套餐</div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

function ProductCard({ product }: { product: Product }) {
  function formatData(size: number) {
    if (!size) return '无限流量';
    if (size >= 1024) return `${(size / 1024).toFixed(0)}GB`;
    return `${size}MB`;
  }

  return (
    <Link href={`/product/${product.id}`}
      className="group bg-white rounded-2xl border border-gray-200 p-4 hover:border-orange-400 hover:shadow-lg transition-all block">
      <div className="flex items-start justify-between mb-3">
        <div className="flex gap-1 flex-wrap">
          {product.countries?.slice(0, 4).map((c: any) => (
            <span key={c.code} className="text-xl">{getFlag(c.code)}</span>
          ))}
          {product.countries && product.countries.length > 4 && (
            <span className="text-xs text-gray-400 self-end">+{product.countries.length - 4}</span>
          )}
        </div>
        {product.isHot && <span className="px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">热销</span>}
      </div>

      <h3 className="font-semibold text-gray-900 text-sm mb-3 line-clamp-2 group-hover:text-orange-600 min-h-[2.5rem]">
        {product.name}
      </h3>

      <div className="flex gap-3 text-xs text-gray-500 mb-3">
        <span className="flex items-center gap-1">
          <Wifi className="w-3 h-3 text-orange-400" />
          {formatData(product.dataSize)}
        </span>
        <span className="flex items-center gap-1">
          <Clock className="w-3 h-3 text-orange-400" />
          {product.validDays}天
        </span>
        {product.countries && product.countries.length > 1 && (
          <span className="flex items-center gap-1">
            <MapPin className="w-3 h-3 text-orange-400" />
            {product.countries.length}国
          </span>
        )}
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        <span className="text-xl font-bold text-orange-600">${Number(product.price || 0).toFixed(2)}</span>
        <span className="px-3 py-1.5 bg-orange-50 text-orange-600 text-xs font-medium rounded-lg group-hover:bg-orange-500 group-hover:text-white transition-colors">
          立即购买
        </span>
      </div>
    </Link>
  );
}

function getFlag(code: string): string {
  if (!code || code.length !== 2) return '🌐';
  return code.toUpperCase().replace(/./g, c =>
    String.fromCodePoint(c.charCodeAt(0) + 127397)
  );
}
