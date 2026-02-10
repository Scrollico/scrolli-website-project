"use client";

import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/responsive";
import { Heading, Text } from "@/components/ui/typography";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Badge } from "@/components/ui/badge";
import {
  sectionPadding,
  gap,
  componentPadding,
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
  slug,
  avatarUrl,
  bio,
  articles,
}: AuthorBySlugSectionProps) {
  const [currentPage, setCurrentPage] = useState(1);
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
      window.scrollTo({ top: scrollPosition, behavior: "instant" as ScrollBehavior });
    });
  };

  return (
    <section className={sectionPadding.md}>
      <Container>
        <div className={cn("grid grid-cols-1 lg:grid-cols-12", gap.lg)}>
          <div className="lg:col-span-8">
            {/* Author Box */}
            <div
              className={cn(
                borderRadius.lg,
                border.thin,
                colors.background.elevated,
                elevation[1],
                componentPadding.lg,
                "mb-8 md:mb-12"
              )}
            >
              <div className={cn("flex flex-col md:flex-row", gap.md)}>
                <div className="flex-shrink-0">
                  <div className="relative">
                    <Image
                      alt={name}
                      src={avatarUrl || DEFAULT_AVATAR}
                      className={cn(
                        borderRadius.full,
                        border.thin,
                        "border-4",
                        colors.border.light
                      )}
                      width={106}
                      height={106}
                      unoptimized={!!avatarUrl && avatarUrl.startsWith("http")}
                    />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="mb-4">
                    <Heading level={5} variant="h5">
                      <span
                        className={cn(
                          colors.foreground.primary
                        )}
                        itemProp="name"
                      >
                        {name}
                      </span>
                    </Heading>
                  </div>
                  {bio && (
                    <Text
                      variant="body"
                      color="secondary"
                      className="hidden md:block mb-4"
                    >
                      {bio}
                    </Text>
                  )}
                </div>
              </div>
            </div>

            <div className="mb-8 md:mb-12">
              <SectionHeader
                title="Latest Posts"
                level={4}
                variant="h4"
              />
            </div>

            {/* Articles List */}
            <div className={cn("flex flex-col", gap.lg)}>
              {paginatedArticles.length === 0 ? (
                <Text variant="body" color="secondary">
                  Bu yazara ait henüz yayınlanmış içerik yok.
                </Text>
              ) : (
                paginatedArticles.map((article, idx) => (
                  <article
                    key={article.id}
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
                        {article.category && (
                          <Badge className="self-start tracking-wide border-none bg-gray-200/50 text-gray-600 dark:bg-gray-700/50 dark:text-gray-300">
                            {article.category}
                          </Badge>
                        )}
                        <Heading level={3} variant="h3" className="mb-2">
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
                          <Text variant="body" color="secondary" className="mb-4">
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
                          <span className="readingTime" title={article.readTime}>
                            {article.readTime}
                          </span>
                        </div>
                      </div>
                    </div>
                    {(article.thumbnail ?? article.image) && (
                      <div
                        className={cn(
                          "w-full md:w-32 lg:w-40 flex-shrink-0",
                          "aspect-[4/3] md:aspect-square",
                          borderRadius.md,
                          "overflow-hidden",
                          "bg-cover bg-center"
                        )}
                        style={{
                          backgroundImage: `url(${article.thumbnail ?? article.image})`,
                        }}
                      />
                    )}
                  </article>
                ))
              )}
            </div>

            {totalPages > 1 && (
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
