/**
 * Structured Data (JSON-LD) Generators
 *
 * Following Schema.org standards for rich snippets and search engine optimization
 * Based on Arc Publishing principles for content discoverability
 */

import { Article, ArticleMetadata } from "@/types/content";
import {
  generateArticleUrl,
  generateImageUrl,
  formatDateForSEO,
  parseReadTime,
} from "./seo";

/**
 * Site configuration for structured data
 */
const SITE_CONFIG = {
  name: "Scrolli",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://scrolli.com",
  logo: "/assets/images/Standart/Primary-alternative.png",
  description: "Modern news and blog magazine platform",
  sameAs: [
    // Add social media URLs here
    // "https://twitter.com/scrolli",
    // "https://facebook.com/scrolli",
  ],
} as const;

/**
 * Generate Article JSON-LD structured data
 * Schema.org Article type
 */
export function generateArticleStructuredData(
  article: Article,
  metadata?: Partial<ArticleMetadata>
): object {
  const articleUrl = generateArticleUrl(article.id);
  const imageUrl = generateImageUrl(article.image);
  const publishedTime =
    metadata?.publishedTime || formatDateForSEO(article.date);
  const modifiedTime = metadata?.modifiedTime || publishedTime;
  const readTimeMinutes = parseReadTime(article.readTime);

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.excerpt || article.title,
    image: imageUrl,
    datePublished: publishedTime,
    dateModified: modifiedTime,
    author: {
      "@type": "Person",
      name: article.author,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_CONFIG.name,
      logo: {
        "@type": "ImageObject",
        url: generateImageUrl(SITE_CONFIG.logo),
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": articleUrl,
    },
    articleSection: article.category,
    keywords: metadata?.tags?.join(", ") || article.category,
    timeRequired: `PT${readTimeMinutes}M`,
    url: articleUrl,
  };
}

/**
 * Generate Organization JSON-LD structured data
 * Schema.org Organization type
 */
export function generateOrganizationStructuredData(): object {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_CONFIG.name,
    url: SITE_CONFIG.url,
    logo: generateImageUrl(SITE_CONFIG.logo),
    description: SITE_CONFIG.description,
    sameAs: SITE_CONFIG.sameAs,
  };
}

/**
 * Generate Website JSON-LD structured data
 * Schema.org WebSite type with SearchAction
 */
export function generateWebsiteStructuredData(): object {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_CONFIG.name,
    url: SITE_CONFIG.url,
    description: SITE_CONFIG.description,
    publisher: {
      "@type": "Organization",
      name: SITE_CONFIG.name,
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_CONFIG.url}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

/**
 * Generate BreadcrumbList JSON-LD structured data
 * Schema.org BreadcrumbList type
 */
export function generateBreadcrumbStructuredData(
  items: Array<{ name: string; url: string }>
): object {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/**
 * Generate article breadcrumb items
 */
export function generateArticleBreadcrumbs(article: Article): Array<{
  name: string;
  url: string;
}> {
  const baseUrl = SITE_CONFIG.url;
  return [
    { name: "Home", url: baseUrl },
    {
      name: article.category,
      url: `${baseUrl}/categories?category=${encodeURIComponent(
        article.category
      )}`,
    },
    { name: article.title, url: generateArticleUrl(article.id) },
  ];
}

/**
 * Generate NewsArticle JSON-LD structured data
 * Schema.org NewsArticle type (extends Article)
 * Use this for news content
 */
export function generateNewsArticleStructuredData(
  article: Article,
  metadata?: Partial<ArticleMetadata>
): object {
  const baseArticle = generateArticleStructuredData(article, metadata);

  return {
    ...baseArticle,
    "@type": "NewsArticle",
    dateline: article.date,
    articleBody: article.excerpt || "",
  };
}

/**
 * Generate BlogPosting JSON-LD structured data
 * Schema.org BlogPosting type (extends Article)
 * Use this for blog content
 */
export function generateBlogPostingStructuredData(
  article: Article,
  metadata?: Partial<ArticleMetadata>
): object {
  const baseArticle = generateArticleStructuredData(article, metadata);

  return {
    ...baseArticle,
    "@type": "BlogPosting",
  };
}

/**
 * Generate Person JSON-LD structured data for author
 * Schema.org Person type
 */
export function generateAuthorStructuredData(
  authorName: string,
  additionalData?: {
    jobTitle?: string;
    image?: string;
    url?: string;
    sameAs?: string[];
  }
): object {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: authorName,
    jobTitle: additionalData?.jobTitle,
    image: additionalData?.image
      ? generateImageUrl(additionalData.image)
      : undefined,
    url: additionalData?.url,
    sameAs: additionalData?.sameAs,
  };
}

/**
 * Generate CollectionPage JSON-LD structured data
 * Schema.org CollectionPage type
 * Use for category/archive pages
 */
export function generateCollectionPageStructuredData(
  title: string,
  description: string,
  url: string,
  articles: Article[]
): object {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: title,
    description,
    url,
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: articles.length,
      itemListElement: articles.map((article, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "Article",
          headline: article.title,
          url: generateArticleUrl(article.id),
        },
      })),
    },
  };
}

/**
 * Generate FAQPage JSON-LD structured data
 * Schema.org FAQPage type
 */
export function generateFAQPageStructuredData(
  faqs: Array<{ question: string; answer: string }>
): object {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

/**
 * Generate VideoObject JSON-LD structured data
 * Schema.org VideoObject type
 */
export function generateVideoStructuredData(video: {
  name: string;
  description: string;
  thumbnailUrl: string;
  contentUrl: string;
  embedUrl?: string;
  duration?: string;
  uploadDate: string;
}): object {
  return {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: video.name,
    description: video.description,
    thumbnailUrl: generateImageUrl(video.thumbnailUrl),
    contentUrl: video.contentUrl,
    embedUrl: video.embedUrl,
    duration: video.duration,
    uploadDate: video.uploadDate,
  };
}

/**
 * Render JSON-LD script tag
 * Helper function to generate script tag HTML
 */
export function renderJsonLdScript(data: object): string {
  return `<script type="application/ld+json">${JSON.stringify(
    data,
    null,
    2
  )}</script>`;
}
