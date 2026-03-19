#!/bin/bash
# scripts/preflight-env.sh - 环境变量预检

set -e

echo "🔍 检查环境变量..."

# 从 Vercel API 获取环境变量
VERCEL_PROJECT_ID="${VERCEL_PROJECT_ID:-prj_CjJEEcniXHvZNIWVXIEZC64xzpH7}"
VERCEL_TOKEN="${VERCEL_TOKEN:-}"

echo "从 Vercel 获取环境变量..."
ENV_VARS=$(curl -s "https://api.vercel.com/v9/projects/${VERCEL_PROJECT_ID}/env?configuration=production" \
    -H "Authorization: Bearer ${VERCEL_TOKEN}" 2>/dev/null || echo "{}")

# 检查必需的环境变量
REQUIRED_VARS=(
    "B2B_API_URL"
    "B2B_API_TOKEN"
    "STRIPE_SECRET_KEY"
    "RESEND_API_KEY"
    "NEXT_PUBLIC_SITE_URL"
    "USDT_WALLET_ADDRESS"
)

MISSING_VARS=()
for var in "${REQUIRED_VARS[@]}"; do
    if ! echo "$ENV_VARS" | grep -q "\"key\":\"$var\""; then
        MISSING_VARS+=("$var")
    fi
done

if [ ${#MISSING_VARS[@]} -gt 0 ]; then
    echo "❌ 缺少环境变量:"
    for var in "${MISSING_VARS[@]}"; do
        echo "   - $var"
    done
    exit 1
fi
echo "✅ 所有必需环境变量已配置 (${#REQUIRED_VARS[@]}个)"

# 检查硬编码密钥
echo "检查硬编码密钥..."
HARDCODED_KEYS=$(grep -r "sk_live_\|pk_live_\|whsec_\|re_\|ghp_\|vcp_" \
    --include="*.ts" --include="*.tsx" --include="*.js" --include="*.json" \
    | grep -v node_modules | grep -v ".next" || true)

if [ ! -z "$HARDCODED_KEYS" ]; then
    echo "❌ 发现硬编码密钥:"
    echo "$HARDCODED_KEYS" | head -5
    exit 1
fi
echo "✅ 无硬编码密钥"

echo "✅ 环境变量预检通过"
