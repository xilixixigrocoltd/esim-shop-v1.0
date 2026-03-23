import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

interface EsimData {
  iccid: string
  qrCode: string
  activationCode: string
  dataAmount: string
  validityDays: number
  directAppleUrl?: string
}

interface OrderItem {
  name: string
  quantity?: number
  price: string
  dataSize?: string
  validity?: string
}

export async function sendOrderConfirmation(email: string, orderData: {
  orderId: string
  items: OrderItem[]
  totalAmount: string
  customerEmail: string
  esimData?: EsimData
  paymentMethod?: string
}) {
  const { orderId, items, totalAmount, esimData } = orderData
  const item = items?.[0]

  const esimSection = esimData ? `
    <div style="background:#f0fdf4;border:1px solid #86efac;border-radius:12px;padding:20px;margin-bottom:16px;">
      <h3 style="color:#166534;margin:0 0 16px;font-size:16px;">📱 您的 eSIM 信息</h3>
      <p style="margin:0 0 4px;font-size:13px;"><strong>ICCID:</strong></p>
      <p style="background:#e5e7eb;padding:8px 12px;border-radius:6px;font-family:monospace;font-size:12px;margin:0 0 12px;word-break:break-all;">${esimData.iccid}</p>
      ${esimData.activationCode ? `
        <p style="margin:0 0 4px;font-size:13px;"><strong>LPA 激活码（手动安装）:</strong></p>
        <p style="background:#e5e7eb;padding:8px 12px;border-radius:6px;font-family:monospace;font-size:11px;margin:0 0 4px;word-break:break-all;">${esimData.activationCode}</p>
        <p style="color:#6b7280;font-size:12px;margin:0 0 16px;">（在「添加蜂窝套餐」→「手动输入」中粘贴此码）</p>
      ` : ''}
      ${esimData.qrCode ? `
        <div style="text-align:center;margin:16px 0;">
          <img src="${esimData.qrCode}" width="180" height="180" alt="eSIM QR Code" style="border-radius:8px;border:3px solid #d1fae5;" />
          <p style="color:#166534;font-size:13px;margin:8px 0 0;">📷 扫描此二维码安装 eSIM</p>
        </div>
      ` : ''}
      ${esimData.directAppleUrl ? `
        <div style="text-align:center;margin:12px 0;">
          <a href="${esimData.directAppleUrl}" style="background:#000;color:#fff;padding:12px 24px;border-radius:10px;text-decoration:none;font-size:14px;font-weight:600;display:inline-block;">🍎 iPhone 一键安装</a>
        </div>
      ` : ''}
    </div>
  ` : `
    <div style="background:#fef9c3;border:1px solid #fde047;border-radius:12px;padding:16px;margin-bottom:16px;">
      <p style="margin:0;color:#854d0e;">⏳ <strong>eSIM 正在处理中</strong>，激活码将在几分钟内发送到您的邮箱。</p>
    </div>
  `

  const html = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f9fafb;">
<div style="font-family:'Helvetica Neue',Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;background:#f9fafb;">
  <div style="background:linear-gradient(135deg,#f97316,#ea580c);border-radius:16px;padding:32px;text-align:center;margin-bottom:20px;">
    <h1 style="color:white;margin:0;font-size:26px;">🎉 订单确认</h1>
    <p style="color:rgba(255,255,255,0.9);margin:8px 0 0;font-size:15px;">感谢您购买 SimRyoko eSIM</p>
  </div>
  <div style="background:#fff;border:1px solid #e5e7eb;border-radius:12px;padding:20px;margin-bottom:16px;">
    <h3 style="margin:0 0 12px;color:#111;font-size:16px;">📦 订单详情</h3>
    <table style="width:100%;border-collapse:collapse;">
      <tr><td style="padding:6px 0;color:#6b7280;font-size:14px;">订单号</td><td style="padding:6px 0;font-weight:600;font-size:14px;text-align:right;">${orderId}</td></tr>
      <tr><td style="padding:6px 0;color:#6b7280;font-size:14px;">套餐</td><td style="padding:6px 0;font-size:14px;text-align:right;">${item?.name || 'eSIM'}</td></tr>
      <tr><td style="padding:6px 0;color:#6b7280;font-size:14px;">金额</td><td style="padding:6px 0;font-weight:700;font-size:16px;color:#f97316;text-align:right;">$${totalAmount} USD</td></tr>
    </table>
  </div>
  ${esimSection}
  <div style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:12px;padding:20px;margin-bottom:16px;">
    <h3 style="margin:0 0 12px;color:#1e40af;font-size:16px;">📖 安装步骤</h3>
    <ol style="margin:0;padding-left:20px;line-height:2;font-size:14px;color:#374151;">
      <li>打开手机 <strong>设置</strong></li>
      <li>进入 <strong>蜂窝网络</strong> → <strong>添加蜂窝套餐</strong></li>
      <li>扫描上方二维码 或 点击「iPhone 一键安装」</li>
      <li><strong>到达目的地</strong>后再开启此套餐</li>
    </ol>
  </div>
  <div style="background:#fef3c7;border:1px solid #fcd34d;border-radius:12px;padding:16px;margin-bottom:16px;">
    <p style="margin:0;color:#92400e;font-size:13px;">⚠️ <strong>重要提醒：</strong>需要国际版手机（港版/美版 iPhone、国际版安卓），国行手机不支持 eSIM。</p>
  </div>
  <div style="text-align:center;padding:20px 0;border-top:1px solid #e5e7eb;">
    <p style="color:#6b7280;font-size:14px;margin:0 0 4px;">遇到问题？联系客服</p>
    <a href="https://t.me/Simryokoesimbot" style="color:#f97316;font-size:14px;text-decoration:none;">@Simryokoesimbot</a>
    <p style="color:#9ca3af;font-size:11px;margin:12px 0 0;">© 2026 SimRyoko · simryoko.com</p>
  </div>
</div>
</body>
</html>`

  await resend.emails.send({
    from: 'SimRyoko <noreply@simryoko.com>',
    to: email,
    subject: `✅ 订单确认 #${orderId} - 您的 eSIM 已准备好`,
    html,
  })
}
