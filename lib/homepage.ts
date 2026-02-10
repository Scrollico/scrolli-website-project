import { fetchArticles, fetchHikayeler } from "./payload/client";
import { PayloadGundem, PayloadHikayeler } from "./payload/types";

export interface HomepageContent {
  hero: PayloadGundem | PayloadHikayeler | null;
  editorsPicks: Array<PayloadGundem | PayloadHikayeler>;
  verticalList: Array<PayloadGundem | PayloadHikayeler>;
  articleList: Array<PayloadGundem | PayloadHikayeler>;
  hikayeler: Array<PayloadHikayeler>; // Dedicated hikayeler section
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
      // ============================================
      // LAYOUT POSITION MODE (when field exists)
      // ============================================
      
      // Step 0: Get Hikayeler articles for top section and dedicated section
      const allHikayeler = await fetchHikayeler({
        limit: 12,
        depth: 2,
      });
      const topHikayeler = allHikayeler.slice(0, 4);

      // Step 1: Get manually pinned articles
      const pinnedHero = await fetchArticles({
        layoutPosition: "hero",
        limit: 1,
        depth: 2,
      });

      const pinnedEditorsPicks = await fetchArticles({
        layoutPosition: "editors-picks",
        limit: 3,
        depth: 2,
      });

      // Step 2: Assemble sections
      // Hero: Pinned hero OR first Hikaye
      const hero = pinnedHero[0] || topHikayeler[0] || null;
      
      const usedSlugs = hero ? [hero.slug] : [];

      // Editors Picks: Pinned picks + fill with topHikayeler
      const editorsPicks: Array<PayloadGundem | PayloadHikayeler> = [...pinnedEditorsPicks];
      usedSlugs.push(...editorsPicks.map(a => a.slug));

      for (const article of topHikayeler) {
        if (editorsPicks.length >= 3) break;
        if (!usedSlugs.includes(article.slug)) {
          editorsPicks.push(article);
          usedSlugs.push(article.slug);
        }
      }

      // Calculate auto-fill needs
      const editorsPicksNeeded = 3 - editorsPicks.length;

      // Get auto-fill articles (excluding used)
      const allRecentArticles = await fetchArticles({
        sort: "-publishedAt",
        limit: 50,
        depth: 2,
      });

      // Fill remaining editors picks with recent articles
      if (editorsPicksNeeded > 0) {
        for (const article of allRecentArticles) {
          if (editorsPicks.length >= 3) break;
          if (!usedSlugs.includes(article.slug)) {
            editorsPicks.push(article);
            usedSlugs.push(article.slug);
          }
        }
      }

      const autoArticles = allRecentArticles
        .filter(
          (article) =>
            article.layoutPosition !== "exclude" &&
            !usedSlugs.includes(article.slug)
        );

      const verticalList = autoArticles.slice(0, 6);
      
      const usedSlugsAfterVerticalList = [
        ...usedSlugs,
        ...verticalList.map((a) => a.slug)
      ].filter(Boolean);
      
      const articleList = allRecentArticles
        .filter((article) => !usedSlugsAfterVerticalList.includes(article.slug))
        .slice(0, 3);

      // Dedicated Hikayeler section (excluding those used at the top)
      const hikayeler = allHikayeler
        .filter(a => !usedSlugs.includes(a.slug))
        .slice(0, 8);

      return {
        hero,
        editorsPicks,
        verticalList,
        articleList,
        hikayeler,
      };
    } else {
      // ============================================
      // FALLBACK MODE (using isFeatured + ordering)
      // ============================================
      // Step 1: Get Hikayeler articles for top section and dedicated section
      const allHikayeler = await fetchHikayeler({
        limit: 12,
        depth: 2,
      });
      const topHikayeler = allHikayeler.slice(0, 4);

      // Step 2: Get featured articles sorted by ordering
      const featuredArticles = await fetchArticles({
        where: { isFeatured: { equals: true } },
        sort: "-ordering,-publishedAt",
        limit: 10,
        depth: 2,
      });

      // Step 3: Get recent articles for auto-fill
      const allRecentArticles = await fetchArticles({
        sort: "-publishedAt",
        limit: 50,
        depth: 2,
      });

      // Step 4: Assemble sections
      // Hero: First Hikaye, or first featured, or first recent
      const hero = topHikayeler[0] || featuredArticles[0] || allRecentArticles[0] || null;

      // Editors Picks: Next 3 Hikayeler, then featured, then recent
      const usedSlugs = hero ? [hero.slug] : [];
      const editorsPicks: Array<PayloadGundem | PayloadHikayeler> = [];

      // Fill with remaining topHikayeler (up to 3)
      for (const article of topHikayeler) {
        if (editorsPicks.length >= 3) break;
        if (!usedSlugs.includes(article.slug)) {
          editorsPicks.push(article);
          usedSlugs.push(article.slug);
        }
      }

      // Then fill with featured
      for (const article of featuredArticles) {
        if (editorsPicks.length >= 3) break;
        if (!usedSlugs.includes(article.slug)) {
          editorsPicks.push(article);
          usedSlugs.push(article.slug);
        }
      }

      // Then fill with recent
      for (const article of allRecentArticles) {
        if (editorsPicks.length >= 3) break;
        if (!usedSlugs.includes(article.slug)) {
          editorsPicks.push(article);
          usedSlugs.push(article.slug);
        }
      }

      // Vertical list: Remaining recent articles (excluding used ones)
      const usedSlugsAfterEditorsPicks = [
        ...usedSlugs,
        ...editorsPicks.map((a) => a.slug)
      ].filter(Boolean);
      
      const remainingArticles = allRecentArticles.filter(
        (article) => !usedSlugsAfterEditorsPicks.includes(article.slug)
      );
      const verticalList = remainingArticles.slice(0, 6);
      
      const usedSlugsAfterVerticalList = [
        ...usedSlugsAfterEditorsPicks,
        ...verticalList.map((a) => a.slug)
      ].filter(Boolean);
      
      // ArticleList: Next 3 articles after verticalList
      const articleList = allRecentArticles
        .filter((article) => !usedSlugsAfterVerticalList.includes(article.slug))
        .slice(0, 3);

      // Dedicated Hikayeler section (excluding those used at the top)
      const hikayeler = allHikayeler
        .filter(a => !usedSlugsAfterEditorsPicks.includes(a.slug))
        .slice(0, 8);

      return {
        hero,
        editorsPicks,
        verticalList,
        articleList,
        hikayeler,
      };
    }
  } catch (error) {
    console.error("Error fetching homepage content:", error);
    // Return empty structure on error
    return {
      hero: null,
      editorsPicks: [],
      verticalList: [],
      articleList: [],
      hikayeler: [],
    };
  }
}
