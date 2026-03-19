import CartPage from '@/components/cart/CartPage';
import SEO from '@/components/ui/SEO';

export default function Cart() {
  return (
    <>
      <SEO
        title="购物车"
        description="查看您的 eSIM 购物车，修改数量，准备结算。SimRyoko 提供全球 150+ 国家 eSIM 套餐。"
        canonical="/cart"
        noIndex
      />
      <CartPage />
    </>
  );
}
