"use client";

import { cn } from "@/lib/utils";
import { gap, type Gap } from "@/lib/design-tokens";
import { ReactNode } from "react";

interface StackProps {
  children: ReactNode;
  spacing?: Gap | "none";
  direction?: "vertical" | "horizontal";
  align?: "start" | "center" | "end" | "stretch";
  justify?: "start" | "center" | "end" | "between" | "around" | "evenly";
  className?: string;
  responsive?: boolean;
}

const spacingClasses: Record<Gap | "none", string> = {
  none: "gap-0",
  xs: gap.xs,
  sm: gap.sm,
  md: gap.md,
  lg: gap.lg,
  xl: gap.xl,
  "2xl": gap["2xl"],
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
