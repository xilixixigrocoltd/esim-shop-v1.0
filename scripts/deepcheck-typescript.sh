#!/bin/bash
# scripts/deepcheck-typescript.sh - TypeScript 深度检查

set -e

LOG_DIR=".check-logs"
mkdir -p "$LOG_DIR"

echo "🔍 TypeScript 类型检查..."

# 执行类型检查
npx tsc --noEmit 2>&1 | tee "$LOG_DIR/tsc-output.log"

if [ ${PIPESTATUS[0]} -ne 0 ]; then
    echo "❌ TypeScript 类型错误:"
    cat "$LOG_DIR/tsc-output.log" | head -30
    exit 1
fi

echo "✅ TypeScript 类型检查通过"
