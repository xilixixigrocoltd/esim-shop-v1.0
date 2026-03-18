import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY || '');

export async function sendOrderConfirmation(email: string, orderData: {
  orderId: string;
  items: Array<{ name: string; quantity: number; price: string }>;
  totalAmount: string;
  esimData?: {
    iccid: string;
    qrCode: string;
    activationCode: string;
  };
}) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'SimRyoko eSIM <noreply@simryoko.com>',
      to: [email],
      subject: `订单确认 - ${orderData.orderId}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #f97316, #ef4444); color: white; padding: 30px; text-align: center; border-radius: 12px 12px 0 0; }
              .header h1 { margin: 0; font-size: 24px; }
              .content { background: #f9fafb; padding: 30px; border-radius: 0 0 12px 12px; }
              .order-info { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
              .product-item { border-bottom: 1px solid #e5e7eb; padding: 15px 0; }
              .product-item:last-child { border-bottom: none; }
              .qr-section { background: white; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0; }
              .qr-code { max-width: 200px; margin: 15px auto; }
              .button { display: inline-block; background: #f97316; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 15px 0; }
              .footer { text-align: center; color: #6b7280; font-size: 14px; margin-top: 30px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>🎉 订单确认</h1>
                <p style="margin: 10px 0 0 0; opacity: 0.9;">感谢您选择 SimRyoko eSIM</p>
              </div>
              
              <div class="content">
                <p>尊敬的客户，</p>
                <p>感谢您的购买！您的订单已确认。</p>
                
                <div class="order-info">
                  <h2 style="margin-top: 0;">订单详情</h2>
                  <p><strong>订单号：</strong> ${orderData.orderId}</p>
                  <p><strong>订单金额：</strong> $${orderData.totalAmount}</p>
                  
                  <h3 style="margin-top: 20px;">商品列表</h3>
                  ${orderData.items.map(item => `
                    <div class="product-item">
                      <strong>${item.name}</strong> × ${item.quantity}<br>
                      <span style="color: #6b7280;">$${item.price}</span>
                    </div>
                  `).join('')}
                </div>
                
                ${orderData.esimData ? `
                  <div class="qr-section">
                    <h2 style="margin-top: 0;">📱 您的 eSIM</h2>
                    <p>请扫描下方二维码或手动输入激活码安装 eSIM</p>
                    <div class="qr-code">
                      <img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(orderData.esimData.qrCode)}" alt="eSIM QR Code" />
                    </div>
                    <p><strong>ICCID:</strong> ${orderData.esimData.iccid}</p>
                    <p><strong>激活码:</strong> ${orderData.esimData.activationCode}</p>
                    <p style="font-size: 14px; color: #6b7280; margin-top: 15px;">
                      <strong>安装步骤：</strong><br>
                      1. 打开设置 → 蜂窝网络 → 添加 eSIM<br>
                      2. 扫描二维码或手动输入激活码<br>
                      3. 启用数据漫游，选择新 eSIM 用于数据
                    </p>
                  </div>
                ` : `
                  <div class="qr-section">
                    <p>📧 eSIM 二维码将稍后发送到本邮箱</p>
                    <p style="color: #6b7280; font-size: 14px;">我们正在向供应商下单，处理完成后会立即发送 eSIM 信息</p>
                  </div>
                `}
                
                <div style="text-align: center;">
                  <a href="https://simryoko.com/help" class="button">查看安装指南</a>
                </div>
                
                <p style="margin-top: 20px;">如有任何问题，请随时联系我们：</p>
                <p>
                  📧 Email: xilixi@xigrocoltd.com<br>
                  💬 Telegram: @Simryokoesimbot
                </p>
                
                <div class="footer">
                  <p>© 2026 SimRyoko. Xigro Co Limited. All rights reserved.</p>
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
