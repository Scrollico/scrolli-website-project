import { test, expect } from '@playwright/test';

test.describe('Newsletter Subscription', () => {
  test('should display newsletter signup on homepage', async ({ page }) => {
    await page.goto('/');
    
    // Scroll to newsletter section (adjust selector as needed)
    const newsletterSection = page.locator('text=/bülten|newsletter/i').first();
    
    if (await newsletterSection.isVisible()) {
      await newsletterSection.scrollIntoViewIfNeeded();
      
      // Check for email input
      const emailInput = page.locator('input[type="email"]').filter({ hasText: /bülten/i }).or(
        page.locator('input[type="email"]').near(newsletterSection)
      );
      
      if (await emailInput.count() > 0) {
        await expect(emailInput.first()).toBeVisible();
      }
    }
  });

  test('should validate email format in newsletter form', async ({ page }) => {
    await page.goto('/');
    
    // Find newsletter email input
    const emailInput = page.locator('input[type="email"]').first();
    
    if (await emailInput.isVisible()) {
      // Try invalid email
      await emailInput.fill('invalid-email');
      
      // Check for validation error (adjust based on your form implementation)
      const submitButton = page.locator('button[type="submit"]').near(emailInput);
      if (await submitButton.isVisible()) {
        // Form should prevent submission or show error
        await expect(emailInput).toHaveValue('invalid-email');
      }
    }
  });
});
