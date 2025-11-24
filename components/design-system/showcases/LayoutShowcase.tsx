"use client";

import ComponentShowcase from "../ComponentShowcase";
import { Container } from "@/components/responsive";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Text } from "@/components/ui/typography";
import { colors, gap, sectionPadding } from "@/lib/design-tokens";
import { cn } from "@/lib/utils";

export default function LayoutShowcase() {
  return (
    <>
      <ComponentShowcase
        id="layout"
        title="Layout Components"
        description="Layout components including Container and SectionHeader for consistent page structure and spacing."
        demo={
          <div className={cn("w-full space-y-12", gap.xl)}>
            {/* Container Sizes */}
            <div className={cn("space-y-4", sectionPadding.md, colors.background.elevated, "rounded-lg")}>
              <Text variant="bodyLarge" className="font-semibold mb-4">Container Sizes</Text>
              <div className="space-y-4">
                <div className={cn("border rounded p-4", colors.border.DEFAULT)}>
                  <Container size="sm" padding="md">
                    <Text variant="bodySmall" className="font-mono">size="sm" (max-w-4xl)</Text>
                  </Container>
                </div>
                <div className={cn("border rounded p-4", colors.border.DEFAULT)}>
                  <Container size="md" padding="md">
                    <Text variant="bodySmall" className="font-mono">size="md" (max-w-5xl)</Text>
                  </Container>
                </div>
                <div className={cn("border rounded p-4", colors.border.DEFAULT)}>
                  <Container size="lg" padding="md">
                    <Text variant="bodySmall" className="font-mono">size="lg" (max-w-6xl)</Text>
                  </Container>
                </div>
                <div className={cn("border rounded p-4", colors.border.DEFAULT)}>
                  <Container size="xl" padding="md">
                    <Text variant="bodySmall" className="font-mono">size="xl" (max-w-7xl)</Text>
                  </Container>
                </div>
              </div>
            </div>

            {/* SectionHeader */}
            <div className={cn("space-y-4", sectionPadding.md, colors.background.elevated, "rounded-lg")}>
              <Text variant="bodyLarge" className="font-semibold mb-4">SectionHeader</Text>
              <SectionHeader
                title="Section Title"
                subtitle="Optional Subtitle"
                description="Optional description text that provides more context about the section."
                showUnderline={true}
              />
              <SectionHeader
                title="Without Underline"
                showUnderline={false}
              />
              <SectionHeader
                title="With Custom Variant"
                variant="h3"
                level={3}
              />
            </div>
          </div>
        }
        code={`import { Container } from "@/components/responsive";
import { SectionHeader } from "@/components/ui/SectionHeader";

// Container
<Container size="lg" padding="md">
  Content here
</Container>

// SectionHeader
<SectionHeader
  title="Section Title"
  subtitle="Optional Subtitle"
  description="Optional description"
  showUnderline={true}
/>`}
        props={{
          "Container": {
            type: "ContainerProps",
            default: "—",
            description: "Responsive container component"
          },
          "size": {
            type: "sm | md | lg | xl | full",
            default: "lg",
            description: "Container max width"
          },
          "padding": {
            type: "ContainerPadding",
            default: "md",
            description: "Horizontal padding"
          },
          "SectionHeader": {
            type: "SectionHeaderProps",
            default: "—",
            description: "Section header component"
          },
          "title": {
            type: "string",
            default: "—",
            description: "Section title (required)"
          },
          "subtitle": {
            type: "string",
            default: "undefined",
            description: "Optional subtitle"
          },
          "description": {
            type: "string",
            default: "undefined",
            description: "Optional description"
          },
          "showUnderline": {
            type: "boolean",
            default: "true",
            description: "Show decorative underline"
          }
        }}
      />
    </>
  );
}

















