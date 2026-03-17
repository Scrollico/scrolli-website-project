'use client';
import Link from 'next/link'
import Image from 'next/image';
// InlineScriptRenderer is used for hikayeler articles with external CMS scripts
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';

const ArticleGateWrapper = ({ isPremium, children }: { isPremium?: boolean, children: React.ReactNode }) => {
  if (isPremium) {
    return <PremiumGate showUpgradeButton={true}>{children}</PremiumGate>;
  }
  return <>{children}</>;
};

import { Heading, Text } from "@/components/ui/typography";
import { Badge } from "@/components/ui/badge";
import { getAuthorAvatar, getAuthorName } from '@/lib/author-loader';
import { Container } from "@/components/responsive";
import { colors, gap, componentPadding, borderRadius, typography } from "@/lib/design-tokens";
import { cn } from "@/lib/utils";
import dynamic from 'next/dynamic';

// Client-only content wrapper to prevent hydration issues
const ContentWithButton = dynamic(
  () => import('./ContentWithButton'),
  { ssr: false }
);

// HikayelerArticle handles the specialized story rendering
const HikayelerArticle = dynamic(
  () => import('./HikayelerArticle'),
  { ssr: false }
);

import { FreeContentBadgeIcon, PremiumContentBadgeIcon } from "@/components/icons/scrolli-icons";
import { cleanHtmlContent } from "@/lib/html-cleaner";
import { PremiumGate } from "@/components/premium/PremiumGate";
import { ArticleGateWrapper as PaywallGateWrapper, ArticleGiftButton } from "@/components/paywall";

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface Article {
  id: string;
  title: string;
  subtitle?: string; // Article subtitle (from Payload CMS)
  excerpt?: string;
  author: string;
  authorSlug?: string; // Author slug for linking to author page (from Payload CMS)
  category: string;
  date: string;
  readTime: string;
  image?: string; // Desktop/primary image
  mobileImage?: string; // Mobile/vertical image variant
  tag?: string;
  number?: string;
  isPremium?: boolean;
  content?: string; // HTML content for article body
  inlineScriptHtml?: string; // Inline script HTML from external CMS (e.g., Instorier stories)
  slug?: string;
}

interface Section1Props {
  article: Article;
  relatedArticles?: Article[];
  isPaywalled?: boolean;
}

export default function Section1({ article, relatedArticles = [], isPaywalled = false }: Section1Props) {
  // Share handlers
  const handleTwitterShare = (e: React.MouseEvent) => {
    e.preventDefault();
    const socialUrl = window.location.href;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title)}&url=${socialUrl}`;
    window.open(twitterUrl, '_blank', 'width=600,height=400');
  };

  const handleLinkedInShare = (e: React.MouseEvent) => {
    e.preventDefault();
    const socialUrl = window.location.href;
    const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(socialUrl)}`;
    window.open(linkedInUrl, '_blank', 'width=600,height=400');
  };

  // Check if this is a hikayeler or stories article (both use scrollytelling)
  // Also check if any article has a scrollytelling script (could be a Collab or other collection)
  const isHikayeler = article.category === "hikayeler" || article.category === "stories";
  const hasScript = !!article.inlineScriptHtml && article.inlineScriptHtml.trim().length > 0;

  // For hikayeler articles OR any article with a scrollytelling script, delegate to the specialized component
  if (isHikayeler || hasScript) {
    return <HikayelerArticle article={article} />;
  }

  return (
    <>
      <PaywallGateWrapper articleId={article.id}>
        <ArticleGateWrapper isPremium={article.isPremium}>
          <article itemScope itemType="https://schema.org/Article">
            <Container>
              {/* Article Header */}
              <header className="entry-header">
                <div className={cn("flex flex-col items-center justify-center text-center", "py-10 md:py-14", "gap-6")}>
                  {/* Premium/Free Badge - Centered above title */}
                  <div className="mb-2">
                    {article.isPremium ? (
                      <div className={cn("inline-flex items-center gap-1.5", componentPadding.xs, borderRadius.full, colors.warning.bg, colors.warning.DEFAULT)}>
                        <PremiumContentBadgeIcon size={14} className={colors.warning.DEFAULT} />
                        <span className={cn(typography.caption, "font-semibold tracking-wider")}>Premium Story</span>
                      </div>
                    ) : (
                      <div className={cn("inline-flex items-center gap-1.5", componentPadding.xs, borderRadius.full, colors.background.elevated, colors.foreground.secondary)}>
                        <FreeContentBadgeIcon size={14} />
                        <span className={cn(typography.caption, "font-semibold tracking-wider")}>Free Read</span>
                      </div>
                    )}
                  </div>

                  <Heading level={1} variant="h1" className={cn("entry-title max-w-4xl mx-auto", colors.foreground.primary)} itemProp="headline">{article.title}</Heading>
                  {article.subtitle && (
                    <Text className="entry-subtitle text-lg md:text-xl text-gray-600 dark:text-gray-400 mt-2 max-w-3xl mx-auto" itemProp="alternativeHeadline">
                      {article.subtitle}
                    </Text>
                  )}
                </div>
              </header>
              {/*end single header*/}
              {article.image && (
                <figure className={cn("relative w-[70%] mx-auto", gap.lg, "featured-image overflow-hidden", borderRadius.lg, "aspect-video md:aspect-[16/9]")}>
                  {article.mobileImage ? (
                    <>
                      {/* Mobile image */}
                      <Image
                        src={article.mobileImage}
                        alt={article.title}
                        fill
                        className="object-cover object-center md:hidden"
                        sizes="70vw"
                        priority
                      />
                      {/* Desktop image */}
                      <Image
                        src={article.image}
                        alt={article.title}
                        fill
                        className="object-cover object-center hidden md:block"
                        sizes="(max-width: 1200px) 63vw, 840px"
                        priority
                      />
                    </>
                  ) : (
                    <Image
                      src={article.image}
                      alt={article.title}
                      fill
                      className="object-cover object-center"
                      sizes="(max-width: 768px) 70vw, (max-width: 1200px) 63vw, 840px"
                      priority
                    />
                  )}
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
                  </div>
                </div>
                {/* Author Meta */}
                <div className="flex items-center gap-3 py-4 border-b border-gray-100 dark:border-gray-800" itemProp="author" itemScope itemType="https://schema.org/Person">
                  {/* Avatar - hard-constrained wrapper prevents CSS bleed */}
                  {article.authorSlug ? (
                    <Link href={`/author/${article.authorSlug}`} className="shrink-0" style={{ display: 'block', width: 36, height: 36 }}>
                      <div style={{ width: 36, height: 36, borderRadius: '50%', overflow: 'hidden', position: 'relative' }}>
                        <Image
                          src={getAuthorAvatar(article.author) || "/assets/images/author-avata-2.jpg"}
                          alt={getAuthorName(article.author)}
                          fill
                          className="object-cover"
                          sizes="36px"
                        />
                      </div>
                    </Link>
                  ) : (
                    <div className="shrink-0" style={{ display: 'block', width: 36, height: 36 }}>
                      <div style={{ width: 36, height: 36, borderRadius: '50%', overflow: 'hidden', position: 'relative' }}>
                        <Image
                          src={getAuthorAvatar(article.author) || "/assets/images/author-avata-2.jpg"}
                          alt={getAuthorName(article.author)}
                          fill
                          className="object-cover"
                          sizes="36px"
                        />
                      </div>
                    </div>
                  )}

                  {/* Author info */}
                  <div className="flex flex-col gap-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {article.authorSlug ? (
                        <Link href={`/author/${article.authorSlug}`} className="text-sm font-semibold text-gray-900 dark:text-gray-100 hover:underline" itemProp="name">
                          {getAuthorName(article.author)}
                        </Link>
                      ) : (
                        <span className="text-sm font-semibold text-gray-900 dark:text-gray-100" itemProp="name">
                          {getAuthorName(article.author)}
                        </span>
                      )}
                      <span className="text-xs text-gray-400 dark:text-gray-500">in</span>
                      <Link href="/archive">
                        <Badge className="cursor-pointer text-xs px-2 py-0">
                          {article.category}
                        </Badge>
                      </Link>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                      <span>{article.date}</span>
                      <span className="text-gray-300 dark:text-gray-600" aria-hidden>·</span>
                      <span>{article.readTime}</span>
                    </div>
                  </div>

                  {/* Gift Button */}
                  <div className="ml-auto shrink-0">
                    <ArticleGiftButton
                      articleId={article.id}
                      articleTitle={article.title}
                      variant="outline"
                    />
                  </div>
                </div>
                {article.excerpt && (
                  <div
                    className={cn(
                      "excerpt prose prose-sm max-w-none",
                      gap.md,
                      "text-gray-700 dark:text-gray-300 leading-relaxed"
                    )}
                  >
                    <div dangerouslySetInnerHTML={{ __html: cleanHtmlContent(article.excerpt) }} />
                  </div>
                )}
                <div className="entry-main-content dropcap article-content">
                  {article.content ? (
                    <ContentWithButton
                      content={article.content}
                      className="article-content prose prose-lg max-w-none dark:prose-invert"
                      isPaywalled={isPaywalled}
                      articleId={article.id}
                    />
                  ) : (
                    <p className="text-gray-500 dark:text-gray-400">Content not available</p>
                  )}
                </div>
                <div className="entry-bottom">
                  <div className="tags-wrap heading">
                    <div className="tags flex flex-wrap gap-2">
                      <Link href="/categories/fashion" rel="tag">
                        <Badge className="cursor-pointer">
                          fashion
                        </Badge>
                      </Link>
                      <Link href="/categories/lifestyle" rel="tag">
                        <Badge className="cursor-pointer">
                          lifestyle
                        </Badge>
                      </Link>
                      <Link href="/categories/news" rel="tag">
                        <Badge className="cursor-pointer">
                          news
                        </Badge>
                      </Link>
                      <Link href="/categories/style" rel="tag">
                        <Badge className="cursor-pointer">
                          style
                        </Badge>
                      </Link>
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
                          <Link href={post.slug ? `/${post.slug}` : `/${post.id}`} prefetch={true} className="block h-full related-post-link">
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
        </ArticleGateWrapper>
      </PaywallGateWrapper>
      <style jsx>{`
        /* Article content styling - matching live repo */
        .entry-main-content {
          font-family: var(--font-newsreader), serif;
          color: inherit;
          max-width: 100%;
        }
        
        .entry-main-content.article-content {
          font-size: 1rem;
          line-height: 1.8;
        }

        .entry-main-content.article-content p {
          font-size: 1rem;
          line-height: 1.8;
          margin-bottom: 1.75rem;
          color: inherit;
          max-width: 46rem; /* Using rem for consistent width regardless of font size */
          margin-left: auto;
          margin-right: auto;
          text-align: left;
          display: block;
        }
        
        .entry-main-content.article-content h1,
        .entry-main-content.article-content h2,
        .entry-main-content.article-content h3,
        .entry-main-content.article-content h4,
        .entry-main-content.article-content h5,
        .entry-main-content.article-content h6 {
          font-weight: 700;
          margin-top: 3rem;
          margin-bottom: 1.5rem;
          color: inherit;
          line-height: 1.2;
          max-width: 46rem; /* Align with paragraphs */
          margin-left: auto;
          margin-right: auto;
          text-align: left;
          display: block;
        }
        
        .entry-main-content.article-content h1 {
          font-size: 2.5rem;
          margin-top: 4rem;
        }
        
        .entry-main-content.article-content h2 {
          font-size: 2rem;
          margin-top: 3.5rem;
        }
        
        .entry-main-content.article-content h3 {
          font-size: 1.75rem;
        }
        
        /* Make h4 bigger as requested (same as h3 or slightly smaller but distinct) */
        .entry-main-content.article-content h4,
        .entry-main-content.article-content h4.text-lg,
        .entry-main-content.article-content h4.md\:text-xl,
        .entry-main-content.article-content h4.font-semibold {
          font-size: 1.75rem !important; /* Bump up to h3 size */
        }
        
        .entry-main-content.article-content blockquote {
          border-left: 4px solid #d1d5db;
          padding-left: 1.5rem;
          padding-right: 1.5rem;
          margin: 2.5rem auto;
          font-style: italic;
          color: #6b7280;
          font-size: 1.125rem;
          line-height: 1.875;
          max-width: 46rem;
        }
        
        .dark .entry-main-content.article-content blockquote {
          border-left-color: #4b5563;
          color: #9ca3af;
        }
        
        .entry-main-content.article-content ul,
        .entry-main-content.article-content ol {
          margin: 2rem auto;
          padding-left: 2rem;
          max-width: 46rem;
        }
        
        .entry-main-content.article-content li {
          margin-bottom: 0.75rem;
          line-height: 1.875;
          font-size: 1.125rem;
        }
        
        .entry-main-content.article-content img {
          width: 100% !important;
          height: auto !important;
          display: block;
          margin: 2.5rem auto;
          border-radius: 0.75rem;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }
        
        @media (max-width: 768px) {
          .entry-main-content.article-content p,
          .entry-main-content.article-content h1,
          .entry-main-content.article-content h2,
          .entry-main-content.article-content h3,
          .entry-main-content.article-content h4,
          .entry-main-content.article-content blockquote,
          .entry-main-content.article-content ul,
          .entry-main-content.article-content ol {
            max-width: 100%;
          }
          
          .entry-main-content.article-content p {
            font-size: 1rem;
            line-height: 1.75;
          }
          
          .entry-main-content.article-content h1 {
            font-size: 2rem;
          }
          
          .entry-main-content.article-content h2 {
            font-size: 1.75rem;
          }
          
          .entry-main-content.article-content h3 {
            font-size: 1.5rem;
          }
          
          .entry-main-content.article-content h4 {
            font-size: 1.25rem;
          }
        }
        
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

        /* Dark mode article header background + text color fixes (persisted from browser preview) */
        :global(.dark .single .entry-header),
        :global(.dark-mode .single .entry-header) {
          background-color: unset !important; /* Change 1 */
          background: unset !important; /* Change 2 */
        }

        :global(.dark .single .entry-header),
        :global(.dark .single .entry-header *),
        :global(.dark .single #main-content > .w-full),
        :global(.dark-mode .single .entry-header),
        :global(.dark-mode .single .entry-header *),
        :global(.dark-mode .single #main-content > .w-full) {
          color: rgba(243, 244, 246, 1) !important; /* Changes 3 & 4 */
        }
      `}</style>
    </>
  );
}
