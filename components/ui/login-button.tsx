"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Button, type ButtonProps } from "./button";

export interface LoginButtonProps extends ButtonProps {
  width?: "full" | "auto";
}

export const LoginButton = React.forwardRef<HTMLButtonElement, LoginButtonProps>(
  ({ children = "Sign In", variant, size, width = "full", className, ...props }, ref) => {

    // Map legacy variants to new Button variants
    let mappedVariant: any = variant;
    if (variant === "charcoal" || variant === "dark" || variant === "blue" || variant === "brand-charcoal") {
      mappedVariant = "default";
    } else if (variant === "green") {
      mappedVariant = "success";
    } else if (variant === "beige" || variant === "brand-beige") {
      mappedVariant = "brand-beige";
    }

    return (
      <Button
        ref={ref}
        variant={mappedVariant}
        size={size === "md" ? "default" : size}
        className={cn(
          width === "full" && "w-full",
          width === "auto" && "w-auto",
          className
        )}
        {...props}
      >
        {children}
      </Button>
    );
  }
);

LoginButton.displayName = "LoginButton";
