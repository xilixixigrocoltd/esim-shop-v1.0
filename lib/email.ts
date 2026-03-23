import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: 'smtp.exmail.qq.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.SMTP_USER || 'xilixi@xigrocoltd.com',
    pass: process.env.SMTP_PASS || 'x8F7Jr4gn8i9Y95m',
  },
})

interface OrderItem {
  name: string
  quantity: number
  price: string
  dataSize?: string
  validity?: string
  countries?: string[]
}

interface EsimData {
  iccid: string
  qrCode: string          // QR 码图片 URL（用于邮件显示）
  activationCode: string  // LPA matching_id（如 HDFGO6T8VW7WM1QW）
  dataAmount: string
  validityDays: number
  directAppleUrl?: string // iOS 一键安装链接
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
  const item = items[0]

  const esimSection = esimData ? `
    <div style="background:#f0fdf4;border:1px solid #86efac;border-radius:12px;padding:20px;margin:20px 0;">
      <h3 style="color:#166534;margin:0 0 12px;">📱 您的 eSIM 信息</h3>
      <p><strong>ICCID:</strong> <code style="background:#e5e7eb;padding:2px 6px;border-radius:4px;">${esimData.iccid}</code></p>
      ${esimData.activationCode ? `<p><strong>LPA 激活码:</strong></p><p style="margin:4px 0;"><code style="background:#e5e7eb;padding:4px 8px;border-radius:4px;font-size:11px;word-break:break-all;display:block;">${esimData.activationCode}</code></p><p style="color:#6b7280;font-size:12px;margin:2px 0;">（手动安装时在"添加蜂窝套餐"→"手动输入"中粘贴此码）</p>` : ''}
      <p><strong>流量:</strong> ${esimData.dataAmount}</p>
      <p><strong>有效期:</strong> ${esimData.validityDays} 天</p>
      ${esimData.qrCode ? `
        <div style="text-align:center;margin:16px 0;">
          <img src="${esimData.qrCode}" alt="eSIM QR Code" style="max-width:200px;border-radius:8px;border:1px solid #d1fae5;" />
          <p style="color:#666;font-size:14px;">使用手机扫描此二维码安装 eSIM</p>
        </div>
      ` : ''}
      ${esimData.directAppleUrl ? `
        <div style="text-align:center;margin:12px 0;">
          <a href="${esimData.directAppleUrl}" style="background:#000;color:#fff;padding:10px 20px;border-radius:8px;text-decoration:none;font-size:14px;display:inline-block;">🍎 iPhone 一键安装</a>
        </div>
      ` : ''}
    </div>
  ` : `
    <div style="background:#fef9c3;border:1px solid #fde047;border-radius:12px;padding:16px;margin:20px 0;">
      <p style="margin:0;color:#854d0e;">⏳ <strong>eSIM 正在处理中</strong>，激活码将在几分钟内发送到您的邮箱。如有问题请联系客服。</p>
    </div>
  `

  const html = `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"></head>
    <body style="font-family:'Helvetica Neue',Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;color:#333;">
      <div style="background:linear-gradient(135deg,#f97316,#ea580c);border-radius:16px;padding:32px;text-align:center;margin-bottom:24px;">
        <h1 style="color:white;margin:0;font-size:28px;">🎉 订单确认</h1>
        <p style="color:rgba(255,255,255,0.9);margin:8px 0 0;">感谢您购买 SimRyoko eSIM</p>
      </div>

      <div style="background:#fff;border:1px solid #e5e7eb;border-radius:12px;padding:20px;margin-bottom:16px;">
        <h3 style="margin:0 0 12px;color:#111;">📦 订单详情</h3>
        <p><strong>订单号:</strong> ${orderId}</p>
        <p><strong>套餐:</strong> ${item?.name || 'eSIM'}</p>
        <p><strong>金额:</strong> $${totalAmount} USD</p>
      </div>

      ${esimSection}

      <div style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:12px;padding:20px;margin-bottom:16px;">
        <h3 style="margin:0 0 12px;color:#1e40af;">📖 安装步骤</h3>
        <ol style="margin:0;padding-left:20px;line-height:2;">
          <li>打开手机 <strong>设置</strong></li>
          <li>进入 <strong>蜂窝网络</strong> → <strong>添加蜂窝套餐</strong></li>
          <li>扫描上方二维码或输入激活码</li>
          <li>到达目的地后，选择此 eSIM 套餐</li>
        </ol>
      </div>

      <div style="background:#fef3c7;border:1px solid #fcd34d;border-radius:12px;padding:16px;margin-bottom:16px;">
        <p style="margin:0;color:#92400e;">⚠️ <strong>重要提醒：</strong>需要国际版手机才能使用 eSIM（港版/美版 iPhone，国际版安卓），国行手机不支持。</p>
      </div>

      <div style="text-align:center;padding:20px 0;border-top:1px solid #e5e7eb;margin-top:24px;">
        <p style="color:#6b7280;font-size:14px;">如有问题请联系客服：<a href="https://t.me/Simryokoesimbot" style="color:#f97316;">@Simryokoesimbot</a></p>
        <p style="color:#9ca3af;font-size:12px;">© 2026 SimRyoko · simryoko.com</p>
      </div>
    </body>
    </html>
  `

  await transporter.sendMail({
    from: `SimRyoko <xilixi@xigrocoltd.com>`,
    to: email,
    subject: `✅ 订单确认 #${orderId} - 您的 eSIM 已准备好`,
    html,
  })
}
