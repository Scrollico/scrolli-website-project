"use client";

import ComponentShowcase from "../ComponentShowcase";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Text } from "@/components/ui/typography";
import { colors, gap, states } from "@/lib/design-tokens";
import { cn } from "@/lib/utils";

export default function TabsShowcase() {
  return (
    <>
      <ComponentShowcase
        id="tabs"
        title="Tabs"
        description="Tab component built with Radix UI. Supports keyboard navigation and accessibility features."
        demo={
          <div className={cn("w-full space-y-8", gap.lg)}>
            {/* Basic Tabs */}
            <Tabs defaultValue="tab1" className="w-full max-w-2xl">
              <TabsList className="bg-transparent p-0 h-auto gap-2">
                <TabsTrigger
                  value="tab1"
                  className={cn(
                    "rounded-lg px-4 py-2 border",
                    colors.surface.elevated,
                    colors.border.light,
                    colors.foreground.secondary,
                    states.tab.base,
                    states.tab.activeBackground,
                    states.tab.activeText,
                    states.tab.inactiveText
                  )}
                >
                  Tab 1
                </TabsTrigger>
                <TabsTrigger
                  value="tab2"
                  className={cn(
                    "rounded-lg px-4 py-2 border",
                    colors.surface.elevated,
                    colors.border.light,
                    colors.foreground.secondary,
                    states.tab.base,
                    states.tab.activeBackground,
                    states.tab.activeText,
                    states.tab.inactiveText
                  )}
                >
                  Tab 2
                </TabsTrigger>
                <TabsTrigger
                  value="tab3"
                  className={cn(
                    "rounded-lg px-4 py-2 border",
                    colors.surface.elevated,
                    colors.border.light,
                    colors.foreground.secondary,
                    states.tab.base,
                    states.tab.activeBackground,
                    states.tab.activeText,
                    states.tab.inactiveText
                  )}
                >
                  Tab 3
                </TabsTrigger>
              </TabsList>
              <TabsContent value="tab1" className="mt-4">
                <Text>Content for Tab 1</Text>
              </TabsContent>
              <TabsContent value="tab2" className="mt-4">
                <Text>Content for Tab 2</Text>
              </TabsContent>
              <TabsContent value="tab3" className="mt-4">
                <Text>Content for Tab 3</Text>
              </TabsContent>
            </Tabs>
          </div>
        }
        code={`import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

<Tabs defaultValue="tab1">
  <TabsList>
    <TabsTrigger value="tab1">Tab 1</TabsTrigger>
    <TabsTrigger value="tab2">Tab 2</TabsTrigger>
    <TabsTrigger value="tab3">Tab 3</TabsTrigger>
  </TabsList>
  <TabsContent value="tab1">
    Content for Tab 1
  </TabsContent>
  <TabsContent value="tab2">
    Content for Tab 2
  </TabsContent>
  <TabsContent value="tab3">
    Content for Tab 3
  </TabsContent>
</Tabs>`}
        props={{
          "Tabs": {
            type: "TabsPrimitive.Root props",
            default: "—",
            description: "Root tabs component"
          },
          "TabsList": {
            type: "React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>",
            default: "—",
            description: "Container for tab triggers"
          },
          "TabsTrigger": {
            type: "React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>",
            default: "—",
            description: "Individual tab trigger button"
          },
          "TabsContent": {
            type: "React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>",
            default: "—",
            description: "Tab panel content"
          },
          "defaultValue": {
            type: "string",
            default: "—",
            description: "Default active tab value"
          },
          "value": {
            type: "string",
            default: "—",
            description: "Controlled active tab value"
          }
        }}
      />
    </>
  );
}

