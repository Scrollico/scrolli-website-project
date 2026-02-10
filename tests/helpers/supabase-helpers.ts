/**
 * Supabase Test Helpers
 *
 * Utility functions for interacting with Supabase in tests
 */

import { createClient } from "@supabase/supabase-js";
import type { Profile } from "@/lib/supabase/types";

// Support both NEXT_PUBLIC_SUPABASE_URL and SUPABASE_URL
const SUPABASE_URL =
  process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

/**
 * Check if Supabase is configured (lazy check)
 */
function checkSupabaseConfig(): void {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error(
      `Missing Supabase configuration. 
    Required: SUPABASE_URL (or NEXT_PUBLIC_SUPABASE_URL) and SUPABASE_SERVICE_ROLE_KEY
    Current values:
    - SUPABASE_URL: ${process.env.SUPABASE_URL || "not set"}
    - NEXT_PUBLIC_SUPABASE_URL: ${
      process.env.NEXT_PUBLIC_SUPABASE_URL || "not set"
    }
    - SUPABASE_SERVICE_ROLE_KEY: ${
      process.env.SUPABASE_SERVICE_ROLE_KEY ? "set" : "not set"
    }
    
    Make sure .env.local file exists and contains these variables.`
    );
  }
}

/**
 * Get Supabase client with service role (for admin operations)
 */
export function getSupabaseClient() {
  checkSupabaseConfig();
  return createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

/**
 * Get Supabase client with anon key (for user operations)
 */
export function getSupabaseAnonClient() {
  checkSupabaseConfig();
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!anonKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable."
    );
  }
  return createClient(SUPABASE_URL!, anonKey);
}

/**
 * Query profile from database
 */
export async function queryProfile(userId: string): Promise<Profile | null> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      // No rows returned
      return null;
    }
    throw error;
  }

  return data;
}

/**
 * Get premium status for a user
 */
export async function getPremiumStatus(userId: string): Promise<boolean> {
  const profile = await queryProfile(userId);
  return profile?.is_premium ?? false;
}

/**
 * Update profile (for test setup/cleanup)
 */
export async function updateProfile(
  userId: string,
  updates: Partial<Profile>
): Promise<void> {
  const supabase = getSupabaseClient();
  const { error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", userId);

  if (error) {
    throw new Error(`Failed to update profile: ${error.message}`);
  }
}

/**
 * Create a test user in Supabase Auth
 * Note: This requires Supabase Admin API or manual setup
 * For testing, users should be created via the sign-up flow
 */
export async function createTestUserInAuth(
  email: string,
  password: string
): Promise<{ userId: string }> {
  const supabase = getSupabaseClient();
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

  return { userId: data.user.id };
}

/**
 * Delete a test user from Supabase Auth
 */
export async function deleteTestUser(userId: string): Promise<void> {
  const supabase = getSupabaseClient();
  const { error } = await supabase.auth.admin.deleteUser(userId);

  if (error) {
    // Ignore errors if user doesn't exist
    if (error.message.includes("User not found")) {
      return;
    }
    throw new Error(`Failed to delete test user: ${error.message}`);
  }
}

/**
 * Wait for premium status to match expected value
 */
export async function waitForPremiumStatus(
  userId: string,
  expectedStatus: boolean,
  timeout: number = 30000,
  interval: number = 2000
): Promise<boolean> {
  const startTime = Date.now();

  while (Date.now() - startTime < timeout) {
    const currentStatus = await getPremiumStatus(userId);
    if (currentStatus === expectedStatus) {
      return true;
    }
    await new Promise((resolve) => setTimeout(resolve, interval));
  }

  const finalStatus = await getPremiumStatus(userId);
  throw new Error(
    `Premium status did not match expected value. Expected: ${expectedStatus}, Got: ${finalStatus}`
  );
}

/**
 * Verify premium status matches expected value
 */
export async function verifyPremiumStatus(
  userId: string,
  expectedStatus: boolean
): Promise<void> {
  const actualStatus = await getPremiumStatus(userId);
  if (actualStatus !== expectedStatus) {
    throw new Error(
      `Premium status mismatch. Expected: ${expectedStatus}, Got: ${actualStatus}`
    );
  }
}

/**
 * Reset premium status to false (for test cleanup)
 */
export async function resetPremiumStatus(userId: string): Promise<void> {
  await updateProfile(userId, {
    is_premium: false,
    subscription_tier: "free",
  });
}

/**
 * Get subscription tier for a user
 */
export async function getSubscriptionTier(
  userId: string
): Promise<string | null> {
  const profile = await queryProfile(userId);
  return profile?.subscription_tier || null;
}

/**
 * Get articles read count for a user
 */
export async function getArticlesReadCount(userId: string): Promise<number> {
  const profile = await queryProfile(userId);
  return profile?.articles_read_count || 0;
}

/**
 * Reset article counter (for test setup)
 */
export async function resetArticleCounter(userId: string): Promise<void> {
  await updateProfile(userId, {
    articles_read_count: 0,
    last_reset_date: new Date().toISOString(),
    current_period_start: new Date().toISOString().split("T")[0],
  });
}

/**
 * Set current period start date (for testing monthly reset)
 */
export async function setCurrentPeriodStart(
  userId: string,
  date: Date | string
): Promise<void> {
  const dateStr =
    typeof date === "string" ? date : date.toISOString().split("T")[0];
  await updateProfile(userId, {
    current_period_start: dateStr,
    last_reset_date: new Date(dateStr).toISOString(),
  });
}

/**
 * Set articles read count (for test setup)
 */
export async function setArticlesReadCount(
  userId: string,
  count: number
): Promise<void> {
  await updateProfile(userId, {
    articles_read_count: count,
  });
}

/**
 * Get premium since timestamp
 */
export async function getPremiumSince(userId: string): Promise<string | null> {
  const profile = await queryProfile(userId);
  return profile?.premium_since || null;
}

/**
 * Verify subscription tier matches expected value
 */
export async function verifySubscriptionTier(
  userId: string,
  expectedTier: string
): Promise<void> {
  const actualTier = await getSubscriptionTier(userId);
  if (actualTier !== expectedTier) {
    throw new Error(
      `Subscription tier mismatch. Expected: ${expectedTier}, Got: ${actualTier}`
    );
  }
}

/**
 * Verify articles read count matches expected value
 */
export async function verifyArticlesReadCount(
  userId: string,
  expectedCount: number
): Promise<void> {
  const actualCount = await getArticlesReadCount(userId);
  if (actualCount !== expectedCount) {
    throw new Error(
      `Articles read count mismatch. Expected: ${expectedCount}, Got: ${actualCount}`
    );
  }
}

/**
 * Create a test gift for an article (for E2E gift tests).
 * Uses service role to insert; returns gift_token. Expires in 7 days.
 */
export async function createTestGift(
  articleId: string,
  fromUserId: string
): Promise<{ giftToken: string }> {
  const supabase = getSupabaseClient();
  const token =
    "test-gift-" +
    Array.from(crypto.getRandomValues(new Uint8Array(16)))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  const { data, error } = await supabase
    .from("article_gifts")
    .insert({
      from_user_id: fromUserId,
      to_email: null,
      article_id: articleId,
      gift_token: token,
      expires_at: expiresAt.toISOString(),
    })
    .select("gift_token")
    .single();

  if (error) {
    throw new Error(`Failed to create test gift: ${error.message}`);
  }
  return { giftToken: data.gift_token };
}
