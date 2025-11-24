'use client';
import Link from 'next/link'
import Image from 'next/image';
import blogData from '@/data/blog.json';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import { useState, useEffect } from 'react';
import { Heading, Text } from "@/components/ui/typography";
import { Badge } from "@/components/ui/badge";
import NewsletterBanner from "@/components/sections/home/NewsletterBanner";

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
  const shareText = `${article.title} - ${article.author}`;

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
      <article className="container" itemScope itemType="https://schema.org/Article">
        {/* Article Header */}
        <header className="entry-header">
          <div className="mb-5 flex flex-col items-center text-center">
            {/* Premium/Free Badge - Centered above title */}
            <div className="mb-4">
              {article.isPremium ? (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400">
                  <PremiumContentBadgeIcon size={14} className="text-amber-600 dark:text-amber-400" />
                  <span className="text-xs font-semibold uppercase tracking-wider">Premium Story</span>
                </div>
              ) : (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                  <FreeContentBadgeIcon size={14} />
                  <span className="text-xs font-semibold uppercase tracking-wider">Free Read</span>
                </div>
              )}
            </div>

            <Heading level={1} variant="h1" className="entry-title m_b_2rem" itemProp="headline">{article.title}</Heading>
          </div>
        </header>
        {/*end single header*/}
        {article.image && (
          <figure className="image zoom mb-5 featured-image relative">
            <figure>
              <Link href={`/article/${article.id}`} prefetch={true}>
                <Image
                  className="lazy img-fluid responsive-image"
                  src={article.image}
                  alt={article.title}
                  width={1240}
                  height={700}
                />
              </Link>
            </figure>
          </figure>
        )}
        {/*figure*/}
        <article className="entry-wraper mb-5">
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
          <div className="entry-meta align-items-center mt-12 mb-3" itemProp="author" itemScope itemType="https://schema.org/Person">
            <Link className="author-avatar" href="#">
              <Image
                src="/assets/images/author-avata-2.jpg"
                alt="author avatar"
                width={40}
                height={40}
              />
            </Link>
            <div className="entry-meta-line">
              <Link href="/author">{article.author}</Link> in <Link href="/archive">{article.category}</Link>
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
            <div className="excerpt mb-4">
              <p>{article.excerpt}</p>
            </div>
          )}
          <div className="entry-main-content dropcap">
            <p>
              Gosh jaguar ostrich quail one excited dear hello and <Link href="#">bound</Link>
              <sup>
                <Link href="#">[1]</Link>
              </sup>
              and the and bland moral misheard roadrunner flapped lynx far that and jeepers giggled far and far bald that roadrunner python inside held shrewdly the manatee.
            </p>
            <p>
              Thanks sniffed in hello after in foolhardy and some far purposefully much one at the much conjointly leapt skimpily that quail sheep some goodness <Link href="#">nightingale</Link> the instead exited expedient up far ouch mellifluous altruistic and and lighted more instead much when ferret but the.
            </p>
            <hr className="section-divider" />
            <p>
              Yet more some certainly yet alas abandonedly whispered <Link href="#">intriguingly</Link>
              <sup>
                <Link href="#">[2]</Link>
              </sup>
              well extensive one howled talkative admonishingly below a rethought overlaid dear gosh activated less <Link href="#">however</Link> hawk yet oh scratched ostrich some outside crud irrespective lightheartedly and much far amenably that the elephant since when.
            </p>
            <Heading level={2} variant="h3">The Guitar Legends</Heading>
            <p>
              Furrowed this in the upset <Link href="#">some across</Link>
              <sup>
                <Link href="#">[3]</Link>
              </sup>
              tiger oh loaded house gosh whispered <Link href="#">faltering alas</Link>
              <sup>
                <Link href="#">[4]</Link>
              </sup>
              ouch cuckoo coward in scratched undid together bit fumblingly so besides salamander heron during the jeepers hello fitting jauntily much smoothly globefish darn blessedly far so along bluebird leopard and.
            </p>
            <blockquote>
              <p>
                Integer eu faucibus <Link href="#">dolor</Link>
                <sup>
                  <Link href="#">[5]</Link>
                </sup>
                . Ut venenatis tincidunt diam elementum imperdiet. Etiam accumsan semper nisl eu congue. Sed aliquam magna erat, ac eleifend lacus rhoncus in.
              </p>
            </blockquote>
            <p>Fretful human far recklessly while caterpillar well a well blubbered added one a some far whispered rampantly whispered while irksome far clung irrespective wailed more rosily and where saluted while black dear so yikes as considering recast to some crass until cow much less and rakishly overdrew consistent for by responsible oh one hypocritical less bastard hey oversaw zebra browbeat a well.</p>
            <Heading level={3} variant="h4">Getting Crypto Rich</Heading>
            <p>And far contrary smoked some contrary among stealthy engagingly suspiciously a cockatoo far circa sank dully lewd slick cracked llama the much gecko yikes more squirrel sniffed this and the the much within uninhibited this abominable a blubbered overdid foresaw through alas the pessimistic.</p>
            <p>Gosh jaguar ostrich quail one excited dear hello and bound and the and bland moral misheard roadrunner flapped lynx far that and jeepers giggled far and far bald that roadrunner python inside held shrewdly the manatee.</p>
            <hr className="section-divider" />
            <p>Thanks sniffed in hello after in foolhardy and some far purposefully much one at the much conjointly leapt skimpily that quail sheep some goodness nightingale the instead exited expedient up far ouch mellifluous altruistic and and lighted more instead much when ferret but the.</p>
            {/*Begin Subscribe*/}
            <div className="mb-5">
              <NewsletterBanner />
            </div>
            {/*End Subscribe*/}
            <p>Yet more some certainly yet alas abandonedly whispered intriguingly well extensive one howled talkative admonishingly below a rethought overlaid dear gosh activated less however hawk yet oh scratched ostrich some outside crud irrespective lightheartedly and much far amenably that the elephant since when.</p>
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
        <div className="related-posts mb-5">
          <Heading level={4} variant="h4" className="spanborder text-center mb-4">
            <span>{blogData.relatedPosts.title}</span>
          </Heading>
          <Swiper
            modules={[Autoplay, Navigation, Pagination]}
            spaceBetween={16}
            slidesPerView={4}
            navigation={false}
            pagination={{ clickable: true }}
            loop={true}
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
            {blogData.relatedPosts.articles.map((post: any) => (
              <SwiperSlide key={post.id} className="related-post-slide">
                <article className="group related-post-card">
                  <Link href={`/article/${post.id}`} prefetch={true} className="block h-full related-post-link">
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
                    <div className="entry-content flex-1">
                      <Heading level={5} variant="h6" className="news-card-headline">
                        {post.title}
                      </Heading>
                      {'excerpt' in post && post.excerpt && typeof post.excerpt === 'string' && (
                        <Text variant="bodySmall" color="muted" className="news-card-summary">
                          {post.excerpt}
                        </Text>
                      )}
                    </div>
                  </Link>
                </article>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
        {/*End post related*/}
      </article>
      <style jsx>{`
        .responsive-image {
          height: 400px;
          object-fit: cover;
        }
        .featured-image {
          max-height: 400px;
          object-fit: cover;
          object-position: center;
          overflow: hidden;
          display: flex;
          align-content: center;
          justify-content: center;
          align-items: center;
        }
        @media (min-width: 768px) {
          .responsive-image {
            height: 700px;
          }
          .featured-image {
            max-height: 700px;
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
          font-size: 0.95rem;
          font-weight: bold;
          margin: 0 0 8px 0;
          color: #111827;
          line-height: 1.3;
        }
        .dark .news-card-headline {
          color: #ffffff;
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
