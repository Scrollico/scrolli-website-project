"use client";
import Link from "next/link";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import { gridVariants, textVariants, spacingVariants } from '@/lib/utils';
import blogData from "@/data/blog.json";

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

export default function Section2() {
  const { featuredSlider } = blogData;

  return (
    <>
      <div className="content-widget">
        <div className="container">
          <Swiper
            modules={[Autoplay, Pagination, Navigation]}
            spaceBetween={20}
            slidesPerView={1}
            breakpoints={{
              640: {
                slidesPerView: 1,
                spaceBetween: 20,
              },
              768: {
                slidesPerView: 1,
                spaceBetween: 30,
              },
              1024: {
                slidesPerView: 1,
                spaceBetween: 40,
              },
            }}
            loop={true}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
            }}
            pagination={{
              clickable: true,
            }}
            navigation={false}
            className="blog-slider"
          >
            {featuredSlider.articles.map((article, index) => (
              <SwiperSlide key={index}>
                <div className="blog-slider-card">
                  <div className={gridVariants.heroGrid + " min-h-[400px] md:min-h-[500px] items-center"}>
                    <div className="order-2 md:order-1">
                      <div className={spacingVariants.card}>
                        <div className={textVariants.caption + " mb-3 uppercase tracking-wide"}>
                          {featuredSlider.title}
                        </div>
                        <h2 className={textVariants.heading2 + " mb-4 leading-tight"}>
                          <Link href={`/article/${article.id}`} className="hover:text-primary transition-colors">
                            {article.title}
                          </Link>
                        </h2>
                        <div className={textVariants.body + " text-muted-foreground"}>
                          <p className="line-clamp-3">{article.excerpt}</p>
                        </div>
                      </div>
                    </div>
                    <div
                      className="order-1 md:order-2 bg-cover bg-center bg-no-repeat rounded-lg relative"
                      style={{
                        backgroundImage: `url(${article.image})`,
                        minHeight: '250px',
                      }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent md:from-black/50 md:via-black/15 lg:from-black/40 lg:via-black/10 opacity-50"></div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
          <div className="divider" />
        </div>
      </div>
      {/*content-widget*/}
    </>
  );
}
