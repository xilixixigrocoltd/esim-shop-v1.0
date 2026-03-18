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
    const savedCart = storage.get(CART_KEY) || [];
    setCart(savedCart);
    setLoading(false);
  }, []);

  const updateCart = (newCart: CartItem[]) => {
    setCart(newCart);
    storage.set(CART_KEY, newCart);
  };

  const updateQuantity = (productId: number, delta: number) => {
    const newCart = cart.map(item => {
      if (item.product.id === productId) {
        const newQuantity = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQuantity };
      }
      return item;
    });
    updateCart(newCart);
  };

  const removeItem = (productId: number) => {
    const newCart = cart.filter(item => item.product.id !== productId);
    updateCart(newCart);
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + parseFloat(item.product.agentPrice) * item.quantity, 0);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-md mx-auto px-4 text-center">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="w-12 h-12 text-gray-400" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">购物车是空的</h1>
          <p className="text-gray-500 mb-8">快去选购心仪的eSIM套餐吧</p>
          <Link href="/countries" className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold rounded-xl">
            去选购 <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">购物车 ({totalItems})</h1>

        <div className="space-y-4">
          {cart.map((item) => (
            <div key={item.product.id} className="bg-white rounded-xl p-4 shadow-sm flex gap-4">
              <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center text-3xl">
                {item.product.countries?.[0] && getCountryFlag(item.product.countries[0].code)}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{item.product.name}</h3>
                <p className="text-sm text-gray-500">
                  {formatDataSize(item.product.dataSize)} / {item.product.validDays}天
                </p>
                <p className="text-orange-600 font-semibold mt-1">{formatPrice(item.product.agentPrice)}</p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <button onClick={() => removeItem(item.product.id)} className="text-gray-400 hover:text-red-500">
                  <Trash2 className="w-5 h-5" />
                </button>
                <div className="flex items-center gap-2">
                  <button onClick={() => updateQuantity(item.product.id, -1)} className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-gray-200">
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-8 text-center font-semibold">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.product.id, 1)} className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-gray-200">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 bg-white rounded-xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <span className="text-gray-600">小计</span>
            <span className="font-semibold">{formatPrice(totalPrice)}</span>
          </div>
          <div className="flex justify-between items-center text-lg font-bold">
            <span>总计</span>
            <span className="text-orange-600">{formatPrice(totalPrice)}</span>
          </div>
          <button 
            onClick={() => router.push('/checkout')}
            className="w-full mt-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold rounded-xl hover:opacity-90"
          >
            去结算
          </button>
        </div>
      </div>
    </div>
  );
}
