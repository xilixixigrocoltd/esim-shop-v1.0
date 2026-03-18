'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Globe, MapPin, Wifi, Phone } from 'lucide-react';
import type { Product, Country } from '@/types';
import ProductCard from '@/components/products/ProductCard';

// 热门国家（根据实际产品数量排序）
const POPULAR_COUNTRIES = [
  { code: 'US', name: '美国', flag: '🇺🇸' },
  { code: 'MX', name: '墨西哥', flag: '🇲🇽' },
  { code: 'GB', name: '英国', flag: '🇬🇧' },
  { code: 'NL', name: '荷兰', flag: '🇳🇱' },
  { code: 'CA', name: '加拿大', flag: '🇨🇦' },
  { code: 'AU', name: '澳大利亚', flag: '🇦🇺' },
  { code: 'IE', name: '爱尔兰', flag: '🇮🇪' },
  { code: 'HK', name: '香港', flag: '🇭🇰' },
];

// 区域套餐 - 大洲
const REGIONS = [
  { id: 'asia', name: '亚洲', icon: '🌏', countries: ['JP', 'KR', 'CN', 'HK', 'TH', 'VN', 'SG', 'MY', 'IN', 'ID', 'KH', 'LA', 'MO', 'BD', 'MM'] },
  { id: 'europe', name: '欧洲', icon: '🇪🇺', countries: ['GB', 'FR', 'DE', 'IT', 'ES', 'PT', 'NL', 'BE', 'AT', 'CH', 'GR', 'CZ', 'PL', 'HU', 'SE', 'NO', 'DK', 'FI', 'IE', 'IS'] },
  { id: 'americas', name: '美洲', icon: '🌎', countries: ['US', 'CA', 'MX', 'BR', 'AR', 'CL', 'CO', 'PE', 'CR', 'SV'] },
  { id: 'middle-east', name: '中东', icon: '🕌', countries: ['AE', 'SA', 'IL', 'TR', 'QA', 'KW', 'BH', 'OM'] },
  { id: 'africa', name: '非洲', icon: '🌍', countries: ['ZA', 'EG', 'KE', 'NG', 'MA', 'TZ', 'UG', 'GH'] },
  { id: 'oceania', name: '大洋洲', icon: '🏝️', countries: ['AU', 'NZ', 'FJ', 'PG'] },
];

// 套餐类型
const PLAN_TYPES = [
  { id: 'data-only', name: '纯数据', icon: Wifi, color: 'from-blue-500 to-blue-600', desc: '仅流量，无语音短信' },
  { id: 'data-voice-sms', name: '数据 + 语音 + 短信', icon: Phone, color: 'from-green-500 to-green-600', desc: '全功能套餐' },
];

type ViewMode = 'list' | 'country' | 'region' | 'plan-type';

export default function ProductsPage() {
  const router = useRouter();
  const { tab, country, region, planType, search } = router.query;
  
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedItem, setSelectedItem] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');

  // 同步 URL 参数
  useEffect(() => {
    if (tab) setActiveTab(tab as string);
    if (search) {
      setSearchQuery(search as string);
    }
    if (country) {
      setViewMode('country');
      setSelectedItem(country as string);
    } else if (region) {
      setViewMode('region');
      setSelectedItem(region as string);
    } else if (planType) {
      setViewMode('plan-type');
      setSelectedItem(planType as string);
    } else {
      setViewMode('list');
      setSelectedItem('');
    }
  }, [tab, country, region, planType, search]);

  // 处理搜索
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?tab=all&search=${encodeURIComponent(searchQuery)}`);
    } else {
      router.push('/products?tab=all', undefined, { shallow: true });
    }
  };

  // 加载产品
  useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true);
        let endpoint = '';
        
        // 如果有搜索关键词，先获取国家列表判断是否是国家搜索
        if (searchQuery) {
          try {
            // 获取国家列表
            const countriesRes = await fetch('/api/countries');
            const countriesJson = await countriesRes.json();
            
            if (countriesJson.success && countriesJson.data) {
              const query = searchQuery.trim().toUpperCase();
              const lowerQuery = searchQuery.trim().toLowerCase();
              
              // 在国家列表中查找匹配（代码/中文名/英文名）
              const matchedCountry = countriesJson.data.find((c: any) => 
                c.code?.toUpperCase() === query ||
                c.cn?.toLowerCase() === lowerQuery ||
                c.en?.toLowerCase() === lowerQuery ||
                c.cn?.toLowerCase().includes(lowerQuery) ||
                c.en?.toLowerCase().includes(lowerQuery)
              );
              
              if (matchedCountry) {
                // 是国家搜索，直接调用国家 API
                const res = await fetch(`/api/products/by-country/${matchedCountry.code}`);
                const json = await res.json();
                if (json.success && json.data) {
                  setProducts(json.data);
                } else {
                  setProducts([]);
                }
                setLoading(false);
                return;
              }
            }
          } catch (error) {
            console.error('Failed to fetch countries for search:', error);
          }
          
          // 不是国家搜索，获取所有产品进行关键词搜索
          const allProducts: Product[] = [];
          for (let page = 1; page <= 10; page++) {
            const res = await fetch(`/api/products?page=${page}&pageSize=100`);
            const json = await res.json();
            if (!json.success || !json.data || json.data.length === 0) break;
            allProducts.push(...json.data);
            if (json.data.length < 100) break;
          }
          
          // 前端搜索过滤（产品名称/描述/国家）
          const lowerQuery = searchQuery.toLowerCase();
          const filtered = allProducts.filter((p: Product) => 
            p.name.toLowerCase().includes(lowerQuery) ||
            p.nameEn.toLowerCase().includes(lowerQuery) ||
            (p.description && p.description.toLowerCase().includes(lowerQuery)) ||
            (p.countries && p.countries.some(c => 
              (c.cn && c.cn.toLowerCase().includes(lowerQuery)) ||
              (c.en && c.en.toLowerCase().includes(lowerQuery)) ||
              (c.code && c.code.toLowerCase().includes(lowerQuery))
            ))
          );
          
          setProducts(filtered);
          setLoading(false);
          return;
        } else if (viewMode === 'country' && selectedItem) {
          endpoint = `/api/products/by-country/${selectedItem}`;
        } else if (viewMode === 'region' && selectedItem) {
          endpoint = `/api/products/region/${selectedItem}`;
        } else if (viewMode === 'plan-type' && selectedItem) {
          endpoint = `/api/products/plan-type/${selectedItem}`;
        } else if (activeTab === 'popular') {
          endpoint = '/api/products/popular-countries';
        } else if (activeTab === 'regional') {
          endpoint = '/api/products/regional';
        } else if (activeTab === 'global') {
          endpoint = '/api/products/global';
        } else {
          endpoint = '/api/products?page=1&pageSize=50';
        }
        
        const res = await fetch(endpoint);
        const json = await res.json();
        
        if (json.success && json.data) {
          setProducts(json.data);
        } else {
          setProducts([]);
        }
      } catch (error) {
        console.error('Failed to load products:', error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, [viewMode, selectedItem, activeTab]);

  // 导航处理
  const handleTabClick = (tabId: string) => {
    router.push(`/products?tab=${tabId}`, undefined, { shallow: true });
  };

  const handleCountryClick = (code: string) => {
    router.push(`/products?tab=popular&country=${code}`, undefined, { shallow: true });
  };

  const handleRegionClick = (id: string) => {
    router.push(`/products?tab=regional&region=${id}`, undefined, { shallow: true });
  };

  const handlePlanTypeClick = (id: string) => {
    router.push(`/products?tab=global&planType=${id}`, undefined, { shallow: true });
  };

  const handleBack = () => {
    if (viewMode !== 'list') {
      router.push(`/products?tab=${activeTab}`, undefined, { shallow: true });
    }
  };

  // 渲染选择器视图
  const renderSelector = () => {
    if (viewMode === 'country' || (activeTab === 'popular' && !selectedItem)) {
      return (
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
          {POPULAR_COUNTRIES.map((c) => (
            <button
              key={c.code}
              onClick={() => handleCountryClick(c.code)}
              className="bg-white rounded-xl p-6 border-2 border-gray-200 hover:border-orange-500 hover:shadow-lg transition-all text-center group"
            >
              <span className="text-5xl mb-3 block group-hover:scale-110 transition-transform">{c.flag}</span>
              <p className="font-semibold text-gray-900">{c.name}</p>
            </button>
          ))}
        </div>
      );
    }

    if (viewMode === 'region' || (activeTab === 'regional' && !selectedItem)) {
      return (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {REGIONS.map((r) => (
            <button
              key={r.id}
              onClick={() => handleRegionClick(r.id)}
              className="bg-white rounded-xl p-6 border-2 border-gray-200 hover:border-orange-500 hover:shadow-lg transition-all text-center group"
            >
              <span className="text-5xl mb-3 block group-hover:scale-110 transition-transform">{r.icon}</span>
              <p className="font-semibold text-gray-900">{r.name}</p>
            </button>
          ))}
        </div>
      );
    }

    if (viewMode === 'plan-type' || (activeTab === 'global' && !selectedItem)) {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
          {PLAN_TYPES.map((t) => {
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                onClick={() => handlePlanTypeClick(t.id)}
                className="bg-white rounded-xl p-8 border-2 border-gray-200 hover:border-orange-500 hover:shadow-lg transition-all text-center group"
              >
                <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br ${t.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <p className="text-xl font-bold text-gray-900 mb-2">{t.name}</p>
                <p className="text-sm text-gray-500">{t.desc}</p>
              </button>
            );
          })}
        </div>
      );
    }

    return null;
  };

  // 获取当前选中项名称
  const getSelectedName = () => {
    if (viewMode === 'country') {
      const c = POPULAR_COUNTRIES.find(x => x.code === selectedItem);
      return c?.name || '';
    }
    if (viewMode === 'region') {
      const r = REGIONS.find(x => x.id === selectedItem);
      return r?.name || '';
    }
    if (viewMode === 'plan-type') {
      const t = PLAN_TYPES.find(x => x.id === selectedItem);
      return t?.name || '';
    }
    return '';
  };

  const tabs = [
    { id: 'all', label: '全部' },
    { id: 'popular', label: '热门国家' },
    { id: 'regional', label: '区域' },
    { id: 'global', label: '全球' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部标签页导航 + 搜索框 */}
      <div className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between py-4 gap-4">
            <div className="flex flex-wrap justify-center gap-2">
              {tabs.map((t) => (
                <button
                  key={t.id}
                  onClick={() => handleTabClick(t.id)}
                  className={`px-6 py-2.5 rounded-full font-medium transition-all ${
                    activeTab === t.id
                      ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-md'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* 搜索框 */}
            <form onSubmit={handleSearch} className="w-full sm:w-auto flex-shrink-0">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="搜索国家或产品..."
                  className="w-full sm:w-64 pl-4 pr-12 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* 内容区域 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 返回按钮 + 标题 */}
        {(selectedItem || viewMode !== 'list') && (
          <div className="mb-6 flex items-center gap-4">
            <button
              onClick={handleBack}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <MapPin className="w-4 h-4" />
              <span>返回</span>
            </button>
            <h2 className="text-xl font-bold text-gray-900">
              {getSelectedName()} {viewMode === 'country' ? '产品' : viewMode === 'region' ? '区域套餐' : '套餐'}
            </h2>
          </div>
        )}

        {/* 选择器视图 */}
        {(!selectedItem && (activeTab === 'popular' || activeTab === 'regional' || activeTab === 'global')) ? (
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
              {activeTab === 'popular' ? '选择目的地国家/地区' : activeTab === 'regional' ? '选择大洲区域' : '选择套餐类型'}
            </h3>
            {renderSelector()}
          </div>
        ) : (
          /* 产品列表 */
          <div>
            {/* 产品数量统计 */}
            <div className="mb-6 text-center">
              <p className="text-gray-600">
                {loading ? (
                  <span className="inline-flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
                    加载中...
                  </span>
                ) : (
                  `共 ${products.length} 款产品`
                )}
              </p>
            </div>

            {/* 产品网格 */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="bg-white rounded-xl p-4 border border-gray-200 animate-pulse">
                    <div className="h-48 bg-gray-200 rounded-lg mb-4" />
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                    <div className="h-4 bg-gray-200 rounded w-1/2" />
                  </div>
                ))}
              </div>
            ) : products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                {searchQuery ? (
                  <>
                    <p className="text-gray-500 text-lg mb-2">未找到与 "{searchQuery}" 相关的产品</p>
                    <p className="text-gray-400 text-sm">试试其他国家或关键词</p>
                  </>
                ) : (
                  <p className="text-gray-500 text-lg">该分类下暂无产品</p>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
