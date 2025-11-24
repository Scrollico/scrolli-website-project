# Design System Audit Report
**Date:** 2024  
**Scope:** Components audit for design system compliance

## Executive Summary

This audit evaluates components against the Merinda Design System standards. The design system emphasizes:
- **Semantic tokens** over hardcoded values
- **Arc Publishing standards** (gray700 baseline, no pure black/white)
- **Dark mode support** via tokens (no manual `dark:` prefixes)
- **Responsive spacing** via tokens (no manual breakpoints)

## Audit Results by Component

### ✅ NewsletterPopup Component (`components/sections/home/NewsletterPopup.tsx`)

#### Status: ⚠️ **PARTIALLY COMPLIANT** - Needs fixes

#### Issues Found:

**❌ Spacing Violations:**
- Line 127: Hardcoded `px-4 py-5 md:px-6 md:py-6` 
  - **Should use:** `containerPadding` + `componentPadding` tokens
- Line 129: Hardcoded `space-y-3`
  - **Should use:** `gap` token
- Line 134: Hardcoded `top-2 right-2`
  - **Should use:** `componentPadding` or `margin` tokens
- Line 164: Hardcoded `px-2 py-1 mt-1`
  - **Should use:** `componentPadding` tokens
- Line 179: Hardcoded `px-4`
  - **Should use:** `componentPadding` tokens
- Line 195: Hardcoded `mt-2`
  - **Should use:** `margin` or `gap` tokens
- Line 204: Hardcoded `gap-2 mt-3 pt-1`
  - **Should use:** `gap` and `margin` tokens

**❌ Typography Violations:**
- Line 148: Hardcoded `font-serif font-bold text-xl`
  - **Should use:** `typography.h3` or typography components
- Line 157: Hardcoded `text-sm leading-relaxed`
  - **Should use:** `typography.bodySmall` or `typography.caption`
- Line 164: Hardcoded `text-sm font-semibold`
  - **Should use:** `typography.label` or `typography.caption`
- Line 179: Hardcoded `text-base`
  - **Should use:** `typography.body` or `fontSize.base`
- Line 204: Hardcoded `text-sm`
  - **Should use:** `typography.bodySmall` or `typography.caption`

**❌ Color Violations:**
- Line 122: Hardcoded background colors `#1f2937` and `#F8F5E4` in inline styles
  - **Should use:** `colors.background.navbar` or `colors.navbarBeige.DEFAULT`
- Line 123: Hardcoded border colors in inline styles
  - **Should use:** `colors.border` tokens
- Line 136: Hardcoded `hover:bg-black/5 dark:hover:bg-white/10`
  - **Should use:** `colors.background.elevated` or semantic hover tokens
- Line 165: Hardcoded `bg-yellow-300 dark:bg-yellow-500/30`
  - **Should use:** `colors.warning.bg` token
- Line 180: Hardcoded `border-gray-300 dark:border-gray-600`
  - **Should use:** `colors.border.DEFAULT` or `border.thin`
- Line 181: Hardcoded `bg-white dark:bg-gray-800`
  - **Should use:** `colors.background.base` or `colors.surface.base`
- Line 182: Hardcoded `focus-visible:ring-[#374152] dark:focus-visible:ring-gray-500`
  - **Should use:** `colors.primary` or semantic focus tokens
- Line 183: Hardcoded `placeholder:text-gray-400 dark:placeholder:text-gray-500`
  - **Should use:** `colors.foreground.muted` token
- Line 204: Hardcoded `text-gray-700 dark:text-gray-200`
  - **Should use:** `colors.foreground.secondary` token

**❌ Border Violations:**
- Line 135: Hardcoded `rounded-full`
  - **Should use:** `borderRadius.full`
- Line 195: Hardcoded `rounded-lg`
  - **Should use:** `borderRadius.lg`

**✅ Good Practices Found:**
- ✅ Uses `typography.h3` and `typography.body` for some text
- ✅ Uses `colors.foreground.primary` for text colors
- ✅ Imports design tokens correctly
- ✅ Uses `cn()` utility for class composition

---

## General Component Audit

### Components Using Design Tokens ✅
The following components are importing design tokens (good sign):
- `HeroSection.tsx`
- `VideoSection.tsx`
- `AlaraAIBanner.tsx`
- `NewsletterBanner.tsx`
- `Section1.tsx`, `Section2.tsx`, `Section3.tsx`
- `ArticlesSection.tsx`
- `ArticleCard.tsx`
- And 15+ more...

### Components Needing Review ⚠️
Based on grep patterns, these components likely have hardcoded values:
- `components/sections/home/NewsletterPopup.tsx` (detailed above)
- `components/sections/single/Section1.tsx`
- `components/sections/typography/Section1.tsx`
- `components/sections/home/HeroSection.tsx`
- `components/sections/home/VideoSection.tsx`
- `components/sections/contact/Section1.tsx`
- `components/sections/about-us/AboutSection2.tsx`
- `components/sections/categories/Section1.tsx`
- `components/sections/search/Section1.tsx`
- `components/sections/home/Section2.tsx`
- `components/sections/home/Section1.tsx`
- `components/sections/archive/Section1.tsx`
- `components/sections/archive/ArticleMeta.tsx`
- `components/sections/about-us/GuidelinesSection.tsx`
- `components/sections/home/ArticlesSection.tsx`
- `components/sections/home/ArticleCard.tsx`
- `components/sections/home/Section3.tsx`

---

## Common Violation Patterns

### Pattern 1: Hardcoded Spacing
```typescript
// ❌ Bad
<div className="px-4 py-5 md:px-6 md:py-6">
<div className="space-y-3">
<div className="mt-2">

// ✅ Good
<div className={cn(containerPadding.md, componentPadding.md)}>
<div className={gap.sm}>
<div className={margin.sm}>
```

### Pattern 2: Hardcoded Typography
```typescript
// ❌ Bad
<h2 className="font-serif font-bold text-xl">
<p className="text-sm leading-relaxed">
<label className="text-sm font-semibold">

// ✅ Good
<h2 className={typography.h3}>
<p className={typography.bodySmall}>
<label className={typography.label}>
```

### Pattern 3: Hardcoded Colors
```typescript
// ❌ Bad
className="bg-white dark:bg-gray-800"
className="text-gray-700 dark:text-gray-200"
className="border-gray-300 dark:border-gray-600"

// ✅ Good
className={colors.background.base}
className={colors.foreground.secondary}
className={colors.border.DEFAULT}
```

### Pattern 4: Hardcoded Borders
```typescript
// ❌ Bad
className="rounded-lg"
className="rounded-full"
className="border border-gray-200"

// ✅ Good
className={borderRadius.lg}
className={borderRadius.full}
className={border.thin}
```

---

## Recommendations

### Priority 1: Critical Fixes
1. **NewsletterPopup Component** - Fix all violations listed above
2. **Audit all section components** - Review each component in `components/sections/`
3. **Create migration guide** - Document common patterns and fixes

### Priority 2: Systematic Improvements
1. **Add ESLint rules** - Enforce design token usage
2. **Create component templates** - Standard templates using tokens
3. **Update documentation** - Add examples for common patterns

### Priority 3: Long-term
1. **Automated testing** - Test for design system compliance
2. **Design system showcase** - Visual examples of correct usage
3. **Migration scripts** - Automated migration tools

---

## Migration Example: NewsletterPopup

### Before (Non-compliant)
```typescript
<div className="px-4 py-5 md:px-6 md:py-6">
  <div className="relative space-y-3">
    <button className="absolute top-2 right-2 w-8 h-8 rounded-full">
    <h2 className="font-serif font-bold text-xl">
    <p className="text-sm leading-relaxed">
    <label className="text-sm font-semibold px-2 py-1">
    <input className="px-4 text-base border border-gray-300 bg-white">
    <button className="mt-2 rounded-lg">
    <button className="gap-2 mt-3 pt-1 text-sm text-gray-700">
  </div>
</div>
```

### After (Compliant)
```typescript
import { containerPadding, componentPadding, gap, margin, typography, colors, borderRadius, border } from "@/lib/design-tokens";

<div className={cn(containerPadding.md, componentPadding.md)}>
  <div className={cn("relative", gap.sm)}>
    <button className={cn("absolute", componentPadding.xs, "w-8 h-8", borderRadius.full)}>
    <h2 className={typography.h3}>
    <p className={typography.bodySmall}>
    <label className={cn(typography.label, componentPadding.xs)}>
    <input className={cn(componentPadding.sm, typography.body, border.thin, colors.background.base)}>
    <button className={cn(margin.sm, borderRadius.lg)}>
    <button className={cn("flex items-center", gap.xs, margin.sm, typography.bodySmall, colors.foreground.secondary)}>
  </div>
</div>
```

---

## Next Steps

1. **Fix NewsletterPopup** - Apply all fixes from this audit
2. **Audit remaining components** - Review each component systematically
3. **Create fix checklist** - Document fixes needed per component
4. **Update .cursorrules** - Add design system compliance guidelines
5. **Test dark mode** - Verify all fixes work in dark mode

---

## Notes

- Design tokens are well-structured and comprehensive
- Many components already import tokens (good foundation)
- Main issue is inconsistent usage (some tokens, some hardcoded)
- Dark mode support is critical - all colors must use tokens
- Arc Publishing standards (gray700 baseline) must be followed



