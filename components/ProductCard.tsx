import React from 'react'
import Link from 'next/link'
import { Product } from '../lib/data'
import { useI18n } from '../lib/i18n-context'

export function getFlagEmoji(code: string): string {
  const specials: Record<string, string> = { USPR: '🇵🇷', HK: '🇭🇰', TW: '🇹🇼', MO: '🇲🇴', XK: '🇽🇰', GG: '🇬🇬', JE: '🇯🇪', IM: '🇮🇲', FO: '🇫🇴', GL: '🇬🇱' }
  if (specials[code]) return specials[code]
  if (code.length !== 2) return '🌐'
  const o = 127397
  return String.fromCodePoint(code.toUpperCase().charCodeAt(0) + o, code.toUpperCase().charCodeAt(1) + o)
}

export function formatData(mb: number, t: (k: string) => string): string {
  if (mb === 0) return t('product.unlimited')
  if (mb < 1024) return `${mb} MB`
  return `${mb / 1024} GB`
}

function typeColor(type: string) {
  if (type === 'local') return 'bg-emerald-100 text-emerald-700'
  if (type === 'regional') return 'bg-blue-100 text-blue-700'
  return 'bg-purple-100 text-purple-700'
}

interface Props {
  product: Product
  compact?: boolean
  isLowestPrice?: boolean
  soldCount?: number
}

function translateProductName(name: string): string {
  if (!name) return 'eSIM Plan'
  const hasChinese = /[\u4e00-\u9fff]/.test(name)
  if (!hasChinese) return name
  const regionMap: Record<string, string> = {
    '全球通用': 'Global',
    '全球': 'Global',
    '亚洲': 'Asia',
    '东南亚': 'Southeast Asia',
    '欧洲': 'Europe',
    '美洲': 'Americas',
    '北美': 'North America',
    '中东': 'Middle East',
    '非洲': 'Africa',
    '大洋洲': 'Oceania',
    '覆盖': 'Coverage',
    '国家': 'Countries',
    '地区': 'Regions',
    '本地': 'Local',
    '区域': 'Regional',
    '无限流量': 'Unlimited Data',
    '日': 'Day',
    '天': 'Day',
    '月': 'Month',
  }
  let translated = name
  for (const [cn, en] of Object.entries(regionMap)) {
    translated = translated.replace(new RegExp(cn, 'g'), en)
  }
  translated = translated.replace(/[\u4e00-\u9fff]+/g, ' ').replace(/\s+/g, ' ').trim()
  return translated || 'eSIM Plan'
}

export default function ProductCard({ product, compact = false, isLowestPrice = false, soldCount }: Props) {
  const { t } = useI18n()
  const flags = product.countries.slice(0, 3).map(c => getFlagEmoji(c.code)).join(' ')
  const primaryName = product.countries[0]?.name || ''

  // Data unit price: $X.XX/GB — suppress for unlimited data (dataSize=0) or free (price=0)
  const pricePerGb = product.dataSize > 0 && product.price > 0
    ? `$${(product.price / (product.dataSize / 1024)).toFixed(2)}/GB`
    : null

  function addToCart(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    try {
      const CART_KEY = 'cart'
      const cart: Array<Product & { qty: number }> = JSON.parse(localStorage.getItem(CART_KEY) || '[]')
      const idx = cart.findIndex((i) => String(i.id) === String(product.id))
      if (idx >= 0) cart[idx].qty = (cart[idx].qty || 1) + 1
      else cart.push({ ...product, qty: 1 })
      localStorage.setItem(CART_KEY, JSON.stringify(cart))
      window.dispatchEvent(new Event('cart-updated'))
      const btn = e.currentTarget as HTMLButtonElement
      const orig = btn.textContent
      btn.textContent = t('product.addedToCart')
      btn.disabled = true
      setTimeout(() => { btn.textContent = orig; btn.disabled = false }, 1400)
    } catch {}
  }

  if (compact) {
    return (
      <Link href={`/product/${product.id}`} className="block">
        <div className="bg-white rounded-xl border border-gray-100 p-4 hover:shadow-md hover:border-orange-200 transition-all group">
          <div className="flex items-center gap-3">
            <span className="text-2xl flex-shrink-0">{getFlagEmoji(product.countries[0]?.code || '')}</span>
            <div className="flex-1 min-w-0">
              <div className="font-medium text-gray-900 text-sm truncate">{translateProductName(product.name)}</div>
              <div className="text-xs text-gray-400 mt-0.5">{formatData(product.dataSize, t)} · {product.validDays}{t('product.days')}</div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className="text-orange-500 font-bold">${product.price}</span>
              <button onClick={addToCart}
                className="bg-orange-500 text-white text-xs px-3 py-1.5 rounded-lg font-medium hover:bg-orange-600 transition-colors active:scale-95 min-h-[32px]">
                {t('product.buy')}
              </button>
            </div>
          </div>
        </div>
      </Link>
    )
  }

  return (
    <Link href={`/product/${product.id}`} className="block h-full">
      <div className="bg-white rounded-2xl border border-gray-100 p-5 h-full flex flex-col hover:shadow-xl hover:border-orange-200 hover:-translate-y-0.5 transition-all duration-200 group">
        {/* Header row */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-start gap-2">
            <span className="text-3xl leading-none">{flags}</span>
            <div className="min-w-0">
              {product.type !== 'local' && (
                <div className="text-xs text-gray-400 truncate max-w-[120px]">
                  {product.countries.length}{t('product.countries')}
                </div>
              )}
              {product.type === 'local' && (
                <div className="text-xs text-gray-400 truncate max-w-[120px]">{primaryName}</div>
              )}
            </div>
          </div>
          <div className="flex flex-col items-end gap-1">
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${typeColor(product.type)}`}>
              {t(`product.${product.type}`)}
            </span>
            {product.isHot && (
              <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-red-500 text-white shadow-sm animate-pulse">🔥 Hot</span>
            )}
            {isLowestPrice && (
              <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-green-500 text-white shadow-sm">💰 Best Price</span>
            )}
          </div>
        </div>

        {/* Name */}
        <h3 className="font-semibold text-gray-900 text-sm leading-snug mb-4 line-clamp-2 flex-1">{translateProductName(product.name)}</h3>

        {/* Operator name */}
        {product.nameEn && (
          <div className="flex items-center gap-1 mb-3">
            <span className="text-[11px] text-gray-400">📡</span>
            <span className="text-[11px] text-gray-500 font-medium truncate">{product.nameEn}</span>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="bg-gray-50 rounded-xl p-2.5 text-center">
            <div className="text-base font-bold text-gray-900">{formatData(product.dataSize, t)}</div>
            <div className="text-[11px] text-gray-400 mt-0.5">{t('product.data')}</div>
          </div>
          <div className="bg-gray-50 rounded-xl p-2.5 text-center">
            <div className="text-base font-bold text-gray-900">{product.validDays}</div>
            <div className="text-[11px] text-gray-400 mt-0.5">{t('product.validity')}</div>
          </div>
        </div>

        {/* Price + CTA */}
        <div className="flex items-center justify-between mt-auto">
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-orange-500">${product.price}</span>
              <span className="text-xs text-gray-400">USD</span>
            </div>
            {pricePerGb && (
              <div className="text-[11px] text-gray-400 mt-0.5">{pricePerGb}</div>
            )}
          </div>
          <button onClick={addToCart}
            className="bg-orange-500 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-orange-600 transition-colors active:scale-95 min-h-[44px]">
            {t('product.addCart')}
          </button>
        </div>
        {soldCount !== undefined && (
          <div className="mt-2 text-[11px] text-orange-500 font-medium">🔥 {soldCount} sold this week</div>
        )}
      </div>
    </Link>
  )
}
