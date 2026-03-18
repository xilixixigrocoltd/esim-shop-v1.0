import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY || '');

interface OrderItem {
  name: string;
  quantity: number;
  price: string;
  dataSize?: string;
  validity?: string;
  countries?: string[];
}

interface EsimData {
  iccid: string;
  qrCode: string;
  activationCode: string;
  dataAmount: string;
  validityDays: number;
}

export async function sendOrderConfirmation(email: string, orderData: {
  orderId: string;
  items: OrderItem[];
  totalAmount: string;
  customerEmail: string;
  esimData?: EsimData;
  paymentMethod?: string;
}) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'SimRyoko eSIM <noreply@simryoko.com>',
      to: [email],
      subject: `✅ 订单确认 - ${orderData.orderId}`,
      html: `
<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
      * { margin: 0; padding: 0; box-sizing: border-box; }
      body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #1f2937; background-color: #f3f4f6; }
      .wrapper { background-color: #f3f4f6; padding: 40px 20px; }
      .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
      
      /* Header */
      .header { background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); padding: 40px 30px; text-align: center; }
      .logo { font-size: 32px; font-weight: bold; color: #ffffff; margin-bottom: 10px; }
      .header h1 { color: #ffffff; font-size: 24px; margin: 0; font-weight: 600; }
      .header p { color: rgba(255, 255, 255, 0.9); margin: 10px 0 0 0; font-size: 14px; }
      
      /* Content */
      .content { padding: 30px; }
      .greeting { font-size: 16px; color: #1f2937; margin-bottom: 20px; }
      
      /* Order Info Box */
      .order-box { background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); border-left: 4px solid #f59e0b; padding: 20px; border-radius: 8px; margin: 20px 0; }
      .order-box h2 { color: #92400e; font-size: 18px; margin-bottom: 15px; display: flex; align-items: center; gap: 8px; }
      .order-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid rgba(146, 64, 14, 0.1); }
      .order-row:last-child { border-bottom: none; }
      .order-label { color: #78350f; font-weight: 500; }
      .order-value { color: #92400e; font-weight: 600; }
      
      /* Product Section */
      .product-section { background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0; }
      .product-section h3 { color: #1f2937; font-size: 16px; margin-bottom: 15px; }
      .product-item { background: #ffffff; padding: 15px; border-radius: 6px; margin-bottom: 10px; border: 1px solid #e5e7eb; }
      .product-name { font-weight: 600; color: #1f2937; margin-bottom: 8px; }
      .product-details { font-size: 14px; color: #6b7280; }
      .product-detail-row { display: flex; gap: 15px; margin-top: 5px; }
      .detail-tag { background: #f3f4f6; padding: 4px 10px; border-radius: 4px; font-size: 12px; color: #4b5563; }
      
      /* eSIM Section */
      .esim-section { background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%); border: 2px solid #3b82f6; padding: 25px; border-radius: 8px; margin: 20px 0; }
      .esim-section h3 { color: #1e40af; font-size: 18px; margin-bottom: 15px; display: flex; align-items: center; gap: 8px; }
      .qr-container { text-align: center; background: #ffffff; padding: 20px; border-radius: 8px; margin: 15px 0; }
      .qr-code { max-width: 200px; height: auto; border: 2px solid #e5e7eb; border-radius: 8px; }
      .activation-code { background: #ffffff; padding: 15px; border-radius: 6px; margin: 15px 0; font-family: 'Courier New', monospace; font-size: 14px; word-break: break-all; border: 1px solid #e5e7eb; }
      .iccid { font-size: 12px; color: #6b7280; text-align: center; margin-top: 10px; }
      
      /* Installation Steps */
      .steps { background: #ffffff; padding: 20px; border-radius: 8px; margin: 20px 0; }
      .steps h4 { color: #1f2937; font-size: 16px; margin-bottom: 15px; }
      .step { display: flex; gap: 15px; margin-bottom: 15px; }
      .step-number { flex-shrink: 0; width: 28px; height: 28px; background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); color: #ffffff; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 14px; }
      .step-content { flex: 1; }
      .step-title { font-weight: 600; color: #1f2937; margin-bottom: 4px; }
      .step-desc { font-size: 14px; color: #6b7280; }
      
      /* CTA Button */
      .cta-container { text-align: center; margin: 25px 0; }
      .cta-button { display: inline-block; background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); color: #ffffff !important; text-decoration: none; padding: 14px 35px; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 6px rgba(249, 115, 22, 0.3); }
      
      /* Support Box */
      .support-box { background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0; }
      .support-box h4 { color: #1f2937; font-size: 16px; margin-bottom: 15px; }
      .support-item { display: flex; align-items: flex-start; gap: 10px; margin-bottom: 12px; font-size: 14px; }
      .support-icon { font-size: 18px; }
      .support-link { color: #f97316; text-decoration: none; font-weight: 500; }
      
      /* Footer */
      .footer { background: #f9fafb; padding: 25px 30px; text-align: center; border-top: 1px solid #e5e7eb; }
      .footer p { color: #6b7280; font-size: 13px; margin: 5px 0; }
      .footer-links { margin-top: 15px; }
      .footer-links a { color: #9ca3af; text-decoration: none; font-size: 12px; margin: 0 10px; }
      
      /* Mobile */
      @media only screen and (max-width: 600px) {
        .container { border-radius: 0; }
        .header { padding: 30px 20px; }
        .content { padding: 20px; }
        .product-detail-row { flex-direction: column; gap: 8px; }
      }
    </style>
  </head>
  <body>
    <div class="wrapper">
      <div class="container">
        <!-- Header -->
        <div class="header">
          <div class="logo">🦞 SimRyoko</div>
          <h1>✅ 订单确认</h1>
          <p>感谢您选择 SimRyoko eSIM</p>
        </div>
        
        <!-- Content -->
        <div class="content">
          <p class="greeting">尊敬的客户，您好！</p>
          <p style="color: #4b5563; margin-bottom: 20px;">感谢您的购买！您的订单已确认并正在处理中。</p>
          
          <!-- Order Info -->
          <div class="order-box">
            <h2>📋 订单信息</h2>
            <div class="order-row">
              <span class="order-label">订单号</span>
              <span class="order-value">${orderData.orderId}</span>
            </div>
            <div class="order-row">
              <span class="order-label">下单时间</span>
              <span class="order-value">${new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })}</span>
            </div>
            <div class="order-row">
              <span class="order-label">支付方式</span>
              <span class="order-value">${orderData.paymentMethod || '信用卡'}</span>
            </div>
            <div class="order-row">
              <span class="order-label">订单金额</span>
              <span class="order-value">$${orderData.totalAmount} USD</span>
            </div>
          </div>
          
          <!-- Products -->
          <div class="product-section">
            <h3>📦 商品详情</h3>
            ${orderData.items.map(item => `
              <div class="product-item">
                <div class="product-name">${item.name}</div>
                <div class="product-details">
                  <div>数量：×${item.quantity}</div>
                  <div class="product-detail-row">
                    ${item.dataSize ? `<span class="detail-tag">📶 ${item.dataSize}</span>` : ''}
                    ${item.validity ? `<span class="detail-tag">📅 ${item.validity}</span>` : ''}
                    ${item.countries && item.countries.length > 0 ? `<span class="detail-tag">🌍 ${item.countries.slice(0, 3).join(', ')}${item.countries.length > 3 ? '+' + (item.countries.length - 3) : ''}</span>` : ''}
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
          
          <!-- eSIM Details -->
          ${orderData.esimData ? `
            <div class="esim-section">
              <h3>📱 您的 eSIM 已就绪</h3>
              <p style="color: #1e40af; margin-bottom: 15px;">请扫描下方二维码或手动输入激活码完成安装</p>
              
              <div class="qr-container">
                <img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(orderData.esimData.qrCode)}" alt="eSIM QR Code" class="qr-code" />
              </div>
              
              <div class="activation-code">
                <strong>激活码 (SM-DP+ Address):</strong><br>
                ${orderData.esimData.activationCode}
              </div>
              
              <p class="iccid">ICCID: ${orderData.esimData.iccid}</p>
              
              <!-- Installation Steps -->
              <div class="steps">
                <h4>📲 安装步骤</h4>
                
                <div class="step">
                  <div class="step-number">1</div>
                  <div class="step-content">
                    <div class="step-title">打开 eSIM 设置</div>
                    <div class="step-desc">iPhone: 设置 → 蜂窝网络 → 添加 eSIM<br/>Android: 设置 → 网络和互联网 → 移动网络 → 添加运营商</div>
                  </div>
                </div>
                
                <div class="step">
                  <div class="step-number">2</div>
                  <div class="step-content">
                    <div class="step-title">扫描二维码</div>
                    <div class="step-desc">使用手机相机扫描上方二维码，或手动输入激活码</div>
                  </div>
                </div>
                
                <div class="step">
                  <div class="step-number">3</div>
                  <div class="step-content">
                    <div class="step-title">启用 eSIM</div>
                    <div class="step-desc">安装完成后，启用该 eSIM 用于数据，并开启"数据漫游"</div>
                  </div>
                </div>
                
                <div class="step">
                  <div class="step-number">4</div>
                  <div class="step-content">
                    <div class="step-title">到达目的地</div>
                    <div class="step-desc">抵达后手机会自动连接当地网络，无需其他操作</div>
                  </div>
                </div>
              </div>
            </div>
          ` : `
            <div class="esim-section" style="background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); border-color: #f59e0b;">
              <h3 style="color: #92400e;">⏳ eSIM 正在准备中</h3>
              <p style="color: #78350f; margin-bottom: 15px;">我们正在向供应商下单，eSIM 信息将在 1-5 分钟内发送到本邮箱</p>
              <p style="color: #78350f; font-size: 14px;">请保持邮箱畅通，注意查收包含 eSIM 二维码的邮件</p>
            </div>
          `}
          
          <!-- CTA Button -->
          <div class="cta-container">
            <a href="https://simryoko.com/help" class="cta-button">查看安装指南</a>
          </div>
          
          <!-- Support -->
          <div class="support-box">
            <h4>💬 需要帮助？</h4>
            <div class="support-item">
              <span class="support-icon">📧</span>
              <span>邮箱：<a href="mailto:xilixi@xigrocoltd.com" class="support-link">xilixi@xigrocoltd.com</a></span>
            </div>
            <div class="support-item">
              <span class="support-icon">💬</span>
              <span>Telegram: <a href="https://t.me/Simryokoesimbot" class="support-link">@Simryokoesimbot</a></span>
            </div>
            <div class="support-item">
              <span class="support-icon">🌐</span>
              <span>服务时间：7×24 小时</span>
            </div>
          </div>
        </div>
        
        <!-- Footer -->
        <div class="footer">
          <p><strong>SimRyoko eSIM</strong></p>
          <p>全球 eSIM，即时连接</p>
          <div class="footer-links">
            <a href="https://simryoko.com/help">服务条款</a>
            <a href="https://simryoko.com/help">隐私政策</a>
            <a href="https://simryoko.com/help">退款政策</a>
          </div>
          <p style="margin-top: 15px;">© 2026 SimRyoko. Xigro Co Limited. All rights reserved.</p>
        </div>
      </div>
    </div>
  </body>
</html>
      `,
    });

    if (error) {
      console.error('Resend email error:', error);
      throw new Error(error.message);
    }

    console.log('Order confirmation email sent:', data?.id);
    return { success: true, emailId: data?.id };
  } catch (error) {
    console.error('Failed to send order confirmation:', error);
    throw error;
  }
}
