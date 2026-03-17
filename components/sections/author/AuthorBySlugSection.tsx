"use client";

import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/responsive";
import { Heading, Text } from "@/components/ui/typography";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  sectionPadding,
  gap,
  colors,
  borderRadius,
  border,
  elevation,
  typography,
  link,
} from "@/lib/design-tokens";
import { cn } from "@/lib/utils";
import { Article } from "@/types/content";
import Pagination from "@/components/elements/Pagination";
import { useState } from "react";
import { ArrowRight } from "lucide-react";

const ARTICLES_PER_PAGE = 10;
const DEFAULT_AVATAR = "/assets/images/author-avata-1.jpg";

interface AuthorBySlugSectionProps {
  name: string;
  slug: string;
  avatarUrl?: string;
  bio?: string;
  articles: Article[];
}

export default function AuthorBySlugSection({
  name,
  avatarUrl,
  bio,
  articles,
}: AuthorBySlugSectionProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [showAll, setShowAll] = useState(false);
  const totalPages = Math.max(
    1,
    Math.ceil(articles.length / ARTICLES_PER_PAGE)
  );
  const startIdx = (currentPage - 1) * ARTICLES_PER_PAGE;
  const paginatedArticles = articles.slice(
    startIdx,
    startIdx + ARTICLES_PER_PAGE
  );

  const handlePageChange = (page: number) => {
    const scrollPosition = window.scrollY;
    setCurrentPage(page);
    requestAnimationFrame(() => {
      window.scrollTo({
        top: scrollPosition,
        behavior: "instant" as ScrollBehavior,
      });
    });
  };

  const handleShowAll = () => {
    setShowAll(true);
    setCurrentPage(1);
  };

  const displayedArticles = showAll ? articles : paginatedArticles;
  const showPagination = !showAll && totalPages > 1;
  const showViewAllButton = !showAll && articles.length > ARTICLES_PER_PAGE;

  return (
    <section className={sectionPadding.md}>
      <Container>
        <div
          className={cn(
            "max-w-3xl mx-auto lg:max-w-none lg:mx-0",
            "grid grid-cols-1 lg:grid-cols-12",
            gap.lg
          )}
        >
          <div className="lg:col-span-8">
            {/* Author Box */}
            <div
              className={cn(
                borderRadius.lg,
                border.thin,
                colors.background.elevated,
                elevation[1],
                "p-5 md:p-8",
                "mb-8 md:mb-12"
              )}
            >
              <div
                className={cn(
                  "flex flex-col sm:flex-row items-center sm:items-start",
                  gap.md
                )}
              >
                <div className="flex-shrink-0">
                  <div className="relative w-24 h-24 md:w-28 md:h-28">
                    <Image
                      alt={name}
                      src={avatarUrl || DEFAULT_AVATAR}
                      className={cn(
                        borderRadius.full,
                        "object-cover",
                        "border-4",
                        colors.border.light
                      )}
                      fill
                      sizes="(max-width: 768px) 96px, 112px"
                      unoptimized={
                        !!avatarUrl && avatarUrl.startsWith("http")
                      }
                    />
                  </div>
                </div>
                <div className="flex-1 min-w-0 text-center sm:text-left">
                  <Heading level={3} variant="h3" className="mb-2">
                    <span
                      className={cn(colors.foreground.primary)}
                      itemProp="name"
                    >
                      {name}
                    </span>
                  </Heading>
                  {bio && (
                    <Text
                      variant="body"
                      color="secondary"
                      className="mb-3"
                    >
                      {bio}
                    </Text>
                  )}
                  <Text variant="caption" color="muted">
                    {articles.length} yazı
                  </Text>
                </div>
              </div>
            </div>

            {/* Section Header */}
            <div className="mb-6 md:mb-8">
              <SectionHeader title="Son Yazılar" level={4} variant="h4" />
            </div>

            {/* Articles List */}
            <div className={cn("flex flex-col", gap.md)}>
              {displayedArticles.length === 0 ? (
                <Text variant="body" color="secondary">
                  Bu yazara ait henüz yayınlanmış içerik yok.
                </Text>
              ) : (
                displayedArticles.map((article, idx) => (
                  <article
                    key={article.id}
                    className={cn(
                      "flex flex-col sm:flex-row",
                      gap.md,
                      "pb-5 md:pb-6",
                      idx < displayedArticles.length - 1 && "border-b",
                      colors.border.DEFAULT
                    )}
                  >
                    {(article.thumbnail ?? article.image) && (
                      <Link
                        href={`/${article.id}`}
                        className={cn(
                          "w-full sm:w-36 lg:w-44 flex-shrink-0",
                          "aspect-[16/10] sm:aspect-[4/3]",
                          borderRadius.md,
                          "overflow-hidden",
                          "block"
                        )}
                      >
                        <div
                          className="w-full h-full bg-cover bg-center transition-transform duration-300 hover:scale-105"
                          style={{
                            backgroundImage: `url(${article.thumbnail ?? article.image})`,
                          }}
                        />
                      </Link>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className={cn("flex flex-col", gap.sm)}>
                        {article.category && (
                          <Badge className="self-start tracking-wide border-none bg-gray-200/50 text-gray-600 dark:bg-gray-700/50 dark:text-gray-300">
                            {article.category}
                          </Badge>
                        )}
                        <Heading level={5} variant="h5" className="mb-1">
                          <Link
                            href={`/${article.id}`}
                            className={cn(
                              colors.foreground.primary,
                              link.title
                            )}
                          >
                            {article.title}
                          </Link>
                        </Heading>
                        {article.excerpt && (
                          <Text
                            variant="body"
                            color="secondary"
                            className="line-clamp-2 mb-2"
                          >
                            {article.excerpt}
                          </Text>
                        )}
                        <div
                          className={cn(
                            "flex flex-wrap items-center",
                            gap.sm,
                            typography.caption,
                            colors.foreground.muted
                          )}
                        >
                          <span>{article.date}</span>
                          {article.readTime && (
                            <>
                              <span>·</span>
                              <span>{article.readTime}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </article>
                ))
              )}
            </div>

            {/* View All Button */}
            {showViewAllButton && (
              <div className="mt-8 flex justify-center">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={handleShowAll}
                  className="group"
                >
                  Tüm Yazıları Gör ({articles.length})
                  <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </div>
            )}

            {/* Pagination */}
            {showPagination && (
              <div className="mt-8 md:mt-12">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
