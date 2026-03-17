/**
 * HTML Cleaner Utility
 *
 * Cleans and sanitizes HTML content from Payload CMS (especially Alara AI-generated
 * content) to remove nested tags, normalize whitespace, fix common issues,
 * and prevent XSS. Uses regex-based sanitization compatible with Edge Runtime.
 */

/**
 * Removes nested <p> tags within <p> tags
 * Example: <p><p>content</p></p> becomes <p>content</p>
 */
function removeNestedParagraphs(html: string): string {
  if (!html || typeof html !== "string") return html;
  let cleaned = html.replace(/<p[^>]*>\s*<p[^>]*>/gi, "<p>");
  cleaned = cleaned.replace(/<\/p>\s*<\/p>/gi, "</p>");
  return cleaned;
}

/**
 * Normalizes whitespace in HTML
 */
function normalizeWhitespace(html: string): string {
  if (!html || typeof html !== "string") return html;
  let cleaned = html.replace(/[ \t]+/g, " ");
  cleaned = cleaned.replace(/\n{3,}/g, "\n\n");
  cleaned = cleaned.replace(/>\s+</g, "><");
  cleaned = cleaned.replace(/></g, "> <");
  return cleaned.trim();
}

/**
 * Removes empty paragraph tags
 */
function removeEmptyParagraphs(html: string): string {
  if (!html || typeof html !== "string") return html;
  return html
    .replace(/<p[^>]*>\s*<\/p>/gi, "")
    .replace(/<p[^>]*>\s*&nbsp;\s*<\/p>/gi, "");
}

const DANGEROUS_TAGS = /(<\s*\/?\s*(script|iframe|object|embed|form|input|button|select|textarea|link|meta|style|base|applet|xml)[^>]*>)/gi;
const EVENT_ATTRS = /\s+on\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]*)/gi;
const JS_HREF = /(href|src|action)\s*=\s*["']?\s*javascript:/gi;

/**
 * Edge Runtime-compatible HTML sanitizer.
 * Strips dangerous tags, event handler attributes, and javascript: URIs.
 */
function sanitizeHtml(html: string): string {
  return html
    .replace(DANGEROUS_TAGS, "")
    .replace(EVENT_ATTRS, "")
    .replace(JS_HREF, '$1="about:blank"');
}

/**
 * Main function to clean and sanitize HTML content.
 * Applies structural cleaning then DOMPurify sanitization to prevent XSS.
 *
 * @param html - Raw HTML string from Payload CMS
 * @param options - Optional configuration
 * @returns Sanitized, cleaned HTML string
 */
export function cleanHtmlContent(
  html: string,
  options: {
    removeNestedTags?: boolean;
    normalizeWhitespace?: boolean;
    removeEmptyTags?: boolean;
  } = {}
): string {
  if (!html || typeof html !== "string") return html;

  const {
    removeNestedTags = true,
    normalizeWhitespace: normalize = true,
    removeEmptyTags = true,
  } = options;

  let cleaned = html;

  if (removeNestedTags) {
    cleaned = removeNestedParagraphs(cleaned);
  }

  if (removeEmptyTags) {
    cleaned = removeEmptyParagraphs(cleaned);
  }

  if (normalize) {
    cleaned = normalizeWhitespace(cleaned);
  }

  // Sanitize against XSS using edge-compatible regex (no DOM/JSDOM required).
  // Strips dangerous tags, event handler attributes, and javascript: URIs.
  cleaned = sanitizeHtml(cleaned);

  return cleaned;
}
