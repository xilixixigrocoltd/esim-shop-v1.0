'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { getCountryFlag } from '@/lib/api';
import type { Product } from '@/types';

// 热门亚洲国家/地区（固定列表）
const POPULAR_COUNTRY_CODES = [
  'JP', // 日本
  'KR', // 韩国
  'CN', // 中国
  'HK', // 香港
  'TH', // 泰国
  'VN', // 越南
  'SG', // 新加坡
  'MY', // 马来西亚
];

interface CountryWithProducts {
  code: string;
  name: string;
  productCount: number;
}

export default function PopularCountries() {
  const [countries, setCountries] = useState<CountryWithProducts[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCountries() {
      try {
        // 获取前 10 页产品（1000 款）
        const allProducts: Product[] = [];
        for (let page = 1; page <= 10; page++) {
          const res = await fetch(`/api/products?page=${page}&pageSize=100`);
          const json = await res.json();
          if (!json.success || !json.data) break;
          allProducts.push(...json.data);
          if (json.data.length < 100) break;
        }

        // 统计热门国家的产品数量
        const countryMap = new Map<string, CountryWithProducts>();
        const popularNames: Record<string, string> = {
          'JP': '日本', 'KR': '韩国', 'CN': '中国', 'HK': '香港',
          'TH': '泰国', 'VN': '越南', 'SG': '新加坡', 'MY': '马来西亚',
        };

        // 初始化热门国家
        POPULAR_COUNTRY_CODES.forEach(code => {
          countryMap.set(code, { code, name: popularNames[code], productCount: 0 });
        });

        // 统计产品数量
        allProducts.forEach((product: Product) => {
          if (product.type === 'local' && product.countries) {
            product.countries.forEach((country) => {
              if (countryMap.has(country.code)) {
                countryMap.get(country.code)!.productCount++;
              }
            });
          }
        });

        // 按产品数量排序，过滤掉 0 产品的国家
        const sorted = Array.from(countryMap.values())
          .filter(c => c.productCount > 0)
          .sort((a, b) => b.productCount - a.productCount);

        setCountries(sorted);
      } catch (error) {
        console.error('Failed to load countries:', error);
      } finally {
        setLoading(false);
      }
    }
    loadCountries();
  }, []);

  if (loading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl p-6 animate-pulse">
                <div className="w-12 h-12 bg-gray-200 rounded-full mx-auto mb-3" />
                <div className="h-4 bg-gray-200 rounded w-20 mx-auto" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-gray-900">热门目的地</h2>
          <Link href="/countries" className="flex items-center gap-1 text-orange-600 font-medium">
            查看全部<ChevronRight className="w-5 h-5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {countries.map((country) => (
            <Link key={country.code} href={`/country/${country.code.toLowerCase()}`} className="group bg-white rounded-xl p-6 border border-gray-200 hover:border-orange-300 hover:shadow-md transition-all text-center">
              <span className="text-5xl mb-3 block group-hover:scale-110 transition-transform">{getCountryFlag(country.code)}</span>
              <h3 className="font-semibold text-gray-900 mb-1">{country.name}</h3>
              <p className="text-sm text-gray-500">{country.productCount}款产品</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
