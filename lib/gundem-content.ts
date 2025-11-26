import { Article } from '@/types/content';
import gundemArticles from '@/data/articles/gundem.json';

/**
 * Get all Gündem articles (static JSON generated at build time)
 */
export function getAllGundemArticles(): Article[] {
  return gundemArticles as Article[];
}

/**
 * Get Gündem article by slug
 */
export function getGundemArticleById(slug: string): Article | null {
  return getAllGundemArticles().find(article => article.id === slug) || null;
}

/**
 * Get Gündem articles by category
 */
export function getGundemArticlesByCategory(category: string): Article[] {
  const normalized = category.toLowerCase();
  return getAllGundemArticles().filter(
    article => (article.category || '').toLowerCase() === normalized
  );
}

/**
 * Get recent Gündem articles (sorted by date, most recent first)
 */
export function getRecentGundemArticles(limit: number = 10): Article[] {
  const articles = getAllGundemArticles();
  
  const sorted = [...articles].sort((a, b) => {
    try {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      if (!isNaN(dateA.getTime()) && !isNaN(dateB.getTime())) {
        return dateB.getTime() - dateA.getTime();
      }
    } catch {
      // ignore
    }
    return (b.date || '').localeCompare(a.date || '');
  });
  
  return sorted.slice(0, limit);
}

// For compatibility
export function clearGundemCache(): void {
  // No-op since data is static
}

