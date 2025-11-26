"use client";
import Link from 'next/link'
import Image from 'next/image'
import blogData from '@/data/blog.json'
import Pagination from '@/components/elements/Pagination'
import { useState, useEffect } from 'react'
import { Container } from '@/components/responsive'
import { Heading, Text } from '@/components/ui/typography'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { getAuthorName } from '@/lib/author-loader'
import {
  sectionPadding,
  gap,
  colors,
  borderRadius,
  border,
  elevation,
  componentPadding
} from '@/lib/design-tokens'
import { cn } from '@/lib/utils'

import { FreeContentBadgeIcon, PremiumContentBadgeIcon } from "@/components/icons/ScrolliIcons";

interface Section1Props {
  searchQuery: string;
}

interface SearchResult {
  article: any;
  score: number;
}

export default function Section1({ searchQuery }: Section1Props) {
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const articlesPerPage = 5;
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    // Combine all articles from different sections
    const allArticles = [
      ...blogData.Culture.articles,
      ...blogData.theStartup.articles,
      ...blogData.RyanMarkPosts.articles,
      ...blogData.mostRecent.mainArticles,
      ...blogData.todayHighlights.articles,
      blogData.featured.mainArticle,
      ...blogData.featured.sideArticles
    ].filter(Boolean); // Remove any null/undefined entries

    // Filter and score articles based on search query
    const searchLower = searchQuery.toLowerCase();
    const results: SearchResult[] = allArticles
      .map(article => {
        let score = 0;

        // Title matches get highest priority
        if (article.title?.toLowerCase().includes(searchLower)) {
          score += 3;
        }

        // Author matches get medium priority
        if (article.author?.toLowerCase().includes(searchLower)) {
          score += 2;
        }

        // Category matches get medium priority
        if (article.category?.toLowerCase().includes(searchLower)) {
          score += 2;
        }
        // Excerpt matches get lowest priority
        if ('excerpt' in article && article.excerpt?.toLowerCase().includes(searchLower)) {
          score += 1;
        }

        return { article, score };
      })
      .filter(result => result.score > 0) // Only keep results with matches
      .sort((a, b) => b.score - a.score); // Sort by score descending

    setSearchResults(results);
    setCurrentPage(1); // Reset to first page when search changes
  }, [searchQuery]);

  const totalPages = Math.ceil(searchResults.length / articlesPerPage);
  const startIdx = (currentPage - 1) * articlesPerPage;
  const endIdx = startIdx + articlesPerPage;
  const paginatedArticles = searchResults.slice(startIdx, endIdx);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <section className={cn(sectionPadding.md, colors.background.base)}>
      <Container>
        <div className={cn("flex flex-col lg:flex-row", gap.lg)}>
          {/* Main Content - Search Results */}
          <div className="flex-1 lg:w-2/3">
            {/* Search Results Header */}
            <div className={cn(
              "mb-8 md:mb-12",
              componentPadding.md,
              colors.background.elevated,
              borderRadius.lg,
              "border-b-2 border-primary"
            )}>
              <Heading level={4} variant="h4" className="inline-block">
                Search results for
                <span className="ml-2">"{searchQuery}"</span>
              </Heading>
            </div>

            {/* Search Results */}
            {paginatedArticles.length > 0 ? (
              <div className={cn("flex flex-col", gap.lg)}>
                {paginatedArticles.map(({ article }, idx) => (
                  <article
                    key={idx}
                    className={cn(
                      "flex flex-col md:flex-row",
                      gap.md,
                      componentPadding.md,
                      borderRadius.lg,
                      elevation[1],
                      "mb-4",
                      // Premium Styling - background only, no border
                      article.isPremium
                        ? "bg-amber-50/40 dark:bg-amber-950/20"
                        : cn(colors.background.elevated, border.thin)
                    )}
                  >
                    {/* Article Content */}
                    <div className="flex-1 md:w-3/4">
                      <div className="flex flex-col">
                        {/* Tag Badge */}
                        {article.tag && (
                          <div className="mb-3">
                            <Badge
                              variant="secondary"
                              appearance="outline"
                              size="sm"
                              className="uppercase tracking-wide"
                            >
                              {article.tag}
                            </Badge>
                          </div>
                        )}

                        {/* Article Title */}
                        <Heading level={3} variant="h5" className={cn("mb-4", colors.foreground.primary)}>
                          <Link
                            href={`/article/${article.id}`}
                            className={cn(
                              "hover:text-primary transition-colors",
                              colors.foreground.primary
                            )}
                          >
                            {article.title}
                          </Link>
                        </Heading>

                        {/* Article Excerpt */}
                        <Text
                          variant="body"
                          color="secondary"
                          className="mb-4 line-clamp-3"
                        >
                          {article.excerpt}
                        </Text>

                        {/* Article Meta */}
                        <div className={cn("flex flex-wrap items-center gap-2", colors.foreground.muted, "text-sm")}>
                          <Text as="span" variant="bodySmall" color="muted">
                            <Link
                              href={`/author/${article.author.toLowerCase().replace(/\s+/g, "-")}`}
                              className="hover:text-primary transition-colors"
                            >
                              {getAuthorName(article.author)}
                            </Link>
                            {' '}in{' '}
                            <Link
                              href="/archive"
                              className="hover:text-primary transition-colors"
                            >
                              {article.category}
                            </Link>
                          </Text>
                          <span className="mx-1">·</span>
                          <Text as="span" variant="bodySmall" color="muted">
                            {article.date}
                          </Text>
                          <span className="mx-1">·</span>
                          <Text as="span" variant="bodySmall" color="muted" title={article.readTime}>
                            {article.readTime}
                          </Text>
                          <span className="ml-1">
                            <svg className="inline-block w-4 h-4" fill="currentColor" viewBox="0 0 15 15">
                              <path d="M7.438 2.324c.034-.099.09-.099.123 0l1.2 3.53a.29.29 0 0 0 .26.19h3.884c.11 0 .127.049.038.111L9.8 8.327a.271.271 0 0 0-.099.291l1.2 3.53c.034.1-.011.131-.098.069l-3.142-2.18a.303.303 0 0 0-.32 0l-3.145 2.182c-.087.06-.132.03-.099-.068l1.2-3.53a.271.271 0 0 0-.098-.292L2.056 6.146c-.087-.06-.071-.112.038-.112h3.884a.29.29 0 0 0 .26-.19l1.2-3.52z" />
                            </svg>
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Article Image */}
                    <div className={cn(
                      "w-full md:w-1/4",
                      "relative",
                      "h-[200px] md:h-[180px]",
                      borderRadius.lg,
                      "overflow-hidden",
                      colors.surface.elevated
                    )}>
                      <Image
                        src={article.image}
                        alt={article.title}
                        fill
                        className="object-contain"
                        sizes="(max-width: 768px) 100vw, 25vw"
                      />
                      <div className="absolute top-2 right-2 z-10 pointer-events-none">
                        {article.isPremium ? (
                          <PremiumContentBadgeIcon size={20} className="drop-shadow-md" />
                        ) : (
                          <FreeContentBadgeIcon size={20} className="drop-shadow-md" />
                        )}
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              /* Empty State */
              <div className={cn(
                "text-center",
                sectionPadding.md,
                colors.background.base
              )}>
                <Heading level={3} variant="h3" className="mb-4">
                  No results found for "{searchQuery}"
                </Heading>
                <Text variant="body" color="secondary">
                  Try different keywords or check your spelling
                </Text>
              </div>
            )}

            {/* Pagination */}
            {searchResults.length > 0 && (
              <div className={cn("mt-8 md:mt-12")}>
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </div>

          {/* Sidebar - Popular in Culture */}
          <aside className={cn(
            "lg:w-1/3",
            "lg:pl-8",
            "lg:sticky lg:top-24 lg:self-start"
          )}>
            <Card className={cn(
              componentPadding.md,
              colors.background.elevated,
              elevation[1]
            )}>
              <Heading
                level={5}
                variant="h5"
                className={cn(
                  "mb-6",
                  "border-b-2 border-primary pb-3",
                  colors.foreground.primary
                )}
              >
                Popular in Culture
              </Heading>

              <ol className={cn("flex flex-col", gap.md)}>
                {blogData.mostRecent.popular.articles.map((article, idx) => (
                  <li key={idx} className={cn("flex", gap.sm)}>
                    {/* Number Badge */}
                    <div className={cn(
                      "flex-shrink-0",
                      "w-8 h-8",
                      "flex items-center justify-center",
                      borderRadius.md,
                      colors.primary.bg,
                      "text-white",
                      "font-semibold text-sm"
                    )}>
                      {article.number}
                    </div>

                    {/* Article Content */}
                    <div className="flex-1 min-w-0">
                      <Heading level={5} variant="h6" className={cn("mb-2", colors.foreground.primary)}>
                        <Link
                          href={`/article/${article.id}`}
                          className={cn(
                            "hover:text-primary transition-colors line-clamp-2",
                            colors.foreground.primary
                          )}
                        >
                          {article.title}
                        </Link>
                      </Heading>

                      <div className={cn("flex flex-wrap items-center gap-2", colors.foreground.muted, "text-xs")}>
                        <Text as="span" variant="caption" color="muted">
                          <Link
                            href="/author"
                            className="hover:text-primary transition-colors"
                          >
                            {article.author}
                          </Link>
                          {' '}in{' '}
                          <Link
                            href="/archive"
                            className="hover:text-primary transition-colors"
                          >
                            {article.category}
                          </Link>
                        </Text>
                        <span className="mx-1">·</span>
                        <Text as="span" variant="caption" color="muted">
                          {article.date}
                        </Text>
                        <span className="mx-1">·</span>
                        <Text as="span" variant="caption" color="muted" title={article.readTime}>
                          {article.readTime}
                        </Text>
                        <span className="ml-1">
                          <svg className="inline-block w-3 h-3" fill="currentColor" viewBox="0 0 15 15">
                            <path d="M7.438 2.324c.034-.099.09-.099.123 0l1.2 3.53a.29.29 0 0 0 .26.19h3.884c.11 0 .127.049.038.111L9.8 8.327a.271.271 0 0 0-.099.291l1.2 3.53c.034.1-.011.131-.098.069l-3.142-2.18a.303.303 0 0 0-.32 0l-3.145 2.182c-.087.06-.132.03-.099-.068l1.2-3.53a.271.271 0 0 0-.098-.292L2.056 6.146c-.087-.06-.071-.112.038-.112h3.884a.29.29 0 0 0 .26-.19l1.2-3.52z" />
                          </svg>
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ol>
            </Card>
          </aside>
        </div>

        {/* Ads Section */}
        <div className={cn("mt-12 md:mt-16", sectionPadding.sm)}>
          <div className={cn("flex justify-center", colors.background.base)}>
            <Link href="#" className="block">
              <Image
                src="/assets/images/ads/ads-2.png"
                alt="Advertisement"
                width={600}
                height={71}
                className="w-full max-w-full h-auto"
              />
            </Link>
          </div>
          <div className={cn("mt-8", border.thin, "border-t")} />
        </div>
      </Container>
    </section>
  );
}
