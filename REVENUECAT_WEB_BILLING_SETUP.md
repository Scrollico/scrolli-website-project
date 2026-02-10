# RevenueCat Web Billing Setup Guide

## ✅ What You Already Have
- Products: Monthly, Yearly, Lifetime ✅
- Stripe connected to RevenueCat ✅
- Entitlement: "Scrolli Premium" ✅

## 🎯 What You Need to Do

You **don't create products in Web Billing**. Instead, you:
1. Use your existing products
2. Create an Offering
3. Add Packages to the Offering (linking to your products)
4. Mark the Offering as "Current"

## Step-by-Step Setup

### Step 1: Verify Your Products Are Configured

1. Go to **Products** → **Test Store** (or wherever your products are)
2. Verify you have:
   - Monthly (prodad3d76ff4a)
   - Yearly (proda78239c964)
   - Lifetime (prod0129c017c1)
3. Make sure each product is linked to "Scrolli Premium" entitlement

### Step 2: Create an Offering (If Not Done)

1. Go to **Products** → **Offerings**
2. Click **"+ New"** or **"Create Offering"**
3. Name it: `default`
4. **IMPORTANT**: Mark it as **"Current"** (toggle/button/star icon)
5. Save

### Step 3: Add Packages to the Offering

1. Open your "default" offering
2. Go to the **"Packages"** tab
3. Click **"+ Add Package"** or **"Create Package"**

**For Monthly:**
- Package Identifier: `monthly` or `$rc_monthly`
- Product: Select **Monthly** (prodad3d76ff4a)
- Package Type: `MONTHLY`
- Save

**For Yearly:**
- Package Identifier: `yearly` or `$rc_annual`
- Product: Select **Yearly** (proda78239c964)
- Package Type: `ANNUAL`
- Save

**For Lifetime:**
- Package Identifier: `lifetime` or `$rc_lifetime`
- Product: Select **Lifetime** (prod0129c017c1)
- Package Type: `LIFETIME`
- Save

### Step 4: Verify Web Billing App

1. Go to **Apps & providers** → **Web Billing**
2. **Do you see a Web Billing app?**
   - If YES → Go to Step 5
   - If NO → Create one (see below)

**To Create Web Billing App:**
- Click **"+ New"** or **"Add Web Billing"**
- Select your **Stripe account** (the one connected to RevenueCat)
- Set **Default Currency** (e.g., USD, EUR, TRY)
- Set **App Name**: "Scrolli"
- Set **Support Email**: Your support email
- Save

### Step 5: Get Your Web Billing API Key

1. Inside your Web Billing app, go to **App Settings**
2. Find **Public API Key**
3. Copy it (should start with `rcb_`)
4. Add to `.env.local`:
   ```bash
   NEXT_PUBLIC_REVENUECAT_PUBLIC_KEY=rcb_your_key_here
   ```

### Step 6: Verify Stripe Products

Your Stripe products should already be synced with RevenueCat. To verify:

1. Go to **Integrations** → **Stripe**
2. Check that products are synced
3. If not synced, RevenueCat will sync them automatically

## 🔍 Common Confusion

**❌ Wrong:** Trying to create products in Web Billing
**✅ Correct:** Products are created in Products → Test Store, then linked to offerings via packages

**The Flow:**
1. Products (in Test Store) → Already done ✅
2. Offering (in Offerings) → Create "default" ✅
3. Packages (inside Offering) → Link products to packages ✅
4. Web Billing App → Configure with Stripe ✅
5. Mark Offering as "Current" → Critical! ⚠️

## 🚨 Most Important Step

**Mark your "default" offering as "Current"!**

Without this, `offerings.current` will be `null` and nothing will show.

## 📝 Checklist

- [ ] Web Billing app created
- [ ] Stripe connected to Web Billing app
- [ ] Offering "default" created
- [ ] Offering "default" marked as "Current"
- [ ] Monthly package added to offering
- [ ] Yearly package added to offering
- [ ] Lifetime package added to offering
- [ ] All products linked to "Scrolli Premium" entitlement
- [ ] Web Billing API key copied to `.env.local`
- [ ] Dev server restarted

## 🧪 Test It

1. Refresh `/pricing` page
2. Check browser console for:
   ```
   === RevenueCat Offerings Debug ===
   Current Offering: {...} (should NOT be null)
   Current Offering Packages: [...] (should have 3 packages)
   ```

If `Current Offering` is still `null`, the offering isn't marked as "Current"!
