"use client";

import ComponentShowcase from "../ComponentShowcase";
import { Text } from "@/components/ui/typography";
import { colors, gap } from "@/lib/design-tokens";
import { cn } from "@/lib/utils";

export default function ColorsShowcase() {
  const colorSwatches = [
    { name: "Primary", token: colors.primary.bg, hex: "#3500FD", description: "Scrolli Blue - Main brand color" },
    { name: "Secondary", token: colors.secondary.bg, hex: "#8080FF", description: "Violet Blue - Secondary brand color" },
    { name: "Success", token: colors.success.bg, hex: "Green", description: "Success states" },
    { name: "Warning", token: colors.warning.bg, hex: "Yellow", description: "Warning states" },
    { name: "Error", token: colors.error.bg, hex: "Red", description: "Error states" },
  ];

  const backgroundSwatches = [
    { name: "Base", token: colors.background.base, description: "Main background" },
    { name: "Elevated", token: colors.background.elevated, description: "Cards, panels" },
    { name: "Overlay", token: colors.background.overlay, description: "Modals, overlays" },
    { name: "Navbar", token: colors.background.navbar, description: "Navbar beige (#F8F5E4)" },
  ];

  const foregroundSwatches = [
    { name: "Primary", token: colors.foreground.primary, description: "Main text" },
    { name: "Secondary", token: colors.foreground.secondary, description: "Secondary text" },
    { name: "Muted", token: colors.foreground.muted, description: "Muted text" },
    { name: "Disabled", token: colors.foreground.disabled, description: "Disabled text" },
  ];

  return (
    <>
      <ComponentShowcase
        id="colors"
        title="Colors"
        description="Scrolli brand colors and semantic color tokens. All colors support dark mode automatically."
        demo={
          <div className={cn("w-full space-y-12", gap.xl)}>
            {/* Brand Colors */}
            <div className="space-y-4">
              <Text variant="bodyLarge" className="font-semibold">Brand Colors</Text>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {colorSwatches.map((color) => (
                  <div key={color.name} className="space-y-2">
                    <div
                      className={cn(
                        "h-24 rounded-lg border",
                        color.token,
                        colors.border.DEFAULT
                      )}
                    />
                    <div>
                      <Text variant="bodySmall" className="font-semibold">{color.name}</Text>
                      <Text variant="caption" color="muted">{color.hex}</Text>
                      <Text variant="caption" color="muted" className="block mt-1">
                        {color.description}
                      </Text>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Background Colors */}
            <div className="space-y-4">
              <Text variant="bodyLarge" className="font-semibold">Background Colors</Text>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {backgroundSwatches.map((bg) => (
                  <div key={bg.name} className="space-y-2">
                    <div
                      className={cn(
                        "h-24 rounded-lg border",
                        bg.token,
                        colors.border.DEFAULT
                      )}
                    />
                    <div>
                      <Text variant="bodySmall" className="font-semibold">{bg.name}</Text>
                      <Text variant="caption" color="muted" className="block mt-1">
                        {bg.description}
                      </Text>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Foreground Colors */}
            <div className="space-y-4">
              <Text variant="bodyLarge" className="font-semibold">Foreground Colors</Text>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {foregroundSwatches.map((fg) => (
                  <div key={fg.name} className="space-y-2">
                    <div
                      className={cn(
                        "h-24 rounded-lg border flex items-center justify-center",
                        colors.background.elevated,
                        colors.border.DEFAULT,
                        fg.token
                      )}
                    >
                      <Text className={fg.token}>Sample Text</Text>
                    </div>
                    <div>
                      <Text variant="bodySmall" className="font-semibold">{fg.name}</Text>
                      <Text variant="caption" color="muted" className="block mt-1">
                        {fg.description}
                      </Text>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        }
        code={`import { colors } from "@/lib/design-tokens";

// Brand colors
<div className={colors.primary.bg}>Primary</div>
<div className={colors.secondary.bg}>Secondary</div>

// Backgrounds
<div className={colors.background.base}>Base</div>
<div className={colors.background.elevated}>Elevated</div>
<div className={colors.background.navbar}>Navbar</div>

// Foreground
<div className={colors.foreground.primary}>Primary text</div>
<div className={colors.foreground.secondary}>Secondary text</div>
<div className={colors.foreground.muted}>Muted text</div>`}
      />
    </>
  );
}










