"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { typography, colors } from "@/lib/design-tokens";

export interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  variant?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  color?: "primary" | "secondary" | "muted";
}

const headingVariants = {
  h1: typography.h1,
  h2: typography.h2,
  h3: typography.h3,
  h4: typography.h4,
  h5: typography.h5,
  h6: typography.h6,
};

const colorVariants = {
  primary: colors.foreground.primary,
  secondary: colors.foreground.secondary,
  muted: colors.foreground.muted,
};

export const Heading = React.forwardRef<HTMLHeadingElement, HeadingProps>(
  (
    {
      as,
      level,
      variant,
      color = "primary",
      className,
      children,
      ...props
    },
    ref
  ) => {
    // Determine the heading element
    const Component = as || (`h${level || (variant ? variant.slice(1) : "1")}` as keyof JSX.IntrinsicElements);
    
    // Determine the variant
    const headingVariant = variant || (`h${level || 1}` as keyof typeof headingVariants);
    
    return (
      <Component
        ref={ref}
        className={cn(
          headingVariants[headingVariant],
          colorVariants[color],
          className
        )}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

Heading.displayName = "Heading";

export default Heading;


















