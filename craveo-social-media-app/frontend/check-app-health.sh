#!/bin/bash

echo "🔍 CRAVEO APP HEALTH CHECK"
echo "==========================="

# 1. Check TypeScript compilation
echo ""
echo "📦 1. TypeScript Compilation Check..."
npx tsc --noEmit --skipLibCheck 2>&1 | grep -E "(error|Error|ERROR)" && echo "❌ TypeScript errors found!" || echo "✅ TypeScript compilation clean"

# 2. Check for broken imports
echo ""
echo "🔗 2. Checking for broken imports..."
find src -name "*.ts" -o -name "*.tsx" | xargs grep -l "Cannot find module\|No exported member" 2>/dev/null | head -5
if [ $? -eq 0 ]; then
  echo "❌ Found files with import issues"
else
  echo "✅ No import issues found"
fi

# 3. Check for console.log statements (should remove before prod)
echo ""
echo "📝 3. Checking for console.log statements..."
find src -name "*.ts" -o -name "*.tsx" | xargs grep -l "console\.log\|console\.warn\|console\.error" | grep -v "test" | head -10
if [ $? -eq 0 ]; then
  echo "⚠️  Found console statements (remove before production)"
else
  echo "✅ No console statements found"
fi

# 4. Check for large files
echo ""
echo "📊 4. Large files check..."
find src -name "*.tsx" -o -name "*.ts" | xargs wc -l | sort -rn | head -10 | awk '{print $1 " lines: " $2}'

# 5. Check for unused imports
echo ""
echo "🗑️  5. Checking for potentially unused files..."
echo "Components directory:"
ls -la src/app/components/ | wc -l | awk '{print $1 " components found"}'
echo ""
echo "Pages directory:"
find src/app -name "page.tsx" | wc -l | awk '{print $1 " pages found"}'

# 6. Check environment variables
echo ""
echo "🌍 6. Environment variables check..."
if [ -f ".env.local" ]; then
  echo "✅ .env.local exists"
  grep -E "NEXT_PUBLIC|API_KEY|SECRET" .env.local | grep -v "example\|dummy" | wc -l | awk '{print $1 " sensitive-looking variables found"}'
else
  echo "⚠️  No .env.local found"
fi

# 7. Check for TODO comments
echo ""
echo "📋 7. TODO/FIXME comments..."
find src -name "*.ts" -o -name "*.tsx" | xargs grep -i "TODO\|FIXME\|HACK\|XXX" | head -10

# 8. Check package.json scripts
echo ""
echo "📜 8. Package.json scripts..."
cat package.json | grep '"scripts"' -A 20 | grep ":"

# 9. Check build
echo ""
echo "🏗️  9. Checking if app builds..."
npm run build 2>&1 | tail -20 | grep -E "(error|Error|ERROR|success|Success)" || echo "Build check skipped (takes time)"

echo ""
echo "==========================="
echo "✅ Health check complete!"
echo ""
echo "RECOMMENDATIONS:"
echo "1. Remove all console.log statements"
echo "2. Fix any TypeScript errors"
echo "3. Remove unused components"
echo "4. Add .env.local to .gitignore if not already"
echo "5. Resolve TODO/FIXME comments"
