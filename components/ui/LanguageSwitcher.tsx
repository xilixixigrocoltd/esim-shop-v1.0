'use client';

import { useI18n } from '@/lib/i18n-context';
import { Globe } from 'lucide-react';

export default function LanguageSwitcher() {
  const { locale, setLocale, t } = useI18n();

  const toggleLocale = () => {
    setLocale(locale === 'zh' ? 'en' : 'zh');
  };

  return (
    <button
      onClick={toggleLocale}
      className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
      aria-label={t('lang.switch')}
    >
      <Globe className="w-4 h-4" />
      <span className="font-medium">
        {locale === 'zh' ? 'EN' : '中文'}
      </span>
    </button>
  );
}
