"use client";

import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { colors } from "@/lib/design-tokens";
import { Heading, Text, Caption } from "@/components/ui/typography";
import { Badge } from "@/components/ui/badge";

import { FreeContentBadgeIcon, PremiumContentBadgeIcon } from "@/components/icons/ScrolliIcons";

interface Article {
  id: string;
  title: string;
  excerpt?: string;
  image: string;
  category?: string;
  date?: string;
  sponsor?: string;
  author?: string;
  isPremium?: boolean;
}

interface ArticleCardProps {
  article: Article;
  variant?: "horizontal" | "vertical";
  layout?: "image-right" | "image-left";
  className?: string;
}

export default function ArticleCard({
  article,
  variant = "horizontal",
  layout = "image-right",
  className,
}: ArticleCardProps) {
  const isHorizontal = variant === "horizontal";
  const imageOnRight = layout === "image-right";
  const isPremium = article.isPremium;

  return (
    <article
      className={cn(
        "group w-full",
        isHorizontal && "flex flex-col md:flex-row gap-3 md:gap-6",
        "py-3 px-2 md:py-6 md:px-4",
        // Premium Styling - background only, no border
        isPremium
          ? "bg-amber-50/40 dark:bg-amber-950/20 rounded-xl transition-colors duration-300"
          : "rounded-xl transition-colors duration-300",
        className
      )}
    >
      {/* Text Content - Left Side for horizontal layout */}
      <div
        className={cn(
          "flex flex-col justify-center",
          isHorizontal && imageOnRight && "md:order-1 flex-1",
          isHorizontal && !imageOnRight && "md:order-2 flex-1",
          !isHorizontal && "order-2"
        )}
      >
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

        {/* Date */}
        {article.date && (
          <Caption
            as="time"
            dateTime={article.date}
            className="mb-2"
            color="muted"
          >
            {article.date}
          </Caption>
        )}

        {/* Title */}
        <Heading level={3} variant="h5" className="mb-3">
          <Link
            href={`/article/${article.id}`}
            prefetch={true}
            className="transition-colors hover:text-primary focus:outline-none"
          >
            {article.title}
          </Link>
        </Heading>

        {/* Excerpt */}
        {article.excerpt && (
          <div className="mb-2">
            <Text variant="body" color="secondary" className="line-clamp-2">
              {article.excerpt}
            </Text>
          </div>
        )}

        {/* Sponsor Tag */}
        {article.sponsor && (
          <div className="mt-2">
            <Caption
              as="span"
              className={cn("inline-block px-2 py-1 font-medium rounded", colors.success.bg)}
            >
              #{article.sponsor}
            </Caption>
          </div>
        )}
      </div>

      {/* Image - Right Side for horizontal layout */}
      <figure
        className={cn(
          "relative overflow-hidden rounded-lg",
          isHorizontal && imageOnRight && "md:order-2",
          isHorizontal && !imageOnRight && "md:order-1",
          !isHorizontal && "order-1",
          isHorizontal
            ? "w-full md:w-48 md:flex-shrink-0 aspect-[4/3] md:aspect-[4/3]"
            : "w-full aspect-video"
        )}
      >
        <Link
          href={`/article/${article.id}`}
          prefetch={true}
          className="block w-full h-full focus:outline-none rounded-lg"
          aria-label={`Read article: ${article.title}`}
        >
          <Image
            src={article.image}
            alt={article.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes={
              isHorizontal
                ? "(max-width: 768px) 100vw, 192px"
                : "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            }
          />
        </Link>

        {/* Content Badge (Free/Premium) */}
        <div className="absolute top-2 right-2 z-10 pointer-events-none">
          {isPremium ? (
            <PremiumContentBadgeIcon size={24} className="drop-shadow-md" />
          ) : (
            <FreeContentBadgeIcon size={24} className="drop-shadow-md" />
          )}
        </div>
      </figure>
    </article>
  );
}
