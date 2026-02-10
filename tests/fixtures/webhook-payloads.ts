/**
 * RevenueCat Webhook Payload Fixtures
 *
 * Sample webhook payloads for different RevenueCat event types
 */

export interface RevenueCatWebhookEvent {
  event: {
    type: string;
    app_user_id: string;
    product_id?: string;
    period_type?: string;
    purchased_at_ms?: number;
    expiration_at_ms?: number;
    environment?: string;
    [key: string]: any;
  };
}

/**
 * Generate a webhook payload for a specific event type
 */
export function createWebhookPayload(
  eventType: string,
  appUserId: string,
  additionalData: Record<string, any> = {}
): RevenueCatWebhookEvent {
  const basePayload: RevenueCatWebhookEvent = {
    event: {
      type: eventType,
      app_user_id: appUserId,
      environment: "SANDBOX",
      purchased_at_ms: Date.now(),
      purchased_at: new Date().toISOString(),
      ...additionalData,
    },
  };

  // Add event-specific fields
  switch (eventType) {
    case "INITIAL_PURCHASE":
    case "RENEWAL":
      basePayload.event.expiration_at_ms =
        Date.now() + 30 * 24 * 60 * 60 * 1000; // 30 days
      basePayload.event.period_type = "NORMAL";
      break;
    case "CANCELLATION":
      basePayload.event.expiration_at_ms = Date.now() + 7 * 24 * 60 * 60 * 1000; // 7 days grace
      break;
    case "EXPIRATION":
      basePayload.event.expiration_at_ms = Date.now() - 1000; // Already expired
      break;
  }

  return basePayload;
}

/**
 * Pre-defined webhook payloads for common scenarios
 */
export const webhookPayloads = {
  initialPurchase: (appUserId: string): RevenueCatWebhookEvent =>
    createWebhookPayload("INITIAL_PURCHASE", appUserId, {
      product_id: "premium_monthly",
    }),

  renewal: (appUserId: string): RevenueCatWebhookEvent =>
    createWebhookPayload("RENEWAL", appUserId, {
      product_id: "premium_monthly",
    }),

  cancellation: (appUserId: string): RevenueCatWebhookEvent =>
    createWebhookPayload("CANCELLATION", appUserId, {
      product_id: "premium_monthly",
    }),

  expiration: (appUserId: string): RevenueCatWebhookEvent =>
    createWebhookPayload("EXPIRATION", appUserId, {
      product_id: "premium_monthly",
    }),

  uncancellation: (appUserId: string): RevenueCatWebhookEvent =>
    createWebhookPayload("UNCANCELLATION", appUserId, {
      product_id: "premium_monthly",
    }),

  productChange: (appUserId: string): RevenueCatWebhookEvent =>
    createWebhookPayload("PRODUCT_CHANGE", appUserId, {
      product_id: "premium_annual",
    }),
};
