"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { ArticleListSkeleton } from "@/components/ui/LoadingSkeletons";
import { ExpandingCards, CardItem } from "@/components/ui/expanding-cards";
import { Heading } from "@/components/ui/typography";
import { Article } from "@/types/content";
import { getAuthorName } from "@/lib/author-loader";
import { colors, sectionPadding, containerPadding, marginBottom } from "@/lib/design-tokens";
import { cn } from "@/lib/utils";

const FALLBACK_IMAGE = "/assets/images/thumb/thumb-1240x700.jpg";
const HIKAYELER_CARD_LIMIT = 7;

function mapArticlesToCardItems(articles: Article[]): CardItem[] {
  return articles.slice(0, HIKAYELER_CARD_LIMIT).map((article) => {
    const imgSrc = article.image || FALLBACK_IMAGE;

    return {
      id: article.id,
      title: article.title,
      description:
        article.excerpt?.replace(/<[^>]*>/g, "").trim() ||
        `${getAuthorName(article.author)} • ${article.date}`,
      imgSrc,
      linkHref: `/${article.id}`,
    };
  });
}

// Lazy load below-fold sections with no SSR for faster initial load
// ArticlesSection removed as it is no longer used

const VideoSection = dynamic(
  () => import("@/components/sections/home/VideoSection").catch((err) => {
    console.error("VideoSection load failed", err);
    return () => null;
  }),
  {
    loading: () => <ArticleListSkeleton count={3} />,
    ssr: false,
  }
);

const NewsletterPopup = dynamic(
  () => import("@/components/sections/home/NewsletterPopup").catch((err) => {
    console.error("NewsletterPopup load failed", err);
    return () => null;
  }),
  { ssr: false }
);

interface VideoData {
  id: string;
  title: string;
  videoUrl: string;
  overlayText?: {
    location?: string;
    date?: string;
    quote?: string;
    source?: string;
    author?: string;
    role?: string;
  };
}

interface LazySectionsProps {
  articles: Article[];
  hikayeler: Article[];
  videos?: VideoData[];
}

export default function LazySections({ articles, hikayeler, videos }: LazySectionsProps) {
  const hikayelerCardItems = mapArticlesToCardItems(hikayeler);

  return (
    <>
      {hikayeler.length > 0 && (
        <section
          className={cn(
            sectionPadding.md,
            marginBottom.lg,
            "overflow-x-hidden",
            colors.background.base,
            "mb-8"
          )}
        >
          <div className={cn("w-full mx-auto max-w-7xl", containerPadding.md)}>
            <div className="mb-6">
              <Link
                href="/archive"
                className="inline-flex items-center gap-2 group"
              >
                <Heading
                  level={2}
                  variant="h3"
                  className={cn(
                    "font-bold text-lg md:text-xl mb-2",
                    colors.foreground.primary,
                    "group-hover:text-[#8080FF] transition-colors"
                  )}
                >
                  Hikâyeler
                  <span className="ml-1">{" >"}</span>
                </Heading>
              </Link>
              <div className={cn("h-0.5 w-16 bg-[#8080FF]")} />
            </div>
            <div className="flex w-full justify-center">
              <ExpandingCards items={hikayelerCardItems} defaultActiveIndex={0} />
            </div>
          </div>
        </section>
      )}

      <VideoSection videos={videos} />
      <NewsletterPopup />
    </>
  );
}
