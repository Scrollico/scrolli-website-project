/**
 * Article Converter
 * 
 * Converts CSV row data to Article objects
 */

import { Article } from '@/types/content';
import { CSVRow } from './csv-parser';

/**
 * Turkish month names mapping
 */
const TURKISH_MONTHS: { [key: string]: string } = {
  'Ocak': 'Ocak',
  'Şubat': 'Şubat',
  'Mart': 'Mart',
  'Nisan': 'Nisan',
  'Mayıs': 'Mayıs',
  'Haziran': 'Haziran',
  'Temmuz': 'Temmuz',
  'Ağustos': 'Ağustos',
  'Eylül': 'Eylül',
  'Ekim': 'Ekim',
  'Kasım': 'Kasım',
  'Aralık': 'Aralık',
};

/**
 * Calculate read time from content (words per minute: 200)
 */
function calculateReadTime(content: string): string {
  if (!content) return '5 min read';
  
  // Remove HTML tags and get text content
  const textContent = content.replace(/<[^>]*>/g, ' ');
  const words = textContent.trim().split(/\s+/).filter(word => word.length > 0);
  const minutes = Math.ceil(words.length / 200);
  
  return `${minutes} min read`;
}

/**
 * Format date to Turkish format: "29 Ocak, 2024"
 */
function formatDate(dateStr: string): string {
  if (!dateStr) return '';
  
  // If already in Turkish format, return as-is
  if (dateStr.includes('Ocak') || dateStr.includes('Şubat') || dateStr.includes('Mart')) {
    return dateStr;
  }
  
  // Try to parse ISO date or other formats
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) {
      return dateStr; // Return original if can't parse
    }
    
    const day = date.getDate();
    const monthIndex = date.getMonth();
    const year = date.getFullYear();
    
    const monthNames = [
      'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
      'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
    ];
    
    return `${day} ${monthNames[monthIndex]}, ${year}`;
  } catch (error) {
    return dateStr;
  }
}

/**
 * Extract first category from comma-separated categories
 */
function extractCategory(categories: string): string {
  if (!categories) return 'Genel';
  
  const categoryList = categories.split(',').map(cat => cat.trim());
  return categoryList[0] || 'Genel';
}

/**
 * Select image: Desktop image → Kapak → placeholder
 */
function selectImage(desktopImage: string, kapak: string): string {
  if (desktopImage && desktopImage.trim()) {
    return desktopImage.trim();
  }
  if (kapak && kapak.trim()) {
    return kapak.trim();
  }
  return '/assets/images/thumb/thumb-1240x700.jpg'; // Placeholder
}

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
  
  // Remove Mailchimp embed shell and all its contents
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
  // Replace multiple newlines with single newline
  cleaned = cleaned.replace(/\n\s*\n+/g, '\n');
  // Replace multiple spaces with single space
  cleaned = cleaned.replace(/[ \t]+/g, ' ');
  // Remove any trailing newlines at the end
  cleaned = cleaned.replace(/\n+$/, '');
  // Remove any leading newlines at the start
  cleaned = cleaned.replace(/^\n+/, '');
  
  return cleaned.trim();
}

/**
 * Convert CSV row to Article object
 */
export function convertCSVRowToArticle(row: CSVRow): Article {
  const slug = row['Slug'] || '';
  const title = row['Başlık'] || '';
  const author = row['Yazar'] || 'Scrolli';
  const category = extractCategory(row['Kategoriler'] || '');
  const date = formatDate(row['Tarih'] || '');
  const excerpt = row['Özet'] || '';
  let content = row['İçerik'] || '';
  const desktopImage = row['Desktop image'] || '';
  const kapak = row['Kapak'] || '';
  const seoTitle = row['SEO Başlık (SEO Title)'] || '';
  const seoDescription = row['SEO Açıklama (SEO Description)'] || '';
  
  // Remove Mailchimp forms from content
  content = removeMailchimpForms(content);
  
  const image = selectImage(desktopImage, kapak);
  const readTime = calculateReadTime(content);
  
  return {
    id: slug,
    title: title,
    author: author,
    category: category,
    date: date,
    readTime: readTime,
    image: image,
    excerpt: excerpt,
    content: content,
    seoTitle: seoTitle || undefined,
    seoDescription: seoDescription || undefined,
    isPremium: false, // Default to false
  };
}

/**
 * Convert multiple CSV rows to Article array
 */
export function convertCSVRowsToArticles(rows: CSVRow[]): Article[] {
  return rows
    .filter(row => row['Slug'] && row['Başlık']) // Filter out invalid rows
    .map(row => convertCSVRowToArticle(row));
}

