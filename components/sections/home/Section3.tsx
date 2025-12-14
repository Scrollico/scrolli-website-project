"use client";

import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/responsive";
import blogData from "@/data/blog.json";
import PodcastSection from "./PodcastSection";
import { sectionPadding, colors } from "@/lib/design-tokens";
import { cn } from "@/lib/utils";
import { Heading, Text } from "@/components/ui/typography";
import { FreeContentBadgeIcon, PremiumContentBadgeIcon } from "@/components/icons/ScrolliIcons";

// Category configuration
const categories = [
  {
    name: "Eksen",
    slug: "eksen",
    displayName: "Eksen",
  },
  {
    name: "Gelecek",
    slug: "gelecek",
    displayName: "Gelecek",
  },
];

export default function Section3() {
  const { todayHighlights, mostRecent, featured, featuredSlider } = blogData;

  // Get all available articles from multiple sources
  const getAllAvailableArticles = () => {
    const allArticles: any[] = [];
    
    // Add todayHighlights articles
    if (todayHighlights?.articles) {
      allArticles.push(...todayHighlights.articles);
    }
    
    // Add mostRecent mainArticles
    if (mostRecent?.mainArticles) {
      allArticles.push(...mostRecent.mainArticles);
    }
    
    // Add mostRecent sideArticles if available
    if (mostRecent?.sideArticles) {
      allArticles.push(...mostRecent.sideArticles);
    }
    
    // Add featured main and side articles
    if (featured?.mainArticle) {
      allArticles.push(featured.mainArticle);
    }
    if (featured?.sideArticles) {
      allArticles.push(...featured.sideArticles);
    }

    // Add featured slider articles
    if (featuredSlider?.articles) {
      allArticles.push(...featuredSlider.articles);
    }

    // Remove duplicates by ID
    const uniqueArticles = allArticles.filter((article, index, self) =>
      index === self.findIndex((a) => a.id === article.id)
    );
    
    return uniqueArticles;
  };

  // Get articles for each category, ensuring we have 1 featured + 4 list items
  const getCategoryData = (categorySlug: string) => {
    const allArticles = getAllAvailableArticles();
    
    // Get articles from the specific category first
    const categoryArticles = allArticles.filter(
      (article) => article.category?.toLowerCase() === categorySlug.toLowerCase()
    );
    
    // If we have enough category articles (5+), use them
    if (categoryArticles.length >= 5) {
      return {
        featuredArticle: categoryArticles[0],
        listArticles: categoryArticles.slice(1, 5),
      };
    }
    
    // If we have some category articles but not 5, prioritize them and fill with others
    if (categoryArticles.length > 0) {
      // Get other articles to fill up to 5
      const otherArticles = allArticles.filter(
        (article) => article.category?.toLowerCase() !== categorySlug.toLowerCase()
      );
      
      // Combine: category articles first, then others
      const combined = [...categoryArticles, ...otherArticles];
      
      // Ensure we have at least 5 articles (pad with duplicates if needed)
      while (combined.length < 5 && categoryArticles.length > 0) {
        combined.push(
          ...categoryArticles.slice(0, Math.min(5 - combined.length, categoryArticles.length))
        );
      }
      
      return {
        featuredArticle: combined[0],
        listArticles: combined.slice(1, 5).filter(Boolean),
      };
    }
    
    // Fallback: use all available articles, pad if needed
    let articlesToUse = [...allArticles];
    while (articlesToUse.length < 5 && allArticles.length > 0) {
      articlesToUse.push(
        ...allArticles.slice(0, Math.min(5 - articlesToUse.length, allArticles.length))
      );
    }
    
    return {
      featuredArticle: articlesToUse[0],
      listArticles: articlesToUse.slice(1, 5).filter(Boolean),
    };
  };

  return (
    <>
      <div className="content-widget">
        <Container size="xl" className={sectionPadding.md}>
          {/* Two Column Layout for Categories */}
          <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Vertical divider between the two sections on desktop */}
            <div className="hidden lg:block absolute inset-y-0 left-1/2 w-px bg-border -translate-x-1/2" />
            {categories.map((category) => {
              const { featuredArticle, listArticles } = getCategoryData(category.slug);

              if (!featuredArticle) return null;

              return (
                <div key={category.slug} className="flex flex-col">
                  {/* Category Title with Underline */}
                  <div className="mb-8">
                    <Link
                      href={`/categories/${category.slug}`}
                      className="group inline-block"
                    >
                      <Heading
                        level={2}
                        variant="h5"
                        className={cn(
                          "mb-2 text-xl md:text-2xl font-display",
                          colors.foreground.primary,
                          "group-hover:opacity-80 transition-opacity"
                        )}
                      >
                        {category.displayName} &gt;
                      </Heading>
                    </Link>
                    <div className={cn("h-px w-full", colors.border.DEFAULT)} />
                    <div className="w-12 h-0.5 bg-primary mt-4" />
                  </div>

                  {/* 5-Column Grid Layout */}
                  <div 
                    className="chain hpgrid hpgrid-max-width ma-auto lg-dsktp-order include-dividers-tables large-bottom-separator no-line-bottom"
                    style={{ 
                      display: 'grid',
                      gridTemplateColumns: 'repeat(5, 1fr)',
                      gap: '32px',
                      '--table-row-gap': '32px',
                      '--table-col-gap': '32px',
                      '--feature-row-gap': '32px',
                      '--feature-col-gap': '32px'
                    } as React.CSSProperties}
                  >
                    {/* Featured Article (spans columns 1-3) */}
                    <article
                      className="flex flex-col"
                      style={{ gridColumn: '1 / 4' }}
                    >
                      {featuredArticle.image && (
                        <figure className="relative w-full aspect-[4/3] mb-4 overflow-hidden rounded-lg">
                          <Link
                            href={`/article/${featuredArticle.id}`}
                            prefetch={true}
                            className="block w-full h-full"
                          >
                            <Image
                              src={featuredArticle.image}
                              alt={featuredArticle.title || "Article image"}
                              fill
                              className="object-cover transition-transform duration-300 hover:scale-105"
                              sizes="(max-width: 1024px) 100vw, 60vw"
                            />
                          </Link>
                          <div className="absolute top-2 right-2 z-10 pointer-events-none">
                            {(featuredArticle as any).isPremium ? (
                              <PremiumContentBadgeIcon size={20} className="drop-shadow-md" />
                            ) : (
                              <FreeContentBadgeIcon size={20} className="drop-shadow-md" />
                            )}
                          </div>
                        </figure>
                      )}

                      {featuredArticle.title && (
                        <Heading
                          level={2}
                          variant="h3"
                          className="leading-tight font-display text-2xl md:text-3xl font-semibold"
                        >
                          <Link
                            href={`/article/${featuredArticle.id}`}
                            className={cn(
                              colors.foreground.primary,
                              "hover:opacity-80 transition-opacity"
                            )}
                          >
                            {featuredArticle.title}
                          </Link>
                        </Heading>
                      )}
                    </article>

                    {/* List Articles (spans columns 4-5) */}
                    <div
                      className="flex flex-col"
                      style={{ gridColumn: '4 / 6' }}
                    >
                      <ul className="space-y-0">
                        {listArticles
                          .slice(0, 4)
                          .filter((article) => article && article.id && article.title)
                          .map((article, index, arr) => (
                            <li
                              key={`txt-${article.id || index}`}
                              className={cn(
                                index !== arr.length - 1 && "border-b",
                                colors.border.DEFAULT,
                                "py-4 first:pt-0"
                              )}
                            >
                              <Link
                                href={`/article/${article.id}`}
                                className={cn(
                                  "block group",
                                  colors.foreground.primary,
                                  "hover:opacity-80 transition-opacity"
                                )}
                              >
                                <Text
                                  variant="body"
                                  className={cn(
                                    "font-normal leading-snug font-display text-lg md:text-xl",
                                    colors.foreground.primary
                                  )}
                                >
                                  {article.title}
                                </Text>
                              </Link>
                            </li>
                          ))}
                      </ul>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Container>
      </div>

      {/* Podcast Section */}
      <PodcastSection />
    </>
  );
}
