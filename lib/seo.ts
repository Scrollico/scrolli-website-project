/**
 * SEO Utilities
 *
 * Functions for generating SEO metadata, Open Graph tags, and Twitter Cards
 * Following Arc Publishing principles for content discoverability
 */

import { Article, ArticleMetadata } from "@/types/content";

/**
 * Site configuration
 */
const SITE_CONFIG = {
  name: "Scrolli",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://scrolli.com",
  description: "Modern news and blog magazine platform",
  twitterHandle: "@scrolli",
  defaultImage: "/assets/images/og-default.jpg",
  locale: "tr_TR",
  type: "website",
} as const;

/**
 * Generate page title
 */
export function generateTitle(title?: string): string {
  if (!title) return SITE_CONFIG.name;
  return `${title} | ${SITE_CONFIG.name}`;
}

/**
 * Generate canonical URL
 */
export function generateCanonicalUrl(path: string): string {
  const baseUrl = SITE_CONFIG.url.replace(/\/$/, "");
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${baseUrl}${cleanPath}`;
}

/**
 * Generate article URL
 */
export function generateArticleUrl(articleId: string): string {
  return generateCanonicalUrl(`/article/${articleId}`);
}

/**
 * Generate image URL (absolute)
 */
export function generateImageUrl(imagePath?: string): string {
  if (!imagePath) return `${SITE_CONFIG.url}${SITE_CONFIG.defaultImage}`;
  if (imagePath.startsWith("http")) return imagePath;
  const cleanPath = imagePath.startsWith("/") ? imagePath : `/${imagePath}`;
  return `${SITE_CONFIG.url}${cleanPath}`;
}

/**
 * Generate article metadata for Next.js Metadata API
 */
export function generateArticleMetadata(
  article: Article,
  additionalData?: Partial<ArticleMetadata>
): {
  title: string;
  description: string;
  openGraph: {
    title: string;
    description: string;
    url: string;
    siteName: string;
    images: Array<{
      url: string;
      width: number;
      height: number;
      alt: string;
    }>;
    locale: string;
    type: string;
    publishedTime?: string;
    modifiedTime?: string;
    authors?: string[];
    tags?: string[];
  };
  twitter: {
    card: string;
    title: string;
    description: string;
    images: string[];
    creator?: string;
  };
  alternates: {
    canonical: string;
  };
} {
  const articleUrl = generateArticleUrl(article.id);
  const imageUrl = generateImageUrl(article.image);
  const description =
    article.seoDescription || article.excerpt || `${article.title} - ${SITE_CONFIG.description}`;
  const title = generateTitle(article.seoTitle || article.title);

  return {
    title,
    description,
    openGraph: {
      title: article.title,
      description,
      url: articleUrl,
      siteName: SITE_CONFIG.name,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: article.title,
        },
      ],
      locale: SITE_CONFIG.locale,
      type: "article",
      publishedTime: additionalData?.publishedTime,
      modifiedTime: additionalData?.modifiedTime,
      authors: article.author ? [article.author] : undefined,
      tags: additionalData?.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description,
      images: [imageUrl],
      creator: SITE_CONFIG.twitterHandle,
    },
    alternates: {
      canonical: articleUrl,
    },
  };
}

/**
 * Generate default site metadata
 */
export function generateSiteMetadata(): {
  metadataBase: URL;
  title: {
    default: string;
    template: string;
  };
  description: string;
  keywords: string[];
  authors: Array<{ name: string }>;
  creator: string;
  openGraph: {
    type: string;
    locale: string;
    url: string;
    siteName: string;
    title: string;
    description: string;
    images: Array<{ url: string }>;
  };
  twitter: {
    card: string;
    title: string;
    description: string;
    creator: string;
    images: string[];
  };
  robots: {
    index: boolean;
    follow: boolean;
    googleBot: {
      index: boolean;
      follow: boolean;
      "max-video-preview": number;
      "max-image-preview": string;
      "max-snippet": number;
    };
  };
} {
  return {
    metadataBase: new URL(SITE_CONFIG.url),
    title: {
      default: SITE_CONFIG.name,
      template: `%s | ${SITE_CONFIG.name}`,
    },
    description: SITE_CONFIG.description,
    keywords: ["news", "blog", "magazine", "articles", "content"],
    authors: [{ name: SITE_CONFIG.name }],
    creator: SITE_CONFIG.name,
    openGraph: {
      type: "website",
      locale: SITE_CONFIG.locale,
      url: SITE_CONFIG.url,
      siteName: SITE_CONFIG.name,
      title: SITE_CONFIG.name,
      description: SITE_CONFIG.description,
      images: [{ url: generateImageUrl() }],
    },
    twitter: {
      card: "summary_large_image",
      title: SITE_CONFIG.name,
      description: SITE_CONFIG.description,
      creator: SITE_CONFIG.twitterHandle,
      images: [generateImageUrl()],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

/**
 * Generate keywords from article content
 */
export function extractKeywords(article: Article): string[] {
  const keywords: string[] = [];

  // Add category
  if (article.category) {
    keywords.push(article.category);
  }

  // Add tag if exists
  if (article.tag) {
    keywords.push(article.tag);
  }

  // Extract words from title (simple approach)
  if (article.title) {
    const titleWords = article.title
      .toLowerCase()
      .replace(/[^\w\s]/g, "")
      .split(/\s+/)
      .filter((word) => word.length > 3);
    keywords.push(...titleWords.slice(0, 5));
  }

  return [...new Set(keywords)]; // Remove duplicates
}

/**
 * Calculate reading time from content
 * Converts "X min read" string to minutes number
 */
export function parseReadTime(readTime: string): number {
  const match = readTime.match(/(\d+)\s*min/);
  return match ? parseInt(match[1], 10) : 5; // Default to 5 minutes
}

/**
 * Format date for SEO (ISO 8601)
 */
export function formatDateForSEO(date: string): string {
  // If date is already in ISO format, return as is
  if (date.includes("T") || date.includes("Z")) {
    return date;
  }

  // Try to parse common date formats
  // This is a simplified version - in production, use a proper date library
  const dateObj = new Date(date);
  if (!isNaN(dateObj.getTime())) {
    return dateObj.toISOString();
  }

  // Fallback: return current date
  return new Date().toISOString();
}
