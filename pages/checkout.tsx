import Head from 'next/head'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { Modal } from '../components/ui/Modal'
import { getFlagEmoji, formatData } from '../components/ProductCard'
import { useI18n } from '../lib/i18n-context'
import { Product } from '../lib/data'

type CartItem = Product & { qty: number }

const USDT_ADDRESS = 'TBuhpRpFPV1HkdfaPEdxsKgTE43jV911rL'

export default function CheckoutPage() {
  const { t } = useI18n()
  const router = useRouter()
  const [cart, setCart] = useState<CartItem[]>([])
  const [mounted, setMounted] = useState(false)
  const [email, setEmail] = useState('')
  const [payMethod, setPayMethod] = useState<'stripe' | 'usdt'>('stripe')
  const [agreed, setAgreed] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)
  
  // USDT 支付确认弹窗
  const [showUsdtModal, setShowUsdtModal] = useState(false)
  const [usdtInfo, setUsdtInfo] = useState({ address: '', amount: '' })

  useEffect(() => {
    setMounted(true)
    try { setCart(JSON.parse(localStorage.getItem('cart') || '[]')) } catch {}
  }, [])

  const total = cart.reduce((s, i) => s + i.price * (i.qty || 1), 0)

  async function handlePay() {
    setError('')
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError(t('checkout.errorEmail')); return }
    if (!agreed) { setError(t('checkout.errorTerms')); return }

    setLoading(true)
    try {
      if (payMethod === 'stripe') {
        const res = await fetch('/api/checkout/create-session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ items: cart, email }),
        })
        if (!res.ok) throw new Error(t('checkout.errorFailed'))
        const data = await res.json()
        if (data.url) window.location.href = data.url
        else throw new Error(t('checkout.errorFailed'))
      } else {
        // USDT flow: show confirmation modal
        const usdtAddress = 'TBuhpRpFPV1HkdfaPEdxsKgTE43jV911rL' // USDT 接收地址
        setUSDTInfo({
          address: usdtAddress,
          amount: total.toFixed(2)
        })
        setShowUsdtModal(true)
        setLoading(false)
        return
      }
    } catch (e: any) {
      setError(e.message || t('checkout.errorFailed'))
    }
    setLoading(false)
  }

  // USDT 确认支付
  const confirmUsdtPayment = async () => {
    setShowUsdtModal(false)
    try {
      await fetch('/api/payment/usdt-notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, amount: usdtInfo.amount })
      })
      alert(t('payment.usdt.completed') + ' - ' + t('payment.usdt.completed_desc'))
    } catch (err) {
      console.error('USDT notify failed:', err)
    }
  }

  function copyAddress() {
    navigator.clipboard.writeText(USDT_ADDRESS).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000) })
  }

  if (!mounted) return null

  if (cart.length === 0) {
    router.push('/cart')
    return null
  }

  return (
    <>
      <Head>
        <title>{t('checkout.title')} — SimRyoko</title>
      </Head>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">{t('checkout.title')}</h1>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left: form */}
          <div className="lg:col-span-3 space-y-5">
            {/* Email */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <label className="block text-sm font-semibold text-gray-900 mb-2">{t('checkout.email')}</label>
              <input
                type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder={t('checkout.emailPlaceholder')}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent text-sm"
              />
              <div className="mt-2 flex items-center gap-2 bg-orange-50 border border-orange-200 rounded-lg px-3 py-2">
                <span className="text-orange-500 text-sm flex-shrink-0">📧</span>
                <p className="text-xs text-orange-700 font-medium">eSIM 将发到此邮箱，请务必填写正确！</p>
              </div>
              <p className="text-xs text-gray-400 mt-2">{t('checkout.emailHint')}</p>
            </div>

            {/* eSIM delivery info */}
            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5">
              <p className="font-semibold text-blue-800 mb-1">{t('checkout.deliveryTitle')}</p>
              <p className="text-blue-700 text-sm">{t('checkout.deliveryDesc')}</p>
            </div>

            {/* Refund guarantee */}
            <div className="bg-green-50 border border-green-200 rounded-2xl p-5 flex items-start gap-3">
              <span className="text-2xl flex-shrink-0">🛡️</span>
              <div>
                <p className="font-semibold text-green-800 mb-1">7天无理由退款保障</p>
                <p className="text-green-700 text-sm">购买后7天内，如因产品质量问题无法正常使用，可申请全额退款。</p>
              </div>
            </div>

            {/* China warning */}
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
              <p className="font-semibold text-amber-800 mb-1">{t('checkout.warningTitle')}</p>
              <p className="text-amber-700 text-sm">{t('checkout.warningDesc')}</p>
            </div>

            {/* Payment method */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <p className="text-sm font-semibold text-gray-900 mb-4">{t('checkout.payment')}</p>
              <div className="space-y-3">
                {/* Stripe */}
                <label className={`flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-colors ${payMethod === 'stripe' ? 'border-orange-400 bg-orange-50' : 'border-gray-100 hover:border-gray-200'}`}>
                  <input type="radio" name="pay" value="stripe" checked={payMethod === 'stripe'} onChange={() => setPayMethod('stripe')} className="mt-0.5 accent-orange-500" />
                  <div>
                    <div className="flex items-center gap-2 font-medium text-gray-900 text-sm">
                      <span>💳</span> {t('checkout.stripe')}
                    </div>
                    <div className="text-xs text-gray-400 mt-0.5">{t('checkout.stripeDesc')}</div>
                  </div>
                </label>

                {/* USDT */}
                <label className={`flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-colors ${payMethod === 'usdt' ? 'border-orange-400 bg-orange-50' : 'border-gray-100 hover:border-gray-200'}`}>
                  <input type="radio" name="pay" value="usdt" checked={payMethod === 'usdt'} onChange={() => setPayMethod('usdt')} className="mt-0.5 accent-orange-500" />
                  <div>
                    <div className="flex items-center gap-2 font-medium text-gray-900 text-sm">
                      <span>₮</span> {t('checkout.usdt')}
                    </div>
                    <div className="text-xs text-gray-400 mt-0.5">{t('checkout.usdtDesc')}</div>
                  </div>
                </label>
              </div>
            </div>

            {/* Terms */}
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} className="mt-1 accent-orange-500 w-4 h-4 flex-shrink-0" />
              <span className="text-sm text-gray-600">
                {t('checkout.agreePrefix')}{' '}
                <span className="text-orange-500 underline cursor-pointer">{t('checkout.agreeTerms')}</span>
                {t('checkout.agreeSuffix')}
              </span>
            </label>

            {error && <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700">{error}</div>}

            {/* Mobile order summary (visible on small screens) */}
            <div className="lg:hidden bg-orange-50 border border-orange-200 rounded-2xl p-4">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-gray-900 text-sm">订单总计</span>
                <span className="text-2xl font-extrabold text-orange-500">${total.toFixed(2)}</span>
              </div>
              <div className="text-xs text-gray-500 mt-1">{cart.length} 件商品</div>
            </div>

            <button onClick={handlePay} disabled={loading}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 rounded-2xl text-lg transition-colors shadow-lg disabled:opacity-60 disabled:cursor-not-allowed min-h-[60px] flex items-center justify-center gap-2">
              {loading
                ? <><span className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />{t('checkout.processing')}</>
                : payMethod === 'usdt' ? `${t('checkout.pay')} (USDT)` : t('checkout.pay')
              }
            </button>
            <div className="flex items-center justify-center gap-3 flex-wrap">
              <p className="text-center text-xs text-gray-400">{t('checkout.security')}</p>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400">🔒 SSL加密</span>
                <span className="text-xs text-gray-400">💳 Stripe</span>
                <span className="text-xs text-gray-400">🛡️ 7天退款</span>
              </div>
            </div>
          </div>

          {/* Right: order summary */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-gray-100 p-6 sticky top-24">
              <h3 className="font-bold text-gray-900 mb-5">{t('checkout.summary')}</h3>
              <div className="space-y-4 mb-5">
                {cart.map(item => (
                  <div key={item.id} className="flex items-center gap-3">
                    <span className="text-2xl flex-shrink-0">{getFlagEmoji(item.countries?.[0]?.code || '')}</span>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-gray-900 truncate">{item.name}</div>
                      <div className="text-xs text-gray-400 mt-0.5">{formatData(item.dataSize, t)} · {item.validDays}{t('product.days')} × {item.qty || 1}</div>
                    </div>
                    <span className="font-semibold text-gray-900 flex-shrink-0">${(item.price * (item.qty || 1)).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-gray-100 pt-4 flex justify-between items-center">
                <span className="font-bold text-gray-900">{t('cart.total')}</span>
                <span className="text-2xl font-extrabold text-orange-500">${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* USDT 支付确认弹窗 */}
      <Modal isOpen={showUsdtModal} onClose={() => setShowUsdtModal(false)}>
        <div className="bg-white rounded-xl p-6 max-w-md w-full">
          <h2 className="text-xl font-bold text-gray-900 mb-4">{t('payment.usdt.confirm_title')}</h2>
          <p className="text-gray-600 mb-6">{t('payment.usdt.confirm_desc')}</p>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('payment.usdt.address')}</label>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={usdtInfo.address} 
                  readOnly 
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm"
                />
                <button 
                  onClick={() => navigator.clipboard.writeText(usdtInfo.address)}
                  className="px-3 py-2 bg-gray-100 rounded-lg text-sm hover:bg-gray-200"
                >
                  {t('payment.usdt.copy_address')}
                </button>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('payment.usdt.amount')}</label>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={usdtInfo.amount} 
                  readOnly 
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm"
                />
                <button 
                  onClick={() => navigator.clipboard.writeText(usdtInfo.amount)}
                  className="px-3 py-2 bg-gray-100 rounded-lg text-sm hover:bg-gray-200"
                >
                  {t('payment.usdt.copy_amount')}
                </button>
              </div>
            </div>
          </div>
          
          <div className="mt-6 flex flex-col gap-3">
            <button 
              onClick={confirmUsdtPayment}
              className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700"
            >
              {t('payment.usdt.completed')}
            </button>
            <button 
              onClick={() => setShowUsdtModal(false)}
              className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50"
            >
              {t('common.cancel')}
            </button>
          </div>
        </div>
      </Modal>
    </>
  )
}
