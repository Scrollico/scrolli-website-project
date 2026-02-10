# RevenueCat Debugging Guide

## 🔍 Step-by-Step Debugging

### 1. Check Browser Console

Open your browser console (F12) and look for these logs in order:

#### Initialization Logs:
```
🔄 RevenueCatPricing useEffect triggered
Configuring RevenueCat with: { apiKeyPrefix: "rcb_...", ... }
✅ RevenueCat configured successfully
```

**If you see errors here:**
- ❌ "Invalid API key" → Check your `.env.local` API key
- ❌ "credentials issue" → Web Billing app not configured correctly
- ❌ "RevenueCat not initialized" → Initialization failed

#### Fetching Logs:
```
🔍 fetchOfferings() called
📡 Calling getOfferings()...
✅ Raw RevenueCat Offerings received: {...}
=== 🎯 RevenueCat Offerings Debug ===
```

**What to look for:**
- `Current Offering:` - Should show an object, NOT `null`
- `Current Offering Identifier:` - Should show "Scrolli"
- `Current Offering Packages:` - Should show an array with 3 items
- `All Offerings Keys:` - Should show ["Scrolli"] or similar

### 2. Common Issues & Solutions

#### Issue 1: `Current Offering: null`
**Symptom:** Console shows `Current Offering: null` but `All Offerings Keys: ["Scrolli"]`

**Solution:**
1. Go to RevenueCat Dashboard → Products → Offerings
2. Click on "Scrolli"
3. Look for "Current" toggle/badge/button
4. Make sure it's enabled/checked
5. Save

#### Issue 2: `Current Offering Packages: []`
**Symptom:** Current offering exists but has no packages

**Solution:**
1. Go to RevenueCat Dashboard → Products → Offerings → "Scrolli"
2. Go to "Packages" tab
3. Verify you see: Monthly, Yearly, Lifetime
4. If missing, add packages linking to your products

#### Issue 3: "credentials issue" error
**Symptom:** Error during initialization

**Solution:**
1. Verify API key in `.env.local` starts with `rcb_`
2. Go to Apps & providers → Web Billing → "Scrolli (Web Billing)"
3. Go to App Settings → Copy Public API Key
4. Update `.env.local`
5. Restart dev server: `npm run dev`

#### Issue 4: No logs at all
**Symptom:** Console is empty, no RevenueCat logs

**Solution:**
1. Check if RevenueCatProvider is wrapping your app
2. Check if `/pricing` page is using RevenueCatPricing component
3. Check browser console for any JavaScript errors

### 3. Quick Test Commands

Run these in browser console (after page loads):

```javascript
// Check if RevenueCat is initialized
window.__REVENUECAT_DEBUG__ = true;

// Try to get offerings manually
import { getOfferings } from '@/lib/revenuecat/client';
const offerings = await getOfferings();
console.log("Manual offerings fetch:", offerings);
```

### 4. What to Share for Help

If still not working, share:

1. **Browser Console Output:**
   - Copy all logs starting with 🔄, 🔍, 📡, ✅, ❌
   - Especially the "RevenueCat Offerings Debug" section

2. **Current Offering Status:**
   - What does `Current Offering:` show? (null or object)
   - What does `Current Offering Packages:` show? (empty array or packages)

3. **API Key Check:**
   - First 10 characters: `rcb_cGzdbAX...` (don't share full key!)
   - Does it start with `rcb_`? ✅ or ❌

4. **RevenueCat Dashboard:**
   - Is "Scrolli" offering marked as "Current"? ✅ or ❌
   - How many packages in "Scrolli" offering? (should be 3)

### 5. Expected Console Output (Success)

```
🔄 RevenueCatPricing useEffect triggered
Configuring RevenueCat with: { apiKeyPrefix: "rcb_cGzdbAX...", apiKeyLength: 40, appUserId: "anon_..." }
✅ RevenueCat configured successfully
🔍 fetchOfferings() called
📡 Calling getOfferings()...
✅ Raw RevenueCat Offerings received: { current: {...}, all: {...} }
=== 🎯 RevenueCat Offerings Debug ===
🔍 Current Offering: { identifier: "Scrolli", availablePackages: [...] }
🔍 Current Offering Identifier: "Scrolli"
📋 Current Offering Packages: [3 packages]
📋 Package Count: 3
📚 All Offerings Keys: ["Scrolli"]
====================================
✅ Successfully loaded offerings with packages: 3
```

If you see this, it's working! 🎉
