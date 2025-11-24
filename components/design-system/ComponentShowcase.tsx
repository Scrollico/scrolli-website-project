"use client";

import { ReactNode } from "react";
import { Heading, Text } from "@/components/ui/typography";
import CodeBlock from "./CodeBlock";
import { colors, sectionPadding, containerPadding, gap } from "@/lib/design-tokens";
import { cn } from "@/lib/utils";

interface ComponentShowcaseProps {
  id: string;
  title: string;
  description?: string;
  demo: ReactNode;
  code?: string;
  codeLanguage?: string;
  props?: Record<string, any>;
  className?: string;
}

export default function ComponentShowcase({
  id,
  title,
  description,
  demo,
  code,
  codeLanguage = "tsx",
  props,
  className,
}: ComponentShowcaseProps) {
  return (
    <section
      id={id}
      className={cn(
        sectionPadding.md,
        colors.background.base,
        "scroll-mt-20",
        className
      )}
    >
      <div className={cn(containerPadding.lg, "max-w-7xl mx-auto")}>
        {/* Header */}
        <div className={cn("mb-8", gap.md)}>
          <Heading level={2} variant="h2" id={id}>
            {title}
          </Heading>
          {description && (
            <Text variant="bodyLarge" color="secondary" className="max-w-3xl">
              {description}
            </Text>
          )}
        </div>

        {/* Demo */}
        <div className={cn(
          "mb-8 p-8 rounded-lg border",
          colors.background.elevated,
          colors.border.DEFAULT
        )}>
          <div className="flex items-center justify-center min-h-[200px]">
            {demo}
          </div>
        </div>

        {/* Props Table */}
        {props && Object.keys(props).length > 0 && (
          <div className={cn("mb-8 overflow-x-auto")}>
            <table className={cn(
              "w-full border-collapse",
              colors.border.DEFAULT,
              "border"
            )}>
              <thead>
                <tr className={cn(colors.background.elevated)}>
                  <th className={cn(
                    "text-left p-4 border-b",
                    colors.border.DEFAULT,
                    colors.foreground.primary,
                    "font-semibold"
                  )}>
                    Prop
                  </th>
                  <th className={cn(
                    "text-left p-4 border-b",
                    colors.border.DEFAULT,
                    colors.foreground.primary,
                    "font-semibold"
                  )}>
                    Type
                  </th>
                  <th className={cn(
                    "text-left p-4 border-b",
                    colors.border.DEFAULT,
                    colors.foreground.primary,
                    "font-semibold"
                  )}>
                    Default
                  </th>
                  <th className={cn(
                    "text-left p-4 border-b",
                    colors.border.DEFAULT,
                    colors.foreground.primary,
                    "font-semibold"
                  )}>
                    Description
                  </th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(props).map(([prop, details]: [string, any]) => (
                  <tr
                    key={prop}
                    className={cn(
                      "border-b",
                      colors.border.light,
                      "hover:bg-gray-50 dark:hover:bg-gray-800/50"
                    )}
                  >
                    <td className={cn("p-4 font-mono text-sm", colors.foreground.primary)}>
                      {prop}
                    </td>
                    <td className={cn("p-4 font-mono text-sm", colors.foreground.secondary)}>
                      {details.type || "—"}
                    </td>
                    <td className={cn("p-4 font-mono text-sm", colors.foreground.muted)}>
                      {details.default !== undefined ? String(details.default) : "—"}
                    </td>
                    <td className={cn("p-4", colors.foreground.secondary)}>
                      {details.description || "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Code */}
        {code && (
          <div>
            <Text variant="bodySmall" color="muted" className="mb-2 font-semibold uppercase tracking-wider">
              Code Example
            </Text>
            <CodeBlock code={code} language={codeLanguage} />
          </div>
        )}
      </div>
    </section>
  );
}

















