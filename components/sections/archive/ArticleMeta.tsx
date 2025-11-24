"use client";
import { cn } from "@/lib/utils";
import { Text } from "@/components/ui/typography";
import { colors, gap } from "@/lib/design-tokens";
import Link from "next/link";
import { Star } from "lucide-react";

interface ArticleMetaProps {
  author: string;
  category: string;
  date: string;
  readTime: string;
  className?: string;
}

/**
 * ArticleMeta Component
 * 
 * Displays article metadata (author, category, date, read time).
 * Uses responsive layout and design tokens.
 * 
 * @param {ArticleMetaProps} props - The component props
 * @returns {JSX.Element} The rendered metadata component
 */
export default function ArticleMeta({ author, category, date, readTime, className }: ArticleMetaProps) {
  return (
    <div className={cn("flex flex-wrap items-center text-sm", gap.xs, colors.foreground.secondary, className)}>
      <div className="flex items-center gap-1">
        <Link href="/author" className={cn(colors.foreground.interactive, "font-medium hover:underline")}>
          {author}
        </Link> 
        <span>in</span> 
        <Link href="/archive" className={cn(colors.foreground.interactive, "font-medium hover:underline")}>
          {category}
        </Link>
      </div>
      
      <span className="hidden sm:inline-block text-gray-300 dark:text-gray-600 mx-1">•</span>
      <div className="w-full sm:w-auto h-0 sm:h-auto basis-full sm:basis-auto sm:hidden"></div>
      
      <div className={cn("flex items-center", gap.xs)}>
         <Text variant="bodySmall" color="muted" as="span">{date}</Text>
         <span className="text-gray-300 dark:text-gray-600">•</span>
         <Text variant="bodySmall" color="muted" as="span" className="flex items-center gap-1">
             {readTime}
         </Text>
         <div className="flex items-center ml-1 text-yellow-500">
             <Star size={12} className="fill-current" />
         </div>
      </div>
    </div>
  );
}
