import { getAllGundemArticles } from "@/lib/payload/client";
import { mapGundemToArticle } from "@/lib/payload/types";
import { Article } from "@/types/content";
import Section3Dynamic from "./Section3Dynamic";

interface ArticlesByCategory {
  tümü: Article[];
  eksen: Article[];
  zest: Article[];
  finans: Article[];
  gelecek: Article[];
}

/**
 * Server component wrapper for Section3
 * Fetches Gündem articles from Payload CMS and groups them by category
 * Only Gündem articles are shown (Hikayeler are excluded)
 */
export default async function Section3Wrapper() {
  let articlesByCategory: ArticlesByCategory = {
    tümü: [],
    eksen: [],
    zest: [],
    finans: [],
    gelecek: [],
  };

  try {
    // Fetch all Gündem articles from Payload CMS
    const gundemArticles = await getAllGundemArticles(50);

    // Map Payload articles to Article interface
    const mappedArticles = gundemArticles.map(mapGundemToArticle);

    // Group articles by category slug
    const grouped: ArticlesByCategory = {
      tümü: mappedArticles, // All Gündem articles
      eksen: [],
      zest: [],
      finans: [],
      gelecek: [],
    };

    // Filter articles by category
    for (const article of mappedArticles) {
      const categorySlug = (article.category || "").toLowerCase().trim();
      
      if (categorySlug === "eksen") {
        grouped.eksen.push(article);
      } else if (categorySlug === "zest") {
        grouped.zest.push(article);
      } else if (categorySlug === "finans") {
        grouped.finans.push(article);
      } else if (categorySlug === "gelecek") {
        grouped.gelecek.push(article);
      }
    }

    articlesByCategory = grouped;
  } catch (error) {
    console.error("Error fetching articles for Section3:", error);
    // Return empty arrays on error for graceful degradation
  }

  return <Section3Dynamic articlesByCategory={articlesByCategory} />;
}
