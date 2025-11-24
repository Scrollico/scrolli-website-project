"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { surface, borderRadius, componentPadding, elevation } from "@/lib/design-tokens";
import type { BorderRadius, Elevation } from "@/lib/design-tokens";

export interface SurfaceProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "flat" | "raised" | "floating" | "modal";
  elevation?: Elevation;
  radius?: BorderRadius;
  padding?: "xs" | "sm" | "md" | "lg" | "xl" | "none";
  interactive?: boolean;
}

const surfaceVariants = {
  flat: surface.flat,
  raised: surface.raised,
  floating: surface.floating,
  modal: surface.modal,
};

const paddingMap = {
  none: "",
  xs: componentPadding.xs,
  sm: componentPadding.sm,
  md: componentPadding.md,
  lg: componentPadding.lg,
  xl: componentPadding.xl,
};

export const Surface = React.forwardRef<HTMLDivElement, SurfaceProps>(
  (
    {
      variant = "raised",
      elevation: elevationLevel,
      radius = "lg",
      padding = "md",
      interactive = false,
      className,
      children,
      ...props
    },
    ref
  ) => {
    // Use variant surface or custom elevation
    const surfaceClass = elevationLevel 
      ? `${elevation[elevationLevel]} ${borderRadius[radius]}`
      : surfaceVariants[variant];
    
    const paddingClass = padding !== "none" ? paddingMap[padding] : "";
    
    return (
      <div
        ref={ref}
        className={cn(
          surfaceClass,
          paddingClass,
          interactive && "cursor-pointer transition-all duration-200 hover:shadow-lg",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Surface.displayName = "Surface";

export default Surface;


















