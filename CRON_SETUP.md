# eSIM Shop 订单监控 Cron 配置

## 监控机制

### 1. 订单状态监控（每 5 分钟）
**脚本**: `scripts/order-monitor.py`

**检测项**:
- ⏰ 待支付超时（pending > 10 分钟）
- 🚨 未付款已发货（有 eSIM 但状态≠paid）
- ❌ 支付失败

**告警方式**: Telegram Bot

**Cron 配置** (VPS):
```bash
*/5 * * * * cd /opt/xigro-bots && python3 order-monitor.py >> logs/order-monitor.log 2>&1
```

---

### 2. Webhook 失败重试
**脚本**: `scripts/webhook-retry.py`

**机制**:
- Webhook 调用失败时自动重试（最多 3 次）
- 重试间隔 60 秒
- 全部失败后发送 Telegram 告警

**使用方式**:
```bash
# 从队列读取失败的 webhook
python3 webhook-retry.py '<session_json>'
```

---

### 3. 每日订单报告（每天 9:00）
**功能**:
- 昨日订单总数
- 总收入
- 异常订单统计
- Top 5 热销产品

**Cron 配置**:
```bash
0 9 * * * cd /opt/xigro-bots && python3 daily-report.py >> logs/daily-report.log 2>&1
```

---

## 环境变量配置

```bash
# B2B API
export B2B_API_KEY="ak_6aea76ae400a247afa952d80ad4ece10b16f84e3"
export B2B_API_SECRET="15d1b5861f82849d16faa7be3f267c569bb888c166be2d3635baf078ed973697"

# Telegram 告警
export TELEGRAM_BOT_TOKEN="8764732212:AAH7bqyX3Vi6bdP5esZhspLvUDrkURaBaNc"
export TELEGRAM_ADMIN_ID="7867683484"

# 告警阈值
export PENDING_TIMEOUT_MINUTES=10
export FAILED_ORDER_THRESHOLD=3
```

---

## 告警级别

| 级别 | 图标 | 触发条件 | 响应时间 |
|------|------|----------|----------|
| 警告 | ⚠️ | pending 超时 | 1 小时内 |
| 严重 | 🚨 | 未付款已发货 | 立即 |
| 紧急 | ❌ | 连续支付失败 | 立即 |

---

## 故障排查

### Webhook 不触发
1. 检查 Stripe Dashboard → Webhooks → Events
2. 查看 Vercel 日志：`npx vercel logs`
3. 测试 webhook 端点：`curl -X POST https://esim-shop-v1.vercel.app/api/payment/webhook`

### 告警未发送
1. 检查 Telegram Bot Token 是否有效
2. 确认 Admin ID 正确
3. 查看脚本日志：`logs/order-monitor.log`

### 订单创建失败
1. 检查 B2B API 凭证
2. 验证 API 签名算法
3. 查看 B2B 后台是否有错误记录
