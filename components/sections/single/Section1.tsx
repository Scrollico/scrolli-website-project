'use client';
import Link from 'next/link'
import Image from 'next/image';
import blogData from '@/data/blog.json';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import { useState, useEffect, useMemo } from 'react';
import { Heading, Text } from "@/components/ui/typography";
import { Badge } from "@/components/ui/badge";
import { getAuthorAvatar, getAuthorName } from '@/lib/author-loader';
import { getRelatedArticles } from '@/lib/content';
import { Container } from "@/components/responsive";
import { colors, gap, componentPadding, borderRadius, typography } from "@/lib/design-tokens";
import { cn } from "@/lib/utils";
import dynamic from 'next/dynamic';

// Client-only content wrapper to prevent hydration issues
const ContentWithButton = dynamic(
  () => import('./ContentWithButton'),
  { ssr: false }
);

import { FreeContentBadgeIcon, PremiumContentBadgeIcon, HeartIcon } from "@/components/icons/ScrolliIcons";

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface Article {
  id: string;
  title: string;
  excerpt?: string;
  author: string;
  category: string;
  date: string;
  readTime: string;
  image?: string;
  tag?: string;
  number?: string;
  isPremium?: boolean;
}

interface Section1Props {
  article: Article;
}

export default function Section1({ article }: Section1Props) {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  
  // Get real related articles with additional deduplication
  const relatedArticles = useMemo(() => {
    const articles = getRelatedArticles(article, 6);
    // Final safety check: ensure unique IDs
    const uniqueArticles: typeof articles = [];
    const seenIds = new Set<string>();
    for (const article of articles) {
      if (!seenIds.has(article.id)) {
        seenIds.add(article.id);
        uniqueArticles.push(article);
      }
    }
    return uniqueArticles;
  }, [article]);

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollPercentage = (scrollTop / (documentHeight - windowHeight)) * 100;
      setScrollProgress(scrollPercentage);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Get current page URL
  const articleUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareText = `${article.title} - ${getAuthorName(article.author)}`;

  // Share handlers
  const handleTwitterShare = (e: React.MouseEvent) => {
    e.preventDefault();
    const twitterUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(articleUrl)}&text=${encodeURIComponent(shareText)}`;
    window.open(twitterUrl, '_blank', 'width=550,height=420');
  };

  const handleLinkedInShare = (e: React.MouseEvent) => {
    e.preventDefault();
    const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(articleUrl)}`;
    window.open(linkedInUrl, '_blank', 'width=550,height=420');
  };

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsLiked(!isLiked);
    // TODO: Add API call to save/bookmark article
  };

  return (
    <>
      <article itemScope itemType="https://schema.org/Article">
        <Container>
        {/* Article Header */}
        <header className="entry-header">
          <div className={cn("gap-6 md:gap-9", "flex flex-col items-center justify-center text-center", "h-[200px]", "mt-[29px] mb-[29px]")}>
            {/* Premium/Free Badge - Centered above title */}
            <div className={gap.md}>
              {article.isPremium ? (
                <div className={cn("inline-flex items-center gap-1.5", componentPadding.xs, borderRadius.full, colors.warning.bg, colors.warning.DEFAULT)}>
                  <PremiumContentBadgeIcon size={14} className={colors.warning.DEFAULT} />
                  <span className={cn(typography.caption, "font-semibold uppercase tracking-wider")}>Premium Story</span>
                </div>
              ) : (
                <div className={cn("inline-flex items-center gap-1.5", componentPadding.xs, borderRadius.full, colors.background.elevated, colors.foreground.secondary)}>
                  <FreeContentBadgeIcon size={14} />
                  <span className={cn(typography.caption, "font-semibold uppercase tracking-wider")}>Free Read</span>
                </div>
              )}
            </div>

            <Heading level={1} variant="h1" className="entry-title m_b_2rem" itemProp="headline">{article.title}</Heading>
          </div>
        </header>
        {/*end single header*/}
        {article.image && (
          <figure className={cn("relative w-[70%] mx-auto", gap.lg, "featured-image overflow-hidden", borderRadius.lg, "aspect-video md:aspect-[16/9]")}>
            <Image
              src={article.image}
              alt={article.title}
              fill
              className="object-cover object-center"
              sizes="(max-width: 768px) 70vw, (max-width: 1200px) 63vw, 840px"
              priority
            />
          </figure>
        )}
        {/*figure*/}
        <article className={cn("entry-wraper", gap.lg)}>
          <div className="entry-left-col">
            <div className="social-sticky">
              <button
                onClick={handleTwitterShare}
                aria-label="Share on Twitter"
                className="social-share-btn"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </button>
              <button
                onClick={handleLinkedInShare}
                aria-label="Share on LinkedIn"
                className="social-share-btn"
              >
                <i className="icon-linkedin" />
              </button>
              <button
                onClick={handleLike}
                aria-label={isLiked ? "Remove from favorites" : "Add to favorites"}
                className={`social-share-btn social-heart ${isLiked ? 'liked' : ''} ${scrollProgress > 20 ? 'pulse-animation' : ''}`}
              >
                <HeartIcon size={16} className={isLiked ? "text-red-500 fill-current" : ""} />
              </button>
            </div>
          </div>
          {/* Author Meta - After Image, Before Content, Aligned with Article Content */}
          <div className={cn("entry-meta align-items-center", gap.md, "pt-[23px] pb-[23px]")} itemProp="author" itemScope itemType="https://schema.org/Person">
            <Link className="author-avatar" href={`/author/${article.author.toLowerCase().replace(/\s+/g, "-")}`}>
              <Image
                src={getAuthorAvatar(article.author) || "/assets/images/author-avata-2.jpg"}
                alt={getAuthorName(article.author)}
                width={40}
                height={40}
              />
            </Link>
            <div className="entry-meta-line">
              <Link href={`/author/${article.author.toLowerCase().replace(/\s+/g, "-")}`}>{getAuthorName(article.author)}</Link> in <Link href="/archive">{article.category}</Link>
            </div>
            <div className="entry-meta-line">
              <span>{article.date}</span>
              <span className="middotDivider" />
              <span className="readingTime" title={article.readTime}>
                {article.readTime}
              </span>
            </div>
          </div>
          {article.excerpt && (
            <div className={cn("excerpt", gap.md)}>
              <p>{article.excerpt}</p>
            </div>
          )}
          <div className="entry-main-content dropcap article-content">
            <ContentWithButton content={article.content || ''} />
          </div>
          <div className="entry-bottom">
            <div className="tags-wrap heading">
              <div className="tags flex flex-wrap gap-2">
                <Badge variant="secondary" appearance="outline" size="sm" asChild>
                  <Link href="/categories/fashion" rel="tag">
                    fashion
                  </Link>
                </Badge>
                <Badge variant="secondary" appearance="outline" size="sm" asChild>
                  <Link href="/categories/lifestyle" rel="tag">
                    lifestyle
                  </Link>
                </Badge>
                <Badge variant="secondary" appearance="outline" size="sm" asChild>
                  <Link href="/categories/news" rel="tag">
                    news
                  </Link>
                </Badge>
                <Badge variant="secondary" appearance="outline" size="sm" asChild>
                  <Link href="/categories/style" rel="tag">
                    style
                  </Link>
                </Badge>
              </div>
            </div>
          </div>
        </article>
        {/*entry-content*/}
        {/*Begin post related*/}
        {relatedArticles.length > 0 && (
          <div className={cn("related-posts", gap.lg)}>
            <Heading level={4} variant="h4" className={cn("spanborder text-center", gap.md)}>
              <span>İlgili Makaleler</span>
            </Heading>
            <Swiper
              modules={[Autoplay, Navigation, Pagination]}
              spaceBetween={16}
              slidesPerView={4}
              navigation={false}
              pagination={{ clickable: true }}
              loop={relatedArticles.length > 4}
              grabCursor={true}
              resistance={true}
              resistanceRatio={0.85}
              autoplay={{
                delay: 5000,
                disableOnInteraction: false,
              }}
              breakpoints={{
                320: {
                  slidesPerView: 1,
                  spaceBetween: 16
                },
                640: {
                  slidesPerView: 2,
                  spaceBetween: 16
                },
                768: {
                  slidesPerView: 3,
                  spaceBetween: 16
                },
                1024: {
                  slidesPerView: 4,
                  spaceBetween: 16
                },
                1280: {
                  slidesPerView: 4,
                  spaceBetween: 16
                }
              }}
              className="related-posts-slider"
            >
              {relatedArticles.map((post) => (
                <SwiperSlide key={post.id} className="related-post-slide">
                  <article className="group related-post-card">
                    <Link href={`/article/${post.id}`} prefetch={true} className="block h-full related-post-link">
                      {post.image && (
                        <figure className="relative w-full aspect-[16/9] overflow-hidden bg-gray-200">
                          <Image
                            className="lazy !object-cover !object-center transition-transform duration-300 group-hover:scale-105"
                            src={post.image}
                            alt={post.title}
                            fill
                            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                            style={{ objectFit: 'cover' }}
                          />
                        </figure>
                      )}
                      <div className="entry-content flex-1">
                        <Heading level={5} variant="h6" color="primary" className="news-card-headline text-gray-900 dark:text-white">
                          {post.title}
                        </Heading>
                      </div>
                    </Link>
                  </article>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        )}
        {/*End post related*/}
        </Container>
      </article>
      <style jsx>{`
        .featured-image {
          min-height: 300px;
        }
        @media (min-width: 768px) {
          .featured-image {
            min-height: 500px;
          }
        }
        :global(.swiper-container) {
          padding-bottom: 50px;
        }
        :global(.swiper-pagination) {
          bottom: 0;
        }
        :global(.swiper-button-prev),
        :global(.swiper-button-next) {
          color: var(--primary);
        }

        /* Related posts - Discover more style (light theme) */
        article.container {
          overflow: visible !important;
        }
        .related-posts {
          max-width: 800px;
          width: 100%;
          margin: 0 auto;
          overflow: visible;
          padding: 0 24px;
        }
        @media (max-width: 991px) {
          .related-posts {
            max-width: 100%;
            padding: 0 16px;
          }
        }
        .related-posts-slider {
          width: 100% !important;
          max-width: 100%;
          background: #f9fafb;
          color: #111827;
          padding: 24px 40px;
          border-radius: 10px;
          overflow: visible !important;
        }
        .dark .related-posts-slider {
          background: #1f2937;
          color: #ffffff;
        }
        .related-posts-slider .swiper-wrapper {
          width: auto !important;
          max-width: 100%;
          overflow: visible !important;
          margin: 0 -16px;
          padding-left: 32px;
          padding-right: 32px;
        }
        .related-posts-slider .swiper-slide {
          overflow: visible !important;
        }
        /* News card styling - Discover more grid layout */
        .related-post-slide {
          min-width: 220px;
          max-width: 320px;
          flex: 1;
          padding: 8px 16px;
        }
        .related-post-slide:first-child {
          padding-left: 24px;
        }
        .related-post-slide:last-child {
          padding-right: 24px;
        }
        .related-post-card {
          height: 100%;
          display: flex;
          flex-direction: column;
          background: #f9fafb;
          border-radius: 10px;
          overflow: visible;
          opacity: 1;
          border: 1px solid rgba(0, 0, 0, 0.08);
          transition: transform 0.2s ease, opacity 0.2s ease;
          margin: 0;
        }
        .dark .related-post-card {
          background: #1f2937;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        .related-post-card:hover {
          transform: translateY(-2px);
          opacity: 0.8;
        }
        .dark .related-post-card:hover {
          opacity: 0.8;
        }
        .related-post-link {
          padding: 0;
          display: flex;
          flex-direction: column;
          height: 100%;
          overflow: visible;
        }
        .related-post-card figure {
          width: 100%;
          aspect-ratio: 16 / 9;
          padding: 16px 12px;
          border: 1px solid rgba(0, 0, 0, 0.1);
          border-radius: 10px 10px 0 0;
          overflow: hidden;
          margin-bottom: 0;
        }
        .dark .related-post-card figure {
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        .related-post-card .entry-content {
          display: flex;
          flex-direction: column;
          flex: 1;
          padding: 16px 12px;
          border-radius: 0 0 10px 10px;
        }
        .news-card-headline {
          font-size: 0.95rem !important;
          font-weight: 600 !important;
          margin: 0 0 8px 0;
          line-height: 1.3;
        }
        .news-card-summary {
          font-size: 0.95rem;
          margin: 0;
          color: #666;
          line-height: 1.4;
        }
        .dark .news-card-summary {
          color: #ccc;
        }
        /* Remove dividers for grid layout */
        .related-post-slide:not(:last-child)::after {
          display: none;
        }

        /* Social heart pulse animation on scroll */
        .social-heart {
          opacity: 1;
          transition: opacity 0.3s ease;
        }

        .social-heart i {
          animation: none;
        }

        .social-heart i.pulse-animation {
          animation: heartPulse 2s ease-in-out infinite;
        }
      `}</style>

      <style jsx global>{`
        @keyframes heartPulse {
          0%, 100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.1);
            opacity: 0.8;
          }
        }

        .social-sticky i {
          vertical-align: middle;
          font-size: 13px;
        }
      `}</style>
    </>
  );
}
