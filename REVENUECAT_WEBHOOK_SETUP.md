# RevenueCat Webhook Setup & Testing Guide

## ✅ Completed Steps

### 1. Migration Applied ✅

- Migration `006_metered_subscription.sql` has been successfully applied
- Added columns: `articles_read_count`, `last_reset_date`, `usage_limit` to `profiles` table

### 2. Edge Function Deployed ✅

- `revenuecat-webhook` Edge Function has been deployed with the correct implementation
- Function URL: `https://mylxytrdxvkjvijiegds.supabase.co/functions/v1/revenuecat-webhook`

## 🔧 Required Setup Steps

### Step 0: Configure RevenueCat Web Billing API Key (If Not Done)

**Important**: Make sure you're using the correct Web Billing API key, not a regular public API key.

1. Go to [RevenueCat Dashboard](https://app.revenuecat.com/)
2. Navigate to **Apps & providers** → **Web Billing**
3. Select your Web Billing app (or create one)
4. Under **App Settings**, copy the **Public API Key**
5. Add to `.env.local`:
   ```bash
   NEXT_PUBLIC_REVENUECAT_PUBLIC_KEY=rcb_your_web_billing_key_here
   ```
6. Restart your development server

**Note**: For development, use the Sandbox key (`rcb_sb_...`). For production, use the Production key (`rcb_...`).

### Step 1: Set RC_WEBHOOK_SECRET in Supabase

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Navigate to **Edge Functions** → **revenuecat-webhook**
4. Click on **Settings** or **Secrets**
5. Add a new secret:
   - **Name**: `RC_WEBHOOK_SECRET`
   - **Value**: Generate a secure random string (e.g., use `openssl rand -hex 32`)
   - **Example**: `a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6`

**Important**: Save this secret value - you'll need it for RevenueCat configuration!

### Step 2: Configure RevenueCat Webhook

1. Go to [RevenueCat Dashboard](https://app.revenuecat.com/)
2. Navigate to your project
3. Go to **Settings** → **Integrations** → **Webhooks**
4. Click **Add Webhook** or edit existing webhook
5. Configure:
   - **Webhook URL**: `https://mylxytrdxvkjvijiegds.supabase.co/functions/v1/revenuecat-webhook`
   - **Authorization Header**: Set this to the same value as `RC_WEBHOOK_SECRET` from Step 1
   - **Events to Send**: Select all relevant events:
     - `INITIAL_PURCHASE`
     - `RENEWAL`
     - `CANCELLATION`
     - `UNCANCELLATION`
     - `EXPIRATION`
     - `PRODUCT_CHANGE`
6. Save the webhook configuration

### Step 3: Verify Configuration

Test the webhook endpoint:

```bash
# Replace YOUR_SECRET with your actual RC_WEBHOOK_SECRET
curl -X POST https://mylxytrdxvkjvijiegds.supabase.co/functions/v1/revenuecat-webhook \
  -H "Authorization: YOUR_SECRET" \
  -H "Content-Type: application/json" \
  -d '{
    "event": {
      "type": "INITIAL_PURCHASE",
      "app_user_id": "test-user-id"
    }
  }'
```

Expected response:

```json
{
  "success": true,
  "message": "Premium status updated to true for user test-user-id"
}
```

## 🧪 Testing the Full Flow

### Flow: Anonymous → Email Gate → Free Articles → Paywall → Subscribe

#### Prerequisites

- Development server running: `npm run dev`
- Test user account created (or use sign-up flow)
- RevenueCat test products configured
- Stripe test mode enabled

#### Test Steps

1. **Anonymous User Experience**

   - Visit any article page (e.g., `/article/[id]`)
   - Should see email gate modal
   - Enter email address
   - Should gain access to first free article

2. **Free Articles (Metered Access)**

   - Read first article (counts as 1 free article)
   - Read second article (counts as 2 free articles)
   - Read third article (counts as 3 free articles - limit reached)
   - On 4th article attempt, should see paywall

3. **Paywall Display**

   - When free article limit is reached
   - Should see paywall modal/slide-up
   - Should display subscription options
   - Should show pricing from RevenueCat

4. **Subscribe Flow**

   - Click "Subscribe" or "Upgrade" button
   - Should redirect to RevenueCat checkout
   - Complete purchase with Stripe test card:
     - Card: `4242 4242 4242 4242`
     - Expiry: Any future date
     - CVC: Any 3 digits
   - After successful purchase:
     - RevenueCat sends webhook to Supabase
     - Webhook updates `is_premium` to `true` in database
     - User gains access to all premium content

5. **Verify Premium Status**
   - Check user profile: `/profile`
   - Should show premium badge/indicator
   - Should have access to all articles
   - Metered limits should be bypassed

### Automated Testing

#### Quick Webhook Test Script

Test the webhook configuration and database setup:

```bash
# Run the test script (requires .env.local with secrets)
npm run test:revenuecat
```

This script will:

- ✅ Test webhook endpoint security (401 for invalid secrets)
- ✅ Verify metered subscription columns exist
- ✅ Create a test user and verify webhook updates premium status
- ✅ Clean up test data

#### E2E Test Suite

Run the full E2E test suite:

```bash
# Run all RevenueCat tests
npm run test:e2e

# Run specific test file
npx playwright test tests/e2e/revenuecat-paywall.spec.ts

# Run with UI for debugging
npm run test:e2e:ui
```

### Manual Webhook Testing

Test webhook directly using the test helper:

```typescript
import { sendTestWebhook } from "./tests/helpers/revenuecat-helpers";

// Test purchase webhook
const response = await sendTestWebhook("INITIAL_PURCHASE", "user-id-here");
console.log(await response.json());
```

## 🔍 Troubleshooting

### "Invalid API key. Use your Web Billing API key" Error

**Symptom**: Console error when initializing RevenueCat:

```
Invalid API key. Use your Web Billing API key.
```

**Solution**:

1. You're using the wrong type of API key. RevenueCat Web SDK requires a **Web Billing API key**, not a regular public API key.
2. Get the correct key:
   - Go to RevenueCat Dashboard → **Apps & providers** → **Web Billing**
   - Select your Web Billing app (create one if needed)
   - Go to **App Settings** → **Public API Key**
   - Copy this key (starts with `rcb_` or `rcb_sb_` for sandbox)
3. Update `.env.local`:
   ```bash
   NEXT_PUBLIC_REVENUECAT_PUBLIC_KEY=rcb_your_web_billing_key_here
   ```
4. Restart your development server: `npm run dev`

**Common Mistakes**:

- ❌ Using API key from **Settings → API Keys** (these are for server-side use)
- ❌ Using secret keys (starting with `sk_`) in client code
- ✅ Use Web Billing API key from **Apps & providers → Web Billing → App Settings**

### Webhook Returns 401 Unauthorized

- Verify `RC_WEBHOOK_SECRET` is set in Supabase Edge Function secrets
- Verify RevenueCat webhook Authorization header matches the secret
- Check that the secret doesn't have extra spaces or newlines

### Webhook Returns 400 Bad Request

- Verify webhook payload format matches expected structure
- Check that `event.type` and `event.app_user_id` are present
- Review Edge Function logs in Supabase Dashboard

### Premium Status Not Updating

- Check Edge Function logs for errors
- Verify `app_user_id` matches Supabase `user_id`
- Ensure RevenueCat SDK is configured to use Supabase user ID as `app_user_id`
- Check database RLS policies allow service role updates

### Migration Issues

- Verify migration was applied: Check Supabase Dashboard → Database → Migrations
- Verify columns exist: Run `SELECT * FROM profiles LIMIT 1;` in SQL Editor
- Check for any migration errors in Supabase logs

## 📋 Checklist

- [ ] Migration `006_metered_subscription.sql` applied
- [ ] Edge Function `revenuecat-webhook` deployed
- [ ] `RC_WEBHOOK_SECRET` set in Supabase Edge Function secrets
- [ ] RevenueCat webhook URL configured
- [ ] RevenueCat webhook Authorization header set
- [ ] Webhook events selected in RevenueCat
- [ ] Test webhook call successful
- [ ] Anonymous → Email gate flow works
- [ ] Free articles metering works (1 free + 2 metered)
- [ ] Paywall displays after limit
- [ ] Subscribe flow completes
- [ ] Premium status updates after purchase
- [ ] E2E tests pass

## 🔗 Useful Links

- [Supabase Dashboard](https://supabase.com/dashboard/project/mylxytrdxvkjvijiegds)
- [RevenueCat Dashboard](https://app.revenuecat.com/)
- [Edge Function Logs](https://supabase.com/dashboard/project/mylxytrdxvkjvijiegds/functions/revenuecat-webhook/logs)
- [Database Tables](https://supabase.com/dashboard/project/mylxytrdxvkjvijiegds/editor)
