#!/bin/bash
# scripts/run-full-check.sh - 执行完整排查

set -e

START_TIME=$(date +%s)
LOG_DIR=".check-logs"
mkdir -p "$LOG_DIR"

echo "🚀 开始执行完整排查..."
echo "时间：$(date '+%Y-%m-%d %H:%M:%S')"
echo "========================================"
echo ""

# 第一阶段：预检
echo "=== 第一阶段：预检阶段（5 分钟） ==="
bash scripts/preflight-git.sh 2>&1 | tee "$LOG_DIR/git-check.log"
bash scripts/preflight-deps.sh 2>&1 | tee "$LOG_DIR/deps-check.log"
bash scripts/preflight-config.sh 2>&1 | tee "$LOG_DIR/config-check.log"
bash scripts/preflight-env.sh 2>&1 | tee "$LOG_DIR/env-check.log"
echo ""

# 第二阶段：深度排查
echo "=== 第二阶段：深度排查（10 分钟） ==="
bash scripts/deepcheck-typescript.sh 2>&1 | tee "$LOG_DIR/typescript-check.log"
bash scripts/deepcheck-quality.sh 2>&1 | tee "$LOG_DIR/quality-check.log"
bash scripts/deepcheck-security.sh 2>&1 | tee "$LOG_DIR/security-check.log"
bash scripts/deepcheck-performance.sh 2>&1 | tee "$LOG_DIR/performance-check.log"
echo ""

# 第三阶段：验证
echo "=== 第三阶段：验证阶段（5 分钟） ==="
bash scripts/verify-vercel.sh 2>&1 | tee "$LOG_DIR/vercel-check.log"
bash scripts/verify-functionality.sh 2>&1 | tee "$LOG_DIR/functionality-check.log"
bash scripts/verify-api.sh 2>&1 | tee "$LOG_DIR/api-check.log"
echo ""

# 第四阶段：报告生成
echo "=== 第四阶段：报告生成 ==="
bash scripts/generate-report.sh
echo ""

# 计算耗时
END_TIME=$(date +%s)
DURATION=$((END_TIME - START_TIME))
echo "$DURATION" > "$LOG_DIR/check-duration.txt"

echo "========================================"
echo "✅ 排查完成！"
echo "耗时：${DURATION}秒"
echo "报告：docs/CHECKLIST-$(date +%Y-%m-%d).md"
