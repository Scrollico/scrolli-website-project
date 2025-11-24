"use client";

import ComponentShowcase from "../ComponentShowcase";
import { Button } from "@/components/ui/button";
import { LoginButton } from "@/components/ui/login-button";
import { gap } from "@/lib/design-tokens";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export default function ButtonShowcase() {
  return (
    <>
      <ComponentShowcase
        id="buttons"
        title="Buttons"
        description="Button component with multiple variants, sizes, and states. All variants support dark mode."
        demo={
          <div className={cn("w-full space-y-8", gap.lg)}>
            {/* Variants */}
            <div className="space-y-4">
              <div className="flex flex-wrap gap-4">
                <Button variant="default">Default</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="destructive">Destructive</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="link">Link</Button>
              </div>
            </div>

            {/* Sizes */}
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-4">
                <Button size="sm">Small</Button>
                <Button size="default">Default</Button>
                <Button size="lg">Large</Button>
                <Button size="icon">
                  <Loader2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* States */}
            <div className="space-y-4">
              <div className="flex flex-wrap gap-4">
                <Button>Normal</Button>
                <Button disabled>Disabled</Button>
                <Button>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Loading
                </Button>
              </div>
            </div>
          </div>
        }
        code={`import { Button } from "@/components/ui/button";

// Variants
<Button variant="default">Default</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="destructive">Destructive</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link</Button>

// Sizes
<Button size="sm">Small</Button>
<Button size="default">Default</Button>
<Button size="lg">Large</Button>
<Button size="icon">Icon</Button>

// States
<Button disabled>Disabled</Button>
<Button>
  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
  Loading
</Button>`}
        props={{
          "variant": {
            type: "default | secondary | destructive | outline | ghost | link",
            default: "default",
            description: "Button style variant"
          },
          "size": {
            type: "default | sm | lg | icon",
            default: "default",
            description: "Button size"
          },
          "disabled": {
            type: "boolean",
            default: "false",
            description: "Disable the button"
          },
          "asChild": {
            type: "boolean",
            default: "false",
            description: "Render as child component"
          }
        }}
      />

      <ComponentShowcase
        id="login-button"
        title="Login Button"
        description="Gradient login button with blue and dark variants, multiple sizes, width options (full/auto), and smooth hover effects. Perfect for authentication flows and primary actions."
        demo={
          <div className={cn("w-full space-y-6", gap.md)}>
            <div className="max-w-md mx-auto space-y-4">
              <div className="flex flex-wrap gap-4 items-center">
                <LoginButton variant="blue">Sign In (Blue)</LoginButton>
                <LoginButton variant="beige">Sign In (Beige)</LoginButton>
              </div>
              <div className="flex flex-wrap gap-4 items-center">
                <LoginButton variant="blue" size="md" width="auto">Default Auto</LoginButton>
                <LoginButton variant="beige" size="md" width="auto">Default Auto</LoginButton>
              </div>
            </div>
          </div>
        }
        code={`import { LoginButton } from "@/components/ui/login-button";

// Variants
<LoginButton variant="blue">Sign In</LoginButton>
<LoginButton variant="dark">Sign In</LoginButton>
<LoginButton variant="beige">Sign In</LoginButton>

// Sizes
<LoginButton size="sm">Small (36px)</LoginButton>
<LoginButton size="md">Default (44px)</LoginButton>
<LoginButton size="lg">Large (52px)</LoginButton>

// Width Variants
<LoginButton width="full">Full Width (default)</LoginButton>
<LoginButton width="auto">Auto Width</LoginButton>

// Combined
<LoginButton variant="dark" size="lg" width="auto">
  Large Dark Auto
</LoginButton>

// States
<LoginButton disabled>Disabled</LoginButton>
<LoginButton onClick={() => console.log('Clicked')}>
  Sign In
</LoginButton>`}
        props={{
          "variant": {
            type: '"blue" | "dark" | "beige"',
            default: '"blue"',
            description: "Button color variant - blue (dark gradient), dark (dark gradient), beige (light gradient)"
          },
          "size": {
            type: '"sm" | "md" | "lg"',
            default: '"md"',
            description: "Button height - sm (36px), md (44px), lg (52px)"
          },
          "width": {
            type: '"full" | "auto"',
            default: '"full"',
            description: "Button width - full for forms/modals, auto for inline/hero sections"
          },
          "children": {
            type: "ReactNode",
            default: '"Sign In"',
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
          },
          "className": {
            type: "string",
            default: "undefined",
            description: "Additional CSS classes"
          }
        }}
      />
    </>
  );
}

















