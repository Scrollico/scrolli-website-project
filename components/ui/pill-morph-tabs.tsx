"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { colors } from "@/lib/design-tokens";

/* Use your shadcn Tab primitives - adjust import path if your project differs */
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";

export interface PillTab {
  value: string;
  label: React.ReactNode;
  panel?: React.ReactNode;
}

interface PillMorphTabsProps {
  items?: PillTab[];
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  className?: string;
}

/**
 * PillMorphTabs
 *
 * - Uses shadcn Tabs primitives for accessibility.
 * - Active pill is an animated morphing element (framer-motion).
 * - Glassmorphism + subtle gradient background.
 * - Responsive and keyboard accessible (handled by Tabs).
 */
export default function PillMorphTabs({
  items = [
    { value: "overview", label: "Overview", panel: <div>Overview content</div> },
    { value: "features", label: "Features", panel: <div>Feature list</div> },
    { value: "pricing", label: "Pricing", panel: <div>Pricing & plans</div> },
    { value: "faq", label: "FAQ", panel: <div>FAQ content</div> },
  ],
  defaultValue,
  onValueChange,
  className,
}: PillMorphTabsProps) {
  const first = items[0]?.value ?? "tab-0";
  const [value, setValue] = React.useState<string>(defaultValue ?? first);
  const listRef = React.useRef<HTMLDivElement | null>(null);
  const triggerRefs = React.useRef<Record<string, HTMLButtonElement | null>>({});

  const [indicator, setIndicator] = React.useState<{ left: number; width: number } | null>(null);

  // measure position & width of active trigger and set indicator
  const measure = React.useCallback(() => {
    const list = listRef.current;
    const activeEl = triggerRefs.current[value];
    if (!list || !activeEl) {
      setIndicator(null);
      return;
    }
    const listRect = list.getBoundingClientRect();
    const tRect = activeEl.getBoundingClientRect();
    setIndicator({
      left: tRect.left - listRect.left + list.scrollLeft,
      width: tRect.width,
    });
  }, [value]);

  // measure on mount, value changes and resize
  React.useEffect(() => {
    measure();
    const ro = new ResizeObserver(measure);
    if (listRef.current) ro.observe(listRef.current);
    Object.values(triggerRefs.current).forEach((el) => el && ro.observe(el));
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [measure]);


  React.useEffect(() => {
    if (onValueChange) onValueChange(value);
  }, [value, onValueChange]);

  return (
    <div className={cn("w-full", className)}>
      <Tabs value={value} onValueChange={(v) => setValue(v)}>
        <div className="flex justify-center mb-6">
          <div
            ref={listRef}
            data-tabs-container="true"
            className={cn(
              "relative",
              // minimal design - no background, no border, no roundness
              "inline-flex items-center gap-2 p-1",
              "bg-transparent" // Explicitly remove any background
            )}
          >
            {/* TabsList using shadcn TabsTrigger */}
            <TabsList className="relative flex gap-1 p-1 bg-transparent dark:!bg-gray-800 dark:!text-white" data-tabs-list="true">
              {items.map((it) => {
                const isActive = it.value === value;
                return (
                  <TabsTrigger
                    key={it.value}
                    value={it.value}
                    ref={(el) => {
                      if (el) triggerRefs.current[it.value] = el;
                    }}
                    className={cn(
                      "relative z-10 px-4 py-2 text-sm font-medium transition-all duration-200",
                      "border rounded-md",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
                      "dark:!bg-gray-800 dark:!text-white",
                      isActive
                        ? cn(
                            colors.foreground.primary,
                            "!bg-gray-200", // Light mode: gray background for active button (force with !important)
                            colors.border.DEFAULT,
                            "hover:opacity-90",
                            "dark:!bg-gray-600 dark:!text-white" // Dark mode: lighter gray background for active button to stand out
                          )
                        : cn(
                            colors.foreground.secondary,
                            colors.surface.base,
                            colors.border.light,
                            "hover:text-gray-900 dark:hover:text-gray-100",
                            "hover:bg-gray-50 dark:hover:bg-gray-800",
                            "hover:border-gray-300 dark:hover:border-gray-600",
                            "dark:!bg-gray-800 dark:!text-white"
                          )
                    )}
                  >
                    {it.label}
                  </TabsTrigger>
                );
              })}
            </TabsList>
          </div>
        </div>

        {/* Panels */}
        <div className="mt-4">
          {items.map((it) => (
            <TabsContent key={it.value} value={it.value} className="p-0">
              {it.panel ?? null}
            </TabsContent>
          ))}
        </div>
      </Tabs>
    </div>
  );
}

