'use client';

import { useState } from 'react';
import { useRouter } from 'next/router';
import { Search } from 'lucide-react';

export default function HeroSection() {
  const router = useRouter();
  const [query, setQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/countries?q=${encodeURIComponent(query.trim())}`);
    } else {
      router.push('/countries');
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
            🌍 150+ 国家
          </span>
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium">
            ⚡ 即时激活
          </span>
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium">
            💳 USDT支付
          </span>
        </div>

        {/* Main title */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-4 leading-tight tracking-tight">
          全球 eSIM，出发前搞定
        </h1>
        <p className="text-lg sm:text-xl text-orange-100 mb-10">
          150+ 国家，即买即用，USDT 支付
        </p>

        {/* Big search box */}
        <form onSubmit={handleSearch} className="max-w-xl mx-auto">
          <div className="relative flex items-center">
            <Search className="absolute left-4 w-5 h-5 text-gray-400 pointer-events-none" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="搜索国家，如：日本、美国、泰国…"
              className="w-full pl-12 pr-32 py-4 rounded-2xl bg-white text-gray-800 placeholder-gray-400 shadow-xl text-base focus:outline-none focus:ring-2 focus:ring-white/60"
            />
            <button
              type="submit"
              className="absolute right-2 px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-xl transition-colors text-sm"
            >
              搜索
            </button>
          </div>
        </form>

        {/* Quick links */}
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {[
            { code: 'jp', label: '🇯🇵 日本' },
            { code: 'kr', label: '🇰🇷 韩国' },
            { code: 'th', label: '🇹🇭 泰国' },
            { code: 'us', label: '🇺🇸 美国' },
            { code: 'gb', label: '🇬🇧 英国' },
            { code: 'sg', label: '🇸🇬 新加坡' },
          ].map(({ code, label }) => (
            <a
              key={code}
              href={`/country/${code}`}
              className="px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full text-sm font-medium transition-colors"
            >
              {label}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
