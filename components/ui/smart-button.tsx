"use client";

import React, { useEffect, useState } from "react";
import { LoginButton, LoginButtonProps } from "@/components/ui/login-button";

export interface SmartButtonProps extends LoginButtonProps {
  // Optional override if needed, otherwise it's automatic
  forceVariant?: "blue" | "dark" | "beige" | "brand-beige" | "brand-charcoal" | "periwinkle";
  // Support for 'as' prop (will be converted to asChild)
  as?: React.ElementType;
}

export const SmartButton = React.forwardRef<HTMLButtonElement, SmartButtonProps>(
  ({ forceVariant, as, ...props }, ref) => {
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {

      const checkDarkMode = () => {
        const hasDarkMode =
          document.body.classList.contains("dark-mode") ||
          document.documentElement.classList.contains("dark");
        setIsDark(hasDarkMode);
      };

      // Initial check
      checkDarkMode();

      // Watch for changes
      const observer = new MutationObserver(checkDarkMode);
      observer.observe(document.body, {
        attributes: true,
        attributeFilter: ["class"]
      });
      observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["class"]
      });

      return () => observer.disconnect();
    }, []);

    // Prevent hydration mismatch by rendering a default state until mounted
    // or render with default assumption if server-side

    // Determine variant based on dark mode
    // Light mode -> "brand-charcoal" variant (aliased as 'dark')
    // Dark mode -> "brand-beige" variant (aliased as 'beige')
    // But respect explicit variants like "outline", "ghost", "link"
    const explicitVariant = (props as any).variant;
    const shouldUseAutoVariant = !explicitVariant ||
      (explicitVariant !== "outline" && explicitVariant !== "ghost" && explicitVariant !== "link");

    const variant = forceVariant ||
      (shouldUseAutoVariant ? (isDark ? "beige" : "dark") : explicitVariant);

    // If 'as' prop is provided, wrap children in that component and use asChild
    if (as) {
      const { children, ...restProps } = props;
      const AsComponent = as;

      return (
        <LoginButton
          ref={ref}
          variant={variant}
          asChild
          {...restProps}
        >
          <AsComponent {...(restProps as any)}>
            {children}
          </AsComponent>
        </LoginButton>
      );
    }

    return (
      <LoginButton
        ref={ref}
        variant={variant}
        {...props}
      />
    );
  }
);

SmartButton.displayName = "SmartButton";



























