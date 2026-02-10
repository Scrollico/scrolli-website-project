/**
 * RevenueCat Test Helpers
 *
 * Utility functions for testing RevenueCat integration
 */

import {
  getSupabaseClient,
  getPremiumStatus,
  waitForPremiumStatus,
  verifyPremiumStatus,
  queryProfile,
  createTestUserInAuth,
  deleteTestUser,
  resetPremiumStatus,
} from "./supabase-helpers";
import {
  createWebhookPayload,
  type RevenueCatWebhookEvent,
} from "../fixtures/webhook-payloads";
import {
  WEBHOOK_TEST_TIMEOUT,
  WEBHOOK_POLL_INTERVAL,
  TEST_USER_EMAIL,
  TEST_USER_PASSWORD,
} from "./test-constants";

const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const WEBHOOK_SECRET = process.env.RC_WEBHOOK_SECRET;

/**
 * Send a test webhook to the Supabase Edge Function
 */
export async function sendTestWebhook(
  eventType: string,
  appUserId: string,
  secret?: string,
  productId?: string
): Promise<Response> {
  const webhookUrl = `${SUPABASE_URL}/functions/v1/revenuecat-webhook`;
  const webhookSecret = secret || WEBHOOK_SECRET;

  if (!webhookSecret) {
    throw new Error("RC_WEBHOOK_SECRET environment variable is required");
  }

  const additionalData: Record<string, any> = {};
  if (productId) {
    additionalData.product_id = productId;
  }

  const payload = createWebhookPayload(eventType, appUserId, additionalData);

  const response = await fetch(webhookUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: webhookSecret,
    },
    body: JSON.stringify(payload),
  });

  return response;
}

/**
 * Wait for webhook processing to complete
 * Polls the database until premium status matches expected value
 */
export async function waitForWebhookProcessing(
  userId: string,
  expectedPremiumStatus: boolean,
  timeout: number = WEBHOOK_TEST_TIMEOUT
): Promise<void> {
  await waitForPremiumStatus(
    userId,
    expectedPremiumStatus,
    timeout,
    WEBHOOK_POLL_INTERVAL
  );
}

/**
 * Setup test user - create if doesn't exist, ensure profile exists
 */
export async function setupTestUser(
  email: string = TEST_USER_EMAIL,
  password: string = TEST_USER_PASSWORD
): Promise<{ userId: string; email: string }> {
  const supabase = getSupabaseClient();

  // Try to find existing user by email
  const { data: existingUsers } = await supabase.auth.admin.listUsers();
  const existingUser = existingUsers?.users?.find((u) => u.email === email);

  let userId: string;

  if (existingUser) {
    userId = existingUser.id;
  } else {
    // Create new user
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (error) {
      throw new Error(`Failed to create test user: ${error.message}`);
    }

    if (!data.user) {
      throw new Error("User creation succeeded but no user data returned");
    }

    userId = data.user.id;
  }

  // Ensure profile exists (should be created by trigger, but verify)
  const profile = await queryProfile(userId);
  if (!profile) {
    // Profile should be created by trigger, but if not, create it manually
    const { error } = await supabase.from("profiles").insert({
      id: userId,
      email,
      is_premium: false,
    });

    if (error) {
      throw new Error(`Failed to create profile: ${error.message}`);
    }
  }

  return { userId, email };
}

/**
 * Cleanup test user (reset premium status, optionally delete user)
 */
export async function cleanupTestUser(
  userId: string,
  deleteUser: boolean = false
): Promise<void> {
  // Reset premium status
  await resetPremiumStatus(userId);

  // Optionally delete user (usually not recommended to avoid auth issues)
  if (deleteUser) {
    await deleteTestUser(userId);
  }
}

/**
 * Verify webhook endpoint is accessible
 */
export async function verifyWebhookEndpoint(): Promise<boolean> {
  const webhookUrl = `${SUPABASE_URL}/functions/v1/revenuecat-webhook`;

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "invalid-secret",
      },
      body: JSON.stringify({ event: { type: "TEST", app_user_id: "test" } }),
    });

    // Should return 401 (unauthorized) if endpoint exists
    return response.status === 401 || response.status === 400;
  } catch (error) {
    return false;
  }
}

/**
 * Verify RevenueCat configuration
 */
export function verifyRevenueCatConfig(): void {
  const publicKey = process.env.NEXT_PUBLIC_REVENUECAT_PUBLIC_KEY;
  if (!publicKey) {
    throw new Error(
      "NEXT_PUBLIC_REVENUECAT_PUBLIC_KEY environment variable is not set. " +
        "Get your Web Billing API key from RevenueCat Dashboard → Apps & providers → Web Billing → App Settings → Public API Key"
    );
  }

  if (!publicKey.startsWith("rcb_")) {
    throw new Error(
      'Invalid RevenueCat API key format. Web Billing API keys should start with "rcb_" (production) or "rcb_sb_" (sandbox). ' +
        "Make sure you're using the Web Billing API key from RevenueCat Dashboard → Apps & providers → Web Billing → App Settings, " +
        "not a regular API key from Settings → API Keys."
    );
  }
}

/**
 * Simulate a complete purchase flow via webhook
 * Useful for testing without actual Stripe checkout
 */
export async function simulatePurchaseFlow(userId: string): Promise<void> {
  // Send INITIAL_PURCHASE webhook
  const response = await sendTestWebhook("INITIAL_PURCHASE", userId);

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Webhook failed with status ${response.status}: ${errorText}`
    );
  }

  // Wait for database update
  await waitForWebhookProcessing(userId, true);
}

/**
 * Simulate a cancellation flow via webhook
 */
export async function simulateCancellationFlow(userId: string): Promise<void> {
  // Send CANCELLATION webhook
  const response = await sendTestWebhook("CANCELLATION", userId);

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Webhook failed with status ${response.status}: ${errorText}`
    );
  }

  // Wait for database update
  await waitForWebhookProcessing(userId, false);
}
