'use client';

import Link from 'next/link';
import { Wifi, Clock, MapPin } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { formatDataSize, getCountryFlag } from '@/lib/api';
import type { Product } from '@/types';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Link href={`/product/${product.id}`} className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:border-orange-300 hover:shadow-lg transition-all">
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            {product.countries?.slice(0, 3).map((country) => (
              <span key={country.code} className="text-2xl">{getCountryFlag(country.code)}</span>
            ))}
          </div>
          {product.isHot && (
            <span className="px-2 py-1 bg-red-500 text-white text-xs font-medium rounded-full">热销</span>
          )}
        </div>

        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-orange-600 transition-colors">
          {product.name}
        </h3>

        <div className="space-y-2 text-sm text-gray-600 mb-4">
          <div className="flex items-center gap-2">
            <Wifi className="w-4 h-4 text-orange-500" />
            <span>{formatDataSize(product.dataSize)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-orange-500" />
            <span>{product.validDays} 天</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-orange-500" />
            <span>{product.countries?.length || 1} 个国家/地区</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div>
            <span className="text-2xl font-bold text-orange-600">{formatPrice(product.agentPrice)}</span>
          </div>
          <span className="px-4 py-2 bg-orange-50 text-orange-600 font-medium rounded-lg group-hover:bg-orange-500 group-hover:text-white transition-colors">
            选购
          </span>
        </div>
      </div>
    </Link>
  );
}
