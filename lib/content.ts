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
 * Find an article by ID across all sections
 */
export function findArticleById(articleId: string): Article | null {
  // Search in featured section
  if (typedBlogData.featured.mainArticle.id === articleId) {
    return typedBlogData.featured.mainArticle;
  }
  const featuredSideArticle = typedBlogData.featured.sideArticles.find(
    (article) => article.id === articleId
  );
  if (featuredSideArticle) return featuredSideArticle;

  // Search in trending section
  const trendingArticle = typedBlogData.trending.articles.find(
    (article) => article.id === articleId
  );
  if (trendingArticle) return trendingArticle;

  // Search in featuredSlider section
  const sliderArticle = typedBlogData.featuredSlider.articles.find(
    (article) => article.id === articleId
  );
  if (sliderArticle) return sliderArticle;

  // Search in todayHighlights section
  const highlightArticle = typedBlogData.todayHighlights.articles.find(
    (article) => article.id === articleId
  );
  if (highlightArticle) return highlightArticle;

  // Search in mostRecent section
  const mostRecentMainArticle = typedBlogData.mostRecent.mainArticles.find(
    (article) => article.id === articleId
  );
  if (mostRecentMainArticle) return mostRecentMainArticle;
  const mostRecentSideArticle = typedBlogData.mostRecent.sideArticles.find(
    (article) => article.id === articleId
  );
  if (mostRecentSideArticle) return mostRecentSideArticle;

  // Search in Culture section
  if (typedBlogData.Culture.mainArticle.id === articleId) {
    return typedBlogData.Culture.mainArticle;
  }
  const cultureArticle = typedBlogData.Culture.articles.find(
    (article) => article.id === articleId
  );
  if (cultureArticle) return cultureArticle;
  const cultureSideArticle = typedBlogData.Culture.sideArticles.find(
    (article) => article.id === articleId
  );
  if (cultureSideArticle) return cultureSideArticle;

  // Search in theStartup section
  if (typedBlogData.theStartup.mainArticle.id === articleId) {
    return typedBlogData.theStartup.mainArticle;
  }
  const startupArticle = typedBlogData.theStartup.articles.find(
    (article) => article.id === articleId
  );
  if (startupArticle) return startupArticle;

  // Search in RyanMarkPosts section
  const ryanMarkArticle = typedBlogData.RyanMarkPosts.articles.find(
    (article) => article.id === articleId
  );
  if (ryanMarkArticle) return ryanMarkArticle;

  // Search in hightlightPosts section
  const highlightPostArticle = typedBlogData.hightlightPosts.articles.find(
    (article) => article.id === articleId
  );
  if (highlightPostArticle) return highlightPostArticle;

  // Search in relatedPosts section
  const relatedPost = typedBlogData.relatedPosts.articles.find(
    (article) => article.id === articleId
  );
  if (relatedPost) return relatedPost;

  return null;
}

/**
 * Get all articles from all sections
 */
export function getAllArticles(): Article[] {
  const articles: Article[] = [];

  // Featured
  articles.push(typedBlogData.featured.mainArticle);
  articles.push(...typedBlogData.featured.sideArticles);

  // Trending
  articles.push(...typedBlogData.trending.articles);

  // Featured Slider
  articles.push(...typedBlogData.featuredSlider.articles);

  // Today Highlights
  articles.push(...typedBlogData.todayHighlights.articles);

  // Most Recent
  articles.push(...typedBlogData.mostRecent.mainArticles);
  articles.push(...typedBlogData.mostRecent.sideArticles);

  // Culture
  articles.push(typedBlogData.Culture.mainArticle);
  articles.push(...typedBlogData.Culture.articles);
  articles.push(...typedBlogData.Culture.sideArticles);

  // The Startup
  articles.push(typedBlogData.theStartup.mainArticle);
  articles.push(...typedBlogData.theStartup.articles);

  // Ryan Mark Posts
  articles.push(...typedBlogData.RyanMarkPosts.articles);

  // Highlight Posts
  articles.push(...typedBlogData.hightlightPosts.articles);

  // Related Posts
  articles.push(...typedBlogData.relatedPosts.articles);

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
 */
export function getRelatedArticles(
  currentArticle: Article,
  limit: number = 6
): Article[] {
  const related = getAllArticles()
    .filter(
      (article) =>
        article.id !== currentArticle.id &&
        article.category === currentArticle.category
    )
    .slice(0, limit);

  // If not enough articles in same category, fill with other articles
  if (related.length < limit) {
    const additional = getAllArticles()
      .filter(
        (article) =>
          article.id !== currentArticle.id &&
          !related.some((r) => r.id === article.id)
      )
      .slice(0, limit - related.length);
    related.push(...additional);
  }

  return related;
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
