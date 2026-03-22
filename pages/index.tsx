import Head from 'next/head';
import HeroSection from '@/components/home/HeroSection';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import HowItWorks from '@/components/home/HowItWorks';
import Testimonials from '@/components/home/Testimonials';
import PaymentMethods from '@/components/home/PaymentMethods';
import TrustBadges from '@/components/home/TrustBadges';
import FAQ from '@/components/home/FAQ';
import SEO from '@/components/ui/SEO';

export default function HomePage() {
  return (
    <>
      <SEO
        title="全球 eSIM，即时连接 - 覆盖 150+ 国家"
        description="SimRyoko 提供全球 150+ 国家的 eSIM 服务，即买即用，无需实体 SIM 卡。支持日本、韩国、欧洲、美国等热门目的地，价格优惠，instant delivery。"
        canonical="/"
      />
      <HeroSection />
      <FeaturedProducts />
      <HowItWorks />
      <TrustBadges />
      <Testimonials />
      <PaymentMethods />
      <FAQ />
    </>
  );
}
