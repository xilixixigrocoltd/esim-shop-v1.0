import type { NextApiRequest, NextApiResponse } from 'next';
import { b2bApi } from '@/lib/api';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    // 查询订单列表或单个订单
    const { orderId } = req.query;
    
    try {
      if (orderId) {
        // 查询单个订单 - 需要从 B2B API 获取
        const orders = await b2bApi.getOrders();
        const order = orders.find(o => o.orderNumber === orderId);
        
        if (!order) {
          return res.status(404).json({ success: false, error: '订单不存在' });
        }
        
        return res.status(200).json({ success: true, data: order });
      } else {
        // 查询订单列表
        const orders = await b2bApi.getOrders();
        return res.status(200).json({ success: true, data: orders });
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      return res.status(500).json({ success: false, error: '获取订单失败' });
    }
  }
  
  if (req.method === 'POST') {
    // 创建新订单（通过 B2B API）
    try {
      const { items } = req.body;
      
      if (!items || !Array.isArray(items)) {
        return res.status(400).json({ success: false, error: '订单数据无效' });
      }
      
      const { email } = req.body;
      const orderPayload = {
        items: items.map((item: any) => ({ productId: item.id, quantity: item.quantity })),
        customerEmail: email || ''
      };
      const order = await b2bApi.createOrder(orderPayload);
      return res.status(200).json({ success: true, data: order });
    } catch (error) {
      console.error('Failed to create order:', error);
      return res.status(500).json({ success: false, error: '创建订单失败' });
    }
  }
  
  return res.status(405).json({ error: 'Method not allowed' });
}
