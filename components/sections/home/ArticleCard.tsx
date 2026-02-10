"use client";

import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { colors, interactions } from "@/lib/design-tokens";
import { Heading, Text, Caption } from "@/components/ui/typography";
import { Badge } from "@/components/ui/badge";

import { FreeContentBadgeIcon, PremiumContentBadgeIcon } from "@/components/icons/scrolli-icons";

interface Article {
  id: string;
  title: string;
  subtitle?: string;
  excerpt?: string;
  image?: string; // Optional - article may not have an image
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
        // Ensure proper width constraints
        "min-w-0",
        className
      )}
    >
      {/* Text Content - Left Side for horizontal layout */}
      <div
        className={cn(
          "flex flex-col justify-center",
          isHorizontal && imageOnRight && "md:order-1 flex-1 min-w-0 md:max-w-[600px]",
          isHorizontal && !imageOnRight && "md:order-2 flex-1 min-w-0 md:max-w-[600px]",
          !isHorizontal && "order-2"
        )}
      >
        {/* Category Badge */}
        {article.category && (
          <div className="mb-2 flex justify-start">
            <Badge className="tracking-wide">
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
        <Heading level={3} variant="h5" className="mb-2 break-words">
          <Link
            href={`/${article.id}`}
            prefetch={true}
            className={cn(interactions.hover, "focus:outline-none break-words")}
          >
            {article.title}
          </Link>
        </Heading>

        {/* Subtitle */}
        {article.subtitle && (
          <div className="mb-2 break-words">
            <Text variant="body" color="secondary" className="line-clamp-2 break-words">
              {article.subtitle}
            </Text>
          </div>
        )}

        {/* Excerpt */}
        {article.excerpt && !article.subtitle && (
          <div className="mb-2 break-words">
            <Text variant="body" color="secondary" className="line-clamp-2 break-words">
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
            ? "w-full md:w-48 md:min-w-[192px] md:max-w-[192px] md:flex-shrink-0 aspect-[4/3] md:aspect-[4/3]"
            : "w-full aspect-video"
        )}
      >
        <Link
          href={`/${article.id}`}
          prefetch={true}
          className="block w-full h-full focus:outline-none rounded-lg"
          aria-label={`Read article: ${article.title}`}
        >
          {article.image ? (
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
          ) : (
            <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
              <span className="text-gray-400 dark:text-gray-500 text-sm">No image</span>
            </div>
          )}
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
