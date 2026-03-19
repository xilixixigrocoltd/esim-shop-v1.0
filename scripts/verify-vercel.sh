#!/bin/bash
# scripts/verify-vercel.sh - Vercel 部署验证

set -e

echo "🔍 Vercel 部署验证..."

VERCEL_PROJECT_ID="${VERCEL_PROJECT_ID:-prj_CjJEEcniXHvZNIWVXIEZC64xzpH7}"
VERCEL_TOKEN="${VERCEL_TOKEN:-}"

# 获取最新部署状态
echo "获取最新部署状态..."
DEPLOYMENT=$(curl -s "https://api.vercel.com/v6/deployments?projectId=${VERCEL_PROJECT_ID}&target=production&limit=1" \
    -H "Authorization: Bearer ${VERCEL_TOKEN}" 2>/dev/null || echo "{}")

STATE=$(echo "$DEPLOYMENT" | grep -o '"state":"[^"]*"' | head -1 | cut -d'"' -f4 || echo "UNKNOWN")
READY_STATE=$(echo "$DEPLOYMENT" | grep -o '"readyState":"[^"]*"' | head -1 | cut -d'"' -f4 || echo "UNKNOWN")

echo "部署状态：$STATE"
echo "就绪状态：$READY_STATE"

if [ "$STATE" != "READY" ]; then
    echo "❌ 部署状态异常：$STATE"
    exit 1
fi
echo "✅ 部署状态正常"

# 获取部署 Commit
COMMIT_SHA=$(echo "$DEPLOYMENT" | grep -o '"githubCommitSha":"[^"]*"' | head -1 | cut -d'"' -f4 || echo "unknown")
echo "部署 Commit: $COMMIT_SHA"

# 检查是否为最新 Commit
LATEST_COMMIT=$(git rev-parse HEAD 2>/dev/null || echo "unknown")
echo "最新 Commit: $LATEST_COMMIT"

if [ "$COMMIT_SHA" != "$LATEST_COMMIT" ] && [ "$COMMIT_SHA" != "unknown" ]; then
    echo "⚠️ 部署落后于最新 Commit"
    echo "   部署：$COMMIT_SHA"
    echo "   最新：$LATEST_COMMIT"
fi

echo "✅ Vercel 部署验证通过"
