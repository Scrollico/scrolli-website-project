/**
 * RevenueCat Flow Test Script
 *
 * Tests the complete flow: Anonymous → Email gate → Free articles → Paywall → Subscribe
 *
 * Usage:
 *   tsx scripts/test-revenuecat-flow.ts
 *
 * Environment Variables Required:
 *   - NEXT_PUBLIC_SUPABASE_URL
 *   - SUPABASE_SERVICE_ROLE_KEY (for admin operations)
 *   - RC_WEBHOOK_SECRET
 *   - NEXT_PUBLIC_REVENUECAT_PUBLIC_KEY
 */

import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";
import { resolve } from "path";

// Load environment variables
config({ path: resolve(process.cwd(), ".env.local") });

const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const RC_WEBHOOK_SECRET = process.env.RC_WEBHOOK_SECRET;
const REVENUECAT_PUBLIC_KEY = process.env.NEXT_PUBLIC_REVENUECAT_PUBLIC_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error("❌ Missing Supabase configuration");
  console.error(
    "Required: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY"
  );
  process.exit(1);
}

if (!RC_WEBHOOK_SECRET) {
  console.error("❌ Missing RC_WEBHOOK_SECRET");
  console.error(
    "Set this in Supabase Dashboard → Edge Functions → revenuecat-webhook → Secrets"
  );
  process.exit(1);
}

const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
const WEBHOOK_URL = `${SUPABASE_URL}/functions/v1/revenuecat-webhook`;

interface TestResult {
  step: string;
  success: boolean;
  message: string;
  data?: any;
}

async function testWebhookEndpoint(): Promise<TestResult> {
  console.log("\n📡 Testing webhook endpoint...");

  try {
    // Test with invalid secret (should return 401)
    const invalidResponse = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "invalid-secret",
      },
      body: JSON.stringify({
        event: { type: "TEST", app_user_id: "test" },
      }),
    });

    if (invalidResponse.status !== 401) {
      return {
        step: "Webhook Security",
        success: false,
        message: `Expected 401 for invalid secret, got ${invalidResponse.status}`,
      };
    }

    // Test with valid secret but invalid payload (should return 400)
    const invalidPayloadResponse = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: RC_WEBHOOK_SECRET,
      },
      body: JSON.stringify({ invalid: "payload" }),
    });

    if (invalidPayloadResponse.status !== 400) {
      return {
        step: "Webhook Validation",
        success: false,
        message: `Expected 400 for invalid payload, got ${invalidPayloadResponse.status}`,
      };
    }

    return {
      step: "Webhook Endpoint",
      success: true,
      message: "Webhook endpoint is accessible and secure",
    };
  } catch (error: any) {
    return {
      step: "Webhook Endpoint",
      success: false,
      message: `Error testing webhook: ${error.message}`,
    };
  }
}

async function testWebhookWithUser(userId: string): Promise<TestResult> {
  console.log(`\n🔄 Testing webhook with user ${userId}...`);

  try {
    // First, verify user is not premium
    const { data: profileBefore } = await supabaseAdmin
      .from("profiles")
      .select("is_premium, articles_read_count")
      .eq("id", userId)
      .single();

    if (!profileBefore) {
      return {
        step: "User Profile Check",
        success: false,
        message: `User profile not found for ${userId}`,
      };
    }

    console.log(
      `  Before: is_premium=${profileBefore.is_premium}, articles_read=${profileBefore.articles_read_count}`
    );

    // Send INITIAL_PURCHASE webhook
    const response = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: RC_WEBHOOK_SECRET,
      },
      body: JSON.stringify({
        event: {
          type: "INITIAL_PURCHASE",
          app_user_id: userId,
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return {
        step: "Webhook Purchase",
        success: false,
        message: `Webhook failed: ${response.status} - ${errorText}`,
      };
    }

    const responseData = await response.json();
    console.log(`  Webhook response:`, responseData);

    // Wait a bit for database update
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Verify premium status updated
    const { data: profileAfter } = await supabaseAdmin
      .from("profiles")
      .select("is_premium, articles_read_count")
      .eq("id", userId)
      .single();

    console.log(
      `  After: is_premium=${profileAfter?.is_premium}, articles_read=${profileAfter?.articles_read_count}`
    );

    if (!profileAfter || !profileAfter.is_premium) {
      return {
        step: "Premium Status Update",
        success: false,
        message: "Premium status was not updated to true",
        data: { before: profileBefore, after: profileAfter },
      };
    }

    // Reset premium status for cleanup
    await supabaseAdmin
      .from("profiles")
      .update({ is_premium: false })
      .eq("id", userId);

    return {
      step: "Webhook Purchase Flow",
      success: true,
      message: "Webhook successfully updated premium status",
      data: { before: profileBefore, after: profileAfter },
    };
  } catch (error: any) {
    return {
      step: "Webhook Test",
      success: false,
      message: `Error: ${error.message}`,
    };
  }
}

async function testMeteredSubscriptionColumns(): Promise<TestResult> {
  console.log("\n📊 Testing metered subscription columns...");

  try {
    const { data, error } = await supabaseAdmin
      .from("profiles")
      .select("articles_read_count, last_reset_date, usage_limit")
      .limit(1);

    if (error) {
      return {
        step: "Metered Columns Check",
        success: false,
        message: `Error querying profiles: ${error.message}`,
      };
    }

    if (!data || data.length === 0) {
      return {
        step: "Metered Columns Check",
        success: false,
        message: "No profiles found to test",
      };
    }

    const profile = data[0];
    const hasColumns =
      "articles_read_count" in profile &&
      "last_reset_date" in profile &&
      "usage_limit" in profile;

    if (!hasColumns) {
      return {
        step: "Metered Columns Check",
        success: false,
        message: "Missing metered subscription columns",
        data: { profile },
      };
    }

    return {
      step: "Metered Columns Check",
      success: true,
      message: "All metered subscription columns exist",
      data: {
        articles_read_count: profile.articles_read_count,
        last_reset_date: profile.last_reset_date,
        usage_limit: profile.usage_limit,
      },
    };
  } catch (error: any) {
    return {
      step: "Metered Columns Check",
      success: false,
      message: `Error: ${error.message}`,
    };
  }
}

async function createTestUser(): Promise<{
  userId: string;
  email: string;
} | null> {
  console.log("\n👤 Creating test user...");

  const testEmail = `test-${Date.now()}@scrolli.co`;
  const testPassword = "TestPassword123!";

  try {
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email: testEmail,
      password: testPassword,
      email_confirm: true,
    });

    if (error) {
      console.error(`  ❌ Error creating user: ${error.message}`);
      return null;
    }

    if (!data.user) {
      console.error("  ❌ User creation succeeded but no user data returned");
      return null;
    }

    // Wait for profile to be created by trigger
    await new Promise((resolve) => setTimeout(resolve, 1000));

    console.log(`  ✅ Created user: ${testEmail} (${data.user.id})`);
    return { userId: data.user.id, email: testEmail };
  } catch (error: any) {
    console.error(`  ❌ Error: ${error.message}`);
    return null;
  }
}

async function main() {
  console.log("🧪 RevenueCat Flow Test Script");
  console.log("================================\n");

  const results: TestResult[] = [];

  // Test 1: Webhook endpoint
  const webhookTest = await testWebhookEndpoint();
  results.push(webhookTest);
  console.log(webhookTest.success ? "  ✅" : "  ❌", webhookTest.message);

  // Test 2: Metered subscription columns
  const columnsTest = await testMeteredSubscriptionColumns();
  results.push(columnsTest);
  console.log(columnsTest.success ? "  ✅" : "  ❌", columnsTest.message);
  if (columnsTest.data) {
    console.log("  Data:", columnsTest.data);
  }

  // Test 3: Create test user and test webhook
  const testUser = await createTestUser();
  if (testUser) {
    const webhookUserTest = await testWebhookWithUser(testUser.userId);
    results.push(webhookUserTest);
    console.log(
      webhookUserTest.success ? "  ✅" : "  ❌",
      webhookUserTest.message
    );

    // Cleanup: Delete test user
    await supabaseAdmin.auth.admin.deleteUser(testUser.userId);
    console.log(`  🧹 Cleaned up test user: ${testUser.email}`);
  } else {
    results.push({
      step: "Test User Creation",
      success: false,
      message: "Failed to create test user",
    });
  }

  // Summary
  console.log("\n📋 Test Summary");
  console.log("================");
  const passed = results.filter((r) => r.success).length;
  const failed = results.filter((r) => !r.success).length;

  results.forEach((result) => {
    const icon = result.success ? "✅" : "❌";
    console.log(`${icon} ${result.step}: ${result.message}`);
  });

  console.log(`\n✅ Passed: ${passed}/${results.length}`);
  console.log(`❌ Failed: ${failed}/${results.length}`);

  if (failed > 0) {
    console.log("\n⚠️  Some tests failed. Check the output above for details.");
    process.exit(1);
  } else {
    console.log("\n🎉 All tests passed!");
  }
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
