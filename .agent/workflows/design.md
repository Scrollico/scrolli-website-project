# Scrolli Design System & Commands

These are the official design guidelines for Scrolli. All components and pages must adhere to these tokens to ensure a premium, consistent, and dark-mode-ready experience.

## Usage

```bash
/sc:design [target] [--type architecture|api|component|database] [--format diagram|spec|code]
```

## ⚠️ CRITICAL: Automatic Dark Mode Text Adaptation

**ALL text colors MUST automatically adapt to dark mode. NON-NEGOTIABLE.**

**Rule:** NEVER use hardcoded text colors. ALWAYS use:
1. **Typography Components** (`Heading`, `Text`, `Label`, `Caption`) - **STRONGLY PREFERRED**
2. **Design Token Colors** (`colors.foreground.*`) - Alternative

**FORBIDDEN:** `text-black`, `text-gray-900`, `text-black dark:text-white`, CSS `color: #111827`, inline styles.

---

## Scrolli Brand Guidelines

- **Colors**: Primary Charcoal `#374152`, Navbar Beige `#F8F5E4`, Success Green `#16A34A`.
- **Typography**: **Newsreader** font (all headings H1-H6 and body text).
- **Logo**: Minimum 32px, standard clear space, approved colors only (Charcoal, Beige, White, Green).
- **Dark Mode**: Mandatory baseline is **Charcoal `#374152`** (not pure black).

## Design Tokens (`@/lib/design-tokens`)

### Spacing
- `sectionPadding` - Vertical spacing (`xs` to `2xl`)
- `containerPadding` - Horizontal spacing (`xs` to `xl`)
- `componentPadding` - Internal padding (`xs` to `xl`)
- `gap` - Flex/grid spacing (`xs` to `2xl`)

### Typography
- `typography` - Pre-composed styles (`h1`-`h6`, `body`, `caption`, `label`, `button`)
- **Font**: All tokens use the **Newsreader** font family.

### Colors
- `colors.primary` - Primary Charcoal `#374152`
- `colors.accent` - Success Green `#16A34A` for highlights and active states.
- `colors.navbarBeige` - `#F8F5E4` (Dark mode: `#374152`)
- `colors.background.base` - `white` (Dark mode: `#374152`)
- `colors.foreground.*` - `primary` (gray-900/100), `secondary` (gray-700/200), `muted` (gray-500/300)

### Borders & Elevation
- `borderRadius` - `lg` (8px), `xl` (12px), `full` (pill)
- `border` - `thin` (1px), `medium` (2px) using `colors.border.DEFAULT`
- `elevation` - Shadow levels `0-5` (Material-inspired)

---

## Component Design Principles

### 1. Token-First Implementation
```typescript
import { colors, typography, border } from "@/lib/design-tokens";
// ✅ CORRECT
<div className={cn(colors.background.base, typography.body, border.thin)}>
```

### 2. Typography Rule (CRITICAL)
```typescript
import { Heading, Text } from "@/components/ui/typography";
// ✅ CORRECT: Typography components (automatic dark mode)
<Heading level={2} variant="h2">Title</Heading>
<Text variant="body">Premium content goes here.</Text>

// ❌ WRONG: Hardcoded colors or Tailwind classes
<div className="text-black dark:text-gray-100">Bad Practice</div>
```

### 3. Button Styles
- **Signature (Inevitable)**: Use Gradients for critical actions (Accept, Subscribe, Purchase).
  - `brand-charcoal`: Beautiful dark gradient (White text).
  - `brand-beige`: Beautiful light gradient (Charcoal text).
- **Action**: Use `rounded-full` for "badge-style" interactive buttons (tags).
- **Status**: Use Solid Brand Green (`#16A34A`) for success states.

## Best Practices
1. **No Pure Black/White**: Use Charcoal `#374152` as the dark mode baseline.
2. **Badge Aesthetic**: Use `rounded-full` for pill-shaped buttons and tags.
3. **Contrast**: Target WCAG AAA (7:1) for all text elements.
4. **Consistency**: Always import from `@/lib/design-tokens`, never hardcode values.