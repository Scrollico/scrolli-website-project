import { fetchArticles } from "./client";
import { getMediaUrl } from "./types";

export interface AuthorWithLatestArticle {
  name: string;
  slug: string;
  avatar?: string;
  latestArticle: {
    id: string;
    title: string;
  };
}

/**
 * Get unique authors with their latest articles from Payload CMS
 * Returns up to 5 authors, each with their most recent article
 */
export async function getAuthorsWithLatestArticles(
  limit: number = 5,
  locale: string = "tr"
): Promise<AuthorWithLatestArticle[]> {
  try {
    // Fetch recent articles to get authors
    const articles = await fetchArticles({
      sort: "-publishedAt",
      limit: 24, // Fetch enough to get diverse authors
      depth: 2, // Include author relationship
      locale,
    });

    // Map to track unique authors and their latest article
    const authorMap = new Map<string, AuthorWithLatestArticle>();

    for (const article of articles) {
      // Extract author information
      let authorName: string | undefined;
      let authorSlug: string | undefined;
      let authorAvatar: string | undefined;

      if (article.author && typeof article.author === "object") {
        authorName = article.author.name;
        authorSlug = article.author.slug || authorName?.toLowerCase().replace(/\s+/g, "-");
        if (article.author.avatar) {
          authorAvatar = getMediaUrl(article.author.avatar);
        }
      } else if (typeof article.author === "string") {
        authorName = article.author;
        authorSlug = article.author.toLowerCase().replace(/\s+/g, "-");
      }

      // Skip if no author name or empty string
      if (!authorName || typeof authorName !== "string" || authorName.trim() === "") continue;

      // If we haven't seen this author yet, add them with their latest article
      if (!authorMap.has(authorName)) {
        authorMap.set(authorName, {
          name: authorName,
          slug: authorSlug || authorName.toLowerCase().replace(/\s+/g, "-"),
          avatar: authorAvatar,
          latestArticle: {
            id: article.slug || article.id,
            title: article.title,
          },
        });
      }

      // Stop once we have enough unique authors
      if (authorMap.size >= limit) {
        break;
      }
    }

    // Convert map to array
    return Array.from(authorMap.values()).slice(0, limit);
  } catch (error) {
    console.error("Error fetching authors with latest articles:", error);
    return [];
  }
}
