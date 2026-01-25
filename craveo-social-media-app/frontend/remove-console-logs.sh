#!/bin/bash

echo "🧹 Removing console.log statements (keeping errors/warns)..."
echo "=========================================================="

# Count before
echo "Console statements found:"
find src -name "*.ts" -o -name "*.tsx" -exec grep -c "console\." {} \; | awk -F: '{sum+=$2} END{print sum " total"}'

# Remove console.log but keep console.error and console.warn
echo ""
echo "Removing console.log from production files..."
find src -name "*.ts" -o -name "*.tsx" \
  -exec sed -i '' '/console\.log(/d' {} \; \
  -exec sed -i '' '/console\.log;/d' {} \; \
  -exec sed -i '' '/console\.log\s*=/d' {} \;

# Count after
echo ""
echo "After removal:"
find src -name "*.ts" -o -name "*.tsx" -exec grep -c "console\." {} \; | awk -F: '{sum+=$2} END{print sum " remaining (errors/warns)"}'

echo ""
echo "✅ Done! Kept console.error and console.warn for debugging."
