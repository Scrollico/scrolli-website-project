/**
 * Error Handling Utilities
 * Provides safe error messages for API responses
 */

const isProduction = process.env.NODE_ENV === "production";

/**
 * Get a safe error message for API responses
 * In production, returns generic messages. In development, returns detailed messages.
 */
export function getSafeErrorMessage(error: unknown, defaultMessage: string = "An error occurred"): string {
  if (!isProduction) {
    // In development, return detailed error messages
    if (error instanceof Error) {
      return error.message;
    }
    return String(error);
  }
  
  // In production, return generic messages
  return defaultMessage;
}

/**
 * Log error with full details (server-side only)
 */
export function logError(context: string, error: unknown): void {
  if (error instanceof Error) {
    console.error(`[${context}]`, {
      message: error.message,
      stack: error.stack,
      name: error.name,
    });
  } else {
    console.error(`[${context}]`, error);
  }
}
