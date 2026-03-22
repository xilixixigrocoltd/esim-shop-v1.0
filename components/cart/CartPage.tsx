'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { storage, CART_KEY, formatPrice } from '@/lib/utils';
import { getCountryFlag, formatDataSize } from '@/lib/api';
import type { CartItem } from '@/types';

export default function CartPage() {
  const router = useRouter();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedCart = (storage.get(CART_KEY) as CartItem[]) || [];
    setCart(savedCart);
    setLoading(false);
  }, []);

  const updateCart = (newCart: CartItem[]) => {
    setCart(newCart);
    storage.set(CART_KEY, newCart);
  };

  const updateQuantity = (productId: number, delta: number) => {
    const newCart = cart.map((item) => {
      if (item.product.id === productId) {
        const newQuantity = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQuantity };
      }
      return item;
    });
    updateCart(newCart);
  };

  const removeItem = (productId: number) => {
    updateCart(cart.filter((item) => item.product.id !== productId));
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce(
    (sum, item) => sum + Number(item.product.price || 0) * item.quantity,
    0
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  /* ─── Empty state ─── */
  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="w-12 h-12 text-orange-400" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">购物车是空的</h1>
          <p className="text-gray-500 mb-8">还没有选好套餐？去挑一个吧！</p>
          <Link
            href="/countries"
            className="inline-flex items-center gap-2 px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-2xl transition-colors"
          >
            去挑选套餐 <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    );
  }

  /* ─── Cart with items ─── */
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          购物车
          <span className="ml-2 text-base font-normal text-gray-400">({totalItems} 件)</span>
        </h1>

        {/* Item list */}
        <div className="space-y-3 mb-6">
          {cart.map((item) => (
            <div
              key={item.product.id}
              className="bg-white rounded-2xl p-4 shadow-sm flex items-center gap-4"
            >
              {/* Flag */}
              <div className="w-14 h-14 bg-gray-50 rounded-xl flex items-center justify-center text-3xl shrink-0">
                {item.product.countries?.[0]
                  ? getCountryFlag(item.product.countries[0].code)
                  : '🌐'}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 truncate">{item.product.name}</h3>
                <p className="text-sm text-gray-400 mt-0.5">
                  {formatDataSize(item.product.dataSize)} · {item.product.validDays} 天
                </p>
                <p className="text-orange-500 font-bold mt-1">
                  ${Number(item.product.price || 0).toFixed(2)}
                </p>
              </div>

              {/* Quantity + delete */}
              <div className="flex flex-col items-end gap-2 shrink-0">
                <button
                  onClick={() => removeItem(item.product.id)}
                  className="text-gray-300 hover:text-red-400 transition-colors"
                  aria-label="删除"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => updateQuantity(item.product.id, -1)}
                    className="w-7 h-7 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center transition-colors"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-6 text-center font-semibold text-sm">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.product.id, 1)}
                    className="w-7 h-7 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex justify-between items-center text-gray-500 mb-2 text-sm">
            <span>商品小计 ({totalItems} 件)</span>
            <span>{formatPrice(totalPrice)}</span>
          </div>
          <div className="flex justify-between items-center text-lg font-bold border-t pt-4 mt-4">
            <span>合计</span>
            <span className="text-orange-500">{formatPrice(totalPrice)}</span>
          </div>
          <button
            onClick={() => router.push('/checkout')}
            className="w-full mt-5 py-4 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-2xl transition-colors text-base"
          >
            去结账
          </button>
          <Link
            href="/countries"
            className="block text-center mt-3 text-sm text-gray-400 hover:text-orange-500 transition-colors"
          >
            继续选购
          </Link>
        </div>
      </div>
    </div>
  );
}
