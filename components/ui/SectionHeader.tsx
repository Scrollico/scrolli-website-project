/**
 * SectionHeader Component
 * 
 * Consistent section header with title, optional subtitle/description, and decorative underline
 * Following Arc Publishing principles for visual consistency
 */

import { Heading, Text } from "@/components/ui/typography";
import { cn } from "@/lib/utils";

export interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  description?: string;
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  variant?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  showUnderline?: boolean;
  underlineClassName?: string;
  className?: string;
  titleClassName?: string;
}

export function SectionHeader({
  title,
  subtitle,
  description,
  level = 2,
  variant = "h2",
  showUnderline = true,
  underlineClassName,
  className,
  titleClassName,
}: SectionHeaderProps) {
  return (
    <div className={cn("mb-8", className)}>
      {subtitle && (
        <Text
          variant="bodySmall"
          color="secondary"
          className="mb-2 font-medium"
        >
          {subtitle}
        </Text>
      )}
      <div className="mb-4">
        <Heading
          level={level}
          variant={variant}
          color="primary"
          className={titleClassName}
        >
          {title}
        </Heading>
        {showUnderline && (
          <div
            className={cn(
              "w-12 h-0.5 bg-primary mt-4",
              underlineClassName
            )}
          />
        )}
      </div>
      {description && (
        <Text
          variant="bodyLarge"
          color="secondary"
          className="max-w-lg"
        >
          {description}
        </Text>
      )}
    </div>
  );
}

