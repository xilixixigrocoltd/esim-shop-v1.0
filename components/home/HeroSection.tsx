'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Zap, Shield, Globe } from 'lucide-react';
import { useI18n } from '@/lib/i18n-context';

export default function HeroSection() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const { t } = useI18n();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/countries?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full text-sm font-medium mb-6">
            <Zap className="w-4 h-4 text-orange-400" />
            <span>{t('home.hero.instant')}</span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            {t('home.hero.title')}
          </h1>

          <p className="text-lg md:text-xl text-gray-300 mb-8">
            {t('home.hero.subtitle')}
          </p>

          <form onSubmit={handleSearch} className="max-w-xl mx-auto mb-12">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('home.hero.search_placeholder')}
                className="w-full pl-12 pr-4 py-4 bg-white text-gray-900 rounded-2xl shadow-lg focus:ring-4 focus:ring-orange-500/30 focus:outline-none"
              />
              <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white font-medium rounded-xl">
                {t('common.search')}
              </button>
            </div>
          </form>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <a href="/products?tab=all" className="px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold rounded-xl hover:opacity-90">
              {t('home.hero.cta')}
            </a>
            <a href="/help" className="px-8 py-4 bg-white/10 text-white font-semibold rounded-xl hover:bg-white/20 border border-white/20">
              {t('home.hero.learn_more')}
            </a>
          </div>
        </div>
      </div>

      <div className="relative border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center">
                <Globe className="w-6 h-6 text-orange-400" />
              </div>
              <div>
                <h3 className="font-semibold">{t('home.features.countries')}</h3>
                <p className="text-sm text-gray-400">{t('home.features.global')}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center">
                <Zap className="w-6 h-6 text-orange-400" />
              </div>
              <div>
                <h3 className="font-semibold">{t('home.features.instant')}</h3>
                <p className="text-sm text-gray-400">{t('home.features.delivery')}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-orange-400" />
              </div>
              <div>
                <h3 className="font-semibold">{t('home.features.refund')}</h3>
                <p className="text-sm text-gray-400">{t('home.features.unused')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
