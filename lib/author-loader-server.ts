/**
 * Author Loader (Server-Side Only)
 * 
 * Server-side utility for loading author data from CSV
 * This file uses Node.js fs module and should only be imported in server components
 */

import { Author } from '@/types/content';
import { parseCSV, CSVRow } from './csv-parser';

// Cache for parsed authors
let cachedAuthors: Map<string, Author> | null = null;

/**
 * Load all authors from CSV (server-side only)
 */
function loadAuthors(): Map<string, Author> {
  if (cachedAuthors) {
    return cachedAuthors;
  }

  try {
    const csvPath = 'public/assets/articles/Scrolli - Yazar.csv';
    const rows = parseCSV(csvPath);
    const authorMap = new Map<string, Author>();
    
    rows.forEach((row: CSVRow) => {
      const name = row['Name'] || '';
      const slug = row['Slug'] || '';
      const picture = row['Picture'] || '';
      const bio = row['Bio'] || '';
      const bioSummary = row['Bio Summary'] || '';
      const email = row['Email'] || '';
      const twitter = row['Twitter Profile Link'] || '';
      const facebook = row['Facebook Profile Link'] || '';
      const linkedin = row['LinkedIn Profile Link'] || '';
      
      if (name && slug) {
        // Create author object
        const author: Author = {
          name: name,
          avatar: picture || undefined,
          bio: bio || bioSummary || undefined,
          social: {
            ...(twitter && { twitter: twitter }),
            ...(facebook && { website: facebook }), // Using website field for Facebook
            ...(linkedin && { linkedin: linkedin }),
          },
        };
        
        // Map by slug (primary key)
        authorMap.set(slug, author);
        
        // Also map by name (normalized) for fallback matching
        const normalizedName = name.toLowerCase().trim();
        if (normalizedName !== slug) {
          authorMap.set(normalizedName, author);
        }
      }
    });
    
    cachedAuthors = authorMap;
    return authorMap;
  } catch (error) {
    console.error('Error loading authors:', error);
    return new Map();
  }
}

/**
 * Get all authors as JSON (for client-side use)
 */
export function getAllAuthorsJSON(): string {
  const authors = loadAuthors();
  const uniqueAuthors = new Map<string, Author>();
  
  // Deduplicate by name (since we have both slug and name keys)
  authors.forEach((author, key) => {
    if (!uniqueAuthors.has(author.name)) {
      uniqueAuthors.set(author.name, author);
    }
  });
  
  // Create a map structure for easy lookup
  const authorMap: Record<string, Author> = {};
  authors.forEach((author, key) => {
    authorMap[key] = author;
  });
  
  return JSON.stringify(authorMap);
}

/**
 * Get author by slug or name (server-side only)
 */
export function getAuthorBySlug(slugOrName: string): Author | null {
  const authors = loadAuthors();
  
  // Try exact slug match first
  let author = authors.get(slugOrName);
  
  // Try normalized name match
  if (!author) {
    const normalized = slugOrName.toLowerCase().trim();
    author = authors.get(normalized);
  }
  
  // Try matching by converting name to slug format
  if (!author) {
    const slugFormat = slugOrName.toLowerCase().replace(/\s+/g, '-');
    author = authors.get(slugFormat);
  }
  
  return author || null;
}

/**
 * Get author avatar URL by slug or name (server-side only)
 */
export function getAuthorAvatar(slugOrName: string): string | undefined {
  const author = getAuthorBySlug(slugOrName);
  return author?.avatar;
}


