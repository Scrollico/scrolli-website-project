import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test('should display sign-in page', async ({ page }) => {
    await page.goto('/sign-in');
    await expect(page).toHaveTitle(/Scrolli/i);
    // Check for sign-in form elements
    await expect(page.locator('input[type="email"]')).toBeVisible();
  });

  test('should navigate to subscribe page', async ({ page }) => {
    await page.goto('/sign-in');
    // Look for subscribe link and click it
    const subscribeLink = page.locator('a[href*="subscribe"]').first();
    if (await subscribeLink.isVisible()) {
      await subscribeLink.click();
      await expect(page).toHaveURL(/subscribe/);
    }
  });

  test('should display onboarding page for new users', async ({ page }) => {
    await page.goto('/onboarding');
    await expect(page).toHaveURL(/onboarding/);
    // Check for onboarding form
    const form = page.locator('form');
    await expect(form).toBeVisible();
  });
});
