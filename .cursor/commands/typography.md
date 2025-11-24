# Typography Token Reference

## Typography Variants

Pre-composed typography styles for consistent text rendering.

```typescript
import { typography } from "@/lib/design-tokens";

<h1 className={typography.h1}>Heading 1</h1>
<p className={typography.body}>Body text</p>
```

**Available Variants:**
- **Headings**: `h1`, `h2`, `h3`, `h4`, `h5`, `h6`
- **Body**: `body`, `bodyLarge`, `bodySmall`
- **Specialized**: `caption`, `label`, `button`

## Typography Components

Use typography components for better semantic HTML:

```typescript
import { Heading, Text, Caption, Label } from "@/components/ui/typography";

<Heading level={1} variant="h1">Title</Heading>
<Text variant="body">Body text</Text>
<Caption>Small caption</Caption>
<Label required>Form Label</Label>
```

## Font Sizes

```typescript
import { fontSize } from "@/lib/design-tokens";

<p className={fontSize.lg}>Large text</p>
```

**Available Sizes:** `xs`, `sm`, `base`, `lg`, `xl`, `2xl`, `3xl`, `4xl`, `5xl`

## Font Weights

```typescript
import { fontWeight } from "@/lib/design-tokens";

<p className={cn(fontSize.base, fontWeight.semibold)}>Semibold text</p>
```

**Available Weights:** `light`, `normal`, `medium`, `semibold`, `bold`

## Color Variants

```typescript
import { colors } from "@/lib/design-tokens";

<p className={colors.foreground.primary}>Primary text</p>
<p className={colors.foreground.secondary}>Secondary text</p>
<p className={colors.foreground.muted}>Muted text</p>
```

## Usage Example

```typescript
import { Heading, Text } from "@/components/ui/typography";
import { typography, colors } from "@/lib/design-tokens";

<article>
  <Heading level={2} variant="h2">Article Title</Heading>
  <Text variant="body" color="secondary">
    Article content goes here...
  </Text>
</article>
```


















