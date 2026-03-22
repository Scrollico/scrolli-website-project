"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import Image from "next/image";
import { ArticleListSkeleton } from "@/components/ui/LoadingSkeletons";
import { ExpandingCards, CardItem } from "@/components/ui/expanding-cards";
import { Heading, Label } from "@/components/ui/typography";
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
                  Hikayeler
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

      {articles.length > 0 && (
        <section className={cn(sectionPadding.md, marginBottom.lg, colors.background.base, "relative overflow-hidden")}>
          {/* Background gradient accent */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl -z-10" />

          <div className="w-full px-4 sm:px-6 lg:px-8 mx-auto max-w-7xl relative z-10">
            <div className="mb-6">
              <Heading
                level={2}
                variant="h3"
                className={cn("font-bold text-lg md:text-xl", colors.foreground.primary)}
              >
                Daha Fazla Gündem
              </Heading>
              <div className={cn("h-0.5 w-16 bg-[#8080FF] mt-2")} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map((article) => (
                <div key={article.id} className="flex gap-4">
                  <Link href={`/${article.id}`} className="block relative w-24 h-24 flex-shrink-0 animate-in fade-in zoom-in duration-300">
                    <Image
                      src={article.image || FALLBACK_IMAGE}
                      alt={article.title}
                      fill
                      className="object-cover rounded-lg"
                      sizes="96px"
                    />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <Link href={`/${article.id}`} className="block group">
                      <Heading
                        level={3}
                        variant="h6"
                        className={cn("line-clamp-2 leading-tight transition-colors group-hover:text-[#8080FF]", colors.foreground.primary)}
                      >
                        {article.title}
                      </Heading>
                    </Link>
                    <div className="mt-1 flex items-center gap-2">
                      <Label as="span" color="muted">
                        {getAuthorName(article.author)}
                      </Label>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <VideoSection videos={videos} />
      <NewsletterPopup />
    </>
  );
}
