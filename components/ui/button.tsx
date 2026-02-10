import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { elevation } from "@/lib/design-tokens";

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
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
  {
    variants: {
      variant: {
        // Primary Action: Beautiful Charcoal Gradient (White Text)
        default: `bg-gradient-to-t from-[#1F2937] via-[#374152] to-[#6B7280] text-white hover:text-white ${elevation[1]} border-0`,
        // Primary Action (Light): Beautiful Beige Gradient (Always Dark Text)
        "brand-beige": `bg-gradient-to-t from-[#D4CFB8] via-[#F8F5E4] to-[#FEFCF7] !text-gray-900 dark:!text-gray-900 hover:!text-gray-900 dark:hover:!text-gray-900 ${elevation[1]} border-0`,
        // Primary Action (Dark): Alias for Charcoal Gradient (White Text)
        "brand-charcoal": `bg-gradient-to-t from-[#1F2937] via-[#374152] to-[#6B7280] text-white hover:text-white ${elevation[1]} border-0`,
        // Success: Solid Green (White Text)
        success: `bg-success text-white hover:text-white hover:opacity-90 ${elevation[1]} border-0`,
        // Destructive (White Text)
        destructive: `bg-red-600 text-white hover:bg-red-700 hover:text-white ${elevation[1]} border-0`,
        // Outline (Foreground Text)
        outline: "border border-border bg-transparent text-foreground hover:text-foreground hover:bg-muted/50",
        // Secondary: Standard Gray/Light (Foreground Text)
        secondary: "bg-muted text-foreground hover:text-foreground hover:bg-muted/80 border-0",
        // Ghost (Foreground Text)
        ghost: "hover:bg-muted/50 text-foreground hover:text-foreground",
        // Link (Primary color preserved)
        link: "text-primary underline-offset-4 hover:underline hover:text-primary",
        // Periwinkle Branding
        periwinkle: `bg-[#8080FF] text-[#F8F5E3] hover:opacity-90 ${elevation[1]} border-0`,
        "periwinkle-subtle": `bg-[#E3E5FF] text-[#4A4AB3] hover:opacity-90 border-0`,
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-12 rounded-md px-8 text-base",
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
        className={cn(buttonVariants({ variant, size }), className)}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
