'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import type { Product } from '@/types';
import ProductCard from '@/components/products/ProductCard';

const PAGE_SIZE = 20; // 每页显示 20 个产品

export default function ProductsPage() {
  const router = useRouter();
  const { tab } = router.query;
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [displayedProducts, setDisplayedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [page, setPage] = useState(1);

  // 同步 URL 参数到 activeTab
  useEffect(() => {
    if (tab && ['all', 'popular', 'regional', 'global'].includes(tab as string)) {
      setActiveTab(tab as string);
    }
  }, [tab]);

  // 根据 activeTab 加载产品（服务端 API）
  useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true);
        setPage(1);
        
        let endpoint: string;
        switch (activeTab) {
          case 'popular':
            endpoint = '/api/products/popular';
            break;
          case 'regional':
            endpoint = '/api/products/regional';
            break;
          case 'global':
            endpoint = '/api/products/global';
            break;
          default:
            endpoint = '/api/products?page=1&pageSize=100';
        }
        
        const res = await fetch(endpoint);
        const json = await res.json();
        
        if (json.success && json.data) {
          setAllProducts(json.data);
          setDisplayedProducts(json.data.slice(0, PAGE_SIZE));
        } else {
          setAllProducts([]);
          setDisplayedProducts([]);
        }
      } catch (error: any) {
        console.error('Failed to load products:', error);
        setAllProducts([]);
        setDisplayedProducts([]);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, [activeTab]);

  // 加载更多
  const loadMore = () => {
    const nextPage = page + 1;
    const startIndex = 0;
    const endIndex = nextPage * PAGE_SIZE;
    setDisplayedProducts(allProducts.slice(startIndex, endIndex));
    setPage(nextPage);
  };

  const tabs = [
    { id: 'all', label: '全部' },
    { id: 'popular', label: '热门国家' },
    { id: 'regional', label: '区域' },
    { id: 'global', label: '全球' },
  ];

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    router.push(`/products?tab=${tabId}`, undefined, { shallow: true });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部标签页导航 */}
      <div className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center py-4">
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
          </div>
        </div>
      </div>

      {/* 产品列表 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 产品数量统计 */}
        <div className="mb-6 text-center">
          <p className="text-gray-600">
            {loading ? (
              <span className="inline-flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
                加载中...
              </span>
            ) : (
              `显示 ${displayedProducts.length} / ${allProducts.length} 款产品`
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
        ) : displayedProducts.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {displayedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            
            {/* 加载更多按钮 */}
            {displayedProducts.length < allProducts.length && (
              <div className="text-center mt-8">
                <button
                  onClick={loadMore}
                  className="px-8 py-3 bg-white border-2 border-orange-500 text-orange-600 font-semibold rounded-xl hover:bg-orange-50 transition-colors"
                >
                  加载更多（{allProducts.length - displayedProducts.length} 款）
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">该分类下暂无产品</p>
          </div>
        )}
      </div>
    </div>
  );
}
