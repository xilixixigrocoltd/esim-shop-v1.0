'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, ShoppingCart, Menu, X } from 'lucide-react';
import LanguageSwitcher from './LanguageSwitcher';
import { useI18n } from '@/lib/i18n-context';

interface HeaderProps {
  cartCount?: number;
}

export default function Header({ cartCount = 0 }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t } = useI18n();

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">SR</span>
            </div>
            <span className="text-xl font-bold text-gray-900">SimRyoko</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link href="/products" className="text-gray-600 hover:text-orange-600 font-medium">
              {t('nav.products')}
            </Link>
            <Link href="/countries" className="text-gray-600 hover:text-orange-600 font-medium">
              {t('nav.countries')}
            </Link>
            <Link href="/help" className="text-gray-600 hover:text-orange-600 font-medium">
              {t('nav.help')}
            </Link>
            <LanguageSwitcher />
          </nav>

          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <Link href="/cart" className="relative p-2 text-gray-600 hover:text-orange-600">
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-orange-500 to-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden p-2">
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white">
          <nav className="px-4 py-3 space-y-1">
            <Link href="/products" className="block px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg">
              {t('nav.products')}
            </Link>
            <Link href="/countries" className="block px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg">
              {t('nav.countries')}
            </Link>
            <Link href="/help" className="block px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg">
              {t('nav.help')}
            </Link>
            <div className="px-3 py-2">
              <LanguageSwitcher />
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
