'use client';

import Link from 'next/link';
import { MessageCircle, Mail } from 'lucide-react';
import { useI18n } from '@/lib/i18n-context';

export default function Footer() {
  const { t } = useI18n();

  return (
    <footer className="bg-gray-900 text-gray-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* ── Col 1: Brand + payment icons ── */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">SR</span>
              </div>
              <span className="text-xl font-bold text-white">SimRyoko</span>
            </div>
            <p className="text-sm leading-relaxed mb-5">
              {t('footer.tagline')}
            </p>
            {/* Payment icons */}
            <div className="flex items-center gap-2 flex-wrap">
              {['VISA', 'MC', 'AMEX', 'USDT'].map((method) => (
                <span
                  key={method}
                  className="px-2.5 py-1 bg-gray-800 rounded text-xs font-semibold text-gray-300 border border-gray-700"
                >
                  {method}
                </span>
              ))}
              <span className="px-2.5 py-1 bg-gray-800 rounded text-xs font-semibold text-gray-300 border border-gray-700">
                Apple Pay
              </span>
            </div>
          </div>

          {/* ── Col 2: Quick links ── */}
          <div>
            <h3 className="text-white font-semibold mb-4">{t('footer.links')}</h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/products?tab=all" className="hover:text-orange-400 transition-colors">
                  {t('footer.link.products')}
                </Link>
              </li>
              <li>
                <Link href="/countries" className="hover:text-orange-400 transition-colors">
                  {t('footer.link.countries')}
                </Link>
              </li>
              <li>
                <Link href="/help" className="hover:text-orange-400 transition-colors">
                  {t('footer.link.help')}
                </Link>
              </li>
              <li>
                <Link href="/help#faq" className="hover:text-orange-400 transition-colors">
                  {t('footer.link.faq')}
                </Link>
              </li>
              <li>
                <Link href="/account/orders" className="hover:text-orange-400 transition-colors">
                  {t('footer.link.orders')}
                </Link>
              </li>
            </ul>
          </div>

          {/* ── Col 3: Contact ── */}
          <div>
            <h3 className="text-white font-semibold mb-4">{t('footer.contact')}</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <a
                  href="https://t.me/Simryokoesimbot"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-orange-400 transition-colors"
                >
                  <MessageCircle className="w-4 h-4 shrink-0" />
                  <span>Telegram: @Simryokoesimbot</span>
                </a>
              </li>
              <li>
                <a
                  href="mailto:xilixi@xigrocoltd.com"
                  className="flex items-center gap-2 hover:text-orange-400 transition-colors"
                >
                  <Mail className="w-4 h-4 shrink-0" />
                  <span>xilixi@xigrocoltd.com</span>
                </a>
              </li>
              <li className="text-gray-500 text-xs pt-1">{t('footer.support_hours')}</li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-800 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-gray-600">
          <p>© 2026 SimRyoko · Xigro Co Limited · All rights reserved.</p>
          <div className="flex gap-5">
            <Link href="/terms" className="hover:text-orange-400 transition-colors">
              {t('footer.terms')}
            </Link>
            <Link href="/privacy" className="hover:text-orange-400 transition-colors">
              {t('footer.privacy')}
            </Link>
            <Link href="/help#refund" className="hover:text-orange-400 transition-colors">
              {t('footer.refund')}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
