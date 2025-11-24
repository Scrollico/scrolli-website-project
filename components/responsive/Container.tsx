"use client";

import { cn } from "@/lib/utils";
import { containerPadding, type ContainerPadding } from "@/lib/design-tokens";
import { ReactNode } from "react";

interface ContainerProps {
  children: ReactNode;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  padding?: ContainerPadding;
  className?: string;
  center?: boolean;
}

const sizeClasses = {
  sm: "max-w-4xl", // ~56rem
  md: "max-w-5xl", // ~64rem
  lg: "max-w-6xl", // ~72rem
  xl: "max-w-7xl", // ~80rem
  full: "max-w-full",
};

export function Container({
  children,
  size = "lg",
  padding = "md",
  className,
  center = true
}: ContainerProps) {
  return (
    <div
      className={cn(
        "w-full",
        containerPadding[padding],
        center && "mx-auto",
        sizeClasses[size],
        className
      )}
    >
      {children}
    </div>
  );
}
