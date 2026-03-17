"use client";
import Link from "next/link";
import Image from 'next/image';
import { Container, ResponsiveGrid } from "@/components/responsive";
import { Heading } from "@/components/ui/typography";
import { Badge } from "@/components/ui/badge";
import { colors, sectionPadding, componentPadding, gap, elevation, elevationHover, transition, borderRadius, marginBottom, marginTop, interactions, link } from "@/lib/design-tokens";
import { cn } from "@/lib/utils";
import { Article } from "@/types/content";
import ScrolliPremiumBanner from "./ScrolliPremiumBanner";
import ArticleList from "./ArticleList";
import NewsletterSignup from "./NewsletterSignup";
import { AuthorWithLatestArticle } from "./AuthorArticles";

interface Section1Props {
  title?: string;
  articles: Article[];
  articleListArticles?: Article[];
  authors?: AuthorWithLatestArticle[];
}

export default function Section1({ title = "Editor's Picks", articles, articleListArticles = [], authors = [] }: Section1Props) {

  return (
    <section className={sectionPadding.lg}>
      <Container>
        {/* Section Title */}
        <div className={cn(gap.lg, marginBottom.md)}>
          <Heading
            level={2}
            variant="h1"
            decoration="underlinePrimary"
          >
            {title}
          </Heading>
        </div>

        {/* Featured Articles Grid - A2, A3, A4: Using only sideArticles to avoid duplicate with HeroSection (A1) */}
        <ResponsiveGrid columns={{ default: 1, md: 3 }} gap="lg" className={gap.lg}>
          {articles.slice(0, 3).map((article) => {

            return (
              <article key={article.id} className={cn("group", borderRadius.lg, "overflow-hidden", elevation[1], elevationHover[2], transition.normal, "flex flex-col", "bg-[#F4F5FA] dark:bg-muted", "border border-transparent dark:border-gray-800/3")}>
                {/* Article Image - Separate from text */}
                <Link href={`/${article.id}`} className="block w-full">
                  <figure
                    className={cn(
                      "relative w-full aspect-[4/3] overflow-hidden rounded-lg m-0",
                      colors.surface.elevated
                    )}
                  >
                    {(article.thumbnail ?? article.image) ? (
                      <Image
                        src={article.thumbnail ?? article.image ?? ""}
                        alt={article.title}
                        fill
                        className="object-cover object-center w-full h-full"
                        sizes="(max-width: 768px) 100vw, (max-width: 1280px) 33vw, 420px"
                        style={{ objectFit: 'cover' }}
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                        <span className="text-gray-400 dark:text-gray-500 text-sm">No Image</span>
                      </div>
                    )}
                  </figure>
                </Link>

                {/* Article Content - Separate below image */}
                <div className={cn(componentPadding.md, "flex-1 flex flex-col", gap.sm)}>
                  {/* Category Badge - always rendered for consistent spacing */}
                  <div className={cn("flex justify-start", "min-h-[24px]")}>
                    {article.category && (
                      <Badge
                        className="tracking-wide border-none bg-gray-200/50 text-gray-600 dark:bg-gray-700/50 dark:text-gray-300"
                      >
                        {article.category}
                      </Badge>
                    )}
                  </div>
                  <Heading
                    level={3}
                    variant="h5"
                    className="leading-tight line-clamp-2"
                  >
                    <Link
                      href={`/${article.id}`}
                      className={cn(colors.foreground.primary, link.title)}
                    >
                      {article.title}
                    </Link>
                  </Heading>
                </div>

              </article>
            );
          })}
        </ResponsiveGrid>

        {/* Newsletter Section with Article List */}
        <div className={cn("grid grid-cols-1 lg:grid-cols-[7fr_3fr] xl:grid-cols-[2fr_1fr]", gap.lg, marginTop.lg, marginBottom.lg)}>
          <div className="min-w-0">
            <ArticleList articles={articleListArticles} authors={authors} />
          </div>
          <div className="relative min-w-0">
            {/* Vertical Divider */}
            <div className="hidden lg:block absolute left-0 top-0 bottom-0 w-px bg-border -translate-x-4" />
            <NewsletterSignup />
          </div>
        </div>

        {/* Divider */}
        <hr className={cn("border-t", colors.border.DEFAULT, gap.lg)} />
      </Container>

      {/* Scrolli Premium CTA Banner */}
      <ScrolliPremiumBanner />
    </section>
  );
}
