'use client';
import Link from 'next/link';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';

interface ArticleCard {
  id: string;
  title: string;
  caption: string;
  thumbnail: string;
}

const articlesData: ArticleCard[] = [
  {
    id: 'home-internet-is-becoming-a-luxury-for-the-wealthy-1',
    title: 'Home Internet Is Becoming a Luxury for the Wealthy',
    caption: 'Dave Gershgorn in OneZero • Jun 14 • 3 min read',
    thumbnail: '/assets/images/thumb/thumb-1240x700.jpg'
  },
  {
    id: 'the-night-my-doorbell-camera-captured-a-shooting',
    title: 'The Night My Doorbell Camera Captured a Shooting',
    caption: 'Alentica in Police • Jun 16 • 7 min read',
    thumbnail: '/assets/images/thumb/thumb-700x512.jpg'
  },
  {
    id: 'privacy-is-just-the-beginning-of-the-debate-over-tech',
    title: 'Privacy Is Just the Beginning of the Debate Over Tech',
    caption: 'Otimus in Startup • May 15 • 6 min read',
    thumbnail: '/assets/images/thumb/thumb-700x512-2.jpg'
  },
  {
    id: 'want-to-make-millions-then-act-like-a-millionaire',
    title: 'Want To Make Millions? Then Act Like a Millionaire',
    caption: 'Mark Harris in Heated • May 13 • 12 min read',
    thumbnail: '/assets/images/thumb/thumb-700x512-3.jpg'
  },
  {
    id: 'what-i-wish-id-known-when-i-made-a-drastic-career-change',
    title: 'What I Wish I\'d Known When I Made a Drastic Career Change',
    caption: 'Steven Job in The Startup • 2 days ago • 8 min read',
    thumbnail: '/assets/images/thumb/thumb-1400x778.jpg'
  }
];

export default function ArticlesSection() {
  // Helper function to render Swiper content
  const renderSwiper = (articles: ArticleCard[], category: string) => (
    <div className="w-full">
      <Swiper
        modules={[Autoplay, Pagination]}
        spaceBetween={20}
        slidesPerView={1.2}
        loop={false}
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
        }}
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
            <article className="group bg-card rounded-lg border border-border/50 hover:border-border transition-all duration-200 flex flex-col relative">
              <figure className="relative bg-muted flex-shrink-0 w-full aspect-[3/4] overflow-hidden rounded-t-lg">
                <Link href={`/article/${article.id}`} className="absolute inset-0 block w-full h-full">
                  <Image
                    src={article.thumbnail}
                    alt={article.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 640px) 280px, (max-width: 1024px) 350px, 400px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-60 pointer-events-none" />
                </Link>
              </figure>

              {/* Title underneath the image */}
              <div className="article-title-container py-4 pr-4 md:py-5 md:pr-5 bg-white dark:bg-card rounded-b-lg flex-shrink-0 min-h-[60px]">
                <h3 className="text-sm md:text-base lg:text-lg font-semibold leading-tight line-clamp-2">
                  <Link href={`/article/${article.id}`} className="hover:text-primary transition-colors text-black dark:text-white">
                    {article.title}
                  </Link>
                </h3>
              </div>
            </article>
          </SwiperSlide>
        ))}
      </Swiper>
      <div className={`articles-pagination-${category} flex justify-center mt-4`}></div>
    </div>
  );

  return (
    <section className="mt-16 md:mt-24 lg:mt-32 py-8 md:py-12 lg:py-16">
      <div className="px-4 sm:px-6 lg:px-8 xl:px-12 mb-8 md:mb-12">
        <div className="max-w-7xl mx-auto">
          {renderSwiper(articlesData, 'all')}
        </div>
      </div>
    </section>
  );
}