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
interface Section3WrapperProps {
  articles?: any[]; // PayloadGundem articles
}

/**
 * Section3Wrapper
 * Groups pre-fetched Gündem articles by category
 */
export default function Section3Wrapper({ articles = [] }: Section3WrapperProps) {
  let articlesByCategory: ArticlesByCategory = {
    tümü: [],
    eksen: [],
    zest: [],
    finans: [],
    gelecek: [],
  };

  try {
    // Map Payload articles to Article interface
    const mappedArticles = articles.map(mapGundemToArticle);

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
    console.error("Error processing articles for Section3:", error);
  }

  return <Section3Dynamic articlesByCategory={articlesByCategory} />;
}
