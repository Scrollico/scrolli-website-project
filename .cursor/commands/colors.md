# /sc:colors - Color Token Reference

## Purpose

Color tokens for consistent styling with automatic dark mode support and Scrolli brand colors.

## Scrolli Brand Colors

- **Primary Blue**: `#3500FD` (dark mode: `#8b5cf6`)
- **Violet Blue**: `#8080FF` (dark mode: `#a5a5ff`)
- **Navbar Beige**: `#F8F5E4` (header, footer, components)
- **Gradient**: Blue (`#3500FD`) to Violet Blue (`#8080FF`)

## Semantic Colors

Use semantic names, not visual names. All colors support dark mode automatically.

```typescript
import { colors } from "@/lib/design-tokens";

// Primary color (Scrolli Blue)
<button className={colors.primary.bg}>Primary Button</button>

// Text colors (ALWAYS use Typography components or these tokens)
<p className={colors.foreground.primary}>Primary text</p>
<p className={colors.foreground.secondary}>Secondary text</p>
<p className={colors.foreground.muted}>Muted text</p>
```

## Color Categories

### Primary & Secondary

```typescript
colors.primary.DEFAULT; // Text color (Scrolli Blue)
colors.primary.bg; // Background color
colors.primary.border; // Border color
colors.primary.hover; // Hover state

colors.secondary.DEFAULT; // Violet Blue
colors.secondary.bg;
colors.secondary.border;
```

### Accent Colors

```typescript
colors.accent.DEFAULT; // Green for active states
colors.accent.bg;
colors.accent.border;
colors.accent.hover;
```

### Status Colors

```typescript
colors.success.DEFAULT; // Success text
colors.success.bg; // Success background

colors.warning.DEFAULT;
colors.warning.bg;

colors.error.DEFAULT;
colors.error.bg;
```

### Foreground (Text) Colors

```typescript
colors.foreground.primary; // Main text
colors.foreground.secondary; // Secondary text
colors.foreground.muted; // Muted text
colors.foreground.disabled; // Disabled text
```

**⚠️ IMPORTANT**: For text, prefer Typography components (`Heading`, `Text`, `Label`, `Caption`) which automatically use these tokens.

### Background Colors

```typescript
colors.background.base; // Base background (white/dark)
colors.background.elevated; // Elevated surfaces
colors.background.overlay; // Overlay with backdrop blur
colors.navbarBeige.DEFAULT; // Navbar beige (#F8F5E4)
```

### Border Colors

```typescript
colors.border.DEFAULT; // Standard border
colors.border.light; // Light border
colors.border.medium; // Medium border
colors.border.strong; // Strong border
```

## Usage Examples

```typescript
import { colors } from "@/lib/design-tokens";
import { cn } from "@/lib/utils";
import { Heading, Text } from "@/components/ui/typography";

// Background and text
<div className={cn(colors.background.base, colors.foreground.primary)}>
  <Heading level={1} variant="h1">Title</Heading>
  <Text variant="body">Content</Text>
</div>

// Primary button (Scrolli Blue)
<button className={cn(colors.primary.bg, colors.primary.hover)}>
  <Text variant="button">Subscribe</Text>
</button>

// Card with border
<div className={cn(
  colors.background.elevated,
  colors.border.DEFAULT
)}>
  Card content
</div>
```

## Dark Mode

All colors automatically support dark mode. No need to add `dark:` prefixes manually.

**Color Mapping:**

- Backgrounds: `white` → `gray-900`, `gray-50` → `gray-800`
- Text: `gray-900` → `white`, `gray-700` → `gray-300`
- Borders: `gray-200` → `gray-700`
- Scrolli Blue: `#3500FD` → `#8b5cf6` (Purple)
- Violet Blue: `#8080FF` → `#a5a5ff` (Lighter violet)

## ❌ Forbidden Patterns

```typescript
// ❌ WRONG: Hardcoded colors
<div className="bg-white text-black">Content</div>
<button className="bg-blue-600">Button</button>

// ❌ WRONG: Manual dark mode
<div className="bg-white dark:bg-gray-900 text-black dark:text-white">
  Content
</div>

// ❌ WRONG: Hardcoded text colors (use Typography components)
<p className="text-gray-900">Text</p>
```

## Related Commands

- `/sc:component` - Component templates
- `/sc:design` - Design system reference
- `/sc:typography` - Typography tokens
- `/sc:audit` - Design system audit
