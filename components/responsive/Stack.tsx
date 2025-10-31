"use client";

import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface StackProps {
  children: ReactNode;
  spacing?: "none" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";
  direction?: "vertical" | "horizontal";
  align?: "start" | "center" | "end" | "stretch";
  justify?: "start" | "center" | "end" | "between" | "around" | "evenly";
  className?: string;
  responsive?: boolean;
}

const spacingClasses = {
  none: "gap-0",
  xs: "gap-1",
  sm: "gap-2",
  md: "gap-4",
  lg: "gap-6",
  xl: "gap-8",
  "2xl": "gap-12",
  "3xl": "gap-16",
};

const directionClasses = {
  vertical: "flex-col",
  horizontal: "flex-row",
};

const alignClasses = {
  start: "items-start",
  center: "items-center",
  end: "items-end",
  stretch: "items-stretch",
};

const justifyClasses = {
  start: "justify-start",
  center: "justify-center",
  end: "justify-end",
  between: "justify-between",
  around: "justify-around",
  evenly: "justify-evenly",
};

export function Stack({
  children,
  spacing = "md",
  direction = "vertical",
  align = "stretch",
  justify = "start",
  className,
  responsive = false
}: StackProps) {
  return (
    <div
      className={cn(
        "flex",
        directionClasses[direction],
        spacingClasses[spacing],
        alignClasses[align],
        justifyClasses[justify],
        responsive && direction === "horizontal" && "flex-col sm:flex-row",
        className
      )}
    >
      {children}
    </div>
  );
}
