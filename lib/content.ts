/**
 * Content Utilities
 *
 * Functions for fetching, filtering, and searching content
 * Following Arc Publishing principles for content architecture
 */

import { BlogData, Article } from "@/types/content";
import blogData from "@/data/blog.json";

// Type assertion for blog data
const typedBlogData = blogData as BlogData;

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
 * If an article doesn't carry body content, try to hydrate it with the
 * richer version stored in the Gündem CSV feed.
 * This function uses dynamic imports to avoid client-side fs errors.
 */
function enrichWithGundemContent(article: Article, articleId: string): Article {
  const hasBody =
    typeof article.content === "string" && article.content.trim().length > 0;

  if (hasBody) {
    // Still clean Mailchimp forms from existing content
    // removeMailchimpForms already normalizes whitespace deterministically
    return {
      ...article,
      content: removeMailchimpForms(article.content || ''),
    };
  }

  // On server-side, try to load Gündem content dynamically
  // This is only called from server-side functions (findArticleById)
  if (typeof window === 'undefined') {
    try {
      // Dynamic import for server-side only
      // Use a try-catch with explicit path resolution
      let gundemModule;
      try {
        gundemModule = require("./gundem-content");
      } catch (requireError) {
        // If require fails, return article with empty content
        return {
          ...article,
          content: article.content || '',
        };
      }
      
      const gundemArticle = gundemModule?.getGundemArticleById?.(articleId);
      if (gundemArticle && gundemArticle.content) {
        // removeMailchimpForms already normalizes whitespace deterministically
        return {
          ...article,
          content: removeMailchimpForms(gundemArticle.content || article.content || ''),
          excerpt: article.excerpt || gundemArticle.excerpt,
          image: article.image || gundemArticle.image,
          readTime: article.readTime || gundemArticle.readTime,
          seoTitle: article.seoTitle || gundemArticle.seoTitle,
          seoDescription: article.seoDescription || gundemArticle.seoDescription,
        };
      }
    } catch (error) {
      // Silently fail and return article with existing content (or empty)
      console.warn(`Failed to enrich article ${articleId} with Gündem content:`, error);
    }
  }

  // Always return article with content (even if empty string)
  return {
    ...article,
    content: article.content || '',
  };
}

/**
 * Find an article by ID across all sections
 */
export function findArticleById(articleId: string): Article | null {
  // Search in featured section
  if (typedBlogData.featured.mainArticle.id === articleId) {
    return enrichWithGundemContent(
      typedBlogData.featured.mainArticle,
      articleId
    );
  }
  const featuredSideArticle = typedBlogData.featured.sideArticles.find(
    (article) => article.id === articleId
  );
  if (featuredSideArticle)
    return enrichWithGundemContent(featuredSideArticle, articleId);

  // Search in trending section
  const trendingArticle = typedBlogData.trending.articles.find(
    (article) => article.id === articleId
  );
  if (trendingArticle)
    return enrichWithGundemContent(trendingArticle, articleId);

  // Search in featuredSlider section
  const sliderArticle = typedBlogData.featuredSlider.articles.find(
    (article) => article.id === articleId
  );
  if (sliderArticle)
    return enrichWithGundemContent(sliderArticle, articleId);

  // Search in todayHighlights section
  const highlightArticle = typedBlogData.todayHighlights.articles.find(
    (article) => article.id === articleId
  );
  if (highlightArticle)
    return enrichWithGundemContent(highlightArticle, articleId);

  // Search in mostRecent section
  const mostRecentMainArticle = typedBlogData.mostRecent.mainArticles.find(
    (article) => article.id === articleId
  );
  if (mostRecentMainArticle)
    return enrichWithGundemContent(mostRecentMainArticle, articleId);
  const mostRecentSideArticle = typedBlogData.mostRecent.sideArticles.find(
    (article) => article.id === articleId
  );
  if (mostRecentSideArticle)
    return enrichWithGundemContent(mostRecentSideArticle, articleId);

  // Search in Culture section
  if (typedBlogData.Culture.mainArticle.id === articleId) {
    return enrichWithGundemContent(
      typedBlogData.Culture.mainArticle,
      articleId
    );
  }
  const cultureArticle = typedBlogData.Culture.articles.find(
    (article) => article.id === articleId
  );
  if (cultureArticle)
    return enrichWithGundemContent(cultureArticle, articleId);
  const cultureSideArticle = typedBlogData.Culture.sideArticles.find(
    (article) => article.id === articleId
  );
  if (cultureSideArticle)
    return enrichWithGundemContent(cultureSideArticle, articleId);

  // Search in theStartup section
  if (typedBlogData.theStartup.mainArticle.id === articleId) {
    return enrichWithGundemContent(
      typedBlogData.theStartup.mainArticle,
      articleId
    );
  }
  const startupArticle = typedBlogData.theStartup.articles.find(
    (article) => article.id === articleId
  );
  if (startupArticle)
    return enrichWithGundemContent(startupArticle, articleId);

  // Search in RyanMarkPosts section
  const ryanMarkArticle = typedBlogData.RyanMarkPosts.articles.find(
    (article) => article.id === articleId
  );
  if (ryanMarkArticle)
    return enrichWithGundemContent(ryanMarkArticle, articleId);

  // Search in hightlightPosts section
  const highlightPostArticle = typedBlogData.hightlightPosts.articles.find(
    (article) => article.id === articleId
  );
  if (highlightPostArticle)
    return enrichWithGundemContent(highlightPostArticle, articleId);

  // Search in relatedPosts section
  const relatedPost = typedBlogData.relatedPosts.articles.find(
    (article) => article.id === articleId
  );
  if (relatedPost) return enrichWithGundemContent(relatedPost, articleId);

  // Search in Gündem articles (server-side only, using dynamic require)
  if (typeof window === 'undefined') {
    try {
      const gundemModule = require("./gundem-content");
      const gundemArticle = gundemModule.getGundemArticleById(articleId);
      if (gundemArticle) {
        return {
          ...gundemArticle,
          content: removeMailchimpForms(gundemArticle.content || ''),
        };
      }
    } catch (error) {
      // Silently fail if module not available (client-side)
    }
  }

  return null;
}

/**
 * Get all articles from all sections (client-safe, excludes Gündem articles)
 * For server-side use with Gündem articles, use getAllArticlesWithGundem()
 * Deduplicates articles by ID to prevent duplicate keys in React
 */
export function getAllArticles(): Article[] {
  const articles: Article[] = [];
  const seenIds = new Set<string>();

  // Helper to add article if not seen
  const addIfUnique = (article: Article) => {
    if (article && article.id && !seenIds.has(article.id)) {
      seenIds.add(article.id);
      articles.push(article);
    }
  };

  // Featured
  addIfUnique(typedBlogData.featured.mainArticle);
  typedBlogData.featured.sideArticles.forEach(addIfUnique);

  // Trending
  typedBlogData.trending.articles.forEach(addIfUnique);

  // Featured Slider
  typedBlogData.featuredSlider.articles.forEach(addIfUnique);

  // Today Highlights
  typedBlogData.todayHighlights.articles.forEach(addIfUnique);

  // Most Recent
  typedBlogData.mostRecent.mainArticles.forEach(addIfUnique);
  typedBlogData.mostRecent.sideArticles.forEach(addIfUnique);

  // Culture
  addIfUnique(typedBlogData.Culture.mainArticle);
  typedBlogData.Culture.articles.forEach(addIfUnique);
  typedBlogData.Culture.sideArticles.forEach(addIfUnique);

  // The Startup
  addIfUnique(typedBlogData.theStartup.mainArticle);
  typedBlogData.theStartup.articles.forEach(addIfUnique);

  // Ryan Mark Posts
  typedBlogData.RyanMarkPosts.articles.forEach(addIfUnique);

  // Highlight Posts
  typedBlogData.hightlightPosts.articles.forEach(addIfUnique);

  // Related Posts
  typedBlogData.relatedPosts.articles.forEach(addIfUnique);

  // Note: Gündem articles excluded for client-side compatibility
  // They are only available server-side via findArticleById()

  return articles;
}

/**
 * Get articles by category
 */
export function getArticlesByCategory(category: string): Article[] {
  return getAllArticles().filter(
    (article) => article.category.toLowerCase() === category.toLowerCase()
  );
}

/**
 * Get articles by author
 */
export function getArticlesByAuthor(author: string): Article[] {
  return getAllArticles().filter(
    (article) => article.author.toLowerCase() === author.toLowerCase()
  );
}

/**
 * Get related articles (by category, excluding current article)
 * Ensures no duplicate articles are returned
 */
export function getRelatedArticles(
  currentArticle: Article,
  limit: number = 6
): Article[] {
  const allArticles = getAllArticles();
  const seenIds = new Set<string>([currentArticle.id]);
  const result: Article[] = [];
  
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

  // If not enough articles in same category, fill with other articles
  if (result.length < limit) {
    for (const article of allArticles) {
      if (result.length >= limit) break;
      
      if (!seenIds.has(article.id)) {
        seenIds.add(article.id);
        result.push(article);
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

  return finalResult;
}

/**
 * Get recent articles
 */
export function getRecentArticles(limit: number = 10): Article[] {
  return getAllArticles()
    .sort((a, b) => {
      // Simple date comparison (in production, use proper date parsing)
      return b.date.localeCompare(a.date);
    })
    .slice(0, limit);
}

/**
 * Get featured articles
 */
export function getFeaturedArticles(): Article[] {
  return [
    typedBlogData.featured.mainArticle,
    ...typedBlogData.featured.sideArticles,
  ];
}

/**
 * Get trending articles
 */
export function getTrendingArticles(): Article[] {
  return typedBlogData.trending.articles;
}

/**
 * Export typed blog data
 */
export function getBlogData(): BlogData {
  return typedBlogData;
}
