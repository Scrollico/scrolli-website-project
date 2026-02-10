# RevenueCat Webhook Debugging Guide

## ✅ Enhanced Webhook Deployed

The webhook function `revenuecat-webhook` has been deployed with enhanced logging and premium details tracking.

## 🔍 Key Issues Found

### 1. **Function Name Mismatch**
- **Deployed function**: `revenucat-subscription` (typo - missing 'e')
- **Correct function**: `revenuecat-webhook` ✅ (now deployed)
- **Action**: Update RevenueCat webhook URL to point to the correct function

### 2. **User ID Mapping**
The webhook expects `app_user_id` from RevenueCat to match Supabase `user.id`. 

**Current Flow:**
- RevenueCat SDK initializes with: `appUserId = user.id` (Supabase user ID)
- Webhook receives: `app_user_id` from RevenueCat
- Webhook looks up: `profiles.id = app_user_id`

**If this doesn't match**, the webhook will fail with "Profile not found".

## 🔧 Configuration Checklist

### Step 1: Update RevenueCat Webhook URL

1. Go to [RevenueCat Dashboard](https://app.revenuecat.com/)
2. Navigate to **Settings** → **Integrations** → **Webhooks**
3. Update webhook URL to:
   ```
   https://mylxytrdxvkjvijiegds.supabase.co/functions/v1/revenuecat-webhook
   ```
4. Verify Authorization Header matches `RC_WEBHOOK_SECRET`

### Step 2: Verify Webhook Secret

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Navigate to **Edge Functions** → **revenuecat-webhook** → **Settings** → **Secrets**
3. Ensure `RC_WEBHOOK_SECRET` is set
4. Copy this value and verify it matches RevenueCat webhook Authorization header

### Step 3: Verify User ID Mapping

**Check if RevenueCat is using Supabase user ID:**

1. In your app, when user logs in, verify RevenueCat is initialized with user ID:
   ```typescript
   // In revenuecat-provider.tsx or client.ts
   await initializeRevenueCat(user?.id); // Should be Supabase user.id
   ```

2. Check browser console when user purchases - look for:
   ```
   Configuring RevenueCat with: { appUserId: "..." }
   ```
   This should be the Supabase user UUID.

3. In RevenueCat Dashboard → **Customers**, find your test user
4. Verify the **App User ID** matches the Supabase `auth.users.id`

## 📊 Enhanced Webhook Features

The new webhook includes:

✅ **Better Logging**: Full payload logging with emojis for easy debugging
✅ **User Lookup**: Tries direct ID match, then falls back to `revenuecat_customer_id`
✅ **Premium Details**: Tracks `premium_since`, `current_period_start`, transaction details
✅ **Error Handling**: Detailed error messages with stack traces
✅ **Product Mapping**: Supports multiple product ID formats

## 🧪 Testing the Webhook

### Test Webhook Manually

```bash
curl -X POST https://mylxytrdxvkjvijiegds.supabase.co/functions/v1/revenuecat-webhook \
  -H "Authorization: YOUR_RC_WEBHOOK_SECRET" \
  -H "Content-Type: application/json" \
  -d '{
    "event": {
      "type": "INITIAL_PURCHASE",
      "app_user_id": "YOUR_SUPABASE_USER_ID",
      "product_id": "web_billing_monthly",
      "purchased_at": "2026-01-10T12:00:00Z"
    }
  }'
```

### Check Webhook Logs

1. Go to Supabase Dashboard → **Edge Functions** → **revenuecat-webhook** → **Logs**
2. Look for:
   - 📥 Raw webhook payload
   - 🔍 Parsed webhook event
   - ✅ Found profile messages
   - 📝 Update operations
   - ❌ Any errors

## 🐛 Common Issues

### Issue 1: "Profile not found"
**Cause**: `app_user_id` from RevenueCat doesn't match Supabase `user.id`

**Solution**:
1. Verify RevenueCat is initialized with Supabase user ID
2. Check RevenueCat Dashboard → Customer → App User ID
3. Ensure user has signed up in Supabase first

### Issue 2: "Unauthorized" (401)
**Cause**: Webhook secret mismatch

**Solution**:
1. Verify `RC_WEBHOOK_SECRET` in Supabase Edge Function secrets
2. Verify Authorization header in RevenueCat webhook config
3. Ensure no extra spaces or newlines in secret

### Issue 3: Webhook returns 200 but database not updated
**Cause**: User lookup failing silently

**Solution**:
1. Check webhook logs for "Profile not found" messages
2. Verify user exists in `profiles` table
3. Check if `app_user_id` format matches (UUID vs string)

## 📝 Webhook Response Format

**Success Response:**
```json
{
  "success": true,
  "message": "Premium status updated to true (monthly) for user ...",
  "data": {
    "user_id": "...",
    "app_user_id": "...",
    "is_premium": true,
    "subscription_tier": "monthly",
    "premium_since": "2026-01-10T12:00:00Z",
    "event_type": "INITIAL_PURCHASE",
    "product_id": "web_billing_monthly",
    "price": 1.90,
    "currency": "USD",
    "transaction_id": "...",
    "expiration_at": "..."
  }
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "Profile not found for app_user_id: ...",
  "message": "User must sign up first before subscription can be processed"
}
```

## 🔄 Next Steps

1. ✅ Update RevenueCat webhook URL to `revenuecat-webhook`
2. ✅ Verify webhook secret matches
3. ✅ Test a purchase and check webhook logs
4. ✅ Verify database updates correctly
5. ✅ Check that `is_premium` and `subscription_tier` are updated

## 📞 Support

If issues persist:
1. Check Supabase Edge Function logs
2. Check RevenueCat webhook delivery logs
3. Verify user ID mapping in both systems
4. Test with a known user ID manually
