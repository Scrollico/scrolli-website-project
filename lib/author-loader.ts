/**
 * Author Loader (Client-Safe)
 * 
 * Loads author data from JSON file (client-safe, no fs dependency)
 */

import { Author } from '@/types/content';
import authorsData from '@/data/authors.json';

// Type for the authors JSON structure
type AuthorsData = Record<string, Author>;

/**
 * Get author by slug or name (client-safe)
 */
export function getAuthorBySlug(slugOrName: string): Author | null {
  const authors = authorsData as AuthorsData;
  
  // Try exact slug match first
  let author = authors[slugOrName];
  
  // Try normalized name match
  if (!author) {
    const normalized = slugOrName.toLowerCase().trim();
    author = authors[normalized];
  }
  
  // Try matching by converting name to slug format
  if (!author) {
    const slugFormat = slugOrName.toLowerCase().replace(/\s+/g, '-');
    author = authors[slugFormat];
  }
  
  return author || null;
}

/**
 * Get author avatar URL by slug or name (client-safe)
 */
export function getAuthorAvatar(slugOrName: string): string | undefined {
  const author = getAuthorBySlug(slugOrName);
  return author?.avatar;
}

/**
 * Get formatted author name by slug or name (client-safe)
 * Returns the proper capitalized name from author data, or formats the slug if not found
 */
export function getAuthorName(slugOrName: string): string {
  const author = getAuthorBySlug(slugOrName);
  
  // If author found in data, return the proper name
  if (author?.name) {
    return author.name;
  }
  
  // Fallback: format slug to readable name
  return slugOrName
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Get all authors (client-safe)
 */
export function getAllAuthors(): Author[] {
  const authors = authorsData as AuthorsData;
  return Object.values(authors);
}

