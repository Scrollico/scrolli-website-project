"use client";

import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/responsive";
import { Heading } from "@/components/ui/typography";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import blogData from "@/data/blog.json";

export default function HeroSection() {
  const featuredArticle = blogData.featured.mainArticle;

  return (
    <section className="relative w-full min-h-[70vh] md:h-[70vh] flex items-center overflow-hidden">
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
      <Container className="relative z-30 pt-20 md:pt-24">
        <div className="max-w-2xl">
          {/* Featured Label */}
          <div className="mb-4 md:mb-8">
            <Badge
              variant="secondary"
              appearance="ghost"
              size="sm"
              className="!px-3 !py-2 uppercase tracking-wide !bg-black/30 backdrop-blur-sm !border !border-white/20 !text-white dark:!bg-black/30 dark:!border-white/20 dark:!text-white rounded opacity-90 shadow-sm cursor-default !bg-none"
              style={{ backgroundImage: 'none' }}
            >
              Featured
            </Badge>
          </div>

          {/* Headline */}
          <Heading
            level={1}
            variant="h2"
            className={cn(
              "mb-6 md:mb-8 max-w-full font-semibold",
              "text-gray-900 dark:text-gray-100"
            )}
            style={{ textShadow: '0 1px 1px rgba(0, 0, 0, 0.1)' }}
          >
            {featuredArticle.title}
          </Heading>

          {/* Read More Link */}
          <Link
            href={`/article/${featuredArticle.id}`}
            className={cn(
              "inline-flex items-center gap-2 no-underline transition-colors duration-300",
              "text-gray-900 dark:text-gray-100",
              "hover:text-gray-800 dark:hover:text-gray-200"
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
