import type { Product } from '@/types';
import productsData from '../pages/api/products/by-country/products.json';

function getAllProductsFromCache(): Product[] {
  const data = productsData as any;
  const localProducts = Object.values(data.local || {}).flat() as Product[];
  const regionalProducts = Array.isArray(data.regional) ? data.regional as Product[] : [];
  const globalProducts = Array.isArray(data.global) ? data.global as Product[] : [];
  return [...localProducts, ...regionalProducts, ...globalProducts];
}

let _cache: Product[] | null = null;

export async function getCachedProducts(): Promise<Product[]> {
  if (!_cache) {
    _cache = getAllProductsFromCache();
  }
  return _cache;
}

export function getCachedProductsByCountry(code: string): { local: Product[], regional: Product[], global: Product[] } {
  const all = getAllProductsFromCache();
  const upper = code.toUpperCase();
  return {
    local: all.filter(p => p.type === 'local' && p.countries?.some((c: any) => c.code?.toUpperCase() === upper)),
    regional: all.filter(p => p.type === 'regional' && p.countries?.some((c: any) => c.code?.toUpperCase() === upper)),
    global: all.filter(p => !p.type || p.type === 'global'),
  };
}

export function getCachedProduct(id: number | string): Product | undefined {
  return getAllProductsFromCache().find(p => String(p.id) === String(id));
}
