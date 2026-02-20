
/**
 * Match Media to Articles by Slug
 */

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
  collection: string;
}

function extractSlugFromMedia(media: MediaItem): string | null {
  if (media.alt) {
    const parts = media.alt.split(" - ");
    if (parts.length >= 2) {
      return parts[1];
    }
  }
  if (media.url) {
    const urlMatch = media.url.match(/\/(gundem|hikayeler|stories|collabs|alaraai)\/([^\/]+)\//);
    if (urlMatch && urlMatch[2]) {
      return urlMatch[2];
    }
  }
  return null;
}

function getCollectionFromMedia(media: MediaItem): string | null {
  if (media.alt) {
    if (media.alt.includes("gundem")) return "gundem";
    if (media.alt.includes("hikayeler")) return "hikayeler";
    if (media.alt.includes("stories")) return "stories";
    if (media.alt.includes("collabs")) return "collabs";
    if (media.alt.includes("alaraai")) return "alaraai";
  }
  if (media.url) {
    if (media.url.includes("/gundem/")) return "gundem";
    if (media.url.includes("/hikayeler/")) return "hikayeler";
    if (media.url.includes("/stories/")) return "stories";
    if (media.url.includes("/collabs/")) return "collabs";
    if (media.url.includes("/alaraai/")) return "alaraai";
  }
  return null;
}

function getMediaType(media: MediaItem): string | null {
  if (media.alt) {
    const parts = media.alt.split(" - ");
    if (parts.length >= 3) {
      const type = parts[2].toLowerCase();
      if (["desktop", "thumbnail", "vertical", "mobile", "image", "mobile-image"].includes(type)) {
        return type;
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
  if (!config) throw new Error("Payload configuration missing");

  const allMedia: MediaItem[] = [];
  let page = 1;
  const limit = 500;
  let hasMore = true;

  while (hasMore) {
    console.log(`   📥 Fetching media page ${page}...`);
    const response = await fetch(
      `${config.url}/media?locale=tr&limit=${limit}&page=${page}&sort=-createdAt`,
      { headers: config.headers }
    );

    if (!response.ok) break;

    const data = await response.json();
    const items = data.data || data.docs || [];
    allMedia.push(...items);

    hasMore = data.meta?.hasNextPage || data.hasNextPage || false;
    page++;
    if (page > 20) break; // Safety limit
  }

  return allMedia;
}

async function fetchArticlesWithoutImages(collection: string): Promise<Article[]> {
  const config = getPayloadConfig();
  if (!config) return [];

  const response = await fetch(
    `${config.url}/${collection}?locale=tr&where[featuredImage][exists]=false&limit=1000&depth=1`,
    { headers: config.headers }
  );

  if (!response.ok) return [];

  const data = await response.json();
  const items = data.data || data.docs || [];
  return items.map((doc: any) => ({
    id: doc.id,
    slug: doc.slug,
    title: doc.title,
    collection
  }));
}

async function matchMediaToArticles() {
  console.log("🔍 Matching media to articles by slug (Enhanced)...\n");

  const collections = ["gundem", "hikayeler", "stories", "collabs", "alaraai"];

  console.log("📥 Fetching data...");
  const [allMedia, ...collectionArticles] = await Promise.all([
    fetchAllMedia(),
    ...collections.map(c => fetchArticlesWithoutImages(c))
  ]);

  const allArticles = collectionArticles.flat();

  console.log(`   ✓ Found ${allMedia.length} media items`);
  console.log(`   ✓ Found ${allArticles.length} total articles without images\n`);

  const slugToMediaMap = new Map<string, MediaItem[]>();

  for (const media of allMedia) {
    const slug = extractSlugFromMedia(media);
    const collection = getCollectionFromMedia(media);

    if (slug && collection) {
      const key = `${collection}:${slug}`;
      if (!slugToMediaMap.has(key)) slugToMediaMap.set(key, []);
      slugToMediaMap.get(key)!.push(media);
    }
  }

  console.log(`   ✓ Mapped ${slugToMediaMap.size} unique article slugs to media\n`);

  const matches: any[] = [];

  function stripTimestamp(slug: string): string {
    return slug.replace(/-\d{13}$/, "");
  }

  for (const article of allArticles) {
    let key = `${article.collection}:${article.slug}`;
    let mediaList = slugToMediaMap.get(key) || [];

    if (mediaList.length === 0) {
      key = `${article.collection}:${stripTimestamp(article.slug)}`;
      mediaList = slugToMediaMap.get(key) || [];
    }

    const desktopMedia = mediaList.find(m => ["desktop", "image"].includes(getMediaType(m) || ""));
    const thumbnailMedia = mediaList.find(m => getMediaType(m) === "thumbnail");
    const mobileMedia = mediaList.find(m => ["mobile", "mobile-image", "vertical"].includes(getMediaType(m) || ""));

    const selectedMedia = desktopMedia || thumbnailMedia || mediaList[0];

    if (selectedMedia) {
      matches.push({
        collection: article.collection,
        articleId: article.id,
        articleSlug: article.slug,
        articleTitle: article.title,
        mediaId: selectedMedia.id,
        mediaFilename: selectedMedia.filename,
        mediaType: getMediaType(selectedMedia) || "unknown",
        mobileMediaId: mobileMedia?.id,
        thumbnailId: thumbnailMedia?.id || selectedMedia.id
      });
    }
  }

  console.log(`✅ Found ${matches.length} matches.\n`);

  if (matches.length > 0) {
    const fs = require("fs");
    fs.writeFileSync("media-article-matches.json", JSON.stringify(matches, null, 2));
    console.log(`💾 Matches saved to media-article-matches.json`);
  }

  return matches;
}

matchMediaToArticles().catch(console.error);
