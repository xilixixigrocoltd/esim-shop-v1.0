'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Search, Globe } from 'lucide-react';
import { b2bApi, getCountryFlag } from '@/lib/api';
import { REGIONS } from '@/lib/constants';
import type { Product, Country } from '@/types';

interface CountryWithProducts {
  code: string;
  name: string;
  nameEn: string;
  productCount: number;
}

export default function CountryList() {
  const [countries, setCountries] = useState<CountryWithProducts[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCountries() {
      try {
        const res = await fetch('/api/countries');
        const json = await res.json();
        if (json.success) {
          // 将国家数据转换为带 productCount 的格式
          const countryMap = new Map<string, CountryWithProducts>();
          json.data.forEach((c: CountryWithProducts) => {
            countryMap.set(c.code, c);
          });
          // 还需要获取产品来统计数量（简化：直接用 API 返回的 productCount）
          setCountries(Array.from(countryMap.values()));
        }
      } catch (error) {
        console.error('Failed to load countries:', error);
      } finally {
        setLoading(false);
      }
    }
    loadCountries();
  }, []);

  // countries 已经从 API 获取，不需要再计算

  const filteredCountries = useMemo(() => {
    let result = countries.filter(c => c.name); // 确保有 name

    if (selectedRegion !== 'all') {
      const region = REGIONS.find(r => r.id === selectedRegion);
      if (region) {
        result = result.filter(c => region.countries.includes(c.code));
      }
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(c => 
        (c.name || '').toLowerCase().includes(query) || 
        (c.nameEn || '').toLowerCase().includes(query) ||
        c.code.toLowerCase().includes(query)
      );
    }

    return result;
  }, [countries, selectedRegion, searchQuery]);

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
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">选择目的地</h1>
          <p className="text-gray-600">覆盖 {countries.length} 个国家和地区</p>
        </div>

        <div className="mb-6">
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜索国家或地区..."
              className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-8">
          <button
            onClick={() => setSelectedRegion('all')}
            className={`px-4 py-2 rounded-full font-medium ${selectedRegion === 'all' ? 'bg-orange-500 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
          >
            全部
          </button>
          {REGIONS.map((region) => (
            <button
              key={region.id}
              onClick={() => setSelectedRegion(region.id)}
              className={`px-4 py-2 rounded-full font-medium ${selectedRegion === region.id ? 'bg-orange-500 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
            >
              {region.name}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {filteredCountries.map((country) => (
            <Link
              key={country.code}
              href={`/country/${country.code.toLowerCase()}`}
              className="bg-white rounded-xl p-4 border border-gray-200 hover:border-orange-300 hover:shadow-md transition-all text-center"
            >
              <span className="text-4xl mb-2 block">{getCountryFlag(country.code)}</span>
              <h3 className="font-semibold text-gray-900 mb-1">{country.name}</h3>
              <p className="text-xs text-gray-500">{country.productCount} 款产品</p>
            </Link>
          ))}
        </div>

        {filteredCountries.length === 0 && (
          <div className="text-center py-12">
            <Globe className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">没有找到匹配的国家</p>
          </div>
        )}
      </div>
    </div>
  );
}
