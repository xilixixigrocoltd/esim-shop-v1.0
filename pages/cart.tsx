import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { getFlagEmoji, formatData } from '../components/ProductCard'
import { useI18n } from '../lib/i18n-context'
import { Product } from '../lib/data'

type CartItem = Product & { qty: number }

export default function CartPage() {
  const { t } = useI18n()
  const router = useRouter()
  const [cart, setCart] = useState<CartItem[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    try { setCart(JSON.parse(localStorage.getItem('cart') || '[]')) } catch { setCart([]) }
  }, [])

  function sync(items: CartItem[]) {
    setCart(items)
    localStorage.setItem('cart', JSON.stringify(items))
    window.dispatchEvent(new Event('cart-updated'))
  }

  function updateQty(id: string | number, delta: number) {
    const updated = cart.map(i => String(i.id) === String(id) ? { ...i, qty: Math.max(1, (i.qty || 1) + delta) } : i)
    sync(updated)
  }

  function remove(id: string | number) {
    sync(cart.filter(i => String(i.id) !== String(id)))
  }

  const total = cart.reduce((s, i) => s + i.price * (i.qty || 1), 0)

  if (!mounted) return null

  return (
    <>
      <Head>
        <title>{t('cart.title')} — SimRyoko</title>
      </Head>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">{t('cart.title')}</h1>

        {cart.length === 0 ? (
          <div className="text-center py-24">
            <div className="text-7xl mb-6">🛒</div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">{t('cart.empty')}</h2>
            <p className="text-gray-400 mb-8">{t('cart.emptyDesc')}</p>
            <Link href="/products"
              className="inline-block bg-orange-500 text-white font-bold px-8 py-4 rounded-2xl hover:bg-orange-600 transition-colors">
              {t('cart.browse')}
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Items list */}
            <div className="lg:col-span-2 space-y-4">
              {cart.map(item => (
                <div key={item.id} className="bg-white rounded-2xl border border-gray-100 p-5">
                  <div className="flex items-start gap-4">
                    <div className="text-3xl flex-shrink-0">
                      {item.countries?.slice(0,2).map(c => getFlagEmoji(c.code)).join('')}
                    </div>
                    <div className="flex-1 min-w-0">
                      <Link href={`/product/${item.id}`} className="font-semibold text-gray-900 hover:text-orange-500 transition-colors line-clamp-2 text-sm">
                        {item.name}
                      </Link>
                      <div className="text-xs text-gray-400 mt-1.5 flex gap-3">
                        <span>{formatData(item.dataSize, t)}</span>
                        <span>·</span>
                        <span>{item.validDays} {t('product.days')}</span>
                      </div>
                    </div>
                    <button onClick={() => remove(item.id)}
                      className="text-gray-300 hover:text-red-400 transition-colors p-1.5 flex-shrink-0">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-50">
                    {/* Qty */}
                    <div className="flex items-center gap-3">
                      <button onClick={() => updateQty(item.id, -1)}
                        className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:border-orange-400 hover:text-orange-500 transition-colors text-lg font-bold">
                        −
                      </button>
                      <span className="w-6 text-center font-semibold text-gray-900">{item.qty || 1}</span>
                      <button onClick={() => updateQty(item.id, 1)}
                        className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:border-orange-400 hover:text-orange-500 transition-colors text-lg font-bold">
                        +
                      </button>
                    </div>
                    <span className="font-bold text-orange-500 text-lg">${(item.price * (item.qty || 1)).toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl border border-gray-100 p-6 sticky top-24">
                <h3 className="font-bold text-gray-900 mb-5">{t('cart.subtotal')}</h3>
                <div className="space-y-3 mb-6">
                  {cart.map(i => (
                    <div key={i.id} className="flex justify-between text-sm">
                      <span className="text-gray-500 truncate max-w-[140px]">{i.name}</span>
                      <span className="font-medium text-gray-900 flex-shrink-0 ml-2">${(i.price * (i.qty || 1)).toFixed(2)}</span>
                    </div>
                  ))}
                  <div className="border-t border-gray-100 pt-3 flex justify-between font-bold text-gray-900">
                    <span>{t('cart.total')}</span>
                    <span className="text-orange-500 text-xl">${total.toFixed(2)}</span>
                  </div>
                </div>
                <button onClick={() => router.push('/checkout')}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 rounded-2xl transition-colors shadow-lg text-lg min-h-[56px]">
                  {t('cart.checkout')}
                </button>
                <Link href="/products" className="block text-center text-sm text-gray-400 hover:text-orange-500 transition-colors mt-4">
                  ← {t('cart.continue')}
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
