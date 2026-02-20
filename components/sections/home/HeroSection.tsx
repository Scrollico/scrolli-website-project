"use client";

import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/responsive";
import { Heading } from "@/components/ui/typography";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { gap, colors } from "@/lib/design-tokens";
import { Article } from "@/types/content";
import { useEffect, useRef } from "react";

interface HeroSectionProps {
  article: Article | null;
}

export default function HeroSection({ article }: HeroSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const gradientRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current || !imageContainerRef.current || !gradientRef.current) return;

    // Protect hero section from Instorier scroll-jacking
    const protectHeroSection = () => {
      if (!sectionRef.current) return;

      const computedStyle = window.getComputedStyle(sectionRef.current);
      const top = computedStyle.top;

      // If Instorier has applied negative positioning, reset it
      if (top && (top.includes('-') || parseFloat(top) < 0)) {
        sectionRef.current.style.setProperty('top', 'auto', 'important');
        sectionRef.current.style.setProperty('position', 'relative', 'important');
        sectionRef.current.style.setProperty('transform', 'none', 'important');
      }
    };

    // Initial protection
    protectHeroSection();

    // Monitor for changes (Instorier might apply changes after initial load)
    const observer = new MutationObserver(() => {
      protectHeroSection();
    });

    observer.observe(sectionRef.current, {
      attributes: true,
      attributeFilter: ['style', 'class'],
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  if (!article) {
    return null;
  }

  return (
    <section
      ref={sectionRef}
      data-hero-section="true"
      className="relative w-full min-h-[70vh] md:h-[70vh] flex items-end justify-center overflow-hidden hero-full-height"
      style={{
        position: 'relative',
        top: '0px',
        marginTop: '0px',
        paddingTop: '0px',
        zIndex: 10
      } as React.CSSProperties}
    >
      {/* Background Image */}
      <div ref={imageContainerRef} className="absolute inset-0 z-10">
        {article.image && (
          <>
            {article.mobileImage ? (
              <>
                {/* Mobile image */}
                <Image
                  src={article.mobileImage}
                  alt={article.title}
                  fill
                  className="object-cover object-center md:hidden"
                  priority
                  fetchPriority="high"
                  sizes="(max-width: 768px) 100vw, 100vw"
                  quality={75}
                />
                {/* Desktop image */}
                <Image
                  src={article.image}
                  alt={article.title}
                  fill
                  className="object-cover object-center hidden md:block"
                  priority
                  fetchPriority="high"
                  sizes="(max-width: 1280px) 100vw, 1280px"
                  quality={75}
                />
              </>
            ) : (
              <Image
                src={article.image}
                alt={article.title}
                fill
                className="object-cover object-center"
                priority
                fetchPriority="high"
                sizes="(max-width: 1280px) 100vw, 1280px"
                quality={75}
              />
            )}
          </>
        )}
        {/* Overlay gradient across entire hero */}
        <div className="absolute inset-0 z-20 hero-gradient-overlay" />
        {/* Bottom gradient for above-the-fold text readability (matches live hero) */}
        <div
          ref={gradientRef}
          className={cn(
            "absolute bottom-0 left-0 w-full z-20",
            "h-[85%] md:h-[90%] lg:h-[95%] xl:h-[100%]",
            "hero-bottom-gradient"
          )}
        />
      </div>

      {/* Content - matches live hero layout (bottom-left, above the fold) */}
      <Container className={cn("relative z-30 w-full")} padding="lg">
        <div
          className={cn(
            "max-w-2xl",
            "flex flex-col",
            gap.lg,
            "mb-8 md:mb-12 lg:mb-16"
          )}
        >
          {/* Featured Label */}
          <div>
            <Badge
              variant="subtle"
              className="tracking-wide backdrop-blur-sm opacity-90 shadow-sm cursor-default border-transparent dark:border-transparent"
            >
              Featured
            </Badge>
          </div>

          {/* Headline */}
          <Heading
            level={1}
            variant="h1"
            className="max-w-full"
            style={{ textShadow: "0 1px 1px rgba(0, 0, 0, 0.1)" }}
          >
            {article.title}
          </Heading>

          {/* Read More Link */}
          <Link
            href={`/${article.id}`}
            className={cn(
              "inline-flex items-center gap-2 no-underline transition-colors duration-300",
              colors.foreground.primary,
              colors.foreground.interactive
            )}
            style={{ textShadow: "0 1px 1px rgba(0, 0, 0, 0.1)" }}
          >
            Read in-depth
            <svg
              className="h-4 w-4 md:h-5 md:w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        </div>
      </Container>
    </section>
  );
}
