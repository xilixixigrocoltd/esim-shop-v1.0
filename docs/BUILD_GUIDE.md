# 🦞 SimRyoko eSIM 电商网站 - 从 0 到 1 搭建全流程

**项目时间**: 2026-02-25 ~ 2026-03-19  
**技术栈**: Next.js 14 + TypeScript + Tailwind CSS + Stripe + Vercel  
**生产地址**: https://simryoko.com  
**电商地址**: https://esim-shop-v1.vercel.app

---

## 📋 目录

1. [项目背景](#项目背景)
2. [技术选型](#技术选型)
3. [架构设计](#架构设计)
4. [开发环境搭建](#开发环境搭建)
5. [核心功能实现](#核心功能实现)
6. [支付集成](#支付集成)
7. [邮件系统](#邮件系统)
8. [部署上线](#部署上线)
9. [监控与运维](#监控与运维)
10. [经验教训](#经验教训)

---

## 项目背景

### 业务需求
- **公司名称**: Xigro Co Limited（香港注册）
- **品牌名**: SimRyoko
- **业务**: eSIM 全球流量套餐零售
- **供应商**: Airalo 授权批发商（2720 款产品）
- **目标市场**: 全球 C 端用户
- **收款方式**: Stripe 信用卡/支付宝/Apple Pay

### 核心需求
1. 产品展示（按国家/地区/流量分类）
2. 购物车 + 结账流程
3. Stripe 支付集成
4. 自动下单（调用供应商 API）
5. 邮件通知（订单确认 + eSIM 二维码）
6. 多语言支持（中/英）

---

## 技术选型

### 前端
| 技术 | 版本 | 选型理由 |
|------|------|----------|
| **Next.js** | 14.2.0 | SSR + 静态生成，SEO 友好 |
| **React** | 18.2.0 | 组件化开发 |
| **TypeScript** | 5.x | 类型安全 |
| **Tailwind CSS** | 3.x | 快速样式开发 |
| **Pages Router** | - | 兼容性好，API 路由方便 |

### 后端
| 技术 | 版本 | 选型理由 |
|------|------|----------|
| **Next.js API Routes** | - | 前后端一体，部署简单 |
| **Stripe SDK** | 2025-02-24 | 官方支持，文档完善 |
| **Resend** | - | 邮件发送，$30/月 1000 封 |
| **B2B API** | - | 供应商订单系统 |

### 基础设施
| 服务 | 用途 | 成本 |
|------|------|------|
| **Vercel** | 托管 + CDN | 免费（Hobby） |
| **GitHub** | 代码仓库 | 免费 |
| **Stripe** | 支付处理 | 2.9% + $0.3/笔 |
| **Resend** | 邮件发送 | $30/月 |
| **Cloudflare** | DNS + CDN | 免费 |

---

## 架构设计

### 系统架构
```
用户浏览器
    ↓
Cloudflare DNS
    ↓
Vercel CDN (全球节点)
    ↓
Next.js 应用 (Serverless Functions)
    ├── /api/payment/stripe → Stripe Checkout
    ├── /api/payment/webhook → Stripe 回调 → B2B 下单
    ├── /api/products → 供应商 API 缓存
    └── Resend → 邮件发送
    ↓
外部服务
    ├── Stripe (支付)
    ├── B2B API (供应商下单)
    └── Resend (邮件)
```

### 目录结构
```
esim-shop-v1.0/
├── pages/
│   ├── index.tsx              # 首页
│   ├── products.tsx           # 产品列表
│   ├── cart.tsx               # 购物车
│   ├── checkout.tsx           # 结账页
│   ├── success.tsx            # 支付成功页
│   └── api/
│       ├── payment/
│       │   ├── create.ts      # 创建 Stripe Session
│       │   ├── webhook.ts     # Stripe 回调
│       │   └── status.ts      # 订单状态查询
│       └── products/
│           ├── index.ts       # 产品列表
│           └── [id].ts        # 产品详情
├── components/
│   ├── ui/                    # 通用组件
│   ├── product/               # 产品组件
│   ├── cart/                  # 购物车组件
│   └── checkout/              # 结账组件
├── lib/
│   ├── api.ts                 # B2B API 封装
│   ├── email.ts               # 邮件发送
│   └── utils.ts               # 工具函数
├── types/
│   └── index.ts               # TypeScript 类型定义
└── scripts/
    └── webhook-retry.py       # Webhook 重试脚本
```

---

## 开发环境搭建

### 1. 初始化项目
```bash
npx create-next-app@14 esim-shop-v1.0 --typescript --tailwind --pages
cd esim-shop-v1.0
npm install stripe resend lucide-react
```

### 2. 配置环境变量
创建 `.env.local`:
```bash
# Stripe
STRIPE_SECRET_KEY=sk_live_***
STRIPE_PUBLISHABLE_KEY=pk_live_***
STRIPE_WEBHOOK_SECRET=whsec_***

# B2B API
B2B_API_KEY=ak_***
B2B_API_SECRET=***
B2B_API_URL=https://api.xigrocoltd.com

# Resend
RESEND_API_KEY=re_***

# 站点配置
NEXT_PUBLIC_SITE_URL=https://esim-shop-v1.vercel.app
```

### 3. 类型定义
`types/index.ts`:
```typescript
export interface Product {
  id: number;
  name: string;
  price: number;
  dataSize: number;
  validDays: number;
  countries: Country[];
}

export interface Order {
  id: string;
  orderNumber: string;
  status: 'pending' | 'paid' | 'delivered';
  esimData?: EsimData[];
}
```

---

## 核心功能实现

### 1. 产品列表（分页 + 缓存）
```typescript
// pages/api/products/index.ts
export default async function handler(req, res) {
  const page = parseInt(req.query.page) || 1;
  const cached = await getCache(`products:${page}`);
  
  if (cached) return res.json(cached);
  
  const products = await b2bApi.getProducts({ page, pageSize: 20 });
  await setCache(`products:${page}`, products, 600); // 10 分钟缓存
  
  res.json(products);
}
```

### 2. 购物车（本地存储）
```typescript
// lib/utils.ts
export const CART_KEY = 'simryoko_cart';

export const storage = {
  get: (key: string) => {
    if (typeof window === 'undefined') return null;
    return JSON.parse(localStorage.getItem(key) || '[]');
  },
  set: (key: string, value: any) => {
    localStorage.setItem(key, JSON.stringify(value));
  },
};
```

### 3. B2B API 签名
```typescript
// lib/api.ts
export async function b2bApi(endpoint: string, method = 'GET', body?: any) {
  const timestamp = Date.now().toString();
  const nonce = Math.random().toString(36).substring(2, 22);
  const bodyStr = body ? JSON.stringify(body).replace(/\s/g, '') : '';
  
  const signString = method + endpoint + bodyStr + timestamp + nonce;
  const signature = crypto
    .createHmac('sha256', B2B_API_SECRET)
    .update(signString)
    .digest('hex');
  
  const response = await fetch(B2B_API_URL + endpoint, {
    method,
    headers: {
      'x-api-key': B2B_API_KEY,
      'x-timestamp': timestamp,
      'x-nonce': nonce,
      'x-signature': signature,
      'Content-Type': 'application/json',
    },
    body: bodyStr,
  });
  
  return response.json();
}
```

---

## 支付集成

### 1. 创建 Stripe Checkout Session
```typescript
// pages/api/payment/create.ts
const session = await stripe.checkout.sessions.create({
  payment_method_types: ['card', 'alipay'],
  line_items: [{
    price_data: {
      currency: 'usd',
      product_data: { name: productName },
      unit_amount: Math.round(amount * 100),
    },
    quantity: 1,
  }],
  mode: 'payment',
  success_url: `${SITE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
  cancel_url: `${SITE_URL}/checkout?canceled=true`,
  customer_email: email,
  metadata: { email, items: JSON.stringify(items) },
});

return res.json({ success: true, paymentUrl: session.url });
```

### 2. Webhook 处理（核心！）
```typescript
// pages/api/payment/webhook.ts
export default async function handler(req, res) {
  const sig = req.headers['stripe-signature'];
  
  // 验证签名
  const event = stripe.webhooks.constructEvent(
    req.rawBody, sig, STRIPE_WEBHOOK_SECRET
  );
  
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const items = JSON.parse(session.metadata.items);
    const email = session.customer_email;
    
    // 1. 创建 B2B 订单
    const order = await b2bApi.createOrder({
      productId: items[0].productId,
      quantity: items[0].quantity,
      customerEmail: email,
    });
    
    // 2. 发送确认邮件
    await sendOrderConfirmation(email, {
      orderId: order.orderNumber,
      items,
      totalAmount: session.amount_total / 100,
      esimData: order.esims?.[0],
    });
  }
  
  res.json({ received: true });
}
```

### 3. 配置 Stripe Webhook
```bash
Stripe Dashboard → Developers → Webhooks
- URL: https://esim-shop-v1.vercel.app/api/payment/webhook
- Events: checkout.session.completed
- Secret: whsec_*** (保存到 Vercel 环境变量)
```

---

## 邮件系统

### 1. Resend 配置
```typescript
// lib/email.ts
import { Resend } from 'resend';
const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendOrderConfirmation(email, orderData) {
  await resend.emails.send({
    from: 'SimRyoko eSIM <support@simryoko.com>',
    to: [email],
    subject: `✅ 订单确认 - ${orderData.orderId}`,
    html: generateEmailHtml(orderData),
  });
}
```

### 2. 邮件模板优化历程
| 版本 | 问题 | 优化 |
|------|------|------|
| v1 | 排版混乱 | 改用 table 布局 |
| v2 | 二维码太小 | 200px → 220px |
| v3 | 字体太大 | 全面缩小 10-15% |
| v4 | 客服信息冗余 | 删除"需要帮助"模块 |

### 3. 最终邮件结构
- Header（品牌 + 标题）
- 订单信息（黄色背景）
- 商品详情（灰色背景）
- eSIM 二维码 + ICCID（蓝色背景）
- 安装步骤（3 步）
- 页脚版权

---

## 部署上线

### 1. GitHub 仓库
```bash
git init
git remote add origin https://github.com/xilixixigrocoltd/esim-shop-v1.0.git
git add . && git commit -m "Initial commit"
git push -u origin main
```

### 2. Vercel 部署
```bash
# 安装 Vercel CLI
npm i -g vercel

# 登录
vercel login

# 关联项目
vercel link --project esim-shop-v1

# 部署到生产
vercel --prod
```

### 3. 环境变量配置
Vercel Dashboard → Settings → Environment Variables:
```
STRIPE_SECRET_KEY=sk_live_***
STRIPE_PUBLISHABLE_KEY=pk_live_***
STRIPE_WEBHOOK_SECRET=whsec_***
B2B_API_KEY=ak_***
B2B_API_SECRET=***
RESEND_API_KEY=re_***
NEXT_PUBLIC_SITE_URL=https://esim-shop-v1.vercel.app
```

### 4. 域名配置
```
Cloudflare DNS:
- simryoko.com → CNAME → cname.vercel-dns.com
- www.simryoko.com → CNAME → cname.vercel-dns.com

Vercel Project → Settings → Domains:
- 添加 simryoko.com
- 添加 www.simryoko.com
```

---

## 监控与运维

### 1. 订单监控脚本
```python
# /opt/xigro-bots/scripts/order-monitor.py
# 每 5 分钟检查未生成 eSIM 的订单
# 发现异常 → Telegram 通知 gg
```

### 2. Webhook 重试脚本
```python
# scripts/webhook-retry.py
# 手动重放失败的 Stripe Session
# 用法：python3 scripts/webhook-retry.py
```

### 3. 日志查看
```bash
# Vercel 日志
vercel logs esim-shop-v1 --follow

# Stripe 日志
Stripe Dashboard → Developers → Events
```

### 4. 关键指标
| 指标 | 目标值 | 监控方式 |
|------|--------|----------|
| 支付成功率 | >95% | Stripe Dashboard |
| 邮件送达率 | >98% | Resend Dashboard |
| 页面加载时间 | <2s | Vercel Analytics |
| API 错误率 | <1% | 自定义监控 |

---

## 经验教训

### ✅ 成功经验

1. **Pages Router 选择正确**
   - API 路由简单直接
   - 兼容性好，无 SSR 问题

2. **表格布局邮件模板**
   - 兼容所有邮件客户端
   - Gmail/Outlook 显示一致

3. **Webhook 重试机制**
   - 部署期间 Webhook 可能失败
   - 手动重试脚本必不可少

4. **紧凑字体设计**
   - 移动端阅读体验更好
   - 信息密度高，一屏显示

### ❌ 踩过的坑

1. **Web Crypto API 不可用**
   - Vercel Serverless 环境不支持 `crypto.subtle`
   - 解决：改用 Node.js `crypto.createHmac()`

2. **JSON 签名空格问题**
   - B2B API 签名要求 JSON 无空格
   - 解决：`JSON.stringify(data).replace(/\s/g, '')`

3. **部署期间 Webhook 失败**
   - Vercel 部署时有 30-60 秒不可用
   - 解决：手动重试脚本 + 订单监控

4. **邮箱字段丢失**
   - B2B API 不返回 customerEmail
   - 解决：Webhook 中显式传递邮箱

5. **Stripe 测试卡误导**
   - 测试卡 4242 不会触发真实 Webhook
   - 解决：用真实卡测试$1 订单

### 📝 最佳实践

1. **环境变量管理**
   - 永远不要硬编码密钥
   - 使用 `.env.example` 模板

2. **错误处理**
   - 所有 API 调用加 try-catch
   - 详细日志记录

3. **类型安全**
   - TypeScript 严格模式
   - 接口定义完整

4. **文档更新**
   - 每次部署更新文档
   - 记录踩坑过程

---

## 下一步计划

### Q2 2026
- [ ] 多语言支持（英/日/韩）
- [ ] 推荐返利系统
- [ ] USDT 支付集成
- [ ] 订单管理后台

### Q3 2026
- [ ] AI 客服机器人
- [ ] 移动端 App（PWA）
- [ ] 数据分析看板
- [ ] A/B 测试框架

---

## 附录

### 关键链接
- **GitHub**: https://github.com/xilixixigrocoltd/esim-shop-v1.0
- **Vercel**: https://vercel.com/esimc12345/esim-shop-v1
- **Stripe**: https://dashboard.stripe.com/
- **Resend**: https://resend.com/

### 团队联系方式
- **邮箱**: support@simryoko.com
- **Telegram**: @Simryokoesimbot
- **公司**: Xigro Co Limited（香港）

---

**文档版本**: 1.0  
**最后更新**: 2026-03-19  
**维护者**: 龙虾 🦞
