"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { typography, colors } from "@/lib/design-tokens";

export interface TextProps extends React.HTMLAttributes<HTMLParagraphElement> {
  as?: "p" | "span" | "div" | "a";
  variant?: "body" | "bodyLarge" | "bodySmall" | "caption";
  color?: "primary" | "secondary" | "muted" | "disabled";
  href?: string;
}

const textVariants = {
  body: typography.body,
  bodyLarge: typography.bodyLarge,
  bodySmall: typography.bodySmall,
  caption: typography.caption,
};

const colorVariants = {
  primary: colors.foreground.primary,
  secondary: colors.foreground.secondary,
  muted: colors.foreground.muted,
  disabled: colors.foreground.disabled,
};

export const Text = React.forwardRef<HTMLParagraphElement, TextProps>(
  (
    {
      as = "p",
      variant = "body",
      color = "primary",
      className,
      children,
      ...props
    },
    ref
  ) => {
    const Component = as;

    return (
      <Component
        ref={ref}
        className={cn(
          textVariants[variant],
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

Text.displayName = "Text";

export default Text;

