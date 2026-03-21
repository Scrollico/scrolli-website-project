# Testing Patterns

**Analysis Date:** 2026-03-21

## Test Framework

**Runner:**
- Playwright 1.57.0 (E2E testing framework)
- Config: `playwright.config.ts`

**Assertion Library:**
- Playwright's built-in expect: `await expect(page).toHaveTitle(/Scrolli/i)`

**Run Commands:**
```bash
npm run test:e2e              # Run all E2E tests (chromium only)
npm run test:e2e:ui          # Interactive UI mode for debugging
npm run test:e2e:headed      # Run with visible browser window
```

**Browser Configuration:**
- Projects: Only Chromium (Desktop Chrome)
- No Firefox, WebKit, or other browser targets configured
- Parallelization: Enabled locally (`fullyParallel: true`)
- CI: Single worker only (`workers: 1`)

## Test File Organization

**Location:**
- All E2E tests in `/tests/e2e/` directory
- Test helpers in `/tests/helpers/` directory
- Fixtures in `/tests/fixtures/` directory

**Naming:**
- Pattern: `{feature}.spec.ts`
- Examples: `auth.spec.ts`, `subscription-flow.spec.ts`, `premium-gating.spec.ts`

**Structure:**
```
tests/
├── e2e/
│   ├── auth.spec.ts
│   ├── subscription-flow.spec.ts
│   ├── premium-gating.spec.ts
│   ├── revenuecat-paywall.spec.ts
│   ├── newsletter.spec.ts
│   ├── scrollytelling-stress.spec.ts
│   └── user-journey-matrix.spec.ts
├── helpers/
│   ├── test-constants.ts
│   ├── supabase-helpers.ts
│   ├── revenuecat-helpers.ts
│   └── article-discovery.ts
└── fixtures/
    └── (test data files)
```

## Test Structure

**Suite Organization:**
```typescript
import { test, expect } from '@playwright/test';
import { setupTestUser, cleanupTestUser } from '../helpers/revenuecat-helpers';
import { TEST_USER_EMAIL, TEST_USER_PASSWORD } from '../helpers/test-constants';

test.describe('Feature Category', () => {
  let testUserId: string;
  const testEmail = `test-${Date.now()}@scrolli.co`;

  test.beforeEach(async () => {
    // Setup test user
    const user = await setupTestUser(testEmail, TEST_USER_PASSWORD);
    testUserId = user.userId;
  });

  test.afterEach(async () => {
    // Cleanup
    if (testUserId) {
      await cleanupTestUser(testUserId, false);
    }
  });

  test('should perform expected behavior', async ({ page }) => {
    // Test implementation
  });
});
```

**Suite Nesting:**
- Primary grouping: `test.describe('Feature Category')`
- Secondary grouping: `test.describe('Sub-feature', () => { ... })`
- Example from `subscription-flow.spec.ts`:
  - `test.describe('Subscription Flow - Complete System')`
  - `test.describe('Hard Email Gate Flow')`
  - `test.describe('Article Access Tracking')`

**Patterns:**
- Setup: `test.beforeEach()` - initialize test user, reset state
- Teardown: `test.afterEach()` - clean up test user, remove data
- Assertion: `expect()` for all validations
- Navigation: `await page.goto(url)`
- Wait: `await page.waitForLoadState('networkidle')`

## Mocking

**Framework:**
- No dedicated mocking library (Playwright has built-in interception)
- Route interception: `page.route()` for API mocks
- Request spy/stub patterns used in helpers

**Patterns:**
- Test helpers handle real backend calls (Supabase, RevenueCat)
- Database state reset between tests
- Webhooks simulated via test helpers
- No request mocking - uses real endpoints with test credentials

**What to Mock:**
- API responses in helpers (via fetch with test endpoints)
- External payment processing (simulate via webhook helpers)
- Database state (via `updateProfile()`, `setArticlesReadCount()`)

**What NOT to Mock:**
- Page navigation (use real page.goto())
- User authentication flows (use real sign-in endpoint)
- DOM interactions (Playwright interacts with real DOM)
- Network requests to backend (use real test server)

## Fixtures and Factories

**Test Data:**
```typescript
// From test-constants.ts
export const TEST_USER_EMAIL = process.env.TEST_USER_EMAIL || "test-paywall@scrolli.co";
export const TEST_USER_PASSWORD = process.env.TEST_USER_PASSWORD || "demo-test-password-123!";

export const STRIPE_TEST_CARD = {
  number: "4242 4242 4242 4242",
  expiry: "12/34",
  cvc: "123",
  zip: "12345",
};

export const WEBHOOK_TEST_TIMEOUT = 30000; // 30 seconds
export const WEBHOOK_POLL_INTERVAL = 2000; // 2 seconds

export const REVENUECAT_EVENT_TYPES = {
  INITIAL_PURCHASE: "INITIAL_PURCHASE",
  RENEWAL: "RENEWAL",
  CANCELLATION: "CANCELLATION",
  EXPIRATION: "EXPIRATION",
  UNCANCELLATION: "UNCANCELLATION",
  PRODUCT_CHANGE: "PRODUCT_CHANGE",
} as const;

export const SUBSCRIPTION_TEST_CONSTANTS = {
  FREE_ARTICLE_LIMIT: 3,
  MONTHLY_TIER: "monthly",
  YEARLY_TIER: "yearly",
  LIFETIME_TIER: "lifetime",
  FREE_TIER: "free",
} as const;

export const PRODUCT_TIER_MAP = {
  web_billing_monthly: "monthly",
  web_billing_yearly: "yearly",
  web_billing_lifetime: "lifetime",
} as const;
```

**Location:**
- Test constants: `/tests/helpers/test-constants.ts`
- Supabase helpers: `/tests/helpers/supabase-helpers.ts`
- RevenueCat helpers: `/tests/helpers/revenuecat-helpers.ts`
- Article helpers: `/tests/helpers/article-discovery.ts`

**Factory Functions:**
- `setupTestUser(email: string, password: string)` - Creates test user account
- `cleanupTestUser(userId: string, deletePermanently: boolean)` - Removes test data
- `simulatePurchaseFlow(userId: string)` - Sets up premium user state
- `sendTestWebhook(eventType: string, userId: string, ...)` - Triggers webhook events

## Coverage

**Requirements:**
- No minimum coverage enforced
- Coverage optional/best-effort
- Focus on critical paths:
  - Authentication flows
  - Subscription system (email gate, paywall, webhooks)
  - Article access control
  - Premium status transitions

**Test Types:**
- **E2E tests:** Full user journeys from sign-in through subscription
- **Integration tests:** Webhook processing, database state transitions
- **System tests:** Multi-step workflows (purchase → renewal → expiration)

## Test Types

**Unit Tests:**
- Scope: Individual functions, components
- Approach: Not implemented (no Jest/Vitest config)
- Note: Focus is on E2E behavior rather than unit isolation

**Integration Tests:**
- Scope: Multi-component flows, backend integration
- Approach: Playwright tests with real Supabase backend
- Examples:
  - Sign-in → Email gate submission → Article access
  - Webhook receipt → User premium status update
  - Monthly reset logic → Article counter reset

**E2E Tests:**
- Framework: Playwright
- Scope: Complete user workflows
- Browser: Chromium only
- Retries: 2 on CI, 0 locally
- Trace: `on-first-retry` (collect on failure)
- Screenshot: `only-on-failure`

## Common Patterns

**Async Testing:**
```typescript
test('should complete async operation', async ({ page }) => {
  // Navigate
  await page.goto('/page');

  // Wait for network idle
  await page.waitForLoadState('networkidle');

  // Interact
  await page.fill('input[type="email"]', testEmail);

  // Wait for specific condition
  await expect(page).toHaveURL(/expected-url/);

  // Explicit wait if needed
  await page.waitForTimeout(2000);
});
```

**Error Testing:**
```typescript
test('should show error on invalid input', async ({ page }) => {
  await page.goto('/sign-in');

  // Try invalid action
  await page.fill('input[type="email"]', 'invalid');
  await page.click('button[type="submit"]');

  // Expect error state
  const errorMessage = page.locator('text=/error|invalid/i');
  await expect(errorMessage).toBeVisible({ timeout: 5000 });
});
```

**State Verification:**
```typescript
test('should persist user state', async ({ page }) => {
  // Setup initial state
  await setArticlesReadCount(testUserId, 2);
  await verifyArticlesReadCount(testUserId, 2);

  // Refresh page
  await page.reload();
  await page.waitForLoadState('networkidle');

  // Verify state persisted
  const count = await getArticlesReadCount(testUserId);
  expect(count).toBe(2);
});
```

**DOM Interaction Patterns:**
```typescript
// Select by type
await page.fill('input[type="email"]', value);

// Select by text
const submitButton = page.locator('button:has-text("Submit")').first();

// Select by placeholder
const emailInput = page.locator('input[placeholder*="email"]');

// Select by class (last resort)
const modal = page.locator('[class*="modal"]');

// Case-insensitive text match
const gate = page.locator('text=/e-posta|email|makaleyi aç/i');
```

**Webhook Testing:**
```typescript
test('should update premium status on webhook', async () => {
  // Initial state
  await verifyPremiumStatus(testUserId, false);

  // Send webhook
  const webhookResponse = await sendTestWebhook(
    REVENUECAT_EVENT_TYPES.INITIAL_PURCHASE,
    testUserId,
    undefined,
    'web_billing_monthly'
  );

  expect(webhookResponse.ok).toBe(true);

  // Wait for async processing
  await waitForWebhookProcessing(testUserId, true, WEBHOOK_TEST_TIMEOUT);

  // Verify result
  await verifyPremiumStatus(testUserId, true);
  await verifySubscriptionTier(testUserId, 'monthly');
});
```

## Configuration

**Playwright Config (`playwright.config.ts`):**
```typescript
{
  testDir: './tests/e2e',
  fullyParallel: true,           // Local only
  forbidOnly: !!process.env.CI,  // Fail if .only remains
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: process.env.PLAYWRIGHT_TEST_BASE_URL || 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    extraHTTPHeaders: { 'Accept-Language': 'en-US,en;q=0.9' },
  },
  timeout: 60000,                // 60 seconds per test
  expect: { timeout: 10000 },    // 10 seconds per assertion
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } }
  ],
  webServer: {                   // Auto-start dev server
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  }
}
```

**Environment Variables (Required for Tests):**
- `PLAYWRIGHT_TEST_BASE_URL` - Test server URL (default: `http://localhost:3000`)
- `SUPABASE_URL` - Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY` - Admin access for test cleanup
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Client-side auth
- `TEST_USER_EMAIL` - Test account email
- `TEST_USER_PASSWORD` - Test account password
- `USE_EXISTING_SERVER` - Set to `1` to skip `npm run dev`

**Helper Functions Pattern:**
```typescript
// supabase-helpers.ts - Database state management
export async function getSupabaseClient() { ... }
export async function queryProfile(userId: string): Promise<Profile | null> { ... }
export async function updateProfile(userId: string, updates: Partial<Profile>) { ... }
export async function getArticlesReadCount(userId: string): Promise<number> { ... }

// revenuecat-helpers.ts - RevenueCat simulation
export async function setupTestUser(email: string, password: string) { ... }
export async function simulatePurchaseFlow(userId: string) { ... }
export async function sendTestWebhook(eventType: string, userId: string, ...) { ... }
export async function waitForWebhookProcessing(userId: string, shouldBePremium: boolean, timeout: number) { ... }

// test-constants.ts - Shared test data
export const TEST_USER_EMAIL = "..."
export const WEBHOOK_TEST_TIMEOUT = 30000
export const REVENUECAT_EVENT_TYPES = { ... }
```

---

*Testing analysis: 2026-03-21*
