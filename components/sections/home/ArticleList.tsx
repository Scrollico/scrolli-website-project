"use client";

import Link from "next/link";
import Image from "next/image";
import { Heading } from "@/components/ui/typography";
import { Badge } from "@/components/ui/badge";
import { gap, interactions } from "@/lib/design-tokens";
import { cn } from "@/lib/utils";
import { Article } from "@/types/content";
import AuthorArticles from "./AuthorArticles";
import { AuthorWithLatestArticle } from "./AuthorArticles";

interface ArticleListProps {
  articles?: Article[];
  authors?: AuthorWithLatestArticle[];
}

export default function ArticleList({ articles = [], authors = [] }: ArticleListProps) {
  // Show first 3 articles, then AuthorArticles component
  const displayArticles = articles.slice(0, 3);

  if (displayArticles.length === 0) {
    return null;
  }

  return (
    <div className={cn("flex flex-col min-w-0 w-full", gap.md)}>
      {/* Regular Articles */}
      {displayArticles.map((article, index) => (
        <article
          key={article.id || index}
          className={cn(
            "group",
            "flex flex-col sm:flex-row sm:gap-4"
          )}
        >
          {/* Article Image */}
          {article.image ? (
            <Link
              href={`/${article.id}`}
              className="block flex-shrink-0 w-full sm:w-32 sm:h-32 sm:m-2 sm:rounded-lg overflow-hidden"
            >
              <figure className="relative w-full aspect-[4/3] sm:aspect-auto sm:h-full m-0">
                <Image
                  src={article.image}
                  alt={article.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 640px) 100vw, 128px"
                />
              </figure>
            </Link>
          ) : (
            <div className="flex-shrink-0 w-full aspect-[4/3] sm:w-32 sm:h-32 sm:m-2 sm:rounded-lg bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
              <span className="text-gray-400 dark:text-gray-500 text-xs">No Image</span>
            </div>
          )}

          {/* Article Content */}
          <div className="flex-1 flex flex-col min-w-0 p-3 sm:py-2 sm:pr-3 sm:pl-0">
            {/* Category Badge - always rendered for consistent spacing */}
            <div className="min-h-[24px] mb-2.5">
              {article.category && (
                <Badge className="tracking-wide border-none bg-gray-200/50 text-gray-600 dark:bg-gray-700/50 dark:text-gray-300">
                  {article.category}
                </Badge>
              )}
            </div>

            {/* Title */}
            <Heading
              level={3}
              variant="h6"
              className="font-display leading-tight line-clamp-2"
            >
              <Link
                href={`/${article.id}`}
                className={interactions.hover}
              >
                {article.title}
              </Link>
            </Heading>
          </div>
        </article>
      ))}

      {/* Author Articles Component */}
      <AuthorArticles authors={authors} />
    </div>
  );
}

