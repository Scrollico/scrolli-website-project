/**
 * Backend/API tests for user journey matrix.
 * Run against a running app: npm run dev then npx tsx scripts/test-user-journey-backend.ts
 *
 * Tests:
 * - POST /api/redeem-gift: valid token -> 200, success; invalid -> 4xx
 * - Optional: RevenueCat webhook (use E2E revenuecat-paywall.spec or sendTestWebhook)
 */

import { config } from "dotenv";
import { resolve } from "path";

config({ path: resolve(process.cwd(), ".env.local") });

const BASE_URL = process.env.PLAYWRIGHT_TEST_BASE_URL || "http://localhost:3000";

async function redeemGift(
  giftToken: string,
  articleId: string
): Promise<{ ok: boolean; status: number; data: any }> {
  const res = await fetch(`${BASE_URL}/api/redeem-gift`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ giftToken, articleId }),
  });
  const data = await res.json().catch(() => ({}));
  return { ok: res.ok, status: res.status, data };
}

async function main() {
  console.log("User Journey Backend Tests");
  console.log("BASE_URL:", BASE_URL);

  const {
    updateProfile,
    createTestGift,
  } = await import("../tests/helpers/supabase-helpers");
  const {
    setupTestUser,
    cleanupTestUser,
  } = await import("../tests/helpers/revenuecat-helpers");

  const testEmail = `test-backend-${Date.now()}@scrolli.co`;
  const testPassword = process.env.TEST_USER_PASSWORD || "TestPassword123!";

  let testUserId: string | null = null;

  try {
    const { userId } = await setupTestUser(testEmail, testPassword);
    testUserId = userId;
    await updateProfile(userId, {
      onboarding_completed: true,
      is_premium: false,
      articles_read_count: 0,
    });

    const articleId = "test-article-slug";
    const { giftToken } = await createTestGift(articleId, userId);

    console.log("\n1. POST /api/redeem-gift with valid token");
    const valid = await redeemGift(giftToken, articleId);
    if (!valid.ok || !valid.data?.success) {
      throw new Error(
        `Expected 200 and success. Got ${valid.status} ${JSON.stringify(valid.data)}`
      );
    }
    console.log("   OK: 200, success=true");

    console.log("\n2. POST /api/redeem-gift with same token (already used)");
    const used = await redeemGift(giftToken, articleId);
    if (used.ok && used.data?.success) {
      throw new Error("Expected 4xx for already-used token");
    }
    console.log("   OK: non-2xx for already-used token");

    console.log("\n3. POST /api/redeem-gift with invalid token");
    const invalid = await redeemGift("invalid-token-xyz", articleId);
    if (invalid.ok && invalid.data?.success) {
      throw new Error("Expected 4xx for invalid token");
    }
    console.log("   OK: non-2xx for invalid token");

    console.log("\nAll backend checks passed.");
  } finally {
    if (testUserId) {
      await cleanupTestUser(testUserId, false).catch(() => {});
    }
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
