#!/bin/bash
# scripts/deepcheck-performance.sh - 性能分析

set -e

echo "🔍 性能分析..."

# 检查包大小
echo "检查包大小..."
if [ -d ".next/static/chunks" ]; then
    LARGE_CHUNKS=$(find .next/static/chunks -name "*.js" -size +500k 2>/dev/null || true)
    if [ ! -z "$LARGE_CHUNKS" ]; then
        echo "⚠️ 发现超大 chunk (>500KB):"
        ls -lh $LARGE_CHUNKS
    else
        echo "✅ 无超大 chunk"
    fi
else
    echo "ℹ️ .next 目录不存在（未构建）"
fi

# 检查图片大小
echo "检查图片大小..."
if [ -d "public" ]; then
    LARGE_IMAGES=$(find public -name "*.jpg" -o -name "*.png" -size +500k 2>/dev/null || true)
    if [ ! -z "$LARGE_IMAGES" ]; then
        echo "⚠️ 发现超大图片 (>500KB):"
        ls -lh $LARGE_IMAGES
    else
        echo "✅ 无超大图片"
    fi
fi

# 检查懒加载
echo "检查懒加载..."
DYNAMIC_IMPORTS=$(grep -r "dynamic\|lazy" pages/ components/ --include="*.tsx" 2>/dev/null | wc -l || echo "0")
echo "ℹ️ 发现 $DYNAMIC_IMPORTS 处懒加载使用"

echo "✅ 性能分析完成"
