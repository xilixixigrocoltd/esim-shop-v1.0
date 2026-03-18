import type { NextApiRequest, NextApiResponse } from 'next';
import { b2bApi } from '@/lib/api';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, items, method, amount } = req.body;

    if (!email || !items || !method || !amount) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const order = await b2bApi.createOrder(items);
    const orderId = order.orderNumber || `ORD-${Date.now()}`;

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
      });
    }

    return res.status(400).json({ error: 'Invalid payment method' });
  } catch (error) {
    console.error('Payment creation failed:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
