# /sc:design - System and Component Design

## Purpose

Design system architecture, APIs, component interfaces, and technical specifications for the Scrolli design system.

## Usage

```
/sc:design [target] [--type architecture|api|component|database] [--format diagram|spec|code]
```

## Execution

1. Analyze requirements and design constraints
2. Create initial design concepts and alternatives
3. Develop detailed design specifications
4. Validate design against requirements and best practices
5. Generate design documentation and implementation guides

---

## ⚠️ CRITICAL: Automatic Dark Mode Text Adaptation

**ALL text colors MUST automatically adapt to dark mode. NON-NEGOTIABLE.**

**Rule:** NEVER use hardcoded text colors. ALWAYS use:

1. **Typography Components** (`Heading`, `Text`, `Label`, `Caption`) - PREFERRED
2. **Design Token Colors** (`colors.foreground.*`) - Alternative

**FORBIDDEN:** `text-black`, `text-gray-900`, `text-black dark:text-white`, CSS `color: #111827`, inline styles with hardcoded colors

**REQUIRED:** `<Heading>`, `<Text>`, `<Label>`, `<Caption>` components OR `colors.foreground.*` tokens

**Why:** Consistency, maintainability, reliability, accessibility, better DX

**Enforcement:** Every text element must use Typography components or `colors.foreground.*` tokens. Code reviews must reject hardcoded text colors.

---

## Scrolli Brand Guidelines

- **Colors**: Primary Blue `#3500FD`, Violet Blue `#8080FF`, Navbar Beige `#F8F5E4`, Gradient
- **Typography**: Geist font (all headings H1-H6 and body text)
- **Logo**: Min 30px, 2x Y-axis clear space, approved colors only (Blue, White, Black, Violet Blue, Gradient)
- **Dark Mode**: Mandatory for all components

## Design Tokens (`@/lib/design-tokens`)

### Spacing

- `sectionPadding` - Vertical spacing (xs, sm, md, lg, xl, 2xl)
- `containerPadding` - Horizontal spacing (xs, sm, md, lg, xl)
- `componentPadding` - Internal padding (xs, sm, md, lg, xl)
- `gap` - Flex/grid spacing (xs, sm, md, lg, xl, 2xl)
- `margin` - External spacing (none, xs, sm, md, lg, xl)

### Typography

- `typography` - Pre-composed styles (h1-h6, body, bodyLarge, bodySmall, caption, label, button)
- `fontSize`, `fontWeight`, `lineHeight`, `letterSpacing` - Responsive typography tokens

### Colors (Scrolli Brand)

- `colors.primary` - Scrolli Blue `#3500FD` (dark mode: `#8b5cf6`)
- `colors.secondary` - Violet Blue `#8080FF` (dark mode: `#a5a5ff`)
- `colors.accent` - Green `#16a34a` for featured content
- `colors.background.*` - Backgrounds (base, elevated, overlay, navbar) - includes dark mode
- `colors.navbarBeige` - `#F8F5E4` for header/footer - includes dark mode
- `colors.foreground.*` - Text colors (primary, secondary, muted, disabled) - includes dark mode
- `colors.border.*` - Border colors (DEFAULT, light, medium, strong) - includes dark mode
- `colors.success`, `colors.warning`, `colors.error` - Status colors with dark mode

### Borders & Elevation

- `borderRadius` - Rounding (none, sm, md, lg, xl, 2xl, full)
- `borderWidth` - Widths (0, 1, 2, 4)
- `border` - Pre-composed styles (none, thin, medium, thick)
- `elevation` - Shadow levels (0-5)
- `surface` - Pre-composed surface styles (flat, raised, floating, modal)

### Composed Tokens

- `card` - Card styles (default, interactive, elevated)
- `button` - Button base styles
- `input` - Input styles

**Important**: All tokens automatically support dark mode. Never hardcode values.

---

## Component Design Principles

### 1. Use Design Tokens

```typescript
// ✅ CORRECT
import { colors, typography, borderRadius } from "@/lib/design-tokens";
<div className={cn(colors.background.base, typography.h1, borderRadius.lg)}>

// ❌ WRONG
<div className="bg-white text-2xl rounded-lg">
```

### 2. Dark Mode Support (MANDATORY)

- Use design tokens (automatic dark mode)
- Test in both modes (visual verification required)
- Verify contrast ratios (WCAG AA: 4.5:1 normal, 3:1 large text)
- Test all interactive states (hover, active, focus, disabled)
- No white leftovers (never `bg-white` without dark variant)

### 3. Text Color Rule (CRITICAL)

```typescript
// ✅ CORRECT: Typography components (automatic dark mode)
import { Heading, Text, Label, Caption } from "@/components/ui/typography";
<Heading level={1} variant="h1">Title</Heading>
<Text variant="body" color="primary">Body text</Text>

// ✅ CORRECT: Design tokens (automatic dark mode)
import { colors } from "@/lib/design-tokens";
<div className={cn(colors.foreground.primary)}>Text</div>

// ❌ WRONG: Hardcoded colors
<div className="text-black">Text</div>
<div className="text-black dark:text-white">Text</div>
```

### 4. Responsive Design

- Mobile-first approach
- Use responsive tokens (handle breakpoints automatically)
- Test on multiple screen sizes

### 5. Accessibility

- Semantic HTML
- ARIA labels where needed
- Keyboard navigation
- Focus indicators
- Color contrast (WCAG AA)

### 6. Component Structure

```typescript
"use client"; // If needed

import { cn } from "@/lib/utils";
import {
  colors,
  typography,
  borderRadius,
  sectionPadding,
  containerPadding,
} from "@/lib/design-tokens";
import { Container } from "@/components/responsive";

export interface ComponentProps {
  // Props with TypeScript types
}

export default function Component({ ...props }: ComponentProps) {
  return (
    <section className={cn(sectionPadding.md, colors.background.base)}>
      <Container>{/* Component content */}</Container>
    </section>
  );
}
```

### 7. Usage Patterns

**Spacing:**

```typescript
import { sectionPadding, containerPadding, gap } from "@/lib/design-tokens";
<section className={sectionPadding.md}>
  <Container padding="lg">
    <div className={cn("flex flex-col", gap.md)}>{/* Content */}</div>
  </Container>
</section>;
```

**Typography:**

```typescript
import { Heading, Text, Label, Caption } from "@/components/ui/typography";
<Heading level={1} variant="h1">Title</Heading>
<Text variant="body" color="primary">Body text</Text>
<Label>Form Label</Label>
<Caption>Caption</Caption>
```

**Card:**

```typescript
import {
  colors,
  borderRadius,
  elevation,
  componentPadding,
} from "@/lib/design-tokens";
<div
  className={cn(
    borderRadius.lg,
    colors.background.elevated,
    elevation[1],
    componentPadding.md
  )}
>
  {/* Card content */}
</div>;
```

**Button (Scrolli Brand):**

```typescript
import { Button } from "@/components/ui/button";
<Button variant="primary">Subscribe</Button>  // Scrolli Blue
<Button variant="gradient">Special CTA</Button>  // Brand gradient
<Button variant="secondary">Learn More</Button>  // Violet Blue
```

**Badge:**

```typescript
import { Badge } from "@/components/ui/badge";
<Badge variant="secondary" appearance="outline" size="sm">Technology</Badge>
<Badge variant="destructive" appearance="default" size="md">Breaking</Badge>
```

---

## Design Types

- **Architecture**: System diagrams, component hierarchy, data flow, state management
- **API**: Component props, function signatures, type definitions, API contracts
- **Component**: Specifications, variants, states, interactions, responsive behavior, dark mode
- **Database**: Data models, schemas, relationships, query patterns

## Design Process

1. **Requirements Analysis** - Understand problem, identify constraints, review patterns, check tokens
2. **Design Concepts** - Create approaches, consider alternatives, evaluate trade-offs
3. **Detailed Specifications** - Component API, props, state, styling, responsive, dark mode, accessibility
4. **Validation** - Check tokens, verify dark mode, test responsive, validate accessibility, review code
5. **Documentation** - API docs, usage examples, code snippets, design decisions, limitations

## Examples

```
/sc:design Button --type component --format spec
/sc:design Badge --type component --format spec
/sc:design Navigation --type architecture --format diagram
```

## Integration

- **Design Tokens**: `/sc:spacing`, `/sc:typography`, `/sc:colors`, `/sc:borders`, `/sc:shadows`
- **Component Templates**: `/sc:component`
- **Design System Plan**: `docs/design-system-plan.md`

## Best Practices

1. Always use design tokens (never hardcode spacing, colors, typography, borders, shadows)
2. ALWAYS use Typography components for text (automatic dark mode) - NEVER hardcoded text colors
3. Design for dark mode (test both modes, verify no white leftovers, verify text adaptation)
4. Mobile-first (responsive by default, use responsive tokens)
5. Accessible (WCAG AA, semantic HTML, ARIA, keyboard navigation)
6. Documented (clear API, usage examples)
7. Tested (visual/functional testing in both modes)
8. Consistent (follow patterns, use Scrolli brand colors)
9. Scrolli brand compliance (approved colors, Geist font, logo guidelines)
10. Component composition (split complex, reuse existing)
11. Performance (optimize images, lazy load, avoid unnecessary re-renders)
12. Automatic dark mode (NO manual `dark:text-*` classes)

## Resources

- **Documentation**: `docs/design-system-plan.md`, `docs/design-system.md`, `lib/design-tokens.ts`
- **Rules**: `.cursor/rules/design-system.mdc`, `.cursor/rules/dark-mode-checklist.md`
- **Components**: `components/ui/button.tsx`, `components/ui/badge.tsx`, `components/ui/typography.tsx`
- **Related Commands**: `/sc:component`, `/sc:spacing`, `/sc:typography`, `/sc:colors`, `/sc:borders`, `/sc:shadows`, `/sc:audit`
