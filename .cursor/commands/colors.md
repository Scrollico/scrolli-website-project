# Color Token Reference

## Semantic Colors

Use semantic names, not visual names. All colors support dark mode automatically.

```typescript
import { colors } from "@/lib/design-tokens";

// Primary color
<button className={colors.primary.bg}>Primary Button</button>

// Text colors
<p className={colors.foreground.primary}>Primary text</p>
<p className={colors.foreground.secondary}>Secondary text</p>
<p className={colors.foreground.muted}>Muted text</p>
```

## Color Categories

### Primary & Secondary
```typescript
colors.primary.DEFAULT    // Text color
colors.primary.bg         // Background color
colors.primary.border     // Border color
colors.primary.hover      // Hover state

colors.secondary.DEFAULT
colors.secondary.bg
colors.secondary.border
```

### Accent Colors
```typescript
colors.accent.DEFAULT     // Green for active states
colors.accent.bg
colors.accent.border
colors.accent.hover
```

### Status Colors
```typescript
colors.success.DEFAULT    // Success text
colors.success.bg         // Success background

colors.warning.DEFAULT
colors.warning.bg

colors.error.DEFAULT
colors.error.bg
```

### Foreground (Text) Colors
```typescript
colors.foreground.primary    // Main text
colors.foreground.secondary  // Secondary text
colors.foreground.muted      // Muted text
colors.foreground.disabled   // Disabled text
```

### Background Colors
```typescript
colors.background.base      // Base background (white/dark)
colors.background.elevated  // Elevated surfaces
colors.background.overlay   // Overlay with backdrop blur
```

### Border Colors
```typescript
colors.border.DEFAULT  // Standard border
colors.border.light    // Light border
colors.border.medium   // Medium border
colors.border.strong    // Strong border
```

## Usage Example

```typescript
import { colors } from "@/lib/design-tokens";
import { cn } from "@/lib/utils";

<div className={cn(
  colors.background.base,
  colors.foreground.primary,
  colors.border.DEFAULT
)}>
  <button className={cn(
    colors.primary.bg,
    colors.primary.hover
  )}>
    Click me
  </button>
</div>
```

## Dark Mode

All colors automatically support dark mode. No need to add `dark:` prefixes manually.


















