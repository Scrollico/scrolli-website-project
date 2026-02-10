---
description: Audit components for design system compliance, including automatic dark mode text adaptation.
---

## Usage

```
/sc:audit [component-path]
```

## ✅ Spacing Audit

- [ ] Uses `sectionPadding` instead of hardcoded `py-*` classes
- [ ] Uses `containerPadding` instead of hardcoded `px-*` classes
- [ ] Uses `gap` tokens instead of hardcoded `gap-*` classes
- [ ] Uses `componentPadding` for internal component padding
- [ ] No manual responsive spacing (tokens handle it)

## ✅ Typography Audit (CRITICAL)

- [ ] Uses Typography components (`Heading`, `Text`, `Label`, `Caption`) - PREFERRED
- [ ] OR uses `colors.foreground.*` tokens if Typography components can't be used
- [ ] NO hardcoded text colors (`text-black`, `text-gray-900`, etc.)
- [ ] NO manual `dark:text-*` classes (Typography components handle this automatically)
- [ ] Uses `typography` variants or typography components
- [ ] No hardcoded font sizes (`text-*` classes)
- [ ] No hardcoded font weights (`font-*` classes)
- [ ] Proper heading hierarchy (h1-h6)

## ✅ Color Audit

- [ ] Uses `colors` tokens instead of raw Tailwind colors
- [ ] No hardcoded colors (`text-gray-900`, `bg-blue-600`, etc.)
- [ ] Uses semantic color names (primary, secondary, not blue, gray)
- [ ] Dark mode handled automatically (no manual `dark:` prefixes)
- [ ] Status colors use semantic tokens (success, warning, error)
- [ ] Scrolli brand colors used where appropriate (`#374152`, `#16A34A`)

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
- [ ] Uses Typography components (`Heading`, `Text`, etc.)
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
import {
  sectionPadding,
  containerPadding,
  colors,
  borderRadius,
  border,
  elevation,
  gap,
} from "@/lib/design-tokens";
import { Container } from "@/components/responsive";
import { Heading } from "@/components/ui/typography";

<section className={sectionPadding.md}>
  <Container padding="md">
    <Heading level={2} variant="h2">
      Title
    </Heading>
    <div
      className={cn("flex", gap.md, borderRadius.lg, border.thin, elevation[2])}
    >
      Content
    </div>
  </Container>
</section>;
```

## Migration Steps

1. **Identify hardcoded values** - Look for direct Tailwind classes
2. **Replace with tokens** - Use appropriate design tokens
3. **Replace text elements** - Use Typography components or `colors.foreground.*`
4. **Remove manual dark mode** - Typography components handle it automatically
5. **Test responsive** - Verify breakpoints work correctly
6. **Test dark mode** - Ensure dark mode renders properly
7. **Document changes** - Note any customizations needed

## Related Commands

- `/sc:component` - Component templates
- `/sc:design` - Design system reference
- `/sc:spacing` - Spacing tokens
- `/sc:typography` - Typography tokens
- `/sc:colors` - Color tokens