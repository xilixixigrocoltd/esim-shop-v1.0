import HeroSection from '@/components/home/HeroSection';
import ProductTypes from '@/components/home/ProductTypes';
import HowItWorks from '@/components/home/HowItWorks';
import Testimonials from '@/components/home/Testimonials';
import PaymentMethods from '@/components/home/PaymentMethods';
import TrustBadges from '@/components/home/TrustBadges';
import FAQ from '@/components/home/FAQ';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <ProductTypes />
      <HowItWorks />
      <TrustBadges />
      <Testimonials />
      <PaymentMethods />
      <FAQ />
    </>
  );
}
