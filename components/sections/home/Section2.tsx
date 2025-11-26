"use client";
import Link from "next/link";
import Image from "next/image";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import { gridVariants, spacingVariants } from '@/lib/utils';
import { Heading, Text, Caption } from "@/components/ui/typography";
import { Badge } from "@/components/ui/badge";
import blogData from "@/data/blog.json";

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

export default function Section2() {
  const { featuredSlider } = blogData;

  return (
    <>
      <div className="content-widget relative pb-8 md:pb-10 lg:pb-12">
        <div className="absolute inset-0 pointer-events-none readers-vote-gradient" />
        <div className="container relative z-10">
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
                  <div className={gridVariants.heroGrid + " min-h-[350px] md:min-h-[500px] items-center"}>
                    <div className="order-2 md:order-1">
                      <div className={spacingVariants.card}>
                        <Caption
                          as="div"
                          className="mb-3 uppercase tracking-wide"
                          color="secondary"
                        >
                          {featuredSlider.title}
                        </Caption>
                        {/* Category Badge */}
                        {article.category && (
                          <div className="mb-3 flex justify-start">
                            <Badge
                              variant="secondary"
                              appearance="outline"
                              size="sm"
                              className="uppercase tracking-wide"
                            >
                              {article.category}
                            </Badge>
                          </div>
                        )}
                        <Heading
                          level={2}
                          variant="h2"
                          className="mb-4 leading-tight"
                        >
                          <Link href={`/article/${article.id}`} className="hover:text-primary transition-colors">
                            {article.title}
                          </Link>
                        </Heading>
                        {article.excerpt && (
                          <Text variant="body" color="secondary" className="line-clamp-3">
                            {article.excerpt}
                          </Text>
                        )}
                      </div>
                    </div>
                    <div className="order-1 md:order-2 relative rounded-lg overflow-hidden min-h-[250px]">
                      {article.image && (
                        <Image
                          src={article.image}
                          alt={article.title}
                          fill
                          className="object-cover object-center"
                          sizes="(max-width: 768px) 100vw, 50vw"
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent md:from-black/50 md:via-black/15 lg:from-black/40 lg:via-black/10 opacity-50"></div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
      {/*content-widget*/}
    </>
  );
}
