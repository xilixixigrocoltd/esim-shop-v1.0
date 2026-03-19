#!/bin/bash
# scripts/verify-functionality.sh - 功能测试

set -e

echo "🔍 功能测试..."

BASE_URL="https://simryoko.com"

# 测试首页
echo "测试首页..."
STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/")
if [ "$STATUS" -ne 200 ]; then
    echo "❌ 首页返回 $STATUS"
    exit 1
fi
echo "✅ 首页正常 (200)"

# 测试博客页
echo "测试博客页..."
STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/blog")
if [ "$STATUS" -ne 200 ]; then
    echo "❌ 博客页返回 $STATUS"
    exit 1
fi
echo "✅ 博客页正常 (200)"

# 测试产品页
echo "测试产品页..."
STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/products")
if [ "$STATUS" -ne 200 ]; then
    echo "❌ 产品页返回 $STATUS"
    exit 1
fi
echo "✅ 产品页正常 (200)"

# 测试登录页
echo "测试登录页..."
STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/auth/signin")
if [ "$STATUS" -ne 200 ]; then
    echo "❌ 登录页返回 $STATUS"
    exit 1
fi
echo "✅ 登录页正常 (200)"

# 测试 404 页面
echo "测试 404 页面..."
STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/nonexistent-page-12345")
if [ "$STATUS" -ne 404 ]; then
    echo "❌ 404 页面返回 $STATUS"
    exit 1
fi
echo "✅ 404 页面正常 (404)"

echo "✅ 功能测试通过"
