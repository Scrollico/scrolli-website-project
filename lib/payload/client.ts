import {
  PayloadResponse,
  PayloadGundem,
  PayloadHikayeler,
  PayloadCategory,
  PayloadAuthor,
  PayloadTag,
  PayloadNavigation,
  PayloadSiteSettings,
  PayloadPodcast,
  PayloadDailyBriefing,
  PayloadCuration,
} from "./types";

// Get environment variables - only available on server
// On client or when env vars are missing (e.g. Vercel build/runtime before env is set), return null
// so pages can render with empty/fallback content instead of 500.
export function getPayloadConfig() {
  const PAYLOAD_API_URL = process.env.PAYLOAD_API_URL;
  const PAYLOAD_API_KEY = process.env.PAYLOAD_API_KEY;

  if (!PAYLOAD_API_URL || !PAYLOAD_API_KEY) {
    // Enhanced logging for debugging production issues
    // This helps identify when environment variables are not set in production
    console.error("❌ Payload CMS Configuration Missing:", {
      hasUrl: !!PAYLOAD_API_URL,
      hasKey: !!PAYLOAD_API_KEY,
      nodeEnv: process.env.NODE_ENV,
      // Don't log actual values for security
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

  if (params.sort) {
    queryParams.append("sort", params.sort);
  }
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
): Promise<Array<PayloadGundem | PayloadHikayeler>> {
  try {
    const config = getPayloadConfig();
    if (!config) {
      console.warn("Payload CMS not configured, returning empty array");
      return [];
    }

    const queryString = buildQueryString(params);

    // Revalidation strategy: 30 seconds for articles (faster new article discovery)
    // Navigation and site settings use longer revalidation (1 hour) as they change less frequently
    // Use Promise.allSettled to handle failures gracefully without breaking the page
    const [gundemResult, hikayelerResult] = await Promise.allSettled([
      fetch(`${config.url}/gundem?${queryString}`, {
        ...config.headers,
        next: { revalidate: 30 },
      }),
      fetch(`${config.url}/hikayeler?${queryString}`, {
        ...config.headers,
        next: { revalidate: 30 },
      }),
    ]);

    // Extract responses, handling both fulfilled and rejected promises
    const gundemRes:
      | Response
      | { ok: false; status: number; statusText: string } =
      gundemResult.status === "fulfilled" ?
        gundemResult.value
        : { ok: false, status: 500, statusText: "Network Error" };

    const hikayelerRes:
      | Response
      | { ok: false; status: number; statusText: string } =
      hikayelerResult.status === "fulfilled" ?
        hikayelerResult.value
        : { ok: false, status: 500, statusText: "Network Error" };

    // Log errors if any
    if (gundemResult.status === "rejected") {
      console.warn("Failed to fetch Gündem:", gundemResult.reason);
    }
    if (hikayelerResult.status === "rejected") {
      console.warn("Failed to fetch Hikayeler:", hikayelerResult.reason);
    }

    // Handle partial failures gracefully - return what we can get
    const results: Array<PayloadGundem | PayloadHikayeler> = [];

    if (gundemRes.ok) {
      try {
        const gundem = await gundemRes.json();
        // Defensive check: Ensure docs exists and is an array
        const docs = Array.isArray(gundem?.docs) ? gundem.docs : [];
        const gundemWithSource = docs.map((doc: any) => ({
          ...doc,
          source: "Gündem" as const,
        }));
        results.push(...gundemWithSource);
      } catch (error) {
        console.error("Error parsing Gündem response:", error);
      }
    } else {
      console.warn(
        `Failed to fetch Gündem: ${gundemRes.status} ${gundemRes.statusText}`,
      );
    }

    if (hikayelerRes.ok) {
      try {
        const hikayeler = await hikayelerRes.json();
        // Defensive check: Ensure docs exists and is an array
        const docs = Array.isArray(hikayeler?.docs) ? hikayeler.docs : [];
        const hikayelerWithSource = docs.map((doc: any) => ({
          ...doc,
          source: "Hikayeler" as const,
        }));
        results.push(...hikayelerWithSource);
      } catch (error) {
        console.error("Error parsing Hikayeler response:", error);
      }
    } else {
      console.warn(
        `Failed to fetch Hikayeler: ${hikayelerRes.status} ${hikayelerRes.statusText}`,
      );
    }

    // If both failed, throw error
    // Only throw if both requests actually failed (not OK status)
    // If both are OK but results is empty, that's fine (no articles available)
    if (results.length === 0 && (!gundemRes.ok || !hikayelerRes.ok)) {
      // Don't throw if Payload CMS is just unavailable - return empty array instead
      // This allows the page to still render (e.g., pricing page doesn't need articles)
      console.warn(
        `Payload CMS unavailable: Gündem (${gundemRes.status || "Network Error"
        }), Hikayeler (${hikayelerRes.status || "Network Error"})`,
      );

      // Return empty array instead of throwing - allows page to render
      return [];
    }

    // Merge and sort by publishedAt descending
    const articles = results.sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
    );

    // Client-side deduplication: Filter duplicates by slug (primary) or id (fallback)
    // Keep the most recent article if duplicates exist
    const uniqueArticles = new Map<string, PayloadGundem | PayloadHikayeler>();

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

async function fetchPayload<T>(
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
      ...config.headers,
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

// Primary function - fetch from both collections
export async function getArticleBySlug(
  slug: string,
): Promise<PayloadGundem | PayloadHikayeler | null> {
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
  collection: "gundem" | "hikayeler",
  id: string,
): Promise<PayloadGundem | PayloadHikayeler | null> {
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

    return await response.json();
  } catch (error) {
    console.error(`Error fetching ${collection} article by ID "${id}":`, error);
    return null;
  }
}

export async function getFeaturedArticles(): Promise<
  Array<PayloadGundem | PayloadHikayeler>
> {
  return fetchArticles({
    where: { isFeatured: { equals: true } },
    sort: "-ordering,-publishedAt",
    limit: 6,
    depth: 2,
  });
}

export async function getArticlesByCategory(categorySlug: string) {
  // Categories are only on gundem collection
  return fetchPayload<PayloadGundem>("gundem", {
    where: {
      "category.slug": { equals: categorySlug },
    },
    sort: "-publishedAt",
    depth: 2,
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
      depth: 2,
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
    depth: 2,
  });
}

/**
 * Fetch articles (gundem + hikayeler) by author id for author page
 */
export async function getArticlesByAuthorId(
  authorId: string,
  limit = 50,
): Promise<Array<PayloadGundem | PayloadHikayeler>> {
  return fetchArticles({
    where: { author: { equals: authorId } },
    sort: "-publishedAt",
    limit,
    depth: 2,
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
  try {
    const config = getPayloadConfig();
    if (!config) {
      return null;
    }

    // Try fetching with "site-settings" slug first (correct one based on schema)
    // If that fails, we could try "settings", but site-settings is the one with the fields we need
    const response = await fetch(`${config.url}/globals/site-settings?locale=tr`, {
      headers: config.headers,
      next: { revalidate: 3600 }, // Cache for 1 hour
    }).catch((error) => {
      console.warn("Failed to fetch site settings from Payload CMS:", error);
      // Return null instead of throwing - allows page to render without settings
      return null;
    });

    if (!response) {
      return null;
    }

    if (!response.ok) {
      console.error(
        `Failed to fetch site settings: ${response.status} ${response.statusText}`,
      );
      // Try fallback to "settings" if "site-settings" fails (backward compatibility)
      if (response.status === 404) {
        console.log("Retrying with legacy 'settings' slug...");
        const fallbackResponse = await fetch(`${config.url}/globals/settings?locale=tr`, {
          headers: config.headers,
          next: { revalidate: 3600 },
        });
        if (fallbackResponse.ok) {
          return fallbackResponse.json();
        }
      }
      return null; // Return null instead of throwing for graceful degradation
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching site settings:", error);
    return null; // Return null to allow fallback to defaults
  }
}

export async function getNavigation(): Promise<PayloadNavigation | null> {
  try {
    const config = getPayloadConfig();
    if (!config) {
      return null;
    }

    const response = await fetch(`${config.url}/globals/navigation?locale=tr`, {
      headers: config.headers,
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!response.ok) {
      console.error(
        `Failed to fetch navigation: ${response.status} ${response.statusText}`,
      );
      return null; // Return null instead of throwing for graceful degradation
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching navigation:", error);
    return null; // Return null to allow fallback to static navigation
  }
}

// Additional Content Types
export async function fetchPodcasts(
  params: FetchParams = {},
): Promise<PayloadResponse<PayloadPodcast>> {
  return fetchPayload<PayloadPodcast>("podcasts", {
    ...params,
    sort: params.sort || "-publishedAt",
    depth: params.depth || 2,
  });
}

export async function fetchDailyBriefings(
  params: FetchParams = {},
): Promise<PayloadResponse<PayloadDailyBriefing>> {
  return fetchPayload<PayloadDailyBriefing>("daily-briefings", {
    ...params,
    sort: params.sort || "-briefingDate",
    depth: params.depth || 2,
  });
}

export async function fetchCurations(
  params: FetchParams = {},
): Promise<PayloadResponse<PayloadCuration>> {
  return fetchPayload<PayloadCuration>("curations", {
    ...params,
    sort: params.sort || "-publishedAt",
    depth: params.depth || 2,
  });
}
