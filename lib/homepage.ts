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
export async function getHomepageContent(): Promise<HomepageContent> {
  try {
    const ENABLE_LAYOUT_POSITION = process.env.ENABLE_LAYOUT_POSITION === "true";

    if (ENABLE_LAYOUT_POSITION) {
      // Step 1: Parallelize all initial data fetching
      const [dailyBriefingRes, allHikayeler, pinnedHero, pinnedEditorsPicks, allRecentArticles, gundemSection3Res] = await Promise.all([
        fetchDailyBriefings({ limit: 1, sort: "-briefingDate" }),
        fetchHikayeler({ limit: 12, depth: 2 }),
        fetchArticles({ layoutPosition: "hero", limit: 1, depth: 2 }),
        fetchArticles({ layoutPosition: "editors-picks", limit: 3, depth: 2 }),
        fetchArticles({ sort: "-publishedAt", limit: 50, depth: 2 }),
        fetchPayload<PayloadGundem>("gundem", { sort: "-publishedAt", limit: 50, depth: 2 }),
      ]);

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

      return { hero, editorsPicks, verticalList, articleList, hikayeler, dailyBriefing, gundemSection3Articles };
    } else {
      // ============================================
      // FALLBACK MODE (parallelized)
      // ============================================

      // Step 1: Fire all fetches at once
      const [dailyBriefingRes, curationsRes, allHikayeler, featuredArticles, allRecentArticles, gundemSection3Res] = await Promise.all([
        fetchDailyBriefings({ limit: 1, sort: "-briefingDate" }),
        fetchCurations({ limit: 3, sort: "-publishedAt" }),
        fetchHikayeler({ limit: 12, depth: 2 }),
        fetchArticles({
          where: { isFeatured: { equals: true } },
          sort: "-ordering,-publishedAt",
          limit: 10,
          depth: 2,
        }),
        fetchArticles({ sort: "-publishedAt", limit: 50, depth: 2 }),
        fetchPayload<PayloadGundem>("gundem", { sort: "-publishedAt", limit: 50, depth: 2 }),
      ]);

      const dailyBriefing = dailyBriefingRes.docs[0] || null;
      const curations = curationsRes.docs || [];
      const topHikayeler = allHikayeler.slice(0, 4);
      const gundemSection3Articles = gundemSection3Res.docs || [];

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

      return { hero, editorsPicks, verticalList, articleList, hikayeler, dailyBriefing, gundemSection3Articles };
    }
  } catch (error) {
    console.error("Error fetching homepage content:", error);
    return {
      hero: null, editorsPicks: [], verticalList: [], articleList: [], hikayeler: [], dailyBriefing: null, gundemSection3Articles: []
    };
  }
}

