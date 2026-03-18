'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { CreditCard, Wallet, Mail, AlertCircle, Check } from 'lucide-react';
import { storage, CART_KEY, formatPrice, isValidEmail } from '@/lib/utils';
import { formatDataSize, getCountryFlag } from '@/lib/api';
import type { CartItem } from '@/types';

export default function CheckoutPage() {
  const router = useRouter();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [email, setEmail] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'usdt'>('stripe');
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedCart = storage.get(CART_KEY) as CartItem[] || [];
    if (savedCart.length === 0) {
      router.push('/cart');
      return;
    }
    setCart(savedCart);
  }, [router]);

  const totalPrice = cart.reduce((sum, item) => sum + parseFloat(item.product.agentPrice) * item.quantity, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!isValidEmail(email)) {
      setError('请输入有效的邮箱地址');
      return;
    }

    if (!agreed) {
      setError('请同意购买须知');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/payment/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          items: cart.map(item => ({ id: item.product.id, quantity: item.quantity })),
          method: paymentMethod,
          amount: totalPrice,
        }),
      });

      const data = await response.json();

      if (data.success) {
        if (paymentMethod === 'stripe' && data.paymentUrl) {
          window.location.href = data.paymentUrl;
        } else if (paymentMethod === 'usdt') {
          router.push(`/success?orderId=${data.orderId}&email=${encodeURIComponent(email)}`);
        }
      } else {
        setError(data.error || '支付创建失败');
      }
    } catch (err) {
      setError('网络错误，请重试');
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">结算</h1>

        <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
          <h2 className="font-semibold text-gray-900 mb-4">订单商品</h2>
          <div className="space-y-4">
            {cart.map((item) => (
              <div key={item.product.id} className="flex gap-4">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-2xl">
                  {item.product.countries?.[0] && getCountryFlag(item.product.countries[0].code)}
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{item.product.name}</h3>
                  <p className="text-sm text-gray-500">
                    {formatDataSize(item.product.dataSize)} / {item.product.validDays}天 x {item.quantity}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{formatPrice(parseFloat(item.product.agentPrice) * item.quantity)}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="border-t mt-4 pt-4 flex justify-between items-center">
            <span className="font-semibold">总计</span>
            <span className="text-xl font-bold text-orange-600">{formatPrice(totalPrice)}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="font-semibold text-gray-900 mb-4">联系邮箱</h2>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="用于接收eSIM二维码"
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="font-semibold text-gray-900 mb-4">支付方式</h2>
            <div className="space-y-3">
              <label className={`flex items-center gap-4 p-4 border rounded-xl cursor-pointer ${paymentMethod === 'stripe' ? 'border-orange-500 bg-orange-50' : 'border-gray-200'}`}>
                <input type="radio" name="payment" value="stripe" checked={paymentMethod === 'stripe'} onChange={() => setPaymentMethod('stripe')} className="hidden" />
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">信用卡/借记卡</p>
                  <p className="text-sm text-gray-500">支持 Visa, MasterCard</p>
                </div>
                {paymentMethod === 'stripe' && <Check className="w-5 h-5 text-orange-500" />}
              </label>

              <label className={`flex items-center gap-4 p-4 border rounded-xl cursor-pointer ${paymentMethod === 'usdt' ? 'border-orange-500 bg-orange-50' : 'border-gray-200'}`}>
                <input type="radio" name="payment" value="usdt" checked={paymentMethod === 'usdt'} onChange={() => setPaymentMethod('usdt')} className="hidden" />
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Wallet className="w-5 h-5 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">USDT</p>
                  <p className="text-sm text-gray-500">TRC-20 网络</p>
                </div>
                {paymentMethod === 'usdt' && <Check className="w-5 h-5 text-orange-500" />}
              </label>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="mt-1 w-5 h-5 text-orange-500 rounded focus:ring-orange-500" />
              <div className="text-sm text-gray-600">
                我已阅读并同意
                <a href="/help" target="_blank" className="text-orange-600 hover:underline">购买须知</a>
                ，确认我的设备支持eSIM功能
              </div>
            </label>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-red-600 bg-red-50 p-4 rounded-xl">
              <AlertCircle className="w-5 h-5" />
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold rounded-xl hover:opacity-90 disabled:opacity-50"
          >
            {loading ? '处理中...' : `确认支付 ${formatPrice(totalPrice)}`}
          </button>
        </form>
      </div>
    </div>
  );
}
