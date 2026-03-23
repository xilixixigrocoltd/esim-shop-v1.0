import { useRouter } from 'next/router';
import { GetStaticPaths, GetStaticProps } from 'next';
import ProductList from '@/components/products/ProductList';
import SEO from '@/components/ui/SEO';
import Breadcrumb from '@/components/ui/Breadcrumb';
import { getAllCountries, getProductsByCountry } from '@/lib/data';

interface Props {
  code: string;
  countryName: string;
  productCount: number;
  minPrice: number | null;
  maxPrice: number | null;
}

export default function CountryPage({ code, countryName, productCount, minPrice, maxPrice }: Props) {
  const router = useRouter();

  if (router.isFallback) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-10 w-10 border-4 border-orange-500 border-t-transparent" />
    </div>;
  }

  const priceStr = minPrice !== null
    ? maxPrice && maxPrice !== minPrice
      ? `$${minPrice.toFixed(2)}-$${maxPrice.toFixed(2)}`
      : `$${minPrice.toFixed(2)}`
    : '';

  const title = priceStr
    ? `${countryName} eSIM套餐 - 最低${priceStr.split('-')[0]} | SimRyoko`
    : `${countryName} eSIM套餐 | SimRyoko`;

  const description = `SimRyoko提供${productCount}款${countryName} eSIM套餐，境外流量即买即用，无需换实体SIM卡。${priceStr ? `价格${priceStr} USD起，` : ''}支持USDT加密货币支付，出国首选${countryName} eSIM海外网络。`;

  return (
    <>
      <SEO
        title={title}
        description={description}
        canonical={`/country/${code.toLowerCase()}`}
      />
      <div className="max-w-6xl mx-auto px-4 py-4">
        <Breadcrumb items={[
          { label: '国家列表', href: '/countries' },
          { label: `${countryName} eSIM` }
        ]} />
      </div>
      <ProductList countryCode={code.toLowerCase()} />
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const countries = getAllCountries();
  return {
    paths: countries.map(c => ({ params: { code: c.code.toLowerCase() } })),
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const rawCode = (params?.code as string || '').toUpperCase();
  const countries = getAllCountries();
  const countryInfo = countries.find(c => c.code.toUpperCase() === rawCode);

  if (!countryInfo) {
    return { notFound: true };
  }

  const { local, regional, global } = getProductsByCountry(rawCode);
  const allProducts = [...local, ...regional, ...global];
  const prices = allProducts.map(p => p.price).filter(p => p > 0);
  const minPrice = prices.length > 0 ? Math.min(...prices) : null;
  const maxPrice = prices.length > 0 ? Math.max(...prices) : null;

  return {
    props: {
      code: rawCode,
      countryName: countryInfo.name,
      productCount: allProducts.length,
      minPrice,
      maxPrice,
    },
    revalidate: 3600,
  };
};
