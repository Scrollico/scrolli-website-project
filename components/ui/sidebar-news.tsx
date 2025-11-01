"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useIsMobile } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";

export interface NewsArticle {
  href: string;
  title: string;
  summary: string;
  image: string;
}

const OFFSET_FACTOR = 4;
const SCALE_FACTOR = 0.03;
const OPACITY_FACTOR = 0.1;

export function News({ articles }: { articles: NewsArticle[] }) {
  const [dismissedNews, setDismissedNews] = React.useState<string[]>([]);
  const cards = articles.filter(({ href }) => !dismissedNews.includes(href));
  const cardCount = cards.length;
  const [showCompleted, setShowCompleted] = React.useState(cardCount > 0);

  React.useEffect(() => {
    let timeout: NodeJS.Timeout | undefined = undefined;
    if (cardCount === 0) {
      timeout = setTimeout(() => {
        setShowCompleted(false);
        // Reset dismissed news after showing completion message
        setTimeout(() => {
          setDismissedNews([]);
        }, 500);
      }, 2700);
    }
    return () => clearTimeout(timeout);
  }, [cardCount]);

  return cards.length || showCompleted ? (
    <div
      className="group overflow-hidden px-3 pb-3 pt-8"
      data-active={cardCount !== 0}
    >
      <div className="relative size-full">
        {cards.toReversed().map(({ href, title, summary, image }, idx) => (
          <div
            key={`${idx}-${href}`}
            className={cn(
              "absolute left-0 top-0 size-full scale-[var(--scale)] transition-[opacity,transform] duration-200",
              "translate-y-[var(--y)] opacity-[var(--opacity)]"
            )}
            style={
              {
                "--y": `-${(cardCount - (idx + 1)) * OFFSET_FACTOR}%`,
                "--scale": 1 - (cardCount - (idx + 1)) * SCALE_FACTOR,
                "--opacity":
                  cardCount - (idx + 1) >= 3
                    ? 0
                    : 1 - (cardCount - (idx + 1)) * OPACITY_FACTOR,
              } as React.CSSProperties
            }
            aria-hidden={idx !== cardCount - 1}
          >
            <NewsCard
              title={title}
              description={summary}
              image={image}
              href={href}
              hideContent={cardCount - idx > 2}
              active={idx === cardCount - 1}
              onDismiss={() =>
                setDismissedNews([href, ...dismissedNews.slice(0, 50)])
              }
            />
          </div>
        ))}
        <div className="pointer-events-none invisible" aria-hidden>
          <NewsCard title="Title" description="Description" />
        </div>
        {showCompleted && !cardCount && (
          <div
            className="animate-slide-up-fade absolute inset-0 flex size-full flex-col items-center justify-center gap-3 [animation-duration:1s]"
            style={{ "--offset": "10px" } as React.CSSProperties}
          >
            <div className="animate-fade-in absolute inset-0 rounded-lg border border-neutral-300 [animation-delay:2.3s] [animation-direction:reverse] [animation-duration:0.2s]" />
            <AnimatedLogo className="w-1/3" />
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
    if (!active || !ref.current || animation.current?.playState === "running")
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
        "transition-shadow data-[dragging=true]:shadow-md",
        "border border-neutral-200"
      )}
      style={{
        background: "linear-gradient(to top, rgba(156, 163, 175, 0.08) 0%, rgba(156, 163, 175, 0.04) 40%, rgba(255, 255, 255, 1) 100%)",
      }}
      data-dragging={dragging}
      onPointerDown={onPointerDown}
      onClick={onClick}
    >
      <div className={cn(hideContent && "invisible")}>
        <div className="flex flex-col gap-1">
          <span className="line-clamp-1 font-medium text-foreground">
            {title}
          </span>
          <p className="line-clamp-2 h-10 leading-5 text-muted-foreground">
            {description}
          </p>
        </div>
        <div className="relative mt-3 aspect-[16/9] w-full shrink-0 overflow-hidden rounded border bg-muted">
          {image && (
            <Image
              src={image}
              alt=""
              fill
              sizes="10vw"
              className="rounded object-cover object-center"
              draggable={false}
            />
          )}
        </div>
        <div
          className={cn(
            "h-7 pt-3 flex items-center justify-between text-xs"
          )}
        >
          <Link
            href={href || "https://alara.scrolli.co"}
            target="_blank"
            className="font-medium text-muted-foreground hover:text-foreground transition-colors duration-75"
          >
            Read more
          </Link>
          <button
            type="button"
            onClick={dismiss}
            className="text-muted-foreground hover:text-foreground transition-colors duration-75"
          >
            Dismiss
          </button>
        </div>
      </div>
    </Card>
  );
}

function AnimatedLogo(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 140 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="text-muted-foreground"
      {...props}
    >
      {/* S */}
      <path
        d="M2 3C2 5.20914 3.79086 7 6 7C8.20914 7 10 5.20914 10 3C10 0.790861 8.20914 -1 6 -1C3.79086 -1 2 0.790861 2 3ZM2 12C2 14.2091 3.79086 16 6 16H10V21H2V12ZM6 13C7.65685 13 9 14.3431 9 16C9 17.6569 7.65685 19 6 19C4.34315 19 3 17.6569 3 16C3 14.3431 4.34315 13 6 13Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeDasharray="65"
        strokeLinecap="round"
        fill="none"
      >
        <animate
          attributeName="strokeDashoffset"
          dur="2500ms"
          values="65;0;0;0;65"
          fill="freeze"
        />
      </path>
      {/* C */}
      <path
        d="M16 3C16 6.31371 18.6863 9 22 9H26V21H22C18.6863 21 16 18.3137 16 15V3Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeDasharray="55"
        strokeLinecap="round"
        fill="none"
      >
        <animate
          attributeName="strokeDashoffset"
          dur="2500ms"
          values="55;0;0;0;55"
          fill="freeze"
        />
      </path>
      {/* R */}
      <path
        d="M32 3H40C43.3137 3 46 5.68629 46 9C46 12.3137 43.3137 15 40 15H36V21H32V3ZM40 12C41.6569 12 43 10.6569 43 9C43 7.34315 41.6569 6 40 6H36V12H40Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeDasharray="60"
        strokeLinecap="round"
        fill="none"
      >
        <animate
          attributeName="strokeDashoffset"
          dur="2500ms"
          values="60;0;0;0;60"
          fill="freeze"
        />
      </path>
      {/* O */}
      <path
        d="M50 3H58C61.3137 3 64 5.68629 64 9C64 12.3137 61.3137 15 58 15H50V3ZM58 13C59.6569 13 61 11.6569 61 10C61 8.34315 59.6569 7 58 7H52V13H58Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeDasharray="55"
        strokeLinecap="round"
        fill="none"
      >
        <animate
          attributeName="strokeDashoffset"
          dur="2500ms"
          values="55;0;0;0;55"
          fill="freeze"
        />
      </path>
      {/* L */}
      <path
        d="M68 3H71V15H75C78.3137 15 81 17.6863 81 21H68V3Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeDasharray="45"
        strokeLinecap="round"
        fill="none"
      >
        <animate
          attributeName="strokeDashoffset"
          dur="2500ms"
          values="45;0;0;0;45"
          fill="freeze"
        />
      </path>
      {/* L */}
      <path
        d="M85 3H88V15H92C95.3137 15 98 17.6863 98 21H85V3Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeDasharray="45"
        strokeLinecap="round"
        fill="none"
      >
        <animate
          attributeName="strokeDashoffset"
          dur="2500ms"
          values="45;0;0;0;45"
          fill="freeze"
        />
      </path>
      {/* I */}
      <path
        d="M102 3H105V21H102V3Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeDasharray="20"
        strokeLinecap="round"
        fill="none"
      >
        <animate
          attributeName="strokeDashoffset"
          dur="2500ms"
          values="20;0;0;0;20"
          fill="freeze"
        />
      </path>
    </svg>
  );
}
