"use client";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Heading, Text } from "@/components/ui/typography";
import {
   colors,
   borderRadius,
   componentPadding,
   gap,
   transition,
   surface,
   elevationHover
} from "@/lib/design-tokens";
import ArticleMeta from "./ArticleMeta";

import { FreeContentBadgeIcon, PremiumContentBadgeIcon } from "@/components/icons/ScrolliIcons";

interface ArticleCardProps {
   id: string;
   title: string;
   excerpt: string;
   image: string;
   author: string;
   category: string;
   date: string;
   readTime: string;
   isPremium?: boolean;
}

/**
 * ArticleCard Component
 * 
 * A reusable card component for displaying article summaries.
 * Implements design tokens for spacing, colors, elevation, and typography.
 * 
 * @param {ArticleCardProps} props - The component props
 * @returns {JSX.Element} The rendered article card
 */
export default function ArticleCard({ id, title, excerpt, image, author, category, date, readTime, isPremium }: ArticleCardProps) {
   return (
      <article className={cn(
         "flex flex-col h-full overflow-hidden group",
         surface.raised,
         componentPadding.md,
         transition.normal,
         elevationHover[2],
         // Premium Styling - background only, no border
         isPremium
            ? "bg-amber-50/40 dark:bg-amber-950/20"
            : "border border-transparent hover:border-gray-200 dark:hover:border-gray-700"
      )}>
         <Link href={`/article/${id}`} className={cn("relative block w-full aspect-[16/9] mb-4 overflow-hidden", borderRadius.md)}>
            <Image
               src={image}
               alt={title}
               fill
               className="object-cover transition-transform duration-500 group-hover:scale-105"
               sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            {/* Content Badge (Free/Premium) */}
            <div className="absolute top-2 right-2 z-10 pointer-events-none">
               {isPremium ? (
                  <PremiumContentBadgeIcon size={24} className="drop-shadow-md" />
               ) : (
                  <FreeContentBadgeIcon size={24} className="drop-shadow-md" />
               )}
            </div>
         </Link>

         <div className={cn("flex flex-col flex-grow", gap.xs)}>
            <Heading level={3} variant="h5" className="line-clamp-2 mb-2">
               <Link href={`/article/${id}`} className={cn(colors.foreground.interactive, "hover:underline")}>
                  {title}
               </Link>
            </Heading>

            <Text variant="body" color="secondary" className="line-clamp-3 mb-4 flex-grow">
               {excerpt}
            </Text>

            <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-700">
               <ArticleMeta
                  author={author}
                  category={category}
                  date={date}
                  readTime={readTime}
               />
            </div>
         </div>
      </article>
   );
}
