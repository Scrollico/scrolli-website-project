# Scrolli Design System

## Overview

The Scrolli Design System is a comprehensive, Arc Publishing-inspired design token system that ensures consistency, accessibility, and maintainability across the entire application. This system provides semantic, responsive, and dark-mode-ready tokens for all design decisions.

## Design Philosophy

### Core Principles

1. **Semantic Naming**: Use semantic names (primary, secondary) not visual names (blue, gray)
2. **Responsive by Default**: All tokens support responsive breakpoints
3. **Dark Mode Support**: All tokens have dark mode variants
4. **Accessibility**: Color contrast ratios meet WCAG AA standards
5. **Consistency**: Same token used for same purpose across components
6. **Documentation**: Every token documented with usage examples

### Arc Publishing Principles Applied

- **Modularity**: Reusable, composable components
- **Design Tokens**: Centralized, semantic design values
- **Consistency**: Standardized spacing, typography, colors, borders
- **Content-First**: Design system supports content hierarchy
- **Responsive**: Mobile-first with consistent breakpoints
- **Accessibility**: WCAG-compliant color contrast and semantic HTML
- **Performance**: Optimized token usage

## Quick Start

```typescript
import { 
  sectionPadding, 
  typography, 
  colors, 
  borderRadius,
  elevation 
} from "@/lib/design-tokens";
import { cn } from "@/lib/utils";

// Use tokens in components
<section className={cn(sectionPadding.md, colors.background.base)}>
  <h1 className={typography.h1}>Title</h1>
</section>
```

## Spacing System

### Section Padding

Vertical padding for major sections. Follows mobile-first responsive pattern.

```typescript
import { sectionPadding } from "@/lib/design-tokens";

// Usage
<section className={sectionPadding.md}>
  {/* Content */}
</section>
```

**Available Sizes:**
- `xs`: `py-4 md:py-6` - Minimal spacing
- `sm`: `py-6 md:py-8` - Small sections
- `md`: `py-8 md:py-12 lg:py-16` - Standard sections (default)
- `lg`: `py-12 md:py-16 lg:py-20` - Large sections
- `xl`: `py-16 md:py-20 lg:py-24` - Extra large sections
- `2xl`: `py-20 md:py-24 lg:py-32` - Hero sections

### Container Padding

Horizontal padding for containers. Consistent across all breakpoints.

```typescript
import { containerPadding } from "@/lib/design-tokens";

<div className={containerPadding.lg}>
  {/* Content */}
</div>
```

**Available Sizes:**
- `xs`: `px-2 sm:px-4`
- `sm`: `px-4 sm:px-6`
- `md`: `px-4 sm:px-6 lg:px-8` (default)
- `lg`: `px-4 sm:px-6 lg:px-8 xl:px-12`
- `xl`: `px-6 sm:px-8 lg:px-12 xl:px-16`

### Gap System

Spacing between flex/grid items.

```typescript
import { gap } from "@/lib/design-tokens";

<div className={cn("flex", gap.md)}>
  {/* Items */}
</div>
```

**Available Sizes:** `xs`, `sm`, `md`, `lg`, `xl`, `2xl`

## Typography System

### Typography Variants

Pre-composed typography styles for consistent text rendering.

```typescript
import { typography } from "@/lib/design-tokens";

<h1 className={typography.h1}>Heading 1</h1>
<p className={typography.body}>Body text</p>
<span className={typography.caption}>Caption</span>
```

**Available Variants:**
- **Headings**: `h1`, `h2`, `h3`, `h4`, `h5`, `h6`
- **Body**: `body`, `bodyLarge`, `bodySmall`
- **Specialized**: `caption`, `label`, `button`

### Font Sizes

Responsive font size scale.

```typescript
import { fontSize } from "@/lib/design-tokens";

<p className={fontSize.lg}>Large text</p>
```

**Available Sizes:** `xs`, `sm`, `base`, `lg`, `xl`, `2xl`, `3xl`, `4xl`, `5xl`

### Font Weights

```typescript
import { fontWeight } from "@/lib/design-tokens";

<p className={cn(fontSize.base, fontWeight.semibold)}>Semibold text</p>
```

**Available Weights:** `light`, `normal`, `medium`, `semibold`, `bold`

## Color System

### Semantic Colors

Use semantic names, not visual names. All colors support dark mode.

```typescript
import { colors } from "@/lib/design-tokens";

// Primary color
<button className={colors.primary.bg}>Primary Button</button>

// Text colors
<p className={colors.foreground.primary}>Primary text</p>
<p className={colors.foreground.secondary}>Secondary text</p>
<p className={colors.foreground.muted}>Muted text</p>

// Background colors
<div className={colors.background.base}>Base background</div>
<div className={colors.background.elevated}>Elevated background</div>
```

### Color Categories

- **Primary**: Brand primary color
- **Secondary**: Secondary brand color
- **Accent**: Accent color (green for active states)
- **Success/Warning/Error**: Status colors
- **Foreground**: Text colors (primary, secondary, muted, disabled)
- **Background**: Background colors (base, elevated, overlay)
- **Border**: Border colors (DEFAULT, light, medium, strong)

## Border System

### Border Radius

Consistent rounding across components.

```typescript
import { borderRadius } from "@/lib/design-tokens";

<div className={borderRadius.lg}>Rounded corners</div>
```

**Available Sizes:** `none`, `sm`, `md`, `lg`, `xl`, `2xl`, `full`

### Border Widths

```typescript
import { borderWidth } from "@/lib/design-tokens";

<div className={cn(borderWidth[1], colors.border.DEFAULT)}>
  Thin border
</div>
```

**Available Widths:** `0`, `1`, `2`, `4`

### Pre-composed Borders

```typescript
import { border } from "@/lib/design-tokens";

<div className={border.thin}>Thin border</div>
<div className={border.medium}>Medium border</div>
```

## Shadow/Elevation System

### Elevation Levels

Material Design inspired elevation system.

```typescript
import { elevation } from "@/lib/design-tokens";

<div className={elevation[2]}>Elevated card</div>
```

**Available Levels:** `0`, `1`, `2`, `3`, `4`, `5`

### Surface Styles

Pre-composed surface styles with elevation and background.

```typescript
import { surface } from "@/lib/design-tokens";

<div className={surface.raised}>Raised surface</div>
<div className={surface.floating}>Floating surface</div>
```

**Available Surfaces:** `flat`, `raised`, `floating`, `modal`

## Component Patterns

### Card Component

```typescript
import { card } from "@/lib/design-tokens";
import { cn } from "@/lib/utils";

<div className={card.default}>
  {/* Card content */}
</div>

<div className={card.interactive}>
  {/* Interactive card with hover elevation */}
</div>
```

### Button Base Styles

```typescript
import { button } from "@/lib/design-tokens";

<button className={cn(button.base, button.padding.md, colors.primary.bg)}>
  Button
</button>
```

## Usage Guidelines

### 1. Always Use Tokens

❌ **Don't:**
```typescript
<div className="py-8 md:py-12 text-gray-900 rounded-lg shadow-md">
```

✅ **Do:**
```typescript
import { sectionPadding, typography, borderRadius, elevation } from "@/lib/design-tokens";

<div className={cn(sectionPadding.md, typography.body, borderRadius.lg, elevation[2])}>
```

### 2. Compose with `cn()` Utility

Always use the `cn()` utility for combining tokens:

```typescript
import { cn } from "@/lib/utils";
import { typography, colors } from "@/lib/design-tokens";

<p className={cn(typography.body, colors.foreground.primary)}>
  Text content
</p>
```

### 3. Responsive Patterns

Tokens handle responsiveness automatically. Don't add manual breakpoints:

❌ **Don't:**
```typescript
<div className="py-8 md:py-12 lg:py-16">
```

✅ **Do:**
```typescript
<div className={sectionPadding.md}>
```

### 4. Dark Mode

All tokens support dark mode automatically. Don't manually add dark: prefixes:

❌ **Don't:**
```typescript
<div className="bg-white dark:bg-gray-900">
```

✅ **Do:**
```typescript
<div className={colors.background.base}>
```

## Dark Mode Guidelines

### Core Principles

1. **Consistency**: All components must work identically in light and dark modes
2. **No White Leftovers**: Never use `bg-white` without `dark:bg-*` equivalent
3. **Always Use Tokens**: Use design tokens instead of hardcoded colors
4. **Verify Everything**: Test all components in both modes before completion
5. **Font Adaptation**: All text colors must adapt properly
6. **Button Adaptation**: All button variants must work in dark mode
7. **Component Adaptation**: All interactive states must work in dark mode

### Dark Mode Verification Checklist

When implementing or updating any component, always verify:

- [ ] **Background colors**: Use `colors.background.*` tokens (never hardcode `bg-white`)
- [ ] **Text colors**: Use `colors.foreground.*` tokens (never hardcode `text-black`)
- [ ] **Border colors**: Use `colors.border.*` tokens (never hardcode `border-gray-200`)
- [ ] **Button colors**: Verify all button variants work in dark mode
- [ ] **Component adaptation**: Test all interactive states (hover, focus, active) in dark mode
- [ ] **Visual testing**: Manually verify no white backgrounds "shine" in dark mode
- [ ] **Contrast**: Ensure all text is readable with proper contrast in both modes

### Color Mapping Rules

**Light backgrounds → Dark backgrounds:**
- `white` → `gray-900`
- `gray-50` → `gray-800`
- `gray-100` → `gray-800`

**Dark text → Light text:**
- `gray-900` → `white`
- `gray-700` → `gray-300`
- `gray-600` → `gray-400`

**Borders:**
- `gray-200` → `gray-700`
- `gray-300` → `gray-600`

### Common Mistakes to Avoid

❌ **Wrong:**
```typescript
<div className="bg-white text-black">
```

✅ **Correct:**
```typescript
import { colors } from "@/lib/design-tokens";
import { cn } from "@/lib/utils";

<div className={cn(colors.background.base, colors.foreground.primary)}>
```

❌ **Wrong:**
```typescript
<button className="bg-primary"> (without dark mode variant)
```

✅ **Correct:**
```typescript
// Use design tokens which include dark mode automatically
import { colors } from "@/lib/design-tokens";
<button className={colors.primary.bg}>
```

❌ **Wrong:**
```typescript
// Hardcode colors without dark mode variants
<div className="border border-gray-200">
```

✅ **Correct:**
```typescript
import { colors } from "@/lib/design-tokens";
<div className={cn("border", colors.border.DEFAULT)}>
```

### Implementation Pattern

```typescript
import { colors } from "@/lib/design-tokens";
import { cn } from "@/lib/utils";

export default function MyComponent() {
  return (
    <div className={cn(
      colors.background.base,      // bg-white dark:bg-gray-900
      colors.foreground.primary,    // text-gray-900 dark:text-white
      colors.border.DEFAULT         // border-gray-200 dark:border-gray-700
    )}>
      <button className={cn(
        colors.primary.bg,          // bg-primary with dark mode
        colors.primary.hover       // hover states with dark mode
      )}>
        Click me
      </button>
    </div>
  );
}
```

### Testing Dark Mode

1. **Visual Inspection**: Switch to dark mode and visually inspect all pages
2. **Console Check**: Check browser console for any styling warnings
3. **Interactive Testing**: Test all interactive components (buttons, cards, inputs)
4. **White Background Check**: Verify no white backgrounds are visible in dark mode
5. **Text Readability**: Ensure all text is readable with proper contrast
6. **Hover States**: Test hover states and transitions in dark mode

## Migration Guide

### Step 1: Identify Hardcoded Values

Look for:
- Direct Tailwind classes (`py-8`, `text-gray-900`, `rounded-lg`)
- Inconsistent spacing patterns
- Hardcoded colors
- Manual dark mode classes

### Step 2: Replace with Tokens

```typescript
// Before
<div className="py-8 md:py-12 text-2xl font-bold rounded-lg shadow-md bg-white dark:bg-gray-800">

// After
import { sectionPadding, typography, borderRadius, elevation, colors } from "@/lib/design-tokens";
import { cn } from "@/lib/utils";

<div className={cn(
  sectionPadding.md,
  typography.h3,
  borderRadius.lg,
  elevation[2],
  colors.background.base
)}>
```

### Step 3: Test Responsive Behavior

Ensure responsive behavior works correctly across breakpoints.

### Step 4: Verify Dark Mode

Test dark mode to ensure all tokens render correctly.

## Examples

### Complete Component Example

```typescript
"use client";

import { cn } from "@/lib/utils";
import {
  sectionPadding,
  containerPadding,
  typography,
  colors,
  borderRadius,
  elevation,
  gap,
} from "@/lib/design-tokens";
import { Container } from "@/components/responsive";

export default function ExampleSection() {
  return (
    <section className={cn(sectionPadding.md, colors.background.base)}>
      <Container>
        <div className={cn("flex flex-col", gap.lg)}>
          <h2 className={typography.h2}>Section Title</h2>
          
          <div className={cn(
            "grid grid-cols-1 md:grid-cols-2",
            gap.md
          )}>
            {items.map((item) => (
              <div
                key={item.id}
                className={cn(
                  borderRadius.lg,
                  elevation[1],
                  colors.background.elevated,
                  "p-6"
                )}
              >
                <h3 className={cn(typography.h4, colors.foreground.primary)}>
                  {item.title}
                </h3>
                <p className={cn(typography.body, colors.foreground.secondary)}>
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
```

## Best Practices

1. **Import tokens at the top** of your component file
2. **Use `cn()` utility** for combining tokens and conditional classes
3. **Prefer composed tokens** (`typography.h1`) over individual tokens when possible
4. **Don't mix tokens with direct Tailwind classes** - use tokens consistently
5. **Test responsive behavior** - tokens handle breakpoints automatically
6. **Verify dark mode** - all tokens support dark mode out of the box
7. **Document custom tokens** - if you need a new token, add it to the design system

## Token Reference

See `lib/design-tokens.ts` for complete token definitions and TypeScript types.

## Support

For questions or suggestions about the design system, refer to:
- Design tokens: `lib/design-tokens.ts`
- Component examples: `components/ui/`
- Cursor commands: `/sc/spacing`, `/sc/typography`, `/sc/colors`, etc.

