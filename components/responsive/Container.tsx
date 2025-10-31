"use client";

import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface ContainerProps {
  children: ReactNode;
  size?: "sm" | "md" | "lg" | "xl" | "full";
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
  className,
  center = true
}: ContainerProps) {
  return (
    <div
      className={cn(
        "w-full px-4 sm:px-6 lg:px-8",
        center && "mx-auto",
        sizeClasses[size],
        className
      )}
    >
      {children}
    </div>
  );
}
