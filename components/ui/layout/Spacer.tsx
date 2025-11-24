"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { margin, type Gap } from "@/lib/design-tokens";

export interface SpacerProps {
  size?: Gap | "none";
  axis?: "x" | "y" | "both";
  className?: string;
}

const marginMap: Record<Gap | "none", string> = {
  none: margin.none,
  xs: margin.xs,
  sm: margin.sm,
  md: margin.md,
  lg: margin.lg,
  xl: margin.xl,
  "2xl": margin.xl, // Use xl as max for spacer
};

export const Spacer = React.forwardRef<HTMLDivElement, SpacerProps>(
  ({ size = "md", axis = "y", className, ...props }, ref) => {
    const baseMargin = marginMap[size];
    
    const axisClasses = {
      x: baseMargin.replace("m-", "mx-").replace("md:m-", "md:mx-"),
      y: baseMargin.replace("m-", "my-").replace("md:m-", "md:my-"),
      both: baseMargin,
    };

    return (
      <div
        ref={ref}
        className={cn(axisClasses[axis], className)}
        {...props}
      />
    );
  }
);

Spacer.displayName = "Spacer";

export default Spacer;


















