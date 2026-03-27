'use client';

import { Wifi, Clock, ArrowRight } from 'lucide-react';
import Link from 'next/link';

function formatData(size: number) {
  if (!size) return 'Unlimited';
  if (size >= 1024) return `${(size / 1024).toFixed(0)}GB`;
  return `${size}MB`;
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

export default function FeaturedProducts({ initialProducts = [] }: { initialProducts?: any[] }) {
  if (initialProducts.length === 0) return null;

  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">⚡ Hot Plans</h3>
          <Link href="/products" className="flex items-center gap-1 text-orange-500 hover:text-orange-600 text-sm font-medium">
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {initialProducts.map((product: any) => (
            <Link
              key={product.id}
              href={`/product/${product.id}`}
              className="group bg-white rounded-2xl border border-gray-200 p-4 hover:border-orange-400 hover:shadow-lg transition-all"
            >
              <div className="flex items-center gap-2 mb-3">
                {product.countries?.slice(0, 3).map((c: any) => (
                  <span key={c.code} className="text-2xl">
                    {c.code?.length === 2 ? c.code.toUpperCase().replace(/./g, (ch: string) =>
                      String.fromCodePoint(ch.charCodeAt(0) + 127397)) : '🌐'}
                  </span>
                ))}
                {product.isHot && (
                  <span className="ml-auto px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">Hot</span>
                )}
              </div>
              <h4 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-orange-600 text-sm min-h-[2.5rem]">
                {translateProductName(product.name)}
              </h4>
              <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
                <span className="flex items-center gap-1">
                  <Wifi className="w-3 h-3 text-orange-400" />
                  {formatData(product.dataSize)}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-orange-400" />
                  {product.validDays || product.validityDays} days
                </span>
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <span className="text-xl font-bold text-orange-600">${Number(product.price || 0).toFixed(2)}</span>
                <span className="px-3 py-1.5 bg-orange-50 text-orange-600 text-xs font-medium rounded-lg group-hover:bg-orange-500 group-hover:text-white transition-colors">
                  Buy Now
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
