'use client';
import { useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Heading } from "@/components/ui/typography";
import { Pagination } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import { Container } from '@/components/responsive';
import { colors } from "@/lib/design-tokens";
import { cn } from "@/lib/utils";

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
  const swiperRef = useRef<SwiperType | null>(null);
  const hasAnimatedRef = useRef(false);

  // Swipe demonstration animation - show users they can swipe
  // This will be triggered when Swiper is initialized via onInit callback
  const triggerAnimation = () => {
    if (hasAnimatedRef.current || !swiperRef.current) {
      return;
    }

    const timer = setTimeout(() => {
      if (swiperRef.current && swiperRef.current.initialized) {
        try {
          hasAnimatedRef.current = true;
          
          // Get current slides per view - safely access params
          const swiper = swiperRef.current;
          let slidesPerView = 1.2;
          let spaceBetween = 20;
          
          // Safely get slidesPerView and spaceBetween from params
          if (swiper.params) {
            if (typeof swiper.params.slidesPerView === 'number') {
              slidesPerView = swiper.params.slidesPerView;
            }
            if (typeof swiper.params.spaceBetween === 'number') {
              spaceBetween = swiper.params.spaceBetween;
            }
          }
          
          // Ensure swiper has width before calculating
          if (swiper.width > 0) {
            // Calculate partial move (30% of slide width)
            const slideWidth = swiper.width / slidesPerView;
            const partialMove = (slideWidth + spaceBetween) * 0.3;
            
            // Get current position
            const currentTranslate = swiper.getTranslate();
            const targetTranslate = currentTranslate - partialMove;
            
            // Smoothly move forward (half swipe demonstration)
            swiper.setTranslate(targetTranslate);
            
            // After 1.2 seconds, smoothly return to original position
            setTimeout(() => {
              if (swiperRef.current) {
                swiperRef.current.setTranslate(currentTranslate);
              }
            }, 1200);
          }
        } catch (error) {
          // Silently fail if Swiper isn't ready yet
          console.debug('Swiper animation skipped:', error);
        }
      }
    }, 1500);

    // Store timer for cleanup if component unmounts
    return () => {
      clearTimeout(timer);
    };
  };

  // Helper function to render Swiper content
  const renderSwiper = (articles: ArticleCard[], category: string) => (
    <div className="w-full overflow-x-hidden">
      <Swiper
        modules={[Pagination]}
        spaceBetween={20}
        slidesPerView={1.2}
        loop={false}
        speed={600}
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
        }}
        onInit={() => {
          // Trigger animation once Swiper is initialized
          triggerAnimation();
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
    <section className="mt-16 md:mt-24 lg:mt-32 py-8 md:py-12 lg:py-16 overflow-x-hidden">
      <Container size="full" className="overflow-x-hidden max-w-[95%] xl:max-w-[92%] 2xl:max-w-[90%]">
        <div className="overflow-x-hidden">
          {renderSwiper(articlesData, 'all')}
        </div>
      </Container>
    </section>
  );
}