---
description: Generate component templates following Scrolli design system patterns with automatic dark mode support.
---

## Usage

```
/sc:component [component-name] [--type basic|card|interactive]
```

## ⚠️ CRITICAL: Text Color Rule

**NEVER use hardcoded text colors. ALWAYS use Typography components (`Heading`, `Text`, `Label`, `Caption`) or `colors.foreground.*` tokens.**

## Basic Component Template

```typescript
"use client";

import { cn } from "@/lib/utils";
import {
  sectionPadding,
  containerPadding,
  colors,
  borderRadius,
  gap,
} from "@/lib/design-tokens";
import { Container } from "@/components/responsive";
import { Heading, Text } from "@/components/ui/typography";

interface ComponentNameProps {
  className?: string;
}

export default function ComponentName({
  className,
  ...props
}: ComponentNameProps) {
  return (
    <section className={cn(sectionPadding.md, colors.background.base)}>
      <Container padding="lg">
        <div className={cn("flex flex-col", gap.lg)}>
          <Heading level={2} variant="h2">
            Component Title
          </Heading>
          <Text variant="body" color="secondary">
            Component content goes here...
          </Text>
        </div>
      </Container>
    </section>
  );
}
```

## Card Component Template

```typescript
"use client";

import { cn } from "@/lib/utils";
import {
  borderRadius,
  border,
  elevation,
  componentPadding,
  colors,
} from "@/lib/design-tokens";
import { Heading, Text } from "@/components/ui/typography";

interface CardComponentProps {
  title: string;
  description?: string;
  className?: string;
}

export default function CardComponent({
  title,
  description,
  className,
}: CardComponentProps) {
  return (
    <div
      className={cn(
        borderRadius.lg,
        border.thin,
        colors.background.elevated,
        elevation[1],
        componentPadding.md,
        className
      )}
    >
      <Heading level={3} variant="h4">
        {title}
      </Heading>
      {description && (
        <Text variant="body" color="secondary">
          {description}
        </Text>
      )}
    </div>
  );
}
```

## Interactive Component Template

```typescript
"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  borderRadius,
  elevation,
  elevationHover,
  componentPadding,
  colors,
} from "@/lib/design-tokens";
import { Text } from "@/components/ui/typography";

interface InteractiveComponentProps {
  onClick?: () => void;
  className?: string;
}

export default function InteractiveComponent({
  onClick,
  className,
}: InteractiveComponentProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        borderRadius.md,
        colors.primary.bg,
        colors.primary.hover,
        elevation[0],
        isHovered && elevationHover[1],
        componentPadding.md,
        "cursor-pointer transition-shadow duration-200",
        className
      )}
    >
      <Text variant="button">Click me</Text>
    </button>
  );
}
```

## Best Practices

1. **Always use Typography components** - `Heading`, `Text`, `Label`, `Caption` (automatic dark mode)
2. **Always import tokens** from `@/lib/design-tokens`
3. **Use `cn()` utility** for combining classes
4. **Use Container** for layout consistency
5. **Dark mode is automatic** - tokens handle it
6. **Test responsive** - tokens handle breakpoints automatically
7. **Never hardcode text colors** - use Typography components or `colors.foreground.*`

## Related Commands

- `/sc:design` - Design system reference
- `/sc:spacing` - Spacing tokens
- `/sc:typography` - Typography tokens
- `/sc:colors` - Color tokens
- `/sc:audit` - Design system audit
