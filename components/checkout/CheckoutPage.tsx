'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { CreditCard, Wallet, Mail, AlertCircle, Check, ShoppingBag } from 'lucide-react';
import { storage, CART_KEY, formatPrice, isValidEmail } from '@/lib/utils';
import { formatDataSize, getCountryFlag } from '@/lib/api';
import { useI18n } from '@/lib/i18n-context';
import type { CartItem } from '@/types';

export default function CheckoutPage() {
  const router = useRouter();
  const { t } = useI18n();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [email, setEmail] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'usdt'>('stripe');
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedCart = (storage.get(CART_KEY) as CartItem[]) || [];
    if (savedCart.length === 0) {
      router.push('/cart');
      return;
    }
    setCart(savedCart);
  }, [router]);

  const totalPrice = cart.reduce(
    (sum, item) => sum + Number(item.product.price || 0) * item.quantity,
    0
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!isValidEmail(email)) {
      setError(t('checkout.error.email'));
      return;
    }
    if (!agreed) {
      setError(t('checkout.error.terms'));
      return;
    }

    setLoading(true);
    try {
      const items = cart.map((item) => ({
        id: item.product.id,
        productId: item.product.id,
        quantity: item.quantity,
        productName: item.product.name,
        dataSize: item.product.dataSize,
        validDays: item.product.validDays,
        imageUrl: item.product.imageUrl,
      }));

      const response = await fetch('/api/payment/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, items, amount: totalPrice }),
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data.error || `${t('checkout.error.server')} (${response.status})`);
        return;
      }

      if (data.success && data.paymentUrl) {
        window.location.href = data.paymentUrl;
        return;
      }
      if (paymentMethod === 'usdt') {
        router.push(
          `/success?orderId=USDT-${Date.now()}&email=${encodeURIComponent(email)}&method=usdt`
        );
        return;
      }
      setError(data.error || t('checkout.error.network'));
    } catch (err: any) {
      setError(err.message || t('checkout.error.network'));
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">{t('checkout.confirm_order')}</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* ── Left: Order summary ── */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-orange-500" />
                {t('checkout.order_summary')}
              </h2>
              <div className="space-y-4 divide-y divide-gray-100">
                {cart.map((item) => (
                  <div key={item.product.id} className="flex items-center gap-3 pt-4 first:pt-0">
                    <div className="w-11 h-11 bg-gray-50 rounded-xl flex items-center justify-center text-2xl shrink-0">
                      {item.product.countries?.[0]
                        ? getCountryFlag(item.product.countries[0].code)
                        : '🌐'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">{item.product.name}</p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {formatDataSize(item.product.dataSize)} · {item.product.validDays} {t('checkout.days_unit')} × {item.quantity}
                      </p>
                    </div>
                    <p className="font-semibold text-gray-900 shrink-0">
                      ${(Number(item.product.price || 0) * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
              <div className="border-t mt-4 pt-4 flex justify-between items-center">
                <span className="font-semibold text-gray-700">{t('cart.total')}</span>
                <span className="text-xl font-bold text-orange-500">{formatPrice(totalPrice)}</span>
              </div>
            </div>

            {/* eSIM delivery notice */}
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 text-sm text-blue-700">
              <p className="font-semibold mb-1">{t('checkout.delivery.title')}</p>
              <p>{t('checkout.delivery.desc')}</p>
            </div>

            {/* China warning */}
            <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-sm text-red-700">
              <p className="font-semibold mb-1">{t('checkout.warning.title')}</p>
              <p>{t('checkout.warning.desc')}</p>
            </div>
          </div>

          {/* ── Right: Payment form ── */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Mail className="w-5 h-5 text-orange-500" />
                {t('checkout.email.label')}
              </h2>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-transparent outline-none text-base"
                required
              />
              <p className="text-xs text-gray-400 mt-2">{t('checkout.email.hint')}</p>
            </div>

            {/* Payment method */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="font-semibold text-gray-900 mb-4">{t('checkout.payment.label')}</h2>
              <div className="space-y-3">
                {/* Stripe */}
                <label
                  className={`flex items-center gap-4 p-4 border-2 rounded-2xl cursor-pointer transition-colors ${
                    paymentMethod === 'stripe'
                      ? 'border-orange-400 bg-orange-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="stripe"
                    checked={paymentMethod === 'stripe'}
                    onChange={() => setPaymentMethod('stripe')}
                    className="hidden"
                  />
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center shrink-0">
                    <CreditCard className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{t('checkout.payment.stripe')}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{t('checkout.payment.stripe.desc')}</p>
                  </div>
                  {paymentMethod === 'stripe' && (
                    <Check className="w-5 h-5 text-orange-500 shrink-0" />
                  )}
                </label>

                {/* USDT */}
                <label
                  className={`flex items-center gap-4 p-4 border-2 rounded-2xl cursor-pointer transition-colors ${
                    paymentMethod === 'usdt'
                      ? 'border-orange-400 bg-orange-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="usdt"
                    checked={paymentMethod === 'usdt'}
                    onChange={() => setPaymentMethod('usdt')}
                    className="hidden"
                  />
                  <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center shrink-0">
                    <Wallet className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{t('checkout.payment.usdt.label')}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{t('checkout.payment.usdt.desc2')}</p>
                  </div>
                  {paymentMethod === 'usdt' && (
                    <Check className="w-5 h-5 text-orange-500 shrink-0" />
                  )}
                </label>
              </div>
            </div>

            {/* Agree */}
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-1 w-4 h-4 accent-orange-500 rounded"
              />
              <span className="text-sm text-gray-500">
                {t('checkout.agree.text')}{' '}
                <a href="/help" target="_blank" className="text-orange-500 hover:underline">
                  {t('checkout.agree.terms')}
                </a>
                {t('checkout.agree.device')}
              </span>
            </label>

            {error && (
              <div className="flex items-center gap-2 text-red-600 bg-red-50 p-4 rounded-2xl text-sm">
                <AlertCircle className="w-5 h-5 shrink-0" />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-bold rounded-2xl transition-colors text-base"
            >
              {loading ? t('checkout.pay.loading') : `${t('checkout.pay.btn')} ${formatPrice(totalPrice)}`}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
