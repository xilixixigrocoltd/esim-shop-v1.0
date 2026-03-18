'use client';

import { useState } from 'react';
import { useRouter } from 'next/router';
import { Minus, Plus, ShoppingCart, Check, Wifi, Clock, Globe, Info } from 'lucide-react';
import { storage, CART_KEY, formatPrice } from '@/lib/utils';
import { formatDataSize, getCountryFlag } from '@/lib/api';
import type { Product, CartItem } from '@/types';

interface ProductDetailProps {
  product: Product;
}

export default function ProductDetail({ product }: ProductDetailProps) {
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const addToCart = () => {
    const cart = (storage.get(CART_KEY) as CartItem[]) || [];
    const existingIndex = cart.findIndex(item => item.product.id === product.id);

    if (existingIndex >= 0) {
      cart[existingIndex].quantity += quantity;
    } else {
      cart.push({ product, quantity });
    }

    storage.set(CART_KEY, cart);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const buyNow = () => {
    addToCart();
    router.push('/checkout');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex items-center gap-2 mb-4">
            {product.countries?.map((country) => (
              <span key={country.code} className="text-3xl">{getCountryFlag(country.code)}</span>
            ))}
          </div>

          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>

          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex items-center gap-2 px-4 py-2 bg-orange-50 rounded-lg">
              <Wifi className="w-5 h-5 text-orange-500" />
              <span className="font-medium">{formatDataSize(product.dataSize)}</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-orange-50 rounded-lg">
              <Clock className="w-5 h-5 text-orange-500" />
              <span className="font-medium">{product.validDays} 天</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-orange-50 rounded-lg">
              <Globe className="w-5 h-5 text-orange-500" />
              <span className="font-medium">{product.countries?.length || 1} 个国家/地区</span>
            </div>
          </div>

          <div className="flex items-baseline gap-2 mb-6">
            <span className="text-4xl font-bold text-orange-600">${Number(product.price || 0).toFixed(2)}</span>
            <span className="text-gray-400 line-through">${(Number(product.price || 0) * 1.5).toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl p-6 mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">产品详情</h2>
          <div className="space-y-4 text-gray-600">
            <div className="flex items-start gap-3">
              <Check className="w-5 h-5 text-green-500 mt-0.5" />
              <span>即买即用，邮件秒发eSIM二维码</span>
            </div>
            <div className="flex items-start gap-3">
              <Check className="w-5 h-5 text-green-500 mt-0.5" />
              <span>支持热点共享</span>
            </div>
            <div className="flex items-start gap-3">
              <Check className="w-5 h-5 text-green-500 mt-0.5" />
              <span>无需实名认证</span>
            </div>
            <div className="flex items-start gap-3">
              <Check className="w-5 h-5 text-green-500 mt-0.5" />
              <span>7天未激活可退款</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">使用说明</h2>
          <ol className="space-y-3 text-gray-600 list-decimal list-inside">
            <li>购买后查收邮件，保存eSIM二维码</li>
            <li>确保设备已连接WiFi</li>
            <li>打开手机设置 → 蜂窝网络 → 添加eSIM</li>
            <li>扫描二维码完成安装</li>
            <li>开启数据漫游即可使用</li>
          </ol>
        </div>

        <div className="bg-yellow-50 rounded-xl p-4 mb-6">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-yellow-600 mt-0.5" />
            <div className="text-sm text-yellow-800">
              <p className="font-medium mb-1">购买前请确认</p>
              <p>您的设备支持eSIM功能。iPhone XS及更新机型、iPad Pro/Air/Mini (蜂窝版)、Google Pixel 3+、Samsung Galaxy S20+ 等设备支持。</p>
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-gray-200"
            >
              <Minus className="w-5 h-5" />
            </button>
            <span className="w-12 text-center font-semibold text-lg">{quantity}</span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-gray-200"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 text-right">
            <p className="text-sm text-gray-500">合计</p>
            <p className="text-xl font-bold text-orange-600">${(Number(product.price || 0) * quantity).toFixed(2)}</p>
          </div>

          <button
            onClick={addToCart}
            className={`px-6 py-3 rounded-xl font-semibold flex items-center gap-2 ${added ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          >
            {added ? <><Check className="w-5 h-5" /> 已添加</> : <><ShoppingCart className="w-5 h-5" /> 加入购物车</>}
          </button>

          <button
            onClick={buyNow}
            className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold rounded-xl hover:opacity-90"
          >
            立即购买
          </button>
        </div>
      </div>

      <div className="h-24" />
    </div>
  );
}
