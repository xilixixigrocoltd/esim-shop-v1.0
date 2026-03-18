import type { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-02-24.acacia',
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { session_id } = req.query;

  if (!session_id) {
    return res.status(400).json({ error: 'Missing session_id' });
  }

  try {
    // 获取 Stripe Session 详情
    const session = await stripe.checkout.sessions.retrieve(session_id as string, {
      expand: ['line_items'],
    });

    if (!session || !session.customer_email) {
      return res.status(404).json({ error: 'Session not found' });
    }

    // 提取 metadata 中的订单信息
    const items = session.metadata?.items ? JSON.parse(session.metadata.items) : [];
    const amount = parseFloat(session.metadata?.amount || '0');
    const b2bOrderId = session.metadata?.b2bOrderId;

    return res.status(200).json({
      success: true,
      orderId: b2bOrderId || `Stripe-${session.id.slice(-8)}`,
      email: session.customer_email,
      amount,
      items,
      paymentStatus: session.payment_status,
      paidAt: session.created ? new Date(session.created * 1000).toISOString() : null,
    });
  } catch (error: any) {
    console.error('Failed to fetch session details:', error);
    return res.status(500).json({ 
      error: 'Failed to fetch order details',
      details: error.message
    });
  }
}
