/**
 * Gündem Content Loader
 * 
 * Loads and caches Gündem articles from CSV file
 */

import { Article } from '@/types/content';
import { parseCSV, CSVRow } from './csv-parser';
import { convertCSVRowsToArticles } from './article-converter';

// Cache for parsed articles
let cachedArticles: Article[] | null = null;

/**
 * Load all Gündem articles from CSV
 */
function loadGundemArticles(): Article[] {
  if (cachedArticles) {
    return cachedArticles;
  }

  try {
    const csvPath = 'data/articles/gundem.csv';
    const rows = parseCSV(csvPath);
    cachedArticles = convertCSVRowsToArticles(rows);
    return cachedArticles;
  } catch (error) {
    console.error('Error loading Gündem articles:', error);
    return [];
  }
}

/**
 * Get all Gündem articles
 */
export function getAllGundemArticles(): Article[] {
  return loadGundemArticles();
}

/**
 * Get Gündem article by slug
 */
export function getGundemArticleById(slug: string): Article | null {
  const articles = loadGundemArticles();
  return articles.find(article => article.id === slug) || null;
}

/**
 * Get Gündem articles by category
 */
export function getGundemArticlesByCategory(category: string): Article[] {
  const articles = loadGundemArticles();
  return articles.filter(
    article => article.category.toLowerCase() === category.toLowerCase()
  );
}

/**
 * Get recent Gündem articles (sorted by date, most recent first)
 */
export function getRecentGundemArticles(limit: number = 10): Article[] {
  const articles = loadGundemArticles();
  
  // Sort by date (most recent first)
  // Note: This is a simple string comparison, may need improvement
  const sorted = [...articles].sort((a, b) => {
    // Try to parse dates for proper sorting
    try {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      if (!isNaN(dateA.getTime()) && !isNaN(dateB.getTime())) {
        return dateB.getTime() - dateA.getTime();
      }
    } catch (error) {
      // Fallback to string comparison
    }
    return b.date.localeCompare(a.date);
  });
  
  return sorted.slice(0, limit);
}

/**
 * Clear cache (useful for development/testing)
 */
export function clearGundemCache(): void {
  cachedArticles = null;
}

