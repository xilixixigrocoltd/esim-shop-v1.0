import type { NextApiRequest, NextApiResponse } from 'next';
import { sendOrderConfirmation } from '@/lib/email';

/**
 * USDT Payment Notification
 * Called when a customer initiates a USDT payment on the checkout page.
 * Sends an alert email to admin so they can manually verify the on-chain transfer.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const { email, items, amount } = req.body;
  if (!email || !items || !amount) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  const adminEmail = process.env.ADMIN_EMAIL || 'simryokoesim@gmail.com';

  try {
    const itemNames = Array.isArray(items)
      ? items.map((i: any) => `${i.name || i.id} x${i.qty || i.quantity || 1}`).join(', ')
      : String(items);

    await sendOrderConfirmation(adminEmail, {
      orderId: `USDT-PENDING-${Date.now()}`,
      customerEmail: email,
      items: [{
        name: `⚠️ USDT 待收款通知\n客户邮箱: ${email}\n金额: ${amount} USDT\n产品: ${itemNames}\n\n请登录 Tron 钱包核实到账后手动发货。`,
        quantity: 1,
        price: amount,
      }],
      totalAmount: amount,
      paymentMethod: 'USDT (TRC-20)',
    });

    return res.status(200).json({ ok: true });
  } catch (err: any) {
    console.error('USDT notify error:', err.message);
    // Non-critical — don't expose error to client
    return res.status(200).json({ ok: false });
  }
}
