/**
 * Test Constants
 *
 * Centralized constants for RevenueCat paywall testing
 */

export const TEST_USER_EMAIL =
  process.env.TEST_USER_EMAIL || "test-paywall@scrolli.co";
export const TEST_USER_PASSWORD =
  process.env.TEST_USER_PASSWORD || "demo-test-password-123!";

// Stripe test card details
export const STRIPE_TEST_CARD = {
  number: "4242 4242 4242 4242",
  expiry: "12/34",
  cvc: "123",
  zip: "12345",
};

// Webhook test configuration
export const WEBHOOK_TEST_TIMEOUT = 30000; // 30 seconds
export const WEBHOOK_POLL_INTERVAL = 2000; // 2 seconds

// RevenueCat event types
export const REVENUECAT_EVENT_TYPES = {
  INITIAL_PURCHASE: "INITIAL_PURCHASE",
  RENEWAL: "RENEWAL",
  CANCELLATION: "CANCELLATION",
  EXPIRATION: "EXPIRATION",
  UNCANCELLATION: "UNCANCELLATION",
  PRODUCT_CHANGE: "PRODUCT_CHANGE",
} as const;

// Test URLs
export const TEST_URLS = {
  SIGN_IN: "/sign-in",
  SUBSCRIBE: "/subscribe",
  PROFILE: "/profile",
  PRICING: "/pricing",
  ARTICLE: "/article",
} as const;

// Subscription test constants
export const SUBSCRIPTION_TEST_CONSTANTS = {
  FREE_ARTICLE_LIMIT: 3,
  MONTHLY_TIER: "monthly",
  YEARLY_TIER: "yearly",
  LIFETIME_TIER: "lifetime",
  FREE_TIER: "free",
} as const;

// Product ID mappings for webhook tests
export const PRODUCT_TIER_MAP = {
  web_billing_monthly: "monthly",
  web_billing_yearly: "yearly",
  web_billing_lifetime: "lifetime",
} as const;
