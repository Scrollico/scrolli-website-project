# OneSignal + Supabase Newsletter Integration Setup Guide

This guide covers the manual configuration steps required after deploying the code changes.

**Integration note:** OneSignal sync (e.g. updating `profiles.onesignal_player_id` or newsletter subscribers) is best-effort. Auth and redirect (sign-in, post-purchase) must succeed even if OneSignal sync fails; do not block or fail the auth flow on OneSignal errors.

## Prerequisites

- OneSignal account with App ID and REST API Key
- Supabase project with Edge Functions deployed
- Migration `012_onesignal_integration.sql` applied to database

## Step 1: Apply Database Migration

If you haven't already, apply the migration:

```bash
supabase db push
```

Or apply it manually in Supabase Dashboard → SQL Editor.

## Step 2: Deploy Edge Functions

Deploy all three Edge Functions:

```bash
# Deploy newsletter-subscribe (updated)
supabase functions deploy newsletter-subscribe

# Deploy onesignal-sync (new)
supabase functions deploy onesignal-sync

# Deploy onesignal-webhook (new)
supabase functions deploy onesignal-webhook
```

## Step 3: Configure Edge Function Secrets

In Supabase Dashboard → Edge Functions → Settings → Secrets, add:

1. **ONESIGNAL_APP_ID** - Your OneSignal App ID (from OneSignal Dashboard → Settings → Keys & IDs)
2. **ONESIGNAL_REST_API_KEY** - Your OneSignal REST API Key (from OneSignal Dashboard → Settings → Keys & IDs)

To set secrets via CLI:

```bash
supabase secrets set ONESIGNAL_APP_ID=your_app_id_here
supabase secrets set ONESIGNAL_REST_API_KEY=your_rest_api_key_here
```

## Step 4: Configure Database Webhooks

### Webhook 1: newsletter_subscribers table

1. Go to Supabase Dashboard → Database → Webhooks
2. Click "Create a new webhook"
3. Configure:
   - **Name**: `newsletter_subscribers_to_onesignal`
   - **Table**: `newsletter_subscribers`
   - **Events**: Select `INSERT` and `UPDATE`
   - **Type**: `HTTP Request`
   - **Method**: `POST`
   - **URL**: `https://[your-project-ref].supabase.co/functions/v1/onesignal-sync`
   - **HTTP Headers**:
     - `Content-Type`: `application/json`
     - `Authorization`: `Bearer [your-service-role-key]` (Add service role key for authentication)
   - **Timeout**: `1000` (1 second)

### Webhook 2: profiles table

1. Go to Supabase Dashboard → Database → Webhooks
2. Click "Create a new webhook"
3. Configure:
   - **Name**: `profiles_newsletter_to_onesignal`
   - **Table**: `profiles`
   - **Events**: Select `UPDATE` only
   - **Type**: `HTTP Request`
   - **Method**: `POST`
   - **URL**: `https://[your-project-ref].supabase.co/functions/v1/onesignal-sync`
   - **HTTP Headers**:
     - `Content-Type`: `application/json`
     - `Authorization`: `Bearer [your-service-role-key]`
   - **Timeout**: `1000`

**Note**: The webhook will only sync when `newsletter_subscribed` changes. The Edge Function handles filtering.

## Step 5: Configure OneSignal Webhook

1. Go to OneSignal Dashboard → Settings → Integrations → Webhooks
2. Click "Add Webhook" or edit existing webhook
3. Configure:
   - **Webhook URL**: `https://[your-project-ref].supabase.co/functions/v1/onesignal-webhook`
   - **Events to send**:
     - ✅ `email.unsubscribed`
     - ✅ `email.bounced`
     - ✅ `email.spam_complaint`
     - ✅ `email.subscribed` (optional, for reactivation)
   - **HTTP Method**: `POST`
   - **Content Type**: `application/json`

## Step 6: Test the Integration

### Test 1: Guest User Subscription

1. Go to your website homepage
2. Find the newsletter signup form (`NewsletterSignup` component)
3. Enter an email and select briefings
4. Submit the form
5. Verify:
   - Email is saved in `newsletter_subscribers` table
   - `briefing_preferences` contains selected briefings
   - `onesignal_player_id` is populated
   - Subscriber appears in OneSignal Dashboard with correct tags

### Test 2: Newsletter Popup

1. Scroll down 25% on homepage (or wait 30 seconds)
2. Newsletter popup should appear
3. Enter email and submit
4. Verify subscription is created with default briefings (`ana-bulten`, `gundem-ozeti`)

### Test 3: Authenticated User Subscription

1. Sign up or log in
2. Complete onboarding form
3. Check newsletter checkbox
4. Submit form
5. Verify:
   - `profiles.newsletter_subscribed` is `true`
   - Entry exists in `newsletter_subscribers` table
   - OneSignal subscriber is created/updated

### Test 4: Database Webhook Sync

1. Manually update `briefing_preferences` in `newsletter_subscribers` table
2. Check Supabase Edge Function logs for `onesignal-sync`
3. Verify OneSignal tags are updated

### Test 5: OneSignal Webhook (Unsubscribe)

1. In OneSignal Dashboard, manually unsubscribe a test email
2. Or send a test email and click unsubscribe link
3. Verify:
   - `newsletter_subscribers.is_active` is set to `false`
   - If user exists in `profiles`, `newsletter_subscribed` is set to `false`

## Troubleshooting

### Edge Function Errors

Check Supabase Dashboard → Edge Functions → Logs for error messages.

Common issues:

- **Missing OneSignal credentials**: Ensure `ONESIGNAL_APP_ID` and `ONESIGNAL_REST_API_KEY` are set
- **OneSignal API errors**: Check that App ID and REST API Key are correct
- **Database errors**: Verify migration was applied correctly

### Webhook Not Triggering

- Check webhook configuration in Supabase Dashboard
- Verify webhook URL is correct
- Check Edge Function logs for incoming requests
- Ensure service role key is included in webhook headers

### OneSignal Tags Not Updating

- Check `onesignal-sync` Edge Function logs
- Verify briefing preferences are saved correctly in database
- Check OneSignal API response for errors

## Briefing Tags Reference

OneSignal tags are structured as:

- `briefing_ana-bulten`: `true` or `false`
- `briefing_gundem-ozeti`: `true` or `false`
- `briefing_is-dunyasi`: `true` or `false`
- `briefing_teknoloji`: `true` or `false`
- `source`: `"website"`
- `subscribed_at`: ISO timestamp string

## OneSignal Segments

You can create segments in OneSignal Dashboard using these tags:

- **Ana Bülten Subscribers**: `briefing_ana-bulten = true`
- **Gündem Özeti Subscribers**: `briefing_gundem-ozeti = true`
- **Multiple Briefings**: `briefing_ana-bulten = true AND briefing_gundem-ozeti = true`

## Next Steps

After setup is complete:

1. Test all subscription flows
2. Create OneSignal segments for each briefing type
3. Set up email campaigns in OneSignal
4. Monitor Edge Function logs for any errors
5. Consider adding retry logic for failed OneSignal API calls (future enhancement)
