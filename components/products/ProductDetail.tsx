'use client';

import { useState } from 'react';
import { useRouter } from 'next/router';
import { Minus, Plus, ShoppingCart, Check, Wifi, Clock, Globe, Info, Phone } from 'lucide-react';
import { storage, CART_KEY } from '@/lib/utils';
import { formatDataSize, getCountryFlag } from '@/lib/api';
import { useI18n } from '@/lib/i18n-context';
import type { Product, CartItem } from '@/types';

interface ProductDetailProps {
  product: Product;
}

export default function ProductDetail({ product }: ProductDetailProps) {
  const router = useRouter();
  const { t } = useI18n();
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

  const hasOnlyData = product.features?.some(f => f.includes('仅数据') || f.includes('仅流量'));
  const planType = hasOnlyData 
    ? { type: t('products.type.data_only'), icon: Wifi, color: 'text-blue-600 bg-blue-50 border-blue-200' }
    : { type: t('products.type.data_voice_sms'), icon: Phone, color: 'text-green-600 bg-green-50 border-green-200' };
  const PlanIcon = planType.icon;

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

          {/* 套餐类型标签 */}
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-4 border ${planType.color}`}>
            <PlanIcon className="w-4 h-4" />
            <span>{planType.type}</span>
          </div>

          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex items-center gap-2 px-4 py-2 bg-orange-50 rounded-lg">
              <Wifi className="w-5 h-5 text-orange-500" />
              <span className="font-medium">{formatDataSize(product.dataSize)}</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-orange-50 rounded-lg">
              <Clock className="w-5 h-5 text-orange-500" />
              <span className="font-medium">{product.validDays + ' 天'}</span>
            </div>
            {product.type !== 'local' && (
              <div className="flex items-center gap-2 px-4 py-2 bg-orange-50 rounded-lg">
                <Globe className="w-5 h-5 text-orange-500" />
                <span className="font-medium">{product.countries?.length || 1} {t('product.countries')}</span>
              </div>
            )}
          </div>

          <div className="flex items-baseline gap-2 mb-6">
            <span className="text-4xl font-bold text-orange-600">${Number(product.price || 0).toFixed(2)}</span>
            <span className="text-gray-400 line-through">${(Number(product.price || 0) * 1.5).toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl p-6 mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">{t('product.detail.description')}</h2>
          <div className="space-y-4 text-gray-600">
            <div className="flex items-start gap-3">
              <Check className="w-5 h-5 text-green-500 mt-0.5" />
              <span>{t('product.detail.terms.item1')}</span>
            </div>
            <div className="flex items-start gap-3">
              <Check className="w-5 h-5 text-green-500 mt-0.5" />
              <span>{t('product.detail.terms.item2')}</span>
            </div>
            <div className="flex items-start gap-3">
              <Check className="w-5 h-5 text-green-500 mt-0.5" />
              <span>{t('product.detail.terms.item3')}</span>
            </div>
            <div className="flex items-start gap-3">
              <Check className="w-5 h-5 text-green-500 mt-0.5" />
              <span>{t('product.detail.terms.item4')}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">{t('product.detail.installation')}</h2>
          <ol className="space-y-3 text-gray-600 list-decimal list-inside">
            <li>{t('product.detail.installation')}</li>
            <li>确保设备已连接 WiFi</li>
            <li>打开手机设置 → 蜂窝网络 → 添加 eSIM</li>
            <li>扫描二维码完成安装</li>
            <li>开启数据漫游即可使用</li>
          </ol>
        </div>

        <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 mb-6">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-red-800">
              <p className="font-bold mb-1">{t('product.detail.warning.china')}</p>
              <p className="font-semibold">{t('product.detail.warning.china.desc')}</p>
              <p className="mt-2 text-red-700">{t('product.detail.warning.china.note')}</p>
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 rounded-xl p-4 mb-6">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-yellow-600 mt-0.5" />
            <div className="text-sm text-yellow-800">
              <p className="font-medium mb-1">{t('product.detail.terms')}</p>
              <p>{t('product.detail.terms.item5')}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 pb-6 md:pb-4">
        <div className="max-w-4xl mx-auto">
          {/* 移动端：垂直布局 */}
          <div className="flex flex-col gap-3 md:hidden">
            {/* 数量 + 总价 */}
            <div className="flex items-center justify-between">
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
              <div className="text-right">
                <p className="text-sm text-gray-500">{t('cart.total')}</p>
                <p className="text-xl font-bold text-orange-600">${(Number(product.price || 0) * quantity).toFixed(2)}</p>
              </div>
            </div>
            
            {/* 按钮：全宽垂直排列 */}
            <div className="flex flex-col gap-2">
              <button
                onClick={addToCart}
                className={`w-full py-3 rounded-xl font-semibold flex items-center justify-center gap-2 ${added ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                {added ? <><Check className="w-5 h-5" /> ✓</> : <><ShoppingCart className="w-5 h-5" /> {t('product.detail.add_to_cart')}</>}
              </button>
              
              <button
                onClick={buyNow}
                className="w-full py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold rounded-xl hover:opacity-90"
              >
                {t('product.detail.buy_now')}
              </button>
            </div>
          </div>

          {/* 桌面端：水平布局 */}
          <div className="hidden md:flex items-center gap-4">
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
              <p className="text-sm text-gray-500">{t('cart.total')}</p>
              <p className="text-xl font-bold text-orange-600">${(Number(product.price || 0) * quantity).toFixed(2)}</p>
            </div>

            <button
              onClick={addToCart}
              className={`px-6 py-3 rounded-xl font-semibold flex items-center gap-2 ${added ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              {added ? <><Check className="w-5 h-5" /> ✓</> : <><ShoppingCart className="w-5 h-5" /> {t('product.detail.add_to_cart')}</>}
            </button>

            <button
              onClick={buyNow}
              className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold rounded-xl hover:opacity-90"
            >
              {t('product.detail.buy_now')}
            </button>
          </div>
        </div>
      </div>

      <div className="h-24" />
    </div>
  );
}
