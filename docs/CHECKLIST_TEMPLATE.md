# 🔍 项目整体排查流程标准模板

**版本**: 1.0  
**创建时间**: 2026-03-19  
**适用范围**: Next.js + TypeScript + Prisma + Vercel 项目  
**预计耗时**: 30-60 分钟（深度排查）

---

## 📋 排查前准备

### 1. 环境检查
```bash
# 确认工作目录
pwd

# 确认项目根目录
ls -la

# 确认 Node.js 版本
node -v

# 确认 npm 版本
npm -v
```

### 2. Git 状态检查
```bash
# 检查分支
git branch

# 检查状态
git status

# 检查最新提交
git log --oneline -5
```

### 3. 依赖检查
```bash
# 检查 node_modules
ls -la node_modules | head -10

# 检查 package.json
cat package.json | grep -E '"next"|"react"|"prisma"'
```

---

## 🔍 第一阶段：项目结构排查（5 分钟）

### 1.1 核心目录检查

| 目录 | 必须存在 | 说明 |
|------|---------|------|
| `pages/` | ✅ | Next.js 页面 |
| `components/` | ✅ | React 组件 |
| `lib/` | ✅ | 工具函数 |
| `public/` | ✅ | 静态资源 |
| `prisma/` | ✅ | 数据库 Schema |
| `styles/` | ✅ | 全局样式 |
| `types/` | ✅ | TypeScript 类型 |

**检查命令**:
```bash
ls -la pages/ components/ lib/ public/ prisma/ styles/ types/
```

### 1.2 核心文件检查

| 文件 | 必须存在 | 说明 |
|------|---------|------|
| `package.json` | ✅ | 依赖配置 |
| `tsconfig.json` | ✅ | TypeScript 配置 |
| `next.config.js` | ✅ | Next.js 配置 |
| `tailwind.config.ts` | ✅ | Tailwind 配置 |
| `.gitignore` | ✅ | Git 忽略规则 |
| `.env.example` | ✅ | 环境变量模板 |

**检查命令**:
```bash
ls -la package.json tsconfig.json next.config.js tailwind.config.ts .gitignore .env.example
```

### 1.3 垃圾文件检查

**检查是否存在**:
```bash
# 备份文件
find . -name "*.bak" -o -name "*.old" -o -name "*.backup" | grep -v node_modules

# 临时文件
find . -name "*.tmp" -o -name "*.temp" | grep -v node_modules

# 旧项目目录
ls -la | grep -E "old|backup|archive|v[0-9]"
```

**标准**: 无垃圾文件

---

## 🔍 第二阶段：代码质量排查（10 分钟）

### 2.1 TypeScript 类型检查

**检查命令**:
```bash
npx tsc --noEmit
```

**标准**: 无类型错误

### 2.2 TODO/FIXME 标记检查

**检查命令**:
```bash
grep -r "TODO\|FIXME\|XXX\|HACK\|BUG" pages/ components/ lib/ --include="*.ts" --include="*.tsx"
```

**标准**: 无遗留标记

### 2.3 Console.log 检查

**检查命令**:
```bash
grep -r "console.log\|console.error\|console.warn" pages/ components/ --include="*.ts" --include="*.tsx" | grep -v node_modules
```

**标准**: 
- ✅ 前端组件：无 console.log（生产环境）
- ✅ API 端点：允许错误日志

### 2.4 Any 类型检查

**检查命令**:
```bash
grep -r "any" pages/ components/ lib/ --include="*.ts" --include="*.tsx" | wc -l
```

**标准**: <50 处（主要是 NextAuth 类型断言）

### 2.5 代码行数统计

**检查命令**:
```bash
find pages components lib -name "*.ts" -o -name "*.tsx" | wc -l
```

**标准**: 合理范围（50-100 个文件）

---

## 🔍 第三阶段：依赖包排查（5 分钟）

### 3.1 核心依赖版本

**检查命令**:
```bash
cat package.json | grep -E '"next"|"react"|"prisma"|"next-auth"'
```

**标准版本**:
```json
{
  "next": "14.x",
  "react": "18.x",
  "prisma": "5.x",
  "next-auth": "4.x"
}
```

### 3.2 依赖冲突检查

**检查命令**:
```bash
npm ls 2>&1 | grep -i "invalid\|unmet\|peer dep"
```

**标准**: 无严重冲突

### 3.3 敏感依赖检查

**检查是否存在**:
```bash
cat package.json | grep -i "crypto\|security\|auth"
```

**标准**: 无未授权的安全库

---

## 🔍 第四阶段：配置文件排查（5 分钟）

### 4.1 TypeScript 配置

**检查文件**: `tsconfig.json`

**关键配置**:
```json
{
  "compilerOptions": {
    "strict": true,
    "esModuleInterop": true,
    "moduleResolution": "bundler",
    "paths": { "@/*": ["./*"] }
  }
}
```

### 4.2 Next.js 配置

**检查文件**: `next.config.js`

**关键配置**:
```javascript
{
  reactStrictMode: true
}
```

### 4.3 Tailwind 配置

**检查文件**: `tailwind.config.ts`

**关键配置**:
```typescript
{
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}"
  ]
}
```

### 4.4 Prisma Schema

**检查文件**: `prisma/schema.prisma`

**关键配置**:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("POSTGRES_URL")
}
```

**标准**: 使用 `POSTGRES_URL`（Vercel 默认）

---

## 🔍 第五阶段：环境变量排查（5 分钟）

### 5.1 .env.example 检查

**检查文件**: `.env.example`

**必须包含**:
```
B2B_API_URL=
B2B_API_TOKEN=
STRIPE_SECRET_KEY=
RESEND_API_KEY=
NEXT_PUBLIC_SITE_URL=
DATABASE_URL=
```

### 5.2 Vercel 环境变量验证

**检查命令**:
```bash
curl -s "https://api.vercel.com/v9/projects/{id}/env" \
  -H "Authorization: Bearer {token}" | grep -o '"key":"[^"]*"' | sort
```

**标准**: 所有必需变量已配置

### 5.3 硬编码密钥检查

**检查命令**:
```bash
grep -r "sk_live_\|pk_live_\|whsec_\|re_\|ghp_\|vcp_" \
  --include="*.ts" --include="*.tsx" --include="*.js" --include="*.json" | grep -v node_modules
```

**标准**: 无硬编码密钥

---

## 🔍 第六阶段：页面路由排查（5 分钟）

### 6.1 页面文件清单

**检查命令**:
```bash
find pages -name "*.tsx" | sort
```

**必须页面**:
```
✅ pages/_app.tsx
✅ pages/_document.tsx (可选)
✅ pages/index.tsx
✅ pages/404.tsx
✅ pages/500.tsx
```

### 6.2 API 端点清单

**检查命令**:
```bash
find pages/api -name "*.ts" | sort
```

**标准**: 所有端点有对应功能

### 6.3 动态路由检查

**检查命令**:
```bash
find pages -name "\[*.tsx" | sort
```

**标准**: 动态参数正确处理

---

## 🔍 第七阶段：组件排查（5 分钟）

### 7.1 组件文件统计

**检查命令**:
```bash
find components -name "*.tsx" | wc -l
```

**标准**: 合理数量（20-50 个）

### 7.2 组件导入检查

**检查命令**:
```bash
grep -r "import.*from" components/ --include="*.tsx" | grep -v "@/" | grep -v "react" | head -20
```

**标准**: 无异常导入

### 7.3 Hooks 使用检查

**检查命令**:
```bash
grep -r "useState\|useEffect\|useRouter" components/ --include="*.tsx" | wc -l
```

**标准**: 合理使用

---

## 🔍 第八阶段：国际化排查（3 分钟）

### 8.1 翻译文件检查

**检查文件**: `lib/i18n.ts`

**必须支持**:
```
✅ zh (中文)
✅ en (英文)
```

### 8.2 翻译键覆盖

**检查命令**:
```bash
grep -c "'[^']+'\s*:" lib/i18n.ts
```

**标准**: >100 个翻译键

### 8.3 未使用翻译检查

**检查命令**:
```bash
grep -r "t('.*')" pages/ components/ --include="*.tsx" | wc -l
```

**标准**: 所有翻译键有使用

---

## 🔍 第九阶段：SEO 排查（3 分钟）

### 9.1 SEO 组件检查

**检查文件**: `components/ui/SEO.tsx`

**必须功能**:
```
✅ title
✅ description
✅ canonical URL
✅ Open Graph
✅ Twitter Card
✅ noIndex 支持
```

### 9.2 Sitemap 检查

**检查文件**: `public/sitemap.xml`

**标准**:
```
✅ URL 数量合理
✅ 格式正确
✅ 包含所有页面
```

### 9.3 Robots.txt 检查

**检查文件**: `public/robots.txt`

**标准**:
```
✅ 允许爬虫
✅ 禁止敏感路径
✅ 指向 sitemap
```

---

## 🔍 第十阶段：安全排查（5 分钟）

### 10.1 XSS 防护检查

**检查命令**:
```bash
grep -r "dangerouslySetInnerHTML" pages/ components/ --include="*.tsx"
```

**标准**: 无或使用受控

### 10.2 CSRF 防护检查

**检查命令**:
```bash
grep -r "POST\|PUT\|DELETE" pages/api/ --include="*.ts" | head -10
```

**标准**: 有验证逻辑

### 10.3 输入验证检查

**检查命令**:
```bash
grep -r "req.body" pages/api/ --include="*.ts" | head -10
```

**标准**: 有验证和清理

### 10.4 敏感信息泄露检查

**检查命令**:
```bash
grep -r "password\|secret\|token\|key" pages/ components/ --include="*.ts" --include="*.tsx" | grep -v "process.env" | head -10
```

**标准**: 无硬编码

---

## 🔍 第十一阶段：性能排查（3 分钟）

### 11.1 图片优化检查

**检查命令**:
```bash
find public -name "*.jpg" -o -name "*.png" | head -10
```

**标准**: 使用 WebP 或优化过

### 11.2 懒加载检查

**检查命令**:
```bash
grep -r "lazy\|dynamic" pages/ components/ --include="*.tsx" | head -10
```

**标准**: 大组件使用懒加载

### 11.3 包大小检查

**检查命令**:
```bash
ls -lh .next/static/chunks/ 2>/dev/null | head -10
```

**标准**: 无超大 chunk（>500KB）

---

## 🔍 第十二阶段：部署排查（3 分钟）

### 12.1 Vercel 部署状态

**检查命令**:
```bash
curl -s "https://api.vercel.com/v6/deployments?projectId={id}" \
  -H "Authorization: Bearer {token}" | grep -o '"state":"[^"]*"' | head -5
```

**标准**: 最新部署 READY

### 12.2 构建日志检查

**检查 Vercel Dashboard**:
```
✅ 无构建错误
✅ 无类型错误
✅ 无 lint 错误
```

### 12.3 生产 URL 验证

**检查**:
```
✅ https://simryoko.com 可访问
✅ 无控制台错误
✅ 关键功能正常
```

---

## 🔍 第十三阶段：Git 排查（2 分钟）

### 13.1 Git 状态

**检查命令**:
```bash
git status
```

**标准**: 干净（无未提交变更）

### 13.2 Git 历史

**检查命令**:
```bash
git log --oneline -10
```

**标准**: 提交信息清晰

### 13.3 远程同步

**检查命令**:
```bash
git push --dry-run
```

**标准**: 可推送

---

## 🔍 第十四阶段：文档排查（2 分钟）

### 14.1 项目文档

**检查文件**:
```
✅ README.md
✅ DEPLOYMENT.md
✅ API 文档
```

### 14.2 代码注释

**检查命令**:
```bash
grep -r "/\*\*\|// TODO" pages/ components/ --include="*.ts" --include="*.tsx" | head -10
```

**标准**: 关键函数有注释

---

## 🔍 第十五阶段：功能排查（5 分钟）

### 15.1 核心功能清单

| 功能 | 状态 | 测试方式 |
|------|------|---------|
| 首页加载 | ⏳ | 访问 / |
| 产品列表 | ⏳ | 访问 /products |
| 产品详情 | ⏳ | 访问 /product/[id] |
| 购物车 | ⏳ | 访问 /cart |
| 结账 | ⏳ | 访问 /checkout |
| 支付 | ⏳ | 测试支付流程 |
| 登录 | ⏳ | 访问 /auth/signin |
| 订单 | ⏳ | 访问 /account/orders |
| 博客 | ⏳ | 访问 /blog |
| 帮助 | ⏳ | 访问 /help |

### 15.2 API 功能测试

**检查命令**:
```bash
curl -s "https://simryoko.com/api/products" | head -20
```

**标准**: 返回有效数据

---

## 📊 排查报告模板

### 排查总结

```markdown
## 排查时间
- 开始：YYYY-MM-DD HH:MM
- 结束：YYYY-MM-DD HH:MM
- 耗时：X 分钟

## 排查范围
- 阶段：15 个阶段
- 检查项：X 项
- 发现问题：X 个

## 问题清单

### 严重问题（必须修复）
1. [ ] 问题描述
   - 文件：path/to/file
   - 修复：如何修复
   - 优先级：P0

### 警告问题（建议修复）
1. [ ] 问题描述
   - 文件：path/to/file
   - 修复：如何修复
   - 优先级：P1

### 优化建议（可选）
1. [ ] 优化描述
   - 收益：什么好处
   - 成本：多少工作量
   - 优先级：P2

## 最终状态

| 领域 | 状态 | 说明 |
|------|------|------|
| 代码质量 | ✅/⚠️/❌ | 说明 |
| 配置完整性 | ✅/⚠️/❌ | 说明 |
| 安全性 | ✅/⚠️/❌ | 说明 |
| 性能 | ✅/⚠️/❌ | 说明 |
| 部署状态 | ✅/⚠️/❌ | 说明 |

## 待执行操作

### 立即执行
- [ ] 任务 1
- [ ] 任务 2

### 后续执行
- [ ] 任务 3
- [ ] 任务 4
```

---

## ✅ 排查完成标准

### 必须满足（P0）
- [ ] 无 TypeScript 错误
- [ ] 无硬编码密钥
- [ ] 无严重安全漏洞
- [ ] Git 状态干净
- [ ] Vercel 部署 READY

### 建议满足（P1）
- [ ] 无 TODO/FIXME 标记
- [ ] 前端无 console.log
- [ ] 自定义 404/500 页面
- [ ] 完整的国际化
- [ ] SEO 优化完成

### 可选满足（P2）
- [ ] PWA 支持
- [ ] API Rate Limiting
- [ ] 性能优化
- [ ] 完整的文档

---

## 🔄 排查频率

| 类型 | 频率 | 执行者 |
|------|------|--------|
| **全面排查** | 每周 1 次 | AI 团队 |
| **重点排查** | 每次部署前 | AI 团队 |
| **快速检查** | 每天 1 次 | AI 团队 |
| **专项排查** | 按需 | AI 团队 |

---

## 📝 更新记录

| 版本 | 日期 | 更新内容 | 作者 |
|------|------|---------|------|
| 1.0 | 2026-03-19 | 初始版本 | 龙虾 |

---

**使用说明**:
1. 复制此模板到 `docs/CHECKLIST_TEMPLATE.md`
2. 每次排查时复制一份为 `docs/CHECKLIST-YYYY-MM-DD.md`
3. 逐项检查并打勾
4. 生成排查报告
5. 提交到 Git

---

*最后更新：2026-03-19*  
*作者：龙虾*
