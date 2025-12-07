"use client";
import Link from "next/link";
import Image from 'next/image';
import blogData from "@/data/blog.json";
import { Container, ResponsiveGrid } from "@/components/responsive";
import { Heading } from "@/components/ui/typography";
import { Badge } from "@/components/ui/badge";
import { colors, sectionPadding, componentPadding, gap, elevation, elevationHover, transition, borderRadius, marginBottom, headingDecor } from "@/lib/design-tokens";
import { cn } from "@/lib/utils";
import ScrolliPremiumBanner from "./ScrolliPremiumBanner";
import ArticleList from "./ArticleList";
import NewsletterSignup from "./NewsletterSignup";

export default function Section1() {
  const { featured } = blogData;

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
            {featured.title}
          </Heading>
        </div>

        {/* Featured Articles Grid - A2, A3, A4: Using only sideArticles to avoid duplicate with HeroSection (A1) */}
        <ResponsiveGrid columns={{ default: 1, md: 3 }} gap="lg" className={gap.lg}>
          {featured.sideArticles.slice(0, 3).map((article) => (
            <article key={article.id} className={cn("group", borderRadius.lg, "overflow-hidden", elevation[1], elevationHover[2], transition.normal, "flex flex-col", colors.background.elevated)}>
              {/* Article Image - Separate from text */}
              <Link href={`/article/${article.id}`} className="block w-full">
                <figure
                  className={cn(
                    "relative w-full aspect-[4/3] overflow-hidden rounded-lg m-0",
                    colors.surface.elevated
                  )}
                >
                  <Image
                    src={article.image}
                    alt={article.title}
                    fill
                    className="object-cover object-center w-full h-full"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
                    style={{ objectFit: 'cover' }}
                  />
                </figure>
              </Link>

              {/* Article Content - Separate below image */}
              <div className={cn(componentPadding.md, "flex-1 flex flex-col")}>
                {/* Category Badge */}
                {article.category && (
                  <div className={cn(gap.sm, "flex justify-start")}>
                    <Badge
                      variant="secondary"
                      appearance="outline"
                      size="sm"
                      className="uppercase tracking-wide"
                    >
                      {article.category}
                    </Badge>
                  </div>
                )}
                <Heading
                  level={3}
                  variant="h5"
                  className="leading-tight"
                >
                  <Link
                    href={`/article/${article.id}`}
                    className={cn(colors.foreground.interactive)}
                  >
                    {article.title}
                  </Link>
                </Heading>
              </div>

            </article>
          ))}
        </ResponsiveGrid>

        {/* Newsletter Section with Article List */}
        <div className={cn("grid grid-cols-1 lg:grid-cols-[7fr_3fr] xl:grid-cols-[2fr_1fr]", gap.lg, "mt-12")}>
          <div className="min-w-0">
            <ArticleList />
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
