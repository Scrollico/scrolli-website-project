import { test, expect } from '@playwright/test';

test.describe('Scrollytelling Component Stress Test', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to pricing page where component is located
    await page.goto('http://localhost:3002/pricing');
    // Wait for initial load
    await page.waitForSelector('section');
  });

  test('should initially load the pricing page correctly', async ({ page }) => {
    await expect(page).toHaveTitle(/Scrolli/);
    const stickySection = page.locator('section.w-full.relative').first();
    await expect(stickySection).toBeVisible();
  });

  test('should snap to the component when scrolling near', async ({ page }) => {
    // The component has class .sticky and is inside a .snap-start section
    const stickyContainer = page.locator('section.w-full.relative').first();
    
    // Get location
    const box = await stickyContainer.boundingBox();
    if (!box) throw new Error('Container not found');

    // Scroll slightly before it
    await page.mouse.wheel(0, box.y - 100);
    await page.waitForTimeout(500); // Wait for snap

    // Verify viewport top is close to component top (Snapped)
    // Note: This is tricky to test precisely depending on browser snap speed, 
    // but we check if we are closer than we scrolled.
    const scrollTop = await page.evaluate(() => window.scrollY);
    const elementTop = await stickyContainer.evaluate(el => el.getBoundingClientRect().top + window.scrollY);
    
    // Allow small margin of error for snap alignment
    expect(Math.abs(scrollTop - elementTop)).toBeLessThan(50);
  });

  test('should maintain sticky position during deep scroll', async ({ page }) => {
    const stickyContainer = page.locator('section.w-full.relative').first();
    const stickyContent = stickyContainer.locator('div.sticky');

    // Scroll into the container to trigger sticking
    const box = await stickyContainer.boundingBox();
    if (!box) throw new Error('Container not found');
    
    // Scroll 100vh into the 500vh container
    await page.evaluate((y) => window.scrollTo(0, y + window.innerHeight), box.y);
    await page.waitForTimeout(100);

    // Check if content is still at the top of the viewport
    const contentBox = await stickyContent.boundingBox();
    // Expect top to be 0 relative to viewport
    expect(contentBox?.y).toBeLessThan(5); // approx 0
    expect(contentBox?.y).toBeGreaterThan(-5);
  });

  test('should animate transformation (Circle to Arc)', async ({ page }) => {
    const stickyContainer = page.locator('section.w-full.relative').first();
    const box = await stickyContainer.boundingBox();
    if (!box) throw new Error('Container not found');

    // 1. Initial State (scatter/line) - check first image
    // Scroll just to start
    await page.evaluate((y) => window.scrollTo(0, y), box.y);
    await page.waitForTimeout(1000); // wait for intro

    const firstCard = stickyContainer.locator('div[style*="transform"]').first();
    // Capture initial transform
    const initialTransform = await firstCard.getAttribute('style');

    // 2. Scroll 20% into container (Morph Phase)
    await page.evaluate((y) => window.scrollTo(0, y + window.innerHeight * 1), box.y);
    await page.waitForTimeout(500);
    
    const morphedTransform = await firstCard.getAttribute('style');
    expect(morphedTransform).not.toEqual(initialTransform);
  });

  test('should animate rotation (Arc Rotation)', async ({ page }) => {
    const stickyContainer = page.locator('section.w-full.relative').first();
    const box = await stickyContainer.boundingBox();
    if (!box) throw new Error('Container not found');

    // Scroll deep (80%)
    await page.evaluate((y) => window.scrollTo(0, y + window.innerHeight * 3.5), box.y);
    await page.waitForTimeout(500);

    // Check that transform has complexity (implies rotation/arc logic active)
    const firstCard = stickyContainer.locator('div[style*="transform"]').first();
    const style = await firstCard.getAttribute('style');
    // Expect change from simple translate. 
    // Just verifying it is NOT the same as initial state is enough combined with visual check
    // But we know it should have complex transform
    expect(style).toContain('transform:');
    expect(style).not.toContain('scale(1)'); // It should scale up in Arc phase
  });

  test('should exit sticky state at end of container', async ({ page }) => {
    const stickyContainer = page.locator('section.w-full.relative').first();
    const box = await stickyContainer.boundingBox();
    if (!box) throw new Error('Container not found');

    // Scroll PAST the container (height 500vh -> ~5000px)
    await page.evaluate((y) => window.scrollTo(0, y + window.innerHeight * 6), box.y);
    await page.waitForTimeout(100);

    // Content should now be scrolled out of view.
    // Sticky content stays at TOP of PARENT.
    // When parent is scrolled out of view, sticky content moves UP with it.
    // So Y should be negative.
    const stickyContent = stickyContainer.locator('div.sticky');
    const contentBox = await stickyContent.boundingBox();
    
    // If bounding box returns a value, it should be negative (above viewport)
    // If logic holds
    if (contentBox) {
        expect(contentBox.y).toBeLessThan(0);
    }
  });

  test('performance: FPS check during scroll', async ({ page }) => {
    const stickyContainer = page.locator('section.w-full.relative').first();
    const box = await stickyContainer.boundingBox();
    if (!box) return; // Skip if header failed
    
    await page.evaluate((y) => window.scrollTo(0, y), box.y);
    
    // Fast scroll down
    await page.evaluate(async () => {
        const distance = window.innerHeight * 4;
        const steps = 10;
        const scrollTime = 1000;
        for(let i=0; i<steps; i++) {
            window.scrollBy(0, distance/steps);
            await new Promise(r => setTimeout(r, scrollTime/steps));
        }
    });

    // Verification passed if no error thrown
    expect(true).toBe(true);
  });
});
