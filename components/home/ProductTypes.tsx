'use client';

import { Globe, Map, MapPin } from 'lucide-react';
import Link from 'next/link';
import { useI18n } from '@/lib/i18n-context';

export default function ProductTypes() {
  const { t } = useI18n();

  const productTypes = [
    { id: 'local', name: t('home.types.local'), description: t('home.types.local.desc'), icon: MapPin, color: 'from-blue-500 to-blue-600', href: '/countries', stats: '2,552' },
    { id: 'regional', name: t('home.types.regional'), description: t('home.types.regional.desc'), icon: Map, color: 'from-green-500 to-green-600', href: '/products/regional', stats: '134' },
    { id: 'global', name: t('home.types.global'), description: t('home.types.global.desc'), icon: Globe, color: 'from-purple-500 to-purple-600', href: '/products/global', stats: '34' },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('home.types.title')}</h2>
          <p className="text-gray-600">{t('home.types.subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {productTypes.map((type) => (
            <Link key={type.id} href={type.href} className="group bg-white border border-gray-200 rounded-2xl p-6 hover:border-orange-300 hover:shadow-lg transition-all">
              <div className="w-14 h-14 bg-gray-50 rounded-xl flex items-center justify-center mb-4">
                <type.icon className="w-7 h-7 text-gray-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{type.name}</h3>
              <p className="text-gray-600 mb-4">{type.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-500">{type.stats}</span>
                <span className="text-orange-600 font-medium group-hover:translate-x-1 transition-transform">{t('home.types.view_all')} →</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
