import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useI18n, LOCALES, LOCALE_LABELS, Locale } from '../lib/i18n-context'

// Cookie Consent Banner
function CookieConsent() {
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    if (typeof window !== 'undefined' && !localStorage.getItem('cookie_consent')) {
      setVisible(true)
    }
  }, [])
  if (!visible) return null
  return (
    <div style={{
      position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 9999,
      background: 'rgba(15, 23, 42, 0.97)',
      borderTop: '1px solid rgba(255,255,255,0.1)',
      backdropFilter: 'blur(12px)',
      padding: '16px 20px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      flexWrap: 'wrap', gap: '12px',
    }}>
      <p style={{ margin: 0, color: 'rgba(255,255,255,0.75)', fontSize: '13px', lineHeight: 1.6, flex: 1, minWidth: '240px' }}>
        我们使用 Cookie 改善体验。继续使用即表示同意我们的{' '}
        <a href="/privacy" style={{ color: '#60a5fa', textDecoration: 'underline' }}>隐私政策</a>
        {' '}和{' '}
        <a href="/terms" style={{ color: '#60a5fa', textDecoration: 'underline' }}>服务条款</a>
      </p>
      <button
        onClick={() => { localStorage.setItem('cookie_consent', '1'); setVisible(false) }}
        style={{
          background: 'linear-gradient(135deg, #f97316, #ea580c)',
          border: 'none', borderRadius: '8px', color: '#fff',
          fontSize: '13px', fontWeight: 600, padding: '9px 20px', cursor: 'pointer',
          whiteSpace: 'nowrap',
        }}
      >
        同意并继续
      </button>
    </div>
  )
}

// Live Chat Floating Button
function ChatButton() {
  return (
    <a
      href="https://t.me/Simryokoesimbot"
      target="_blank"
      rel="noopener noreferrer"
      style={{
        position: 'fixed', bottom: '80px', right: '20px', zIndex: 9998,
        background: 'linear-gradient(135deg, #0088cc, #0066aa)',
        borderRadius: '50px',
        color: '#fff', fontSize: '13px', fontWeight: 600,
        padding: '10px 16px',
        display: 'flex', alignItems: 'center', gap: '6px',
        boxShadow: '0 4px 20px rgba(0,136,204,0.5)',
        textDecoration: 'none',
        transition: 'transform 0.2s',
      }}
      onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.06)')}
      onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
    >
      💬 <span>联系客服</span>
    </a>
  )
}

function CartBadge() {
  const [count, setCount] = useState(0)
  useEffect(() => {
    function sync() {
      try {
        const cart = JSON.parse(localStorage.getItem('cart') || '[]')
        setCount(cart.reduce((s: number, i: any) => s + (i.qty || 1), 0))
      } catch { setCount(0) }
    }
    sync()
    window.addEventListener('storage', sync)
    window.addEventListener('cart-updated', sync)
    return () => { window.removeEventListener('storage', sync); window.removeEventListener('cart-updated', sync) }
  }, [])
  if (!count) return null
  return (
    <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
      {count > 9 ? '9+' : count}
    </span>
  )
}

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { t, locale, setLocale } = useI18n()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [langOpen, setLangOpen] = useState(false)

  const navLinks = [
    { href: '/', label: t('nav.home') },
    { href: '/products', label: t('nav.products') },
    { href: '/products?type=regional', label: t('nav.regional') },
    { href: '/products?type=global', label: t('nav.global') },
  ]

  function isActive(href: string) {
    if (href === '/') return router.pathname === '/'
    return router.asPath.startsWith(href.split('?')[0]) && href !== '/'
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ fontFamily: "'Inter', 'Noto Sans SC', 'Noto Sans JP', sans-serif" }}>
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-bold">S</span>
            </div>
            <span className="font-bold text-lg text-gray-900">SimRyoko</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map(l => (
              <Link key={l.href} href={l.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive(l.href) ? 'text-orange-600 bg-orange-50' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}>
                {l.label}
              </Link>
            ))}
          </nav>

          {/* Right controls */}
          <div className="flex items-center gap-2">
            {/* Lang switcher */}
            <div className="relative hidden md:block">
              <button
                onClick={() => setLangOpen(v => !v)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 hover:border-orange-300 hover:text-orange-600 transition-colors"
              >
                <span>{LOCALE_LABELS[locale].flag}</span>
                <span>{LOCALE_LABELS[locale].label}</span>
                <svg className={`w-3 h-3 transition-transform ${langOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {langOpen && (
                <div className="absolute right-0 top-full mt-1 bg-white border border-gray-100 rounded-xl shadow-lg py-1 min-w-[120px] z-50">
                  {LOCALES.map(loc => (
                    <button key={loc} onClick={() => { setLocale(loc); setLangOpen(false) }}
                      className={`w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${locale === loc ? 'text-orange-600 font-medium' : 'text-gray-700'}`}>
                      <span>{LOCALE_LABELS[loc].flag}</span>
                      <span>{LOCALE_LABELS[loc].label}</span>
                      {locale === loc && <span className="ml-auto text-orange-500">✓</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Cart */}
            <Link href="/cart" className="relative p-2 text-gray-500 hover:text-orange-500 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <CartBadge />
            </Link>

            {/* Mobile burger */}
            <button className="md:hidden p-2 text-gray-500 hover:text-gray-900 min-w-[44px] min-h-[44px] flex items-center justify-center"
              onClick={() => setMobileOpen(v => !v)}>
              {mobileOpen
                ? <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                : <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
              }
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white px-4 py-4 space-y-1 animate-[slideDown_0.2s_ease-out]">
            {navLinks.map(l => (
              <Link key={l.href} href={l.href} onClick={() => setMobileOpen(false)}
                className={`block px-4 py-3 rounded-lg text-sm font-medium ${isActive(l.href) ? 'text-orange-600 bg-orange-50' : 'text-gray-700 hover:bg-gray-50'}`}>
                {l.label}
              </Link>
            ))}
            <div className="border-t border-gray-100 pt-3 mt-2">
              <p className="text-xs text-gray-400 px-4 mb-2">Language</p>
              <div className="flex gap-2 px-4 flex-wrap">
                {LOCALES.map(loc => (
                  <button key={loc} onClick={() => { setLocale(loc); setMobileOpen(false) }}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-lg border text-sm font-medium transition-colors ${locale === loc ? 'border-orange-400 bg-orange-50 text-orange-600' : 'border-gray-200 text-gray-600'}`}>
                    {LOCALE_LABELS[loc].flag} {LOCALE_LABELS[loc].label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Click outside to close lang dropdown */}
      {langOpen && <div className="fixed inset-0 z-40" onClick={() => setLangOpen(false)} />}

      <main className="flex-1">{children}</main>

      <ChatButton />
      <CookieConsent />

      {/* Footer */}
      <footer className="bg-[#1e3a5f] text-gray-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                  <span className="text-white text-sm font-bold">S</span>
                </div>
                <span className="text-white font-bold text-lg">SimRyoko</span>
              </div>
              <p className="text-sm leading-relaxed text-gray-400">{t('footer.tagline')}</p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">{t('footer.links')}</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/" className="hover:text-white transition-colors">{t('nav.home')}</Link></li>
                <li><Link href="/products" className="hover:text-white transition-colors">{t('nav.products')}</Link></li>
                <li><Link href="/products?type=regional" className="hover:text-white transition-colors">{t('nav.regional')}</Link></li>
                <li><Link href="/products?type=global" className="hover:text-white transition-colors">{t('nav.global')}</Link></li>
                <li><Link href="/cart" className="hover:text-white transition-colors">{t('nav.cart')}</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">{t('footer.contact')}</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="mailto:support@simryoko.com" className="hover:text-white transition-colors">support@simryoko.com</a></li>
                <li className="text-gray-400">{t('footer.support')}</li>
                <li className="flex gap-3 mt-3">
                  <a href="https://t.me/simryoko" target="_blank" rel="noopener" className="text-gray-400 hover:text-white transition-colors text-xs border border-gray-600 px-3 py-1.5 rounded-lg">Telegram</a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-gray-500">
            <span>© {new Date().getFullYear()} SimRyoko. All rights reserved.</span>
            <div className="flex gap-4">
              <Link href="/terms" className="hover:text-gray-300 transition-colors">{t('footer.terms')}</Link>
              <Link href="/privacy" className="hover:text-gray-300 transition-colors">{t('footer.privacy')}</Link>
              <Link href="/refund" className="hover:text-gray-300 transition-colors">{t('footer.refund')}</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
