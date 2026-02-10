# RevenueCat Verification Checklist

## ✅ What You Have

- Products: Monthly, Yearly, Lifetime ✅
- Offering: "default" ✅
- Packages: Monthly, Yearly, Lifetime ✅
- Entitlement: "Scrolli Premium" ✅
- API Key: Set in .env.local ✅

## 🔍 Critical Check: Is "default" Marked as Current?

**This is the #1 reason offerings don't show!**

### Steps to Verify:

1. **Go to RevenueCat Dashboard**

   - Navigate to: **Products** → **Offerings**

2. **Find your "default" offering**

   - Click on it to open

3. **Look for "Current" indicator**

   - There should be a **"Current" badge/toggle/star** on the offering
   - OR a button that says **"Set as Current"** or **"Mark as Current"**
   - OR a toggle switch labeled "Current"

4. **If it's NOT marked as Current:**
   - Click the toggle/button to mark it as Current
   - The offering should now show a "Current" badge

## 🔍 Verify Packages Are Linked

1. **Inside the "default" offering:**

   - Go to the **"Packages"** tab
   - You should see:
     - Monthly ($rc_monthly) → linked to Monthly product
     - Yearly ($rc_annual) → linked to Yearly product
     - Lifetime ($rc_lifetime) → linked to Lifetime product

2. **Check each package:**
   - Click on each package
   - Verify it's linked to the correct product
   - Verify the Package Type matches (MONTHLY, ANNUAL, LIFETIME)

## 🔍 Verify Products Are Linked to Entitlement

1. **Go to Entitlements**

   - Find "Scrolli Premium" (entl8d8db1635d)

2. **Check Products tab:**
   - Monthly should be listed
   - Yearly should be listed
   - Lifetime should be listed

## 🔍 Check Browser Console

After refreshing `/pricing`, check the console for:

```
=== RevenueCat Offerings Debug ===
Full Response: {...}
Current Offering: {...} or null
Current Offering Identifier: "default" or undefined
Current Offering Packages: [...] or []
All Offerings: {...}
All Offerings Keys: ["default"] or []
================================
```

**What to look for:**

- If `Current Offering` is `null` → Offering not marked as Current
- If `Current Offering Packages` is `[]` → Packages not added to offering
- If `All Offerings Keys` is `[]` → No offerings exist at all

## 🚨 Common Issues

### Issue 1: Offering Not Current

**Symptom:** `Current Offering: null` but `All Offerings Keys: ["default"]`
**Fix:** Mark "default" as Current in RevenueCat Dashboard

### Issue 2: Packages Not Added

**Symptom:** `Current Offering Packages: []`
**Fix:** Add packages to the "default" offering

### Issue 3: Wrong API Key

**Symptom:** Error about "Invalid API key" or "Web Billing"
**Fix:** Use Web Billing API key from Apps & providers → Web Billing

### Issue 4: Products Not Linked to Entitlement

**Symptom:** Packages exist but purchases don't grant access
**Fix:** Link all products to "Scrolli Premium" entitlement

## 📝 Quick Test

1. Refresh `/pricing` page
2. Open browser console (F12)
3. Look for the debug logs
4. Share what you see in:
   - `Current Offering:` (is it null or an object?)
   - `Current Offering Packages:` (is it empty array or has items?)
   - `All Offerings Keys:` (does it show ["default"]?)
