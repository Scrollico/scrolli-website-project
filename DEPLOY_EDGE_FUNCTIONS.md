# Deploy Edge Functions for OneSignal Integration

## Prerequisites

1. Supabase CLI installed and logged in:
   ```bash
   supabase login
   ```

2. Project linked:
   ```bash
   supabase link --project-ref mylxytrdxvkjvijiegds
   ```

## Deploy Commands

Run these commands in order:

```bash
# 1. Deploy updated newsletter-subscribe function
supabase functions deploy newsletter-subscribe

# 2. Deploy new onesignal-sync function
supabase functions deploy onesignal-sync

# 3. Deploy new onesignal-webhook function
supabase functions deploy onesignal-webhook
```

## Set Secrets

After deploying, set the OneSignal secrets:

```bash
# Set OneSignal App ID
supabase secrets set ONESIGNAL_APP_ID=abaa0673-fdc6-4dc4-bba6-9e389f56fb5b

# Set OneSignal REST API Key
supabase secrets set ONESIGNAL_REST_API_KEY=nwrgjndndejsema6cp6pwsbq5
```

**Note:** Your OneSignal credentials are already in `.env.local`. Use the same values above.

## Verify Deployment

1. Go to Supabase Dashboard → Edge Functions
2. Verify all three functions are listed:
   - `newsletter-subscribe`
   - `onesignal-sync`
   - `onesignal-webhook`
3. Check that secrets are set in each function's settings

## Function URLs

After deployment, your functions will be available at:

- `https://mylxytrdxvkjvijiegds.supabase.co/functions/v1/newsletter-subscribe`
- `https://mylxytrdxvkjvijiegds.supabase.co/functions/v1/onesignal-sync`
- `https://mylxytrdxvkjvijiegds.supabase.co/functions/v1/onesignal-webhook`

## Next Steps

After deployment:
1. Configure Database Webhooks (see ONESIGNAL_SETUP.md)
2. Configure OneSignal Webhook (see ONESIGNAL_SETUP.md)
3. Run tests (see ONESIGNAL_TESTING.md)
