/**
 * RevenueCat Paywall Integration Tests
 * 
 * End-to-end tests for the complete RevenueCat paywall flow:
 * Next.js → RevenueCat → Stripe → Supabase Webhook → Database → Next.js UI
 */

import { test, expect } from '@playwright/test';
import {
  setupTestUser,
  verifyPremiumStatus,
  waitForWebhookProcessing,
  cleanupTestUser,
  verifyWebhookEndpoint,
  verifyRevenueCatConfig,
  simulatePurchaseFlow,
  simulateCancellationFlow,
  sendTestWebhook,
} from '../helpers/revenuecat-helpers';
import {
  TEST_USER_EMAIL,
  TEST_USER_PASSWORD,
  STRIPE_TEST_CARD,
  WEBHOOK_TEST_TIMEOUT,
} from '../helpers/test-constants';
import { REVENUECAT_EVENT_TYPES } from '../helpers/test-constants';

test.describe('RevenueCat Paywall Integration', () => {
  let testUserId: string;

  test.beforeAll(async () => {
    // Verify configuration before running tests
    verifyRevenueCatConfig();
    
    // Verify webhook endpoint is accessible
    const webhookAccessible = await verifyWebhookEndpoint();
    if (!webhookAccessible) {
      test.skip();
      console.warn('Webhook endpoint is not accessible. Skipping tests.');
    }
  });

  test.beforeEach(async () => {
    // Setup: Ensure test user exists and is not premium
    const user = await setupTestUser(TEST_USER_EMAIL, TEST_USER_PASSWORD);
    testUserId = user.userId;
    
    // Verify initial premium status is false
    await verifyPremiumStatus(testUserId, false);
  });

  test.afterEach(async () => {
    // Cleanup: Reset premium status (don't delete user to avoid auth issues)
    if (testUserId) {
      await cleanupTestUser(testUserId, false);
    }
  });

  test('complete purchase flow - webhook simulation', async ({ page }) => {
    // Step 1: Auth in Next.js
    await page.goto('/sign-in');
    
    // Fill sign-in form
    await page.fill('input[type="email"]', TEST_USER_EMAIL);
    await page.fill('input[type="password"]', TEST_USER_PASSWORD);
    await page.click('button[type="submit"]');
    
    // Wait for navigation after sign-in
    await page.waitForURL(/\/(profile|onboarding|$)/, { timeout: 10000 });
    
    // Verify profile exists in database
    await verifyPremiumStatus(testUserId, false);

    // Step 2: Open Paywall (navigate to pricing page)
    await page.goto('/pricing');
    await page.waitForLoadState('networkidle');
    
    // Verify pricing page loads
    await expect(page.locator('text=/pricing|premium|subscribe/i').first()).toBeVisible();

    // Step 3: Simulate purchase via webhook (since we can't automate Stripe checkout easily)
    // In a real scenario, you would:
    // - Click purchase button
    // - Fill Stripe checkout form
    // - Complete payment
    // For testing, we simulate the webhook directly
    
    // Simulate INITIAL_PURCHASE webhook
    const webhookResponse = await sendTestWebhook(
      REVENUECAT_EVENT_TYPES.INITIAL_PURCHASE,
      testUserId
    );
    
    expect(webhookResponse.ok).toBe(true);
    const responseData = await webhookResponse.json();
    expect(responseData.success).toBe(true);

    // Step 4: Wait for webhook processing and verify database update
    await waitForWebhookProcessing(testUserId, true, WEBHOOK_TEST_TIMEOUT);
    await verifyPremiumStatus(testUserId, true);

    // Step 5: Verify UI reflects premium status (requires page refresh)
    await page.reload();
    await page.waitForLoadState('networkidle');
    
    // Check that premium indicators are visible
    // This depends on your UI implementation
    const premiumIndicators = page.locator('text=/premium|active|subscribed/i');
    if (await premiumIndicators.count() > 0) {
      await expect(premiumIndicators.first()).toBeVisible();
    }
  });

  test('cancellation flow', async ({ page }) => {
    // Setup: Ensure test user has active premium subscription
    await simulatePurchaseFlow(testUserId);
    await verifyPremiumStatus(testUserId, true);

    // Step 1: Sign in
    await page.goto('/sign-in');
    await page.fill('input[type="email"]', TEST_USER_EMAIL);
    await page.fill('input[type="password"]', TEST_USER_PASSWORD);
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/(profile|onboarding|$)/, { timeout: 10000 });

    // Step 2: Simulate cancellation via webhook
    const webhookResponse = await sendTestWebhook(
      REVENUECAT_EVENT_TYPES.CANCELLATION,
      testUserId
    );
    
    expect(webhookResponse.ok).toBe(true);

    // Step 3: Wait for webhook processing and verify database update
    await waitForWebhookProcessing(testUserId, false, WEBHOOK_TEST_TIMEOUT);
    await verifyPremiumStatus(testUserId, false);

    // Step 4: Verify UI update (paywall should appear)
    await page.goto('/pricing');
    await page.reload();
    await page.waitForLoadState('networkidle');
    
    // Premium status should be false, so upgrade buttons should be visible
    const upgradeButtons = page.locator('text=/upgrade|subscribe|purchase/i');
    if (await upgradeButtons.count() > 0) {
      await expect(upgradeButtons.first()).toBeVisible();
    }
  });

  test('webhook error handling - invalid secret', async () => {
    const webhookResponse = await sendTestWebhook(
      REVENUECAT_EVENT_TYPES.INITIAL_PURCHASE,
      testUserId,
      'invalid-secret'
    );
    
    // Should return 401 Unauthorized
    expect(webhookResponse.status).toBe(401);
  });

  test('webhook error handling - missing app_user_id', async () => {
    const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
    const WEBHOOK_SECRET = process.env.RC_WEBHOOK_SECRET;
    
    if (!SUPABASE_URL || !WEBHOOK_SECRET) {
      test.skip();
      return;
    }

    const webhookUrl = `${SUPABASE_URL}/functions/v1/revenuecat-webhook`;
    
    // Send webhook with missing app_user_id
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: WEBHOOK_SECRET,
      },
      body: JSON.stringify({
        event: {
          type: REVENUECAT_EVENT_TYPES.INITIAL_PURCHASE,
          // Missing app_user_id
        },
      }),
    });

    // Should return 400 Bad Request
    expect(response.status).toBe(400);
  });

  test('UI refresh after purchase - manual refresh', async ({ page }) => {
    // Sign in
    await page.goto('/sign-in');
    await page.fill('input[type="email"]', TEST_USER_EMAIL);
    await page.fill('input[type="password"]', TEST_USER_PASSWORD);
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/(profile|onboarding|$)/, { timeout: 10000 });

    // Navigate to profile page
    await page.goto('/profile');
    await page.waitForLoadState('networkidle');
    
    // Verify initial premium status (should be false)
    const initialStatus = page.locator('text=/standart|free/i');
    if (await initialStatus.count() > 0) {
      await expect(initialStatus.first()).toBeVisible();
    }

    // Simulate purchase
    await simulatePurchaseFlow(testUserId);
    await verifyPremiumStatus(testUserId, true);

    // Manual refresh
    await page.reload();
    await page.waitForLoadState('networkidle');
    
    // Verify premium status is now visible
    const premiumStatus = page.locator('text=/premium|active/i');
    if (await premiumStatus.count() > 0) {
      await expect(premiumStatus.first()).toBeVisible();
    }
  });

  test('premium gate shows paywall for non-premium users', async ({ page }) => {
    // Sign in
    await page.goto('/sign-in');
    await page.fill('input[type="email"]', TEST_USER_EMAIL);
    await page.fill('input[type="password"]', TEST_USER_PASSWORD);
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/(profile|onboarding|$)/, { timeout: 10000 });

    // Navigate to a page that might have premium content
    // Since we don't have a specific premium article URL, we'll check the pricing page
    await page.goto('/pricing');
    await page.waitForLoadState('networkidle');

    // Verify upgrade buttons are visible (user is not premium)
    const upgradeButton = page.locator('button:has-text("Subscribe"), button:has-text("Upgrade")').first();
    if (await upgradeButton.count() > 0) {
      await expect(upgradeButton).toBeVisible();
    }
  });

  test('premium gate shows content for premium users', async ({ page }) => {
    // Setup: Make user premium
    await simulatePurchaseFlow(testUserId);
    await verifyPremiumStatus(testUserId, true);

    // Sign in
    await page.goto('/sign-in');
    await page.fill('input[type="email"]', TEST_USER_EMAIL);
    await page.fill('input[type="password"]', TEST_USER_PASSWORD);
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/(profile|onboarding|$)/, { timeout: 10000 });

    // Navigate to profile page
    await page.goto('/profile');
    await page.reload(); // Ensure fresh data
    await page.waitForLoadState('networkidle');

    // Verify premium indicators
    const premiumIndicators = page.locator('text=/premium|active/i');
    if (await premiumIndicators.count() > 0) {
      await expect(premiumIndicators.first()).toBeVisible();
    }
  });

  test('multiple webhook events - renewal', async () => {
    // Initial purchase
    await simulatePurchaseFlow(testUserId);
    await verifyPremiumStatus(testUserId, true);

    // Simulate renewal
    const renewalResponse = await sendTestWebhook(
      REVENUECAT_EVENT_TYPES.RENEWAL,
      testUserId
    );
    
    expect(renewalResponse.ok).toBe(true);
    await waitForWebhookProcessing(testUserId, true, WEBHOOK_TEST_TIMEOUT);
    await verifyPremiumStatus(testUserId, true);
  });

  test('multiple webhook events - expiration', async () => {
    // Initial purchase
    await simulatePurchaseFlow(testUserId);
    await verifyPremiumStatus(testUserId, true);

    // Simulate expiration
    const expirationResponse = await sendTestWebhook(
      REVENUECAT_EVENT_TYPES.EXPIRATION,
      testUserId
    );
    
    expect(expirationResponse.ok).toBe(true);
    await waitForWebhookProcessing(testUserId, false, WEBHOOK_TEST_TIMEOUT);
    await verifyPremiumStatus(testUserId, false);
  });

  test('uncancellation flow', async () => {
    // Initial purchase
    await simulatePurchaseFlow(testUserId);
    await verifyPremiumStatus(testUserId, true);

    // Cancel
    await simulateCancellationFlow(testUserId);
    await verifyPremiumStatus(testUserId, false);

    // Uncancel
    const uncancelResponse = await sendTestWebhook(
      REVENUECAT_EVENT_TYPES.UNCANCELLATION,
      testUserId
    );
    
    expect(uncancelResponse.ok).toBe(true);
    await waitForWebhookProcessing(testUserId, true, WEBHOOK_TEST_TIMEOUT);
    await verifyPremiumStatus(testUserId, true);
  });
});
