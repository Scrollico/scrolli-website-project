"use client";

import Link from "next/link";
import Image from "next/image";
import blogData from "@/data/blog.json";
import { Heading, Text } from "@/components/ui/typography";
import { Badge } from "@/components/ui/badge";
import { colors, gap } from "@/lib/design-tokens";
import { cn } from "@/lib/utils";
import AuthorArticles from "./AuthorArticles";

export default function ArticleList() {
  // Use mostRecent articles - show 3 regular articles, then AuthorArticles component
  const articles = blogData.mostRecent?.mainArticles?.slice(0, 3) || 
                   blogData.todayHighlights?.articles?.slice(0, 3) || 
                   [];

  if (articles.length === 0) {
    return null;
  }

  return (
    <div className={cn("flex flex-col min-w-0 w-full", gap.md)}>
      {/* Regular Articles */}
      {articles.map((article, index) => (
        <article
          key={article.id || index}
          className={cn(
            "group flex flex-col sm:flex-row gap-4 pb-4",
            "border-b",
            colors.border.light
          )}
        >
          {/* Article Image */}
          {article.image && (
            <Link
              href={`/article/${article.id}`}
              className="block flex-shrink-0 w-full sm:w-32 h-32 rounded-lg overflow-hidden"
            >
              <figure className="relative w-full h-full m-0">
                <Image
                  src={article.image}
                  alt={article.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 640px) 100vw, 128px"
                />
              </figure>
            </Link>
          )}

          {/* Article Content */}
          <div className="flex-1 flex flex-col min-w-0">
            {/* Category Badge */}
            {article.category && (
              <div className="mb-2">
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

            {/* Title */}
            <Heading
              level={3}
              variant="h6"
              className="mb-2 leading-tight line-clamp-2"
            >
              <Link
                href={`/article/${article.id}`}
                className="hover:text-primary transition-colors"
              >
                {article.title}
              </Link>
            </Heading>

            {/* Optional: Excerpt or Date */}
            {article.excerpt && (
              <Text
                variant="bodySmall"
                className={cn(colors.foreground.secondary, "line-clamp-2 text-sm")}
              >
                {article.excerpt}
              </Text>
            )}
          </div>
        </article>
      ))}

      {/* Author Articles Component */}
      <div className={cn("border-b", colors.border.light)}>
        <AuthorArticles />
      </div>
    </div>
  );
}

