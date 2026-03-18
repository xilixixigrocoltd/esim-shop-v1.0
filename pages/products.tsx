'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';
import { b2bApi } from '@/lib/api';
import type { Product } from '@/types';
import ProductCard from '@/components/products/ProductCard';
import Header from '@/components/ui/Header';
import Footer from '@/components/ui/Footer';

export default function ProductsPage() {
  const router = useRouter();
  const { tab } = router.query;
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    if (tab) {
      setActiveTab(tab as string);
    }
  }, [tab]);

  useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true);
        const allProducts: Product[] = [];
        
        // 根据标签页获取不同类型的产品
        if (activeTab === 'all') {
          // 全部：获取前 10 页
          for (let page = 1; page <= 10; page++) {
            const result = await b2bApi.getProducts(page, 100);
            if (!result || !result.products) break;
            allProducts.push(...result.products);
            if (result.products.length < 100) break;
          }
        } else if (activeTab === 'popular') {
          // 热门国家：获取前 5 页，然后筛选 local 类型
          for (let page = 1; page <= 5; page++) {
            const result = await b2bApi.getProducts(page, 100);
            if (!result || !result.products) break;
            const localProducts = result.products.filter(p => p.type === 'local');
            allProducts.push(...localProducts);
            if (result.products.length < 100) break;
          }
        } else if (activeTab === 'regional') {
          // 区域：只获取 regional 类型
          for (let page = 1; page <= 28; page++) {
            const result = await b2bApi.getProducts(page, 100);
            if (!result || !result.products) break;
            const regionalProducts = result.products.filter(p => p.type === 'regional');
            allProducts.push(...regionalProducts);
            if (result.products.length < 100) break;
          }
        } else if (activeTab === 'global') {
          // 全球：只获取 global 类型
          for (let page = 1; page <= 28; page++) {
            const result = await b2bApi.getProducts(page, 100);
            if (!result || !result.products) break;
            const globalProducts = result.products.filter(p => p.type === 'global');
            allProducts.push(...globalProducts);
            if (result.products.length < 100) break;
          }
        }
        
        setProducts(allProducts);
      } catch (error) {
        console.error('Failed to load products:', error);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, [activeTab]);

  const tabs = [
    { id: 'all', label: '全部' },
    { id: 'popular', label: '热门国家' },
    { id: 'regional', label: '区域' },
    { id: 'global', label: '全球' },
  ];

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* 标签页导航 */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => {
                  setActiveTab(t.id);
                  router.push(`/products?tab=${t.id}`, undefined, { shallow: true });
                }}
                className={`px-6 py-3 rounded-full font-medium transition-all ${
                  activeTab === t.id
                    ? 'bg-orange-500 text-white shadow-md'
                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* 产品数量 */}
          <div className="text-center mb-6">
            <p className="text-gray-600">
              {loading ? '加载中...' : `共 ${products.length} 款产品`}
            </p>
          </div>

          {/* 产品列表 */}
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
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          {products.length === 0 && !loading && (
            <div className="text-center py-12">
              <p className="text-gray-500">该分类下暂无产品</p>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
