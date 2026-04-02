"use client";

import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/responsive";
import PodcastSection from "./PodcastSection";
import { Article } from "@/types/content";
import { cn } from "@/lib/utils";
import { colors, sectionPadding, gap, interactions, accentColor } from "@/lib/design-tokens";
import { Heading, Text, Caption } from "@/components/ui/typography";
import { Badge } from "@/components/ui/badge";

interface Section3Props {
  articlesByCategory: {
    tümü: Article[];
    eksen: Article[];
    zest: Article[];
    finans: Article[];
    gelecek: Article[];
  };
}

// Column component for Eksen/Gelecek sections
function CategoryColumn({
  title,
  articles,
  href,
}: {
  title: string;
  articles: Article[];
  href: string;
}) {
  const featuredArticle = articles[0];
  const relatedArticles = articles.slice(1, 5); // Show up to 4 related articles

  return (
    <div className="flex flex-col h-full">
      {/* Section Title - underline matches SectionHeader (Watch Today's Videos) */}
      <div className="mb-6">
        <Link
          href={href}
          className="inline-flex items-center gap-2 group"
        >
          <Heading
            level={2}
            variant="h3"
            className={cn(
              "font-bold text-lg md:text-xl mb-2",
              colors.foreground.primary,
              interactions.hover
            )}
          >
            {title}
            <span className="ml-1">{" >"}</span>
          </Heading>
        </Link>
        <div className={cn("h-0.5 w-12 mt-4", accentColor.primaryBg)} />
      </div>

      {/* Featured Article */}
      {featuredArticle ? (
        <article className="mb-8 group">
          <Link href={`/${featuredArticle.id}`} className="block">
            <figure className="relative w-full aspect-[16/10] mb-4 overflow-hidden rounded-lg">
              {featuredArticle.image ? (
                <Image
                  src={featuredArticle.image}
                  alt={featuredArticle.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 640px"
                />
              ) : (
                <div className={cn(
                  "w-full h-full flex items-center justify-center",
                  colors.background.elevated
                )}>
                  <span className={cn("text-sm", colors.foreground.muted)}>
                    No image
                  </span>
                </div>
              )}

            </figure>

            {/* Article Meta */}
            <div className="space-y-2">
              {featuredArticle.category && (
                <Badge
                  className="tracking-wide"
                >
                  {featuredArticle.category}
                </Badge>
              )}
              {featuredArticle.date && (
                <Caption
                  as="time"
                  dateTime={featuredArticle.date}
                  className={cn("block", colors.foreground.muted)}
                >
                  {featuredArticle.date}
                </Caption>
              )}

              {/* Title */}
              <Heading
                level={3}
                variant="h4"
                className={cn(
                  "font-display font-bold text-xl md:text-2xl mb-2 line-clamp-2",
                  colors.foreground.primary,
                  interactions.hover
                )}
              >
                {featuredArticle.title}
              </Heading>

              {/* Subtitle/Excerpt */}
              {(featuredArticle.subtitle || featuredArticle.excerpt) && (
                <Text
                  variant="body"
                  className={cn("line-clamp-2", colors.foreground.secondary)}
                >
                  {featuredArticle.subtitle || featuredArticle.excerpt}
                </Text>
              )}
            </div>
          </Link>
        </article>
      ) : (
        <div className={cn(
          "mb-8 p-8 rounded-lg text-center",
          colors.background.elevated
        )}>
          <Text className={colors.foreground.muted}>
            Bu kategoride henüz içerik bulunmuyor.
          </Text>
        </div>
      )}

      {/* Related Articles List */}
      {relatedArticles.length > 0 && (
        <div className="space-y-4 flex-1">
          {relatedArticles.map((article, index) => (
            <article
              key={`${article.id}-${index}`}
              className={cn(
                "pb-4 border-b last:border-0 last:pb-0",
                colors.border.DEFAULT
              )}
            >
              <Link
                href={`/${article.id}`}
                className={cn("group flex", gap.lg)}
              >
                {/* Thumbnail */}
                <figure className="relative w-24 h-16 md:w-32 md:h-20 flex-shrink-0 overflow-hidden rounded-md">
                  {article.image ? (
                    <Image
                      src={article.image}
                      alt={article.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      sizes="(max-width: 768px) 96px, 128px"
                    />
                  ) : (
                    <div className={cn(
                      "w-full h-full flex items-center justify-center",
                      colors.background.elevated
                    )}>
                      <span className={cn("text-xs", colors.foreground.muted)}>
                        No image
                      </span>
                    </div>
                  )}
                </figure>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <Heading
                    level={4}
                    variant="h6"
                    className={cn(
                      "font-display font-semibold text-sm md:text-base mb-1 line-clamp-2",
                      colors.foreground.primary,
                      interactions.hover
                    )}
                  >
                    {article.title}
                  </Heading>
                  {article.date && (
                    <Caption
                      as="time"
                      dateTime={article.date}
                      className={colors.foreground.muted}
                    >
                      {article.date}
                    </Caption>
                  )}
                </div>
              </Link>
            </article>
          ))}
        </div>
      )}

      {/* "Tümünü Gör" Button */}
      <Link
        href={href}
        className={cn(
          "mt-6 pt-4 border-t inline-flex items-center gap-2",
          colors.border.DEFAULT,
          "text-sm font-semibold tracking-wide",
          "transition-opacity duration-200 hover:opacity-70",
          colors.foreground.secondary
        )}
      >
        Tümünü Gör
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M2 6h8M8 3l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </Link>
    </div>
  );
}

export default function Section3({ articlesByCategory }: Section3Props) {
  const eksenArticles = articlesByCategory.eksen || [];
  const gelecekArticles = articlesByCategory.gelecek || [];
  const zestArticles = articlesByCategory.zest || [];
  const finansArticles = articlesByCategory.finans || [];

  return (
    <>
      <div className={cn("content-widget w-full", colors.background.base)}>
        <Container size="xl" className={cn(sectionPadding.md, "w-full")}>
          {/* WordPress.com-style Grid System */}
          <div
            className={cn(
              "grid grid-cols-1 lg:grid-cols-12",
              "gap-4 lg:gap-8",
              "mb-8 lg:mb-12"
            )}
            style={{
              '--table-row-gap': '32px',
              '--table-col-gap': '32px',
            } as React.CSSProperties}
          >
            {/* Eksen Column - Left */}
            <div className={cn(
              "lg:col-span-6",
              "lg:pr-4",
              "lg:border-r border-gray-200 dark:border-gray-700"
            )}>
              <CategoryColumn
                title="Eksen"
                articles={eksenArticles}
                href="/categories?cat=eksen"
              />
            </div>

            {/* Gelecek Column - Right */}
            <div className={cn(
              "lg:col-span-6",
              "lg:pl-4"
            )}>
              <CategoryColumn
                title="Gelecek"
                articles={gelecekArticles}
                href="/categories?cat=gelecek"
              />
            </div>
          </div>

          {/* Second Row: 1x2 Grid */}
          {(zestArticles.length > 0 || finansArticles.length > 0) && (
            <div
              className={cn(
                "grid grid-cols-1 lg:grid-cols-12",
                "gap-4 lg:gap-8"
              )}
              style={{
                '--table-row-gap': '32px',
                '--table-col-gap': '32px',
              } as React.CSSProperties}
            >
              {/* Zest Column - Left */}
              <div className={cn(
                "lg:col-span-6",
                "lg:pr-4",
                "lg:border-r border-gray-200 dark:border-gray-700"
              )}>
                <CategoryColumn
                  title="Zest"
                  articles={zestArticles}
                  href="/categories?cat=zest"
                />
              </div>

              {/* Finans Column - Right */}
              <div className={cn(
                "lg:col-span-6",
                "lg:pl-4"
              )}>
                <CategoryColumn
                  title="Finans"
                  articles={finansArticles}
                  href="/categories?cat=finans"
                />
              </div>
            </div>
          )}
        </Container>
      </div>
      {/*content-widget*/}

      {/* Podcast Section */}
      <PodcastSection />
    </>
  );
}
