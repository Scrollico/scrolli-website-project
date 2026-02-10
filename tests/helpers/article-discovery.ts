/**
 * Article discovery for E2E tests.
 * Fetches premium/free/hikayeler slugs from the test API (api_discover strategy).
 */

const BASE_URL = process.env.PLAYWRIGHT_TEST_BASE_URL || "http://localhost:3000";

export interface ArticleSlugs {
  premiumSlug: string | null;
  freeSlug: string | null;
  hikayelerSlug: string | null;
}

let cached: ArticleSlugs | null = null;

/**
 * Fetch article slugs from GET /api/test/article-slugs.
 * Caches result for the test run.
 */
export async function getArticleSlugs(forceRefresh = false): Promise<ArticleSlugs> {
  if (cached && !forceRefresh) return cached;

  const res = await fetch(`${BASE_URL}/api/test/article-slugs`, {
    headers: { Accept: "application/json" },
  });

  if (!res.ok) {
    throw new Error(
      `article-slugs API failed: ${res.status} ${res.statusText}. Ensure dev server is running and NODE_ENV !== production or ALLOW_TEST_API=true.`
    );
  }

  const data = (await res.json()) as ArticleSlugs;
  cached = data;
  return data;
}

/**
 * Get a premium article slug for tests. Throws if none available.
 */
export async function getPremiumSlug(): Promise<string> {
  const { premiumSlug } = await getArticleSlugs();
  if (!premiumSlug) {
    throw new Error(
      "No premium article slug from API. Ensure CMS has at least one article with isPremium=true or fallback will use first article."
    );
  }
  return premiumSlug;
}

/**
 * Get a free article slug for tests. Throws if none available.
 */
export async function getFreeSlug(): Promise<string> {
  const { freeSlug } = await getArticleSlugs();
  if (!freeSlug) {
    throw new Error(
      "No free article slug from API. Ensure CMS has at least one article with isPremium=false or second article."
    );
  }
  return freeSlug;
}

/**
 * Get a Hikayeler article slug if available.
 */
export async function getHikayelerSlug(): Promise<string | null> {
  const { hikayelerSlug } = await getArticleSlugs();
  return hikayelerSlug;
}
