'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Search, Globe } from 'lucide-react';
import { getCountryFlag } from '@/lib/api';
import { REGIONS } from '@/lib/constants';

interface CountryWithProducts {
  code: string;
  name: string;
  nameEn: string;
  productCount: number;
}

interface CountryListProps {
  initialSearch?: string;
}

// Map region ids to continent labels with emoji
const CONTINENT_LABELS: Record<string, string> = {
  asia: '🌏 亚洲',
  europe: '🌍 欧洲',
  americas: '🌎 美洲',
  oceania: '🌊 大洋洲',
  mea: '🕌 中东 & 非洲',
};

export default function CountryList({ initialSearch = '' }: CountryListProps) {
  const [countries, setCountries] = useState<CountryWithProducts[]>([]);
  const [searchQuery, setSearchQuery] = useState(initialSearch || '');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCountries() {
      try {
        const res = await fetch('/api/countries');
        const json = await res.json();
        if (json.success) {
          const countryMap = new Map<string, CountryWithProducts>();
          json.data.forEach((c: CountryWithProducts) => {
            countryMap.set(c.code, c);
          });
          setCountries(Array.from(countryMap.values()));
        }
      } catch (err) {
        console.error('Failed to load countries:', err);
      } finally {
        setLoading(false);
      }
    }
    loadCountries();
  }, []);

  const filteredCountries = useMemo(() => {
    if (!searchQuery) return countries.filter((c) => c.name);
    const q = searchQuery.toLowerCase();
    return countries.filter(
      (c) =>
        c.name &&
        ((c.name || '').toLowerCase().includes(q) ||
          (c.nameEn || '').toLowerCase().includes(q) ||
          c.code.toLowerCase().includes(q))
    );
  }, [countries, searchQuery]);

  // Group by continent when no search
  const grouped = useMemo(() => {
    if (searchQuery) return null;
    const groups: { id: string; label: string; items: CountryWithProducts[] }[] = [];
    for (const region of REGIONS) {
      const items = filteredCountries.filter((c) => region.countries.includes(c.code));
      if (items.length > 0) {
        groups.push({ id: region.id, label: CONTINENT_LABELS[region.id] || region.name, items });
      }
    }
    // "Other" countries not in any region
    const coveredCodes = new Set(REGIONS.flatMap((r) => r.countries));
    const others = filteredCountries.filter((c) => !coveredCodes.has(c.code));
    if (others.length > 0) {
      groups.push({ id: 'other', label: '🌐 其他', items: others });
    }
    return groups;
  }, [filteredCountries, searchQuery]);

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
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-1">全球 eSIM 覆盖</h1>
          <p className="text-gray-500">{countries.length} 个国家和地区，随时出发</p>
        </div>

        {/* Search */}
        <div className="max-w-md mx-auto mb-10">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜索国家名称或代码…"
              className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-orange-400 focus:border-transparent outline-none"
            />
          </div>
        </div>

        {/* Grouped by continent */}
        {grouped ? (
          <div className="space-y-10">
            {grouped.map(({ id, label, items }) => (
              <div key={id}>
                <h2 className="text-lg font-bold text-gray-700 mb-4">{label}</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                  {items.map((country) => (
                    <CountryCard key={country.code} country={country} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Search results – flat grid */
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {filteredCountries.map((country) => (
              <CountryCard key={country.code} country={country} />
            ))}
          </div>
        )}

        {filteredCountries.length === 0 && (
          <div className="text-center py-16">
            <Globe className="w-14 h-14 text-gray-200 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">未找到匹配的国家</p>
            <button
              onClick={() => setSearchQuery('')}
              className="mt-4 text-orange-500 hover:underline text-sm"
            >
              清除搜索
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function CountryCard({ country }: { country: CountryWithProducts }) {
  return (
    <Link
      href={`/country/${country.code.toLowerCase()}`}
      className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm hover:border-orange-300 hover:shadow-md transition-all text-center group"
    >
      <span className="text-4xl mb-2 block">{getCountryFlag(country.code)}</span>
      <h3 className="font-semibold text-gray-800 text-sm leading-tight group-hover:text-orange-500 transition-colors">
        {country.name}
      </h3>
      <p className="text-xs text-gray-400 mt-1">{country.productCount} 款套餐</p>
    </Link>
  );
}
