import CountryList from '@/components/countries/CountryList';
import { useRouter } from 'next/router';
import SEO from '@/components/ui/SEO';
import { useI18n } from '@/lib/i18n-context';

export default function CountriesPage() {
  const router = useRouter();
  const { t } = useI18n();
  const { q } = router.query;

  return (
    <>
      <SEO
        title={t('seo.countries.title')}
        description={t('seo.countries.desc')}
        canonical="/countries"
      />
      <CountryList initialSearch={q as string} />
    </>
  );
}
