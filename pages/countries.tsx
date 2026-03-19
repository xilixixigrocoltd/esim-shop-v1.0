import CountryList from '@/components/countries/CountryList';
import { useRouter } from 'next/router';
import SEO from '@/components/ui/SEO';

export default function CountriesPage() {
  const router = useRouter();
  const { q } = router.query;

  return (
    <>
      <SEO
        title="123 个国家 eSIM - 全球覆盖"
        description="SimRyoko eSIM 覆盖全球 123 个国家，包括日本、韩国、美国、欧洲、东南亚等热门目的地。按国家浏览，找到最适合您的 eSIM 套餐。"
        canonical="/countries"
      />
      <CountryList initialSearch={q as string} />
    </>
  );
}
