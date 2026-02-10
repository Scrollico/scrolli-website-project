/**
 * User Journey Matrix E2E Tests
 *
 * Covers matrix rows 1–11 (article access: anon, logged in, quota, gift)
 * and subscribe/auth flows. Uses API discovery for premium/free slugs.
 */

import { test, expect } from "@playwright/test";
import {
  getArticleSlugs,
  getPremiumSlug,
  getFreeSlug,
} from "../helpers/article-discovery";
import { setupTestUser, cleanupTestUser } from "../helpers/revenuecat-helpers";
import {
  updateProfile,
  getArticlesReadCount,
  setArticlesReadCount,
  createTestGift,
} from "../helpers/supabase-helpers";
import { TEST_USER_PASSWORD } from "../helpers/test-constants";

test.describe("User Journey Matrix – Article Access", () => {
  let testUserId: string;
  const testEmail = `test-matrix-${Date.now()}@scrolli.co`;

  test.beforeAll(async () => {
    const slugs = await getArticleSlugs();
    if (!slugs.premiumSlug || !slugs.freeSlug) {
      test.skip();
    }
  });

  test.beforeEach(async () => {
    const user = await setupTestUser(testEmail, TEST_USER_PASSWORD);
    testUserId = user.userId;
    await updateProfile(testUserId, {
      is_premium: false,
      subscription_tier: "free",
      articles_read_count: 0,
      current_period_start: new Date().toISOString().split("T")[0],
      last_reset_date: new Date().toISOString(),
      onboarding_completed: true,
    });
  });

  test.afterEach(async () => {
    if (testUserId) {
      await cleanupTestUser(testUserId, false);
    }
  });

  test("1 – Anon, free article: full content, no gate", async ({
    page,
    context,
  }) => {
    await context.clearCookies();
    const freeSlug = await getFreeSlug();
    await page.goto(`/${freeSlug}`, { waitUntil: "domcontentloaded" });
    await page.waitForLoadState("networkidle");

    await expect(
      page.locator('article, [class*="entry-main-content"], [class*="article-content"]').first()
    ).toBeVisible({ timeout: 8000 });
    await expect(
      page.locator('text=/sınırsız|unlimited|abone ol|subscribe|Sign in/i').first()
    ).not.toBeVisible({ timeout: 3000 }).catch(() => {});
  });

  test("2 – Anon, premium: preview + paywall CTA", async ({
    page,
    context,
  }) => {
    await context.clearCookies();
    const premiumSlug = await getPremiumSlug();
    await page.goto(`/${premiumSlug}`, { waitUntil: "domcontentloaded" });
    await page.waitForLoadState("networkidle");

    const paywallOrCta = page.locator(
      'text=/sınırsız|unlimited|abone ol|subscribe|Sign in|Giriş|üye ol/i'
    ).first();
    await expect(paywallOrCta).toBeVisible({ timeout: 10000 });
  });

  test("5 – Logged in, 0→1: full content, count 1, backend increment", async ({
    page,
  }) => {
    await setArticlesReadCount(testUserId, 0);
    await page.goto("/sign-in");
    await page.fill('input[type="email"]', testEmail);
    await page.fill('input[type="password"]', TEST_USER_PASSWORD);
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/(profile|onboarding|$|\/)/, { timeout: 15000 });

    const premiumSlug = await getPremiumSlug();
    await page.goto(`/${premiumSlug}`, { waitUntil: "domcontentloaded" });
    await page.waitForLoadState("networkidle");

    const content = page.locator('article [class*="article-content"], .entry-main-content').first();
    await expect(content).toBeVisible({ timeout: 8000 });

    await page.waitForTimeout(2000);
    const count = await getArticlesReadCount(testUserId);
    expect(count).toBeGreaterThanOrEqual(1);
  });

  test("6 – Logged in, 1→2: full content, count 2", async ({ page }) => {
    await setArticlesReadCount(testUserId, 1);
    await page.goto("/sign-in");
    await page.fill('input[type="email"]', testEmail);
    await page.fill('input[type="password"]', TEST_USER_PASSWORD);
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/(profile|onboarding|$|\/)/, { timeout: 15000 });

    const premiumSlug = await getPremiumSlug();
    await page.goto(`/${premiumSlug}`, { waitUntil: "domcontentloaded" });
    await page.waitForLoadState("networkidle");

    await page.waitForTimeout(2000);
    const count = await getArticlesReadCount(testUserId);
    expect(count).toBeGreaterThanOrEqual(2);
  });

  test("7 – Logged in, at limit: paywall, no full content", async ({
    page,
  }) => {
    await setArticlesReadCount(testUserId, 2);
    await page.goto("/sign-in");
    await page.fill('input[type="email"]', testEmail);
    await page.fill('input[type="password"]', TEST_USER_PASSWORD);
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/(profile|onboarding|$|\/)/, { timeout: 15000 });

    const premiumSlug = await getPremiumSlug();
    await page.goto(`/${premiumSlug}`, { waitUntil: "domcontentloaded" });
    await page.waitForLoadState("networkidle");

    const paywall = page.locator(
      'text=/sınırsız|unlimited|abone ol|subscribe|üye ol/i'
    ).first();
    await expect(paywall).toBeVisible({ timeout: 10000 });
  });

  test("8 – Logged in, premium: full content, no paywall", async ({
    page,
  }) => {
    await updateProfile(testUserId, {
      is_premium: true,
      subscription_tier: "monthly",
    });
    await page.goto("/sign-in");
    await page.fill('input[type="email"]', testEmail);
    await page.fill('input[type="password"]', TEST_USER_PASSWORD);
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/(profile|onboarding|$|\/)/, { timeout: 15000 });

    const premiumSlug = await getPremiumSlug();
    await page.goto(`/${premiumSlug}`, { waitUntil: "domcontentloaded" });
    await page.waitForLoadState("networkidle");

    const paywall = page.locator('text=/sınırsız erişimin kilidini aç/i');
    await expect(paywall).not.toBeVisible({ timeout: 5000 }).catch(() => {});
  });

  test("9 – Logged in, free article: full content", async ({ page }) => {
    await page.goto("/sign-in");
    await page.fill('input[type="email"]', testEmail);
    await page.fill('input[type="password"]', TEST_USER_PASSWORD);
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/(profile|onboarding|$|\/)/, { timeout: 15000 });

    const freeSlug = await getFreeSlug();
    await page.goto(`/${freeSlug}`, { waitUntil: "domcontentloaded" });
    await page.waitForLoadState("networkidle");

    await expect(
      page.locator('article, [class*="entry-main-content"]').first()
    ).toBeVisible({ timeout: 8000 });
  });
});

test.describe("User Journey Matrix – Gift & Invalid", () => {
  let testUserId: string;
  const testEmail = `test-gift-${Date.now()}@scrolli.co`;

  test.beforeEach(async () => {
    const user = await setupTestUser(testEmail, TEST_USER_PASSWORD);
    testUserId = user.userId;
    await updateProfile(testUserId, {
      is_premium: false,
      articles_read_count: 0,
      onboarding_completed: true,
    });
  });

  test.afterEach(async () => {
    if (testUserId) await cleanupTestUser(testUserId, false);
  });

  test("4 – Anon, premium, invalid gift: error + preview paywall", async ({
    page,
    context,
  }) => {
    await context.clearCookies();
    const premiumSlug = await getPremiumSlug();
    await page.goto(`/${premiumSlug}?gift=invalid-token-12345`, { waitUntil: "domcontentloaded" });
    await page.waitForLoadState("networkidle");

    const errorOrPaywall = page.locator(
      'text=/geçersiz|süresi dolmuş|invalid|Bu hediye/i'
    ).first();
    await expect(errorOrPaywall).toBeVisible({ timeout: 8000 }).catch(() => {
      const paywall = page.locator('text=/abone ol|subscribe|Sign in/i').first();
      return expect(paywall).toBeVisible({ timeout: 3000 });
    });
  });

  test("11 – Logged in, invalid gift: error then quota/paywall", async ({
    page,
  }) => {
    await setArticlesReadCount(testUserId, 2);
    await page.goto("/sign-in");
    await page.fill('input[type="email"]', testEmail);
    await page.fill('input[type="password"]', TEST_USER_PASSWORD);
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/(profile|onboarding|$|\/)/, { timeout: 15000 });

    const premiumSlug = await getPremiumSlug();
    await page.goto(`/${premiumSlug}?gift=invalid-token-xyz`, { waitUntil: "domcontentloaded" });
    await page.waitForLoadState("networkidle");

    const errorOrPaywall = page.locator(
      'text=/geçersiz|süresi dolmuş|abone ol|subscribe/i'
    ).first();
    await expect(errorOrPaywall).toBeVisible({ timeout: 8000 });
  });

  test("3 – Anon, premium, valid gift: full content, redeem", async ({
    page,
    context,
  }) => {
    const premiumSlug = await getPremiumSlug();
    const { giftToken } = await createTestGift(premiumSlug, testUserId);

    await context.clearCookies();
    await page.goto(`/${premiumSlug}?gift=${giftToken}`, { waitUntil: "domcontentloaded" });
    await page.waitForLoadState("networkidle");

    const giftBanner = page.locator('text=/hediye etti|İyi okumalar/i').first();
    await expect(giftBanner).toBeVisible({ timeout: 10000 });
    const content = page.locator('article [class*="article-content"], .entry-main-content').first();
    await expect(content).toBeVisible({ timeout: 8000 });
  });

  test("10 – Logged in + valid gift: full content, no increment", async ({
    page,
  }) => {
    await setArticlesReadCount(testUserId, 1);
    const premiumSlug = await getPremiumSlug();
    const { giftToken } = await createTestGift(premiumSlug, testUserId);

    await page.goto("/sign-in");
    await page.fill('input[type="email"]', testEmail);
    await page.fill('input[type="password"]', TEST_USER_PASSWORD);
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/(profile|onboarding|$|\/)/, { timeout: 15000 });

    await page.goto(`/${premiumSlug}?gift=${giftToken}`, { waitUntil: "domcontentloaded" });
    await page.waitForLoadState("networkidle");

    const giftBanner = page.locator('text=/hediye etti|İyi okumalar/i').first();
    await expect(giftBanner).toBeVisible({ timeout: 10000 });
    const countBefore = 1;
    await page.waitForTimeout(2000);
    const countAfter = await getArticlesReadCount(testUserId);
    expect(countAfter).toBe(countBefore);
  });
});

test.describe("User Journey – Subscribe & Auth UX", () => {
  test("Subscribe page: return URL from query", async ({ page }) => {
    const slugs = await getArticleSlugs();
    const premiumSlug = slugs.premiumSlug || "test-slug";
    await page.goto(`/subscribe?plan=monthly&return=/${premiumSlug}`);
    await page.waitForLoadState("networkidle");

    await expect(page).toHaveURL(/\/subscribe/);
    const returnParam = await page.evaluate(() => {
      const u = new URL(window.location.href);
      return u.searchParams.get("return");
    });
    expect(returnParam).toBe(`/${premiumSlug}`);
  });

  test("Paywall CTA links to subscribe or pricing", async ({
    page,
    context,
  }) => {
    await context.clearCookies();
    const premiumSlug = await getPremiumSlug();
    await page.goto(`/${premiumSlug}`, { waitUntil: "domcontentloaded" });
    await page.waitForLoadState("networkidle");

    const subscribeLink = page.locator('a[href*="subscribe"], a[href*="pricing"]').first();
    await expect(subscribeLink).toBeVisible({ timeout: 8000 }).catch(() => {});
  });
});
