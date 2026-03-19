import { useRouter } from 'next/router';
import ProductList from '@/components/products/ProductList';
import SEO from '@/components/ui/SEO';

export default function CountryPage() {
  const router = useRouter();
  const { code } = router.query;

  if (!code) return null;

  // 国家名称映射（用于 SEO）
  const countryNames: Record<string, string> = {
    jp: '日本', us: '美国', kr: '韩国', gb: '英国', fr: '法国',
    de: '德国', it: '意大利', es: '西班牙', th: '泰国', vn: '越南',
    sg: '新加坡', my: '马来西亚', au: '澳大利亚', ca: '加拿大',
  };
  const countryName = countryNames[code as string] || (typeof code === 'string' ? code.toUpperCase() : '');

  return (
    <>
      <SEO
        title={`${countryName}eSIM 套餐 - 本地流量`}
        description={`SimRyoko 提供${countryName}eSIM 套餐，本地运营商网络，即买即用。多种流量套餐可选，价格优惠， instant delivery。`}
        canonical={`/country/${code}`}
      />
      <ProductList countryCode={code as string} />
    </>
  );
}
