"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useIsMobile } from "@/hooks/use-media-query";
import { cn, gradientVariants } from "@/lib/utils";
import { Card } from "@/components/ui/card";

export interface NewsArticle {
  href: string;
  title: string;
  summary: string;
  image: string;
}

const OFFSET_FACTOR = 5;
const SCALE_FACTOR = 0.03;
const OPACITY_FACTOR = 0.02;

export function News({ articles }: { articles: NewsArticle[] }) {
  // Create unique IDs for each article using index
  const articlesWithId = articles.map((article, idx) => ({ ...article, id: `${article.title}-${idx}` }));
  const [dismissedNews, setDismissedNews] = React.useState<string[]>([]);
  const cards = articlesWithId.filter(({ id }) => !dismissedNews.includes(id));
  const cardCount = cards.length;
  const [showCompleted, setShowCompleted] = React.useState(cardCount > 0);

  React.useEffect(() => {
    let timeout: NodeJS.Timeout | undefined = undefined;
    let resetTimeout: NodeJS.Timeout | undefined = undefined;
    if (cardCount === 0) {
      timeout = setTimeout(() => {
        setShowCompleted(false);
        // Reset dismissed news after showing completion message
        resetTimeout = setTimeout(() => {
          setDismissedNews([]);
          setShowCompleted(true);
        }, 500);
      }, 3000); // Increased timeout to 3 seconds
    }
    return () => {
      clearTimeout(timeout);
      clearTimeout(resetTimeout);
    };
  }, [cardCount]);

  return cards.length || showCompleted ? (
    <div
      className="group overflow-hidden px-3 pb-3 pt-8
        sm:px-4 sm:pb-4 sm:pt-10
        md:px-6 md:pb-6 md:pt-12
        lg:px-8 lg:pb-8 lg:pt-16
        max-w-sm mx-auto"
      data-active={cardCount !== 0}
    >
      <div className="relative w-full h-full min-h-[400px] sm:min-h-[450px] md:min-h-[500px]">
        {cards.map(({ id, href, title, summary, image }, idx) => {
          const position = idx;
          const isTopCard = idx === 0;
          const isVisible = position < 3;
          // Make cards behind more visible so they smoothly transition when one is dismissed
          const opacity = !isVisible ? 0 : isTopCard ? 1 : Math.max(0.95, 1 - position * OPACITY_FACTOR);

          // Responsive positioning adjustments (using CSS classes instead)

          return (
            <div
              key={id}
              className={cn(
                "absolute left-0 top-0 w-full max-w-full",
                "transition-all duration-300 ease-out",
                !isVisible && "pointer-events-none",
                // Responsive constraints
                "sm:scale-95 md:scale-100"
              )}
              style={
                {
                  zIndex: cardCount - idx,
                  transform: `translateY(${position * OFFSET_FACTOR}%) scale(${1 - position * SCALE_FACTOR})`,
                  opacity: opacity,
                  transition: "transform 400ms cubic-bezier(0.4, 0, 0.2, 1), opacity 400ms cubic-bezier(0.4, 0, 0.2, 1), z-index 0s",
                  willChange: isTopCard ? "transform, opacity" : "transform, opacity",
                } as React.CSSProperties
              }
              aria-hidden={!isTopCard}
            >
              <NewsCard
                title={title}
                description={summary}
                image={image}
                href={href}
                hideContent={!isVisible}
                active={isTopCard}
                onDismiss={() =>
                  setDismissedNews([id, ...dismissedNews.slice(0, 50)])
                }
              />
            </div>
          );
        })}
        <div className="pointer-events-none invisible" aria-hidden>
          <NewsCard title="Title" description="Description" />
        </div>
        {showCompleted && !cardCount && (
          <div
            className="animate-slide-up-fade absolute inset-0 flex size-full flex-col items-center justify-center gap-3 [animation-duration:1s]"
            style={{ "--offset": "10px" } as React.CSSProperties}
          >
            <span className="animate-fade-in text-xs font-medium text-muted-foreground [animation-delay:2.3s] [animation-direction:reverse] [animation-duration:0.2s]">
              You're all caught up!
            </span>
          </div>
        )}
      </div>
    </div>
  ) : null;
}

function NewsCard({
  title,
  description,
  image,
  onDismiss,
  hideContent,
  href,
  active,
}: {
  title: string;
  description: string;
  image?: string;
  onDismiss?: () => void;
  hideContent?: boolean;
  href?: string;
  active?: boolean;
}) {
  const { isMobile } = useIsMobile();

  const ref = React.useRef<HTMLDivElement>(null);
  const drag = React.useRef<{
    start: number;
    delta: number;
    startTime: number;
    maxDelta: number;
  }>({
    start: 0,
    delta: 0,
    startTime: 0,
    maxDelta: 0,
  });
  const animation = React.useRef<Animation>();
  const [dragging, setDragging] = React.useState(false);

  const onDragMove = (e: PointerEvent) => {
    if (!ref.current) return;
    const { clientX } = e;
    const dx = clientX - drag.current.start;
    drag.current.delta = dx;
    drag.current.maxDelta = Math.max(drag.current.maxDelta, Math.abs(dx));
    ref.current.style.setProperty("--dx", dx.toString());
  };

  const dismiss = () => {
    if (!ref.current) return;

    const cardWidth = ref.current.getBoundingClientRect().width;
    const translateX = Math.sign(drag.current.delta) * cardWidth;

    // Dismiss card
    animation.current = ref.current.animate(
      { opacity: 0, transform: `translateX(${translateX}px)` },
      { duration: 150, easing: "ease-in-out", fill: "forwards" }
    );
    animation.current.onfinish = () => onDismiss?.();
  };

  const stopDragging = (cancelled: boolean) => {
    if (!ref.current) return;
    unbindListeners();
    setDragging(false);

    const dx = drag.current.delta;
    if (Math.abs(dx) > ref.current.clientWidth / (cancelled ? 2 : 3)) {
      dismiss();
      return;
    }

    // Animate back to original position
    animation.current = ref.current.animate(
      { transform: "translateX(0)" },
      { duration: 150, easing: "ease-in-out" }
    );
    animation.current.onfinish = () =>
      ref.current?.style.setProperty("--dx", "0");

    drag.current = { start: 0, delta: 0, startTime: 0, maxDelta: 0 };
  };

  const onDragEnd = () => stopDragging(false);
  const onDragCancel = () => stopDragging(true);

  const onPointerDown = (e: React.PointerEvent) => {
    if (!ref.current || animation.current?.playState === "running")
      return;

    bindListeners();
    setDragging(true);
    drag.current.start = e.clientX;
    drag.current.startTime = Date.now();
    drag.current.delta = 0;
    ref.current.style.setProperty("--w", ref.current.clientWidth.toString());
  };

  const onClick = () => {
    if (!ref.current) return;
    if (
      isMobile &&
      drag.current.maxDelta < ref.current.clientWidth / 10 &&
      (!drag.current.startTime || Date.now() - drag.current.startTime < 250)
    ) {
      // Touch user didn't drag far or for long, open the link
      window.open(href, "_blank");
    }
  };

  const bindListeners = () => {
    document.addEventListener("pointermove", onDragMove);
    document.addEventListener("pointerup", onDragEnd);
    document.addEventListener("pointercancel", onDragCancel);
  };

  const unbindListeners = () => {
    document.removeEventListener("pointermove", onDragMove);
    document.removeEventListener("pointerup", onDragEnd);
    document.removeEventListener("pointercancel", onDragCancel);
  };

  return (
    <Card
      ref={ref}
      className={cn(
        "relative select-none gap-2 p-3 text-[0.8125rem] bg-white",
        "translate-x-[calc(var(--dx)*1px)] rotate-[calc(var(--dx)*0.05deg)] opacity-[calc(1-max(var(--dx),-1*var(--dx))/var(--w)/2)]",
        "border border-neutral-200",
        // Responsive sizing to prevent overflow
        "w-full max-w-full h-auto",
        "sm:p-4 sm:text-sm",
        "md:p-5 md:text-base"
      )}
      data-dragging={dragging}
      data-active={active}
      onPointerDown={onPointerDown}
      onClick={onClick}
    >
      {/* Subtle gradient overlay for visual depth */}
      <div className={`absolute inset-0 ${gradientVariants.textOverlay} opacity-20 pointer-events-none rounded`} />
      <div className={cn("relative flex flex-col h-full z-10", hideContent && "opacity-0")}>
        {/* 1. Title */}
        <h3 className="line-clamp-1 font-medium text-foreground mb-1 text-sm sm:text-sm md:text-base">
          {title}
        </h3>

        {/* 2. Subtitle */}
        <p className="line-clamp-2 text-xs leading-4 text-muted-foreground mb-2 sm:mb-3 flex-shrink-0
          sm:text-xs md:text-sm">
          {description}
        </p>
        
        {/* 3. Image */}
        <div className="relative mt-auto aspect-[16/9] w-full shrink-0 overflow-hidden rounded border bg-muted
          max-h-[120px] sm:max-h-[140px] md:max-h-[160px] lg:max-h-[180px]">
          {image && (
            <>
              <Image
                src={image}
                alt=""
                fill
                sizes="10vw"
                className="rounded object-cover object-center"
                draggable={false}
              />
              {/* Responsive gradient overlay for better visual hierarchy */}
              <div className={`absolute inset-0 ${gradientVariants.contentOverlay} opacity-50`} />
            </>
          )}
        </div>
        
        {/* 4. Read more + Dismiss (appear on hover) */}
        <div
          className={cn(
            "absolute bottom-0 left-0 right-0 overflow-hidden transition-[height,opacity] duration-200 z-20 bg-white",
            "h-0 opacity-0",
            active && "group-hover:h-8 group-hover:opacity-100 group-hover:pt-2",
            "group-has-[*[data-dragging=true]]:h-8 group-has-[*[data-dragging=true]]:opacity-100 group-has-[*[data-dragging=true]]:pt-2"
          )}
        >
          <div className="flex items-center justify-between text-xs news-card-actions px-3 pb-2">
            <Link
              href={href || "https://alara.scrolli.co"}
              target="_blank"
              className="font-medium text-gray-700 hover:!text-gray-700 hover:!no-underline"
            >
              Read more
            </Link>
            <button
              type="button"
              onClick={dismiss}
              className="text-gray-700 hover:!text-gray-700 cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        </div>
      </div>
    </Card>
  );
}

