---
description: Border tokens for consistent styling and rounded corners.
---

## Border Radius

Consistent rounding across components.

```typescript
import { borderRadius } from "@/lib/design-tokens";

<div className={borderRadius.lg}>Rounded corners</div>;
```

**Available Sizes:** `none`, `sm`, `md`, `lg`, `xl`, `2xl`, `full`

## Border Widths

```typescript
import { borderWidth, colors } from "@/lib/design-tokens";
import { cn } from "@/lib/utils";

<div className={cn(borderWidth[1], colors.border.DEFAULT)}>Thin border</div>;
```

**Available Widths:** `0`, `1`, `2`, `4`

## Pre-composed Borders

```typescript
import { border } from "@/lib/design-tokens";

<div className={border.thin}>Thin border</div>
<div className={border.medium}>Medium border</div>
<div className={border.thick}>Thick border</div>
```

## Border Colors

```typescript
import { colors, borderWidth } from "@/lib/design-tokens";
import { cn } from "@/lib/utils";

<div className={cn(borderWidth[1], colors.border.DEFAULT)}>
  Standard border
</div>

<div className={cn(borderWidth[1], colors.border.light)}>
  Light border
</div>
```

**Available Colors:** `DEFAULT`, `light`, `medium`, `strong`

## Usage Example

```typescript
import { borderRadius, border, colors } from "@/lib/design-tokens";
import { cn } from "@/lib/utils";

<div className={cn(borderRadius.lg, border.thin, colors.border.DEFAULT)}>
  Card content
</div>;
```

## Common Patterns

- **Cards**: `borderRadius.lg` + `border.thin`
- **Buttons**: `borderRadius.md` + `borderWidth[0]` (no border)
- **Inputs**: `borderRadius.md` + `border.thin`
- **Modals**: `borderRadius.xl` + `border.thin`

## Related Commands

- `/sc:component` - Component templates
- `/sc:design` - Design system reference
- `/sc:colors` - Color tokens
- `/sc:audit` - Design system audit
