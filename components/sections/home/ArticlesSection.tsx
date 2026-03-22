'use client';
import Link from 'next/link';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Heading } from "@/components/ui/typography";
import { Pagination, Navigation } from 'swiper/modules';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { colors, sectionPadding, containerPadding, marginBottom, borderRadius, elevation, elevationHover, componentPadding, interactions, transition } from "@/lib/design-tokens";
import { cn } from "@/lib/utils";
import { getAuthorName } from '@/lib/author-loader';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

import { Article } from "@/types/content";

interface ArticleCard {
  id: string;
  title: string;
  caption: string;
  thumbnail: string;
}

interface ArticlesSectionProps {
  articles: Article[];
  title?: string;
  className?: string;
}

export default function ArticlesSection({ articles, title = "Daha Fazla Hikaye", className }: ArticlesSectionProps) {
  // Convert to ArticleCard format
  const articlesData: ArticleCard[] = articles.slice(0, 10).map((article) => ({
    id: article.id,
    title: article.title,
    caption: `${getAuthorName(article.author)} in ${article.category} • ${article.date} • ${article.readTime}`,
    thumbnail: article.image || '/assets/images/thumb/thumb-1240x700.jpg'
  }));

  // Helper function to render Swiper content
  const renderSwiper = (articles: ArticleCard[], category: string) => (
    <div className="w-full overflow-x-hidden relative">
      <Swiper
        modules={[Pagination, Navigation]}
        spaceBetween={20}
        slidesPerView={1.2}
        loop={false}
        speed={600}
        pagination={{
          clickable: true,
          el: `.articles-pagination-${category}`,
        }}
        navigation={{
          nextEl: `.articles-next-${category}`,
          prevEl: `.articles-prev-${category}`,
        }}
        breakpoints={{
          480: {
            slidesPerView: 2,
            spaceBetween: 20,
          },
          640: {
            slidesPerView: 2.5,
            spaceBetween: 24,
          },
          768: {
            slidesPerView: 3,
            spaceBetween: 24,
          },
          1024: {
            slidesPerView: 4,
            spaceBetween: 32,
          },
          1280: {
            slidesPerView: 4.5,
            spaceBetween: 32,
          },
          1536: {
            slidesPerView: 5,
            spaceBetween: 40,
          },
        }}
        className="articles-swiper pb-12"
      >
        {articles.map((article) => (
          <SwiperSlide key={article.id} className="article-slide-wrapper">
            <article
              className={cn(
                "group rounded-lg overflow-hidden transition-all duration-300 ease-in-out flex flex-col relative h-full",
                colors.background.elevated,
                "border border-transparent dark:border-gray-800/5",
                "hover:shadow-lg hover:scale-[1.02]",
                elevation[1],
                elevationHover[2]
              )}
            >
              <figure
                className={cn(
                  "relative flex-shrink-0 w-full aspect-[4/5] overflow-hidden",
                  colors.surface.elevated
                )}
              >
                <Link href={`/${article.id}`} className="absolute inset-0 block w-full h-full">
                  <Image
                    src={article.thumbnail}
                    alt={article.title}
                    fill
                    className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 280px, (max-width: 1024px) 350px, 400px"
                  />
                </Link>
              </figure>

              {/* Title underneath the image */}
              <div className={cn(
                "article-title-container flex-shrink-0 relative z-10",
                componentPadding.md,
                colors.background.elevated,
                "flex-1 flex flex-col justify-center"
              )}>
                <Heading level={3} variant="h6" className="leading-tight line-clamp-2">
                  <Link
                    href={`/${article.id}`}
                    className={cn(
                      colors.foreground.primary,
                      interactions.hover
                    )}
                  >
                    {article.title}
                  </Link>
                </Heading>
              </div>
            </article>
          </SwiperSlide>
        ))}
      </Swiper>
      <div className={`articles-pagination-${category} flex justify-center mt-4`}></div>
    </div>
  );

  return (
    <section className={cn(sectionPadding.md, marginBottom.lg, "overflow-x-hidden", colors.background.base, className)}>
      <div className={cn("w-full mx-auto max-w-7xl", containerPadding.md)}>
        {/* Section Header */}
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
              {title}
              <span className="ml-1">{" >"}</span>
            </Heading>
          </Link>
          <div className={cn("h-0.5 w-16 bg-[#8080FF]")} />
        </div>

        {/* Swiper Container */}
        <div className="relative">
          <div className="overflow-x-hidden">
            {renderSwiper(articlesData, 'all')}
          </div>

          {/* Navigation Buttons */}
          <button
            className={cn(
              "articles-prev-all absolute top-1/2 -translate-y-1/2 z-20",
              "-left-4",
              "h-8 w-8 flex items-center justify-center",
              borderRadius.full,
              colors.background.elevated,
              colors.border.DEFAULT,
              "border",
              colors.background.elevated,
              interactions.hover,
              transition.normal,
              elevation[1],
              "disabled:opacity-30 disabled:cursor-not-allowed",
              "ml-0"
            )}
            aria-label="Previous slide"
          >
            <ChevronLeft className={cn("h-4 w-4", colors.foreground.secondary)} />
          </button>

          <button
            className={cn(
              "articles-next-all absolute top-1/2 -translate-y-1/2 z-20",
              "-right-4",
              "h-8 w-8 flex items-center justify-center",
              borderRadius.full,
              colors.background.elevated,
              colors.border.DEFAULT,
              "border",
              colors.background.elevated,
              interactions.hover,
              transition.normal,
              elevation[1],
              "disabled:opacity-30 disabled:cursor-not-allowed",
              "mr-2"
            )}
            aria-label="Next slide"
          >
            <ChevronRight className={cn("h-4 w-4", colors.foreground.secondary)} />
          </button>
        </div>
      </div>
    </section>
  );
}