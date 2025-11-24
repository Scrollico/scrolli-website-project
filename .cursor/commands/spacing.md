# Spacing Token Reference

## Section Padding

Vertical padding for major sections. Follows mobile-first responsive pattern.

```typescript
import { sectionPadding } from "@/lib/design-tokens";

<section className={sectionPadding.md}>
```

**Available Sizes:**
- `xs`: `py-4 md:py-6` - Minimal spacing
- `sm`: `py-6 md:py-8` - Small sections
- `md`: `py-8 md:py-12 lg:py-16` - Standard sections (default)
- `lg`: `py-12 md:py-16 lg:py-20` - Large sections
- `xl`: `py-16 md:py-20 lg:py-24` - Extra large sections
- `2xl`: `py-20 md:py-24 lg:py-32` - Hero sections

## Container Padding

Horizontal padding for containers.

```typescript
import { containerPadding } from "@/lib/design-tokens";

<div className={containerPadding.lg}>
```

**Available Sizes:** `xs`, `sm`, `md`, `lg`, `xl`

## Gap System

Spacing between flex/grid items.

```typescript
import { gap } from "@/lib/design-tokens";

<div className={cn("flex", gap.md)}>
```

**Available Sizes:** `xs`, `sm`, `md`, `lg`, `xl`, `2xl`

## Component Padding

Internal padding for components.

```typescript
import { componentPadding } from "@/lib/design-tokens";

<div className={componentPadding.md}>
```

**Available Sizes:** `xs`, `sm`, `md`, `lg`, `xl`

## Usage Example

```typescript
import { sectionPadding, containerPadding, gap } from "@/lib/design-tokens";
import { Container } from "@/components/responsive";

<section className={sectionPadding.md}>
  <Container padding="lg">
    <div className={cn("flex flex-col", gap.lg)}>
      {/* Content */}
    </div>
  </Container>
</section>
```


















