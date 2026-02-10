#!/bin/bash
# Design Token Enforcement Hook
# Blocks commits with hardcoded Tailwind values

echo "🎨 Checking design system compliance..."

# Check for hardcoded text colors
if grep -rn "text-black\|text-gray-[0-9]" --include="*.tsx" components/ app/ 2>/dev/null | head -5; then
  echo ""
  echo "❌ ERROR: Hardcoded text colors found!"
  echo "   Use colors.foreground.* or Typography components instead."
  echo ""
  exit 1
fi

# Check for hardcoded backgrounds (excluding overlays like bg-black/20)
if grep -rn "\"bg-white\"\|\"bg-black\"\|bg-gray-[0-9]" --include="*.tsx" components/ app/ 2>/dev/null | grep -v "bg-black/" | head -5; then
  echo ""
  echo "❌ ERROR: Hardcoded background colors found!"
  echo "   Use colors.background.* tokens instead."
  echo ""
  exit 1
fi

# Check for hardcoded shadows
if grep -rn "shadow-sm\|shadow-md\|shadow-lg\|shadow-xl" --include="*.tsx" components/ app/ 2>/dev/null | grep -v "design-tokens" | head -5; then
  echo ""
  echo "❌ ERROR: Hardcoded shadow classes found!"
  echo "   Use elevation[n] tokens instead."
  echo ""
  exit 1
fi

echo "✅ Design system compliance check passed!"
exit 0
