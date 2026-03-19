# SimRyoko PWA 开发计划

## 项目概述

**目标**：将 SimRyoko eSIM 商店转换为渐进式 Web App（PWA）

**预算**：$0

**时间**：1-2 周

**上线形式**：用户通过浏览器访问，可"添加到主屏幕"

---

## 核心功能

### PWA 必备功能

- [ ] **manifest.json** - App 配置（名称、图标、启动方式）
- [ ] **Service Worker** - 离线缓存、网络代理
- [ ] **HTTPS** - 已满足（Vercel 自动提供）
- [ ] **App 图标** - 多尺寸图标（512x512, 192x192 等）
- [ ] **添加到主屏幕** - 引导用户安装

### 增强功能（可选）

- [ ] **离线页面** - 无网络时的友好提示
- [ ] **推送通知** - 订单状态、促销活动
- [ ] **后台同步** - 离线操作同步
- [ ] **快捷方式** - 主屏幕快捷入口

---

## 开发阶段

### 阶段 1：基础 PWA（第 1 周）

**文件结构**：
```
public/
  manifest.json          # App 配置
  icons/                 # App 图标
    icon-192.png
    icon-192-maskable.png
    icon-512.png
    icon-512-maskable.png
  sw.js                  # Service Worker

pages/
  _app.tsx              # 注册 Service Worker
  offline.tsx           # 离线页面

components/
  PWAInstallPrompt.tsx  # 安装提示组件
```

**任务清单**：
- [ ] 创建 manifest.json
- [ ] 生成 App 图标（多尺寸）
- [ ] 创建 Service Worker（基础缓存）
- [ ] 创建离线页面
- [ ] 在 _app.tsx 注册 Service Worker
- [ ] 添加安装提示组件
- [ ] 测试 PWA 功能

---

### 阶段 2：优化（第 2 周）

**任务清单**：
- [ ] 优化缓存策略（静态资源、API 响应）
- [ ] 添加后台同步
- [ ] 推送通知集成（可选）
- [ ] 性能优化（Lighthouse 评分 90+）
- [ ] 多语言支持（i18n）
- [ ] 测试（iOS Safari、Android Chrome）

---

## 技术实现

### manifest.json 配置

```json
{
  "name": "SimRyoko eSIM",
  "short_name": "SimRyoko",
  "description": "Global eSIM - Instant Connection",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#000000",
  "orientation": "portrait-primary",
  "icons": [
    {
      "src": "/icons/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

### Service Worker 策略

```javascript
// 缓存策略
- 静态资源：Cache First
- API 请求：Network First
- 图片：Cache First
- HTML：Network First
```

---

## 测试清单

### Lighthouse PWA 审计

- [ ] 添加 manifest.json
- [ ] 配置 viewport
- [ ] 自定义启动图标
- [ ] 主题颜色
- [ ] Service Worker 注册
- [ ] 离线功能
- [ ] HTTPS
- [ ] 可点击链接

### 设备测试

- [ ] iOS Safari（iPhone）
- [ ] Android Chrome
- [ ] 添加到主屏幕
- [ ] 离线模式
- [ ] 推送通知（如实现）

---

## 上线后

### 推广方式

1. **网站引导** - 访问时提示"添加到主屏幕"
2. **Telegram 群** - 通知用户安装
3. **邮件通知** - 告知现有用户
4. **社交媒体** - 宣传 PWA App

### 数据追踪

- [ ] PWA 安装率
- [ ] 离线使用率
- [ ] 推送通知打开率
- [ ] 用户留存率

---

## 时间线

| 日期 | 任务 | 状态 |
|------|------|------|
| Day 1-2 | manifest.json + 图标 | ⏳ 待开始 |
| Day 3-4 | Service Worker | ⏳ 待开始 |
| Day 5 | 离线页面 + 安装提示 | ⏳ 待开始 |
| Day 6-7 | 测试 + 优化 | ⏳ 待开始 |
| Day 8-14 | 增强功能（可选） | ⏳ 待开始 |

---

*创建时间：2026-03-19 23:30*
*作者：龙虾*
