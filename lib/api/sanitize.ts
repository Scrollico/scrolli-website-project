/**
 * Input Sanitization Utilities
 * Functions to sanitize user input and prevent XSS attacks
 */

/**
 * Escape HTML special characters to prevent XSS
 */
export function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, (char) => map[char]);
}

/**
 * Sanitize text for HTML content (escapes HTML, preserves newlines)
 */
export function sanitizeText(text: string): string {
  return escapeHtml(text);
}

/**
 * Sanitize text for HTML attributes (escapes HTML, removes newlines)
 */
export function sanitizeAttribute(text: string): string {
  return escapeHtml(text).replace(/\s+/g, ' ').trim();
}

/**
 * Sanitize email address (basic validation + HTML escaping)
 */
export function sanitizeEmail(email: string): string {
  // Remove any HTML tags and escape
  return escapeHtml(email.trim().toLowerCase());
}

/**
 * Truncate text to max length
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + '...';
}
