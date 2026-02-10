# Hikayeler Article Detail Page - Task Details

## Objective

Create a minimal article detail page for **Hikayeler** (Stories) articles that display Instorier interactive stories. The page should show:
- ✅ Navbar (Header/StickyNav from Layout)
- ✅ Instorier script content (`inlineScriptHtml`)
- ✅ Footer (from Layout)
- ❌ **NO** featured images
- ❌ **NO** share buttons
- ❌ **NO** related articles
- ❌ **NO** title headers
- ❌ **NO** badges
- ❌ **NO** gift buttons
- ❌ **NO** metadata information

## Current Implementation

### Files Modified
1. `app/[slug]/page.tsx` - Conditional rendering logic
2. `components/sections/single/HikayelerMinimal.tsx` - Minimal wrapper component
3. `components/sections/single/InlineScriptRenderer.tsx` - Script injection handler
4. `lib/payload/types.ts` - Data mapping for `inlineScriptHtml`
5. `lib/payload/client.ts` - Source field normalization

### Current Flow
```
Article Page → Check if Hikayeler + has inlineScriptHtml
  ↓
If YES → Render HikayelerMinimal
  ↓
HikayelerMinimal → InlineScriptRenderer
  ↓
InlineScriptRenderer → Parse HTML, extract scripts, inject Instorier script
  ↓
Instorier script loads → Should render interactive story content
```

## Problems & Failures

### 1. **Content Not Rendering** ❌
**Symptom:** Page shows "Loading story..." or blank content, but Instorier story never appears.

**Root Causes:**
- Instorier script may not be loading properly
- Script injection timing issues
- Container structure may not match Instorier's expectations
- CORS or network issues with `stories.instorier.com`

**Evidence:**
- Console shows script loading but no content appears
- Script tags are present in DOM but story doesn't initialize
- Production site (Webflow) works fine, suggesting our implementation is missing something

### 2. **Scrolling Not Working** ❌
**Symptom:** User can scroll the page but the story content doesn't scroll. Story stays fixed in place.

**Root Causes:**
- Instorier script creates fixed/absolute positioned elements
- Container overflow constraints
- Body/html overflow settings interfering
- Instorier's own scrolling mechanism conflicts with page scroll

**Evidence:**
- User reports: "aşağıya kaydırıorm ama hikaye kaymıyor hikaye hep aynı"
- Page has scrollbar but story content doesn't move
- Production site works, so Instorier CAN work with proper setup

### 3. **Runtime Errors** ❌
**Symptom:** `removeChild` errors in console

**Root Causes:**
- Attempting to remove script nodes that aren't direct children
- DOM manipulation race conditions
- React hydration conflicts

**Status:** ✅ **FIXED** - Switched to regex-based parsing, no DOM manipulation

### 4. **Hydration Mismatch** ⚠️
**Symptom:** React hydration warnings about server/client mismatch

**Root Causes:**
- Browser extensions adding `data-cursor-ref` attributes
- Footer component using `mounted` state causing different server/client renders

**Status:** ⚠️ **PARTIALLY FIXED** - Added `suppressHydrationWarning` but may need more work

## Why We're Failing

### Primary Issue: Instorier Script Integration

Instorier is a third-party interactive story platform that:
1. Loads external JavaScript from `stories.instorier.com`
2. Creates its own DOM structure with custom scrolling
3. Uses fixed/absolute positioning for full-screen experience
4. Requires specific container structure to work properly

**What Webflow Does Right (that we're missing):**
- Minimal container interference
- Proper script loading order
- No CSS conflicts
- Allows Instorier to control its own layout

**What We're Doing Wrong:**
- Over-engineering the script injection
- Adding too many wrapper divs
- Trying to control Instorier's layout
- Not waiting properly for script initialization
- Container structure may not match Instorier's expectations

### Secondary Issue: Scroll Behavior

Instorier stories use their own scrolling mechanism. When we:
- Add overflow constraints
- Use fixed positioning
- Interfere with body scroll
- Add wrapper containers

We break Instorier's internal scrolling system.

## Technical Details

### Instorier Script Format
```html
<p>
  <div data-rt-embed-type='true'>
    <script 
      src="https://stories.instorier.com/stories/2283/ZG6NIUh/inline.js" 
      id="iZG6NIUh" 
      async>
    </script>
  </div>
</p>
```

### Expected Behavior
1. Script loads from `stories.instorier.com`
2. Script creates interactive story content
3. Story has its own scrollable sections
4. Story content includes text, images, maps, interactive elements
5. Story should be fully scrollable within the page

### Current Implementation Issues

#### InlineScriptRenderer Problems:
1. **Regex parsing** - May not handle all script variations
2. **Container structure** - May not match Instorier's expectations
3. **Loading detection** - May not properly detect when story is ready
4. **Error handling** - May silently fail without proper feedback

#### HikayelerMinimal Problems:
1. **Wrapper divs** - May interfere with Instorier layout
2. **Styling** - May conflict with Instorier's CSS
3. **Loading state** - May block Instorier initialization

## Solution Approach

### Recommended Fix Strategy

1. **Simplify Container Structure**
   - Remove all wrapper divs except essential ones
   - Let Instorier control its own layout
   - Don't add any CSS that might interfere

2. **Improve Script Loading**
   - Use simpler script injection
   - Wait for script load events properly
   - Handle async script loading correctly

3. **Fix Scrolling**
   - Remove all overflow constraints
   - Don't interfere with body/html scroll
   - Let Instorier handle its own scroll behavior

4. **Better Error Detection**
   - Add console logging for debugging
   - Detect when Instorier actually renders content
   - Provide better error messages

### Minimal Working Example

```tsx
// HikayelerMinimal.tsx - ULTRA SIMPLE
export default function HikayelerMinimal({ inlineScriptHtml }) {
  return (
    <div dangerouslySetInnerHTML={{ __html: inlineScriptHtml }} />
  );
}
```

**Problem:** `dangerouslySetInnerHTML` doesn't execute `<script>` tags in React.

**Solution:** Use minimal script injection without over-engineering.

## Next Steps

1. **Test Instorier Script Directly**
   - Create a test page with just the script tag
   - Verify it works in isolation
   - Compare DOM structure with production

2. **Simplify Implementation**
   - Remove all unnecessary wrappers
   - Use simplest possible script injection
   - Remove all CSS that might interfere

3. **Debug Script Loading**
   - Add detailed console logging
   - Check network requests
   - Verify script execution

4. **Fix Scrolling**
   - Remove all overflow constraints
   - Test with minimal container
   - Let Instorier handle scroll

## Success Criteria

✅ Page shows only navbar, Instorier story, and footer
✅ Instorier story content is visible (text, images, maps)
✅ Story is fully scrollable
✅ No console errors
✅ No hydration warnings
✅ Works on both desktop and mobile

## References

- Production working example: https://www.scrolli.co/global/hikaye/turkiyenin-endemik-turleri-kacakcilik-ve-iklim-kiskacinda
- Instorier script example: `https://stories.instorier.com/stories/2283/ZG6NIUh/inline.js`
- CMS field: `inlineScriptHtml` in Hikayeler collection
