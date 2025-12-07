import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { colors, button, borderRadius, transition } from "@/lib/design-tokens";

/**
 * Button component with logical dark mode support using design tokens
 *
 * LOGICAL COLOR SYSTEM (Arc Publishing Standards):
 * - Primary: Dark background (gray700 baseline) → White text (both modes)
 * - Secondary: Elevated background → Primary foreground text
 * - Outline: Transparent bg, border + foreground text
 * - Ghost: Transparent, foreground text only
 * - Destructive: Red background → White text (both modes)
 * - Link: Text only, underlined
 *
 * All variants support dark mode automatically via design tokens.
 */
const buttonVariants = cva(
  cn(button.base, "focus-visible:ring-primary disabled:pointer-events-none disabled:opacity-50"),
  {
    variants: {
      variant: {
        // Primary: Dark background (gray700), white text - hover decreases opacity
        default: cn(colors.primary.bg, colors.foreground.onDark, "hover:opacity-80"),
        // Secondary: Elevated background, primary text - hover decreases opacity
        secondary: cn(colors.background.elevated, colors.foreground.primary, "hover:opacity-80"),
        // Destructive: Red background, white text - hover decreases opacity
        destructive: cn(colors.error.bg, colors.foreground.onDark, "hover:opacity-80"),
        // Outline: Transparent bg, border + text color - hover decreases opacity
        outline: cn("bg-transparent", colors.border.DEFAULT, colors.foreground.primary, "hover:opacity-80"),
        // Ghost: Transparent, text color only - hover decreases opacity
        ghost: cn("bg-transparent", colors.foreground.primary, "hover:opacity-80"),
        // Link: Text only, underlined - hover decreases opacity
        link: cn("bg-transparent", colors.foreground.primary, "underline-offset-4 hover:underline hover:opacity-80"),
      },
      size: {
        default: button.padding.md,
        sm: button.padding.sm,
        lg: button.padding.lg,
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
