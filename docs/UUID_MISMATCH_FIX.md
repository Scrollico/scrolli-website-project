# UUID Mismatch Fix - RevenueCat Webhook Issue

## Problem

Users were experiencing subscription status changes from premium to free unexpectedly. Root cause: **UUID mismatch** between RevenueCat `app_user_id` and Supabase `user.id`.

### Symptoms
- User purchases subscription → becomes premium
- After a few hours → status changes to free
- User never cancelled or expired subscription
- Debug shows: `RevenueCat ID != Supabase ID`

### Root Cause

RevenueCat was configured with a different UUID than the Supabase user ID. When webhooks arrived:
1. Webhook uses RevenueCat `app_user_id` to find user
2. If UUID doesn't match, webhook tries email matching
3. Email matching might find wrong user OR fail
4. Webhook updates wrong user OR fails to update
5. User's premium status gets incorrectly revoked

## Solution

### 1. Fixed UUID Mismatch in Database ✅

Updated `revenuecat_customer_id` to match the actual Supabase `user.id`:

```sql
UPDATE profiles
SET revenuecat_customer_id = id::text
WHERE revenuecat_customer_id::uuid != id
  AND premium_since IS NOT NULL;
```

### 2. Auto-Fix in Webhook ✅

Webhook now automatically fixes UUID mismatches when found:

```typescript
// When email matching finds correct user but UUID doesn't match
if (emailProfile && targetUserId !== app_user_id) {
  // Auto-fix: Update revenuecat_customer_id to match correct user ID
  await supabaseAdmin
    .from('profiles')
    .update({ revenuecat_customer_id: targetUserId })
    .eq('id', targetUserId);
}
```

### 3. Ensure Correct UUID on Purchase ✅

Updated subscription flow to always pass email to `loginUser()`:

```typescript
// In SubscribePageContent.tsx
await loginUser(userId, email || user?.email || undefined);
```

This ensures:
- RevenueCat is configured with correct Supabase UUID
- Email attribute is set for webhook matching
- Future purchases use correct UUID

## Prevention

### Always Use Supabase User ID

1. **After Sign-In**: Call `loginUser(userId, email)` immediately
2. **Before Purchase**: Verify RevenueCat is configured with correct UUID
3. **Check Database**: Ensure `revenuecat_customer_id = user.id`

### Migration Applied

Migration `011_fix_revenuecat_uuid_mismatch.sql` fixes existing mismatches and prevents future ones.

## Verification

Run debug script to check UUID matching:

```bash
npx tsx scripts/debug-subscription-status.ts user@example.com
```

Look for:
- ✅ `UUID Match: ✅` - Correct
- ❌ `UUID Match: ❌` - Needs fixing

## Next Steps

If a user's premium status was incorrectly revoked:

1. **Check RevenueCat Dashboard**: Verify subscription is still active
2. **Check Webhook Logs**: Look for EXPIRATION/REVOKE events around the time status changed
3. **Restore Status**: If subscription is active in RevenueCat but free in database, manually restore:
   ```sql
   UPDATE profiles
   SET is_premium = true, subscription_tier = 'monthly'
   WHERE id = 'user-id' AND premium_since IS NOT NULL;
   ```

## Related Files

- `supabase/migrations/011_fix_revenuecat_uuid_mismatch.sql` - Migration to fix mismatches
- `supabase/functions/revenuecat-webhook/index.ts` - Auto-fix logic
- `app/subscribe/SubscribePageContent.tsx` - Ensure correct UUID on purchase
- `scripts/debug-subscription-status.ts` - Debug tool
