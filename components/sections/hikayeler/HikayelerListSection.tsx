"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Container } from "@/components/responsive";
import { Heading, Text } from "@/components/ui/typography";
import {
  sectionPadding,
  gap,
  colors,
  borderRadius,
  typography,
  link,
} from "@/lib/design-tokens";
import { cn } from "@/lib/utils";
import Pagination from "@/components/elements/Pagination";
import type { Article } from "@/types/content";

const ARTICLES_PER_PAGE = 12;

interface HikayelerListSectionProps {
  articles: Article[];
}

export default function HikayelerListSection({
  articles,
}: HikayelerListSectionProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.max(
    1,
    Math.ceil(articles.length / ARTICLES_PER_PAGE)
  );
  const startIdx = (currentPage - 1) * ARTICLES_PER_PAGE;
  const paginatedArticles = articles.slice(startIdx, startIdx + ARTICLES_PER_PAGE);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (articles.length === 0) {
    return (
      <section className={sectionPadding.md}>
        <Container>
          <Text variant="body" color="secondary">
            Henüz hikaye bulunmuyor.
          </Text>
        </Container>
      </section>
    );
  }

  return (
    <section className={sectionPadding.md}>
      <Container>
        {/* Page Header */}
        <header className="mb-10 md:mb-14">
          <Heading level={1} variant="h1" className="mb-3">
            Hikayeler
          </Heading>
          <Text variant="body" color="secondary" className="max-w-xl">
            Scrolli&apos;nin seçkin hikaye koleksiyonu — derinlemesine
            analizler, kişisel perspektifler ve özgün bakış açıları.
          </Text>
        </header>

        {/* Divider */}
        <div className="w-full h-px mb-10 md:mb-14 bg-border" />

        {/* Featured first article — full-width hero card */}
        {paginatedArticles.length > 0 && currentPage === 1 && (() => {
          const hero = paginatedArticles[0];
          const heroImg = hero.thumbnail || hero.image;
          return (
            <article className="group mb-12 md:mb-16">
              <Link
                href={`/${hero.id}`}
                className={cn(
                  "grid grid-cols-1 md:grid-cols-2 overflow-hidden",
                  borderRadius.xl,
                  "border border-border",
                  "bg-muted",
                  "transition-shadow duration-300 hover:shadow-lg"
                )}
              >
                {/* Image */}
                <div className="relative overflow-hidden aspect-[16/10] md:aspect-auto md:min-h-[320px]">
                  {heroImg ? (
                    <Image
                      src={heroImg}
                      alt={hero.title}
                      fill
                      priority
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                      sizes="(max-width: 768px) 100vw, 50vw"
                      unoptimized={heroImg.startsWith("http")}
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800" />
                  )}
                </div>

                {/* Content */}
                <div className="flex flex-col justify-center p-6 md:p-10">
                  <Text
                    variant="caption"
                    color="muted"
                    className="uppercase tracking-widest font-semibold mb-3"
                  >
                    Öne Çıkan
                  </Text>
                  <Heading level={2} variant="h2" className="mb-3">
                    <span className={cn(colors.foreground.primary, link.title)}>
                      {hero.title}
                    </span>
                  </Heading>
                  {hero.excerpt && (
                    <Text
                      variant="body"
                      color="secondary"
                      className="line-clamp-3 mb-5"
                    >
                      {hero.excerpt}
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
                    {hero.author && <span>{hero.author}</span>}
                    {hero.author && hero.date && <span>·</span>}
                    {hero.date && <span>{hero.date}</span>}
                    {hero.readTime && (
                      <>
                        <span>·</span>
                        <span>{hero.readTime}</span>
                      </>
                    )}
                  </div>
                </div>
              </Link>
            </article>
          );
        })()}

        {/* Article Grid — skip the hero (index 0) on page 1 */}
        <div
          className={cn(
            "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
            gap["2xl"]
          )}
        >
          {(currentPage === 1 ? paginatedArticles.slice(1) : paginatedArticles).map(
            (article) => {
              const imgSrc = article.thumbnail || article.image;
              return (
                <article key={article.id} className="group flex flex-col">
                  {/* Image */}
                  <Link
                    href={`/${article.id}`}
                    className={cn(
                      "block relative overflow-hidden mb-4",
                      borderRadius.lg,
                      "aspect-[16/10]"
                    )}
                  >
                    {imgSrc ? (
                      <Image
                        src={imgSrc}
                        alt={article.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        unoptimized={imgSrc.startsWith("http")}
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800" />
                    )}
                  </Link>

                  {/* Content */}
                  <div className="flex flex-col flex-1">
                    <Heading level={3} variant="h5" className="mb-2">
                      <Link
                        href={`/${article.id}`}
                        className={cn(colors.foreground.primary, link.title)}
                      >
                        {article.title}
                      </Link>
                    </Heading>
                    {article.excerpt && (
                      <Text
                        variant="body"
                        color="secondary"
                        className="line-clamp-2 mb-3 text-sm"
                      >
                        {article.excerpt}
                      </Text>
                    )}
                    <div
                      className={cn(
                        "mt-auto flex flex-wrap items-center",
                        gap.sm,
                        typography.caption,
                        colors.foreground.muted
                      )}
                    >
                      {article.author && <span>{article.author}</span>}
                      {article.author && article.date && <span>·</span>}
                      {article.date && <span>{article.date}</span>}
                      {article.readTime && (
                        <>
                          <span>·</span>
                          <span>{article.readTime}</span>
                        </>
                      )}
                    </div>
                  </div>
                </article>
              );
            }
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-12 md:mt-16">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </Container>
    </section>
  );
}
