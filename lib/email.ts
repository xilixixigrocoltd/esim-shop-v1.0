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
      from: 'SimRyoko eSIM <support@simryoko.com>',
      to: [email],
      subject: `✅ 订单确认 - ${orderData.orderId}`,
      html: generateEmailHtml(orderData),
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

function generateEmailHtml(orderData: {
  orderId: string;
  items: OrderItem[];
  totalAmount: string;
  customerEmail: string;
  esimData?: EsimData;
  paymentMethod?: string;
}): string {
  const now = new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' });
  
  const productItems = orderData.items.map(item => {
    const tags: string[] = [];
    if (item.dataSize) tags.push(`📶 ${item.dataSize}`);
    if (item.validity) tags.push(`📅 ${item.validity}`);
    if (item.countries && item.countries.length > 0) {
      const countryText = item.countries.slice(0, 3).join(', ') + 
        (item.countries.length > 3 ? `+${item.countries.length - 3}` : '');
      tags.push(`🌍 ${countryText}`);
    }
    const tagHtml = tags.map(tag => `<span style="display: inline-block; background: #f3f4f6; padding: 4px 10px; border-radius: 4px; font-size: 12px; color: #4b5563; margin: 2px;">${tag}</span>`).join('');
    
    return `
      <tr>
        <td style="padding: 15px;">
          <div style="font-weight: 600; color: #1f2937; margin-bottom: 8px; font-size: 15px;">${item.name}</div>
          <div style="font-size: 14px; color: #6b7280; margin-bottom: 10px;">数量：×${item.quantity}</div>
          <div>${tagHtml}</div>
        </td>
      </tr>
    `;
  }).join('');

  const esimSection = orderData.esimData ? `
    <tr>
      <td style="padding: 25px;">
        <h3 style="color: #1e40af; font-size: 18px; margin: 0 0 15px 0;">📱 您的 eSIM 已就绪</h3>
        <p style="color: #1e40af; margin: 0 0 20px 0; line-height: 1.6;">请扫描下方二维码或手动输入激活码完成安装</p>
        
        <table role="presentation" style="width: 100%; background: #ffffff; border-radius: 8px; margin: 0 0 15px 0;">
          <tr>
            <td align="center" style="padding: 20px;">
              <img src="https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(orderData.esimData.qrCode)}" alt="eSIM QR Code" style="max-width: 240px; width: 100%; height: auto; border: 2px solid #e5e7eb; border-radius: 8px;" />
              <p style="font-size: 12px; color: #6b7280; margin: 10px 0 0 0;">扫描二维码安装 eSIM</p>
            </td>
          </tr>
        </table>
        
        <table role="presentation" style="width: 100%; background: #ffffff; border-radius: 6px; border: 1px solid #e5e7eb; margin: 0 0 20px 0;">
          <tr>
            <td style="padding: 15px; text-align: center;">
              <div style="font-size: 12px; color: #6b7280; margin-bottom: 5px;">ICCID</div>
              <div style="font-family: 'Courier New', monospace; font-size: 13px; color: #1f2937; word-break: break-all;">${orderData.esimData.iccid}</div>
            </td>
          </tr>
        </table>
        
        <!-- 安装步骤 -->
        <table role="presentation" style="width: 100%; background: #ffffff; border-radius: 8px; margin: 0 0 20px 0; border: 1px solid #e5e7eb;">
          <tr>
            <td style="padding: 0;">
              <h4 style="color: #1f2937; font-size: 15px; margin: 0; padding: 15px 20px; background: #f9fafb; border-bottom: 1px solid #e5e7eb; border-radius: 8px 8px 0 0;">📲 安装步骤（3 步完成）</h4>
              
              <table role="presentation" style="width: 100%;">
                <tr>
                  <td style="padding: 20px 20px 15px 20px; border-bottom: 1px solid #f3f4f6;">
                    <table role="presentation" style="width: 100%;">
                      <tr>
                        <td style="width: 32px; vertical-align: top; padding-right: 12px;">
                          <div style="width: 26px; height: 26px; background: #f97316; border-radius: 50%; text-align: center; line-height: 26px; color: #ffffff; font-weight: bold; font-size: 13px;">1</div>
                        </td>
                        <td style="vertical-align: top;">
                          <div style="font-weight: 600; color: #1f2937; margin-bottom: 6px; font-size: 14px;">扫描二维码添加 eSIM</div>
                          <div style="font-size: 13px; color: #6b7280; line-height: 1.6;">
                            <strong>iPhone:</strong> 设置 → 蜂窝网络 → 添加 eSIM → 扫描二维码<br/>
                            <strong>Android:</strong> 设置 → 网络和互联网 → 移动网络 → 添加运营商
                          </div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 15px 20px; border-bottom: 1px solid #f3f4f6;">
                    <table role="presentation" style="width: 100%;">
                      <tr>
                        <td style="width: 32px; vertical-align: top; padding-right: 12px;">
                          <div style="width: 26px; height: 26px; background: #f97316; border-radius: 50%; text-align: center; line-height: 26px; color: #ffffff; font-weight: bold; font-size: 13px;">2</div>
                        </td>
                        <td style="vertical-align: top;">
                          <div style="font-weight: 600; color: #1f2937; margin-bottom: 6px; font-size: 14px;">开启数据漫游</div>
                          <div style="font-size: 13px; color: #6b7280; line-height: 1.6;">
                            安装完成后 → 启用该 eSIM 用于"蜂窝数据" → 开启"数据漫游"选项
                          </div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 15px 20px;">
                    <table role="presentation" style="width: 100%;">
                      <tr>
                        <td style="width: 32px; vertical-align: top; padding-right: 12px;">
                          <div style="width: 26px; height: 26px; background: #f97316; border-radius: 50%; text-align: center; line-height: 26px; color: #ffffff; font-weight: bold; font-size: 13px;">3</div>
                        </td>
                        <td style="vertical-align: top;">
                          <div style="font-weight: 600; color: #1f2937; margin-bottom: 6px; font-size: 14px;">抵达后自动连接</div>
                          <div style="font-size: 13px; color: #6b7280; line-height: 1.6;">
                            到达目的地国家 → 手机自动连接当地网络 → 开始使用（无需其他操作）
                          </div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  ` : `
    <tr>
      <td style="padding: 25px;">
        <h3 style="color: #92400e; font-size: 18px; margin: 0 0 15px 0;">⏳ eSIM 正在准备中</h3>
        <p style="color: #78350f; margin: 0 0 15px 0; line-height: 1.6;">我们正在向供应商下单，eSIM 信息将在 <strong>1-5 分钟</strong> 内发送到本邮箱</p>
        <p style="color: #78350f; font-size: 14px; margin: 0;">请保持邮箱畅通，注意查收包含 eSIM 二维码的邮件</p>
      </td>
    </tr>
  `;

  return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="zh-CN">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>订单确认 - ${orderData.orderId}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f3f4f6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
  <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f3f4f6;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" style="max-width: 600px; width: 100%; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          
          <tr>
            <td style="background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); padding: 40px 30px; text-align: center;">
              <div style="font-size: 32px; font-weight: bold; color: #ffffff; margin-bottom: 10px;">🦞 SimRyoko</div>
              <h1 style="color: #ffffff; font-size: 24px; margin: 0 0 10px 0; font-weight: 600;">✅ 订单确认</h1>
              <p style="color: rgba(255,255,255,0.9); margin: 0; font-size: 14px;">感谢您选择 SimRyoko eSIM</p>
            </td>
          </tr>
          
          <tr>
            <td style="padding: 30px;">
              <p style="font-size: 16px; color: #1f2937; margin: 0 0 20px 0;">尊敬的客户，您好！</p>
              <p style="color: #4b5563; margin: 0 0 30px 0; line-height: 1.6;">感谢您的购买！您的订单已确认${orderData.esimData ? '，eSIM 已生成' : '并正在处理中'}。</p>
              
              <table role="presentation" style="width: 100%; background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); border-left: 4px solid #f59e0b; border-radius: 8px; margin: 0 0 25px 0;">
                <tr>
                  <td style="padding: 20px;">
                    <h2 style="color: #92400e; font-size: 18px; margin: 0 0 15px 0;">📋 订单信息</h2>
                    <table role="presentation" style="width: 100%;">
                      <tr>
                        <td style="padding: 8px 0; border-bottom: 1px solid rgba(146,64,14,0.1); color: #78350f; font-weight: 500;">订单号</td>
                        <td style="padding: 8px 0; border-bottom: 1px solid rgba(146,64,14,0.1); color: #92400e; font-weight: 600; text-align: right;">${orderData.orderId}</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; border-bottom: 1px solid rgba(146,64,14,0.1); color: #78350f; font-weight: 500;">下单时间</td>
                        <td style="padding: 8px 0; border-bottom: 1px solid rgba(146,64,14,0.1); color: #92400e; font-weight: 600; text-align: right;">${now}</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; border-bottom: 1px solid rgba(146,64,14,0.1); color: #78350f; font-weight: 500;">订单金额</td>
                        <td style="padding: 8px 0; border-bottom: 1px solid rgba(146,64,14,0.1); color: #92400e; font-weight: 600; text-align: right;">$${orderData.totalAmount} USD</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; color: #78350f; font-weight: 500;">支付方式</td>
                        <td style="padding: 8px 0; color: #92400e; font-weight: 600; text-align: right;">${orderData.paymentMethod || '信用卡'}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
              
              <table role="presentation" style="width: 100%; background-color: #f9fafb; border-radius: 8px; margin: 0 0 25px 0;">
                <tr>
                  <td style="padding: 20px;">
                    <h3 style="color: #1f2937; font-size: 16px; margin: 0 0 15px 0;">📦 商品详情</h3>
                    <table role="presentation" style="width: 100%;">
                      ${productItems}
                    </table>
                  </td>
                </tr>
              </table>
              
              ${esimSection}
              
              <table role="presentation" style="width: 100%; margin: 25px 0;">
                <tr>
                  <td align="center">
                    <a href="https://simryoko.com/help" style="display: inline-block; background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); color: #ffffff; text-decoration: none; padding: 14px 35px; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 6px rgba(249,115,22,0.3);">查看安装指南</a>
                  </td>
                </tr>
              </table>
              
              <table role="presentation" style="width: 100%; background: #f9fafb; border-radius: 8px; margin: 25px 0;">
                <tr>
                  <td style="padding: 20px;">
                    <h4 style="color: #1f2937; font-size: 16px; margin: 0 0 15px 0;">💬 需要帮助？</h4>
                    <table role="presentation" style="width: 100%;">
                      <tr>
                        <td style="padding: 5px 0; font-size: 14px;">
                          <span style="margin-right: 8px;">📧</span>
                          <span>邮箱：<a href="mailto:support@simryoko.com" style="color: #f97316; text-decoration: none; font-weight: 500;">support@simryoko.com</a></span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 5px 0; font-size: 14px;">
                          <span style="margin-right: 8px;">💬</span>
                          <span>Telegram: <a href="https://t.me/Simryokoesimbot" style="color: #f97316; text-decoration: none; font-weight: 500;">@Simryokoesimbot</a></span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 5px 0; font-size: 14px;">
                          <span style="margin-right: 8px;">🌐</span>
                          <span>服务时间：7×24 小时</span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
              
            </td>
          </tr>
          
          <tr>
            <td style="background: #f9fafb; padding: 25px 30px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="font-weight: bold; color: #6b7280; font-size: 14px; margin: 0 0 5px 0;">SimRyoko eSIM</p>
              <p style="color: #9ca3af; font-size: 13px; margin: 0 0 15px 0;">全球 eSIM，即时连接</p>
              <p style="color: #9ca3af; font-size: 12px; margin: 0;">© 2026 SimRyoko. Xigro Co Limited. All rights reserved.</p>
            </td>
          </tr>
          
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
