import type { NextApiRequest, NextApiResponse } from 'next';
import { b2bApi } from '@/lib/api';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { orderId, packageId } = req.body;
    
    if (!orderId || typeof orderId !== 'string') {
      return res.status(400).json({ error: '缺少订单 ID' });
    }
    
    if (!packageId || typeof packageId !== 'number') {
      return res.status(400).json({ error: '缺少套餐 ID' });
    }

    const result = await b2bApi.topupOrder(orderId, packageId);
    
    return res.status(200).json({ success: true, data: result });
  } catch (error: any) {
    console.error('Failed to topup order:', error);
    return res.status(500).json({ error: `续费失败：${error.message}` });
  }
}
