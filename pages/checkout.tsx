import CheckoutPage from '@/components/checkout/CheckoutPage';
import SEO from '@/components/ui/SEO';

export default function Checkout() {
  return (
    <>
      <SEO
        title="结算"
        description="安全结算您的 eSIM 订单。支持信用卡、支付宝、USDT 等多种支付方式。"
        canonical="/checkout"
        noIndex
      />
      <CheckoutPage />
    </>
  );
}
