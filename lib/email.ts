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
  locale?: string
}) {
  const { orderId, items, totalAmount, esimData, locale = 'zh' } = orderData
  const item = items?.[0]
  const isZh = locale === 'zh' || locale === 'zh-CN'

  // 多语言文本
  const t = {
    subject: isZh
      ? `✅ 订单确认 #${orderId} - 您的 eSIM 已准备好`
      : `✅ Order Confirmed #${orderId} - Your eSIM is Ready`,
    header: isZh ? '🎉 订单确认' : '🎉 Order Confirmed',
    headerSub: isZh ? '感谢您购买 SimRyoko eSIM' : 'Thank you for purchasing SimRyoko eSIM',
    orderTitle: isZh ? '📦 订单详情' : '📦 Order Details',
    orderNum: isZh ? '订单号' : 'Order No.',
    plan: isZh ? '套餐' : 'Plan',
    amount: isZh ? '金额' : 'Amount',
    esimTitle: isZh ? '📱 您的 eSIM 信息' : '📱 Your eSIM',
    iccid: 'ICCID',
    lpa: isZh ? 'LPA 激活码（手动安装）' : 'LPA Activation Code (Manual)',
    lpaHint: isZh ? '在「添加蜂窝套餐」→「手动输入」中粘贴' : 'Paste in "Add Cellular Plan" → "Enter Manually"',
    qrHint: isZh ? '📷 扫描此二维码安装 eSIM' : '📷 Scan QR Code to install eSIM',
    appleBtn: isZh ? '🍎 iPhone 一键安装' : '🍎 Install on iPhone',
    iphoneTitle: isZh ? '📱 iPhone 安装步骤' : '📱 iPhone Installation',
    androidTitle: isZh ? '🤖 Android 安装步骤' : '🤖 Android Installation',
    iphoneSteps: isZh
      ? ['打开「设置」', '点击「蜂窝网络」→「添加蜂窝套餐」', '扫描二维码 或 点击上方「iPhone 一键安装」', '到达目的地后开启此 eSIM 套餐']
      : ['Open "Settings"', 'Tap "Cellular" → "Add Cellular Plan"', 'Scan QR Code or tap "Install on iPhone" above', 'Activate the eSIM plan upon arrival'],
    androidSteps: isZh
      ? ['打开「设置」→「网络和互联网」或「连接」', '点击「SIM 卡管理」→「添加 eSIM」', '扫描二维码 或 手动输入激活码', '到达目的地后切换至此 eSIM']
      : ['Open "Settings" → "Network & Internet" or "Connections"', 'Tap "SIM Manager" → "Add eSIM"', 'Scan QR Code or enter activation code manually', 'Switch to this eSIM upon arrival'],
    warning: isZh
      ? '⚠️ 需要国际版手机才能使用 eSIM（港版/美版 iPhone，国际版安卓）。国行手机不支持。'
      : '⚠️ eSIM requires an unlocked international device (non-mainland China iPhone or international Android).',
    processing: isZh
      ? '⏳ eSIM 正在处理中，激活码将在几分钟内发送到您的邮箱。'
      : '⏳ Your eSIM is being processed. Activation code will be sent shortly.',
    support: isZh ? '遇到问题？联系客服' : 'Need help? Contact support',
  }

  const esimSection = esimData ? `
    <div style="background:#f0fdf4;border:1px solid #86efac;border-radius:12px;padding:20px;margin-bottom:16px;">
      <h3 style="color:#166534;margin:0 0 16px;font-size:16px;">${t.esimTitle}</h3>
      <p style="margin:0 0 4px;font-size:13px;"><strong>${t.iccid}:</strong></p>
      <p style="background:#e5e7eb;padding:8px 12px;border-radius:6px;font-family:monospace;font-size:12px;margin:0 0 12px;word-break:break-all;">${esimData.iccid}</p>
      ${esimData.activationCode ? `
        <p style="margin:0 0 4px;font-size:13px;"><strong>${t.lpa}:</strong></p>
        <p style="background:#e5e7eb;padding:8px 12px;border-radius:6px;font-family:monospace;font-size:11px;margin:0 0 4px;word-break:break-all;">${esimData.activationCode}</p>
        <p style="color:#6b7280;font-size:12px;margin:0 0 16px;">${t.lpaHint}</p>
      ` : ''}
      ${esimData.qrCode ? `
        <div style="text-align:center;margin:16px 0;">
          <img src="${esimData.qrCode}" width="180" height="180" alt="eSIM QR Code" style="border-radius:8px;border:3px solid #d1fae5;" />
          <p style="color:#166534;font-size:13px;margin:8px 0 0;">${t.qrHint}</p>
        </div>
      ` : ''}
      ${esimData.directAppleUrl ? `
        <div style="text-align:center;margin:12px 0;">
          <a href="${esimData.directAppleUrl}" style="background:#000;color:#fff;padding:12px 24px;border-radius:10px;text-decoration:none;font-size:14px;font-weight:600;display:inline-block;">${t.appleBtn}</a>
        </div>
      ` : ''}
    </div>
  ` : `
    <div style="background:#fef9c3;border:1px solid #fde047;border-radius:12px;padding:16px;margin-bottom:16px;">
      <p style="margin:0;color:#854d0e;">${t.processing}</p>
    </div>
  `

  const stepsHtml = (title: string, steps: string[], color: string, bg: string, border: string) => `
    <div style="background:${bg};border:1px solid ${border};border-radius:12px;padding:20px;margin-bottom:12px;">
      <h3 style="margin:0 0 12px;color:${color};font-size:15px;">${title}</h3>
      <ol style="margin:0;padding-left:20px;line-height:2;font-size:14px;color:#374151;">
        ${steps.map(s => `<li>${s}</li>`).join('')}
      </ol>
    </div>
  `

  const html = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f9fafb;">
<div style="font-family:'Helvetica Neue',Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;background:#f9fafb;">
  <div style="background:linear-gradient(135deg,#f97316,#ea580c);border-radius:16px;padding:32px;text-align:center;margin-bottom:20px;">
    <h1 style="color:white;margin:0;font-size:26px;">${t.header}</h1>
    <p style="color:rgba(255,255,255,0.9);margin:8px 0 0;font-size:15px;">${t.headerSub}</p>
  </div>
  <div style="background:#fff;border:1px solid #e5e7eb;border-radius:12px;padding:20px;margin-bottom:16px;">
    <h3 style="margin:0 0 12px;color:#111;font-size:16px;">${t.orderTitle}</h3>
    <table style="width:100%;border-collapse:collapse;">
      <tr><td style="padding:6px 0;color:#6b7280;font-size:14px;">${t.orderNum}</td><td style="padding:6px 0;font-weight:600;font-size:14px;text-align:right;">${orderId}</td></tr>
      <tr><td style="padding:6px 0;color:#6b7280;font-size:14px;">${t.plan}</td><td style="padding:6px 0;font-size:14px;text-align:right;">${item?.name || 'eSIM'}</td></tr>
      <tr><td style="padding:6px 0;color:#6b7280;font-size:14px;">${t.amount}</td><td style="padding:6px 0;font-weight:700;font-size:16px;color:#f97316;text-align:right;">$${totalAmount} USD</td></tr>
    </table>
  </div>
  ${esimSection}
  ${stepsHtml(t.iphoneTitle, t.iphoneSteps, '#1e40af', '#eff6ff', '#bfdbfe')}
  ${stepsHtml(t.androidTitle, t.androidSteps, '#166534', '#f0fdf4', '#86efac')}
  <div style="background:#fef3c7;border:1px solid #fcd34d;border-radius:12px;padding:16px;margin-bottom:16px;">
    <p style="margin:0;color:#92400e;font-size:13px;">${t.warning}</p>
  </div>
  <div style="text-align:center;padding:20px 0;border-top:1px solid #e5e7eb;">
    <p style="color:#6b7280;font-size:14px;margin:0 0 4px;">${t.support}</p>
    <a href="https://t.me/Simryokoesimbot" style="color:#f97316;font-size:14px;text-decoration:none;">@Simryokoesimbot</a>
    <p style="color:#9ca3af;font-size:11px;margin:12px 0 0;">© 2026 SimRyoko · simryoko.com</p>
  </div>
</div>
</body>
</html>`

  await resend.emails.send({
    from: 'SimRyoko <noreply@simryoko.com>',
    to: email,
    subject: t.subject,
    html,
  })
}
