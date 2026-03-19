#!/bin/bash
# scripts/preflight-git.sh - Git 状态预检

set -e

echo "🔍 检查 Git 状态..."

# 检查是否有未提交变更（排除 .check-logs）
UNCOMMITTED=$(git status --porcelain | grep -v "^?? .check-logs/" || true)
if [ ! -z "$UNCOMMITTED" ]; then
    echo "❌ 发现未提交变更:"
    echo "$UNCOMMITTED"
    exit 1
fi
echo "✅ Git 状态干净"

# 检查是否在 main 分支
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "main" ]; then
    echo "❌ 不在 main 分支 (当前：$CURRENT_BRANCH)"
    exit 1
fi
echo "✅ 在 main 分支"

# 检查是否落后远程
git fetch origin 2>/dev/null || true
LOCAL=$(git rev-parse @)
REMOTE=$(git rev-parse @{u}) 2>/dev/null || REMOTE=$LOCAL
if [ "$LOCAL" != "$REMOTE" ]; then
    echo "⚠️ 本地落后远程（可接受）"
fi
echo "✅ 与远程同步"

echo "✅ Git 预检通过"
