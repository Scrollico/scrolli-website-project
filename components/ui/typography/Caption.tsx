"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { typography, colors } from "@/lib/design-tokens";

export interface CaptionProps extends React.HTMLAttributes<HTMLElement> {
  as?: "span" | "p" | "small" | "div" | "time";
  color?: "primary" | "secondary" | "muted" | "disabled";
  dateTime?: string; // For time elements
}

const colorVariants = {
  primary: colors.foreground.primary,
  secondary: colors.foreground.secondary,
  muted: colors.foreground.muted,
  disabled: colors.foreground.disabled,
};

export const Caption = React.forwardRef<HTMLElement, CaptionProps>(
  (
    {
      as = "span",
      color = "muted",
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
          typography.caption,
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

Caption.displayName = "Caption";

export default Caption;

