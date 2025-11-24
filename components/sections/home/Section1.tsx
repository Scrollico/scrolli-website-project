"use client";
import Link from "next/link";
import Image from 'next/image';
import blogData from "@/data/blog.json";
import { Container, ResponsiveGrid } from "@/components/responsive";
import { Heading, Text } from "@/components/ui/typography";
import { Badge } from "@/components/ui/badge";
import { colors } from "@/lib/design-tokens";
import { cn } from "@/lib/utils";
import ScrolliPremiumBanner from "./ScrolliPremiumBanner";
import ArticleList from "./ArticleList";
import NewsletterSignup from "./NewsletterSignup";

export default function Section1() {
  const { featured } = blogData;

  return (
    <section className="py-12 md:py-16 lg:py-20">
      <Container>
        {/* Section Title */}
        <div className="mb-8 md:mb-12">
          <Heading
            level={2}
            variant="h2"
            className="border-b-2 border-primary pb-2 inline-block"
          >
            {featured.title}
          </Heading>
        </div>

        {/* Featured Articles Grid */}
        <ResponsiveGrid columns={{ default: 1, md: 3 }} gap="lg" className="mb-8 md:mb-12">
          {[featured.mainArticle, ...featured.sideArticles.slice(0, 2)].map((article) => (
            <article key={article.id} className={cn("group rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col", colors.background.elevated)}>
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
              <div className="p-4 md:p-6 flex-1 flex flex-col">
                {/* Category Badge */}
                {article.category && (
                  <div className="mb-2 flex justify-start">
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
                    className="hover:text-primary transition-colors"
                  >
                    {article.title}
                  </Link>
                </Heading>
              </div>

            </article>
          ))}
        </ResponsiveGrid>

        {/* Newsletter Section with Article List */}
        <div className="grid grid-cols-1 lg:grid-cols-[7fr_3fr] xl:grid-cols-[2fr_1fr] gap-6 lg:gap-8 mt-12">
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
        <hr className="border-t border-border mt-12 md:mt-16" />
      </Container>

      {/* Scrolli Premium CTA Banner */}
      <ScrolliPremiumBanner />
    </section>
  );
}
