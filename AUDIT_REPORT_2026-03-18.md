# eSIM Shop 遗留问题与优化建议

**检查时间**: 2026-03-18 23:35 CST  
**检查范围**: 代码库、API 端点、首页内容、历史遗留文件

---

## 🚨 遗留问题（需清理）

### 1. 测试文件（3 个）

| 文件 | 用途 | 状态 | 建议 |
|------|------|------|------|
| `pages/api/test-all-products.ts` | 测试产品 API | ❌ 未使用 | 删除 |
| `pages/api/test-countries.ts` | 测试国家 API | ❌ 未使用 | 删除 |
| `pages/api/test-new-api.ts` | 测试新 API | ❌ 未使用 | 删除 |

**影响**: 无功能影响，但占用 API 函数数量（Vercel Hobby 限制 12 个）

---

### 2. 调试文件（1 个）

| 文件 | 用途 | 状态 | 建议 |
|------|------|------|------|
| `pages/api/debug.ts` | 环境调试 | ❌ 未使用 | 删除或禁用 |

**风险**: 可能泄露环境配置信息

---

### 3. 废弃 API（2 个）

| 文件 | 替代方案 | 状态 | 建议 |
|------|----------|------|------|
| `pages/api/payment/stripe.ts` | `/api/payment/create` | ❌ 已废弃 | 删除 |
| `pages/api/orders/index.ts` | Webhook 自动创建 | ⚠️ 可能使用 | 检查后删除 |

**说明**: 
- `stripe.ts` 是旧支付流程（先订单后支付），已被 `create.ts` 替代
- `orders/index.ts` 用于手动创建订单，现在通过 Webhook 自动创建

---

### 4. 未使用组件检查

| 组件 | 状态 | 建议 |
|------|------|------|
| `components/ui/Layout.tsx` | ✅ 使用中 | 保留 |
| `components/ui/Header.tsx` | ✅ 使用中 | 保留 |
| `components/ui/Footer.tsx` | ✅ 使用中 | 保留 |

---

## 📄 首页内容优化建议

### 当前首页结构

```
HeroSection（英雄区）
├── 标题 + 搜索框
├── CTA 按钮（立即选购/了解更多）
└── 热门目的地快捷链接

ProductTypes（套餐类型）
├── 本地套餐（2552 款）
├── 区域套餐（134 款）
└── 全球套餐（34 款）

PopularCountries（热门国家）
└── 8 个亚洲国家/地区
```

### 缺失内容

| 模块 | 优先级 | 说明 |
|------|--------|------|
| **用户评价** | 🔴 高 | 增加信任感，展示真实用户反馈 |
| **安装教程入口** | 🔴 高 | eSIM 安装指南，降低使用门槛 |
| **支付方式展示** | 🟡 中 | Stripe/支付宝/Apple Pay/Google Pay 标识 |
| **优势对比** | 🟡 中 | 相比传统 SIM 卡的优势 |
| **常见问题 FAQ** | 🟡 中 | 回答常见问题，减少客服压力 |
| **信任标识** | 🟡 中 | 安全认证、退款政策 |
| **更多热门区域** | 🟢 低 | 欧洲、美洲等热门区域 |
| **特价/促销产品** | 🟢 低 | 展示优惠产品吸引用户 |

---

## 🔗 连接节点检查

### API 端点状态

| 端点 | 状态 | 响应时间 | 数据量 |
|------|------|----------|--------|
| `/api/countries` | ✅ 正常 | 4.5s | 123 国 |
| `/api/products` | ✅ 正常 | 1.4s | 分页 |
| `/api/products/popular` | ✅ 正常 | 4.2s | 69 款 |
| `/api/products/regional` | ✅ 正常 | 7.4s | 134 款 |
| `/api/products/global` | ✅ 正常 | 7.3s | 34 款 |
| `/api/payment/create` | ✅ 正常 | <1s | - |
| `/api/payment/webhook` | ✅ 正常 | <1s | - |

### 外部依赖

| 服务 | 状态 | 用途 |
|------|------|------|
| Stripe | ✅ Live 模式 | 支付处理 |
| B2B API | ✅ 正常 | 产品/订单 |
| Resend | ✅ 正常 | 邮件发送 |
| Vercel | ✅ 正常 | 部署/托管 |

---

## 🛠️ 优化建议

### 短期（本周）

1. **清理遗留文件**
   ```bash
   rm pages/api/test-*.ts
   rm pages/api/debug.ts
   rm pages/api/payment/stripe.ts
   rm pages/api/orders/index.ts  # 确认未使用后
   ```

2. **首页增加模块**
   - 用户评价（3-5 条）
   - 安装教程入口
   - 支付方式展示

3. **性能优化**
   - 区域/全球 API 增加缓存（10 分钟）
   - 产品图片使用 CDN

### 中期（本月）

1. **首页重构**
   - 增加 FAQ 模块
   - 增加优势对比
   - 增加信任标识

2. **SEO 优化**
   - 添加 meta 描述
   - 添加结构化数据
   - 优化页面加载速度

3. **Analytics 集成**
   - Google Analytics 4
   - 转化追踪
   - 用户行为分析

---

## 📋 清理清单

### 文件删除

- [ ] `pages/api/test-all-products.ts`
- [ ] `pages/api/test-countries.ts`
- [ ] `pages/api/test-new-api.ts`
- [ ] `pages/api/debug.ts`
- [ ] `pages/api/payment/stripe.ts`
- [ ] `pages/api/orders/index.ts`（确认未使用后）

### 首页新增

- [ ] 用户评价模块
- [ ] 安装教程入口
- [ ] 支付方式展示
- [ ] FAQ 模块
- [ ] 信任标识

### 性能优化

- [ ] API 缓存（区域/全球）
- [ ] 图片 CDN
- [ ] 懒加载优化

---

## 结论

**核心功能**: ✅ 正常  
**遗留问题**: 6 个文件待清理  
**首页内容**: ⚠️ 需要丰富（缺少评价、教程、FAQ）  
**外部依赖**: ✅ 全部正常

**建议优先级**:
1. 🔴 清理遗留文件（减少 API 函数占用）
2. 🔴 增加安装教程入口（降低使用门槛）
3. 🟡 增加用户评价（增加信任）
4. 🟡 性能优化（API 缓存）

---

**检查人**: 龙虾 🦞  
**检查时间**: 2026-03-18 23:35 CST
