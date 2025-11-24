"use client";

import { Heading, Text } from "@/components/ui/typography";
import { colors, sectionPadding, containerPadding, gap } from "@/lib/design-tokens";
import { cn } from "@/lib/utils";

export default function Guidelines() {
  return (
    <section
      id="guidelines"
      className={cn(
        sectionPadding.lg,
        colors.background.base,
        "scroll-mt-20"
      )}
    >
      <div className={cn(containerPadding.lg, "max-w-7xl mx-auto")}>
        <div className={cn("mb-8", gap.md)}>
          <Heading level={2} variant="h2">Guidelines</Heading>
          <Text variant="bodyLarge" color="secondary" className="max-w-3xl">
            Design system principles, usage guidelines, and best practices for building
            consistent, accessible, and maintainable interfaces.
          </Text>
        </div>

        <div className={cn("space-y-12", gap.xl)}>
          {/* Design Tokens */}
          <div className="space-y-4">
            <Heading level={3} variant="h3">Design Tokens</Heading>
            <div className={cn("space-y-3", gap.md)}>
              <Text variant="body">
                Always use design tokens instead of hardcoded values. Design tokens ensure
                consistency, support dark mode automatically, and make global changes easier.
              </Text>
              <div className={cn("p-4 rounded-lg border", colors.background.elevated, colors.border.DEFAULT)}>
                <Text variant="bodySmall" className="font-mono mb-2">✅ Correct:</Text>
                <Text variant="bodySmall" className="font-mono text-green-600 dark:text-green-400">
                  {`import { colors } from "@/lib/design-tokens";`}
                </Text>
                <Text variant="bodySmall" className="font-mono text-green-600 dark:text-green-400">
                  {`<div className={colors.background.base}>`}
                </Text>
                <Text variant="bodySmall" className="font-mono mt-4 mb-2">❌ Incorrect:</Text>
                <Text variant="bodySmall" className="font-mono text-red-600 dark:text-red-400">
                  {`<div className="bg-white dark:bg-gray-900">`}
                </Text>
              </div>
            </div>
          </div>

          {/* Dark Mode */}
          <div className="space-y-4">
            <Heading level={3} variant="h3">Dark Mode</Heading>
            <div className={cn("space-y-3", gap.md)}>
              <Text variant="body">
                All components must support dark mode. Use design tokens which include dark mode
                variants automatically. Never hardcode colors without dark mode support.
              </Text>
              <ul className={cn("list-disc list-inside space-y-2", colors.foreground.secondary)}>
                <li>Always use design tokens for colors</li>
                <li>Test components in both light and dark modes</li>
                <li>Ensure proper contrast ratios</li>
                <li>Verify no white backgrounds "shine" in dark mode</li>
              </ul>
            </div>
          </div>

          {/* Accessibility */}
          <div className="space-y-4">
            <Heading level={3} variant="h3">Accessibility</Heading>
            <div className={cn("space-y-3", gap.md)}>
              <Text variant="body">
                Follow WCAG 2.1 AA standards for accessibility. All interactive components must
                be keyboard navigable and screen reader friendly.
              </Text>
              <ul className={cn("list-disc list-inside space-y-2", colors.foreground.secondary)}>
                <li>Use semantic HTML elements</li>
                <li>Provide proper ARIA labels</li>
                <li>Ensure keyboard navigation works</li>
                <li>Maintain proper color contrast ratios</li>
                <li>Test with screen readers</li>
              </ul>
            </div>
          </div>

          {/* Responsive Design */}
          <div className="space-y-4">
            <Heading level={3} variant="h3">Responsive Design</Heading>
            <div className={cn("space-y-3", gap.md)}>
              <Text variant="body">
                All components are mobile-first and responsive. Use responsive design tokens
                and test on multiple screen sizes.
              </Text>
              <ul className={cn("list-disc list-inside space-y-2", colors.foreground.secondary)}>
                <li>Mobile-first approach</li>
                <li>Use responsive breakpoints consistently</li>
                <li>Test on mobile, tablet, and desktop</li>
                <li>Use responsive spacing tokens</li>
              </ul>
            </div>
          </div>

          {/* Component Composition */}
          <div className="space-y-4">
            <Heading level={3} variant="h3">Component Composition</Heading>
            <div className={cn("space-y-3", gap.md)}>
              <Text variant="body">
                Build complex components by composing simpler ones. Keep components focused
                and reusable.
              </Text>
              <ul className={cn("list-disc list-inside space-y-2", colors.foreground.secondary)}>
                <li>Compose components from base elements</li>
                <li>Keep components single-purpose</li>
                <li>Make components reusable</li>
                <li>Use TypeScript for type safety</li>
              </ul>
            </div>
          </div>

          {/* Best Practices */}
          <div className="space-y-4">
            <Heading level={3} variant="h3">Best Practices</Heading>
            <div className={cn("space-y-3", gap.md)}>
              <ul className={cn("list-disc list-inside space-y-2", colors.foreground.secondary)}>
                <li>Import design tokens from <code className="font-mono text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded">@/lib/design-tokens</code></li>
                <li>Use <code className="font-mono text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded">cn()</code> utility for conditional classes</li>
                <li>Follow naming conventions (PascalCase for components)</li>
                <li>Export components with proper TypeScript types</li>
                <li>Document component props and usage</li>
                <li>Test components in isolation</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

















