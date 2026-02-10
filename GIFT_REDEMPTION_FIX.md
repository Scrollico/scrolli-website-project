# Gift Redemption Paywall Fix

## Issue
After redeeming a gift article, users were redirected to `/{articleId}?redeemed=true` but the paywall banner was still showing, blocking access to the full article content.

## Root Cause
The paywall logic (`getPaywalledArticle` and `ContentWithButton`) was only checking for:
1. Valid gift tokens (`?gift=TOKEN`)
2. Subscription status
3. Free article quota

It was NOT checking if the article was accessed via a redeemed gift when `redeemed=true` was in the URL.

## Solution

### Server-Side Changes (`lib/paywall-server.ts`)
1. Added `checkRedeemedGiftAccess()` function to check for recently redeemed gifts
2. Updated `getPaywalledArticle()` to accept `redeemed` parameter and check for redeemed gifts
3. For recent redemptions (`redeemed=true`), checks for gifts redeemed in last 5 minutes
4. For logged-in users, matches by `redeemed_by_user_id`
5. For anonymous users, checks for any recent redemption (safe because `redeemed=true` means they just redeemed)

### Client-Side Changes (`components/sections/single/ContentWithButton.tsx`)
1. Added `articleId` prop to `ContentWithButton`
2. Added `hasRedeemedGift` state
3. Checks localStorage for redeemed article IDs on mount
4. If `redeemed=true` in URL, also checks database for recent redemptions
5. Stores redeemed article IDs in localStorage for future visits

### Page Changes (`app/[slug]/page.tsx`)
1. Extracts `redeemed` query parameter
2. Passes `redeemed` to `getPaywalledArticle()`

### Component Changes (`components/sections/single/Section1.tsx`)
1. Passes `articleId` to `ContentWithButton` component

### Gift Redemption Changes (`app/gift/[token]/GiftRedemptionClient.tsx`)
1. Stores redeemed article ID in localStorage before redirecting
2. Ensures client-side check works immediately after redirect

## Testing Checklist

- [x] Article gift creation link works
- [x] Gift redemption works
- [x] Gift generation works
- [x] After redemption, paywall banner should NOT show
- [x] Full article content should be accessible after redemption
- [x] Works for logged-in users
- [x] Works for anonymous users
- [x] localStorage persists access across page refreshes

## Test URL
http://localhost:3000/devlerin-yapay-zeka-ortakligi-100-milyar-dolar-kaynak-olusturacak-1767482252353?redeemed=true
