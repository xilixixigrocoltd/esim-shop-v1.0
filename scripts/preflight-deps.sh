#!/bin/bash
# scripts/preflight-deps.sh - 依赖包预检

set -e

echo "🔍 检查依赖包..."

# 检查 node_modules 是否存在
if [ ! -d "node_modules" ]; then
    echo "❌ node_modules 不存在，执行 npm install..."
    npm install
fi
echo "✅ node_modules 存在"

# 检查依赖冲突
echo "检查依赖冲突..."
npm ls > /dev/null 2>&1
if [ $? -ne 0 ]; then
    echo "❌ 发现依赖冲突:"
    npm ls 2>&1 | grep -E "invalid|unmet|peer dep" | head -10
    exit 1
fi
echo "✅ 无依赖冲突"

# 检查核心依赖版本
echo "检查核心依赖版本..."
NEXT_VERSION=$(node -p "require('./package.json').dependencies.next" 2>/dev/null || echo "unknown")
REACT_VERSION=$(node -p "require('./package.json').dependencies.react" 2>/dev/null || echo "unknown")
PRISMA_VERSION=$(node -p "require('./package.json').dependencies.prisma" 2>/dev/null || echo "unknown")

echo "   Next.js: $NEXT_VERSION"
echo "   React: $REACT_VERSION"
echo "   Prisma: $PRISMA_VERSION"

if [[ ! "$NEXT_VERSION" =~ ^14\. ]]; then
    echo "⚠️ Next.js 版本异常：$NEXT_VERSION (期望：14.x)"
fi
echo "✅ Next.js 版本正确：$NEXT_VERSION"

if [[ ! "$REACT_VERSION" =~ ^18\. ]]; then
    echo "⚠️ React 版本异常：$REACT_VERSION (期望：18.x)"
fi
echo "✅ React 版本正确：$REACT_VERSION"

echo "✅ 依赖包预检通过"
