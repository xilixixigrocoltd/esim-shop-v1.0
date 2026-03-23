'use client';

import { useState } from 'react';
import { useRouter } from 'next/router';
import { Search } from 'lucide-react';
import { useI18n } from '@/lib/i18n-context';

export default function HeroSection() {
  const router = useRouter();
  const { t } = useI18n();
  const [query, setQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/products?search=${encodeURIComponent(query.trim())}`);
    } else {
      router.push('/products');
    }
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-orange-500 via-orange-400 to-amber-500 text-white">
      {/* Decorative blobs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-orange-700/30 rounded-full translate-x-1/2 translate-y-1/2 blur-3xl" />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 text-center">
        {/* Three badges */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium">
            {t('home.hero.badge.countries')}
          </span>
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium">
            {t('home.hero.badge.instant')}
          </span>
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium">
            {t('home.hero.badge.usdt')}
          </span>
        </div>

        {/* Main title */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-4 leading-tight tracking-tight">
          {t('home.hero.title2')}
        </h1>
        <p className="text-lg sm:text-xl text-orange-100 mb-10">
          {t('home.hero.subtitle2')}
        </p>

        {/* Big search box */}
        <form onSubmit={handleSearch} className="max-w-xl mx-auto">
          <div className="relative flex items-center">
            <Search className="absolute left-4 w-5 h-5 text-gray-400 pointer-events-none" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t('home.hero.search_placeholder2')}
              className="w-full pl-12 pr-32 py-4 rounded-2xl bg-white text-gray-800 placeholder-gray-400 shadow-xl text-base focus:outline-none focus:ring-2 focus:ring-white/60"
            />
            <button
              type="submit"
              className="absolute right-2 px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-xl transition-colors text-sm"
            >
              {t('home.hero.search_btn')}
            </button>
          </div>
        </form>

        {/* Quick links */}
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {[
            { code: 'jp', key: 'home.hero.quick.jp' },
            { code: 'kr', key: 'home.hero.quick.kr' },
            { code: 'th', key: 'home.hero.quick.th' },
            { code: 'us', key: 'home.hero.quick.us' },
            { code: 'gb', key: 'home.hero.quick.gb' },
            { code: 'sg', key: 'home.hero.quick.sg' },
          ].map(({ code, key }) => (
            <a
              key={code}
              href={`/country/${code}`}
              className="px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full text-sm font-medium transition-colors"
            >
              {t(key)}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
