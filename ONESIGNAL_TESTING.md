# OneSignal Integration Testing Guide

This document outlines comprehensive testing scenarios for the OneSignal + Supabase newsletter integration.

## Prerequisites for Testing

1. ✅ Migration `012_onesignal_integration.sql` applied
2. Edge Functions deployed:
   - `newsletter-subscribe`
   - `onesignal-sync`
   - `onesignal-webhook`
3. OneSignal credentials configured in Supabase secrets:
   - `ONESIGNAL_APP_ID`
   - `ONESIGNAL_REST_API_KEY`
4. Database webhooks configured (see ONESIGNAL_SETUP.md)
5. OneSignal webhook configured (see ONESIGNAL_SETUP.md)

## Test Scenarios

### Test 1: Guest User Subscription via NewsletterSignup Component

**Steps:**
1. Navigate to homepage (not logged in)
2. Find `NewsletterSignup` component
3. Enter email: `guest-test@example.com`
4. Select briefings: `ana-bulten` and `gundem-ozeti`
5. Click "Sign Up"

**Expected Results:**
- ✅ Success message appears
- ✅ Email saved in `newsletter_subscribers` table
- ✅ `briefing_preferences` = `["ana-bulten", "gundem-ozeti"]`
- ✅ `is_active` = `true`
- ✅ `onesignal_player_id` populated (if OneSignal API succeeds)
- ✅ `onesignal_synced_at` timestamp set
- ✅ Subscriber appears in OneSignal Dashboard
- ✅ OneSignal tags set correctly:
  - `briefing_ana-bulten` = `true`
  - `briefing_gundem-ozeti` = `true`
  - `briefing_is-dunyasi` = `false`
  - `briefing_teknoloji` = `false`
  - `source` = `"website"`

**Database Verification:**
```sql
SELECT email, briefing_preferences, onesignal_player_id, onesignal_synced_at, is_active
FROM newsletter_subscribers
WHERE email = 'guest-test@example.com';
```

**OneSignal Verification:**
- Go to OneSignal Dashboard → Audience
- Search for `guest-test@example.com`
- Verify tags match expected values

---

### Test 2: Guest User Subscription via NewsletterPopup

**Steps:**
1. Navigate to homepage (not logged in)
2. Wait 30 seconds OR scroll 25% down
3. Newsletter popup appears
4. Enter email: `popup-test@example.com`
5. Click "I want to subscribe"

**Expected Results:**
- ✅ Popup closes after successful subscription
- ✅ Email saved in `newsletter_subscribers` table
- ✅ `briefing_preferences` = `["ana-bulten", "gundem-ozeti"]` (default briefings)
- ✅ All other checks from Test 1

**Database Verification:**
```sql
SELECT email, briefing_preferences
FROM newsletter_subscribers
WHERE email = 'popup-test@example.com';
```

---

### Test 3: Authenticated User Subscription via OnboardingForm

**Steps:**
1. Sign up or log in
2. Complete onboarding form
3. Enter full name
4. Check newsletter checkbox (should be checked by default)
5. Click "Devam Et"

**Expected Results:**
- ✅ Profile updated: `newsletter_subscribed` = `true`
- ✅ Entry created in `newsletter_subscribers` table
- ✅ `briefing_preferences` = `["ana-bulten", "gundem-ozeti"]` (default)
- ✅ `profiles.onesignal_player_id` populated (if OneSignal succeeds)
- ✅ OneSignal subscriber created/updated
- ✅ User redirected to homepage

**Database Verification:**
```sql
-- Check profile
SELECT id, email, newsletter_subscribed, onesignal_player_id
FROM profiles
WHERE email = 'your-test-email@example.com';

-- Check newsletter subscriber
SELECT email, briefing_preferences, onesignal_player_id
FROM newsletter_subscribers
WHERE email = 'your-test-email@example.com';
```

---

### Test 4: Authenticated User Updates Briefing Preferences

**Steps:**
1. User already subscribed (from Test 3)
2. Navigate to homepage
3. Use `NewsletterSignup` component
4. Enter same email (user's email)
5. Select different briefings: `is-dunyasi` and `teknoloji`
6. Submit

**Expected Results:**
- ✅ Existing subscriber updated (not duplicated)
- ✅ `briefing_preferences` merged/updated: `["ana-bulten", "gundem-ozeti", "is-dunyasi", "teknoloji"]`
- ✅ OneSignal tags updated:
  - `briefing_ana-bulten` = `true`
  - `briefing_gundem-ozeti` = `true`
  - `briefing_is-dunyasi` = `true`
  - `briefing_teknoloji` = `true`

**Database Verification:**
```sql
SELECT email, briefing_preferences
FROM newsletter_subscribers
WHERE email = 'your-test-email@example.com';
```

---

### Test 5: Duplicate Email Handling

**Steps:**
1. Subscribe with email: `duplicate-test@example.com` (via NewsletterSignup)
2. Try subscribing again with same email (via NewsletterPopup)

**Expected Results:**
- ✅ No duplicate entries in database
- ✅ Existing subscriber updated
- ✅ `updated_at` timestamp refreshed
- ✅ Briefing preferences merged (if different)

**Database Verification:**
```sql
SELECT COUNT(*) as count
FROM newsletter_subscribers
WHERE email = 'duplicate-test@example.com';
-- Should return 1
```

---

### Test 6: Database Webhook Sync (newsletter_subscribers)

**Steps:**
1. Manually update `briefing_preferences` in database:
```sql
UPDATE newsletter_subscribers
SET briefing_preferences = '["teknoloji"]'::jsonb
WHERE email = 'webhook-test@example.com';
```

**Expected Results:**
- ✅ Database webhook triggers `onesignal-sync` Edge Function
- ✅ OneSignal tags updated to reflect new preferences
- ✅ `onesignal_synced_at` timestamp updated
- ✅ Check Edge Function logs for success

**Verification:**
- Supabase Dashboard → Edge Functions → `onesignal-sync` → Logs
- OneSignal Dashboard → Verify tags updated

---

### Test 7: Database Webhook Sync (profiles.newsletter_subscribed)

**Steps:**
1. Authenticated user exists
2. Manually update profile:
```sql
UPDATE profiles
SET newsletter_subscribed = true
WHERE email = 'profile-webhook-test@example.com';
```

**Expected Results:**
- ✅ Database webhook triggers `onesignal-sync`
- ✅ If subscriber record exists, OneSignal tags updated
- ✅ If no subscriber record, function handles gracefully

**Verification:**
- Check Edge Function logs
- Verify OneSignal sync (if subscriber exists)

---

### Test 8: OneSignal Webhook - Unsubscribe

**Steps:**
1. Subscribe a test email: `unsubscribe-test@example.com`
2. In OneSignal Dashboard, manually unsubscribe the email
3. OR send test email and click unsubscribe link

**Expected Results:**
- ✅ OneSignal webhook calls `onesignal-webhook` Edge Function
- ✅ `newsletter_subscribers.is_active` = `false`
- ✅ If user exists in `profiles`, `newsletter_subscribed` = `false`
- ✅ Check Edge Function logs for webhook event

**Database Verification:**
```sql
SELECT email, is_active
FROM newsletter_subscribers
WHERE email = 'unsubscribe-test@example.com';
-- is_active should be false

SELECT email, newsletter_subscribed
FROM profiles
WHERE email = 'unsubscribe-test@example.com';
-- newsletter_subscribed should be false (if user exists)
```

---

### Test 9: OneSignal Webhook - Email Bounce

**Steps:**
1. Subscribe with invalid email (if possible) OR
2. Simulate bounce event in OneSignal

**Expected Results:**
- ✅ `onesignal-webhook` receives bounce event
- ✅ `newsletter_subscribers.is_active` = `false`
- ✅ Profile updated if user exists

---

### Test 10: Error Handling - OneSignal API Failure

**Steps:**
1. Temporarily set wrong `ONESIGNAL_REST_API_KEY` in Supabase secrets
2. Try subscribing with email: `error-test@example.com`

**Expected Results:**
- ✅ Subscription still saved to Supabase (graceful degradation)
- ✅ Error logged in Edge Function logs
- ✅ `onesignal_player_id` remains NULL
- ✅ User sees success message (subscription saved)
- ✅ Webhook sync will retry later (when OneSignal is fixed)

**Verification:**
- Check Edge Function logs for OneSignal error
- Verify subscriber exists in database despite OneSignal failure

---

### Test 11: Error Handling - Invalid Email

**Steps:**
1. Try subscribing with invalid email: `not-an-email`

**Expected Results:**
- ✅ Validation error returned
- ✅ No database entry created
- ✅ No OneSignal API call
- ✅ User sees error message

---

### Test 12: Error Handling - Empty Briefings Array

**Steps:**
1. Try subscribing with email but no briefings selected

**Expected Results:**
- ✅ Frontend prevents submission (if validation exists)
- ✅ OR backend returns error if briefings array is empty
- ✅ No subscription created

**Note:** Check if this validation exists in frontend components.

---

## Automated Test Queries

Run these SQL queries to verify database state:

```sql
-- Check all subscribers with OneSignal sync status
SELECT 
  email,
  briefing_preferences,
  onesignal_player_id IS NOT NULL as has_onesignal_id,
  onesignal_synced_at,
  is_active,
  created_at
FROM newsletter_subscribers
ORDER BY created_at DESC
LIMIT 10;

-- Check profiles with newsletter subscription
SELECT 
  email,
  newsletter_subscribed,
  onesignal_player_id IS NOT NULL as has_onesignal_id
FROM profiles
WHERE newsletter_subscribed = true
LIMIT 10;

-- Find subscribers without OneSignal sync
SELECT email, created_at
FROM newsletter_subscribers
WHERE onesignal_player_id IS NULL
AND is_active = true;
```

## Edge Function Logs

Monitor these Edge Functions in Supabase Dashboard:

1. **newsletter-subscribe** - Check for:
   - Successful subscriptions
   - OneSignal API calls
   - Error handling

2. **onesignal-sync** - Check for:
   - Webhook triggers
   - OneSignal API updates
   - Sync timestamps

3. **onesignal-webhook** - Check for:
   - Unsubscribe events
   - Bounce events
   - Database updates

## OneSignal Dashboard Verification

1. **Audience** - Verify subscribers appear with correct tags
2. **Segments** - Create segments based on briefing tags:
   - `briefing_ana-bulten = true`
   - `briefing_gundem-ozeti = true`
   - etc.
3. **Webhooks** - Check webhook delivery logs
4. **Email** - Send test email to verify delivery

## Known Limitations & Future Enhancements

1. **Retry Logic**: Currently, if OneSignal API fails, webhook sync will retry, but there's no exponential backoff
2. **Batch Sync**: No batch sync for existing subscribers (manual migration needed)
3. **Briefing Management**: No UI for users to update briefing preferences after initial subscription
4. **Analytics**: No tracking of subscription sources or conversion rates

## Test Checklist

- [ ] Test 1: Guest user via NewsletterSignup
- [ ] Test 2: Guest user via NewsletterPopup
- [ ] Test 3: Authenticated user via OnboardingForm
- [ ] Test 4: Update briefing preferences
- [ ] Test 5: Duplicate email handling
- [ ] Test 6: Database webhook (newsletter_subscribers)
- [ ] Test 7: Database webhook (profiles)
- [ ] Test 8: OneSignal webhook (unsubscribe)
- [ ] Test 9: OneSignal webhook (bounce)
- [ ] Test 10: Error handling (OneSignal failure)
- [ ] Test 11: Error handling (invalid email)
- [ ] Test 12: Error handling (empty briefings)

## Next Steps After Testing

1. Fix any issues found during testing
2. Monitor Edge Function logs for errors
3. Set up OneSignal segments for email campaigns
4. Create email templates in OneSignal
5. Schedule regular newsletter sends
