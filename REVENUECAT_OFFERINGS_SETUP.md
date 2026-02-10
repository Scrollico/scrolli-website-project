# RevenueCat Offerings Setup Guide

## Current Status

✅ Products Created:

- Monthly: `prodad3d76ff4a`
- Yearly: `proda78239c964`
- Lifetime: `prod0129c017c1`

## What You Need to Do

### Step 1: Create an Offering

1. Go to RevenueCat Dashboard → **Products** → **Offerings**
2. Click **"+ New"** or **"Create Offering"**
3. Name it: `default` (or any name you prefer)
4. **Important**: Make sure to mark it as **"Current"** (there should be a toggle/button)

### Step 2: Add Packages to the Offering

For each product, you need to create a **Package** within the offering:

1. Inside your offering, click **"+ Add Package"** or **"Create Package"**
2. For each product, create a package:

   **Package 1: Monthly**

   - Package Identifier: `monthly` (or `$rc_monthly`)
   - Product: Select `Monthly` (prodad3d76ff4a)
   - Package Type: `MONTHLY`

   **Package 2: Yearly**

   - Package Identifier: `yearly` (or `$rc_yearly`)
   - Product: Select `Yearly` (proda78239c964)
   - Package Type: `ANNUAL`

   **Package 3: Lifetime**

   - Package Identifier: `lifetime` (or `$rc_lifetime`)
   - Product: Select `Lifetime` (prod0129c017c1)
   - Package Type: `LIFETIME`

### Step 3: Verify Entitlements

Make sure each product is linked to an entitlement:

1. Go to **Entitlements**
2. Create an entitlement called `premium` (if it doesn't exist)
3. Make sure all three products (Monthly, Yearly, Lifetime) are linked to the `premium` entitlement

### Step 4: Verify Web Billing App

1. Go to **Apps & providers** → **Web Billing**
2. Make sure your Web Billing app is configured
3. Verify the Public API Key matches what's in your `.env.local`

## Quick Checklist

- [ ] Offering created (e.g., "default")
- [ ] Offering marked as "Current"
- [ ] Monthly package added to offering
- [ ] Yearly package added to offering
- [ ] Lifetime package added to offering
- [ ] All products linked to `premium` entitlement
- [ ] Web Billing app configured

## Testing

After setup, refresh your pricing page and check the browser console. You should see:

- "RevenueCat Offerings Response:" with your offerings data
- "Current Offering:" showing your offering
- Pricing cards displaying your three plans
