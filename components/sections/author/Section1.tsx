"use client";
import Link from 'next/link'
import blogData from '@/data/blog.json';
import Pagination from '@/components/elements/Pagination';
import { useState } from 'react';
import Image from 'next/image';
import { Facebook, Twitter, Instagram } from 'lucide-react';
import { Container } from '@/components/responsive';
import { Heading, Text } from '@/components/ui/typography';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Badge } from '@/components/ui/badge';
import { 
  sectionPadding, 
  gap, 
  componentPadding, 
  colors, 
  borderRadius, 
  border,
  elevation,
  typography
} from '@/lib/design-tokens';
import { cn } from '@/lib/utils';

export default function Section1() {
  const { RyanMarkPosts, hightlightPosts } = blogData;
  const articlesPerPage = 5;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(RyanMarkPosts.articles.length / articlesPerPage);

  const handlePageChange = (page: number) => {
    // Save scroll position before state update
    const scrollPosition = window.scrollY;
    setCurrentPage(page);
    // Restore scroll position after state update
    requestAnimationFrame(() => {
      window.scrollTo({
        top: scrollPosition,
        behavior: 'instant' as ScrollBehavior
      });
      // Double check after render
      setTimeout(() => {
        window.scrollTo({
          top: scrollPosition,
          behavior: 'instant' as ScrollBehavior
        });
      }, 0);
    });
  };

  const startIdx = (currentPage - 1) * articlesPerPage;
  const endIdx = startIdx + articlesPerPage;
  const paginatedArticles = RyanMarkPosts.articles.slice(startIdx, endIdx);

  return (
    <>
      <section className={sectionPadding.md}>
        <Container>
          <div className={cn("grid grid-cols-1 lg:grid-cols-12", gap.lg)}>
            {/* Main Content - 8 columns */}
            <div className="lg:col-span-8">
              {/* Author Box */}
              <div className={cn(
                borderRadius.lg,
                border.thin,
                colors.background.elevated,
                elevation[1],
                componentPadding.lg,
                "mb-8 md:mb-12"
              )}>
                <div className={cn("flex flex-col md:flex-row", gap.md)}>
                  <div className="flex-shrink-0">
                    <div className="relative">
                      <Image
                        alt="author avatar"
                        src="/assets/images/author-avata-1.jpg"
                        className={cn(
                          borderRadius.full,
                          border.thin,
                          "border-4",
                          colors.border.light
                        )}
                        width={106}
                        height={106}
                      />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className={cn("mb-4")}>
                      <Heading level={5} variant="h5">
                        <Link 
                          href="/author" 
                          title="Ryan" 
                          rel="author"
                          className={cn(
                            colors.foreground.primary,
                            colors.foreground.interactive,
                            "transition-colors"
                          )}
                        >
                          Ryan Mark
                        </Link>
                      </Heading>
                    </div>
                    <Text 
                      variant="body" 
                      color="secondary" 
                      className="hidden md:block mb-4"
                    >
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse laoreet ut ligula et semper. Aenean consectetur, est id gravida venenatis.
                    </Text>
                    <div className={cn("flex flex-wrap items-center", gap.md)}>
                      <Link 
                        target="_blank" 
                        className={cn(
                          colors.foreground.secondary,
                          colors.foreground.interactive,
                          "transition-colors",
                          "flex items-center"
                        )}
                        href="https://www.facebook.com"
                        aria-label="Facebook"
                      >
                        <Facebook className="w-5 h-5" />
                      </Link>
                      <Link 
                        target="_blank" 
                        className={cn(
                          colors.foreground.secondary,
                          colors.foreground.interactive,
                          "transition-colors",
                          "flex items-center"
                        )}
                        href="https://www.twitter.com"
                        aria-label="Twitter"
                      >
                        <Twitter className="w-5 h-5" />
                      </Link>
                      <Link 
                        target="_blank" 
                        className={cn(
                          colors.foreground.secondary,
                          colors.foreground.interactive,
                          "transition-colors",
                          "flex items-center"
                        )}
                        href="https://www.instagram.com"
                        aria-label="Instagram"
                      >
                        <Instagram className="w-5 h-5" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              {/* Latest Posts Section */}
              <div className="mb-8 md:mb-12">
                <SectionHeader 
                  title="Latest Posts"
                  level={4}
                  variant="h4"
                />
              </div>

              {/* Articles List */}
              <div className={cn("flex flex-col", gap.lg)}>
                {paginatedArticles.map((article, idx) => (
                  <article 
                    key={idx} 
                    className={cn(
                      "flex flex-col md:flex-row",
                      gap.md,
                      "pb-6 md:pb-8",
                      idx < paginatedArticles.length - 1 && "border-b",
                      colors.border.DEFAULT
                    )}
                  >
                    <div className="flex-1 min-w-0">
                      <div className={cn("flex flex-col", gap.sm)}>
                        {article.tag && (
                          <Badge variant="secondary" appearance="default" className="self-start">
                            {article.tag}
                          </Badge>
                        )}
                        <Heading level={3} variant="h3" className="mb-2">
                          <Link 
                            href={`/article/${article.id}`}
                            className={cn(
                              colors.foreground.primary,
                              colors.foreground.interactive,
                              "transition-colors"
                            )}
                          >
                            {article.title}
                          </Link>
                        </Heading>
                        <Text variant="body" color="secondary" className="mb-4">
                          {article.excerpt}
                        </Text>
                        <div className={cn("flex flex-wrap items-center", gap.sm, typography.caption, colors.foreground.muted)}>
                          <span>{article.date}</span>
                          <span className="readingTime" title={article.readTime}>
                            {article.readTime}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div 
                      className={cn(
                        "w-full md:w-32 lg:w-40 flex-shrink-0",
                        "aspect-[4/3] md:aspect-square",
                        borderRadius.md,
                        "overflow-hidden",
                        "bg-cover bg-center"
                      )}
                      style={{
                        backgroundImage: `url(${article.image})`,
                      }}
                    />
                  </article>
                ))}
              </div>

              {/* Pagination */}
              <div className="mt-8 md:mt-12">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            </div>

            {/* Sidebar - 4 columns */}
            <aside className="lg:col-span-4 lg:pl-8">
              <div className={cn(
                borderRadius.lg,
                border.thin,
                colors.background.elevated,
                elevation[1],
                componentPadding.md,
                "sticky top-4"
              )}>
                <div className="mb-6">
                  <SectionHeader 
                    title={hightlightPosts.title}
                    level={5}
                    variant="h5"
                  />
                </div>
                <ol className={cn("flex flex-col", gap.md)}>
                  {hightlightPosts.articles.map((article, index) => (
                    <li key={index} className={cn("flex", gap.md)}>
                      <div className={cn(
                        "flex-shrink-0",
                        "w-8 h-8",
                        "flex items-center justify-center",
                        borderRadius.md,
                        colors.background.base,
                        colors.foreground.primary,
                        typography.bodySmall,
                        "font-semibold"
                      )}>
                        {(index + 1).toString().padStart(2, '0')}
                      </div>
                      <div className="flex-1 min-w-0">
                        <Heading level={5} variant="h5" className="mb-2">
                          <Link 
                            href={`/article/${article.id}`}
                            className={cn(
                              colors.foreground.primary,
                              colors.foreground.interactive,
                              "transition-colors"
                            )}
                          >
                            {article.title}
                          </Link>
                        </Heading>
                        <div className={cn("flex flex-wrap items-center", gap.sm, typography.caption, colors.foreground.muted)}>
                          <span>{article.date}</span>
                          <span className="readingTime" title={article.readTime}>
                            {article.readTime}
                          </span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            </aside>
          </div>
        </Container>
      </section>

      {/* Ads Section */}
      <section className={sectionPadding.sm}>
        <Container>
          <div className={cn(
            "flex justify-center",
            "pb-8",
            "border-b",
            colors.border.DEFAULT
          )}>
            <Link href="#" className="block">
              <Image
                src="/assets/images/ads/ads-2.png"
                alt="ads"
                width={600}
                height={71}
                className="w-full max-w-full h-auto"
              />
            </Link>
          </div>
        </Container>
      </section>
    </>
  );
}
