'use client';

import Link from 'next/link';
import { Wifi, Clock, MapPin, Phone, MessageSquare } from 'lucide-react';
import { formatDataSize, getCountryFlag } from '@/lib/api';
import { useI18n } from '@/lib/i18n-context';
import type { Product } from '@/types';

interface ProductCardProps {
  product: Product;
}

// 判断套餐类型
function getPlanType(product: Product, t: any): { type: string; icon: any; color: string } {
  const hasOnlyData = product.features?.some(f => f.includes('仅数据') || f.includes('仅流量'));
  
  if (hasOnlyData) {
    return { type: t('products.type.data_only'), icon: Wifi, color: 'text-blue-600 bg-blue-50' };
  } else {
    return { type: t('products.type.data_voice_sms'), icon: Phone, color: 'text-green-600 bg-green-50' };
  }
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

export default function ProductCard({ product }: ProductCardProps) {
  const { t } = useI18n();
  const planType = getPlanType(product, t);
  const PlanIcon = planType.icon;

  return (
    <Link href={`/product/${product.id}`} className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:border-orange-300 hover:shadow-lg transition-all">
      <div className="p-4">
        {/* 顶部：国家旗帜 + 套餐类型 */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            {product.countries?.slice(0, 3).map((country) => (
              <span key={country.code} className="text-2xl">{getCountryFlag(country.code)}</span>
            ))}
            {product.countries && product.countries.length > 3 && (
              <span className="text-sm text-gray-500">+{product.countries.length - 3}</span>
            )}
          </div>
          {product.isHot && (
            <span className="px-2 py-1 bg-red-500 text-white text-xs font-medium rounded-full">Hot</span>
          )}
        </div>

        {/* 套餐类型标签 */}
        <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium mb-3 ${planType.color}`}>
          <PlanIcon className="w-3.5 h-3.5" />
          <span>{planType.type}</span>
        </div>

        {/* 产品名称 */}
        <h3 className="font-semibold text-gray-900 mb-3 line-clamp-2 group-hover:text-orange-600 transition-colors min-h-[2.5rem]">
          {translateProductName(product.name)}
        </h3>

        {/* 产品详情 */}
        <div className="space-y-2 text-sm text-gray-600 mb-4">
          <div className="flex items-center gap-2">
            <Wifi className="w-4 h-4 text-orange-500" />
            <span className="font-medium">{formatDataSize(product.dataSize)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-orange-500" />
            <span>{product.validDays + ' days'}</span>
          </div>
          {product.type !== 'local' && (
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-orange-500" />
              <span>{product.countries?.length || 1} {t('product.countries')}</span>
            </div>
          )}
        </div>

        {/* 价格和按钮 */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div>
            <span className="text-2xl font-bold text-orange-600">${Number(product.price || 0).toFixed(2)}</span>
          </div>
          <span className="px-4 py-2 bg-orange-50 text-orange-600 font-medium rounded-lg group-hover:bg-orange-500 group-hover:text-white transition-colors">
            {t('product.buy_now')}
          </span>
        </div>
      </div>
    </Link>
  );
}
