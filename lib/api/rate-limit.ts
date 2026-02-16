/**
 * Rate Limiting Utilities
 * Simple in-memory rate limiting for API routes
 * 
 * Note: For production, consider using Redis or Vercel Edge Config
 * for distributed rate limiting across multiple instances
 */

import { NextResponse } from 'next/server';

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

// In-memory store (clears on server restart)
// For production, use Redis or similar
const rateLimitStore: RateLimitStore = {};

// Track last cleanup time for lazy cleanup (setInterval is not available on Edge Runtime)
let lastCleanup = Date.now();

/**
 * Lazy cleanup of expired entries (runs during rate limit checks instead of setInterval)
 */
function cleanupExpiredEntries() {
  const now = Date.now();
  // Only clean up every 60 seconds
  if (now - lastCleanup < 60000) return;
  lastCleanup = now;
  for (const key in rateLimitStore) {
    if (rateLimitStore[key].resetTime < now) {
      delete rateLimitStore[key];
    }
  }
}

/**
 * Rate limit configuration
 */
export interface RateLimitConfig {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Maximum requests per window
}

// Default rate limits
export const DEFAULT_RATE_LIMITS: Record<string, RateLimitConfig> = {
  // Contact form: 5 requests per 15 minutes
  '/api/contact': { windowMs: 15 * 60 * 1000, maxRequests: 5 },

  // Gift article: 10 requests per hour
  '/api/gift-article': { windowMs: 60 * 60 * 1000, maxRequests: 10 },

  // Redeem gift: 20 requests per hour
  '/api/redeem-gift': { windowMs: 60 * 60 * 1000, maxRequests: 20 },

  // Payload CMS routes: 100 requests per hour
  '/api/payload': { windowMs: 60 * 60 * 1000, maxRequests: 100 },

  // RevenueCat offerings: 60 requests per minute
  '/api/revenuecat': { windowMs: 60 * 1000, maxRequests: 60 },

  // Default: 100 requests per 15 minutes
  default: { windowMs: 15 * 60 * 1000, maxRequests: 100 },
};

/**
 * Get rate limit key from request
 */
function getRateLimitKey(request: Request, pathname: string): string {
  // Use IP address for rate limiting
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
    || request.headers.get("x-real-ip")
    || "unknown";

  return `${pathname}:${ip}`;
}

/**
 * Check if request exceeds rate limit
 * Returns rate limit status with config
 */
export function checkRateLimit(
  request: Request,
  pathname: string
): { allowed: boolean; remaining: number; resetTime: number; config: RateLimitConfig } | null {
  // Lazy cleanup of expired entries (replaces setInterval for Edge Runtime compatibility)
  cleanupExpiredEntries();

  // Find matching rate limit config
  let config: RateLimitConfig | undefined;

  if (pathname.startsWith('/api/payload')) {
    config = DEFAULT_RATE_LIMITS['/api/payload'];
  } else if (pathname.startsWith('/api/revenuecat')) {
    config = DEFAULT_RATE_LIMITS['/api/revenuecat'];
  } else {
    config = DEFAULT_RATE_LIMITS[pathname] || DEFAULT_RATE_LIMITS.default;
  }

  const key = getRateLimitKey(request, pathname);
  const now = Date.now();

  let entry = rateLimitStore[key];

  // Initialize or reset if window expired
  if (!entry || entry.resetTime < now) {
    entry = {
      count: 0,
      resetTime: now + config.windowMs,
    };
    rateLimitStore[key] = entry;
  }

  // Check if limit exceeded
  if (entry.count >= config.maxRequests) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: entry.resetTime,
      config,
    };
  }

  // Increment count
  entry.count++;

  return {
    allowed: true,
    remaining: config.maxRequests - entry.count,
    resetTime: entry.resetTime,
    config,
  };
}

/**
 * Create rate limit response (Next.js compatible)
 */
export function createRateLimitResponse(resetTime: number, config: { maxRequests: number }): NextResponse {
  const resetSeconds = Math.ceil((resetTime - Date.now()) / 1000);

  return NextResponse.json(
    {
      error: "Too many requests",
      message: "Rate limit exceeded. Please try again later.",
      retryAfter: resetSeconds,
    },
    {
      status: 429,
      headers: {
        "Retry-After": String(resetSeconds),
        "X-RateLimit-Limit": String(config.maxRequests),
        "X-RateLimit-Remaining": "0",
        "X-RateLimit-Reset": String(Math.ceil(resetTime / 1000)),
      },
    }
  );
}
