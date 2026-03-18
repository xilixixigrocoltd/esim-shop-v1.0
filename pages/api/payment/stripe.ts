import type { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-02-24.acacia',
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { orderId, amount } = req.query;

    if (!orderId || !amount) {
      return res.status(400).json({ error: 'Missing orderId or amount' });
    }

    // 创建 Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `eSIM Order ${orderId}`,
              description: 'eSIM 套餐购买',
            },
            unit_amount: Math.round(parseFloat(amount as string) * 100), // 转换为分
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://esim-shop-v1.vercel.app'}/success?orderId=${orderId}&payment=stripe`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://esim-shop-v1.vercel.app'}/checkout?canceled=true`,
      metadata: {
        orderId: orderId as string,
      },
    });

    // 重定向到 Stripe Checkout
    return res.status(303).redirect(session.url!);
  } catch (error: any) {
    console.error('Stripe payment error:', error);
    return res.status(500).json({ 
      error: '支付创建失败', 
      details: error.message,
      stripeKey: process.env.STRIPE_SECRET_KEY ? 'configured' : 'missing'
    });
  }
}
