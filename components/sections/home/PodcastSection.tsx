"use client";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import Image from 'next/image';
import Link from 'next/link';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

interface Podcast {
  id: string;
  title: string;
  hostName: string;
  hostProfession: string;
  image: string;
  spotifyUrl: string;
}

const podcasts: Podcast[] = [
  {
    id: '1',
    title: 'Modern Dünyada Hayatta Kalma Rehberi',
    hostName: 'Ayhan Asar',
    hostProfession: 'Uzman Psikolog',
    image: '/assets/images/thumb/thumb-700x512.jpg',
    spotifyUrl: '#',
  },
  {
    id: '2',
    title: 'The Orient Brief',
    hostName: 'Ahmetcan Uzlaşık',
    hostProfession: 'Gazeteci',
    image: '/assets/images/thumb/thumb-700x512-2.jpg',
    spotifyUrl: '#',
  },
  {
    id: '3',
    title: 'Teknoloji ve Gelecek',
    hostName: 'Seran Demiral',
    hostProfession: 'Teknoloji Yazarı',
    image: '/assets/images/thumb/thumb-700x512-3.jpg',
    spotifyUrl: '#',
  },
];

export default function PodcastSection() {
  return (
    <div className="content-widget mt-12">
      <div className="container">
        {/* Header */}
        <div className="mb-8">
          <p className="text-sm md:text-base text-blue-600 dark:text-blue-400 mb-2 font-medium">
            Özgün multimedya konseptleri
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-black dark:text-white mb-4">
            Podcast
          </h2>
          <p className="text-base md:text-lg text-gray-700 dark:text-gray-300 max-w-2xl">
            Sesli içerik platformlarında yer alan podcast serilerimizi keşfedin
          </p>
        </div>

        {/* Podcast Carousel */}
        <div className="relative">
          <Swiper
            modules={[Navigation, Pagination]}
            spaceBetween={24}
            slidesPerView={1.2}
            loop={false}
            pagination={{
              clickable: true,
              el: '.podcast-pagination',
            }}
            navigation={{
              nextEl: '.podcast-nav-next',
              prevEl: '.podcast-nav-prev',
            }}
            breakpoints={{
              640: {
                slidesPerView: 1.5,
                spaceBetween: 24,
              },
              768: {
                slidesPerView: 2,
                spaceBetween: 24,
              },
              1024: {
                slidesPerView: 2.5,
                spaceBetween: 32,
              },
              1280: {
                slidesPerView: 3,
                spaceBetween: 40,
              },
            }}
            className="podcast-swiper"
          >
            {podcasts.map((podcast) => (
              <SwiperSlide key={podcast.id}>
                <Link href={podcast.spotifyUrl} className="block group">
                  <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
                    {/* Image Container with Blue Background */}
                    <div className="relative bg-blue-600 aspect-[4/5] overflow-hidden">
                      <Image
                        src={podcast.image}
                        alt={podcast.title}
                        fill
                        className="object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                      {/* Logo overlay in bottom left */}
                      <div className="absolute bottom-4 left-4 w-8 h-8 bg-white rounded flex items-center justify-center">
                        <span className="text-blue-600 font-bold text-sm">M</span>
                      </div>
                      {/* Spotify logo in bottom right */}
                      <div className="absolute bottom-4 right-4">
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="text-black dark:text-white"
                        >
                          <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.84-.179-.84-.66 0-.36.24-.66.54-.78 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.242 1.021zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.299.421-1.02.599-1.559.3z" />
                        </svg>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <h3 className="text-xl md:text-2xl font-semibold text-gray-900 dark:text-white mb-3 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {podcast.title}
                      </h3>
                      <p className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-1">
                        {podcast.hostName}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {podcast.hostProfession}
                      </p>
                    </div>
                  </div>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Navigation Controls */}
          <div className="flex items-center justify-start gap-4 mt-6">
            <button
              className="podcast-nav-prev w-10 h-10 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Previous podcast"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-gray-700 dark:text-gray-300"
              >
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <button
              className="podcast-nav-next w-10 h-10 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Next podcast"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-gray-700 dark:text-gray-300"
              >
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
            {/* Pagination Dots */}
            <div className="podcast-pagination flex items-center gap-2"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
