import { useRouter } from 'next/router';
import ProductList from '@/components/products/ProductList';

export default function CountryPage() {
  const router = useRouter();
  const { code } = router.query;

  if (!code) return null;

  return <ProductList countryCode={code as string} />;
}
