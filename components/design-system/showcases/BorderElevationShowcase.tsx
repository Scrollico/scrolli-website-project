"use client";

import ComponentShowcase from "../ComponentShowcase";
import { Text } from "@/components/ui/typography";
import { borderRadius, border, borderWidth, elevation, surface } from "@/lib/design-tokens";
import { colors, gap, componentPadding } from "@/lib/design-tokens";
import { cn } from "@/lib/utils";

export default function BorderElevationShowcase() {
  return (
    <>
      <ComponentShowcase
        id="borders"
        title="Borders & Elevation"
        description="Border radius, border widths, and elevation/shadow tokens for consistent depth and visual hierarchy."
        demo={
          <div className={cn("w-full space-y-12", gap.xl)}>
            {/* Border Radius */}
            <div className="space-y-4">
              <Text variant="bodyLarge" className="font-semibold">Border Radius</Text>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(borderRadius).map(([key, value]) => (
                  <div key={key} className="space-y-2">
                    <div
                      className={cn(
                        "h-24 w-full",
                        value,
                        colors.primary.bg,
                        colors.border.DEFAULT,
                        "border-2"
                      )}
                    />
                    <Text variant="caption" color="muted" className="font-mono text-center block">
                      {key}: {value}
                    </Text>
                  </div>
                ))}
              </div>
            </div>

            {/* Border Widths */}
            <div className="space-y-4">
              <Text variant="bodyLarge" className="font-semibold">Border Widths</Text>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(borderWidth).map(([key, value]) => (
                  <div key={key} className="space-y-2">
                    <div
                      className={cn(
                        "h-24 w-full rounded-lg",
                        value,
                        colors.border.strong,
                        colors.background.elevated
                      )}
                    />
                    <Text variant="caption" color="muted" className="font-mono text-center block">
                      {key}: {value}
                    </Text>
                  </div>
                ))}
              </div>
            </div>

            {/* Border Styles */}
            <div className="space-y-4">
              <Text variant="bodyLarge" className="font-semibold">Border Styles</Text>
              <div className="space-y-2">
                {Object.entries(border).map(([key, value]) => (
                  <div
                    key={key}
                    className={cn(
                      "h-16 rounded-lg flex items-center justify-center",
                      value,
                      colors.background.elevated
                    )}
                  >
                    <Text variant="bodySmall" className="font-mono">
                      {key}: {value}
                    </Text>
                  </div>
                ))}
              </div>
            </div>

            {/* Elevation */}
            <div className="space-y-4">
              <Text variant="bodyLarge" className="font-semibold">Elevation (Shadows)</Text>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {Object.entries(elevation).map(([key, value]) => (
                  <div key={key} className="space-y-2">
                    <div
                      className={cn(
                        "h-24 w-full rounded-lg flex items-center justify-center",
                        value,
                        colors.background.base,
                        colors.border.light,
                        "border"
                      )}
                    >
                      <Text variant="bodySmall" className="font-semibold">
                        Level {key}
                      </Text>
                    </div>
                    <Text variant="caption" color="muted" className="font-mono text-center block">
                      {key}: {value}
                    </Text>
                  </div>
                ))}
              </div>
            </div>

            {/* Surface Styles */}
            <div className="space-y-4">
              <Text variant="bodyLarge" className="font-semibold">Surface Styles (Pre-composed)</Text>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(surface).map(([key, value]) => (
                  <div
                    key={key}
                    className={cn(
                      "h-24 rounded-lg flex items-center justify-center",
                      value,
                      componentPadding.md
                    )}
                  >
                    <Text variant="bodySmall" className="font-mono">
                      {key}: {value}
                    </Text>
                  </div>
                ))}
              </div>
            </div>
          </div>
        }
        code={`import { borderRadius, border, elevation, surface } from "@/lib/design-tokens";

// Border radius
<div className={borderRadius.lg}>Rounded</div>

// Border styles
<div className={border.thin}>Thin border</div>

// Elevation
<div className={elevation[2]}>Elevated</div>

// Surface (pre-composed)
<div className={surface.raised}>Raised surface</div>`}
      />
    </>
  );
}

















