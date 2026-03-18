'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';
import { ChevronLeft, Filter } from 'lucide-react';
import { b2bApi, getCountryFlag } from '@/lib/api';
import { DATA_SIZE_OPTIONS, VALID_DAYS_OPTIONS } from '@/lib/constants';
import ProductCard from './ProductCard';
import type { Product } from '@/types';

interface ProductListProps {
  countryCode?: string;
}

export default function ProductList({ countryCode }: ProductListProps) {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [dataSizeFilter, setDataSizeFilter] = useState('all');
  const [daysFilter, setDaysFilter] = useState('all');

  useEffect(() => {
    async function loadProducts() {
      try {
        let data: Product[];
        if (countryCode) {
          const res = await fetch(`/api/products/by-country/${countryCode}`);
          const json = await res.json();
          data = json.success ? json.data : [];
        } else {
          const res = await fetch('/api/products?limit=100');
          const json = await res.json();
          data = json.success ? json.data.list : [];
        }
        setProducts(data);
      } catch (error) {
        console.error('Failed to load products:', error);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, [countryCode]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      if (dataSizeFilter !== 'all') {
        const size = parseInt(dataSizeFilter);
        if (size === 20) {
          if (product.dataSize < 20 * 1024) return false;
        } else {
          const productSizeGB = product.dataSize >= 1024 ? product.dataSize / 1024 : product.dataSize;
          if (Math.round(productSizeGB) !== size) return false;
        }
      }

      if (daysFilter !== 'all') {
        const days = parseInt(daysFilter);
        if (product.validDays !== days) return false;
      }

      return true;
    });
  }, [products, dataSizeFilter, daysFilter]);

  const countryName = countryCode ? products[0]?.countries?.find(c => c.code.toLowerCase() === countryCode.toLowerCase())?.name : '';

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-lg">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {countryCode ? (
                <span className="flex items-center gap-2">
                  {getCountryFlag(countryCode)} {countryName || countryCode.toUpperCase()}
                </span>
              ) : '全部产品'}
            </h1>
            <p className="text-gray-500">{filteredProducts.length} 款产品</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-600">流量:</span>
            <select
              value={dataSizeFilter}
              onChange={(e) => setDataSizeFilter(e.target.value)}
              className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-500"
            >
              {DATA_SIZE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">天数:</span>
            <select
              value={daysFilter}
              onChange={(e) => setDaysFilter(e.target.value)}
              className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-500"
            >
              {VALID_DAYS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">没有找到符合条件的产品</p>
          </div>
        )}
      </div>
    </div>
  );
}
