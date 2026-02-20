import { fetchArticles, fetchHikayeler, fetchCurations, fetchDailyBriefings, fetchPayload } from "./payload/client";
import { PayloadGundem, PayloadHikayeler, PayloadCuration, PayloadDailyBriefing, PayloadAlaraai, PayloadCollab, PayloadStory } from "./payload/types";

export interface HomepageContent {
  hero: PayloadGundem | PayloadHikayeler | PayloadAlaraai | PayloadCollab | PayloadStory | null;
  editorsPicks: Array<PayloadGundem | PayloadHikayeler | PayloadCuration | PayloadAlaraai | PayloadCollab | PayloadStory>;
  verticalList: Array<PayloadGundem | PayloadHikayeler | PayloadAlaraai | PayloadCollab | PayloadStory>;
  articleList: Array<PayloadGundem | PayloadHikayeler | PayloadAlaraai | PayloadCollab | PayloadStory>;
  hikayeler: Array<PayloadHikayeler>; // Dedicated hikayeler section
  dailyBriefing: PayloadDailyBriefing | null;
  gundemSection3Articles: PayloadGundem[]; // Added for parallelization
}

/**
 * Get homepage content with manual pinning and auto-fill logic
 *
 * Current mode: Using isFeatured + ordering (layoutPosition feature is paused)
 * To enable layoutPosition: Set ENABLE_LAYOUT_POSITION=true in .env.local
 *
 * Logic (current fallback):
 * 1. Fetch featured articles (isFeatured: true) sorted by ordering
 * 2. Use first featured as hero, next 3 as editors picks
 * 3. Fill remaining with recent articles
 */

/**
 * Helper to check if an article is valid (has content and valid images)
 */
export function isValidArticle(article: any): boolean {
  if (!article) return false;

  // 1. Check for content
  // Hikayeler and Stories use inlineScriptHtml or inlineScript (Lexical)
  // Gündem, Alara AI, Collabs use content (Lexical)
  const hasInlineScript = !!article.inlineScriptHtml || (
    article.inlineScript &&
    article.inlineScript.root &&
    article.inlineScript.root.children &&
    article.inlineScript.root.children.length > 0 &&
    article.inlineScript.root.children.some((child: any) => child.children && child.children.length > 0)
  );

  const hasContent = !!article.content &&
    typeof article.content === 'object' &&
    article.content.root &&
    article.content.root.children &&
    article.content.root.children.length > 0 &&
    article.content.root.children.some((child: any) => child.children && child.children.length > 0);

  // General "Zombie" check: If no content and no inline script, it's likely broken
  if (!hasContent && !hasInlineScript) return false;

  // 2. Check for images
  // We require at least one valid expanded image object
  const hasValidImage = !!article.featuredImage && typeof article.featuredImage === 'object' && !!article.featuredImage.url;
  const hasValidThumbnail = !!article.thumbnail && typeof article.thumbnail === 'object' && !!article.thumbnail.url;

  // All collections (Gündem, Hikayeler, Alara AI, Collabs, etc.) must have at least one valid image to be shown
  if (!hasValidImage && !hasValidThumbnail) return false;

  return true;
}

export async function getHomepageContent(): Promise<HomepageContent> {
  try {
    const ENABLE_LAYOUT_POSITION = process.env.ENABLE_LAYOUT_POSITION === "true";

    let result: HomepageContent;

    if (ENABLE_LAYOUT_POSITION) {
      // Step 1: Parallelize all initial data fetching
      const [dailyBriefingRes, allHikayeler, pinnedHero, pinnedEditorsPicks, allRecentArticles, gundemSection3Res] = await Promise.all([
        fetchDailyBriefings({ limit: 1, sort: "-briefingDate" }),
        fetchHikayeler({ limit: 12, depth: 1 }),
        fetchArticles({ layoutPosition: "hero", limit: 1, depth: 1 }),
        fetchArticles({ layoutPosition: "editors-picks", limit: 3, depth: 1 }),
        fetchArticles({ sort: "-publishedAt", limit: 50, depth: 1 }),
        fetchPayload<PayloadGundem>("gundem", { sort: "-publishedAt", limit: 50, depth: 1 }),
      ]).then(res => [
        res[0],
        res[1].filter(isValidArticle),
        res[2].filter(isValidArticle),
        res[3].filter(isValidArticle),
        res[4].filter(isValidArticle),
        { ...res[5], docs: res[5].docs.filter(isValidArticle) }
      ]) as any;

      const topHikayeler = allHikayeler.slice(0, 4);
      const dailyBriefing = dailyBriefingRes.docs[0] || null;
      const gundemSection3Articles = gundemSection3Res.docs || [];

      // Hero: Pinned hero OR first Hikaye
      const hero = pinnedHero[0] || topHikayeler[0] || null;
      const usedSlugs = hero ? [hero.slug] : [];

      // Editors Picks: Pinned picks + fill with topHikayeler
      const editorsPicks: Array<PayloadGundem | PayloadHikayeler | PayloadCuration | PayloadAlaraai | PayloadCollab | PayloadStory> = [...pinnedEditorsPicks];
      usedSlugs.push(...editorsPicks.map((a: { slug: string }) => a.slug));

      for (const article of topHikayeler) {
        if (editorsPicks.length >= 3) break;
        if (!usedSlugs.includes(article.slug)) {
          editorsPicks.push(article);
          usedSlugs.push(article.slug);
        }
      }

      // Fill remaining editors picks with recent articles
      for (const article of allRecentArticles) {
        if (editorsPicks.length >= 3) break;
        if (!usedSlugs.includes(article.slug)) {
          editorsPicks.push(article);
          usedSlugs.push(article.slug);
        }
      }

      const autoArticles = allRecentArticles.filter(
        (article: { layoutPosition?: string; slug: string }) => article.layoutPosition !== "exclude" && !usedSlugs.includes(article.slug)
      );

      const verticalList = autoArticles.slice(0, 6);
      const usedSlugsAfterVerticalList = [...usedSlugs, ...verticalList.map((a: { slug: string }) => a.slug)].filter(Boolean);

      const articleList = allRecentArticles
        .filter((article: { slug: string }) => !usedSlugsAfterVerticalList.includes(article.slug))
        .slice(0, 3);

      const hikayeler = allHikayeler.filter((a: { slug: string }) => !usedSlugs.includes(a.slug)).slice(0, 8);

      result = { hero, editorsPicks, verticalList, articleList, hikayeler, dailyBriefing, gundemSection3Articles };
    } else {
      // ============================================
      // FALLBACK MODE (Aggressively Optimized)
      // ============================================

      // Step 1: Fire consolidated fetches
      const [dailyBriefingRes, curationsRes, allHikayeler, mainPool, gundemPool] = await Promise.all([
        fetchDailyBriefings({ limit: 1, sort: "-briefingDate" }),
        fetchCurations({ limit: 3, sort: "-publishedAt" }),
        fetchArticles({ limit: 12, depth: 1, collections: ["hikayeler", "stories"] }),
        fetchArticles({ limit: 30, depth: 1 }), // Mix of all for hero/picks
        fetchArticles({ limit: 50, depth: 1, collections: ["gundem"] }), // Targeted for section 3
      ]).then(res => [
        res[0],
        res[1],
        res[2].filter(isValidArticle),
        res[3].filter(isValidArticle),
        res[4].filter(isValidArticle),
      ]) as any;

      const dailyBriefing = dailyBriefingRes.docs[0] || null;
      const curations = curationsRes.docs || [];
      const topHikayeler = allHikayeler.slice(0, 4);

      // Featured articles for Hero and Editors Picks (from main pool)
      const featuredArticles = mainPool.filter((a: any) => a.isFeatured).slice(0, 10);
      const allRecentArticles = mainPool;
      const gundemSection3Articles = gundemPool;

      // Hero: First Hikaye, or first featured, or first recent
      const hero = topHikayeler[0] || featuredArticles[0] || allRecentArticles[0] || null;
      const usedSlugs = hero ? [hero.slug] : [];

      const editorsPicks: Array<PayloadGundem | PayloadHikayeler | PayloadCuration | PayloadAlaraai | PayloadCollab | PayloadStory> = [];

      // 1. Add Curations
      curations.forEach((curation: PayloadCuration) => {
        if (editorsPicks.length < 3) {
          editorsPicks.push(curation);
          if (curation.slug) usedSlugs.push(curation.slug);
        }
      });

      // 2. Fill with topHikayeler
      for (const article of topHikayeler) {
        if (editorsPicks.length >= 3) break;
        if (!usedSlugs.includes(article.slug)) {
          editorsPicks.push(article);
          usedSlugs.push(article.slug);
        }
      }

      // 3. Then fill with featured
      for (const article of featuredArticles) {
        if (editorsPicks.length >= 3) break;
        if (!usedSlugs.includes(article.slug)) {
          editorsPicks.push(article);
          usedSlugs.push(article.slug);
        }
      }

      // 4. Then fill with recent
      for (const article of allRecentArticles) {
        if (editorsPicks.length >= 3) break;
        if (!usedSlugs.includes(article.slug)) {
          editorsPicks.push(article);
          usedSlugs.push(article.slug);
        }
      }

      const usedSlugsAfterEditorsPicks = [...usedSlugs, ...editorsPicks.map((a: { slug: string }) => a.slug)].filter(Boolean);
      const remainingArticles = allRecentArticles.filter((article: { slug: string }) => !usedSlugsAfterEditorsPicks.includes(article.slug));

      const verticalList = remainingArticles.slice(0, 6);
      const usedSlugsAfterVerticalList = [...usedSlugsAfterEditorsPicks, ...verticalList.map((a: { slug: string }) => a.slug)].filter(Boolean);

      const articleList = allRecentArticles
        .filter((article: { slug: string }) => !usedSlugsAfterVerticalList.includes(article.slug))
        .slice(0, 3);

      const hikayeler = allHikayeler.filter((a: { slug: string }) => !usedSlugsAfterEditorsPicks.includes(a.slug)).slice(0, 8);

      result = { hero, editorsPicks, verticalList, articleList, hikayeler, dailyBriefing, gundemSection3Articles };
    }

    return result;
  } catch (error) {
    console.error("Error fetching homepage content:", error);
    return {
      hero: null, editorsPicks: [], verticalList: [], articleList: [], hikayeler: [], dailyBriefing: null, gundemSection3Articles: []
    };
  }
}

