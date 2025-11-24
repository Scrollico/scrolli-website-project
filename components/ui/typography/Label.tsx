"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { typography, colors } from "@/lib/design-tokens";

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  as?: "label" | "span" | "div";
  required?: boolean;
  color?: "primary" | "secondary" | "muted";
}

const colorVariants = {
  primary: colors.foreground.primary,
  secondary: colors.foreground.secondary,
  muted: colors.foreground.muted,
};

export const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  (
    {
      as = "label",
      required = false,
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
          typography.label,
          colorVariants[color],
          className
        )}
        {...props}
      >
        {children}
        {required && (
          <span className={cn(colorVariants.muted, "ml-1")} aria-label="required">
            *
          </span>
        )}
      </Component>
    );
  }
);

Label.displayName = "Label";

export default Label;


















