# RevenueCat Credentials Error - Fix Guide

## Error: "There was a credentials issue"

This error means RevenueCat can't authenticate with your API key. Here's how to fix it:

## ✅ Step-by-Step Fix

### 1. Verify Your Web Billing App Exists

1. Go to [RevenueCat Dashboard](https://app.revenuecat.com/)
2. Navigate to **Apps & providers** → **Web Billing**
3. **Do you see a Web Billing app?**
   - ✅ If YES → Go to step 2
   - ❌ If NO → Create one (see below)

**To Create Web Billing App:**
- Click **"+ New"** or **"Add Web Billing"**
- Select your Stripe account
- Set Default Currency (e.g., USD, EUR, TRY)
- Set App Name (e.g., "Scrolli")
- Set Support Email
- Save

### 2. Get the Correct API Key

1. Inside your Web Billing app, go to **App Settings**
2. Find **Public API Key** (NOT Sandbox API Key for production)
3. Copy the entire key (should start with `rcb_`)
4. **Important**: Make sure you're copying the **Public API Key**, not the Sandbox key

### 3. Verify API Key Format

Your API key should:
- ✅ Start with `rcb_` (production) or `rcb_sb_` (sandbox)
- ✅ Be about 40-50 characters long
- ❌ NOT start with `sk_` (secret key - never use in client code)
- ❌ NOT be from Settings → API Keys (those are for server-side)

### 4. Check Your .env.local File

Open `.env.local` and verify:

```bash
NEXT_PUBLIC_REVENUECAT_PUBLIC_KEY=rcb_your_actual_key_here
```

**Common Issues:**
- ❌ Extra spaces before/after the key
- ❌ Missing quotes (if key has special characters)
- ❌ Using wrong key (sandbox instead of production or vice versa)
- ❌ Key is truncated or incomplete

### 5. Verify Stripe Integration

1. Go to **Apps & providers** → **Web Billing** → Your app
2. Check **Stripe Account** is connected
3. Verify Stripe account is active and in good standing

### 6. Restart Development Server

After updating `.env.local`:
```bash
# Stop your dev server (Ctrl+C)
# Then restart:
npm run dev
```

## 🔍 Debugging Steps

### Check Browser Console

After refreshing `/pricing`, look for:
```
Configuring RevenueCat with: {
  apiKeyPrefix: "rcb_xxxxx...",
  apiKeyLength: 45,
  appUserId: "anon_123..."
}
```

**What to check:**
- Does `apiKeyPrefix` start with `rcb_`?
- Is `apiKeyLength` reasonable (40-50)?
- Do you see "✅ RevenueCat configured successfully"?

### Check Error Details

Look for the full error message:
```
Error details: {
  message: "...",
  errorCode: "...",
  underlyingErrorMessage: "..."
}
```

**Common Error Codes:**
- `CREDENTIALS_ERROR` → Wrong API key or Web Billing app not configured
- `INVALID_API_KEY` → API key format is wrong
- `NETWORK_ERROR` → Can't reach RevenueCat servers

## ❓ Questions to Answer

Please check and tell me:

1. **Do you have a Web Billing app created?**
   - Go to Apps & providers → Web Billing
   - Do you see an app listed?

2. **What does your API key start with?**
   - Check `.env.local` → `NEXT_PUBLIC_REVENUECAT_PUBLIC_KEY`
   - First 5 characters: `rcb_` or `rcb_sb_`?

3. **Is Stripe connected to your Web Billing app?**
   - Go to Apps & providers → Web Billing → Your app
   - Is Stripe account shown as connected?

4. **What does the browser console show?**
   - Open console (F12)
   - Look for "Configuring RevenueCat with:" log
   - Share what you see

## 🚨 Most Common Causes

1. **No Web Billing app created** → Create one first
2. **Using wrong API key** → Using regular API key instead of Web Billing key
3. **Stripe not connected** → Connect Stripe to Web Billing app
4. **Wrong environment** → Using sandbox key in production or vice versa
5. **API key has extra spaces** → Check `.env.local` for whitespace

## 📝 Quick Verification

Run this in your terminal to check your API key:
```bash
# Check if API key is set
grep NEXT_PUBLIC_REVENUECAT_PUBLIC_KEY .env.local

# Should show something like:
# NEXT_PUBLIC_REVENUECAT_PUBLIC_KEY=rcb_xxxxxxxxxxxxx
```

If it shows nothing or shows a different format, that's the problem!
