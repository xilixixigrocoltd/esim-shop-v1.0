# Vercel 部署配置说明

## 📋 必须配置的环境变量

在 Vercel Dashboard → Project Settings → Environment Variables 中添加以下变量：

### 生产环境 (Production)

| 变量名 | 值 | 说明 |
|--------|-----|------|
| `B2B_API_URL` | `https://ciuh32wky.xigrocoltd.com/api` | B2B API 地址 |
| `B2B_API_TOKEN` | `eyJhbGci...` | B2B API Token（从登录接口获取） |
| `STRIPE_SECRET_KEY` | `sk_live_...` | Stripe Live Secret Key |
| `USDT_WALLET_ADDRESS` | `TBuhpRpFPV1HkdfaPEdxsKgTE43jV911rL` | USDT TRC-20 收款地址 |
| `RESEND_API_KEY` | `re_...` | Resend 邮件 API Key |
| `NEXT_PUBLIC_SITE_URL` | `https://esim-shop-v1.vercel.app` | 网站 URL |

### 预览环境 (Preview) - 可选

如需测试，可使用相同配置或测试环境值。

---

## 🚀 部署流程

### 自动部署（推荐）

代码推送到 `main` 分支后，Vercel 会自动触发构建和部署：

1. `git push origin main`
2. Vercel 自动构建
3. 等待 2-3 分钟
4. 访问 https://esim-shop-v1.vercel.app 验证

### 手动部署

```bash
# 安装 Vercel CLI
npm i -g vercel

# 登录
vercel login

# 部署到预览环境
vercel

# 部署到生产环境
vercel --prod
```

---

## ✅ 部署后验证清单

- [ ] 首页加载正常
- [ ] 国家列表页显示产品
- [ ] 产品详情页正常
- [ ] 购物车添加商品
- [ ] 结算页价格正确（显示零售价，非代理价）
- [ ] Stripe 支付流程正常
- [ ] USDT 支付显示钱包地址
- [ ] 成功页显示订单信息
- [ ] 收到确认邮件

---

## 🔧 故障排查

### 问题：产品页面 404

**原因**: B2B_API_TOKEN 未配置或过期

**解决**:
1. 检查 Vercel 环境变量是否配置
2. 重新登录 B2B API 获取新 token:
   ```bash
   curl -X POST "https://ciuh32wky.xigrocoltd.com/api/agent/login" \
     -H "Content-Type: application/json" \
     -d '{"username":"lx001","password":"123123"}'
   ```
3. 更新 Vercel 环境变量
4. 重新部署

### 问题：Stripe 支付失败

**原因**: STRIPE_SECRET_KEY 未配置

**解决**:
1. 从 Stripe Dashboard 获取 Secret Key
2. 添加到 Vercel 环境变量
3. 重新部署

### 问题：邮件未发送

**原因**: RESEND_API_KEY 未配置

**解决**:
1. 从 Resend Dashboard 获取 API Key
2. 添加到 Vercel 环境变量
3. 重新部署

---

## 📊 当前版本信息

- **Commit**: 最新 main 分支
- **构建**: Next.js 14.2.0
- **部署**: Vercel (自动)
- **域名**: https://esim-shop-v1.vercel.app

---

## 📝 更新历史

### 2026-03-18 - 核心功能修复
- ✅ 创建 success.tsx 页面
- ✅ 修复价格显示（零售价）
- ✅ 集成 Stripe 支付
- ✅ 集成 Resend 邮件
- ✅ 创建订单查询 API

### 2026-03-18 - 初始部署
- ✅ 项目创建
- ✅ Vercel 部署配置
- ✅ 基础页面完成
