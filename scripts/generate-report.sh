#!/bin/bash
# scripts/generate-report.sh - 生成排查报告

set -e

LOG_DIR=".check-logs"
REPORT_FILE="docs/CHECKLIST-$(date +%Y-%m-%d).md"
TIMESTAMP=$(date "+%Y-%m-%d %H:%M:%S")
DATE_ONLY=$(date +%Y-%m-%d)

# 统计问题数量
P0_COUNT=0
P1_COUNT=0
P2_COUNT=0

# 检查各阶段日志
if grep -q "❌" "$LOG_DIR/git-check.log" "$LOG_DIR/deps-check.log" "$LOG_DIR/config-check.log" "$LOG_DIR/env-check.log" 2>/dev/null; then
    P0_COUNT=$((P0_COUNT + 1))
fi

if grep -q "⚠️" "$LOG_DIR/quality-check.log" "$LOG_DIR/security-check.log" "$LOG_DIR/performance-check.log" 2>/dev/null; then
    P1_COUNT=$((P1_COUNT + 1))
fi

cat > "$REPORT_FILE" << EOF
# 🔍 SimRyoko 项目排查报告

**排查日期**: $TIMESTAMP  
**排查版本**: v2.0 (Ultimate)  
**执行耗时**: $(cat "$LOG_DIR/check-duration.txt" 2>/dev/null || echo "未知") 秒

---

## 📊 排查总结

| 领域 | 状态 | 说明 |
|------|------|------|
| **Git 状态** | $(grep -q "✅ Git 预检通过" "$LOG_DIR/git-check.log" 2>/dev/null && echo "✅" || echo "❌") | $(grep "✅\|❌" "$LOG_DIR/git-check.log" 2>/dev/null | tail -1 || echo "未检查") |
| **依赖包** | $(grep -q "✅ 依赖包预检通过" "$LOG_DIR/deps-check.log" 2>/dev/null && echo "✅" || echo "❌") | $(grep "✅\|❌" "$LOG_DIR/deps-check.log" 2>/dev/null | tail -1 || echo "未检查") |
| **配置文件** | $(grep -q "✅ 配置文件预检通过" "$LOG_DIR/config-check.log" 2>/dev/null && echo "✅" || echo "❌") | $(grep "✅\|❌" "$LOG_DIR/config-check.log" 2>/dev/null | tail -1 || echo "未检查") |
| **环境变量** | $(grep -q "✅ 环境变量预检通过" "$LOG_DIR/env-check.log" 2>/dev/null && echo "✅" || echo "❌") | $(grep "✅\|❌" "$LOG_DIR/env-check.log" 2>/dev/null | tail -1 || echo "未检查") |
| **代码质量** | $(grep -q "✅ 代码质量检查完成" "$LOG_DIR/quality-check.log" 2>/dev/null && echo "✅" || echo "❌") | TODO: $(grep "TODO" "$LOG_DIR/quality-check.log" 2>/dev/null | wc -l || echo "0") 个 |
| **安全性** | $(grep -q "✅ 安全扫描完成" "$LOG_DIR/security-check.log" 2>/dev/null && echo "✅" || echo "❌") | 硬编码密钥：$(grep -c "硬编码" "$LOG_DIR/security-check.log" 2>/dev/null || echo "0") |
| **性能** | $(grep -q "✅ 性能分析完成" "$LOG_DIR/performance-check.log" 2>/dev/null && echo "✅" || echo "❌") | 超大 chunk: $(grep -c "超大" "$LOG_DIR/performance-check.log" 2>/dev/null || echo "0") |
| **Vercel 部署** | $(grep -q "✅ Vercel 部署验证通过" "$LOG_DIR/vercel-check.log" 2>/dev/null && echo "✅" || echo "❌") | 状态：$(grep "部署状态" "$LOG_DIR/vercel-check.log" 2>/dev/null | tail -1 || echo "未知") |
| **功能测试** | $(grep -q "✅ 功能测试通过" "$LOG_DIR/functionality-check.log" 2>/dev/null && echo "✅" || echo "❌") | 页面测试：$(grep "✅" "$LOG_DIR/functionality-check.log" 2>/dev/null | wc -l || echo "0") 个 |
| **API 验证** | $(grep -q "✅ API 验证完成" "$LOG_DIR/api-check.log" 2>/dev/null && echo "✅" || echo "❌") | API 测试：$(grep "✅\|⚠️" "$LOG_DIR/api-check.log" 2>/dev/null | wc -l || echo "0") 个 |

---

## ✅ 第一阶段：预检阶段

### 1.1 Git 状态
\`\`\`
$(cat "$LOG_DIR/git-check.log" 2>/dev/null || echo "未执行")
\`\`\`

### 1.2 依赖包
\`\`\`
$(cat "$LOG_DIR/deps-check.log" 2>/dev/null || echo "未执行")
\`\`\`

### 1.3 配置文件
\`\`\`
$(cat "$LOG_DIR/config-check.log" 2>/dev/null || echo "未执行")
\`\`\`

### 1.4 环境变量
\`\`\`
$(cat "$LOG_DIR/env-check.log" 2>/dev/null || echo "未执行")
\`\`\`

---

## 🔍 第二阶段：深度排查

### 2.1 TypeScript 类型检查
\`\`\`
$(cat "$LOG_DIR/typescript-check.log" 2>/dev/null || echo "未执行")
\`\`\`

### 2.2 代码质量检查
\`\`\`
$(cat "$LOG_DIR/quality-check.log" 2>/dev/null || echo "未执行")
\`\`\`

### 2.3 安全扫描
\`\`\`
$(cat "$LOG_DIR/security-check.log" 2>/dev/null || echo "未执行")
\`\`\`

### 2.4 性能分析
\`\`\`
$(cat "$LOG_DIR/performance-check.log" 2>/dev/null || echo "未执行")
\`\`\`

---

## ✅ 第三阶段：验证阶段

### 3.1 Vercel 部署验证
\`\`\`
$(cat "$LOG_DIR/vercel-check.log" 2>/dev/null || echo "未执行")
\`\`\`

### 3.2 功能测试
\`\`\`
$(cat "$LOG_DIR/functionality-check.log" 2>/dev/null || echo "未执行")
\`\`\`

### 3.3 API 验证
\`\`\`
$(cat "$LOG_DIR/api-check.log" 2>/dev/null || echo "未执行")
\`\`\`

---

## 📋 问题清单

### 严重问题（P0）
$(grep "❌" "$LOG_DIR"/*.log 2>/dev/null | head -10 || echo "无")

### 警告问题（P1）
$(grep "⚠️" "$LOG_DIR"/*.log 2>/dev/null | head -10 || echo "无")

### 优化建议（P2）
无

---

## 📈 排查统计

| 指标 | 数值 |
|------|------|
| **检查阶段** | 4 个 |
| **检查脚本** | 11 个 |
| **发现问题** | P0: $P0_COUNT, P1: $P1_COUNT, P2: $P2_COUNT |
| **耗时** | $(cat "$LOG_DIR/check-duration.txt" 2>/dev/null || echo "未知") 秒 |

---

**报告结束**

*排查时间：$TIMESTAMP*  
*版本：v2.0 (Ultimate)*  
*作者：AI Team*
EOF

echo "✅ 报告已生成：$REPORT_FILE"
