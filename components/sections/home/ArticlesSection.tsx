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
    <section className="py-16 md:py-20 lg:py-24 w-full">
      {/* Section Header - Full Width */}
      <div className="w-full px-4 md:px-8 lg:px-12 mb-12 md:mb-16">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">Latest Articles</h2>
          <hr className="border-t-2 border-primary w-24" />
        </div>
      </div>

      {/* Articles Swiper - Full Width */}
      <div className="w-full px-4 md:px-8 lg:px-12">
        <Swiper
          modules={[Pagination, Autoplay, A11y]}
          spaceBetween={24}
          slidesPerView={1}
          pagination={{
            el: '.swiper-pagination',
            clickable: true,
          }}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}
          breakpoints={{
            640: {
              slidesPerView: 2,
              spaceBetween: 32,
            },
            768: {
              slidesPerView: 3,
              spaceBetween: 40,
            },
            1024: {
              slidesPerView: 4,
              spaceBetween: 48,
            },
          }}
          className="pb-16"
        >
          {articleData.map((article) => (
            <SwiperSlide key={article.id}>
              <article className="group bg-card rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 h-full transform hover:-translate-y-2">
                {/* Article Image */}
                <figure className="relative overflow-hidden">
                  <Link href={`/article/${article.id}`}>
                    <Image
                      src={article.thumbnail}
                      alt={article.title}
                      width={400}
                      height={250}
                      className="w-full h-56 md:h-64 lg:h-72 object-cover group-hover:scale-110 transition-transform duration-500"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                      quality={95}
                    />
                  </Link>
                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </figure>

                {/* Article Content */}
                <div className="p-6">
                  <h3 className="text-lg md:text-xl lg:text-2xl font-bold mb-3 leading-tight line-clamp-2 group-hover:text-primary transition-colors duration-200">
                    <Link
                      href={`/article/${article.id}`}
                      className="text-foreground hover:text-primary transition-colors"
                    >
                      {article.title}
                    </Link>
                  </h3>

                  <div className="text-sm md:text-base text-muted-foreground leading-relaxed">
                    <span>{article.caption}</span>
                  </div>
                </div>
              </article>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Pagination */}
        <div className="swiper-pagination mt-8 flex justify-center"></div>
      </div>
    </section>
  );
}