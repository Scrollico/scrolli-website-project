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
  icon: React.ReactNode;
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

  const handleInteraction = (index: number) => {
    setActiveIndex(index);
  };

  return (
    <ul
      className={cn(
        "w-full max-w-6xl gap-2",
        "grid",
        // Mobile: 1 col, dynamic rows
        "grid-cols-1 grid-rows-[var(--grid-layout)]",
        // Desktop: dynamic cols, 1 row
        "md:grid-cols-[var(--grid-layout)] md:grid-rows-1",
        "h-[700px] md:h-[600px]",
        "transition-all duration-500 ease-out",
        className,
      )}
      style={
        {
          "--grid-layout": layoutPattern,
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
            <Link
              href={item.linkHref}
              className="absolute inset-0 z-[100] block bg-transparent"
              aria-label={item.title}
            />

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

            <div className="absolute inset-0 z-[12] flex flex-col justify-end gap-2 pt-4 pr-4 pb-4 pl-10 pointer-events-none bg-transparent">
              {/* Inactive: vertical title on desktop */}
              <h3
                className={cn(
                  "hidden origin-bottom-left rotate-90 text-xl font-semibold leading-tight tracking-wide !text-white/95 transition-all duration-300 ease-out md:block absolute left-4 bottom-0 z-[13] w-[7em] h-[2.25rem] overflow-hidden",
                  isActive ? "opacity-0" : "opacity-100",
                )}
                style={{
                  WebkitLineClamp: 2,
                  display: "-webkit-box",
                  WebkitBoxOrient: "vertical",
                  lineClamp: 2,
                }}
              >
                {item.title
                  ? item.title.charAt(0).toLocaleUpperCase("tr") +
                  item.title.slice(1).toLocaleLowerCase("tr")
                  : item.title}
              </h3>
              {/* Inactive: single-line title on mobile (truncated) */}
              <h3
                className={cn(
                  "md:hidden absolute bottom-4 left-4 right-4 z-[13] truncate text-sm font-semibold !text-white/95 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]",
                  isActive ? "opacity-0" : "opacity-100",
                )}
                title={item.title}
              >
                {item.title}
              </h3>

              <div className="relative z-[14] flex min-h-0 flex-col justify-end gap-2">
                <div
                  className={cn(
                    "!text-white/90 transition-all duration-300 delay-75 ease-out",
                    isActive ? "opacity-100" : "opacity-0",
                  )}
                >
                  {item.icon}
                </div>
                <h3
                  className={cn(
                    "text-xl font-bold !text-white transition-all duration-300 delay-150 ease-out drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] line-clamp-2 break-words",
                    isActive ? "opacity-100" : "opacity-0",
                  )}
                  title={item.title}
                >
                  {item.title}
                </h3>
                <p
                  className={cn(
                    "w-full max-w-xs text-sm !text-white/80 transition-all duration-300 delay-225 ease-out drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] line-clamp-2",
                    isActive ? "opacity-100" : "opacity-0",
                  )}
                >
                  {item.description}
                </p>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
});
ExpandingCards.displayName = "ExpandingCards";
