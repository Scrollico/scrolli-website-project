import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { colors } from "@/lib/design-tokens";

/**
 * Button component with logical dark mode support
 * 
 * LOGICAL COLOR SYSTEM:
 * - Primary: Dark background → White text (both modes)
 * - Secondary: Light bg → Dark text (light mode), Dark bg → Light text (dark mode)
 * - Outline: Transparent bg, colored border/text
 * - Ghost: Transparent bg, colored text only
 * - Destructive: Red bg → White text (both modes)
 * 
 * Principle: Dark backgrounds = Light text, Light backgrounds = Dark text
 */
const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        // Primary: Dark background, white text (both modes) - hover decreases opacity
        default: "bg-[#374152] text-white hover:opacity-80 dark:bg-[#374152] dark:text-white dark:hover:opacity-80",
        // Secondary: Light bg + dark text (light), Dark bg + light text (dark) - hover decreases opacity
        secondary: `${colors.background.elevated} ${colors.foreground.primary} hover:opacity-80 dark:hover:opacity-80`,
        // Destructive: Red background, white text (both modes) - hover decreases opacity
        destructive: `${colors.error.bg} text-white hover:opacity-80 dark:hover:opacity-80`,
        // Outline: Transparent bg, border + text color - hover decreases opacity
        outline: `${colors.border.DEFAULT} bg-transparent ${colors.foreground.primary} hover:opacity-80 dark:hover:opacity-80`,
        // Ghost: Transparent, text color only - hover decreases opacity
        ghost: `bg-transparent ${colors.foreground.primary} hover:opacity-80 dark:hover:opacity-80`,
        // Link: Text only, underlined - hover decreases opacity
        link: `bg-transparent ${colors.foreground.primary} underline-offset-4 hover:underline hover:opacity-80 dark:hover:opacity-80`,
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
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
