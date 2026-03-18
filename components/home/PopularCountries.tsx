'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { b2bApi, getCountryFlag } from '@/lib/api';
import type { Product } from '@/types';

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
        const products = await b2bApi.getAllProducts();
        const countryMap = new Map<string, CountryWithProducts>();

        products.forEach((product: Product) => {
          if (product.type === 'local' && product.countries) {
            product.countries.forEach((country) => {
              if (!countryMap.has(country.code)) {
                countryMap.set(country.code, { code: country.code, name: country.name, productCount: 0 });
              }
              countryMap.get(country.code)!.productCount++;
            });
          }
        });

        const sorted = Array.from(countryMap.values()).sort((a, b) => b.productCount - a.productCount).slice(0, 8);
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
