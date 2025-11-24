"use client";

import ComponentShowcase from "../ComponentShowcase";
import { Heading, Text, Label, Caption } from "@/components/ui/typography";
import { gap } from "@/lib/design-tokens";
import { cn } from "@/lib/utils";

export default function TypographyShowcase() {
  return (
    <>
      <ComponentShowcase
        id="typography"
        title="Typography"
        description="Consistent typography system using Heading, Text, Label, and Caption components. All variants support dark mode and responsive sizing."
        demo={
          <div className={cn("w-full space-y-8", gap.lg)}>
            {/* Headings */}
            <div className="space-y-4">
              <Heading level={1} variant="h1">Heading 1</Heading>
              <Heading level={2} variant="h2">Heading 2</Heading>
              <Heading level={3} variant="h3">Heading 3</Heading>
              <Heading level={4} variant="h4">Heading 4</Heading>
              <Heading level={5} variant="h5">Heading 5</Heading>
              <Heading level={6} variant="h6">Heading 6</Heading>
            </div>

            {/* Text Variants */}
            <div className="space-y-2">
              <Text variant="bodyLarge">Body Large - Lorem ipsum dolor sit amet</Text>
              <Text variant="body">Body - Lorem ipsum dolor sit amet, consectetur adipiscing elit</Text>
              <Text variant="bodySmall">Body Small - Lorem ipsum dolor sit amet</Text>
            </div>

            {/* Colors */}
            <div className="space-y-2">
              <Text color="primary">Primary text color</Text>
              <Text color="secondary">Secondary text color</Text>
              <Text color="muted">Muted text color</Text>
              <Text color="disabled">Disabled text color</Text>
            </div>

            {/* Label and Caption */}
            <div className="space-y-2">
              <Label>Label text</Label>
              <Caption>Caption text</Caption>
            </div>
          </div>
        }
        code={`import { Heading, Text, Label, Caption } from "@/components/ui/typography";

// Headings
<Heading level={1} variant="h1">Heading 1</Heading>
<Heading level={2} variant="h2">Heading 2</Heading>

// Text variants
<Text variant="bodyLarge">Body Large</Text>
<Text variant="body">Body</Text>
<Text variant="bodySmall">Body Small</Text>

// Colors
<Text color="primary">Primary</Text>
<Text color="secondary">Secondary</Text>
<Text color="muted">Muted</Text>

// Label and Caption
<Label>Label</Label>
<Caption>Caption</Caption>`}
        props={{
          "level": {
            type: "1 | 2 | 3 | 4 | 5 | 6",
            default: "1",
            description: "Semantic heading level (for SEO)"
          },
          "variant": {
            type: "h1 | h2 | h3 | h4 | h5 | h6 | body | bodyLarge | bodySmall | caption",
            default: "h1",
            description: "Visual variant"
          },
          "color": {
            type: "primary | secondary | muted | disabled",
            default: "primary",
            description: "Text color variant"
          },
          "as": {
            type: "h1 | h2 | h3 | h4 | h5 | h6 | p | span | div | a",
            default: "p",
            description: "HTML element to render"
          }
        }}
      />
    </>
  );
}

















