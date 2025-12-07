"use client";

import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/responsive";
import { Heading } from "@/components/ui/typography";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { sectionPadding, containerPadding, gap, colors, typography, borderRadius, margin, marginBottom } from "@/lib/design-tokens";
import blogData from "@/data/blog.json";

export default function HeroSection() {
  const featuredArticle = blogData.featured.mainArticle;

  return (
    <section className="relative w-full min-h-[70vh] md:h-[70vh] flex items-end overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-10">
        {featuredArticle.image && (
          <Image
            src={featuredArticle.image}
            alt={featuredArticle.title}
            fill
            className="object-cover object-center"
            priority
            fetchPriority="high"
            sizes="100vw"
            quality={85}
          />
        )}
        {/* Overlay gradient - Responsive with varying opacity */}
        <div className="absolute inset-0 z-20 hero-gradient-overlay" />
        {/* Bottom gradient transition - Responsive height */}
        <div className={cn(`absolute bottom-0 left-0 w-full z-20
          h-[85%]
          md:h-[90%]
          lg:h-[95%]
          xl:h-[100%]
        `, "hero-bottom-gradient")} />
      </div>

      {/* Content */}
      <Container className={cn("relative z-30", marginBottom.lg)} padding="lg">
        <div className={cn("max-w-2xl", "flex flex-col", gap.lg)}>
          {/* Featured Label */}
          <div>
            <Badge
              variant="secondary"
              appearance="ghost"
              size="sm"
              className={cn("!px-3 !py-2 uppercase tracking-wide backdrop-blur-sm opacity-90 shadow-sm cursor-default", colors.surface.overlay, borderRadius.md)}
            >
              Featured
            </Badge>
          </div>

          {/* Headline */}
          <Heading
            level={1}
            variant="h1"
            className="max-w-full"
            style={{ textShadow: '0 1px 1px rgba(0, 0, 0, 0.1)' }}
          >
            {featuredArticle.title}
          </Heading>

          {/* Read More Link */}
          <Link
            href={`/article/${featuredArticle.id}`}
            className={cn(
              "inline-flex items-center gap-2 no-underline transition-colors duration-300",
              colors.foreground.primary,
              colors.foreground.interactive
            )}
            style={{ textShadow: '0 1px 1px rgba(0, 0, 0, 0.1)' }}
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
