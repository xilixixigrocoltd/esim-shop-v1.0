# 🤖 SimRyoko AI 客服机器人排期

## 背景

当前客服渠道：
- 📧 邮箱：support@simryoko.com（可 AI 接管）
- 💬 Telegram：@Simryokoesimbot（基础自动回复）

## 需求分析

### 1. 邮箱自动回复（高优先级）

**目标**: AI 自动处理 80% 常见咨询

**场景**:
- eSIM 安装问题
- 订单状态查询
- 退款/投诉处理
- 产品咨询

**技术方案**:
- Resend 邮件 webhook + AI 回复
- 知识库：FAQ + 历史邮件
- 人工审核：复杂问题转人工

**排期**:
- Week 1: Resend webhook 配置 + 邮件分类
- Week 2: AI 回复模板 + 知识库搭建
- Week 3: 测试 + 优化
- **预计上线**: 2026-03-26

---

### 2. Telegram 智能客服（中优先级）

**现状**: @Simryokoesimbot 仅基础命令

**目标**: AI 自动回复 70% 常见问题

**功能**:
- 订单查询（/order）
- eSIM 安装指导（/help）
- 产品推荐（/recommend）
- 人工客服转接（/human）

**技术方案**:
- 现有 bot 升级
- Gemini 2.5 Flash + 知识库 RAG
- 对话历史记忆（Redis）

**排期**:
- Week 1: Bot 架构升级 + AI 集成
- Week 2: 知识库 + 对话管理
- Week 3: 测试 + 优化
- **预计上线**: 2026-04-02

---

### 3. WhatsApp 客服（低优先级）

**目标**: 覆盖不常用 Telegram 的用户

**技术方案**:
- Meta WhatsApp Business API
- 与 Telegram bot 共享知识库

**排期**: 待定（Q2 2026）

---

## 当前 Bot 状态

### @Simryokoesimbot
- **Token**: `8764732212:AAH7bqyX3Vi6bdP5esZhspLvUDrkURaBaNc`
- **功能**: 基础命令（/start, /help, /status）
- **限制**: 无 AI 对话能力
- **升级计划**: 集成 AI 对话 + 订单查询

---

## 技术架构

```
用户消息
   ↓
Telegram Bot API / Resend Webhook
   ↓
消息分类（意图识别）
   ↓
┌─────────────────────────────────┐
│  简单问题 → 知识库匹配          │
│  复杂问题 → AI 生成回复         │
│  敏感问题 → 转人工客服          │
└─────────────────────────────────┘
   ↓
回复发送
```

---

## 成本估算

| 项目 | 月成本 |
|------|--------|
| Resend 邮件 | $30（1000 封） |
| Telegram Bot | 免费 |
| WhatsApp API | $0.005/会话 |
| AI Token（Gemini） | $50（预估） |
| Redis（对话记忆） | $15 |
| **总计** | **~$100/月** |

---

## 下一步行动

### 立即执行（本周）
1. [ ] 配置 Resend 邮件 webhook
2. [ ] 搭建邮件分类系统
3. [ ] 准备 FAQ 知识库

### 下周
4. [ ] AI 回复模板开发
5. [ ] Telegram bot 升级规划

### 长期
6. [ ] WhatsApp 集成评估
7. [ ] 多语言支持（英/中/日/韩）

---

**创建时间**: 2026-03-19  
**负责人**: 龙虾  
**状态**: 待审批
