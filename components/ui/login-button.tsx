"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const loginButtonVariants = cva(
  "font-medium rounded-lg inline-flex items-center justify-center whitespace-nowrap border-0 outline-none focus:outline-none focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 hover:opacity-80",
  {
    variants: {
      variant: {
        blue: "bg-gradient-to-t from-[#1F2937] via-[#374152] to-[#6B7280] text-white",
        dark: "bg-gradient-to-t from-[#1F2937] via-[#374152] to-[#6B7280] text-white",
        beige: "bg-gradient-to-t from-[#D4CFB8] via-[#F8F5E4] to-[#FEFCF7] text-gray-900",
      },
      size: {
        sm: "h-9 text-sm px-3",
        md: "h-11 text-sm px-6",
        lg: "h-[52px] text-base px-8",
      },
      width: {
        full: "w-full",
        auto: "w-auto",
      },
    },
    defaultVariants: {
      variant: "blue",
      size: "md",
      width: "full",
    },
  }
);

export interface LoginButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof loginButtonVariants> {
  children?: React.ReactNode;
}

export const LoginButton = React.forwardRef<HTMLButtonElement, LoginButtonProps>(
  ({ children = "Sign In", variant, size, width, className, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(loginButtonVariants({ variant, size, width }), className)}
        {...props}
      >
        {children}
      </button>
    );
  }
);

LoginButton.displayName = "LoginButton";

