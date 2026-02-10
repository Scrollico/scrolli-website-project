"use client";

import { cn } from "@/lib/utils";
import { colors } from "@/lib/design-tokens";

interface UsageMeterProps {
    articlesRead: number;
    limit: number;
    isPremium?: boolean;
    className?: string;
}

/**
 * UsageMeter - Navbar component showing remaining free articles
 * Only visible to free users with articles remaining.
 */
export function UsageMeter({
    articlesRead,
    limit,
    isPremium = false,
    className,
}: UsageMeterProps) {
    // Don't show for premium users
    if (isPremium) return null;

    const remaining = Math.max(0, limit - articlesRead);
    const isLast = remaining === 1;
    const isExhausted = remaining === 0;

    if (isExhausted) return null;

    return (
        <div
            className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium",
                isLast
                    ? "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300",
                className
            )}
        >
            {/* Progress dots */}
            <div className="flex gap-1">
                {Array.from({ length: limit }).map((_, i) => (
                    <div
                        key={i}
                        className={cn(
                            "w-2 h-2 rounded-full transition-colors",
                            i < articlesRead
                                ? "bg-green-600"
                                : "bg-gray-300 dark:bg-gray-600"
                        )}
                    />
                ))}
            </div>

            <span>
                {isLast ? (
                    "Son ücretsiz makalen!"
                ) : (
                    `${remaining} ücretsiz makale kaldı`
                )}
            </span>
        </div>
    );
}
