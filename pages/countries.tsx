import CountryList from '@/components/countries/CountryList';
import { useRouter } from 'next/router';

export default function CountriesPage() {
  const router = useRouter();
  const { q } = router.query;

  return <CountryList initialSearch={q as string} />;
}
