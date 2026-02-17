import { Article } from "@/types/content";
import { serializeRichText } from "./serialize";

// Payload API Response Types
export interface PayloadResponse<T> {
  docs: T[];
  totalDocs: number;
  limit: number;
  totalPages: number;
  page?: number;
  pagingCounter?: number;
  hasPrevPage?: boolean;
  hasNextPage?: boolean;
  prevPage?: number | null;
  nextPage?: number | null;
}

// Media relationship type
export interface PayloadMedia {
  id: string;
  url: string;
  filename?: string;
  mimeType?: string;
  filesize?: number;
  width?: number;
  height?: number;
}

// Category relationship type
export interface PayloadCategory {
  id: string;
  name: string;
  slug: string;
}

// Author relationship type
export interface PayloadAuthor {
  id: string;
  name: string;
  slug: string;
  avatar?: PayloadMedia | string;
  bio?: string;
}

// Tag relationship type
export interface PayloadTag {
  id: string;
  name: string;
  slug: string;
}

// Navigation menu item
export interface PayloadNavigationItem {
  id: string;
  label: string;
  type: "internal" | "external";
  path: string;
  openInNewTab?: boolean;
  children?: PayloadNavigationItem[];
}

// Navigation global structure
export interface PayloadNavigation {
  mainMenu: PayloadNavigationItem[];
  footerMenu: Array<{
    id: string;
    groupTitle: string;
    links: Array<{
      id: string;
      label: string;
      type: "internal" | "external";
      path: string;
    }>;
  }>;
}

// Podcast collection
export interface PayloadPodcast {
  id: string;
  slug: string;
  title: string;
  trackNumber?: number;
  duration?: number;
  audioUrl?: string;
  genre?: string;
  description?: string;
  publishedAt: string;
  chapters?: Array<{ title: string; timestamp: string }>;
  guests?: Array<{ name: string; role?: string }>;
  tags?: Array<{ tag: PayloadTag }>;
  createdAt: string;
  updatedAt: string;
  _status?: "draft" | "published";
}

// Daily Briefing collection
export interface PayloadDailyBriefing {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  content?: any; // RichText/HTML
  executiveSummary?: string;
  briefingDate: string;
  articleCount?: number;
  sourceArticles?: Array<{ article: PayloadGundem | PayloadHikayeler }>;
  keyMetrics?: Record<string, any>;
  priorityBreakdown?: Array<{ category: string; count: number }>;
  focusSectors?: string[];
  regions?: string[];
  spotlightProfile?: {
    name: string;
    role?: string;
    image?: PayloadMedia;
  };
  imageUrl?: string;
  podcastUrl?: string;
  isFeatured?: boolean;
  status?: "draft" | "published";
  readTime?: number;
  createdAt: string;
  updatedAt: string;
}

// Curation collection
export interface PayloadCuration {
  id: string;
  slug: string;
  title: string; // Made required based on typical usage, though marked optional in previous read
  content?: any;
  seoDescription?: string;
  mergedArticles?: string;
  mainImageLandscape?: PayloadMedia | string;
  tags?: string;

  // Business Analysis
  keyHighlights?: string;
  businessImplications?: string;
  strategicRecommendations?: string;
  riskFactors?: string;
  classificationSector?: string;
  classificationGeography?: string;
  metrics?: any;
  competitiveIntelligence?: any;
  fourPillarClassification?: any;

  // Podcast
  podcastUrl?: string;

  // News Digest
  newsSummary?: string;
  keyPoints?: any;
  whyItMatters?: string;
  dailyDigestGeneratedAt?: string;
  dailyDigestVersion?: string;
  newsPodcastUrl?: string;

  // Executive Daily Digest
  executiveDailyDigest?: string;
  executiveDigest?: string;
  newsKeyPoints?: any;
  heroTitle?: string;
  heroSubtitle?: string;

  // Scoring
  impactScoreSkor?: number;
  opportunityScore?: number;
  confidenceScore?: number;
  riskLevel?: 'low' | 'medium' | 'high' | 'critical';
  trendStrength?: number;
  relevanceCategory?: string;
  newsletterSection?: string;
  includeInNewsletter?: 'yes' | 'no' | 'pending';
  scoringRationale?: string;
  scoringDate?: string;

  // Additional
  imageUrl?: string;
  name?: string;
  companyId?: 'yildiz-ventures' | 'scrolli' | 'alaraai';
  status?: 'draft' | 'published' | 'sent' | 'archived';
  publishedAt?: string;

  createdAt: string;
  updatedAt: string;
}

// Site Settings global structure
export interface PayloadSiteSettings {
  id: string;
  siteName: string;
  siteDescription: string;
  defaultLanguage: string;
  socialLinks: {
    twitter?: string;
    facebook?: string;
    instagram?: string;
    linkedin?: string;
    youtube?: string;
  };
  defaultSEO: {
    title: string;
    description: string;
    keywords?: string;
  };
  googleAnalyticsID?: string;
  googleTagManagerID?: string;
  iosApp?: {
    appStoreUrl?: string;
    bundleId?: string;
    minimumVersion?: string;
    deepLinkScheme?: string;
  };
  features: {
    enableComments: boolean;
    enableSharing: boolean;
    enableBookmarks: boolean;
    enablePodcasts: boolean;
    enableAIContent: boolean;
    maintenanceMode: boolean;
  };
  subscription?: {
    monthlyPrice: number;
    yearlyPrice: number;
    currency: string;
    freeArticleLimit: number;
  };
  globalType: "settings";
  createdAt: string;
  updatedAt: string;
}

// Gündem (News/Agenda) Article
export interface PayloadGundem {
  id: string;
  slug: string;
  title: string; // Bilingual field
  titleFullScreen?: string;
  subtitle?: string; // Bilingual field
  content: any; // RichText/HTML - Bilingual field
  summary?: string; // Bilingual field
  category: PayloadCategory | string;
  source: "Gündem";
  featuredImage?: PayloadMedia | string;
  mobileImage?: PayloadMedia | string;
  thumbnail?: PayloadMedia | string;
  thumbnailRSS?: PayloadMedia | string;
  mainVideo?: string;
  galleryImages?: Array<{ image: PayloadMedia }>;
  tags?: Array<{ tag: PayloadTag }>;
  relatedArticles?: Array<{
    relationTo: "gundem" | "hikayeler" | "alaraai";
    value: string | PayloadGundem | PayloadHikayeler | PayloadAlaraai;
  }>;
  seoTitle?: string;
  seoDescription?: string;
  readTime?: number;
  author?: PayloadAuthor | string;
  publishedAt: string;
  isFeatured?: boolean;
  ordering?: number;
  layoutPosition?: "auto" | "hero" | "editors-picks" | "exclude"; // Manual homepage positioning
  createdAt: string;
  updatedAt: string;
}

/**
 * Alara AI Collection Article
 */
export interface PayloadAlaraai extends Omit<PayloadGundem, "source" | "relatedArticles"> {
  source: "Alara AI";
  relatedArticles?: Array<{
    relationTo: "gundem" | "hikayeler" | "alaraai";
    value: string | PayloadGundem | PayloadHikayeler | PayloadAlaraai;
  }>;
}

// Hikayeler (Stories) Article
export interface PayloadHikayeler {
  id: string;
  slug: string;
  title: string; // Bilingual field
  subtitle?: string; // Bilingual field
  content?: any; // RichText/HTML - Bilingual field
  inlineScript?: string | { tr?: string; en?: string }; // Incoming field from CMS
  inlineScriptHtml?: string | { tr?: string; en?: string }; // Inline script HTML from external CMS system (localized)
  summary?: string; // Bilingual field (HTML format)
  source: "Hikayeler";
  featuredImage?: PayloadMedia | string;
  thumbnail?: PayloadMedia | string;
  verticalImage?: PayloadMedia | string;
  galleryImages?: Array<{ image: PayloadMedia }>;
  tags?: Array<{ tag: PayloadTag }>;
  relatedStories?: Array<{
    relationTo: "hikayeler";
    value: string | PayloadHikayeler;
  }>;
  readTime?: number;
  author?: PayloadAuthor | string;
  publishedAt: string;
  isFeatured?: boolean;
  isCollab?: boolean;
  ordering?: number;
  layoutPosition?: "auto" | "hero" | "editors-picks" | "exclude"; // Manual homepage positioning
  createdAt: string;
  updatedAt: string;
}

// Helper function to extract media URL
export function getMediaUrl(
  media: PayloadMedia | string | undefined
): string | undefined {
  if (!media) {
    return undefined;
  }
  if (typeof media === "string") {
    return media;
  }
  return media.url;
}

// Helper function to get responsive image URLs
// Returns desktop and mobile image URLs for responsive display
export function getResponsiveImageUrl(post: PayloadGundem | PayloadHikayeler): {
  desktop: string | undefined;
  mobile: string | undefined;
} {
  const desktop = getMediaUrl(post.featuredImage || post.thumbnail);

  let mobile: string | undefined;
  if (post.source === "Gündem") {
    // Gündem uses mobileImage
    mobile = getMediaUrl((post as PayloadGundem).mobileImage);
  } else if (post.source === "Hikayeler") {
    // Hikayeler uses verticalImage
    mobile = getMediaUrl((post as PayloadHikayeler).verticalImage);
  }

  // Fallback to desktop image if mobile variant not available
  return {
    desktop,
    mobile: mobile || desktop,
  };
}

// Helper function to extract author name
function getAuthorName(author: PayloadAuthor | string | undefined): string {
  if (!author) return "Scrolli";
  if (typeof author === "string") return author;
  return author.name;
}

// Helper function to extract category slug
function getCategorySlug(category: PayloadCategory | string): string {
  if (typeof category === "string") return category;
  return category.slug;
}

// Map Payload Gündem to existing Article interface
export function mapGundemToArticle(post: PayloadGundem | PayloadAlaraai): Article {
  const desktopImage = getMediaUrl(post.featuredImage || post.thumbnail);
  const mobileImage = getMediaUrl(post.mobileImage);

  // Handle content - Payload may return Lexical JSON or HTML string
  // When using locale=tr, content should be HTML string, but may also be localized object
  let content: string | undefined;
  if (post.content) {
    // Handle localized content object (e.g., {tr: {...}, en: {...}})
    if (
      typeof post.content === "object" &&
      post.content !== null &&
      !Array.isArray(post.content)
    ) {
      // 1. Direct Lexical format (root object) - check this FIRST for collections like alaraai
      if ("root" in post.content) {
        const serialized = serializeRichText(post.content);
        content = serialized.trim() || undefined;
      }
      // 2. Localized content object (e.g., {tr: {...}, en: {...}})
      else if ("tr" in post.content) {
        const trContent = post.content.tr;
        // If tr is a string, use it directly
        if (typeof trContent === "string") {
          content = trContent.trim() || undefined;
        }
        // If tr is an object (Lexical format), serialize it
        else if (
          trContent &&
          typeof trContent === "object" &&
          !Array.isArray(trContent)
        ) {
          if ("root" in trContent || Array.isArray(trContent)) {
            const serialized = serializeRichText(trContent);
            content = serialized.trim() || undefined;
          }
        }
        // If tr is an array (Lexical format), serialize it
        else if (Array.isArray(trContent) && trContent.length > 0) {
          const serialized = serializeRichText(trContent);
          content = serialized.trim() || undefined;
        }
      } else if ("en" in post.content && typeof post.content.en === "string") {
        content = post.content.en.trim() || undefined;
      } else if ("root" in post.content || Array.isArray(post.content)) {
        // Handle Lexical format with root.children structure (direct format)
        const serialized = serializeRichText(post.content);
        content = serialized.trim() || undefined;
      }
    } else if (typeof post.content === "string") {
      // Direct HTML string (when using locale=tr)
      content = post.content.trim() || undefined;
    } else if (Array.isArray(post.content)) {
      // Direct array (Slate/Lexical array format)
      if (post.content.length > 0) {
        const serialized = serializeRichText(post.content);
        content = serialized.trim() || undefined;
      }
    }
  }

  const thumbnailImage = getMediaUrl(post.thumbnail || post.featuredImage);

  const article = {
    id: post.slug || post.id,
    title: post.title,
    subtitle: post.subtitle, // Subtitle from Payload CMS
    author: getAuthorName(post.author),
    category: getCategorySlug(post.category),
    date: new Date(post.publishedAt).toLocaleDateString("tr-TR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
    readTime: post.readTime ? `${post.readTime} min read` : "5 min read",
    image: desktopImage || undefined, // Desktop/primary (featured) image — hero, single
    thumbnail: thumbnailImage || undefined, // Thumbnail for grids (thumbnail first, fallback featured)
    mobileImage: mobileImage || undefined, // Mobile image variant
    excerpt: post.summary,
    isPremium: false, // Add to Payload schema if needed
    tag: post.tags?.[0]?.tag?.name,
    seoTitle: post.seoTitle,
    seoDescription: post.seoDescription,
    content: content, // HTML content (string) or undefined
  };

  return article;
}

// Map Payload Hikayeler to existing Article interface
export function mapHikayelerToArticle(post: PayloadHikayeler): Article {
  const desktopImage = getMediaUrl(post.featuredImage || post.thumbnail);
  const mobileImage = getMediaUrl(post.verticalImage); // Hikayeler uses verticalImage

  // Extract inlineScriptHtml separately - this is the primary way to show hikayeler articles
  // Handle legacy field "inlineScript" if "inlineScriptHtml" is missing
  let inlineScriptHtml: string | undefined;
  const rawScript = post.inlineScriptHtml || post.inlineScript;

  if (rawScript) {
    // Handle both localized object format {tr: string} and plain string
    if (typeof rawScript === "string") {
      inlineScriptHtml = rawScript.trim() || undefined;
    } else if (
      typeof rawScript === "object" &&
      rawScript !== null
    ) {
      // Handle localized object format {tr?: string, en?: string}
      if ("tr" in rawScript && rawScript.tr) {
        inlineScriptHtml =
          typeof rawScript.tr === "string"
            ? rawScript.tr.trim()
            : undefined;
      } else if ("en" in rawScript && rawScript.en) {
        inlineScriptHtml =
          typeof rawScript.en === "string"
            ? rawScript.en.trim()
            : undefined;
      }
    }
  }

  // Ensure inlineScriptHtml is not empty string
  if (inlineScriptHtml && inlineScriptHtml.trim().length === 0) {
    inlineScriptHtml = undefined;
  }

  // Always process regular content when present (so full article body is available
  // even when inlineScriptHtml exists but is partial or hero-only)
  let content: string | undefined;
  if (post.content) {
    // Handle localized content object (e.g., {tr: "...", en: "..."})
    if (
      typeof post.content === "object" &&
      post.content !== null &&
      !Array.isArray(post.content)
    ) {
      // Check if it's a localized object
      if ("tr" in post.content && typeof post.content.tr === "string") {
        content = post.content.tr.trim() || undefined;
      } else if ("en" in post.content && typeof post.content.en === "string") {
        content = post.content.en.trim() || undefined;
      } else if ("root" in post.content || Array.isArray(post.content)) {
        // Handle Lexical format with root.children structure
        const serialized = serializeRichText(post.content, post.title);
        content = serialized.trim() || undefined;
      }
    } else if (typeof post.content === "string") {
      // Direct HTML string (when using locale=tr)
      content = post.content.trim() || undefined;
    } else if (Array.isArray(post.content) && post.content.length > 0) {
      // Import serializeRichText to handle Lexical format
      const serialized = serializeRichText(post.content, post.title);
      content = serialized.trim() || undefined;
    }
  }

  const thumbnailImage = getMediaUrl(post.thumbnail || post.featuredImage);

  return {
    id: post.slug || post.id,
    title: post.title,
    subtitle: post.subtitle, // Subtitle from Payload CMS
    author: getAuthorName(post.author),
    category: "hikayeler", // Stories category
    date: new Date(post.publishedAt).toLocaleDateString("tr-TR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
    readTime: post.readTime ? `${post.readTime} min read` : "5 min read",
    image: desktopImage || undefined, // Desktop/primary (featured) image — hero, single
    thumbnail: thumbnailImage || undefined, // Thumbnail for grids (thumbnail first, fallback featured)
    mobileImage: mobileImage || undefined, // Mobile/vertical image variant
    excerpt: post.summary,
    isPremium: false,
    content: content, // Full article body (always set when post.content exists)
    inlineScriptHtml: inlineScriptHtml, // Inline script HTML from external CMS (primary for hikayeler)
  };
}

// Map Payload Curation to Article
export function mapCurationToArticle(curation: PayloadCuration): Article {
  const image = getMediaUrl(curation.mainImageLandscape);

  // Process content similar to Gundem if needed, but for now assuming it might be string or simple
  let content: string | undefined;
  if (curation.content) {
    if (typeof curation.content === "string") {
      content = curation.content;
    } else {
      // Fallback for complex content if needed, leveraging serialize like others
      try {
        content = serializeRichText(curation.content);
      } catch (e) {
        console.warn("Failed to serialize curation content", e);
      }
    }
  }

  return {
    id: curation.slug || curation.id,
    title: curation.title || "Untitled Curation",
    subtitle: curation.heroSubtitle,
    author: "Editor", // Curations are usually by the editor/platform
    category: "Curation",
    date: curation.publishedAt
      ? new Date(curation.publishedAt).toLocaleDateString("tr-TR", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
      : "",
    readTime: "3 min read", // Estimate or fallback
    image: image || undefined,
    thumbnail: image || undefined,
    excerpt: curation.newsSummary || curation.seoDescription,
    isPremium: false,
    content: content,
  };
}

// Map Payload DailyBriefing to Article
export function mapDailyBriefingToArticle(
  briefing: PayloadDailyBriefing
): Article {
  let content: string | undefined;
  if (briefing.content) {
    if (typeof briefing.content === "string") {
      content = briefing.content;
    } else {
      try {
        const { serializeRichText } = require("./serialize");
        content = serializeRichText(briefing.content);
      } catch (e) {
        console.warn("Failed to serialize daily briefing content", e);
      }
    }
  }

  return {
    id: briefing.slug || briefing.id,
    title: briefing.title,
    subtitle: briefing.subtitle,
    author: "Scrolli Daily",
    category: "Daily Briefing",
    date: new Date(briefing.briefingDate).toLocaleDateString("tr-TR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
    readTime: briefing.readTime ? `${briefing.readTime} min read` : "5 min read",
    image: briefing.imageUrl,
    thumbnail: briefing.imageUrl,
    excerpt: briefing.executiveSummary,
    isPremium: false,
    content: content,
  };
}
