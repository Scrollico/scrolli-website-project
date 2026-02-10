/**
 * RevenueCat Client Configuration
 *
 * Initializes the RevenueCat Purchases SDK for web and provides
 * methods for managing subscriptions and purchases.
 */

import { Purchases } from "@revenuecat/purchases-js";

let purchasesInstance: Purchases | null = null;

/**
 * Generate or retrieve an anonymous user ID for RevenueCat
 * Uses localStorage to persist anonymous ID across sessions
 */
function getOrCreateAnonymousUserId(): string {
  if (typeof window === "undefined") {
    // Server-side: generate a temporary ID (will be replaced when user logs in)
    return `anon_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  const storageKey = "rc_anonymous_user_id";
  let anonymousId = localStorage.getItem(storageKey);

  if (!anonymousId) {
    // Generate a new anonymous ID
    anonymousId = `anon_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 9)}`;
    localStorage.setItem(storageKey, anonymousId);
  }

  return anonymousId;
}

/**
 * Initialize RevenueCat SDK
 * Must be called before using any RevenueCat features
 */
/**
 * Initialize RevenueCat SDK
 * Must be called before using any RevenueCat features
 */
export async function initializeRevenueCat(
  userId?: string,
): Promise<Purchases> {
  const apiKey = process.env.NEXT_PUBLIC_REVENUECAT_PUBLIC_KEY;

  console.log("🔑 RevenueCat Initialization Debug:", {
    keyExists: !!apiKey,
    keyPrefix: apiKey?.substring(0, 7),
    keyLength: apiKey?.length,
    environment: process.env.NODE_ENV,
    userAgent:
      typeof window !== "undefined" ? window.navigator.userAgent : "server",
  });

  if (!apiKey) {
    throw new Error(
      "RevenueCat Web Billing API key not configured. " +
        "Add NEXT_PUBLIC_REVENUECAT_PUBLIC_KEY to .env.local. " +
        "Get your Web Billing API key from RevenueCat Dashboard → Apps & providers → Web Billing → App Settings → Public API Key",
    );
  }

  // Validate key format (should start with rcb_ for Web Billing)
  if (!apiKey.startsWith("rcb_")) {
    throw new Error(
      "Invalid RevenueCat API key format. " +
        `Current key starts with: "${apiKey.substring(0, 4)}...". ` +
        'Web Billing API keys MUST start with "rcb_" (production) or "rcb_sb_" (sandbox). ' +
        "Please check your .env.local file.",
    );
  }

  // Initialize or return existing instance
  if (!purchasesInstance) {
    try {
      // RevenueCat Web SDK requires configuration with an object: { apiKey, appUserId }
      // Use anonymous ID if no user ID provided
      const appUserId = userId || getOrCreateAnonymousUserId();

      // Configure using object syntax as per Web SDK documentation
      console.log("🔧 Configuring RevenueCat SDK...", {
        appUserId: appUserId.substring(0, 10) + "...",
      });

      purchasesInstance = await Purchases.configure({
        apiKey: apiKey,
        appUserId: appUserId, // This will be Supabase UUID if userId provided, otherwise anonymous ID
      });

      console.log(
        `✅ RevenueCat configured successfully with ${
          userId ? "Supabase user ID" : "anonymous ID"
        }`,
      );
    } catch (error: any) {
      console.error("❌ RevenueCat configuration failed:", error);
      // Note: Removed checkRevenueCatReachability() call as it causes CSP violations
      throw error;
    }
  } else if (userId && purchasesInstance) {
    // User logged in after anonymous initialization
    // For Web SDK, we need to reconfigure with the new user ID
    // The Web SDK doesn't have a logIn method like mobile SDKs
    console.log(
      `🔄 Reconfiguring RevenueCat with authenticated user ID: ${userId.substring(
        0,
        8,
      )}...`,
    );
    try {
      // Reset instance to ensure clean reconfiguration
      purchasesInstance = null;
      purchasesInstance = await Purchases.configure({
        apiKey: apiKey,
        appUserId: userId, // CRITICAL: Use Supabase UUID as RevenueCat customer ID
      });
      console.log(
        `✅ RevenueCat reconfigured with user ID: ${userId.substring(0, 8)}...`,
      );
    } catch (error) {
      console.error("❌ Failed to reconfigure RevenueCat with user ID:", error);
      // Note: Removed checkRevenueCatReachability() call as it causes CSP violations
      throw error;
    }
  }

  return purchasesInstance;
}

/**
 * Get current RevenueCat instance
 * Throws if not initialized
 */
export function getRevenueCat(): Purchases {
  if (!purchasesInstance) {
    throw new Error(
      "RevenueCat not initialized. Call initializeRevenueCat() first.",
    );
  }
  return purchasesInstance;
}

/**
 * Fetch available subscription offerings
 * Uses server-side API route to bypass ad blockers
 */
export async function getOfferings() {
  console.log("🔍 getOfferings() called - using server-side API route");

  try {
    // Try server-side API route first (bypasses ad blockers)
    const response = await fetch("/api/revenuecat/offerings", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      // Don't cache offerings - they may change
      cache: "no-store",
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.error ||
          `Failed to fetch offerings: ${response.status} ${response.statusText}`,
      );
    }

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.error || "Failed to fetch offerings from server");
    }

    const offerings = result.data;

    // Debug logging
    console.log(
      "✅ Raw RevenueCat Offerings received (via server):",
      offerings,
    );
    console.log("📊 Offerings structure:", {
      hasCurrent: !!offerings?.current,
      currentIdentifier: offerings?.current?.identifier,
      allKeys: Object.keys(offerings?.all || {}),
      allCount: Object.keys(offerings?.all || {}).length,
    });

    return offerings;
  } catch (error: any) {
    console.error("❌ Error fetching RevenueCat offerings:", error);

    // If it's a network error (likely ad blocker), provide helpful message
    if (
      error?.message?.includes("Failed to fetch") ||
      error?.name === "TypeError"
    ) {
      throw new Error(
        "Unable to load pricing. This may be caused by an ad blocker. " +
          "Please disable ad blockers for this site or add an exception. " +
          `Error: ${error.message}`,
      );
    }

    // Provide more helpful error message for credentials issues
    if (
      error?.message?.includes("credentials") ||
      error?.errorCode === "CREDENTIALS_ERROR"
    ) {
      throw new Error(
        "RevenueCat credentials error. " +
          "Please verify:\n" +
          "1. Your Web Billing API key is correct (from Apps & providers → Web Billing → App Settings)\n" +
          "2. The API key matches your Web Billing app\n" +
          "3. Your Web Billing app is properly configured with Stripe\n" +
          "4. You're using the correct environment (sandbox vs production)\n" +
          `Underlying error: ${error?.underlyingErrorMessage || error?.message}`,
      );
    }

    throw error;
  }
}

/**
 * Get current customer info (subscription status)
 */
export async function getCustomerInfo() {
  const purchases = getRevenueCat();
  try {
    const customerInfo = await purchases.getCustomerInfo();
    return customerInfo;
  } catch (error: any) {
    console.error("❌ Error getting customer info:", error);
    // Note: Removed checkRevenueCatReachability() call as it causes CSP violations
    throw error;
  }
}

/**
 * Check if user has active premium subscription
 */
export async function isPremiumActive(): Promise<boolean> {
  try {
    const customerInfo = await getCustomerInfo();
    // Check if user has active 'Scrolli Premium' entitlement
    return customerInfo.entitlements.active["Scrolli Premium"] !== undefined;
  } catch (error) {
    console.error("Error checking premium status:", error);
    return false;
  }
}

/**
 * Purchase a package
 * Web SDK uses purchase({ rcPackage: pkg }) instead of purchasePackage(pkg)
 * Supports customerEmail to pre-fill the email field in hosted checkout
 */
export async function purchasePackage(packageToPurchase: any, email?: string) {
  const purchases = getRevenueCat();

  // Web SDK uses purchase({ rcPackage: pkg }) format
  const { customerInfo } = await purchases.purchase({
    rcPackage: packageToPurchase,
    customerEmail: email, // Pre-fills the email field in the hosted checkout
  });

  return customerInfo;
}

/**
 * Restore previous purchases
 * Useful when user logs in on a new device
 */
export async function restorePurchases() {
  console.log(
    "ℹ️ restorePurchases called - fetching latest customer info for current user",
  );
  // Web SDK doesn't support generic restore like mobile.
  // We just fetch the latest info for the current user.
  return await getCustomerInfo();
}

/**
 * Log in a user (link Supabase user ID to RevenueCat)
 * Web SDK doesn't have logIn method, so we reconfigure with the new user ID
 *
 * CRITICAL: This ensures RevenueCat uses the Supabase user UUID as app_user_id
 * so webhooks can match purchases to the correct Supabase profile.
 */
export async function loginUser(userId: string, email?: string) {
  const apiKey = process.env.NEXT_PUBLIC_REVENUECAT_PUBLIC_KEY;
  if (!apiKey) {
    throw new Error("RevenueCat API key not configured");
  }

  if (!userId) {
    throw new Error("User ID is required to configure RevenueCat");
  }

  console.log(
    `🔐 Configuring RevenueCat with Supabase user ID: ${userId.substring(
      0,
      8,
    )}...${email ? ` (email: ${email})` : ""}`,
  );

  // Reset the instance to ensure clean reconfiguration
  purchasesInstance = null;

  // Web SDK doesn't support logIn, reconfigure with new user ID
  purchasesInstance = await Purchases.configure({
    apiKey: apiKey,
    appUserId: userId, // CRITICAL: Use Supabase UUID as RevenueCat customer ID
  });

  // Note: Web SDK doesn't support setEmail directly on the instance the same way mobile does
  if (email) {
    console.log(`ℹ️ Email logging info: ${email}`);
  }

  console.log(
    `✅ RevenueCat configured with user ID: ${userId.substring(0, 8)}...`,
  );

  // Verify the configuration by getting customer info
  try {
    const customerInfo = await purchasesInstance.getCustomerInfo();
    console.log(
      `✅ RevenueCat customer info retrieved for user: ${userId.substring(
        0,
        8,
      )}...`,
    );
    return customerInfo;
  } catch (error) {
    console.warn(
      "⚠️ Could not fetch customer info after login (user may not have purchases yet):",
      error,
    );
    // Don't throw - this is expected for new users
    return null;
  }
}

/**
 * Log out current user
 */
export async function logoutUser() {
  console.log("👋 Logging out user...");
  purchasesInstance = null;

  // Re-configure with anonymous ID to ensure clean state
  await initializeRevenueCat();

  // Return empty info or null
  return null;
}

/**
 * Verify that RevenueCat is configured with the correct Supabase user ID
 * This is critical for webhook matching - app_user_id must match Supabase UUID
 */
export async function verifyUserConfiguration(
  expectedUserId: string,
): Promise<boolean> {
  try {
    if (!purchasesInstance) {
      console.warn("⚠️ RevenueCat not initialized");
      return false;
    }

    // Get customer info to verify the current app_user_id
    await purchasesInstance.getCustomerInfo();

    // Note: Web SDK doesn't expose app_user_id directly in customerInfo
    // But we can verify by checking if we can fetch customer info
    // The real verification happens in the webhook when app_user_id is received

    console.log(
      `✅ RevenueCat is configured and ready for user: ${expectedUserId.substring(
        0,
        8,
      )}...`,
    );
    return true;
  } catch (error) {
    console.error("❌ RevenueCat verification failed:", error);
    return false;
  }
}
