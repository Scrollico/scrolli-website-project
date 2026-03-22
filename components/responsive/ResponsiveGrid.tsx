"use client";

import { cn } from "@/lib/utils";
import { gap as gapTokens } from "@/lib/design-tokens";
import { ReactNode } from "react";

interface ResponsiveGridProps {
  children: ReactNode;
  columns?: {
    default?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  gap?: "none" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";
  className?: string;
}

const gapClasses = {
  none: "gap-0",
  xs: gapTokens.xs,
  sm: gapTokens.sm,
  md: gapTokens.md,
  lg: gapTokens.lg,
  xl: gapTokens.xl,
  "2xl": gapTokens["2xl"],
  "3xl": "gap-20", // Extended size beyond token system
};

function getGridCols(columns: ResponsiveGridProps["columns"] = {}) {
  const { default: def = 1, sm = def, md = sm, lg = md, xl = lg } = columns;

  return cn(
    `grid-cols-${def}`,
    sm !== def && `sm:grid-cols-${sm}`,
    md !== sm && `md:grid-cols-${md}`,
    lg !== md && `lg:grid-cols-${lg}`,
    xl !== lg && `xl:grid-cols-${xl}`
  );
}

export function ResponsiveGrid({
  children,
  columns = { default: 1, md: 2, lg: 3 },
  gap = "md",
  className
}: ResponsiveGridProps) {
  return (
    <div
      className={cn(
        "grid",
        getGridCols(columns),
        gapClasses[gap],
        className
      )}
    >
      {children}
    </div>
  );
}
