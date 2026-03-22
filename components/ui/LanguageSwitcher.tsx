'use client';

import { useI18n } from '@/lib/i18n-context';

export default function LanguageSwitcher() {
  const { locale, setLocale, t } = useI18n();

  const toggleLocale = () => {
    setLocale(locale === 'zh' ? 'en' : 'zh');
  };

  return (
    <button
      onClick={toggleLocale}
      className="flex items-center gap-1 px-3 py-1.5 text-sm font-semibold text-orange-600 border border-orange-300 hover:bg-orange-50 hover:border-orange-500 rounded-md transition-colors"
      aria-label={t('lang.switch')}
    >
      <span>{locale === 'zh' ? 'EN' : 'ZH'}</span>
    </button>
  );
}
