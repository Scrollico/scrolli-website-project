"use client";

import { cn } from "@/lib/utils";
import { colors, gap } from "@/lib/design-tokens";
import { Text } from "@/components/ui/typography";

interface ImpactBreakdownProps {
  journalists: number; // percentage
  investigations: number; // percentage
  platform: number; // percentage
  className?: string;
}

export default function ImpactBreakdown({
  journalists,
  investigations,
  platform,
  className,
}: ImpactBreakdownProps) {
  const items = [
    { label: "Journalists", value: journalists, color: "bg-primary" },
    { label: "Investigations", value: investigations, color: "bg-green-600" },
    { label: "Platform", value: platform, color: "bg-gray-400 dark:bg-gray-600" },
  ];

  return (
    <div className={cn("w-full", gap.sm, "flex flex-col", className)}>
      <Text variant="bodySmall" className={cn(colors.foreground.secondary, "mb-2")}>
        Where your subscription goes
      </Text>
      <div className={cn("space-y-3")}>
        {items.map((item, index) => (
          <div key={index} className="w-full">
            <div className="flex items-center justify-between mb-1">
              <Text variant="caption" className={cn(colors.foreground.primary, "font-medium")}>
                {item.label}
              </Text>
              <Text variant="caption" className={cn(colors.foreground.secondary)}>
                {item.value}%
              </Text>
            </div>
            <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className={cn("h-full rounded-full transition-all duration-500", item.color)}
                style={{ width: `${item.value}%` }}
                role="progressbar"
                aria-valuenow={item.value}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`${item.label}: ${item.value}%`}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}













