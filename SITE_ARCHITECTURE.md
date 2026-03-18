# SimRyoko eSIM 商城 - 网站架构与 UI/UX 设计文档

**版本**: v1.0  
**更新日期**: 2026-03-18  
**产品基数**: 2,610 款 eSIM 产品  
**技术栈**: Next.js 14 + React + TypeScript + Tailwind CSS

---

## 📊 一、产品数据分析

### 1.1 数据结构（B2B API）

```typescript
interface Product {
  id: number;                    // 产品 ID
  name: string;                  // 中文名
  nameEn: string;                // 英文名
  description: string;           // 描述
  type: 'local' | 'regional' | 'global';  // 类型
  countries: Country[];          // 适用国家
  dataSize: number;              // 流量 (MB)
  validDays: number;             // 有效期 (天)
  price: string;                 // 售价 ($)
  agentPrice: string;            // 代理价 ($)
  stock: number;                 // 库存
  features: string[];            // 特性列表
  image: string;                 // 主图
  thirdPartyId: string;          // 第三方 ID
}
```

### 1.2 产品分类统计

| 维度 | 分类 | 数量 | 占比 |
|------|------|------|------|
| **类型** | Local (单国) | ~1,800 | 69% |
| | Regional (区域) | ~600 | 23% |
| | Global (全球) | ~210 | 8% |
| **流量** | 1GB 以下 | ~400 | 15% |
| | 1-3GB | ~800 | 31% |
| | 3-10GB | ~900 | 34% |
| | 10GB+ | ~510 | 20% |
| **有效期** | 1-7 天 | ~700 | 27% |
| | 8-15 天 | ~600 | 23% |
| | 16-30 天 | ~800 | 31% |
| | 30 天+ | ~510 | 19% |
| **价格** | $0-5 | ~300 | 11% |
| | $5-10 | ~800 | 31% |
| | $10-20 | ~900 | 34% |
| | $20+ | ~610 | 24% |

### 1.3 热门国家/地区

| 排名 | 国家/地区 | 产品数 | 需求热度 |
|------|----------|--------|---------|
| 1 | 🇯🇵 日本 | 180+ | ⭐⭐⭐⭐⭐ |
| 2 | 🇰🇷 韩国 | 150+ | ⭐⭐⭐⭐⭐ |
| 3 | 🇺🇸 美国 | 140+ | ⭐⭐⭐⭐⭐ |
| 4 | 🇪🇺 欧洲 | 200+ | ⭐⭐⭐⭐ |
| 5 | 🇹🇭 泰国 | 120+ | ⭐⭐⭐⭐ |
| 6 | 🇸🇬 新加坡 | 100+ | ⭐⭐⭐⭐ |
| 7 | 🇦🇺 澳大利亚 | 90+ | ⭐⭐⭐ |
| 8 | 🇦🇪 阿联酋 | 80+ | ⭐⭐⭐ |
| 9 | 🇮🇳 印度 | 75+ | ⭐⭐⭐ |
| 10 | 🇨🇳 中国 | 70+ | ⭐⭐⭐ |

---

## 🏗️ 二、网站架构设计

### 2.1 站点地图 (Sitemap)

```
SimRyoko eSIM 商城
├── 🏠 首页 (/)
│   ├── Hero 区域（搜索框 + 核心价值）
│   ├── 热门国家快捷入口
│   ├── 产品类型展示（单国/区域/全球）
│   ├── 热销产品推荐
│   └── 用户评价/信任背书
│
├── 🌍 国家列表 (/countries)
│   ├── 按字母排序
│   ├── 按区域筛选（亚洲/欧洲/美洲等）
│   └── 搜索功能
│
├── 🇯🇵 国家页面 (/country/[code])
│   ├── 国家旗帜 + 基本信息
│   ├── 产品筛选（流量/天数/价格）
│   ├── 产品列表（网格展示）
│   └── 常见问题（该国 eSIM 使用）
│
├── 📦 产品详情 (/product/[id])
│   ├── 产品图片 + 名称
│   ├── 核心参数（流量/天数/价格）
│   ├── 适用国家
│   ├── 产品特性
│   ├── 使用说明
│   └── 加入购物车/立即购买
│
├── 🛒 购物车 (/cart)
│   ├── 已选产品列表
│   ├── 数量调整
│   ├── 总价计算
│   └── 结算按钮
│
├── 💳 结算页 (/checkout)
│   ├── 订单摘要
│   ├── 邮箱输入（接收 eSIM）
│   ├── 支付方式选择（Stripe/USDT）
│   └── 支付流程
│
├── ✅ 成功页 (/success)
│   ├── 订单号
│   ├── eSIM 二维码/激活码
│   ├── 安装指南
│   └── 下载 PDF
│
├── ❓ 帮助中心 (/help)
│   ├── eSIM 安装教程
│   ├── 常见问题 FAQ
│   ├── 联系客服
│   └── 订单查询
│
└── 🔧 API 路由
    ├── /api/products - 产品列表
    ├── /api/products/[id] - 产品详情
    ├── /api/payment/create - 创建支付
    └── /api/orders - 订单查询
```

### 2.2 页面路由结构

```
pages/
├── _app.tsx              # 全局布局
├── index.tsx             # 首页
├── countries.tsx         # 国家列表
├── cart.tsx              # 购物车
├── checkout.tsx          # 结算页
├── help.tsx              # 帮助中心
├── success.tsx           # 成功页（新增）
├── country/
│   └── [code].tsx        # 国家详情页
├── product/
│   └── [id].tsx          # 产品详情页
└── api/
    ├── products/
    │   ├── index.ts      # 产品列表 API
    │   └── [id].ts       # 产品详情 API
    ├── payment/
    │   └── create.ts     # 支付创建 API
    └── orders/
        └── index.ts      # 订单 API
```

---

## 🎨 三、UI/UX 设计规范

### 3.1 设计原则

1. **简洁直观** - 3 步完成购买（选产品→填邮箱→支付）
2. **移动优先** - 响应式设计，手机/平板/桌面自适应
3. **信任感** - 专业配色、清晰信息、安全标识
4. **快速加载** - 图片优化、懒加载、CDN 加速

### 3.2 配色方案

```typescript
// 主色调
const colors = {
  primary: '#2563EB',      // 蓝色 - 信任/专业
  primaryDark: '#1D4ED8',  // 深蓝 - hover 状态
  primaryLight: '#3B82F6', // 浅蓝 - 背景
  
  // 辅助色
  success: '#10B981',      // 绿色 - 成功/安全
  warning: '#F59E0B',      // 橙色 - 提醒
  danger: '#EF4444',       // 红色 - 错误/警告
  
  // 中性色
  gray50: '#F9FAFB',       // 最浅灰 - 背景
  gray100: '#F3F4F6',      // 浅灰 - 卡片背景
  gray200: '#E5E7EB',      // 边框
  gray300: '#D1D5DB',      // 分割线
  gray400: '#9CA3AF',      // 次要文字
  gray500: '#6B7280',      // 普通文字
  gray600: '#4B5563',      // 标题
  gray700: '#374151',      // 主文字
  gray800: '#1F2937',      // 深文字
  gray900: '#111827',      // 最深
  
  // 功能色
  white: '#FFFFFF',
  black: '#000000',
}
```

### 3.3 字体规范

```typescript
const typography = {
  fontFamily: {
    sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
    heading: ['Inter', 'system-ui', 'sans-serif'],
  },
  
  fontSize: {
    xs: '0.75rem',     // 12px - 辅助文字
    sm: '0.875rem',    // 14px - 小字
    base: '1rem',      // 16px - 正文
    lg: '1.125rem',    // 18px - 大正文
    xl: '1.25rem',     // 20px - 小标题
    '2xl': '1.5rem',   // 24px - 中标题
    '3xl': '1.875rem', // 30px - 大标题
    '4xl': '2.25rem',  // 36px - 超大标题
  },
  
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
}
```

### 3.4 组件库

#### 按钮 (Button)
```typescript
// 主要按钮 - 用于 CTA
<button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors">
  立即购买
</button>

// 次要按钮 - 用于次要操作
<button className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-6 rounded-lg transition-colors">
  加入购物车
</button>

// 文字按钮 - 用于链接
<button className="text-blue-600 hover:text-blue-700 font-medium">
  查看详情 →
</button>
```

#### 卡片 (Card)
```typescript
// 产品卡片
<div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
  <img src={product.image} alt={product.name} className="w-full h-48 object-cover" />
  <div className="p-4">
    <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
    <p className="text-sm text-gray-500 mt-1">{product.description}</p>
    <div className="flex items-center justify-between mt-4">
      <span className="text-2xl font-bold text-blue-600">${product.price}</span>
      <button className="bg-blue-600 text-white px-4 py-2 rounded-lg">
        购买
      </button>
    </div>
  </div>
</div>
```

#### 输入框 (Input)
```typescript
<input
  type="email"
  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
  placeholder="请输入邮箱地址"
/>
```

#### 徽章 (Badge)
```typescript
// 热门产品
<span className="inline-block bg-red-100 text-red-600 text-xs font-medium px-2.5 py-0.5 rounded">
  🔥 热销
</span>

// 推荐产品
<span className="inline-block bg-green-100 text-green-600 text-xs font-medium px-2.5 py-0.5 rounded">
  ⭐ 推荐
</span>
```

### 3.5 布局规范

#### 首页布局
```
┌─────────────────────────────────────────┐
│           Header (Logo + Nav)           │
├─────────────────────────────────────────┤
│                                         │
│           Hero Section                  │
│     (标题 + 搜索框 + CTA 按钮)            │
│                                         │
├─────────────────────────────────────────┤
│                                         │
│      Popular Countries (网格 6-8 个)      │
│                                         │
├─────────────────────────────────────────┤
│                                         │
│      Product Types (3 列布局)            │
│      单国 | 区域 | 全球                  │
│                                         │
├─────────────────────────────────────────┤
│                                         │
│      Featured Products (网格 4-6 个)      │
│                                         │
├─────────────────────────────────────────┤
│           Footer (Links + Info)         │
└─────────────────────────────────────────┘
```

#### 国家页面布局
```
┌─────────────────────────────────────────┐
│           Header                        │
├─────────────────────────────────────────┤
│  🇯🇵 日本 eSIM                           │
│  Japan eSIM                             │
│  (旗帜 + 标题 + 简短介绍)                │
├─────────────────────────────────────────┤
│  筛选器：                                │
│  [流量▼] [天数▼] [价格▼] [搜索🔍]       │
├─────────────────────────────────────────┤
│  ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐      │
│  │产品 1│ │产品 2│ │产品 3│ │产品 4│      │
│  └─────┘ └─────┘ └─────┘ └─────┘      │
│  ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐      │
│  │产品 5│ │产品 6│ │产品 7│ │产品 8│      │
│  └─────┘ └─────┘ └─────┘ └─────┘      │
│  (产品网格 - 响应式 2-4 列)               │
├─────────────────────────────────────────┤
│  FAQ - 日本 eSIM 常见问题                │
├─────────────────────────────────────────┤
│           Footer                        │
└─────────────────────────────────────────┘
```

### 3.6 响应式断点

```typescript
const breakpoints = {
  sm: '640px',   // 手机横屏
  md: '768px',   // 平板
  lg: '1024px',  // 小桌面
  xl: '1280px',  // 桌面
  '2xl': '1536px', // 大桌面
}

// 网格列数
const gridColumns = {
  default: 1,    // 手机
  md: 2,         // 平板
  lg: 3,         // 小桌面
  xl: 4,         // 桌面
}
```

---

## 🔧 四、核心功能实现

### 4.1 产品筛选系统

```typescript
// 筛选条件
interface FilterOptions {
  countries?: string[];      // 国家代码
  type?: 'local' | 'regional' | 'global';
  dataSizeMin?: number;      // 最小流量 (MB)
  dataSizeMax?: number;      // 最大流量 (MB)
  validDaysMin?: number;     // 最小天数
  validDaysMax?: number;     // 最大天数
  priceMin?: number;         // 最低价格
  priceMax?: number;         // 最高价格
  search?: string;           // 搜索关键词
  sortBy?: 'price_asc' | 'price_desc' | 'popular' | 'newest';
}

// API 调用示例
const fetchProducts = async (filters: FilterOptions) => {
  const params = new URLSearchParams({
    page: '1',
    pageSize: '50',
    ...filters,
  });
  
  const res = await fetch(`/api/products?${params}`);
  return res.json();
};
```

### 4.2 购物车状态管理

```typescript
// 购物车项
interface CartItem {
  productId: number;
  quantity: number;
  product: Product;
}

// 购物车上下文
interface CartContext {
  items: CartItem[];
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  total: number;
  itemCount: number;
}
```

### 4.3 支付流程

```typescript
// 支付创建
const createPayment = async (orderData: {
  email: string;
  items: CartItem[];
  paymentMethod: 'stripe' | 'usdt';
}) => {
  const res = await fetch('/api/payment/create', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(orderData),
  });
  return res.json();
};

// Stripe 支付
if (paymentMethod === 'stripe') {
  const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PK!);
  await stripe!.redirectToCheckout({ sessionId: payment.sessionId });
}

// USDT 支付
if (paymentMethod === 'usdt') {
  // 显示 USDT 地址和金额
  // 监听链上转账
}
```

### 4.4 订单处理

```typescript
// 订单创建后
const handleOrderSuccess = async (orderId: string) => {
  // 1. 调用 B2B API 下单
  const order = await b2bApi.placeOrder({
    productId: cartItem.productId,
    quantity: cartItem.quantity,
  });
  
  // 2. 获取 eSIM 信息
  const esimInfo = {
    iccid: order.esimIccid,
    qrCode: order.esimQrCode,
    activationCode: order.esimActivationCode,
  };
  
  // 3. 发送确认邮件（Resend API）
  await sendEmail({
    to: customerEmail,
    template: 'order-confirmation',
    data: { orderId, esimInfo },
  });
  
  // 4. 跳转到成功页
  router.push(`/success?orderId=${orderId}`);
};
```

---

## 📱 五、移动端优化

### 5.1 触摸友好设计

- 按钮最小尺寸：44x44px
- 输入框高度：≥48px
- 卡片间距：≥16px
- 避免 hover 依赖（移动端无 hover）

### 5.2 性能优化

```typescript
// 图片懒加载
<img
  src={product.image}
  alt={product.name}
  loading="lazy"
  className="w-full h-48 object-cover"
/>

// 组件懒加载
const ProductList = dynamic(() => import('../components/products/ProductList'), {
  loading: () => <ProductSkeleton />,
});

// 虚拟滚动（长列表）
import { FixedSizeList } from 'react-window';
```

### 5.3 PWA 支持

```typescript
// next.config.js
const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
});

module.exports = withPWA({
  // Next.js config
});
```

---

## 🔒 六、安全与合规

### 6.1 安全措施

- HTTPS 强制（HSTS）
- CSRF 保护
- XSS 防护（React 默认转义）
- 速率限制（API 调用）
- 敏感信息加密存储

### 6.2 隐私合规

- GDPR 合规（欧盟用户）
- 隐私政策页面
- Cookie 同意横幅
- 数据删除请求支持

---

## 📈 七、SEO 优化

### 7.1 页面元数据

```typescript
// pages/country/[code].tsx
export async function getStaticProps({ params }) {
  const country = getCountryByCode(params.code);
  
  return {
    props: {
      country,
      meta: {
        title: `${country.name} eSIM - 无限流量 | SimRyoko`,
        description: `购买${country.name} eSIM，立即激活，无需实体 SIM 卡。${country.productCount}款套餐可选，价格从$${country.minPrice}起。`,
        keywords: `${country.name} eSIM, ${country.name} 上网卡，${country.name} 流量卡`,
        ogImage: `/api/og/country/${params.code}`,
      },
    },
  };
}
```

### 7.2 结构化数据

```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "日本 3GB/7天 eSIM",
  "description": "日本专用 eSIM，3GB 流量，7 天有效期",
  "brand": {
    "@type": "Brand",
    "name": "SimRyoko"
  },
  "offers": {
    "@type": "Offer",
    "price": "12.50",
    "priceCurrency": "USD",
    "availability": "https://schema.org/InStock"
  }
}
```

### 7.3 站点地图

- 自动生成 `sitemap.xml`
- 提交到 Google Search Console
- 每周更新（新增产品自动收录）

---

## 🚀 八、开发路线图

### Phase 1 - 基础功能（已完成 ✅）
- [x] 项目初始化
- [x] 基础组件库
- [x] 首页/国家页/产品页
- [x] 购物车/结算流程
- [x] B2B API 对接

### Phase 2 - 支付集成（进行中 🔄）
- [ ] Stripe 支付完成
- [ ] USDT 支付完成
- [ ] 订单邮件发送
- [ ] 成功页 eSIM 展示

### Phase 3 - 优化增强（待开发 📋）
- [ ] 用户账户系统
- [ ] 订单历史查询
- [ ] 推荐系统（基于浏览历史）
- [ ] 多语言支持（中/英/日/韩）
- [ ] 评价系统

### Phase 4 - 营销工具（待开发 📋）
- [ ] 优惠券系统
- [ ] 推荐返利
- [ ] 邮件营销
- [ ] 数据分析（GA4）

---

## 📊 九、性能指标目标

| 指标 | 目标值 | 测量工具 |
|------|--------|---------|
| LCP (最大内容绘制) | < 2.5s | PageSpeed Insights |
| FID (首次输入延迟) | < 100ms | PageSpeed Insights |
| CLS (累积布局偏移) | < 0.1 | PageSpeed Insights |
| TTI (可交互时间) | < 3.8s | Lighthouse |
| 首屏加载 | < 2s | WebPageTest |
| 完全加载 | < 5s | WebPageTest |

---

## 🧩 十、技术债务清单

| 问题 | 严重性 | 解决方案 |
|------|--------|---------|
| 产品页 404 | 高 | 检查路由配置 |
| Resend 未配置 | 中 | 添加 API Key |
| 无错误边界 | 中 | 添加 React Error Boundary |
| 无加载状态 | 低 | 添加 Skeleton 组件 |
| 无单元测试 | 低 | 添加 Jest 测试 |

---

**文档维护**: 每次重大更新后同步更新此文档  
**最后更新**: 2026-03-18  
**负责人**: 龙虾 (AI Team Leader)
