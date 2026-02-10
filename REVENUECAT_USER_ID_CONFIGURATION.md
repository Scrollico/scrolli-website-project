# RevenueCat User ID Configuration Fix

## Problem

RevenueCat was generating random `app_user_id` values instead of using Supabase user UUIDs. This caused webhooks to fail because the `app_user_id` in webhook payloads didn't match any Supabase profile IDs.

**Root Cause**: RevenueCat Web SDK needs to be explicitly configured with the Supabase user ID. Without this configuration, RevenueCat generates anonymous IDs that don't match Supabase profiles.

## Solution

### 1. Enhanced `loginUser` Function

The `loginUser` function in `lib/revenuecat/client.ts` now:
- Properly resets the RevenueCat instance before reconfiguration
- Uses Supabase UUID as `appUserId` when configuring RevenueCat
- Adds comprehensive logging to track configuration
- Verifies configuration by fetching customer info

**Key Code**:
```typescript
// CRITICAL: Use Supabase UUID as RevenueCat customer ID
purchasesInstance = await Purchases.configure({
  apiKey: apiKey,
  appUserId: userId, // Supabase UUID
});
```

### 2. Automatic Configuration in Provider

The `RevenueCatProvider` automatically configures RevenueCat when:
- User signs in (watches `user?.id` changes)
- User signs up (watches `user?.id` changes)
- User returns from email verification (watches `user?.id` changes)

**Key Code**:
```typescript
// Initialize RevenueCat - pass user ID if available
await initializeRevenueCat(user?.id);
```

### 3. Explicit Configuration in Subscribe Flow

The `SubscribePageContent` component explicitly configures RevenueCat:
- After signup: Calls `loginUser(data.user.id)` immediately
- After signin: Calls `loginUser(data.user.id)` immediately
- Before purchase: Verifies RevenueCat is initialized

**Key Code**:
```typescript
// After signup/signin
await loginUser(data.user.id);

// Before purchase
if (!isInitialized) {
  await loginUser(activeUserId);
}
```

## How It Works

### Flow for New User Signup:

1. User enters email/password on `/subscribe?plan=monthly`
2. `handleAuthSubmit` calls `supabase.auth.signUp()`
3. **CRITICAL**: `loginUser(data.user.id)` is called immediately
4. RevenueCat is configured with Supabase UUID: `app_user_id = user.id`
5. User proceeds to payment step
6. User makes purchase → RevenueCat sends webhook with `app_user_id = Supabase UUID`
7. Webhook finds profile by matching `app_user_id` to `profiles.id`
8. Profile is updated with premium status ✅

### Flow for Existing User Signin:

1. User signs in via `/sign-in` page
2. `AuthProvider` updates `user` state
3. `RevenueCatProvider` detects `user?.id` change
4. **AUTOMATIC**: `initializeRevenueCat(user?.id)` is called
5. RevenueCat is reconfigured with Supabase UUID
6. Future purchases use the correct `app_user_id`

### Flow for Email Verification:

1. User clicks magic link in email
2. Redirected to `/auth/callback`
3. Supabase creates session
4. `AuthProvider` detects session → updates `user` state
5. `RevenueCatProvider` detects `user?.id` change
6. **AUTOMATIC**: `initializeRevenueCat(user?.id)` is called
7. RevenueCat is configured with Supabase UUID

## Verification

### Check Browser Console

When RevenueCat is configured correctly, you'll see:
```
🔐 Configuring RevenueCat with Supabase user ID: 550e8400...
✅ RevenueCat configured with user ID: 550e8400...
```

### Check Webhook Logs

In Supabase Edge Function logs, you should see:
```
🔍 Looking up user with app_user_id: 550e8400-e29b-41d4-a716-446655440000
✅ Found profile by direct ID match: 550e8400-e29b-41d4-a716-446655440000
```

### Common Issues

**Issue**: Webhook returns 404 "Profile not found"
- **Cause**: RevenueCat `app_user_id` doesn't match Supabase UUID
- **Fix**: Ensure `loginUser(userId)` is called after signup/signin
- **Check**: Browser console should show RevenueCat configuration logs

**Issue**: RevenueCat generates random IDs
- **Cause**: RevenueCat not configured with user ID
- **Fix**: Check that `RevenueCatProvider` is in the component tree and `user?.id` is available
- **Check**: Verify `initializeRevenueCat(user?.id)` is called with actual user ID (not undefined)

## Testing

1. **New User Signup Flow**:
   - Go to `/subscribe?plan=monthly`
   - Enter email and password
   - Check browser console for: `🔐 Configuring RevenueCat with new user ID`
   - Complete purchase
   - Check webhook logs for successful profile update

2. **Existing User Signin Flow**:
   - Sign in via `/sign-in`
   - Check browser console for: `🔐 RevenueCatProvider: Initializing with Supabase user ID`
   - Make a purchase
   - Verify webhook receives correct `app_user_id`

3. **Email Verification Flow**:
   - Sign up with email (magic link)
   - Click verification link
   - Check browser console for RevenueCat configuration
   - Verify user can make purchases

## Files Modified

1. `lib/revenuecat/client.ts`
   - Enhanced `loginUser()` with better logging and instance reset
   - Added `verifyUserConfiguration()` helper
   - Improved `initializeRevenueCat()` logging

2. `components/providers/revenuecat-provider.tsx`
   - Added logging to track user ID configuration
   - Ensures RevenueCat is always configured with Supabase UUID

3. `app/subscribe/SubscribePageContent.tsx`
   - Explicit `loginUser()` calls after signup/signin
   - Verification before purchase
   - Added logging for debugging

## Critical Points

✅ **ALWAYS** configure RevenueCat with Supabase user ID (`user.id`)
✅ **NEVER** let RevenueCat generate anonymous IDs for authenticated users
✅ **VERIFY** configuration before purchases (check `isInitialized`)
✅ **LOG** all configuration steps for debugging

## Next Steps

1. Test the complete signup → purchase → webhook flow
2. Verify webhook logs show successful profile updates
3. Check that `app_user_id` in webhook payloads matches Supabase UUIDs
4. Monitor for any 404 errors in webhook logs
