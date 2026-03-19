#!/bin/bash
# scripts/deepcheck-security.sh - 安全扫描

set -e

echo "🔍 安全扫描..."

# 检查硬编码密钥
echo "检查硬编码密钥..."
HARDCODED=$(grep -r "sk_live_\|pk_live_\|whsec_\|re_\|ghp_\|vcp_\|api_key\|apikey" \
    --include="*.ts" --include="*.tsx" --include="*.js" --include="*.json" \
    | grep -v node_modules | grep -v ".next" | grep -v "process.env" || true)

if [ ! -z "$HARDCODED" ]; then
    echo "❌ 发现硬编码密钥/敏感信息:"
    echo "$HARDCODED" | head -10
    exit 1
fi
echo "✅ 无硬编码密钥"

# 检查 XSS 风险
echo "检查 XSS 风险..."
DANGEROUS_INNER_HTML=$(grep -r "dangerouslySetInnerHTML" \
    pages/ components/ --include="*.tsx" || true)

if [ ! -z "$DANGEROUS_INNER_HTML" ]; then
    echo "⚠️ 发现 dangerouslySetInnerHTML 使用:"
    echo "$DANGEROUS_INNER_HTML" | head -5
    echo "ℹ️ 请确认已正确转义"
fi
echo "✅ XSS 检查完成"

# 检查敏感信息泄露
echo "检查敏感信息泄露..."
SENSITIVE=$(grep -r "password\|secret\|token\|key" \
    pages/ components/ --include="*.ts" --include="*.tsx" \
    | grep -v "process.env" | grep -v "node_modules" | grep -v "type\|interface" | head -20 || true)

if [ ! -z "$SENSITIVE" ]; then
    echo "⚠️ 发现敏感词汇使用（请确认非硬编码）:"
    echo "$SENSITIVE" | head -5
fi
echo "✅ 敏感信息检查完成"

echo "✅ 安全扫描完成"
