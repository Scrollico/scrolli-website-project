import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  asChild?: boolean;
  dotClassName?: string;
  disabled?: boolean;
}

export interface BadgeButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof badgeButtonVariants> {
  asChild?: boolean;
}

export type BadgeDotProps = React.HTMLAttributes<HTMLSpanElement>;

const badgeVariants = cva(
  "inline-flex items-center justify-center font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition-opacity hover:opacity-80 [&_svg]:-ms-px [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary: "bg-gradient-to-t from-green-600 via-green-500 to-green-600 text-white dark:from-green-600 dark:via-green-500 dark:to-green-600 dark:text-white",
        secondary: "bg-gradient-to-t from-[#1F2937] via-[#374152] to-[#6B7280] text-white dark:from-[#1F2937] dark:via-[#374152] dark:to-[#6B7280] dark:text-white",
        success: "bg-gradient-to-t from-green-600 via-green-500 to-green-600 text-white dark:from-green-600 dark:via-green-500 dark:to-green-600 dark:text-white",
        warning: "bg-gradient-to-t from-yellow-600 via-yellow-500 to-yellow-600 text-white dark:from-yellow-600 dark:via-yellow-500 dark:to-yellow-600 dark:text-white",
        info: "bg-gradient-to-t from-violet-600 via-violet-500 to-violet-600 text-white dark:from-violet-600 dark:via-violet-500 dark:to-violet-600 dark:text-white",
        destructive: "bg-gradient-to-t from-red-600 via-red-500 to-red-600 text-white dark:from-red-600 dark:via-red-500 dark:to-red-600 dark:text-white",
        outline: "bg-transparent border border-gray-300 text-gray-700 dark:border-gray-600 dark:bg-transparent dark:text-gray-100",
      },
      appearance: {
        default: "",
        light: "",
        outline: "",
        ghost: "border-transparent bg-transparent",
      },
      disabled: {
        true: "opacity-50 pointer-events-none",
      },
      size: {
        lg: "rounded-md px-2 h-7 min-w-7 gap-1.5 text-xs [&_svg]:size-3.5",
        md: "rounded-md px-[0.45rem] h-6 min-w-6 gap-1.5 text-xs [&_svg]:size-3.5",
        sm: "rounded-sm px-[0.325rem] h-5 min-w-5 gap-1 text-[0.6875rem] leading-[0.75rem] [&_svg]:size-3",
        xs: "rounded-sm px-[0.25rem] h-4 min-w-4 gap-1 text-[0.625rem] leading-[0.5rem] [&_svg]:size-3",
      },
      shape: {
        default: "",
        circle: "rounded-full",
      },
    },
    compoundVariants: [
      // Light appearance
      {
        variant: "primary",
        appearance: "light",
        className: "text-green-700 bg-green-50 dark:bg-green-950/30 dark:text-green-400",
      },
      {
        variant: "secondary",
        appearance: "light",
        className: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-white",
      },
      {
        variant: "success",
        appearance: "light",
        className: "text-green-800 bg-green-50 dark:bg-green-950/30 dark:text-green-400",
      },
      {
        variant: "warning",
        appearance: "light",
        className: "text-yellow-700 bg-yellow-50 dark:bg-yellow-950/30 dark:text-yellow-400",
      },
      {
        variant: "info",
        appearance: "light",
        className: "text-violet-700 bg-violet-50 dark:bg-violet-950/30 dark:text-violet-400",
      },
      {
        variant: "destructive",
        appearance: "light",
        className: "text-red-700 bg-red-50 dark:bg-red-950/30 dark:text-red-400",
      },
      // Outline appearance - SECONDARY (most important for your use case)
      // IMPORTANT: Badge must have DARK background in dark mode (not white) because text is white
      // Override gradient background completely - use style prop approach via arbitrary values
      {
        variant: "secondary",
        appearance: "outline",
        className: "border border-gray-300 text-gray-700 dark:border-gray-600 dark:text-white [&]:bg-gray-50 [&]:dark:bg-gray-800 [&]:![background-image:none] [&]:![background:rgb(249,250,251)] [&]:dark:![background:rgb(31,41,55)]",
      },
      // Outline appearance - PRIMARY
      {
        variant: "primary",
        appearance: "outline",
        className: "!bg-green-50 !bg-none border border-green-200 text-green-700 dark:border-green-900 dark:!bg-green-950/20 dark:text-green-400 [background-image:none!important] [background:rgb(240,253,244)!important] dark:[background:rgba(5,46,22,0.2)!important]",
      },
      // Outline appearance - SUCCESS
      {
        variant: "success",
        appearance: "outline",
        className: "!bg-green-50 !bg-none border border-green-200 text-green-700 dark:border-green-900 dark:!bg-green-950/20 dark:text-green-400 [background-image:none!important] [background:rgb(240,253,244)!important] dark:[background:rgba(5,46,22,0.2)!important]",
      },
      // Outline appearance - WARNING
      {
        variant: "warning",
        appearance: "outline",
        className: "!bg-yellow-50 !bg-none border border-yellow-200 text-yellow-700 dark:border-yellow-900 dark:!bg-yellow-950/20 dark:text-yellow-400 [background-image:none!important] [background:rgb(254,252,232)!important] dark:[background:rgba(66,32,6,0.2)!important]",
      },
      // Outline appearance - INFO
      {
        variant: "info",
        appearance: "outline",
        className: "!bg-violet-50 !bg-none border border-violet-200 text-violet-700 dark:border-violet-900 dark:!bg-violet-950/20 dark:text-violet-400 [background-image:none!important] [background:rgb(245,243,255)!important] dark:[background:rgba(30,27,75,0.2)!important]",
      },
      // Outline appearance - DESTRUCTIVE
      {
        variant: "destructive",
        appearance: "outline",
        className: "!bg-red-50 !bg-none border border-red-200 text-red-700 dark:border-red-900 dark:!bg-red-950/20 dark:text-red-400 [background-image:none!important] [background:rgb(254,242,242)!important] dark:[background:rgba(69,10,10,0.2)!important]",
      },
      // Ghost appearance
      {
        variant: "primary",
        appearance: "ghost",
        className: "text-green-600 dark:text-green-400",
      },
      {
        variant: "secondary",
        appearance: "ghost",
        className: "text-gray-700 dark:text-white",
      },
      {
        variant: "success",
        appearance: "ghost",
        className: "text-green-600 dark:text-green-400",
      },
      {
        variant: "warning",
        appearance: "ghost",
        className: "text-yellow-600 dark:text-yellow-400",
      },
      {
        variant: "info",
        appearance: "ghost",
        className: "text-violet-600 dark:text-violet-400",
      },
      {
        variant: "destructive",
        appearance: "ghost",
        className: "text-red-600 dark:text-red-400",
      },
      // Remove padding for ghost
      { size: "lg", appearance: "ghost", className: "px-0" },
      { size: "md", appearance: "ghost", className: "px-0" },
      { size: "sm", appearance: "ghost", className: "px-0" },
      { size: "xs", appearance: "ghost", className: "px-0" },
    ],
    defaultVariants: {
      variant: "primary",
      appearance: "default",
      size: "md",
    },
  }
);

const badgeButtonVariants = cva(
  "cursor-pointer transition-all inline-flex items-center justify-center leading-none size-3.5 [&>svg]:opacity-100! [&>svg]:size-3.5 p-0 rounded-md -me-0.5 opacity-60 hover:opacity-100",
  {
    variants: {
      variant: {
        default: "",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

function Badge({
  className,
  variant,
  size,
  appearance,
  shape,
  asChild = false,
  disabled,
  style,
  ...props
}: BadgeProps) {
  const Comp = asChild ? Slot : "span";

  // Remove gradient background-image for outline appearance
  const inlineStyle = appearance === "outline" 
    ? { ...style, backgroundImage: "none" }
    : style;

  return (
    <Comp
      data-slot="badge"
      className={cn(
        badgeVariants({ variant, size, appearance, shape, disabled }),
        className
      )}
      style={inlineStyle}
      {...props}
    />
  );
}

function BadgeButton({
  className,
  variant,
  asChild = false,
  ...props
}: BadgeButtonProps) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      data-slot="badge-button"
      className={cn(badgeButtonVariants({ variant, className }))}
      role="button"
      {...props}
    />
  );
}

function BadgeDot({ className, ...props }: BadgeDotProps) {
  return (
    <span
      data-slot="badge-dot"
      className={cn(
        "size-1.5 rounded-full bg-[currentColor] opacity-75",
        className
      )}
      {...props}
    />
  );
}

export { Badge, BadgeButton, BadgeDot, badgeVariants };

