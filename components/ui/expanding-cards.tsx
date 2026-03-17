"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

export interface CardItem {
  id: string | number;
  title: string;
  description: string;
  imgSrc: string;
  linkHref: string;
}

interface ExpandingCardsProps extends React.HTMLAttributes<HTMLUListElement> {
  items: CardItem[];
  defaultActiveIndex?: number;
}

export const ExpandingCards = React.forwardRef<
  HTMLUListElement,
  ExpandingCardsProps
>(({ className, items, defaultActiveIndex = 0, ...props }, ref) => {
  /* eslint-disable react-hooks/exhaustive-deps */
  const [activeIndex, setActiveIndex] = React.useState<number | null>(
    defaultActiveIndex,
  );

  // Compute the grid layout pattern (e.g., "5fr 1fr 1fr") based on active index
  const layoutPattern = React.useMemo(() => {
    return items
      .map((_, index) => (index === activeIndex ? "5fr" : "1fr"))
      .join(" ");
  }, [activeIndex, items.length]);

  // Mobile uses equal rows, desktop uses expanding columns
  const mobileLayoutPattern = React.useMemo(() => {
    // On mobile, active row gets more height (e.g., "5fr 1fr 1fr...")
    return items
      .map((_, index) => (activeIndex === index ? "5fr" : "1fr"))
      .join(" ");
  }, [activeIndex, items.length]);

  const handleInteraction = (index: number) => {
    setActiveIndex(index);
  };

  return (
    <ul
      className={cn(
        "w-full max-w-6xl gap-2",
        "grid",
        // Mobile: 1 col with rows from --grid-rows var; desktop: columns layout, single row
        "grid-cols-1 [grid-template-rows:var(--grid-rows)] md:grid-cols-[var(--grid-layout)] md:grid-rows-1",
        "h-[500px] md:h-[600px]",
        "transition-all duration-500 ease-out",
        className,
      )}
      style={
        {
          "--grid-layout": layoutPattern,
          "--grid-rows": mobileLayoutPattern,
        } as React.CSSProperties
      }
      ref={ref}
      {...props}
    >
      {items.map((item, index) => {
        const isActive = activeIndex === index;
        return (
          <li
            key={item.id}
            className={cn(
              "group relative cursor-pointer overflow-hidden rounded-lg border shadow-sm",
              "md:min-w-[80px]",
              "min-h-0 min-w-0",
              "bg-transparent"
            )}
            style={{
              backgroundColor: 'transparent',
              isolation: 'isolate'
            }}
            onMouseEnter={() => handleInteraction(index)}
            onFocus={() => handleInteraction(index)}
            onClick={() => handleInteraction(index)}
            tabIndex={0}
            data-active={isActive}
          >
            {/* Background Image Layer */}
            <div
              className={cn(
                "absolute inset-0 z-[10] overflow-hidden bg-transparent transition-transform duration-500 ease-out",
                isActive ? "scale-100" : "scale-110"
              )}
            >
              {item.imgSrc ? (
                <Image
                  src={item.imgSrc}
                  alt={item.title || ""}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 400px"
                  unoptimized // Use unoptimized to avoid potential loader issues
                  priority={index === 0}
                />
              ) : (
                <div className="absolute inset-0 bg-neutral-800 flex items-center justify-center pointer-events-none">
                  <span className="text-white font-bold text-xs">NO IMAGE</span>
                </div>
              )}
            </div>
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent pointer-events-none z-[11]" />

            <div className="absolute inset-0 z-[12] flex flex-col justify-end p-4 md:p-0 md:pt-4 md:pr-4 md:pb-4 md:pl-10 pointer-events-auto bg-transparent">
              {/* Desktop: vertical title (removed - no text shown when inactive) */}

              {/* Mobile: Show title always, description only when active */}
              <div className="md:hidden relative z-[14] flex flex-col justify-end gap-2">
                <h3
                  className={cn(
                    "text-base font-bold !text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] line-clamp-2 break-words",
                  )}
                  title={item.title}
                >
                  {item.title}
                </h3>
                <p
                  className={cn(
                    "w-full max-w-xs text-xs !text-white/80 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] line-clamp-2 transition-all duration-300",
                    isActive ? "opacity-100 max-h-20" : "opacity-0 max-h-0",
                  )}
                >
                  {item.description}
                </p>
              </div>

              {/* Desktop: Expanded content (only on active cards) */}
              <div className="hidden md:block relative z-[14] flex min-h-0 flex-col justify-end gap-2">
                <h3
                  className={cn(
                    "text-lg md:text-xl font-bold !text-white transition-all duration-300 delay-150 ease-out drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] line-clamp-2 break-words",
                    isActive ? "opacity-100" : "opacity-0",
                  )}
                  title={item.title}
                >
                  {item.title}
                </h3>
                <p
                  className={cn(
                    "w-full max-w-xs text-xs md:text-sm !text-white/80 transition-all duration-300 delay-225 ease-out drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] line-clamp-2",
                    isActive ? "opacity-100" : "opacity-0",
                  )}
                >
                  {item.description}
                </p>
              </div>

              {/* Clickable overlay for navigation - only when active */}
              {isActive && (
                <Link
                  href={item.linkHref}
                  className="absolute inset-0 z-[100] block"
                  aria-label={item.title}
                />
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
});
ExpandingCards.displayName = "ExpandingCards";
