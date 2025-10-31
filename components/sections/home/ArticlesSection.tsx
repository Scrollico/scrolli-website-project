'use client';
import Link from 'next/link';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay, A11y } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';

interface ArticleCard {
  id: string;
  title: string;
  caption: string;
  thumbnail: string;
}

const articleData: ArticleCard[] = [
  {
    id: 'home-internet-luxury',
    title: 'Home Internet Is Becoming a Luxury for the Wealthy',
    caption: 'Dave Gershgorn in OneZero • Jun 14 • 3 min read',
    thumbnail: '/assets/images/thumb/thumb-1240x700.jpg'
  },
  {
    id: 'doorbell-camera-shooting',
    title: 'The Night My Doorbell Camera Captured a Shooting',
    caption: 'Alentica in Police • Jun 16 • 7 min read',
    thumbnail: '/assets/images/thumb/thumb-700x512.jpg'
  },
  {
    id: 'privacy-tech-debate',
    title: 'Privacy Is Just the Beginning of the Debate Over Tech',
    caption: 'Otimus in Startup • May 15 • 6 min read',
    thumbnail: '/assets/images/thumb/thumb-700x512-2.jpg'
  },
  {
    id: 'millionaire-mindset',
    title: 'Want To Make Millions? Then Act Like a Millionaire',
    caption: 'Mark Harris in Heated • May 13 • 12 min read',
    thumbnail: '/assets/images/thumb/thumb-700x512-3.jpg'
  },
  {
    id: 'career-change-advice',
    title: 'What I Wish I\'d Known When I Made a Drastic Career Change',
    caption: 'Steven Job in The Startup • 2 days ago • 8 min read',
    thumbnail: '/assets/images/thumb/thumb-1400x778.jpg'
  }
];

export default function ArticlesSection() {
  return (
    <section className="py-12 md:py-16 lg:py-20 w-full">
      {/* Section Header - Full Width */}
      <div className="w-full px-4 md:px-8 lg:px-12 mb-10 md:mb-12">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold tracking-tight text-foreground mb-4">Latest Articles</h2>
          <div className="w-12 h-0.5 bg-primary"></div>
        </div>
      </div>

      {/* Articles Swiper - Full Width */}
      <div className="w-full px-4 md:px-8 lg:px-12">
        <Swiper
          modules={[Pagination, Autoplay, A11y]}
          spaceBetween={20}
          slidesPerView={1}
          pagination={{
            el: '.swiper-pagination',
            clickable: true,
            bulletClass: 'swiper-pagination-bullet !bg-muted-foreground/30 !opacity-100',
            bulletActiveClass: '!bg-primary',
          }}
          autoplay={{
            delay: 6000,
            disableOnInteraction: false,
          }}
          breakpoints={{
            640: {
              slidesPerView: 2,
              spaceBetween: 24,
            },
            768: {
              slidesPerView: 3,
              spaceBetween: 28,
            },
            1024: {
              slidesPerView: 4,
              spaceBetween: 32,
            },
          }}
          className="pb-12"
        >
          {articleData.map((article) => (
              <SwiperSlide key={article.id}>
                <article className="group bg-card rounded-lg overflow-hidden border border-border/50 hover:border-border transition-all duration-200 h-full">
                  {/* Article Image */}
                  <figure className="relative overflow-hidden bg-muted">
                    <Link href={`/article/${article.id}`}>
                      <Image
                        src={article.thumbnail}
                        alt={article.title}
                        width={400}
                        height={250}
                        className="w-full h-56 md:h-64 lg:h-72 object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                        quality={95}
                      />
                    </Link>
                  </figure>

                  {/* Article Content */}
                  <div className="p-5 md:p-6">
                    <h3 className="text-lg md:text-xl font-semibold mb-2 leading-tight line-clamp-2 text-foreground">
                      <Link
                        href={`/article/${article.id}`}
                        className="hover:text-primary transition-colors duration-200 focus:outline-none focus:text-primary"
                      >
                        {article.title}
                      </Link>
                    </h3>
                  </div>
                </article>
              </SwiperSlide>
          ))}
        </Swiper>

        {/* Pagination */}
        <div className="swiper-pagination mt-6 flex justify-center"></div>
      </div>
    </section>
  );
}