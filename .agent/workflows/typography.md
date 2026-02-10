---
description: Typography tokens and components for consistent text styling with automatic dark mode support.
---

## ⚠️ CRITICAL: Text Color Rule

**NEVER use hardcoded text colors. ALWAYS use Typography components (`Heading`, `Text`, `Label`, `Caption`) or `colors.foreground.*` tokens.**

## Typography Components (PREFERRED)

Use Typography components for semantic HTML and automatic dark mode:

```typescript
import { Heading, Text, Label, Caption } from "@/components/ui/typography";

<Heading level={1} variant="h1">Title</Heading>
<Heading level={2} variant="h2" color="primary">Section Title</Heading>
<Text variant="body" color="primary">Body text</Text>
<Text variant="bodySmall" color="secondary">Secondary text</Text>
<Text variant="bodyLarge" color="muted">Muted text</Text>
<Label required>Form Label</Label>
<Caption>Small caption text</Caption>
```

**Available Components:**

- `Heading` - Levels 1-6, variants h1-h6, color prop
- `Text` - Variants: body, bodyLarge, bodySmall, color prop
- `Label` - Form labels, required prop
- `Caption` - Small caption text

## Typography Variants

Pre-composed typography styles (alternative to components):

```typescript
import { typography } from "@/lib/design-tokens";

<h1 className={typography.h1}>Heading 1</h1>
<p className={typography.body}>Body text</p>
```

**Available Variants:**

- **Headings**: `h1`, `h2`, `h3`, `h4`, `h5`, `h6`
- **Body**: `body`, `bodyLarge`, `bodySmall`
- **Specialized**: `caption`, `label`, `button`

## Font Sizes

```typescript
import { fontSize } from "@/lib/design-tokens";

<p className={fontSize.lg}>Large text</p>;
```

**Available Sizes:** `xs`, `sm`, `base`, `lg`, `xl`, `2xl`, `3xl`, `4xl`, `5xl`

## Font Weights

```typescript
import { fontSize, fontWeight } from "@/lib/design-tokens";
import { cn } from "@/lib/utils";

<p className={cn(fontSize.base, fontWeight.semibold)}>Semibold text</p>;
```

**Available Weights:** `light`, `normal`, `medium`, `semibold`, `bold`

## Text Colors (Design Tokens)

If Typography components can't be used, use `colors.foreground.*` tokens:

```typescript
import { colors } from "@/lib/design-tokens";
import { cn } from "@/lib/utils";

<p className={cn(colors.foreground.primary)}>Primary text</p>
<p className={cn(colors.foreground.secondary)}>Secondary text</p>
<p className={cn(colors.foreground.muted)}>Muted text</p>
<p className={cn(colors.foreground.disabled)}>Disabled text</p>
```

**Available Colors:** `primary`, `secondary`, `muted`, `disabled`

## Usage Examples

### With Typography Components (Recommended)

```typescript
import { Heading, Text } from "@/components/ui/typography";

<article>
  <Heading level={2} variant="h2">
    Article Title
  </Heading>
  <Text variant="body" color="secondary">
    Article content goes here...
  </Text>
</article>;
```

### With Typography Variants

```typescript
import { typography, colors } from "@/lib/design-tokens";
import { cn } from "@/lib/utils";

<article>
  <h2 className={typography.h2}>Article Title</h2>
  <p className={cn(typography.body, colors.foreground.secondary)}>
    Article content goes here...
  </p>
</article>;
```

## ❌ Forbidden Patterns

```typescript
// ❌ WRONG: Hardcoded text colors
<h1 className="text-black">Title</h1>
<p className="text-gray-900">Text</p>

// ❌ WRONG: Manual dark mode classes
<h1 className="text-black dark:text-white">Title</h1>
<p className="text-gray-700 dark:text-gray-300">Text</p>

// ❌ WRONG: Inline styles
<h1 style={{ color: '#111827' }}>Title</h1>
```

## Related Commands

- `/sc:component` - Component templates
- `/sc:design` - Design system reference
- `/sc:colors` - Color tokens
- `/sc:audit` - Design system audit
