import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export type Locale = 'zh' | 'en' | 'ja' | 'ko'
export const LOCALES: Locale[] = ['zh', 'en', 'ja', 'ko']
export const LOCALE_LABELS: Record<Locale, { flag: string; label: string }> = {
  zh: { flag: '🇨🇳', label: '中' },
  en: { flag: '🇺🇸', label: 'EN' },
  ja: { flag: '🇯🇵', label: '日' },
  ko: { flag: '🇰🇷', label: '한' },
}

// Statically import all message files to avoid dynamic import issues in Pages Router
import zh from '../messages/zh.json'
import en from '../messages/en.json'
import ja from '../messages/ja.json'
import ko from '../messages/ko.json'

const MESSAGES: Record<Locale, Record<string, any>> = { zh, en, ja, ko }

function getNestedValue(obj: Record<string, any>, key: string): string {
  const parts = key.split('.')
  let cur: any = obj
  for (const p of parts) {
    if (cur == null) return key
    cur = cur[p]
  }
  return typeof cur === 'string' ? cur : key
}

interface I18nContextType {
  locale: Locale
  setLocale: (l: Locale) => void
  t: (key: string, params?: Record<string, string | number>) => string
}

const I18nContext = createContext<I18nContextType | undefined>(undefined)

function detectBrowserLocale(): Locale {
  if (typeof navigator === 'undefined') return 'zh'
  const lang = navigator.language?.toLowerCase() || ''
  if (lang.startsWith('ja')) return 'ja'
  if (lang.startsWith('ko')) return 'ko'
  if (lang.startsWith('zh')) return 'zh'
  if (lang.startsWith('en')) return 'en'
  return 'zh'
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('zh')
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('simryoko_locale') as Locale
    if (saved && LOCALES.includes(saved)) {
      setLocaleState(saved)
    } else {
      setLocaleState(detectBrowserLocale())
    }
    setReady(true)
  }, [])

  function setLocale(l: Locale) {
    setLocaleState(l)
    localStorage.setItem('simryoko_locale', l)
  }

  function t(key: string, params?: Record<string, string | number>): string {
    const msgs = MESSAGES[locale]
    let val = getNestedValue(msgs, key)
    // Fallback to zh if key missing
    if (val === key && locale !== 'zh') {
      val = getNestedValue(MESSAGES['zh'], key)
    }
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        val = val.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v))
      })
    }
    return val
  }

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n() {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error('useI18n must be used within I18nProvider')
  return ctx
}
