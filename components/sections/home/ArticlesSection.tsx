'use client';
import Link from 'next/link';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Heading } from "@/components/ui/typography";
import { Pagination } from 'swiper/modules';
import { Container } from '@/components/responsive';
import { colors } from "@/lib/design-tokens";
import { cn } from "@/lib/utils";
import { getAuthorName } from '@/lib/author-loader';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';

import blogData from "@/data/blog.json";

interface ArticleCard {
  id: string;
  title: string;
  caption: string;
  thumbnail: string;
}

export default function ArticlesSection() {
  // Get articles from featuredSlider or mostRecent
  const articles = blogData.featuredSlider?.articles || blogData.mostRecent?.mainArticles || [];

  // Convert to ArticleCard format
  const articlesData: ArticleCard[] = articles.slice(0, 5).map((article) => ({
    id: article.id,
    title: article.title,
    caption: `${getAuthorName(article.author)} in ${article.category} • ${article.date} • ${article.readTime}`,
    thumbnail: article.image || '/assets/images/thumb/thumb-1240x700.jpg'
  }));

  // Helper function to render Swiper content
  const renderSwiper = (articles: ArticleCard[], category: string) => (
    <div className="w-full overflow-x-hidden">
      <Swiper
        modules={[Pagination]}
        spaceBetween={20}
        slidesPerView={1.2}
        loop={false}
        speed={600}
        pagination={{
          clickable: true,
          el: `.articles-pagination-${category}`,
        }}
        navigation={false}
        breakpoints={{
          480: {
            slidesPerView: 1.5,
            spaceBetween: 20,
          },
          640: {
            slidesPerView: 2,
            spaceBetween: 24,
          },
          768: {
            slidesPerView: 2.5,
            spaceBetween: 24,
          },
          1024: {
            slidesPerView: 3,
            spaceBetween: 32,
          },
          1280: {
            slidesPerView: 3.5,
            spaceBetween: 40,
          },
        }}
        className="articles-swiper pb-12"
      >
        {articles.map((article) => (
          <SwiperSlide key={article.id} className="article-slide-wrapper">
            <article
              className={cn(
                "group rounded-lg border hover:shadow-sm transition-all duration-300 ease-in-out flex flex-col relative",
                colors.background.elevated,
                colors.border.DEFAULT,
                colors.border.hover
              )}
            >
              <figure
                className={cn(
                  "relative flex-shrink-0 w-full aspect-[3/4] overflow-hidden rounded-t-lg",
                  colors.surface.elevated
                )}
              >
                <Link href={`/article/${article.id}`} className="absolute inset-0 block w-full h-full">
                  <Image
                    src={article.thumbnail}
                    alt={article.title}
                    fill
                    className="object-cover object-center"
                    sizes="(max-width: 640px) 280px, (max-width: 1024px) 350px, 400px"
                  />
                </Link>
              </figure>

              {/* Title underneath the image */}
              <div className={cn("article-title-container p-4 md:p-5 rounded-b-lg flex-shrink-0 relative z-10", colors.background.elevated, "dark:!bg-gray-800 dark:!text-white")}>
                <Heading level={3} variant="h6" className="leading-tight line-clamp-2">
                  <Link href={`/article/${article.id}`} className="hover:text-primary transition-colors">
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
    <section className="mt-12 md:mt-24 lg:mt-32 py-8 md:py-12 lg:py-16 overflow-x-hidden">
      <Container size="full" className="overflow-x-hidden max-w-[95%] xl:max-w-[92%] 2xl:max-w-[90%]">
        <div className="overflow-x-hidden">
          {renderSwiper(articlesData, 'all')}
        </div>
      </Container>
    </section>
  );
}