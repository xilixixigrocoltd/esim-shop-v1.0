'use client';

import { useState, useRef, useEffect } from 'react';
import { useI18n, LOCALES, LOCALE_LABELS, type Locale } from '@/lib/i18n-context';

export default function LanguageSwitcher() {
  const { locale, setLocale, t } = useI18n();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const current = LOCALE_LABELS[locale];

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1 px-3 py-1.5 text-sm font-semibold text-orange-600 border border-orange-300 hover:bg-orange-50 hover:border-orange-500 rounded-md transition-colors"
        aria-label={t('lang.switch')}
      >
        <span>{current.flag}</span>
        <span>{current.label}</span>
        <svg className={`w-3 h-3 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 mt-1 w-28 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden z-50">
          {LOCALES.map((l: Locale) => {
            const info = LOCALE_LABELS[l];
            return (
              <button
                key={l}
                onClick={() => { setLocale(l); setOpen(false); }}
                className={`w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-orange-50 transition-colors ${locale === l ? 'bg-orange-50 text-orange-600 font-semibold' : 'text-gray-700'}`}
              >
                <span>{info.flag}</span>
                <span>{info.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
