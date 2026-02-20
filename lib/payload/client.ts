import {
  PayloadResponse,
  PayloadGundem,
  PayloadHikayeler,
  PayloadCollab,
  PayloadStory,
  PayloadCategory,
  PayloadAuthor,
  PayloadTag,
  PayloadNavigation,
  PayloadSiteSettings,
  PayloadPodcast,
  PayloadDailyBriefing,
  PayloadCuration,
  PayloadAlaraai,
  PayloadVideo,
} from "./types";

// --- Sub-Second Mastery: Cache & Request Collapsing ---
const MEMORY_CACHE = new Map<string, { data: any; timestamp: number }>();
const PENDING_REQUESTS = new Map<string, Promise<any>>();
const CACHE_TTL = 30 * 1000; // 30 seconds memory TTL

// Cache disabled in development for faster testing
const IS_DEV = process.env.NODE_ENV === "development";

/**
 * Utility to handle request collapsing and in-memory caching
 */
async function withCache<T>(key: string, fetcher: () => Promise<T>): Promise<T> {
  // 1. Check Memory Cache
  if (!IS_DEV) {
    const cached = MEMORY_CACHE.get(key);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return cached.data;
    }
  }

  // 2. Check Pending Requests (Collapsing)
  const pending = PENDING_REQUESTS.get(key);
  if (pending) {
    return pending;
  }

  // 3. Execute and store
  if (!IS_DEV) {
    const promise = fetcher().then(data => {
      MEMORY_CACHE.set(key, { data, timestamp: Date.now() });
      PENDING_REQUESTS.delete(key);
      return data;
    }).catch(err => {
      PENDING_REQUESTS.delete(key);
      throw err;
    });

    PENDING_REQUESTS.set(key, promise);
    return promise;
  }

  return fetcher();
}
// ------------------------------------------------------

// Get environment variables - only available on server
// On client or when env vars are missing (e.g. Vercel build/runtime before env is set), return null
// so pages can render with empty/fallback content instead of 500.
export function getPayloadConfig() {
  const PAYLOAD_API_URL = process.env.PAYLOAD_API_URL;
  const PAYLOAD_API_KEY = process.env.PAYLOAD_API_KEY;

  if (!PAYLOAD_API_URL || !PAYLOAD_API_KEY) {
    // Enhanced logging for debugging production issues
    console.error("❌ Payload CMS Configuration Missing:", {
      hasUrl: !!PAYLOAD_API_URL,
      hasKey: !!PAYLOAD_API_KEY,
      nodeEnv: process.env.NODE_ENV,
      urlLength: PAYLOAD_API_URL ? PAYLOAD_API_URL.length : 0,
    });
    return null;
  }

  // Normalize URL: no trailing slash (avoid double slashes in path, e.g. /api//gundem)
  const baseUrl = PAYLOAD_API_URL.replace(/\/+$/, "");

  return {
    url: baseUrl,
    key: PAYLOAD_API_KEY,
    headers: {
      Authorization: `Bearer ${PAYLOAD_API_KEY}`,
      "Content-Type": "application/json",
    },
  };
}

// Feature flag: Enable layoutPosition field when it's added to Payload CMS
// Set to true when layoutPosition field exists in Gündem and Hikayeler collections
const ENABLE_LAYOUT_POSITION = process.env.ENABLE_LAYOUT_POSITION === "true";

interface FetchParams {
  layoutPosition?: string;
  sort?: string;
  limit?: number;
  page?: number;
  where?: Record<string, any>;
  depth?: number;
  collections?: Array<"gundem" | "hikayeler" | "alaraai" | "collabs" | "stories">;
}

/**
 * Build query string from FetchParams
 */
function buildQueryString(params: FetchParams): string {
  const queryParams = new URLSearchParams();

  // CRITICAL: Always add Turkish locale for Turkish content (can be overridden by env var)
  const locale = process.env.PAYLOAD_LOCALE || "tr";
  queryParams.append("locale", locale);

  // Exclude drafts by default, but allow enabling for preview/test purposes
  const fetchDrafts = process.env.PAYLOAD_FETCH_DRAFTS === "true";
  queryParams.append("draft", fetchDrafts ? "true" : "false");
  queryParams.append("trash", "false");

  // Handle layoutPosition as direct parameter (converts to where clause)
  // Only if feature flag is enabled (field exists in Payload CMS)
  if (ENABLE_LAYOUT_POSITION && params.layoutPosition) {
    queryParams.append("where[layoutPosition][equals]", params.layoutPosition);
  }

  // DEFAULT SORT: Always sort by publishedAt descending unless specified otherwise
  // This ensures we get the latest content when hitting limits
  const sort = params.sort || "-publishedAt";
  queryParams.append("sort", sort);
  if (params.limit) {
    queryParams.append("limit", String(params.limit));
  }
  if (params.page) {
    queryParams.append("page", String(params.page));
  }
  if (params.depth) {
    queryParams.append("depth", String(params.depth));
  }

  // Build complex where queries
  if (params.where) {
    Object.entries(params.where).forEach(([key, value]) => {
      // Handle nested keys like "category.slug"
      const normalizedKey = key.replace(/\./g, "][");

      if (
        typeof value === "object" &&
        !Array.isArray(value) &&
        value !== null
      ) {
        // Nested operators like { equals: 'value' } or { not_equals: 'value' } or { not_in: [...] }
        Object.entries(value).forEach(([operator, val]) => {
          if (Array.isArray(val)) {
            // For arrays, Payload expects comma-separated or JSON array
            queryParams.append(
              `where[${normalizedKey}][${operator}]`,
              val.join(","),
            );
          } else {
            queryParams.append(
              `where[${normalizedKey}][${operator}]`,
              String(val),
            );
          }
        });
      } else if (Array.isArray(value)) {
        queryParams.append(`where[${normalizedKey}]`, value.join(","));
      } else {
        queryParams.append(`where[${normalizedKey}]`, String(value));
      }
    });
  }

  return queryParams.toString();
}

/**
 * Fetch from both gundem and hikayeler collections and merge results
 * This is the primary function for getting articles
 */
export async function fetchArticles(
  params: FetchParams = {},
): Promise<Array<PayloadGundem | PayloadHikayeler | PayloadAlaraai | PayloadCollab | PayloadStory>> {
  const cacheKey = `articles:${JSON.stringify(params)}`;
  return withCache(cacheKey, () => fetchArticlesInternal(params));
}

async function fetchArticlesInternal(
  params: FetchParams = {},
): Promise<Array<PayloadGundem | PayloadHikayeler | PayloadAlaraai | PayloadCollab | PayloadStory>> {
  try {
    const config = getPayloadConfig();
    if (!config) {
      console.warn("Payload CMS not configured, returning empty array");
      return [];
    }

    const queryString = buildQueryString(params);
    const fullQuery = queryString;

    // Revalidation strategy: 30 seconds for articles (faster new article discovery)
    // Navigation and site settings use longer revalidation (1 hour) as they change less frequently
    const targetCollections = params.collections || ["gundem", "hikayeler", "alaraai", "collabs", "stories"];

    const fetchPromises = targetCollections.map(collection =>
      fetch(`${config.url}/${collection}?${fullQuery}`, {
        headers: config.headers,
        next: { revalidate: 30 },
      })
    );

    const settledResults = await Promise.allSettled(fetchPromises);
    const results: Array<PayloadGundem | PayloadHikayeler | PayloadAlaraai | PayloadCollab | PayloadStory> = [];
    let anySuccess = false;

    for (let i = 0; i < targetCollections.length; i++) {
      const collection = targetCollections[i];
      const result = settledResults[i];

      if (result.status === "fulfilled" && result.value.ok) {
        try {
          const data = await result.value.json();
          let docs = [];
          if (data.success && Array.isArray(data.data)) {
            docs = data.data;
          } else if (Array.isArray(data?.docs)) {
            docs = data.docs;
          }

          const sourceMap: Record<string, string> = {
            gundem: "Gündem",
            hikayeler: "Hikayeler",
            alaraai: "Alara AI",
            collabs: "Collabs",
            stories: "Stories"
          };

          const withSource = docs.map((doc: any) => ({
            ...doc,
            source: (sourceMap[collection] || collection) as any,
            collection: collection as any,
          }));
          results.push(...withSource);
          anySuccess = true;
        } catch (error) {
          console.error(`Error parsing ${collection} response:`, error);
        }
      } else if (result.status === "rejected") {
        console.warn(`Failed to fetch ${collection}:`, result.reason);
      } else if (result.status === "fulfilled") {
        console.warn(`Failed to fetch ${collection}: ${result.value.status} ${result.value.statusText}`);
      }
    }

    // If all failed and we had target collections, log it
    if (!anySuccess && targetCollections.length > 0) {
      console.warn("Payload CMS unavailable: All requested collections failed to load");
      return [];
    }

    // Merge and sort by publishedAt descending (with defensive check)
    const articles = results.sort((a, b) => {
      const dateA = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
      const dateB = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
      return dateB - dateA;
    });

    // Client-side deduplication
    const uniqueArticles = new Map<string, PayloadGundem | PayloadHikayeler | PayloadAlaraai | PayloadCollab | PayloadStory>();

    for (const article of articles) {
      const key = article.slug || article.id;
      if (!uniqueArticles.has(key)) {
        uniqueArticles.set(key, article);
      } else {
        // If duplicate exists, keep the one with more recent publishedAt
        const existing = uniqueArticles.get(key)!;
        if (new Date(article.publishedAt) > new Date(existing.publishedAt)) {
          uniqueArticles.set(key, article);
        }
      }
    }

    return Array.from(uniqueArticles.values());
  } catch (error) {
    console.error("Error in fetchArticles:", error);
    // Return empty array instead of throwing to allow graceful degradation
    return [];
  }
}

/**
 * Fetch articles specifically from the Hikayeler collection
 */
export async function fetchHikayeler(
  params: FetchParams = {},
): Promise<PayloadHikayeler[]> {
  try {
    const response = await fetchPayload<PayloadHikayeler>("hikayeler", {
      ...params,
      sort: params.sort || "-publishedAt",
      depth: params.depth || 2,
    });

    return response.docs.map((doc) => ({
      ...doc,
      source: "Hikayeler" as const,
    }));
  } catch (error) {
    console.error("Error fetching Hikayeler articles:", error);
    return [];
  }
}

export async function fetchCollabs(
  params: FetchParams = {},
): Promise<PayloadCollab[]> {
  try {
    const response = await fetchPayload<PayloadCollab>("collabs", {
      ...params,
      sort: params.sort || "-publishedAt",
      depth: params.depth || 2,
    });

    return response.docs.map((doc) => ({
      ...doc,
      source: "Collabs" as const,
    }));
  } catch (error) {
    console.error("Error fetching Collabs articles:", error);
    return [];
  }
}

export async function fetchStories(
  params: FetchParams = {},
): Promise<PayloadStory[]> {
  try {
    const response = await fetchPayload<PayloadStory>("stories", {
      ...params,
      sort: params.sort || "-publishedAt",
      depth: params.depth || 2,
    });

    return response.docs.map((doc) => ({
      ...doc,
      source: "Stories" as const,
    }));
  } catch (error) {
    console.error("Error fetching Stories articles:", error);
    return [];
  }
}

/**
 * Fetch from single collection (for collection-specific queries)
 */
/**
 * Fetch from a single Payload collection with retry logic
 * Retries up to 2 times for transient failures (5xx errors)
 */
function emptyPayloadResponse<T>(): PayloadResponse<T> {
  return { docs: [], totalDocs: 0, limit: 0, totalPages: 0 };
}

export async function fetchPayload<T>(
  collection: string,
  query?: FetchParams,
  retries = 2,
): Promise<PayloadResponse<T>> {
  const cacheKey = `payload:${collection}:${JSON.stringify(query)}`;
  return withCache(cacheKey, () => fetchPayloadInternal<T>(collection, query, retries));
}

async function fetchPayloadInternal<T>(
  collection: string,
  query?: FetchParams,
  retries = 2,
): Promise<PayloadResponse<T>> {
  const config = getPayloadConfig();
  if (!config) {
    return emptyPayloadResponse<T>();
  }

  const queryString = buildQueryString(query || {});
  const url = `${config.url}/${collection}?${queryString}`;

  try {
    const response = await fetch(url, {
      headers: config.headers,
      next: {
        revalidate: 60,
      },
    });

    if (!response.ok) {
      // Retry on server errors (5xx) if retries remaining
      if (response.status >= 500 && retries > 0) {
        console.warn(
          `Payload API error for ${collection} (${response.status}), retrying... (${retries} attempts left)`,
        );
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait 1 second before retry
        return fetchPayload<T>(collection, query, retries - 1);
      }

      const errorText = await response.text().catch(() => "");
      console.error(`Payload API error for ${collection}:`, {
        status: response.status,
        statusText: response.statusText,
        body: errorText.substring(0, 500), // Limit error text length
      });

      // Instead of throwing, return an empty response to prevent server-side crashes
      return emptyPayloadResponse<T>();
    }

    const data = await response.json();

    // Handle wrapped response format: { success: true, data: [...], meta: { ... } }
    if (data.success && Array.isArray(data.data) && data.meta) {
      return {
        docs: data.data,
        ...data.meta,
      };
    }

    // Safety check for malformed JSON that doesn't follow Payload structure
    if (!data || !Array.isArray(data.docs)) {
      console.warn(
        `Payload API for ${collection} returned malformed data:`,
        data,
      );
      return emptyPayloadResponse<T>();
    }

    return data;
  } catch (error) {
    // Retry on network errors if retries remaining
    if (
      retries > 0 &&
      error instanceof Error &&
      error.message.includes("fetch")
    ) {
      console.warn(
        `Network error fetching ${collection}, retrying... (${retries} attempts left)`,
      );
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return fetchPayload<T>(collection, query, retries - 1);
    }
    throw error;
  }
}

/**
 * Helper to strip 13-digit timestamp suffix from a slug
 * Example: "article-slug-1748937114765" -> "article-slug"
 */
function stripArticleTimestamp(slug: string): string {
  // Match suffix like -1748937114765 (exactly 13 digits)
  return slug.replace(/-\d{13}$/, "");
}

// Primary function - fetch from all collections
export async function getArticleBySlug(
  slug: string,
): Promise<PayloadGundem | PayloadHikayeler | PayloadAlaraai | PayloadCollab | PayloadStory | null> {
  try {
    // 1. Try exact match first
    const articles = await fetchArticles({
      where: { slug: { equals: slug } },
      limit: 1,
      depth: 2,
    });

    if (articles[0]) return articles[0];

    // 2. If no match and slug has a timestamp format, try stripping it
    const strippedSlug = stripArticleTimestamp(slug);
    if (strippedSlug !== slug) {
      const fallbackArticles = await fetchArticles({
        where: { slug: { equals: strippedSlug } },
        limit: 1,
        depth: 2,
      });
      return fallbackArticles[0] || null;
    }

    return null;
  } catch (error) {
    console.error(`Error fetching article by slug "${slug}":`, error);
    return null;
  }
}

/**
 * Fetch a single article by ID directly from Payload CMS
 * This is more efficient than searching by slug
 */
export async function getArticleById(
  collection: "gundem" | "hikayeler" | "alaraai" | "collabs" | "stories",
  id: string,
): Promise<PayloadGundem | PayloadHikayeler | PayloadAlaraai | PayloadCollab | PayloadStory | null> {
  try {
    const config = getPayloadConfig();
    if (!config) {
      return null;
    }

    const locale = process.env.PAYLOAD_LOCALE || "tr";
    const fetchDrafts = process.env.PAYLOAD_FETCH_DRAFTS === "true";

    const queryString = new URLSearchParams({
      depth: "2",
      draft: fetchDrafts ? "true" : "false",
      locale: locale,
      trash: "false",
    }).toString();

    const response = await fetch(
      `${config.url}/${collection}/${id}?${queryString}`,
      {
        headers: config.headers,
        next: { revalidate: 30 },
      },
    );

    if (!response.ok) {
      console.error(
        `Failed to fetch ${collection} article ${id}: ${response.status} ${response.statusText}`,
      );
      return null;
    }

    const data = await response.json();

    // Handle wrapped response format: { success: true, data: { ... } }
    // Note: Single item fetch returns data as object, not array
    if (data.success && data.data) {
      return data.data;
    }

    return data;
  } catch (error) {
    console.error(`Error fetching ${collection} article by ID "${id}":`, error);
    return null;
  }
}

export async function getFeaturedArticles(): Promise<
  Array<PayloadGundem | PayloadHikayeler | PayloadAlaraai | PayloadCollab | PayloadStory>
> {
  return fetchArticles({
    where: { isFeatured: { equals: true } },
    sort: "-ordering,-publishedAt",
    limit: 6,
    depth: 1,
  });
}

export async function getArticlesByCategory(categorySlug: string) {
  // Categories are only on gundem collection
  return fetchPayload<PayloadGundem>("gundem", {
    where: {
      "category.slug": { equals: categorySlug },
    },
    sort: "-publishedAt",
    depth: 1,
  });
}

/**
 * Fetch all Gündem articles (excluding Hikayeler)
 * Used for Section3 which should only show Gündem articles
 */
export async function getAllGundemArticles(
  limit: number = 24,
): Promise<PayloadGundem[]> {
  try {
    const response = await fetchPayload<PayloadGundem>("gundem", {
      sort: "-publishedAt",
      limit,
      depth: 1,
    });
    return response.docs;
  } catch (error) {
    console.error("Error fetching Gündem articles:", error);
    return [];
  }
}

export async function getRecentArticles(limit = 10) {
  return fetchArticles({
    sort: "-publishedAt",
    limit,
    depth: 1,
  });
}

/**
 * Fetch articles (gundem + hikayeler) by author id for author page
 */
export async function getArticlesByAuthorId(
  authorId: string,
  limit = 50,
): Promise<Array<PayloadGundem | PayloadHikayeler | PayloadAlaraai | PayloadCollab | PayloadStory>> {
  return fetchArticles({
    where: { author: { equals: authorId } },
    sort: "-publishedAt",
    limit,
    depth: 1,
  });
}

// Collection-specific functions (if needed)
export async function getGundemBySlug(slug: string) {
  const response = await fetchPayload<PayloadGundem>("gundem", {
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 2,
  });
  return response.docs[0] || null;
}

export async function getHikayelerBySlug(slug: string) {
  const response = await fetchPayload<PayloadHikayeler>("hikayeler", {
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 2,
  });
  return response.docs[0] || null;
}

export async function getCollabBySlug(slug: string) {
  const response = await fetchPayload<PayloadCollab>("collabs", {
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 2,
  });
  return response.docs[0] || null;
}

export async function getStoryBySlug(slug: string) {
  const response = await fetchPayload<PayloadStory>("stories", {
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 2,
  });
  return response.docs[0] || null;
}

// Supporting Collections
export async function getCategories() {
  return fetchPayload<PayloadCategory>("categories", {
    sort: "name",
    depth: 0,
  });
}

export async function getAuthors() {
  return fetchPayload<PayloadAuthor>("authors", {
    sort: "name",
    depth: 1, // Include avatar
  });
}

/**
 * Fetch a single author by slug (for author page)
 */
export async function getAuthorBySlug(
  slug: string,
): Promise<PayloadAuthor | null> {
  const res = await fetchPayload<PayloadAuthor>("authors", {
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 1,
  });
  return res.docs[0] || null;
}

export async function getTags() {
  return fetchPayload<PayloadTag>("tags", {
    sort: "name",
    depth: 0,
  });
}

// Globals
export async function getSiteSettings(): Promise<PayloadSiteSettings | null> {
  const fallbackSettings: PayloadSiteSettings = {
    id: "fallback-settings",
    siteName: "Scrolli",
    siteDescription: "Yeni nesil dijital yayın.",
    defaultLanguage: "tr",
    socialLinks: {},
    defaultSEO: {
      title: "Scrolli",
      description: "Yeni nesil dijital yayın.",
    },
    features: {
      enableComments: true,
      enableSharing: true,
      enableBookmarks: true,
      enablePodcasts: true,
      enableAIContent: true,
      maintenanceMode: false,
    },
    globalType: "settings",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  try {
    const config = getPayloadConfig();
    if (!config) {
      return fallbackSettings;
    }

    const response = await fetch(`${config.url}/globals/site-settings?locale=tr`, {
      headers: config.headers,
      next: { revalidate: 3600 }, // Cache for 1 hour
      signal: AbortSignal.timeout(3000), // 3s timeout
    }).catch(() => null);

    if (!response) return fallbackSettings;

    if (!response.ok) {
      // Direct retry with legacy slug if 404
      if (response.status === 404) {
        const fallbackResponse = await fetch(`${config.url}/globals/settings?locale=tr`, {
          headers: config.headers,
          next: { revalidate: 3600 },
        }).catch(() => null);

        if (fallbackResponse?.ok) {
          return fallbackResponse.json();
        }
      }
      return fallbackSettings;
    }

    const data = await response.json();
    return (data.success && data.data) ? data.data : data;
  } catch (error) {
    console.error("Error fetching site settings:", error);
    return fallbackSettings;
  }
}

export async function getNavigation(): Promise<PayloadNavigation | null> {
  try {
    const config = getPayloadConfig();
    if (!config) {
      return getFallbackNavigation();
    }

    const response = await fetch(`${config.url}/globals/navigation?locale=tr`, {
      headers: config.headers,
      next: { revalidate: 3600 }, // Cache for 1 hour
      signal: AbortSignal.timeout(3000), // 3s timeout for navigation
    }).catch(() => null);

    if (!response || !response.ok) {
      return getFallbackNavigation();
    }

    const data = await response.json();
    if (data.success && data.data) {
      return data.data;
    }
    return data;
  } catch (error) {
    console.error("Error fetching navigation:", error);
    return getFallbackNavigation();
  }
}

function getFallbackNavigation(): PayloadNavigation {
  return {
    mainMenu: [
      { id: "1", label: "Gelecek", type: "internal", path: "/gelecek" },
      { id: "2", label: "Finans", type: "internal", path: "/finans" },
      { id: "3", label: "Eksen", type: "internal", path: "/eksen" },
      { id: "4", label: "Zest", type: "internal", path: "/zest" },
    ],
    footerMenu: [],
  };
}

// Additional Content Types
export async function fetchPodcasts(
  params: FetchParams = {},
): Promise<PayloadResponse<PayloadPodcast>> {
  return fetchPayload<PayloadPodcast>("podcasts", {
    ...params,
    sort: params.sort || "-publishedAt",
    depth: params.depth || 1,
  });
}

export async function fetchDailyBriefings(
  params: FetchParams = {},
): Promise<PayloadResponse<PayloadDailyBriefing>> {
  return fetchPayload<PayloadDailyBriefing>("daily-briefings", {
    ...params,
    sort: params.sort || "-briefingDate",
    depth: params.depth || 1,
  });
}

export async function fetchCurations(
  params: FetchParams = {},
): Promise<PayloadResponse<PayloadCuration>> {
  return fetchPayload<PayloadCuration>("curations", {
    ...params,
    sort: params.sort || "-publishedAt",
    depth: params.depth || 1,
  });
}

/**
 * Fetch videos from the videos collection
 */
export async function fetchVideos(
  params: FetchParams = {},
): Promise<PayloadResponse<PayloadVideo>> {
  return fetchPayload<PayloadVideo>("videos", {
    ...params,
    sort: params.sort || "-ordering,-publishedAt",
    depth: params.depth || 1,
  });
}
