/**
 * HTML Cleaner Utility
 * 
 * Cleans HTML content from Payload CMS (especially Alara AI-generated content)
 * to remove nested tags, normalize whitespace, and fix common issues.
 */

/**
 * Removes nested <p> tags within <p> tags
 * Example: <p><p>content</p></p> becomes <p>content</p>
 */
function removeNestedParagraphs(html: string): string {
  if (!html || typeof html !== 'string') return html;
  
  // Use regex to find and fix nested <p> tags
  // Match <p> followed by optional whitespace and another <p>
  let cleaned = html.replace(/<p[^>]*>\s*<p[^>]*>/gi, '<p>');
  
  // Match closing </p> followed by optional whitespace and another </p>
  cleaned = cleaned.replace(/<\/p>\s*<\/p>/gi, '</p>');
  
  return cleaned;
}

/**
 * Normalizes whitespace in HTML
 * Removes excessive spaces, newlines, and tabs while preserving structure
 */
function normalizeWhitespace(html: string): string {
  if (!html || typeof html !== 'string') return html;
  
  // Replace multiple spaces with single space
  let cleaned = html.replace(/[ \t]+/g, ' ');
  
  // Replace multiple newlines with single newline
  cleaned = cleaned.replace(/\n{3,}/g, '\n\n');
  
  // Remove spaces between tags
  cleaned = cleaned.replace(/>\s+</g, '><');
  
  // Add back single space between tags for readability (optional)
  cleaned = cleaned.replace(/></g, '> <');
  
  return cleaned.trim();
}

/**
 * Removes empty paragraph tags
 */
function removeEmptyParagraphs(html: string): string {
  if (!html || typeof html !== 'string') return html;
  
  // Remove <p></p> and <p> </p> and <p>&nbsp;</p>
  return html
    .replace(/<p[^>]*>\s*<\/p>/gi, '')
    .replace(/<p[^>]*>\s*&nbsp;\s*<\/p>/gi, '');
}

/**
 * Main function to clean HTML content
 * Applies all cleaning functions in the correct order
 * 
 * @param html - Raw HTML string from Payload CMS
 * @param options - Optional configuration
 * @returns Cleaned HTML string
 */
export function cleanHtmlContent(
  html: string,
  options: {
    removeNestedTags?: boolean;
    normalizeWhitespace?: boolean;
    removeEmptyTags?: boolean;
  } = {}
): string {
  if (!html || typeof html !== 'string') return html;
  
  const {
    removeNestedTags = true,
    normalizeWhitespace: normalize = true,
    removeEmptyTags = true,
  } = options;
  
  let cleaned = html;
  
  // Apply cleaning functions in order
  if (removeNestedTags) {
    cleaned = removeNestedParagraphs(cleaned);
  }
  
  if (removeEmptyTags) {
    cleaned = removeEmptyParagraphs(cleaned);
  }
  
  if (normalize) {
    cleaned = normalizeWhitespace(cleaned);
  }
  
  return cleaned;
}
