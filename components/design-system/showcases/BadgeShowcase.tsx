"use client";

import ComponentShowcase from "../ComponentShowcase";
import { Badge } from "@/components/ui/badge";
import { gap } from "@/lib/design-tokens";
import { cn } from "@/lib/utils";

export default function BadgeShowcase() {
  return (
    <ComponentShowcase
      id="badges"
      title="Badges"
      description="Minimalist badge system inspired by Supabase. Includes subtle and solid variations for different semantic states."
      demo={
        <div className={cn("w-full space-y-8", gap.lg)}>
          {/* Subtle Variants */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Subtle (Premium)</h3>
            <div className="flex flex-wrap gap-4 items-center">
              <Badge variant="subtle">Primary</Badge>
              <Badge variant="success-subtle">Success</Badge>
              <Badge variant="warning-subtle">Warning</Badge>
              <Badge variant="destructive-subtle">Destructive</Badge>
              <Badge variant="secondary">Secondary</Badge>
            </div>
          </div>

          {/* Solid Variants */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Solid (Attention)</h3>
            <div className="flex flex-wrap gap-4 items-center">
              <Badge variant="default">Default</Badge>
              <Badge variant="success">Success</Badge>
              <Badge variant="warning">Warning</Badge>
              <Badge variant="destructive">Destructive</Badge>
              <Badge variant="outline">Outline</Badge>
            </div>
          </div>
        </div>
      }
      code={`import { Badge } from "@/components/ui/badge";
  
// Subtle variant (Periwinkle)
<Badge variant="subtle">Featured</Badge>

// Solid variant (Default Periwinkle)
<Badge>Trending</Badge>

// Semantic variants
<Badge variant="success">Verified</Badge>
`}
    />
  );
}
