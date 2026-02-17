/**
 * Content Utilities
 *
 * Functions for fetching, filtering, and searching content
 * Following Arc Publishing principles for content architecture
 * 
 * Now uses Payload CMS as the data source instead of static blog.json
 */

import { Article } from "@/types/content";
import {
  getArticleBySlug,
  getArticlesByCategory as getPayloadArticlesByCategory,
  getRecentArticles as getPayloadRecentArticles,
  getFeaturedArticles as getPayloadFeaturedArticles,
  fetchArticles,
} from "./payload/client";
import { mapGundemToArticle, mapHikayelerToArticle } from "./payload/types";
import { getLocale } from "./dictionaries";
// Note: serializeRichText import removed - content is already HTML string when using locale=tr

/**
 * Remove Mailchimp forms and all script tags from article content
 * This function must be deterministic for SSR/client hydration
 */
function removeMailchimpForms(content: string): string {
  if (!content || typeof content !== 'string') return content || '';
  
  let cleaned = content;
  
  // Remove ALL script tags (not just Mailchimp) to prevent hydration issues
  cleaned = cleaned.replace(
    /<script[^>]*>[\s\S]*?<\/script>/gi,
    ''
  );
  
  // Remove Mailchimp embed shell and all its contents (non-greedy, multiline)
  cleaned = cleaned.replace(
    /<div[^>]*id\s*=\s*["']mc_embed_shell["'][^>]*>[\s\S]*?<\/div>/gi,
    ''
  );
  
  // Remove Mailchimp form elements
  cleaned = cleaned.replace(
    /<form[^>]*id\s*=\s*["']mc-embedded-subscribe-form["'][^>]*>[\s\S]*?<\/form>/gi,
    ''
  );
  
  // Remove Mailchimp subscription button
  cleaned = cleaned.replace(
    /<input[^>]*id\s*=\s*["']mc-embedded-subscribe["'][^>]*>/gi,
    ''
  );
  
  // Remove Mailchimp subscription button with value "Ücretsiz abone ol"
  cleaned = cleaned.replace(
    /<input[^>]*value\s*=\s*["']Ücretsiz abone ol["'][^>]*>/gi,
    ''
  );
  
  // Remove Mailchimp link tags
  cleaned = cleaned.replace(
    /<link[^>]*mc-embedcode[^>]*>/gi,
    ''
  );
  
  // Remove any remaining Mailchimp-related divs
  cleaned = cleaned.replace(
    /<div[^>]*mc_embed[^>]*>[\s\S]*?<\/div>/gi,
    ''
  );
  
  // Remove any remaining form elements (safety check)
  cleaned = cleaned.replace(
    /<form[^>]*>[\s\S]*?<\/form>/gi,
    ''
  );
  
  // Remove data-rt-embed-type divs (email subscription forms)
  cleaned = cleaned.replace(
    /<div[^>]*data-rt-embed-type[^>]*>[\s\S]*?<\/div>/gi,
    ''
  );
  
  // Remove divs containing "E-posta Adresiniz" or similar email form text
  cleaned = cleaned.replace(
    /<div[^>]*>[\s\S]*?E-posta Adresiniz[\s\S]*?<\/div>/gi,
    ''
  );
  
  // Clean up any empty paragraphs or divs left behind
  cleaned = cleaned.replace(/<p[^>]*>\s*<\/p>/gi, '');
  cleaned = cleaned.replace(/<div[^>]*>\s*<\/div>/gi, '');
  
  // Normalize whitespace to ensure consistent output (deterministic)
  // This must be done in a specific order to ensure server/client match
  // Step 1: Replace multiple consecutive newlines (2+) with single newline
  cleaned = cleaned.replace(/\n{2,}/g, '\n');
  // Step 2: Replace multiple spaces/tabs with single space (but preserve intentional spacing)
  cleaned = cleaned.replace(/[ \t]+/g, ' ');
  // Step 3: Remove any trailing/leading whitespace from each line
  cleaned = cleaned.split('\n').map(line => line.trim()).join('\n');
  // Step 4: Remove any trailing newlines at the end
  cleaned = cleaned.replace(/\n+$/, '');
  // Step 5: Remove any leading newlines at the start
  cleaned = cleaned.replace(/^\n+/, '');
  // Step 6: Final trim to ensure no leading/trailing whitespace
  cleaned = cleaned.trim();
  
  return cleaned;
}

/**
 * Find an article by ID (slug) from Payload CMS
 * Supports both gundem and hikayeler collections
 */
export async function findArticleById(articleId: string): Promise<Article | null> {
  try {
    // Try to find article by slug in Payload CMS
    const article = await getArticleBySlug(articleId);
    
    if (!article) {
      return null;
    }

    const locale = await getLocale();

    // Map Payload article to Article interface
    // Content is already handled in mapping functions (HTML string or serialized)
    const mappedArticle = article.source === "Gündem"
      ? mapGundemToArticle(article, locale)
      : mapHikayelerToArticle(article, locale);

    // Clean Mailchimp forms from content (content is already HTML string)
    // BUT: Skip cleaning for hikayeler articles with inline scripts (instorier.com)
    // These scripts are intentional external story content
    if (mappedArticle.content && typeof mappedArticle.content === "string") {
      const isHikayelerWithInlineScript = 
        article.source === "Hikayeler" && 
        mappedArticle.content.includes('instorier.com');
      
      if (!isHikayelerWithInlineScript) {
        mappedArticle.content = removeMailchimpForms(mappedArticle.content);
      }
    }

    return mappedArticle;
  } catch (error) {
    console.error(`Error fetching article ${articleId} from Payload:`, error);
    // Return null for graceful degradation
    return null;
  }
}

/**
 * Get all articles from Payload CMS (both gundem and hikayeler collections)
 * Deduplicates articles by ID to prevent duplicate keys in React
 */
export async function getAllArticles(limit = 24): Promise<Article[]> {
  try {
    const payloadArticles = await fetchArticles({
      sort: "-publishedAt",
      limit,
      depth: 2,
    });

    const locale = await getLocale();

    // Map Payload articles to Article interface
    // Content is already HTML string when using locale=tr, no serialization needed
    const articles: Article[] = payloadArticles.map((article) => {
      return article.source === "Gündem"
        ? mapGundemToArticle(article, locale)
        : mapHikayelerToArticle(article, locale);
    });

    // Deduplicate by ID
    const seenIds = new Set<string>();
    return articles.filter((article) => {
      if (seenIds.has(article.id)) {
        return false;
      }
      seenIds.add(article.id);
      return true;
    });
  } catch (error) {
    console.error("Error fetching all articles from Payload:", error);
    return [];
  }
}

/**
 * Get articles by category from Payload CMS
 * Note: Categories are only on gundem collection
 */
export async function getArticlesByCategory(category: string): Promise<Article[]> {
  try {
    const response = await getPayloadArticlesByCategory(category);
    const locale = await getLocale();
    
    // Content is already HTML string when using locale=tr, no serialization needed
    return response.docs.map((article) => mapGundemToArticle(article, locale));
  } catch (error) {
    console.error(`Error fetching articles for category ${category}:`, error);
    return [];
  }
}

/**
 * Get articles by author from Payload CMS
 */
export async function getArticlesByAuthor(author: string): Promise<Article[]> {
  try {
    // Fetch articles and filter by author name
    const payloadArticles = await fetchArticles({
      sort: "-publishedAt",
      limit: 24,
      depth: 2,
    });

    const locale = await getLocale();

      // Content is already HTML string when using locale=tr, handled in mapping functions
      // Content is already HTML string when using locale=tr, handled in mapping functions
      const articles = payloadArticles
        .filter((article) => {
          const authorName = typeof article.author === "object"
            ? article.author?.name
            : article.author;
          return authorName?.toLowerCase() === author.toLowerCase();
        })
        .map((article) => {
          return article.source === "Gündem"
            ? mapGundemToArticle(article, locale)
            : mapHikayelerToArticle(article, locale);
        });

    return articles;
  } catch (error) {
    console.error(`Error fetching articles for author ${author}:`, error);
    return [];
  }
}

/**
 * Get related articles using Payload relationships, with fallback to category-based matching
 * Ensures no duplicate articles are returned
 */
export async function getRelatedArticles(
  currentArticle: Article,
  limit: number = 6
): Promise<Article[]> {
  try {
    // First, try to get the original Payload article to access relationships
    const { getArticleBySlug } = await import("@/lib/payload/client");
    const payloadArticle = await getArticleBySlug(currentArticle.id);
    const locale = await getLocale();
    
    const seenIds = new Set<string>([currentArticle.id]);
    const result: Article[] = [];

    // Step 1: Use explicit relationships from Payload if available
    if (payloadArticle) {
      let relatedItems: Array<any> = [];
      
      if (payloadArticle.source === "Gündem" && payloadArticle.relatedArticles) {
        // Gündem has polymorphic relatedArticles (can be gundem or hikayeler)
        relatedItems = payloadArticle.relatedArticles
          .map(rel => {
            if (typeof rel.value === "string") {
              // If it's just an ID string, we'd need to fetch it
              // But with depth=2, it should be populated
              return null;
            }
            return rel.value;
          })
          .filter(Boolean);
      } else if (payloadArticle.source === "Hikayeler" && payloadArticle.relatedStories) {
        // Hikayeler has relatedStories (only hikayeler)
        relatedItems = payloadArticle.relatedStories
          .map(rel => {
            if (typeof rel.value === "string") {
              return null;
            }
            return rel.value;
          })
          .filter(Boolean);
      }

      // Map related items to Article interface
      for (const relatedItem of relatedItems) {
        if (result.length >= limit) break;
        if (!relatedItem || seenIds.has(relatedItem.slug || relatedItem.id)) continue;

        const mapped = relatedItem.source === "Gündem"
          ? mapGundemToArticle(relatedItem, locale)
          : mapHikayelerToArticle(relatedItem, locale);

        if (!seenIds.has(mapped.id)) {
          seenIds.add(mapped.id);
          result.push(mapped);
        }
      }
    }

    // Step 2: If not enough related articles from relationships, use category-based fallback
    if (result.length < limit) {
      const allArticles = await getAllArticles(50);
      
      // First, get articles from same category
      for (const article of allArticles) {
        if (result.length >= limit) break;
        
        if (
          !seenIds.has(article.id) &&
          article.category === currentArticle.category
        ) {
          seenIds.add(article.id);
          result.push(article);
        }
      }

      // If still not enough, fill with other articles
      if (result.length < limit) {
        for (const article of allArticles) {
          if (result.length >= limit) break;
          
          if (!seenIds.has(article.id)) {
            seenIds.add(article.id);
            result.push(article);
          }
        }
      }
    }

    // Final safety check: ensure no duplicates by ID
    const finalResult: Article[] = [];
    const finalSeenIds = new Set<string>();
    
    for (const article of result) {
      if (!finalSeenIds.has(article.id)) {
        finalSeenIds.add(article.id);
        finalResult.push(article);
      }
    }

    return finalResult.slice(0, limit);
  } catch (error) {
    console.error("Error fetching related articles:", error);
    return [];
  }
}

/**
 * Get recent articles from Payload CMS
 */
export async function getRecentArticles(limit: number = 10): Promise<Article[]> {
  try {
    const payloadArticles = await getPayloadRecentArticles(limit);
    const locale = await getLocale();
    
    // Content is already HTML string when using locale=tr, handled in mapping functions
    return payloadArticles.map((article) =>
      article.source === "Gündem"
        ? mapGundemToArticle(article, locale)
        : mapHikayelerToArticle(article, locale)
    );
  } catch (error) {
    console.error("Error fetching recent articles:", error);
    return [];
  }
}

/**
 * Get featured articles from Payload CMS
 */
export async function getFeaturedArticles(): Promise<Article[]> {
  try {
    const payloadArticles = await getPayloadFeaturedArticles();
    const locale = await getLocale();
    
    // Content is already HTML string when using locale=tr, handled in mapping functions
    return payloadArticles.map((article) =>
      article.source === "Gündem"
        ? mapGundemToArticle(article, locale)
        : mapHikayelerToArticle(article, locale)
    );
  } catch (error) {
    console.error("Error fetching featured articles:", error);
    return [];
  }
}

/**
 * Get trending articles from Payload CMS
 * For now, returns recent featured articles as trending
 * Can be enhanced with actual trending logic later
 */
export async function getTrendingArticles(): Promise<Article[]> {
  // Use featured articles as trending for now
  return getFeaturedArticles();
}

/**
 * Get blog data structure (deprecated - use Payload API directly)
 * This function is kept for backward compatibility but returns empty structure
 * Components should be updated to use Payload API functions directly
 * @deprecated Use Payload API functions instead
 */
export function getBlogData(): any {
  console.warn("getBlogData() is deprecated. Use Payload API functions instead.");
  return {
    featured: { mainArticle: null, sideArticles: [] },
    trending: { articles: [] },
    featuredSlider: { articles: [] },
    todayHighlights: { articles: [] },
    mostRecent: { mainArticles: [], sideArticles: [] },
    Culture: { mainArticle: null, articles: [], sideArticles: [] },
    theStartup: { mainArticle: null, articles: [], sideArticles: [] },
    RyanMarkPosts: { articles: [] },
    hightlightPosts: { articles: [] },
    relatedPosts: { articles: [] },
  };
}
