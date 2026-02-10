# Browser Testing Issues Found

## Date: 2026-01-11

### Issues Discovered During Manual Browser Testing

#### 1. **Pricing Page - Subscribe Button Not Working**
   - **Location**: `/pricing` page
   - **Issue**: Clicking the "Subscribe" button on the pricing page doesn't navigate to `/subscribe`
   - **Console Error**: Multiple "No package selected" errors appear when clicking Subscribe
   - **Expected**: Should navigate to `/subscribe?plan=monthly` (or selected plan)
   - **Impact**: Users cannot start subscription flow from pricing page

#### 2. **Subscribe Page - Email Form Not Progressing**
   - **Location**: `/subscribe?plan=monthly` page
   - **Issue**: After entering email and clicking "Continue", the password field doesn't appear
   - **Expected Behavior**: 
     - First click: Show password field
     - Second click (with password): Proceed to payment step
   - **Actual Behavior**: Form submission doesn't trigger password field display
   - **Code Reference**: `SubscribePageContent.tsx` lines 202-205 should show password field on first submit
   - **Impact**: Users cannot proceed past email step

#### 3. **RevenueCat Pricing Component - "No package selected" Error**
   - **Location**: Pricing page component (`RevenueCatPricing.tsx`)
   - **Issue**: Console shows repeated "No package selected" errors
   - **Error Location**: Line 317 in `RevenueCatPricing.tsx`
   - **Impact**: May indicate package selection logic issue, though offerings are loading correctly

#### 4. **Image Aspect Ratio Warning**
   - **Location**: Multiple pages
   - **Issue**: Next.js warning about image with modified width/height without maintaining aspect ratio
   - **Image**: `Primary-alternative2.svg`
   - **Impact**: Minor - doesn't break functionality but should be fixed for best practices

#### 5. **Next.js Scroll Behavior Warning**
   - **Location**: Global
   - **Issue**: Warning about `scroll-behavior: smooth` on `<html>` element
   - **Impact**: Minor - future compatibility warning

### Positive Findings

✅ RevenueCat offerings are loading correctly
✅ Prices are displaying correctly ($1.90, $10.90, $20.90)
✅ RevenueCat SDK initialization works
✅ Network requests to RevenueCat API are successful
✅ Stripe integration is loading

### Priority Fixes Needed

1. **HIGH**: Fix Subscribe button navigation on pricing page
2. **HIGH**: Fix email form progression on subscribe page
3. **MEDIUM**: Fix "No package selected" error in RevenueCatPricing component
4. **LOW**: Fix image aspect ratio warning
5. **LOW**: Fix scroll behavior warning

### Next Steps

1. Investigate why Subscribe button doesn't navigate
2. Debug why password field doesn't appear after email submission
3. Check RevenueCatPricing component for package selection logic
4. Fix image aspect ratio issue
5. Add `data-scroll-behavior="smooth"` to HTML element
