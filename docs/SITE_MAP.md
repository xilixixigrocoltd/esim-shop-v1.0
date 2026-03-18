# SimRyoko eSIM Shop - 完整网站思维导图

## 📁 项目结构总览

```
esim-shop-v1.0-github/
├── pages/                    # 页面路由 (Pages Router)
├── components/               # UI 组件
├── lib/                      # 工具库
├── types/                    # TypeScript 类型定义
└── public/                   # 静态资源
```

---

## 🗺️ 页面路由地图

### 1️⃣ 首页 `/` (pages/index.tsx)
```
/ (首页)
├─ 组件: HeroSection, HowItWorks, TrustBadges, Testimonials, PaymentMethods, FAQ
├─ API 调用: 无（纯静态展示）
├─ 链接跳转:
│  ├─ /products?tab=all → 全部产品
│  ├─ /products?search=xxx → 搜索结果
│  ├─ /products?tab=popular&country=JP → 热门国家
│  ├─ /help → 帮助页面
│  └─ /countries → 国家列表
└─ 功能: 搜索框（跳转 /products?search=xxx）
```

### 2️⃣ 产品列表页 `/products` (pages/products.tsx)
```
/products
├─ URL 参数:
│  ├─ tab: all | popular | regional | global
│  ├─ country: 国家代码 (JP, US, CN...)
│  ├─ region: 大洲 ID (asia, europe...)
│  ├─ planType: data-only | data-voice-sms
│  └─ search: 搜索关键词
│
├─ 视图模式:
│  ├─ list: 全部产品列表
│  ├─ country: 选择国家 → /products?country=JP
│  ├─ region: 选择大洲 → /products?region=asia
│  └─ plan-type: 选择套餐类型
│
├─ API 调用:
│  ├─ /api/products?page=1&pageSize=50 (全部产品)
│  ├─ /api/products/by-country/[code] (指定国家)
│  ├─ /api/products/region/[id] (区域套餐)
│  ├─ /api/products/plan-type/[type] (套餐类型)
│  ├─ /api/products/popular-countries (热门国家)
│  ├─ /api/products/regional (区域套餐列表)
│  └─ /api/products/global (全球套餐列表)
│
└─ 链接跳转:
   └─ /product/[id] → 产品详情页
```

### 3️⃣ 产品详情页 `/product/[id]` (pages/product/[id].tsx)
```
/product/[id]
├─ 组件: ProductDetail
├─ API 调用:
│  ├─ /api/products/[id] → 获取产品详情
│  └─ /api/countries → 获取国家列表
├─ 功能:
│  ├─ 显示产品信息
│  ├─ 选择流量/天数
│  ├─ 加入购物车
│  └─ 立即购买
└─ 链接跳转:
   ├─ /cart → 购物车
   └─ /checkout → 结账页
```

### 4️⃣ 购物车页 `/cart` (pages/cart.tsx)
```
/cart
├─ 组件: CartPage
├─ 数据来源: localStorage (购物车数据)
├─ 功能:
│  ├─ 显示购物车商品
│  ├─ 修改数量
│  ├─ 删除商品
│  └─ 结算
└─ 链接跳转:
   └─ /checkout → 结账页
```

### 5️⃣ 结账页 `/checkout` (pages/checkout.tsx)
```
/checkout
├─ 组件: CheckoutPage
├─ API 调用:
│  └─ /api/payment/create → 创建 Stripe 支付会话
├─ 功能:
│  ├─ 填写邮箱
│  ├─ 显示订单摘要
│  └─ 跳转 Stripe Checkout
└─ 链接跳转:
   └─ checkout.stripe.com → Stripe 支付页面
```

### 6️⃣ 成功页 `/success` (pages/success.tsx)
```
/success
├─ 组件: SuccessPage
├─ URL 参数: session_id (Stripe Session ID)
├─ API 调用:
│  └─ /api/payment/status?session_id=xxx → 获取订单状态
├─ 功能:
│  ├─ 显示订单详情
│  ├─ 显示 eSIM ICCID
│  └─ 显示安装步骤
└─ 链接跳转:
   └─ /help → 安装教程
```

### 7️⃣ 国家列表页 `/countries` (pages/countries.tsx)
```
/countries
├─ 组件: CountryList
├─ URL 参数:
│  └─ q: 搜索关键词
├─ API 调用:
│  └─ /api/countries → 获取所有国家（含产品数量）
├─ 功能:
│  ├─ 显示所有国家
│  ├─ 搜索过滤
│  └─ 按大洲筛选
└─ 链接跳转:
   └─ /country/[code] → 国家产品页
```

### 8️⃣ 国家产品页 `/country/[code]` (pages/country/[code].tsx)
```
/country/[code]
├─ 组件: ProductList
├─ API 调用:
│  └─ /api/products/by-country/[code] → 获取该国产品
├─ 功能:
│  └─ 显示指定国家的所有产品
└─ 链接跳转:
   └─ /product/[id] → 产品详情页
```

### 9️⃣ 帮助页 `/help` (pages/help.tsx)
```
/help
├─ 功能:
│  ├─ eSIM 安装教程
│  ├─ 常见问题
│  └─ 客服联系方式
└─ 链接跳转:
   └─ https://t.me/Simryokoesimbot → Telegram 客服
```

---

## 🔌 API 端点地图

### 产品相关 API
```
/api/products
├─ GET /api/products?page=1&pageSize=50
│  └─ 功能: 获取产品列表（分页）
│  └─ 返回: {success, data: Product[], pagination}
│
├─ GET /api/products/[id]
│  └─ 功能: 获取单个产品详情
│  └─ 返回: {success, data: Product}
│
├─ GET /api/products/by-country/[code]
│  ├─ 逻辑: 遍历 28 页产品 → 筛选指定国家
│  └─ 返回: {success, data: Product[]}
│
├─ GET /api/products/region/[id]
│  ├─ 逻辑: 获取大洲内所有国家的产品
│  └─ 返回: {success, data: Product[]}
│
├─ GET /api/products/plan-type/[type]
│  ├─ 逻辑: 按套餐类型筛选（纯数据/数据 + 语音）
│  └─ 返回: {success, data: Product[]}
│
├─ GET /api/products/popular-countries
│  └─ 功能: 获取热门国家产品
│
├─ GET /api/products/regional
│  └─ 功能: 获取区域套餐列表
│
└─ GET /api/products/global
   └─ 功能: 获取全球套餐列表
```

### 国家相关 API
```
/api/countries
├─ 逻辑: 遍历 28 页产品 → 统计每个国家的产品数量
├─ 返回: {success, data: CountryWithProducts[]}
└─ 数据: 123 个国家，含产品数量
```

### 支付相关 API
```
/api/payment
├─ POST /api/payment/create
│  ├─ 输入: {items, email}
│  ├─ 功能: 创建 Stripe Checkout Session
│  └─ 返回: {url: Stripe Checkout URL}
│
├─ POST /api/payment/webhook
│  ├─ 事件: checkout.session.completed
│  ├─ 功能: 创建 B2B 订单 → 发送邮件
│  └─ 返回: 200 OK
│
└─ GET /api/payment/status?session_id=xxx
   ├─ 功能: 根据 Stripe Session 获取订单状态
   └─ 返回: {success, data: OrderDetails}
```

---

## 🧩 组件依赖关系

### 布局组件
```
Layout (components/ui/Layout.tsx)
├─ Header (components/ui/Header.tsx)
│  ├─ LanguageSwitcher (components/ui/LanguageSwitcher.tsx)
│  └─ 导航链接: /, /products, /countries, /cart, /help
│
└─ Footer (components/ui/Footer.tsx)
   └─ 链接: 快速导航/客服/支付方式
```

### 首页组件
```
HeroSection → 搜索框 + 热门国家标签 + CTA 按钮
ProductTypes → 本地/区域/全球套餐卡片 (已删除)
PopularCountries → 热门目的地卡片网格 (已删除)
HowItWorks → 3 步安装教程
Testimonials → 用户评价
PaymentMethods → 支付方式展示
TrustBadges → 信任标识
FAQ → 常见问题
```

### 产品组件
```
ProductCard → 产品卡片（列表/网格）
ProductList → 产品列表容器
ProductDetail → 产品详情页（流量/天数选择）
```

### 购物车/结账组件
```
CartPage → 购物车页面
CheckoutPage → 结账页面
SuccessPage → 支付成功页面
```

### 国家组件
```
CountryList → 国家列表（搜索/筛选）
```

---

## 🔗 用户流程

### 购买流程
```
1. 首页 (/) 
   ↓ 搜索/浏览
2. 产品列表 (/products)
   ↓ 选择产品
3. 产品详情 (/product/[id])
   ↓ 加入购物车/立即购买
4. 购物车 (/cart)
   ↓ 结算
5. 结账页 (/checkout)
   ↓ 创建支付
6. Stripe Checkout (checkout.stripe.com)
   ↓ 支付成功
7. 成功页 (/success)
   ↓ 显示 eSIM ICCID
8. 邮件接收 → 安装 eSIM
```

### 支付回调流程
```
Stripe 支付成功
  ↓ webhook
/api/payment/webhook
  ↓ 创建 B2B 订单
B2B API POST /agent/orders
  ↓ 获取 ICCID
发送订单邮件 (Resend API)
  ↓
用户收到 eSIM
```

---

## 📦 数据流

### 前端 → 后端 → B2B API
```
用户下单
  ↓
POST /api/payment/create
  ↓
Stripe Checkout
  ↓ (支付成功)
POST /api/payment/webhook
  ↓
POST https://api.xigrocoltd.com/agent/orders
  ↓ (HMAC-SHA256 签名)
返回 ICCID
  ↓
发送订单邮件
```

### 产品数据流
```
B2B API (2720 产品)
  ↓
/api/products (缓存 10 分钟)
  ↓
前端 ProductCard 展示
```

---

## 🌐 i18n 支持

### 翻译文件: lib/i18n.ts
```
支持语言: zh (中文), en (英文)
翻译键: 70+ 个
覆盖范围:
  - 导航 (5)
  - 首页 Hero (8)
  - 套餐类型 (8)
  - 热门目的地 (3)
  - 使用步骤 (10)
  - 用户评价 (26)
  - 通用 (10)
```

### 语言切换
```
LanguageSwitcher
  ↓
I18nProvider (React Context)
  ↓
localStorage 持久化
  ↓
useI18n() Hook
```

---

## 🔐 安全机制

### API 签名 (B2B)
```
签名算法: HMAC-SHA256
签名顺序: method + endpoint + body + timestamp + nonce
Nonce 长度: 20+ 字符
Timestamp: 毫秒级
```

### 支付安全
```
1. Stripe 先支付 → 2. Webhook 确认 → 3. 创建 B2B 订单
避免未付款即发货
```

---

## 📊 性能优化

### 缓存策略
```
/api/* → Cache-Control: public, s-maxage=600 (10 分钟)
```

### 分页加载
```
产品列表: 50 个/页
搜索: 28 页全部获取 (2720 个)
```

---

## 🎯 代码一致性检查

### ✅ 一致的部分
1. **路由命名**: 全部使用 Pages Router (`pages/*.tsx`)
2. **API 前缀**: 全部 `/api/*`
3. **组件命名**: PascalCase, 语义化
4. **响应格式**: `{success, data, error}` 统一
5. **i18n 结构**: `模块.功能.内容` 命名规范

### ⚠️ 潜在问题
1. **搜索性能**: 每次搜索获取 28 页产品（可优化为后端搜索）
2. **重复组件**: ProductTypes/PopularCountries 已删除但文件还在
3. **类型定义**: 部分组件使用 `any`，应使用 `Product` 类型

---

## 📝 待办事项

- [ ] 清理未使用的组件文件 (ProductTypes.tsx, PopularCountries.tsx)
- [ ] 优化搜索 API（后端过滤替代前端）
- [ ] 添加产品详情页 i18n 支持
- [ ] 添加购物车/结账页 i18n 支持
- [ ] 添加成功页 i18n 支持

---

**生成时间**: 2026-03-19 02:30 AM (Asia/Shanghai)
**项目版本**: esim-shop-v1.0
**生产地址**: https://esim-shop-v1.vercel.app
