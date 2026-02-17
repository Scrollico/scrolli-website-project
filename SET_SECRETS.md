# Set Secrets for Edge Functions

All Edge Functions have been deployed successfully! Set the required secrets per function.

## SITE_URL (create-subscription-user)

The **create-subscription-user** Edge Function uses `SITE_URL` for the auth callback URL when generating sign-in links after payment. Set it so the link points at your app:

- **Production**: `SITE_URL=https://scrolli.co` (or your production domain)
- **Local**: Omit or use `http://localhost:3000` (function defaults to localhost if unset)

**Where to set**: Supabase Dashboard → Edge Functions → **create-subscription-user** → Settings → Secrets. Add `SITE_URL` with your app origin (no trailing slash). Without this, post-purchase sign-in links may point at localhost in production and redirect will fail.

---

## OneSignal secrets

## Option 1: Via Supabase Dashboard (Recommended)

1. Go to [Supabase Dashboard](https://supabase.com/dashboard/project/mylxytrdxvkjvijiegds)
2. Navigate to **Edge Functions** → Select each function → **Settings** → **Secrets**
3. Add the following secrets for **each function**:
   - `newsletter-subscribe`
   - `onesignal-sync`
   - `onesignal-webhook`

**Secrets to add:**

- **ONESIGNAL_APP_ID**: `YOUR_ONESIGNAL_APP_ID`
- **ONESIGNAL_REST_API_KEY**: `YOUR_ONESIGNAL_REST_API_KEY`

## Option 2: Via Supabase CLI

If you have Supabase CLI logged in:

```bash
# Set secrets for newsletter-subscribe
supabase secrets set ONESIGNAL_APP_ID=YOUR_ONESIGNAL_APP_ID --project-ref YOUR_SUPABASE_PROJECT_REF
supabase secrets set ONESIGNAL_REST_API_KEY=YOUR_ONESIGNAL_REST_API_KEY --project-ref YOUR_SUPABASE_PROJECT_REF

# Note: Secrets are project-wide, so they'll be available to all Edge Functions
```

## Verify Secrets Are Set

After setting secrets, you can verify by:

1. Checking Edge Function logs after a test subscription
2. Looking for "OneSignal credentials not configured" warnings (should NOT appear)

## Next Steps

After secrets are set:

1. ✅ Edge Functions deployed
2. ⏳ Set OneSignal secrets (this step)
3. Configure Database Webhooks (see ONESIGNAL_SETUP.md)
4. Configure OneSignal Webhook (see ONESIGNAL_SETUP.md)
5. Run tests (see ONESIGNAL_TESTING.md)
