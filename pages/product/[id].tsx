import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import ProductDetail from '@/components/products/ProductDetail';
import SEO from '@/components/ui/SEO';
import type { Product } from '@/types';

export default function ProductPage() {
  const router = useRouter();
  const { id } = router.query;
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    async function loadProduct() {
      try {
        const res = await fetch(`/api/products/${id}`);
        const data = await res.json();
        if (data.success) {
          setProduct(data.data);
        }
      } catch (error) {
        console.error('Failed to load product:', error);
      } finally {
        setLoading(false);
      }
    }

    loadProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">产品不存在</p>
      </div>
    );
  }

  // 生成动态 SEO 信息
  const countryName = product.countries?.[0]?.name || '全球';
  const dataSize = product.dataSize >= 1024 ? `${(product.dataSize / 1024).toFixed(0)}GB` : `${product.dataSize}MB`;
  const seoTitle = `${countryName} ${product.validDays}天${dataSize} eSIM - $${product.price}`;
  const seoDesc = `${countryName}eSIM 套餐，${product.validDays}天${dataSize}流量，即买即用，无需实体 SIM 卡。支持${product.features?.includes('Voice') ? '语音 + 短信 + 数据' : '纯数据'}，${product.countries?.length || 1}个国家可用。`;

  return (
    <>
      <SEO
        title={seoTitle}
        description={seoDesc}
        canonical={`/product/${id}`}
      />
      <ProductDetail product={product} />
    </>
  );
}
