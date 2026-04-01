"use client";

import React, { useRef, useEffect, useMemo, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";
import { colors, typography, sectionPadding } from "@/lib/design-tokens";
import { Article } from "@/types/content";

gsap.registerPlugin(ScrollTrigger);

// --- Constants ---
const TOTAL_CARDS = 20;
const CARD_WIDTH = 60;
const CARD_HEIGHT = 85;
const SCROLL_DISTANCE = "300vh";

// Fallback Unsplash Images (used if not enough articles)
const FALLBACK_IMAGES = [
  "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=300&q=80",
  "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?w=300&q=80",
  "https://images.unsplash.com/photo-1497366216548-37526070297c?w=300&q=80",
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=300&q=80",
  "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=300&q=80",
  "https://images.unsplash.com/photo-1506765515384-028b60a970df?w=300&q=80",
  "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=300&q=80",
  "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=300&q=80",
  "https://images.unsplash.com/photo-1500485035595-cbe6f645feb1?w=300&q=80",
  "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=300&q=80",
  "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=300&q=80",
  "https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?w=300&q=80",
  "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=300&q=80",
  "https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?w=300&q=80",
  "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=300&q=80",
  "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?w=300&q=80",
  "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=300&q=80",
  "https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?w=300&q=80",
  "https://images.unsplash.com/photo-1523961131990-5ea7c61b2107?w=300&q=80",
  "https://images.unsplash.com/photo-1496568816309-51d7c20e3b21?w=300&q=80",
];

// --- Types ---
interface IntroAnimationProps {
  articles?: Article[];
}

export default function IntroAnimation({ articles = [] }: IntroAnimationProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const pinContainerRef = useRef<HTMLDivElement>(null);
  const introTextRef = useRef<HTMLDivElement>(null);
  const arcContentRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  // useCallback ref pattern for stable card ref assignment
  const setCardRef = useCallback((el: HTMLDivElement | null, i: number) => {
    cardRefs.current[i] = el;
  }, []);

  // Derive image URLs from articles or fallback
  const imageUrls = useMemo(() => {
    if (articles.length >= TOTAL_CARDS) {
      return articles.slice(0, TOTAL_CARDS).map(
        (article) => article.thumbnail || article.image || FALLBACK_IMAGES[0]
      );
    }
    return FALLBACK_IMAGES;
  }, [articles]);

  // Detect prefers-reduced-motion at component mount time
  const prefersReducedMotion = useMemo(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  // Deterministic pseudo-random scatter positions using golden ratio
  // NOT Math.random() — stable under React StrictMode double-invoke
  const scatterPositions = useMemo(() => {
    return Array.from({ length: TOTAL_CARDS }, (_, i) => {
      const golden = 1.618033988749895;
      const theta = i * golden * Math.PI * 2;
      const r = 0.5 + (i % 7) * 0.1; // radius factor 0.5–1.1
      return {
        xFactor: Math.cos(theta) * r, // multiplied by containerWidth in useEffect
        yFactor: Math.sin(theta) * r * 0.67, // multiplied by containerHeight in useEffect
        rotationOffset: ((i * golden * 180) % 360) - 180, // -180 to 180
      };
    });
  }, []);

  // GSAP ScrollTrigger setup
  useEffect(() => {
    // Skip GSAP setup for users who prefer reduced motion
    if (prefersReducedMotion) return;

    const section = sectionRef.current;
    const pinContainer = pinContainerRef.current;
    if (!section || !pinContainer) return;

    const cards = cardRefs.current.filter(Boolean) as HTMLDivElement[];
    if (cards.length === 0) return;

    // Container dimensions for responsive calculations
    const containerWidth = pinContainer.offsetWidth;
    const containerHeight = pinContainer.offsetHeight;
    const centerX = containerWidth / 2;
    const centerY = containerHeight / 2;
    const isMobile = containerWidth < 768;

    // Calculate geometry
    const circleRadius = Math.min(Math.min(containerWidth, containerHeight) * 0.35, 350);
    const arcRadius = Math.min(containerWidth, containerHeight * 1.5) * (isMobile ? 1.4 : 1.1);
    const spreadAngle = isMobile ? 100 : 180; // 180-degree arc orbit on desktop (per D-07)

    // Create master timeline
    const tl = gsap.timeline();

    // Set initial visibility states for text elements
    gsap.set(introTextRef.current, { opacity: 1, y: 0 });
    gsap.set(arcContentRef.current, { opacity: 0, y: 20 });

    // --- Text fade animations (synced to master timeline) ---

    // Intro text fades out at the beginning of scroll
    tl.to(
      introTextRef.current,
      {
        opacity: 0,
        y: -20,
        duration: 0.5,
        ease: "power2.in",
        force3D: true,
      },
      0
    );

    // Arc content fades in after morph phase (~80% through circle formation)
    tl.fromTo(
      arcContentRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5, ease: "power2.out", force3D: true },
      0.8
    );

    // --- Phase 1: Scatter to Circle (0%–20% of scroll progress, per D-06) ---
    cards.forEach((card, i) => {
      const angle = (i / TOTAL_CARDS) * 2 * Math.PI;
      const circleX = centerX + Math.cos(angle) * circleRadius - CARD_WIDTH / 2;
      const circleY = centerY + Math.sin(angle) * circleRadius - CARD_HEIGHT / 2;
      const rotation = (angle * 180) / Math.PI + 90;

      // Set initial scattered position (deterministic)
      const scatter = scatterPositions[i];
      gsap.set(card, {
        x: centerX + scatter.xFactor * containerWidth - CARD_WIDTH / 2,
        y: centerY + scatter.yFactor * containerHeight - CARD_HEIGHT / 2,
        rotation: scatter.rotationOffset,
        scale: 0.6,
        opacity: 0,
        force3D: true,
      });

      // Animate all cards into circle formation simultaneously
      tl.to(
        card,
        {
          x: circleX,
          y: circleY,
          rotation: rotation,
          scale: 1,
          opacity: 1,
          ease: "power2.inOut",
          duration: 1,
          force3D: true,
        },
        0 // all start at timeline position 0
      );
    });

    // --- Phase 2: Orbital arc sweep — 180-degree sweep (20%–100%, per D-06, D-07, D-08) ---
    const arcApexY = containerHeight * (isMobile ? 0.35 : 0.25);
    const arcCenterY = arcApexY + arcRadius;
    const startAngle = -90 - spreadAngle / 2;

    cards.forEach((card, i) => {
      const step = spreadAngle / (TOTAL_CARDS - 1);
      const cardStartAngle = startAngle + i * step;
      // Cascade: each card sweeps ~80% of spread angle
      const cardEndAngle = cardStartAngle - spreadAngle * 0.8;
      const cardStartRad = (cardStartAngle * Math.PI) / 180;
      const cardEndRad = (cardEndAngle * Math.PI) / 180;

      const arcStartX = centerX + Math.cos(cardStartRad) * arcRadius - CARD_WIDTH / 2;
      const arcStartY = arcCenterY + Math.sin(cardStartRad) * arcRadius - CARD_HEIGHT / 2;
      const arcEndX = centerX + Math.cos(cardEndRad) * arcRadius - CARD_WIDTH / 2;
      const arcEndY = arcCenterY + Math.sin(cardEndRad) * arcRadius - CARD_HEIGHT / 2;

      const cardScale = isMobile ? 1.4 : 1.8;

      // Transition from circle to arc start position
      tl.to(
        card,
        {
          x: arcStartX,
          y: arcStartY,
          rotation: cardStartAngle + 90,
          scale: cardScale,
          ease: "power1.inOut",
          duration: 0.5,
          force3D: true,
        },
        1 // starts at timeline position 1 (after morph phase)
      );

      // Sweep through arc (main orbital motion — linear for scrub)
      tl.to(
        card,
        {
          x: arcEndX,
          y: arcEndY,
          rotation: cardEndAngle + 90,
          ease: "none",
          duration: 4, // longest part of timeline
          force3D: true,
        },
        1.5
      );
    });

    // --- ScrollTrigger: pin + scrub (per D-01, D-02) ---
    // scrub: 1 provides 1-second smoothing AND inherent bidirectional scroll (no extra config needed)
    // Automatic unpin when scroll passes end point handles scroll completion handoff (SCROLL-07)
    const st = ScrollTrigger.create({
      trigger: section,
      pin: pinContainer,
      start: "top top",
      end: `+=${SCROLL_DISTANCE}`,
      scrub: 1, // 1-second lag for fluid feel; bidirectional by default
      animation: tl,
    });

    // Refresh ScrollTrigger after setup to recalculate positions for current scroll state
    ScrollTrigger.refresh();

    // Cleanup: kill only our ScrollTrigger instance, not all page instances
    return () => {
      st.kill();
      tl.kill();
    };
  }, [imageUrls, scatterPositions, prefersReducedMotion]);

  // --- Reduced-motion fallback: static CSS grid of article thumbnails ---
  // Shown instead of animation for users with prefers-reduced-motion: reduce
  if (prefersReducedMotion) {
    return (
      <section className={cn("w-full", colors.background.base, sectionPadding.lg)}>
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className={cn(typography.h2, "tracking-tight mb-4", colors.foreground.primary)}>
              Scrolli Hikayeleri
            </h2>
            <p className={cn("text-sm md:text-base max-w-lg mx-auto leading-relaxed", colors.foreground.muted)}>
              Derinlemesine analizler ve ozel hikayeler.
              En guncel haberlerimizi ve ozel iceriklerimizi kesfedin.
            </p>
          </div>
          <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-3">
            {imageUrls.slice(0, TOTAL_CARDS).map((src, i) => (
              <div
                key={i}
                className="overflow-hidden rounded-xl shadow-lg aspect-[60/85]"
              >
                <img
                  src={src}
                  alt={`article-${i}`}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section ref={sectionRef} style={{ height: SCROLL_DISTANCE }}>
      <div
        ref={pinContainerRef}
        className={cn(
          "h-screen w-full overflow-hidden flex flex-col items-center justify-center",
          colors.background.base
        )}
      >
        {/* Intro text — fades out at start of scroll */}
        <div
          ref={introTextRef}
          className="absolute z-10 flex flex-col items-center text-center pointer-events-none top-1/2 -translate-y-1/2"
        >
          <h1 className={cn(typography.h1, colors.foreground.primary)}>
            Hikayelerinizi kesfedin.
          </h1>
          {/* Scroll indicator with bouncing dot */}
          <div className="flex flex-col items-center gap-3 mt-6">
            <div className="w-6 h-10 rounded-full border-2 border-foreground/40 flex items-start justify-center p-1">
              <div className="w-1 h-2 rounded-full bg-foreground/60 animate-bounce" />
            </div>
            <p className={cn("text-xs font-bold tracking-[0.2em]", colors.foreground.muted)}>
              Kesfetmek icin kaydirin
            </p>
          </div>
        </div>

        {/* Arc active content — fades in during orbit phase */}
        <div
          ref={arcContentRef}
          className="absolute top-[10%] z-10 flex flex-col items-center text-center pointer-events-none px-4"
        >
          <h2 className={cn(typography.h2, "tracking-tight mb-4", colors.foreground.primary)}>
            Scrolli Hikayeleri
          </h2>
          <p className={cn("text-sm md:text-base max-w-lg leading-relaxed", colors.foreground.muted)}>
            Derinlemesine analizler ve ozel hikayeler.
            <br className="hidden md:block" />
            En guncel haberlerimizi ve ozel iceriklerimizi kesfedin.
          </p>
        </div>

        {/* Card container */}
        <div className="relative w-full h-full">
          {imageUrls.slice(0, TOTAL_CARDS).map((src, i) => (
            <div
              key={i}
              ref={(el) => setCardRef(el, i)}
              className="absolute overflow-hidden rounded-xl shadow-lg"
              style={{
                width: CARD_WIDTH,
                height: CARD_HEIGHT,
                willChange: "transform",
              }}
            >
              <img
                src={src}
                alt={`article-${i}`}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-black/10" />
            </div>
          ))}
        </div>

        {/* Bottom gradient for seamless transition */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-20 pointer-events-none" />
      </div>
    </section>
  );
}
