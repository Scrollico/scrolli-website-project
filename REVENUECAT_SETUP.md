# RevenueCat Environment Setup

Add these environment variables to your `.env.local` file:

```bash
# RevenueCat Configuration
NEXT_PUBLIC_REVENUECAT_PUBLIC_KEY=your_revenuecat_public_key_here

# Supabase Configuration (if not already set)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Webhook Secret (for Supabase Edge Function)
RC_WEBHOOK_SECRET=your_webhook_secret_here
```

## Where to Find These Values

### RevenueCat Web Billing API Key (Required for Web SDK)

**Important**: For web applications, you must use the **Web Billing API Key**, not the regular public API key.

1. Go to [RevenueCat Dashboard](https://app.revenuecat.com/)
2. Navigate to your project
3. Go to **Apps & providers** → **Web Billing**
4. Select your Web Billing app configuration (or create one if you haven't)
5. Under **App Settings**, find the **Public API Key** for Web Billing
6. Copy this key (it should start with `rcb_`)

**Note**:

- For development/testing, use the **Sandbox API Key** (starts with `rcb_sb_...`)
- For production, use the **Production API Key** (starts with `rcb_...`)
- Do NOT use secret keys (starting with `sk_`) in client-side code

### Webhook Secret

1. In RevenueCat Dashboard, go to **Settings** → **Integrations**
2. Find or create a webhook integration
3. Set the webhook URL to: `https://[your-project].supabase.co/functions/v1/revenuecat-webhook`
4. Set a custom authorization header value (this is your `RC_WEBHOOK_SECRET`)
5. Add this secret to Supabase Edge Function environment variables:
   - Go to Supabase Dashboard → Edge Functions → `revenuecat-webhook`
   - Add `RC_WEBHOOK_SECRET` environment variable

## RevenueCat Product Setup

1. Create products in RevenueCat Dashboard:

   - Go to **Products** → **Offerings**
   - Create an offering (e.g., "default")
   - Add packages:
     - Monthly subscription
     - Annual subscription (optional)
     - Lifetime purchase (optional)

2. Configure entitlements:

   - Go to **Entitlements**
   - Create an entitlement called `premium`
   - Link your products to this entitlement

3. Connect payment processor:
   - Go to **Integrations**
   - Connect Stripe (or other payment processor)
   - Configure your products in Stripe

## Testing

### Test Mode

RevenueCat automatically uses test mode when you're in development. Use Stripe test cards for purchases.

### Webhook Testing

Test the webhook locally:

```bash
curl -X POST https://[your-project].supabase.co/functions/v1/revenuecat-webhook \
  -H "Authorization: Bearer [your-secret]" \
  -H "Content-Type: application/json" \
  -d '{
    "event": {
      "type": "INITIAL_PURCHASE",
      "app_user_id": "[test-user-id]"
    }
  }'
```

## Next Steps

1. Add environment variables to `.env.local`
2. Restart your development server: `npm run dev`
3. Visit `/pricing` to see RevenueCat offerings
4. Test purchase flow with Stripe test cards
