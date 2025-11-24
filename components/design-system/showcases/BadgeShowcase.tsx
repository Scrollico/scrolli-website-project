"use client";

import ComponentShowcase from "../ComponentShowcase";
import { Badge, BadgeDot } from "@/components/ui/badge";
import { gap } from "@/lib/design-tokens";
import { cn } from "@/lib/utils";

export default function BadgeShowcase() {
  return (
    <>
      <ComponentShowcase
        id="badges"
        title="Badges"
        description="Badge component for categories, tags, and status indicators. Supports multiple variants, appearances, and sizes."
        demo={
          <div className={cn("w-full space-y-8", gap.lg)}>
            {/* Variants */}
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Badge variant="primary">Primary</Badge>
                <Badge variant="secondary">Secondary</Badge>
                <Badge variant="success">Success</Badge>
                <Badge variant="warning">Warning</Badge>
                <Badge variant="info">Info</Badge>
                <Badge variant="destructive">Destructive</Badge>
                <Badge variant="outline">Outline</Badge>
              </div>
            </div>

            {/* Appearances */}
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Badge variant="primary" appearance="default">Default</Badge>
                <Badge variant="primary" appearance="light">Light</Badge>
                <Badge variant="primary" appearance="outline">Outline</Badge>
                <Badge variant="primary" appearance="ghost">Ghost</Badge>
              </div>
            </div>

            {/* Sizes */}
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <Badge size="xs">Extra Small</Badge>
                <Badge size="sm">Small</Badge>
                <Badge size="md">Medium</Badge>
                <Badge size="lg">Large</Badge>
              </div>
            </div>

            {/* With Dot */}
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Badge variant="primary">
                  <BadgeDot />
                  With Dot
                </Badge>
                <Badge variant="success">
                  <BadgeDot />
                  Active
                </Badge>
              </div>
            </div>

            {/* Disabled */}
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Badge variant="primary" disabled>Disabled</Badge>
                <Badge variant="secondary" disabled>Disabled</Badge>
              </div>
            </div>
          </div>
        }
        code={`import { Badge, BadgeDot } from "@/components/ui/badge";

// Variants
<Badge variant="primary">Primary</Badge>
<Badge variant="secondary">Secondary</Badge>
<Badge variant="success">Success</Badge>

// Appearances
<Badge variant="primary" appearance="default">Default</Badge>
<Badge variant="primary" appearance="light">Light</Badge>
<Badge variant="primary" appearance="outline">Outline</Badge>
<Badge variant="primary" appearance="ghost">Ghost</Badge>

// Sizes
<Badge size="xs">Extra Small</Badge>
<Badge size="sm">Small</Badge>
<Badge size="md">Medium</Badge>
<Badge size="lg">Large</Badge>

// With Dot
<Badge variant="primary">
  <BadgeDot />
  With Dot
</Badge>`}
        props={{
          "variant": {
            type: "primary | secondary | success | warning | info | destructive | outline",
            default: "primary",
            description: "Badge color variant"
          },
          "appearance": {
            type: "default | light | outline | ghost",
            default: "default",
            description: "Badge appearance style"
          },
          "size": {
            type: "xs | sm | md | lg",
            default: "md",
            description: "Badge size"
          },
          "disabled": {
            type: "boolean",
            default: "false",
            description: "Disable the badge"
          },
          "shape": {
            type: "default | circle",
            default: "default",
            description: "Badge shape"
          }
        }}
      />
    </>
  );
}

















