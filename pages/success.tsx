import SuccessPage from '@/components/orders/SuccessPage';
import SEO from '@/components/ui/SEO';

export default function Success() {
  return (
    <>
      <SEO
        title="订单成功"
        description="感谢您的购买！eSIM 二维码已发送到您的邮箱。请检查邮箱（包括垃圾邮件箱）。"
        canonical="/success"
        noIndex
      />
      <SuccessPage />
    </>
  );
}
