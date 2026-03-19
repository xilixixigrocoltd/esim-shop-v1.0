#!/bin/bash
# scripts/preflight-config.sh - 配置文件预检

set -e

echo "🔍 检查配置文件..."

# 检查核心文件是否存在
REQUIRED_FILES=(
    "package.json"
    "tsconfig.json"
    "next.config.js"
    "tailwind.config.ts"
    ".gitignore"
    ".env.example"
)

for file in "${REQUIRED_FILES[@]}"; do
    if [ ! -f "$file" ]; then
        echo "❌ 缺少核心文件：$file"
        exit 1
    fi
done
echo "✅ 核心文件齐全"

# 检查 TypeScript 配置
echo "检查 TypeScript 配置..."
if ! grep -q '"strict": true' tsconfig.json; then
    echo "❌ TypeScript 未启用严格模式"
    exit 1
fi
echo "✅ TypeScript 严格模式已启用"

# 检查 Next.js 配置
echo "检查 Next.js 配置..."
if ! grep -q 'reactStrictMode: true' next.config.js; then
    echo "❌ Next.js 未启用严格模式"
    exit 1
fi
echo "✅ Next.js 严格模式已启用"

# 检查 Prisma Schema
echo "检查 Prisma Schema..."
if [ -f "prisma/schema.prisma" ]; then
    if ! grep -q 'POSTGRES_URL' prisma/schema.prisma; then
        echo "❌ Prisma 未使用 POSTGRES_URL（Vercel 默认）"
        exit 1
    fi
    echo "✅ Prisma 配置正确"
fi

echo "✅ 配置文件预检通过"
