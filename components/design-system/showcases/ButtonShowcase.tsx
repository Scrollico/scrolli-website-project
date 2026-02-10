"use client";

import ComponentShowcase from "../ComponentShowcase";
import { Button } from "@/components/ui/button";
import { LoginButton } from "@/components/ui/login-button";
import { gap } from "@/lib/design-tokens";
import { cn } from "@/lib/utils";

export default function ButtonShowcase() {
  return (
    <ComponentShowcase
      id="buttons"
      title="Buttons"
      description="Gradient and solid buttons matching our brand trio: Primary Charcoal, Navbar Beige, and Success Green."
      demo={
        <div className={cn("w-full space-y-8", gap.lg)}>
          {/* Variants */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Signature Actions (Gradients)</h3>
            <div className="flex flex-wrap gap-4 items-center">
              <Button variant="brand-charcoal">Charcoal (Inevitable Dark)</Button>
              <Button variant="brand-beige">Beige (Inevitable Light)</Button>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Semantic Variants</h3>
            <div className="flex flex-wrap gap-4 items-center">
              <Button variant="success">Success Green</Button>
              <Button variant="secondary">Secondary (Muted)</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="destructive">Destructive</Button>
              <Button variant="link">Link</Button>
            </div>
          </div>

          {/* Sizes */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Sizes</h3>
            <div className="flex flex-wrap gap-4 items-center">
              <Button size="sm">Subscribe (Small)</Button>
              <Button size="default">Sign In (Default)</Button>
              <Button size="lg">Sign In (Large)</Button>
            </div>
          </div>

          {/* States */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">States</h3>
            <div className="flex flex-wrap gap-4 items-center">
              <Button variant="default">Active</Button>
              <Button variant="default" disabled>Disabled</Button>
            </div>
          </div>
        </div>
      }
      code={`import { Button } from "@/components/ui/button";
import { SmartButton } from "@/components/ui/smart-button";

// Signature Actions (The "Inevitable" Gradients)
<Button variant="brand-charcoal">Sign In</Button>
<Button variant="brand-beige">Subscribe</Button>

// SmartButton (Theme-aware switch between charcoal/beige)
<SmartButton>Premium Action</SmartButton>

// Semantic Variants
<Button variant="success">Save Changes</Button>
<Button variant="outline">Learn More</Button>
<Button variant="ghost">Cancel</Button>

// Sizes
<Button size="sm">Small</Button>
<Button size="default">Medium</Button>
<Button size="lg">Large</Button>`}
      props={{
        "variant": {
          type: '"default" | "brand-charcoal" | "brand-beige" | "success" | "secondary" | "outline" | "ghost" | "destructive" | "link"',
          default: '"default"',
          description: "Button style variant. 'default' and 'brand-charcoal' use the signature dark gradient."
        },
        "size": {
          type: '"default" | "sm" | "lg" | "icon"',
          default: '"default"',
          description: "Button size scale."
        },
        "children": {
          type: "ReactNode",
          default: "undefined",
          description: "Button content"
        },
        "disabled": {
          type: "boolean",
          default: "false",
          description: "Disable the button"
        },
        "onClick": {
          type: "() => void",
          default: "undefined",
          description: "Click handler function"
        }
      }}
    />
  );
}



