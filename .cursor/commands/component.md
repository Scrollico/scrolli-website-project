# Component Template Generator

Use this template when creating new components with design tokens.

## Basic Component Template

```typescript
"use client";

import * as React from "react";
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
import { Heading, Text } from "@/components/ui/typography";

interface ComponentNameProps {
  // Add your props here
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

import * as React from "react";
import { cn } from "@/lib/utils";
import {
  borderRadius,
  border,
  elevation,
  componentPadding,
  colors,
  typography,
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

import * as React from "react";
import { cn } from "@/lib/utils";
import {
  borderRadius,
  elevation,
  elevationHover,
  componentPadding,
  colors,
  transition,
} from "@/lib/design-tokens";

interface InteractiveComponentProps {
  onClick?: () => void;
  className?: string;
}

export default function InteractiveComponent({
  onClick,
  className,
}: InteractiveComponentProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        borderRadius.md,
        colors.primary.bg,
        colors.primary.hover,
        elevation[0],
        elevationHover[1],
        componentPadding.md,
        transition.normal,
        "cursor-pointer",
        className
      )}
    >
      Click me
    </button>
  );
}
```

## Best Practices

1. **Always import tokens** at the top of the file
2. **Use `cn()` utility** for combining classes
3. **Use typography components** for text (Heading, Text, etc.)
4. **Use Container** for layout consistency
5. **Include dark mode** - tokens handle it automatically
6. **Test responsive** - tokens handle breakpoints automatically


















