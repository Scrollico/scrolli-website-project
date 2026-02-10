# Subscription Status Debugging Guide

## Problem: Subscription Status Changes to Free Unexpectedly

If a user's subscription status changes from premium to free after purchase, here's how to debug:

## Step 1: Check Database Status

Run this query to see the user's current status:

```sql
SELECT 
  id,
  email,
  is_premium,
  subscription_tier,
  revenuecat_customer_id,
  premium_since,
  current_period_start,
  updated_at
FROM profiles
WHERE email = 'user@example.com';
```

**What to look for:**
- `is_premium`: Should be `true` for active subscriptions
- `premium_since`: If set, user was premium at some point
- `updated_at`: When the status was last changed
- `revenuecat_customer_id`: Should match the Supabase user ID

## Step 2: Check Webhook Logs

1. Go to Supabase Dashboard → Edge Functions → `revenuecat-webhook` → Logs
2. Look for recent events with the user's email or RevenueCat customer ID
3. Check for these event types:
   - `EXPIRATION` - Subscription expired
   - `REVOKE` - Subscription was revoked
   - `CANCELLATION` - Subscription was cancelled (doesn't immediately revoke access)

**Key indicators:**
- Look for `⏰ Subscription expired/revoked` messages
- Check the `event_type` in the response
- Verify the `app_user_id` matches the Supabase user ID

## Step 3: Check RevenueCat Dashboard

1. Go to RevenueCat Dashboard → Customers
2. Search for the user's email or RevenueCat customer ID
3. Check:
   - **Active Entitlements**: Should show "Scrolli Premium" as active
   - **Subscription Status**: Should show active, not expired
   - **Expiration Date**: Check if it's in the past
   - **Recent Events**: Check for EXPIRATION or REVOKE events

## Step 4: Common Causes

### 1. Test Subscription with Short Period
**Symptom:** Subscription expires within hours
**Solution:** Check if you're using a test product with a very short subscription period (e.g., 1 hour)

### 2. Payment Failure
**Symptom:** Subscription created but payment fails
**Solution:** Check Stripe dashboard for failed payments

### 3. UUID Mismatch
**Symptom:** Webhook updates wrong user
**Solution:** Verify `revenuecat_customer_id` matches Supabase `user.id`

### 4. Webhook Event Received
**Symptom:** Status changes after webhook call
**Solution:** Check webhook logs for EXPIRATION/REVOKE events

## Step 5: Use Debug Script

Run the debug script to get a comprehensive status report:

```bash
npx tsx scripts/debug-subscription-status.ts nihat@scrolli.co
```

This will show:
- Current profile status
- Auth user details
- UUID matching status
- Potential issues

## Step 6: Fix Issues

### If UUID Mismatch:
1. User needs to reconfigure RevenueCat with correct UUID
2. Call `loginUser(userId, email)` after sign-in
3. Verify `revenuecat_customer_id` in database matches `user.id`

### If Subscription Expired:
1. Check RevenueCat dashboard for actual expiration
2. If it's a test subscription, extend the period
3. If payment failed, check Stripe and retry payment

### If Wrong User Updated:
1. Check webhook logs for the `app_user_id` used
2. Verify email matching is working correctly
3. Check if multiple users have the same email

## Prevention

1. **Always use Supabase user ID for RevenueCat**: Call `loginUser(userId, email)` after authentication
2. **Monitor webhook logs**: Set up alerts for EXPIRATION events
3. **Test subscriptions carefully**: Use proper test periods, not 1-hour subscriptions
4. **Verify UUID matching**: Check `revenuecat_customer_id` matches `user.id` after purchase

## Webhook Event Types

- `INITIAL_PURCHASE` → Sets `is_premium = true`
- `RENEWAL` → Keeps `is_premium = true`
- `CANCELLATION` → Does NOT change status (access continues until expiration)
- `EXPIRATION` → Sets `is_premium = false`
- `REVOKE` → Sets `is_premium = false`
- `UNCANCELLATION` → Sets `is_premium = true`
