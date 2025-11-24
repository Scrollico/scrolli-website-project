"use client";

import ComponentShowcase from "../ComponentShowcase";
import { Text } from "@/components/ui/typography";
import { sectionPadding, containerPadding, componentPadding, gap, margin } from "@/lib/design-tokens";
import { colors, borderRadius } from "@/lib/design-tokens";
import { cn } from "@/lib/utils";

export default function SpacingShowcase() {
  return (
    <>
      <ComponentShowcase
        id="spacing"
        title="Spacing"
        description="Consistent spacing tokens for sections, containers, components, and gaps. All spacing is responsive and mobile-first."
        demo={
          <div className={cn("w-full space-y-12")}>
            {/* Section Padding */}
            <div className="space-y-4">
              <Text variant="bodyLarge" className="font-semibold">Section Padding</Text>
              <div className="space-y-2">
                {Object.entries(sectionPadding).map(([key, value]) => (
                  <div key={key} className={cn("border rounded", colors.border.DEFAULT)}>
                    <div className={cn(value, colors.background.elevated)}>
                      <div className={cn("text-center py-2", colors.foreground.primary)}>
                        <Text variant="bodySmall" className="font-mono">{key}: {value}</Text>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Container Padding */}
            <div className="space-y-4">
              <Text variant="bodyLarge" className="font-semibold">Container Padding</Text>
              <div className="space-y-2">
                {Object.entries(containerPadding).map(([key, value]) => (
                  <div key={key} className={cn("border rounded", colors.border.DEFAULT)}>
                    <div className={cn(value, colors.background.elevated)}>
                      <div className={cn("text-center py-2", colors.foreground.primary)}>
                        <Text variant="bodySmall" className="font-mono">{key}: {value}</Text>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Component Padding */}
            <div className="space-y-4">
              <Text variant="bodyLarge" className="font-semibold">Component Padding</Text>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {Object.entries(componentPadding).map(([key, value]) => (
                  <div key={key} className={cn("border rounded", colors.border.DEFAULT)}>
                    <div className={cn(value, colors.background.elevated, "text-center")}>
                      <Text variant="bodySmall" className="font-mono">{key}</Text>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Gap */}
            <div className="space-y-4">
              <Text variant="bodyLarge" className="font-semibold">Gap (Flex/Grid Spacing)</Text>
              <div className="space-y-2">
                {Object.entries(gap).map(([key, value]) => (
                  <div key={key} className={cn("flex", value, colors.background.elevated, "p-4 border rounded", colors.border.DEFAULT)}>
                    <div className={cn("w-12 h-12 rounded", colors.primary.bg)} />
                    <div className={cn("w-12 h-12 rounded", colors.secondary.bg)} />
                    <div className="ml-auto">
                      <Text variant="bodySmall" className="font-mono">{key}: {value}</Text>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        }
        code={`import { sectionPadding, containerPadding, componentPadding, gap } from "@/lib/design-tokens";

// Section padding
<section className={sectionPadding.md}>Content</section>

// Container padding
<div className={containerPadding.lg}>Content</div>

// Component padding
<div className={componentPadding.md}>Content</div>

// Gap spacing
<div className={cn("flex", gap.md)}>
  <div>Item 1</div>
  <div>Item 2</div>
</div>`}
      />
    </>
  );
}










