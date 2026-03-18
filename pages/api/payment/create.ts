import type { NextApiRequest, NextApiResponse } from 'next';
import { b2bApi } from '@/lib/api';
import { sendOrderConfirmation } from '@/lib/email';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, items, method, amount } = req.body;

    if (!email || !items || !method || !amount) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // 1. 创建 B2B 订单
    const order = await b2bApi.createOrder(items);
    const orderId = order.orderNumber || `ORD-${Date.now()}`;

    // 2. 获取产品详情用于邮件
    const productDetails = items.map((item: { id: number; quantity: number }) => {
      const product = order.items?.find((i: any) => i.productId === item.id);
      return {
        name: product?.productName || `Product ${item.id}`,
        quantity: item.quantity,
        price: order.totalAmount || amount,
      };
    });

    // 3. 发送确认邮件（如果配置了 Resend）
    if (process.env.RESEND_API_KEY) {
      try {
        await sendOrderConfirmation(email, {
          orderId,
          items: productDetails,
          totalAmount: amount,
          esimData: order.esimData && order.esimData.length > 0 ? {
            iccid: order.esimData[0].iccid,
            qrCode: order.esimData[0].qrCode,
            activationCode: order.esimData[0].activationCode,
          } : undefined,
        });
      } catch (emailError) {
        console.error('Failed to send confirmation email:', emailError);
        // 邮件发送失败不影响订单流程
      }
    }

    // 4. 返回支付信息
    if (method === 'stripe') {
      return res.status(200).json({
        success: true,
        orderId,
        paymentUrl: `/api/payment/stripe?orderId=${orderId}&amount=${amount}`,
      });
    } else if (method === 'usdt') {
      const walletAddress = process.env.USDT_WALLET_ADDRESS || 'TBuhpRpFPV1HkdfaPEdxsKgTE43jV911rL';
      return res.status(200).json({
        success: true,
        orderId,
        walletAddress,
        amount,
        email,
      });
    }

    return res.status(400).json({ error: 'Invalid payment method' });
  } catch (error) {
    console.error('Payment creation failed:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
