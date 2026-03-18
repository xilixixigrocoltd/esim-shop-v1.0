import type { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-02-24.acacia',
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, items, amount, orderId } = req.body;

    if (!email || !items || !amount) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // 1. 创建 Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card', 'alipay'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `eSIM ${items[0].productName || '套餐'}`,
              description: `${items[0].dataSize || ''} / ${items[0].validDays || ''}天`,
              images: items[0].imageUrl ? [items[0].imageUrl] : undefined,
            },
            unit_amount: Math.round(parseFloat(amount as string) * 100), // 转换为分
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://esim-shop-v1.vercel.app'}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://esim-shop-v1.vercel.app'}/checkout?canceled=true`,
      customer_email: email,
      metadata: {
        email,
        items: JSON.stringify(items),
        amount: amount.toString(),
        // 如果是二次传递（已有 B2B 订单号）
        ...(orderId ? { b2bOrderId: orderId } : {}),
      },
    });

    // 2. 返回 Stripe 支付链接
    return res.status(200).json({
      success: true,
      sessionId: session.id,
      paymentUrl: session.url,
    });
  } catch (error: any) {
    console.error('Stripe payment create error:', error);
    return res.status(500).json({ 
      error: '支付创建失败', 
      details: error.message
    });
  }
}
