#!/bin/bash
# scripts/deepcheck-quality.sh - 代码质量检查

set -e

echo "🔍 代码质量检查..."

# 检查 TODO/FIXME 标记
echo "检查 TODO/FIXME 标记..."
TODO_COUNT=$(grep -r "TODO\|FIXME\|XXX\|HACK\|BUG" \
    pages/ components/ lib/ --include="*.ts" --include="*.tsx" 2>/dev/null | wc -l || echo "0")

if [ "$TODO_COUNT" -gt 0 ]; then
    echo "⚠️ 发现 $TODO_COUNT 个 TODO/FIXME 标记"
    grep -r "TODO\|FIXME\|XXX\|HACK\|BUG" \
        pages/ components/ lib/ --include="*.ts" --include="*.tsx" 2>/dev/null | head -5
else
    echo "✅ 无 TODO/FIXME 标记"
fi

# 检查 Console.log
echo "检查 Console.log..."
CONSOLE_COUNT=$(grep -r "console.log\|console.error\|console.warn" \
    pages/ components/ --include="*.ts" --include="*.tsx" 2>/dev/null | wc -l || echo "0")

echo "ℹ️ 发现 $CONSOLE_COUNT 处 console 调用（API 端点允许）"

# 检查 Any 类型
echo "检查 Any 类型..."
ANY_COUNT=$(grep -r "any" pages/ components/ lib/ \
    --include="*.ts" --include="*.tsx" 2>/dev/null | wc -l || echo "0")

if [ "$ANY_COUNT" -gt 100 ]; then
    echo "⚠️ 发现 $ANY_COUNT 处 any 类型（建议优化）"
else
    echo "✅ Any 类型数量合理：$ANY_COUNT"
fi

echo "✅ 代码质量检查完成"
