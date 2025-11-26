"use client";

import React, { useEffect, useState } from "react";
import { LoginButton, LoginButtonProps } from "@/components/ui/login-button";

export interface SmartButtonProps extends Omit<LoginButtonProps, "variant"> {
  // Optional override if needed, otherwise it's automatic
  forceVariant?: "blue" | "dark" | "beige";
}

export const SmartButton = React.forwardRef<HTMLButtonElement, SmartButtonProps>(
  ({ forceVariant, ...props }, ref) => {
    const [isDark, setIsDark] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
      setMounted(true);
      
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
    // Light mode -> "dark" variant
    // Dark mode -> "beige" variant
    const variant = forceVariant || (isDark ? "beige" : "dark");

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






