/**
 * Payload CMS Update Operations
 * 
 * Functions to update articles in Payload CMS collections (Gündem and Hikayeler)
 * Uses PATCH requests as per Payload CMS REST API specification
 */

import { getPayloadConfig } from "./client";

/**
 * Update a single article by ID
 * @param collection - Collection name ('gundem' or 'hikayeler')
 * @param id - Article ID
 * @param data - Partial data to update (only fields to update)
 * @returns Updated article or null on error
 */
export async function updateArticle(
  collection: "gundem" | "hikayeler",
  id: string,
  data: Record<string, any>
): Promise<any | null> {
  try {
    const config = getPayloadConfig();
    if (!config) {
      throw new Error("Payload CMS functions can only be called on the server");
    }

    // Payload CMS uses PATCH for updates
    const response = await fetch(`${config.url}/${collection}/${id}?locale=tr`, {
      method: "PATCH",
      headers: {
        ...config.headers,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => "");
      let errorData = {};
      try {
        errorData = errorText ? JSON.parse(errorText) : {};
      } catch {
        // Not JSON, ignore
      }

      // Always log 403 errors with details for debugging
      if (response.status === 403) {
        console.error(`❌ 403 Forbidden updating ${collection} article ${id}:`, {
          status: response.status,
          statusText: response.statusText,
          body: errorText.substring(0, 500),
          errorData,
        });
      } else {
        console.error(`Failed to update ${collection} article ${id}:`, {
          status: response.status,
          statusText: response.statusText,
          body: errorText.substring(0, 500),
        });
      }
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error(`Error updating ${collection} article ${id}:`, error);
    return null;
  }
}

/**
 * Update featured image for a single article
 * @param collection - Collection name ('gundem' or 'hikayeler')
 * @param id - Article ID
 * @param mediaId - Media ID from Payload CMS Media collection
 * @returns Updated article or null on error
 */
export async function updateFeaturedImage(
  collection: "gundem" | "hikayeler",
  id: string,
  mediaId: string
): Promise<any | null> {
  return updateArticle(collection, id, {
    featuredImage: mediaId,
  });
}

/**
 * Update featured image for multiple articles with rate limiting
 * @param collection - Collection name ('gundem' or 'hikayeler')
 * @param updates - Array of { id, mediaId } pairs
 * @param batchSize - Number of updates to process in parallel (default: 5)
 * @param delayMs - Delay between batches in milliseconds (default: 500)
 * @returns Array of update results
 */
export async function updateFeaturedImagesBulk(
  collection: "gundem" | "hikayeler",
  updates: Array<{ id: string; mediaId: string }>,
  batchSize: number = 5,
  delayMs: number = 500
): Promise<Array<{ id: string; success: boolean; error?: string }>> {
  const results: Array<{ id: string; success: boolean; error?: string }> = [];

  // Process updates in batches to avoid rate limiting and timeouts
  for (let i = 0; i < updates.length; i += batchSize) {
    const batch = updates.slice(i, i + batchSize);

    const batchResults = await Promise.allSettled(
      batch.map(({ id, mediaId }) =>
        updateFeaturedImage(collection, id, mediaId)
      )
    );

    batchResults.forEach((result, batchIndex) => {
      const update = batch[batchIndex];
      results.push({
        id: update.id,
        success: result.status === "fulfilled" && result.value !== null,
        error:
          result.status === "rejected"
            ? result.reason?.message || "Unknown error"
            : result.value === null
              ? "Update returned null"
              : undefined,
      });
    });

    // Add delay between batches (except for the last batch)
    if (i + batchSize < updates.length) {
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }

  return results;
}

/**
 * Find articles without featured images
 * @param collection - Collection name ('gundem' or 'hikayeler')
 * @param limit - Maximum number of articles to return
 * @returns Array of articles without featuredImage
 */
export async function findArticlesWithoutFeaturedImage(
  collection: "gundem" | "hikayeler",
  limit: number = 100
): Promise<any[]> {
  try {
    const config = getPayloadConfig();
    if (!config) {
      throw new Error("Payload CMS functions can only be called on the server");
    }

    // Query for articles where featuredImage is null or doesn't exist
    const response = await fetch(
      `${config.url}/${collection}?locale=tr&where[featuredImage][exists]=false&limit=${limit}&depth=1`,
      {
        headers: config.headers,
      }
    );

    if (!response.ok) {
      console.error(`Failed to fetch ${collection} articles without images:`, {
        status: response.status,
        statusText: response.statusText,
      });
      return [];
    }

    const data = await response.json();

    // Handle wrapped response format: { success: true, data: [...] }
    if (data.success && Array.isArray(data.data)) {
      return data.data;
    }

    return data.docs || [];
  } catch (error) {
    console.error(`Error finding ${collection} articles without images:`, error);
    return [];
  }
}

/**
 * Get all media items from Payload CMS
 * @param limit - Maximum number of media items to return
 * @returns Array of media items
 */
export async function getAllMedia(limit: number = 1000): Promise<any[]> {
  try {
    const config = getPayloadConfig();
    if (!config) {
      throw new Error("Payload CMS functions can only be called on the server");
    }

    const response = await fetch(
      `${config.url}/media?locale=tr&limit=${limit}&sort=-createdAt`,
      {
        headers: config.headers,
      }
    );

    if (!response.ok) {
      console.error("Failed to fetch media:", {
        status: response.status,
        statusText: response.statusText,
      });
      return [];
    }

    const data = await response.json();

    // Handle wrapped response format: { success: true, data: [...] }
    if (data.success && Array.isArray(data.data)) {
      return data.data;
    }

    return data.docs || [];
  } catch (error) {
    console.error("Error fetching media:", error);
    return [];
  }
}
