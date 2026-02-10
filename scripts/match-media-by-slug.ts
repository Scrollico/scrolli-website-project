/**
 * Match Media to Articles by Slug
 * 
 * This script matches media files to articles based on slug matching.
 * Media files have slugs in their Alt field or URL path.
 * 
 * Usage:
 *   npx tsx scripts/match-media-by-slug.ts
 */

// Load environment variables
import { config } from "dotenv";
import { resolve } from "path";
config({ path: resolve(process.cwd(), ".env.local") });

import { getPayloadConfig } from "../lib/payload/client";

interface MediaItem {
  id: string;
  filename: string;
  alt?: string;
  url: string;
}

interface Article {
  id: string;
  slug: string;
  title: string;
  featuredImage?: string;
}

/**
 * Extract slug from media Alt field or URL
 * Format examples:
 * - Alt: "hikayeler - sifir-noktasindan-tarsus-kazisinin-hikayesi - desktop"
 * - URL: "https://.../hikayeler/sifir-noktasindan-tarsus-kazisinin-hikayesi/desktop.jpg"
 */
function extractSlugFromMedia(media: MediaItem): string | null {
  // Try Alt field first (format: "collection - slug - type")
  if (media.alt) {
    const parts = media.alt.split(" - ");
    if (parts.length >= 2) {
      return parts[1]; // Middle part is the slug
    }
  }
  
  // Fallback to URL path
  if (media.url) {
    // Extract from URL path like: /hikayeler/slug-here/desktop.jpg
    const urlMatch = media.url.match(/\/(gundem|hikayeler)\/([^\/]+)\//);
    if (urlMatch && urlMatch[2]) {
      return urlMatch[2];
    }
  }
  
  return null;
}

/**
 * Get collection type from media Alt or URL
 */
function getCollectionFromMedia(media: MediaItem): "gundem" | "hikayeler" | null {
  if (media.alt) {
    if (media.alt.startsWith("gundem")) return "gundem";
    if (media.alt.startsWith("hikayeler")) return "hikayeler";
  }
  
  if (media.url) {
    if (media.url.includes("/gundem/")) return "gundem";
    if (media.url.includes("/hikayeler/")) return "hikayeler";
  }
  
  return null;
}

/**
 * Get media type (desktop, thumbnail, vertical, mobile)
 */
function getMediaType(media: MediaItem): "desktop" | "thumbnail" | "vertical" | "mobile" | null {
  if (media.alt) {
    const parts = media.alt.split(" - ");
    if (parts.length >= 3) {
      const type = parts[2].toLowerCase();
      if (["desktop", "thumbnail", "vertical", "mobile"].includes(type)) {
        return type as any;
      }
    }
  }
  
  if (media.filename) {
    if (media.filename.includes("desktop")) return "desktop";
    if (media.filename.includes("thumbnail")) return "thumbnail";
    if (media.filename.includes("vertical")) return "vertical";
    if (media.filename.includes("mobile")) return "mobile";
  }
  
  return null;
}

async function fetchAllMedia(): Promise<MediaItem[]> {
  const config = getPayloadConfig();
  if (!config) {
    throw new Error("Payload CMS functions can only be called on the server");
  }

  const allMedia: MediaItem[] = [];
  let page = 1;
  const limit = 100;
  let hasMore = true;

  while (hasMore) {
    const response = await fetch(
      `${config.url}/media?locale=tr&limit=${limit}&page=${page}&sort=-createdAt`,
      { headers: config.headers }
    );

    if (!response.ok) {
      console.error(`Failed to fetch media page ${page}:`, response.status);
      break;
    }

    const data = await response.json();
    allMedia.push(...(data.docs || []));
    
    hasMore = data.hasNextPage || false;
    page++;
  }

  return allMedia;
}

async function fetchArticlesWithoutImages(
  collection: "gundem" | "hikayeler"
): Promise<Article[]> {
  const config = getPayloadConfig();
  if (!config) {
    throw new Error("Payload CMS functions can only be called on the server");
  }

  const response = await fetch(
    `${config.url}/${collection}?locale=tr&where[featuredImage][exists]=false&limit=1000&depth=1`,
    { headers: config.headers }
  );

  if (!response.ok) {
    console.error(`Failed to fetch ${collection} articles:`, response.status);
    return [];
  }

  const data = await response.json();
  return (data.docs || []).map((doc: any) => ({
    id: doc.id,
    slug: doc.slug,
    title: doc.title,
    featuredImage: doc.featuredImage,
  }));
}

async function matchMediaToArticles() {
  console.log("🔍 Matching media to articles by slug...\n");

  // Fetch all data
  console.log("📥 Fetching data...");
  const [allMedia, gundemArticles, hikayelerArticles] = await Promise.all([
    fetchAllMedia(),
    fetchArticlesWithoutImages("gundem"),
    fetchArticlesWithoutImages("hikayeler"),
  ]);

  console.log(`   ✓ Found ${allMedia.length} media items`);
  console.log(`   ✓ Found ${gundemArticles.length} Gündem articles without images`);
  console.log(`   ✓ Found ${hikayelerArticles.length} Hikayeler articles without images\n`);

  // Build slug-to-media map
  console.log("🔗 Building slug-to-media mapping...");
  const slugToMediaMap = new Map<string, MediaItem[]>();

  for (const media of allMedia) {
    const slug = extractSlugFromMedia(media);
    const collection = getCollectionFromMedia(media);
    const mediaType = getMediaType(media);

    if (slug && collection) {
      const key = `${collection}:${slug}`;
      if (!slugToMediaMap.has(key)) {
        slugToMediaMap.set(key, []);
      }
      slugToMediaMap.get(key)!.push(media);
    }
  }

  console.log(`   ✓ Mapped ${slugToMediaMap.size} unique article slugs to media\n`);

  // Match articles to media
  console.log("🎯 Matching articles to media...\n");

  // Debug: Show sample slugs
  console.log("🔍 Debug - Sample article slugs:");
  console.log(`   Gündem: ${gundemArticles.slice(0, 3).map(a => a.slug).join(", ")}`);
  console.log(`   Hikayeler: ${hikayelerArticles.slice(0, 3).map(a => a.slug).join(", ")}\n`);
  
  console.log("🔍 Debug - Sample media slug keys (first 5):");
  Array.from(slugToMediaMap.keys()).slice(0, 5).forEach(key => {
    console.log(`   ${key}`);
  });
  console.log();

  const matches: Array<{
    collection: "gundem" | "hikayeler";
    articleId: string;
    articleSlug: string;
    articleTitle: string;
    mediaId: string;
    mediaFilename: string;
    mediaType: string;
  }> = [];

  /**
   * Strip timestamp from slug (e.g., "slug-here-1748945264486" -> "slug-here")
   * Timestamps are typically 13 digits at the end
   */
  function stripTimestamp(slug: string): string {
    // Match timestamp pattern: - followed by 13 digits at the end
    return slug.replace(/-\d{13}$/, "");
  }

  // Match Gündem articles
  for (const article of gundemArticles) {
    // Try exact match first
    let key = `gundem:${article.slug}`;
    let mediaList = slugToMediaMap.get(key) || [];
    
    // If no match, try without timestamp
    if (mediaList.length === 0) {
      const slugWithoutTimestamp = stripTimestamp(article.slug);
      key = `gundem:${slugWithoutTimestamp}`;
      mediaList = slugToMediaMap.get(key) || [];
    }

    // Prefer desktop, then thumbnail
    const desktopMedia = mediaList.find(m => getMediaType(m) === "desktop");
    const thumbnailMedia = mediaList.find(m => getMediaType(m) === "thumbnail");
    const selectedMedia = desktopMedia || thumbnailMedia || mediaList[0];

    if (selectedMedia) {
      matches.push({
        collection: "gundem",
        articleId: article.id,
        articleSlug: article.slug,
        articleTitle: article.title,
        mediaId: selectedMedia.id,
        mediaFilename: selectedMedia.filename,
        mediaType: getMediaType(selectedMedia) || "unknown",
      });
    }
  }

  // Match Hikayeler articles
  for (const article of hikayelerArticles) {
    // Try exact match first
    let key = `hikayeler:${article.slug}`;
    let mediaList = slugToMediaMap.get(key) || [];
    
    // If no match, try without timestamp
    if (mediaList.length === 0) {
      const slugWithoutTimestamp = stripTimestamp(article.slug);
      key = `hikayeler:${slugWithoutTimestamp}`;
      mediaList = slugToMediaMap.get(key) || [];
    }

    // Prefer desktop, then vertical, then thumbnail
    const desktopMedia = mediaList.find(m => getMediaType(m) === "desktop");
    const verticalMedia = mediaList.find(m => getMediaType(m) === "vertical");
    const thumbnailMedia = mediaList.find(m => getMediaType(m) === "thumbnail");
    const selectedMedia = desktopMedia || verticalMedia || thumbnailMedia || mediaList[0];

    if (selectedMedia) {
      matches.push({
        collection: "hikayeler",
        articleId: article.id,
        articleSlug: article.slug,
        articleTitle: article.title,
        mediaId: selectedMedia.id,
        mediaFilename: selectedMedia.filename,
        mediaType: getMediaType(selectedMedia) || "unknown",
      });
    }
  }

  console.log(`✅ Found ${matches.length} matches:\n`);
  console.log(`   Gündem: ${matches.filter(m => m.collection === "gundem").length}`);
  console.log(`   Hikayeler: ${matches.filter(m => m.collection === "hikayeler").length}\n`);

  // Display sample matches
  console.log("📋 Sample matches (first 10):");
  console.log("=" .repeat(80));
  matches.slice(0, 10).forEach((match, index) => {
    console.log(`${index + 1}. ${match.collection.toUpperCase()}: "${match.articleTitle.substring(0, 50)}..."`);
    console.log(`   Slug: ${match.articleSlug}`);
    console.log(`   Media: ${match.mediaFilename} (${match.mediaType})`);
    console.log(`   Article ID: ${match.articleId} → Media ID: ${match.mediaId}\n`);
  });

  if (matches.length > 10) {
    console.log(`   ... and ${matches.length - 10} more matches\n`);
  }

  // Export matches to JSON for manual review/update
  const fs = require("fs");
  const outputPath = "media-article-matches.json";
  fs.writeFileSync(
    outputPath,
    JSON.stringify(matches, null, 2)
  );
  console.log(`💾 Matches saved to: ${outputPath}`);
  console.log(`\n📝 Next steps:`);
  console.log(`   1. Review the matches in ${outputPath}`);
  console.log(`   2. Use the API endpoint or admin panel to update articles`);
  console.log(`   3. Or run the update script if access control is fixed\n`);

  return matches;
}

matchMediaToArticles().catch((error) => {
  console.error("❌ Error:", error);
  process.exit(1);
});
