import type { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import { b2bApi, formatDataSize } from '@/lib/api';
import { sendOrderConfirmation } from '@/lib/email';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-02-24.acacia',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

export const config = {
  api: {
    bodyParser: false, // Stripe webhooks require raw body
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const buf: Buffer[] = [];
  
  try {
    // 读取原始 body
    for await (const chunk of req) {
      buf.push(chunk);
    }
    const rawBody = Buffer.concat(buf).toString('utf-8');
    
    // 验证 Stripe 签名
    const signature = req.headers['stripe-signature'] as string;
    
    let event: Stripe.Event;
    
    if (webhookSecret) {
      try {
        event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
      } catch (err: any) {
        console.error('Webhook signature verification failed:', err.message);
        return res.status(400).json({ error: `Webhook Error: ${err.message}` });
      }
    } else {
      // 开发环境：跳过签名验证
      console.warn('STRIPE_WEBHOOK_SECRET not configured, skipping signature verification');
      event = JSON.parse(rawBody) as Stripe.Event;
    }

    // 处理支付成功事件
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      
      console.log('Payment completed:', session.id, session.customer_email);
      
      try {
        // 1. 从 metadata 中提取订单信息
        const email = session.customer_email || session.metadata?.email;
        const items = JSON.parse(session.metadata?.items || '[]');
        const amount = parseFloat(session.metadata?.amount || '0');
        const b2bOrderId = session.metadata?.b2bOrderId;
        
        if (!email || !items || items.length === 0) {
          console.error('Invalid session data:', { email, items, amount });
          return res.status(200).json({ received: true, warning: 'Invalid session data' });
        }
        
        // 2. 如果已有 B2B 订单号，直接查询；否则创建新订单
        let order;
        if (b2bOrderId) {
          console.log('Using existing B2B order:', b2bOrderId);
          // 这里需要实现 getOrder 方法，暂时跳过
          return res.status(200).json({ received: true, orderId: b2bOrderId });
        } else {
          // 创建 B2B 订单（支付成功后才创建！）
          const firstItem = items[0];
          const orderPayload = {
            productId: firstItem.id || firstItem.productId,
            quantity: firstItem.quantity || 1,
            customerEmail: email
          };
          
          console.log('Creating B2B order:', orderPayload);
          order = await b2bApi.createOrder(orderPayload);
        }
        
        const orderId = order.orderNumber || `ORD-${Date.now()}`;
        console.log('B2B order created:', orderId);
        
        // 3. 发送确认邮件（包含 eSIM 信息）
        if (order.esims && order.esims.length > 0) {
          try {
            const esim = order.esims[0];
            const product = order.orderItems?.[0];
            
            await sendOrderConfirmation(email, {
              orderId,
              customerEmail: email,
              items: [{
                name: product?.productName || 'eSIM 套餐',
                quantity: 1,
                price: amount.toString(),
                dataSize: product?.dataSize ? `${formatDataSize(product.dataSize)}` : undefined,
                validity: product?.validDays ? `${product.validDays}天` : undefined,
                countries: product?.countries?.map((c: any) => c.name) || [],
              }],
              totalAmount: amount.toString(),
              paymentMethod: '信用卡',
              esimData: {
                iccid: esim.iccid,
                qrCode: esim.qrCode || esim.activationCode || '',
                activationCode: esim.activationCode || '',
                dataAmount: product?.dataSize ? `${formatDataSize(product.dataSize)}` : 'N/A',
                validityDays: product?.validDays || 0,
              },
            });
            console.log('Confirmation email sent to:', email);
          } catch (emailError) {
            console.error('Failed to send confirmation email:', emailError);
          }
        }
        
        // 4. 这里可以添加数据库记录、通知等
        
        return res.status(200).json({ 
          received: true, 
          orderId,
          esimStatus: order.esims?.[0]?.status || 'pending'
        });
        
      } catch (orderError: any) {
        console.error('Failed to process order:', orderError);
        // 订单创建失败，但仍然返回成功给 Stripe（避免重复 webhook）
        // 需要人工介入处理
        return res.status(200).json({ 
          received: true, 
          error: 'Order processing failed, manual review needed'
        });
      }
    }
    
    // 其他事件类型忽略
    return res.status(200).json({ received: true });
    
  } catch (error: any) {
    console.error('Webhook handler error:', error);
    return res.status(500).json({ 
      error: 'Webhook handler failed',
      details: error.message
    });
  }
}
