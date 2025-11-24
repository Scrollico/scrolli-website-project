# Design System Audit Checklist

Use this checklist to audit components for design system compliance.

## ✅ Spacing Audit

- [ ] Uses `sectionPadding` instead of hardcoded `py-*` classes
- [ ] Uses `containerPadding` instead of hardcoded `px-*` classes
- [ ] Uses `gap` tokens instead of hardcoded `gap-*` classes
- [ ] Uses `componentPadding` for internal component padding
- [ ] No manual responsive spacing (tokens handle it)

## ✅ Typography Audit

- [ ] Uses `typography` variants or typography components (Heading, Text)
- [ ] No hardcoded font sizes (`text-*` classes)
- [ ] No hardcoded font weights (`font-*` classes)
- [ ] Uses semantic color tokens for text colors
- [ ] Proper heading hierarchy (h1-h6)

## ✅ Color Audit

- [ ] Uses `colors` tokens instead of raw Tailwind colors
- [ ] No hardcoded colors (`text-gray-900`, `bg-blue-600`, etc.)
- [ ] Uses semantic color names (primary, secondary, not blue, gray)
- [ ] Dark mode handled automatically (no manual `dark:` prefixes)
- [ ] Status colors use semantic tokens (success, warning, error)

## ✅ Border Audit

- [ ] Uses `borderRadius` tokens instead of hardcoded `rounded-*`
- [ ] Uses `border` tokens or `borderWidth` + `colors.border`
- [ ] Consistent border radius across similar components
- [ ] No hardcoded border widths

## ✅ Shadow/Elevation Audit

- [ ] Uses `elevation` tokens instead of hardcoded `shadow-*`
- [ ] Uses `surface` tokens for pre-composed surfaces
- [ ] Consistent elevation levels for similar components
- [ ] Hover elevation uses `elevationHover` tokens

## ✅ Component Structure Audit

- [ ] Uses `Container` component for layout
- [ ] Uses `Stack` or `gap` tokens for spacing between items
- [ ] Uses typography components (Heading, Text, etc.)
- [ ] Uses `cn()` utility for class composition
- [ ] Imports tokens from `@/lib/design-tokens`

## Common Issues to Fix

### ❌ Before (Non-compliant)
```typescript
<section className="py-8 md:py-12 lg:py-16">
  <div className="px-4 sm:px-6 lg:px-8">
    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
      Title
    </h2>
    <div className="flex gap-4 rounded-lg border border-gray-200 shadow-md">
      Content
    </div>
  </div>
</section>
```

### ✅ After (Compliant)
```typescript
import { sectionPadding, containerPadding, typography, colors, borderRadius, border, elevation, gap } from "@/lib/design-tokens";
import { Container } from "@/components/responsive";
import { Heading } from "@/components/ui/typography";

<section className={sectionPadding.md}>
  <Container padding="md">
    <Heading level={2} variant="h2">
      Title
    </Heading>
    <div className={cn("flex", gap.md, borderRadius.lg, border.thin, elevation[2])}>
      Content
    </div>
  </Container>
</section>
```

## Migration Steps

1. **Identify hardcoded values** - Look for direct Tailwind classes
2. **Replace with tokens** - Use appropriate design tokens
3. **Test responsive** - Verify breakpoints work correctly
4. **Test dark mode** - Ensure dark mode renders properly
5. **Document changes** - Note any customizations needed


















