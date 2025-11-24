"use client";

import ComponentShowcase from "../ComponentShowcase";
import { Text } from "@/components/ui/typography";
import { fontSize, fontWeight, lineHeight, letterSpacing, fontFamily, typography } from "@/lib/design-tokens";
import { colors, gap } from "@/lib/design-tokens";
import { cn } from "@/lib/utils";

export default function TypographyTokensShowcase() {
  return (
    <>
      <ComponentShowcase
        id="typography-tokens"
        title="Typography Tokens"
        description="Typography tokens for font sizes, weights, line heights, and letter spacing. All tokens are responsive and support dark mode."
        demo={
          <div className={cn("w-full space-y-12", gap.xl)}>
            {/* Font Sizes */}
            <div className="space-y-4">
              <Text variant="bodyLarge" className="font-semibold">Font Sizes</Text>
              <div className="space-y-3">
                {Object.entries(fontSize).map(([key, value]) => (
                  <div key={key} className={cn("border rounded p-4", colors.border.DEFAULT, colors.background.elevated)}>
                    <div className={cn(value, colors.foreground.primary)}>
                      The quick brown fox jumps over the lazy dog
                    </div>
                    <Text variant="caption" color="muted" className="mt-2 font-mono">
                      {key}: {value}
                    </Text>
                  </div>
                ))}
              </div>
            </div>

            {/* Font Weights */}
            <div className="space-y-4">
              <Text variant="bodyLarge" className="font-semibold">Font Weights</Text>
              <div className="space-y-2">
                {Object.entries(fontWeight).map(([key, value]) => (
                  <div key={key} className={cn("border rounded p-4", colors.border.DEFAULT, colors.background.elevated)}>
                    <div className={cn("text-xl", value, colors.foreground.primary)}>
                      The quick brown fox ({key})
                    </div>
                    <Text variant="caption" color="muted" className="mt-2 font-mono">
                      {key}: {value}
                    </Text>
                  </div>
                ))}
              </div>
            </div>

            {/* Line Heights */}
            <div className="space-y-4">
              <Text variant="bodyLarge" className="font-semibold">Line Heights</Text>
              <div className="space-y-2">
                {Object.entries(lineHeight).map(([key, value]) => (
                  <div key={key} className={cn("border rounded p-4 max-w-md", colors.border.DEFAULT, colors.background.elevated)}>
                    <div className={cn("text-lg", value, colors.foreground.primary)}>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                    </div>
                    <Text variant="caption" color="muted" className="mt-2 font-mono">
                      {key}: {value}
                    </Text>
                  </div>
                ))}
              </div>
            </div>

            {/* Typography Variants */}
            <div className="space-y-4">
              <Text variant="bodyLarge" className="font-semibold">Typography Variants</Text>
              <div className="space-y-3">
                {Object.entries(typography).map(([key, value]) => (
                  <div key={key} className={cn("border rounded p-4", colors.border.DEFAULT, colors.background.elevated)}>
                    <div className={cn(value, colors.foreground.primary)}>
                      {key.charAt(0).toUpperCase() + key.slice(1)} - The quick brown fox
                    </div>
                    <Text variant="caption" color="muted" className="mt-2 font-mono break-all">
                      {key}: {value}
                    </Text>
                  </div>
                ))}
              </div>
            </div>
          </div>
        }
        code={`import { fontSize, fontWeight, lineHeight, typography } from "@/lib/design-tokens";

// Font sizes
<div className={fontSize.xl}>Large text</div>

// Font weights
<div className={fontWeight.bold}>Bold text</div>

// Line heights
<div className={lineHeight.relaxed}>Relaxed line height</div>

// Typography variants (pre-composed)
<div className={typography.h1}>Heading 1</div>
<div className={typography.body}>Body text</div>`}
      />
    </>
  );
}

















