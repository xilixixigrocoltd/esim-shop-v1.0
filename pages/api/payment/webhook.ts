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
        let order: any;
        if (b2bOrderId) {
          console.log('Using existing B2B order:', b2bOrderId);
          // 仍需发送确认邮件，不能直接 return
          order = { orderNumber: b2bOrderId, orderNo: b2bOrderId };
        } else {
          // 创建 B2B 订单（支付成功后才创建！）
          const firstItem = items[0];
          // items 中 qty/quantity 两种字段名都兼容
          const qty = firstItem.qty || firstItem.quantity || 1;
          const orderPayload = {
            productId: firstItem.id || firstItem.productId,
            quantity: qty,
            customerEmail: email
          };
          
          console.log('Creating B2B order:', orderPayload);
          order = await b2bApi.createOrder(orderPayload);
          
          // ⚡ 关键：下单后立即用余额确认支付，触发 eSIM 分配
          if (order?.id) {
            console.log('Confirming payment for order:', order.id);
            try {
              order = await b2bApi.confirmOrderPayment(order.id);
              console.log('Payment confirmed, ICCID:', order?.esimIccid || 'pending');
            } catch (payErr: any) {
              console.error('confirmOrderPayment failed:', payErr.message);
              // 余额不足或其他支付确认失败 → 告警管理员
              const alertMsg = payErr.message?.includes('余额') || payErr.message?.toLowerCase().includes('balance')
                ? `⚠️ B2B 账户余额不足！订单 ${order.id} 支付确认失败，eSIM 未分配。\n客户: ${email}\nStripe: ${session.id}\n错误: ${payErr.message}`
                : `⚠️ confirmOrderPayment 失败！订单 ${order.id}\n客户: ${email}\nStripe: ${session.id}\n错误: ${payErr.message}`;
              try {
                await sendOrderConfirmation('simryokoesim@gmail.com', {
                  orderId: `ALERT-PAY-${order.id}`,
                  customerEmail: email || 'unknown',
                  items: [{ name: alertMsg, quantity: 1, price: session.metadata?.amount || '0' }],
                  totalAmount: session.metadata?.amount || '0',
                  paymentMethod: '信用卡',
                });
              } catch (_e) { console.error('Failed to send balance alert email:', _e); }
              // order 保持 createOrder 的结果继续发普通确认邮件给客户
            }
          }
        }
        
        // 订单号：B2B API 返回 orderNumber 或 orderNo
        const orderId = order.orderNumber || order.orderNo || `ORD-${Date.now()}`;
        console.log('B2B order created:', orderId);
        
        // 3. 发送确认邮件（包含 eSIM 信息）
        // B2B API 实际返回结构：
        //   order.esimIccid        - ICCID 字符串（快捷字段）
        //   order.esimQrCode       - LPA 激活码字符串（快捷字段）
        //   order.esimActivationCode - matching_id（快捷字段）
        //   order.esimData.sims[]  - 完整 SIM 数组，含 qrCodeUrl（图片URL）、activationCode
        //   order.product          - 关联产品信息（而非 order.orderItems[]）
        const esimSims: any[] = order.esimData?.sims || [];
        const esim = esimSims[0] || null;
        const productInfo = items[0]; // 从 metadata 取产品信息（order.product 在 pending 时可能为 null）
        
        // 完整 LPA 激活码字符串，格式: "LPA:1$<smdpAddress>$<matchingId>"
        // esim.qrCode 字段存放完整 LPA 字符串（B2BSimData.qrCode）
        // esim.activationCode 只是 matching_id 部分
        const fullLpaCode = esim?.qrCode || order.esimQrCode || '';
        // 构建 iPhone 一键安装链接（如果 API 未直接返回）
        const appleInstallUrl = esim?.directAppleUrl
          || (fullLpaCode.startsWith('LPA:')
            ? `https://esimsetup.apple.com/esim_qrcode_provisioning?carddata=${encodeURIComponent(fullLpaCode)}`
            : undefined);

        const esimDataPayload = (esim || order.esimIccid) ? {
          iccid: esim?.iccid || order.esimIccid || '',
          // qrCode 字段传图片 URL（用于邮件显示二维码图片）
          qrCode: esim?.qrCodeUrl || '',
          // activationCode 传完整 LPA 字符串，便于用户手动输入
          activationCode: fullLpaCode,
          dataAmount: productInfo?.dataSize ? `${formatDataSize(productInfo.dataSize)}` : 'N/A',
          validityDays: productInfo?.validDays || 0,
          directAppleUrl: appleInstallUrl,
        } : undefined;
        
        // 无论是否有 eSIM（可能仍在 pending），都发送确认邮件
        try {
          await sendOrderConfirmation(email, {
            orderId,
            customerEmail: email,
            items: [{
              name: productInfo?.name || 'eSIM 套餐',
              quantity: productInfo?.qty || 1,
              price: amount.toString(),
              dataSize: productInfo?.dataSize ? `${formatDataSize(productInfo.dataSize)}` : undefined,
              validity: productInfo?.validDays ? `${productInfo.validDays}天` : undefined,
              countries: productInfo?.countries?.map((c: any) => c.name || c.cn || c.en || c.code) || [],
            }],
            totalAmount: amount.toString(),
            paymentMethod: '信用卡',
            esimData: esimDataPayload,
          });
          console.log('Confirmation email sent to:', email);
        } catch (emailError) {
          console.error('Failed to send confirmation email:', emailError);
        }
        
        if (!esim && !order.esimIccid) {
          console.warn('Order created but eSIM not yet delivered (pending):', orderId);
        }
        
        return res.status(200).json({ 
          received: true, 
          orderId,
          esimStatus: order.deliveryStatus || 'pending'
        });
        
      } catch (orderError: any) {
        console.error('Failed to process order:', orderError);
        // 订单创建失败，但仍然返回成功给 Stripe（避免重复 webhook）
        // 发送告警邮件，人工介入处理
        try {
          await sendOrderConfirmation('simryokoesim@gmail.com', {
            orderId: `ALERT-${session.id}`,
            customerEmail: session.customer_email || session.metadata?.email || 'unknown',
            items: [{ 
              name: `⚠️ 订单处理失败，需人工介入\n客户: ${session.customer_email}\nStripe: ${session.id}\n错误: ${orderError.message}`, 
              quantity: 1, 
              price: session.metadata?.amount || '0' 
            }],
            totalAmount: session.metadata?.amount || '0',
            paymentMethod: '信用卡',
          });
        } catch (_alertErr) {
          console.error('Failed to send alert email:', _alertErr);
        }
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
