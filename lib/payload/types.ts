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
  url?: string;
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
      url?: string;
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
  contactInfo?: {
    email?: string;
    phone?: string;
    address?: string;
  };
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

// UI Strings global
export interface PayloadUIString {
  key: string;
  value: string;
}

// Pages collection
export interface PayloadPage {
  id: string;
  title: string;
  slug: string;
  content: any; // RichText
  meta?: {
    title?: string;
    description?: string;
    keywords?: string;
    image?: PayloadMedia | string;
  };
  publishedAt: string;
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
  collection: "gundem";
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
export interface PayloadAlaraai extends Omit<PayloadGundem, "source" | "collection" | "relatedArticles"> {
  source: "Alara AI";
  collection: "alaraai";
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
  collection: "hikayeler";
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

// Collabs Article
export interface PayloadCollab {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  content?: any;
  summary?: string;
  source: "Collabs";
  collection: "collabs";
  featuredImage?: PayloadMedia | string;
  thumbnail?: PayloadMedia | string;
  verticalImage?: PayloadMedia | string;
  galleryImages?: Array<{ image: PayloadMedia }>;
  tags?: Array<{ tag: PayloadTag }>;
  relatedArticles?: Array<{
    relationTo: "gundem" | "hikayeler" | "alaraai" | "collabs" | "stories";
    value: string | PayloadGundem | PayloadHikayeler | PayloadAlaraai | PayloadCollab | PayloadStory;
  }>;
  readTime?: number;
  author?: PayloadAuthor | string;
  publishedAt: string;
  isFeatured?: boolean;
  isCollab?: boolean; // May still exist for backward compatibility or explicit marking
  ordering?: number;
  layoutPosition?: "auto" | "hero" | "editors-picks" | "exclude";
  createdAt: string;
  updatedAt: string;
}

// Stories Article
export interface PayloadStory {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  content?: any;
  inlineScript?: string | { tr?: string; en?: string };
  inlineScriptHtml?: string | { tr?: string; en?: string };
  summary?: string;
  source: "Stories";
  collection: "stories";
  featuredImage?: PayloadMedia | string;
  thumbnail?: PayloadMedia | string;
  verticalImage?: PayloadMedia | string;
  galleryImages?: Array<{ image: PayloadMedia }>;
  tags?: Array<{ tag: PayloadTag }>;
  relatedStories?: Array<{
    relationTo: "hikayeler" | "stories";
    value: string | PayloadHikayeler | PayloadStory;
  }>;
  readTime?: number;
  author?: PayloadAuthor | string;
  publishedAt: string;
  isFeatured?: boolean;
  isCollab?: boolean;
  ordering?: number;
  layoutPosition?: "auto" | "hero" | "editors-picks" | "exclude";
  createdAt: string;
  updatedAt: string;
}

/** Payload CMS Video type — maps to the `videos` collection */
export interface PayloadVideo {
  id: string;
  slug: string;
  title: string;
  videoUrl: string;
  thumbnail?: PayloadMedia | string;
  description?: string;
  overlayText?: {
    location?: string;
    date?: string;
    quote?: string;
    source?: string;
    author?: string;
    role?: string;
  };
  ordering?: number;
  isFeatured?: boolean;
  publishedAt: string;
  tags?: Array<{ tag: string }>;
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
  const rawUrl = typeof media === "string" ? media : media.url;
  if (!rawUrl) return undefined;

  // Return the URL as-is from the CMS — do NOT normalize %25 encoding.
  // Azure Blob Storage filenames may contain literal '%20' characters,
  // which must remain as '%2520' in the URL (the '%' itself is encoded).
  return rawUrl;
}

// Helper function to get responsive image URLs
// Returns desktop and mobile image URLs for responsive display
export function getResponsiveImageUrl(post: PayloadGundem | PayloadHikayeler | PayloadCollab | PayloadStory): {
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
  } else if (post.source === "Stories") {
    // Stories uses verticalImage
    mobile = getMediaUrl((post as PayloadStory).verticalImage);
  } else if (post.source === "Collabs") {
    // Collabs uses verticalImage if available, otherwise mobileImage or fallback
    mobile = getMediaUrl((post as PayloadCollab).verticalImage) || getMediaUrl(post.featuredImage);
  }

  // Fallback to desktop image if mobile variant not available
  return {
    desktop,
    mobile: mobile || desktop,
  };
}

// Helper function to extract author name
function getAuthorName(author: PayloadAuthor | string | null | undefined): string {
  if (!author) return "Scrolli";
  if (typeof author === "string") return author;
  // Payload relationship may be an object with name
  if (typeof author === "object" && "name" in author && author.name) {
    return author.name;
  }
  return "Scrolli";
}

// Helper function to extract author slug for URL linking
function getAuthorSlug(author: PayloadAuthor | string | null | undefined): string | undefined {
  if (!author) return undefined;
  if (typeof author === "string") return undefined; // Raw string ID — slug not available
  if (typeof author === "object" && "slug" in author && author.slug) {
    return author.slug;
  }
  return undefined;
}

// Helper function to extract category slug
function getCategorySlug(category?: PayloadCategory | string | null): string {
  if (!category) return "news";
  if (typeof category === "string") return category;
  return category.slug || "news";
}

// Helper function to clean messy content (e.g. raw CSS/HTML from Instorier)
function cleanMessyContent(contentObj: any): any | undefined {
  try {
    if (
      !contentObj ||
      !contentObj.root ||
      !contentObj.root.children ||
      !Array.isArray(contentObj.root.children)
    ) {
      return contentObj;
    }

    const newChildren = contentObj.root.children.filter((child: any) => {
      if (child.children && child.children.length > 0) {
        const firstChild = child.children[0];
        if (firstChild && typeof firstChild.text === "string") {
          const text = firstChild.text.trim();
          if (
            text.startsWith("@font-face") ||
            text.includes(".ibG8wLku-container")
          ) {
            return false;
          }
        }
      }
      return true;
    });

    if (newChildren.length === 0) {
      return undefined;
    }

    return {
      ...contentObj,
      root: {
        ...contentObj.root,
        children: newChildren,
      },
    };
  } catch (e) {
    console.error("Error cleaning messy content:", e);
    return contentObj; // Return original if cleaning fails
  }
}

// Map Payload Gündem to existing Article interface
export function mapGundemToArticle(post: PayloadGundem | PayloadAlaraai, locale: string = "tr"): Article {
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
        const cleaned = cleanMessyContent(post.content);
        if (cleaned) {
          const serialized = serializeRichText(cleaned);
          content = serialized.trim() || undefined;
        }
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
            const cleaned = cleanMessyContent(trContent);
            if (cleaned) {
              const serialized = serializeRichText(cleaned);
              content = serialized.trim() || undefined;
            }
          }
        }
        // If tr is an array (Lexical format), serialize it
        else if (Array.isArray(trContent) && trContent.length > 0) {
          const serialized = serializeRichText(trContent);
          content = serialized.trim() || undefined;
        }
      } else if ("en" in post.content) {
        const enContent = post.content.en;
        if (typeof enContent === "string") {
          content = enContent.trim() || undefined;
        } else if (
          enContent &&
          typeof enContent === "object" &&
          ("root" in enContent || Array.isArray(enContent))
        ) {
          const cleaned = cleanMessyContent(enContent);
          if (cleaned) {
            const serialized = serializeRichText(cleaned);
            content = serialized.trim() || undefined;
          }
        }
      } else if ("root" in post.content || Array.isArray(post.content)) {
        // Handle Lexical format with root.children structure (direct format)
        const cleaned = cleanMessyContent(post.content);
        if (cleaned) {
          const serialized = serializeRichText(cleaned);
          content = serialized.trim() || undefined;
        }
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
    authorSlug: getAuthorSlug(post.author),
    category: getCategorySlug(post.category),
    date: new Date(post.publishedAt).toLocaleDateString(locale === "tr" ? "tr-TR" : "en-US", {
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
export function mapHikayelerToArticle(post: PayloadHikayeler, locale: string = "tr"): Article {
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
      // Handle Lexical rich text JSON format: { root: { children: [{ children: [{ text: "URL" }] }] } }
      // The CMS stores the Instorier URL as plain text inside a Lexical paragraph node
      if (!inlineScriptHtml && "root" in rawScript) {
        try {
          const extractedTexts: string[] = [];
          const extractText = (node: any): void => {
            if (node.text && typeof node.text === "string") {
              extractedTexts.push(node.text.trim());
            }
            if (Array.isArray(node.children)) {
              node.children.forEach(extractText);
            }
          };
          extractText(rawScript.root);

          // Join all extracted text and check if it contains an Instorier URL
          const fullText = extractedTexts.join(" ").trim();
          if (fullText) {
            // If it's already HTML (contains script tags), use as-is
            if (fullText.includes("<script")) {
              inlineScriptHtml = fullText;
            }
            // If it's a plain Instorier CDN URL, wrap it in a script tag
            else if (fullText.includes("instorier") && fullText.includes(".js")) {
              // Extract the URL (handle case where text might have extra whitespace)
              const urlMatch = fullText.match(/(https?:\/\/[^\s]+\.js)/);
              if (urlMatch) {
                inlineScriptHtml = `<script src="${urlMatch[1]}"></script>`;
              }
            }
            // If it contains any URL ending in .js, treat it as a script source
            else if (fullText.match(/^https?:\/\/.*\.js$/)) {
              inlineScriptHtml = `<script src="${fullText}"></script>`;
            }
          }
        } catch (e) {
          console.error("Error extracting inlineScript from Lexical JSON:", e);
        }
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
      if ("tr" in post.content) {
        const trContent = post.content.tr;
        if (typeof trContent === "string") {
          content = trContent.trim() || undefined;
        } else if (
          trContent &&
          typeof trContent === "object" &&
          ("root" in trContent || Array.isArray(trContent))
        ) {
          // Handle Lexical format inside localized field
          const cleaned = cleanMessyContent(trContent);
          if (cleaned) {
            const serialized = serializeRichText(cleaned, post.title);
            content = serialized.trim() || undefined;
          }
        }
      } else if ("en" in post.content) {
        const enContent = post.content.en;
        if (typeof enContent === "string") {
          content = enContent.trim() || undefined;
        } else if (
          enContent &&
          typeof enContent === "object" &&
          ("root" in enContent || Array.isArray(enContent))
        ) {
          const cleaned = cleanMessyContent(enContent);
          if (cleaned) {
            const serialized = serializeRichText(cleaned, post.title);
            content = serialized.trim() || undefined;
          }
        }
      } else if ("root" in post.content || Array.isArray(post.content)) {
        // Handle Lexical format with root.children structure
        const cleaned = cleanMessyContent(post.content);
        if (cleaned) {
          const serialized = serializeRichText(cleaned, post.title);
          content = serialized.trim() || undefined;
        }
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
    authorSlug: getAuthorSlug(post.author),
    category: "hikayeler", // Stories category
    date: new Date(post.publishedAt).toLocaleDateString(locale === "tr" ? "tr-TR" : "en-US", {
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
export function mapCurationToArticle(curation: PayloadCuration, locale: string = "tr"): Article {
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
      ? new Date(curation.publishedAt).toLocaleDateString(locale === "tr" ? "tr-TR" : "en-US", {
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

// Map Payload Collab to Article
export function mapCollabToArticle(post: PayloadCollab, locale: string = "tr"): Article {
  // Reuse Hikayeler logic as Collabs structure is similar
  // Cast to Hikayeler to reuse the function, but override source/category
  const article = mapHikayelerToArticle(post as unknown as PayloadHikayeler, locale);

  return {
    ...article,
    category: "collabs", // Override category
    isCollab: true,
  };
}

// Map Payload Story to Article
export function mapStoryToArticle(post: PayloadStory, locale: string = "tr"): Article {
  // Reuse Hikayeler logic as Stories structure is identical (with inlineScript)
  const article = mapHikayelerToArticle(post as unknown as PayloadHikayeler, locale);

  return {
    ...article,
    category: "stories", // Override category
  };
}

/**
 * Map Payload DailyBriefing to Article
 */
export function mapDailyBriefingToArticle(
  briefing: PayloadDailyBriefing,
  locale: string = "tr"
): Article {
  let content: string | undefined;
  if (briefing.content) {
    if (typeof briefing.content === "string") {
      content = briefing.content;
    } else {
      try {
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
    date: new Date(briefing.briefingDate).toLocaleDateString(locale === "tr" ? "tr-TR" : "en-US", {
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
