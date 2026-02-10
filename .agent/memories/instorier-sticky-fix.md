# Instorier Scroll-Jacking Stories - Implementation Guide

## ✅ Status: WORKING (January 2026)

This document captures the critical learnings from fixing Instorier's scroll-jacking story format.

---

## The Problem

Instorier creates interactive "scroll-jacking" stories where:
- A **~22,000px tall container** is created
- Content is displayed via `position: sticky` elements that stay visible during scroll
- The user scrolls through the tall container, triggering animations/transitions in the sticky content

### Why It Broke

**CSS `overflow: auto` or `overflow: hidden` on ANY ancestor breaks `position: sticky`**

This is a fundamental CSS rule that's easy to forget:
> For `position: sticky` to work, ALL ancestors must have `overflow: visible`

Our `globals.css` had:
```css
html, body {
  overflow-x: hidden;
  overflow-y: auto !important; /* ← THIS BROKE STICKY! */
}
```

---

## The Solution

### 1. CSS Class for Hikayeler Pages (`globals.css`)

```css
/* INSTORIER STICKY FIX: position:sticky requires overflow:visible on all ancestors */
html.hikayeler-page,
body.hikayeler-page {
  overflow: visible !important;
  overflow-x: clip !important; /* clip prevents horizontal scroll but allows sticky */
  height: auto !important;
  min-height: 100vh !important;
}
```

**Key insight**: Use `overflow-x: clip` instead of `overflow-x: hidden` - it prevents horizontal scroll while still allowing sticky positioning!

### 2. Component Adds Class on Mount (`InlineScriptRenderer.tsx`)

```tsx
useEffect(() => {
  document.documentElement.classList.add('hikayeler-page');
  document.body.classList.add('hikayeler-page');

  return () => {
    document.documentElement.classList.remove('hikayeler-page');
    document.body.classList.remove('hikayeler-page');
  };
}, []);
```

---

## Key Files

| File | Purpose |
|------|---------|
| `app/globals.css` | `.hikayeler-page` CSS class with overflow rules |
| `components/sections/single/InlineScriptRenderer.tsx` | Adds class on mount, handles script injection |
| `components/sections/single/HikayelerMinimal.tsx` | Page layout with navbar/footer |

---

## Debugging Checklist

If Instorier stories break again, check these in order:

1. **Is `.hikayeler-page` class on html/body?**
   ```js
   document.documentElement.classList.contains('hikayeler-page')
   ```

2. **What's the computed overflow?**
   ```js
   getComputedStyle(document.body).overflow
   // Should be "visible" or "visible clip"
   ```

3. **Are there any ancestors with overflow != visible?**
   ```js
   // Find all ancestors of the sticky element
   let el = document.querySelector('.ictowf5f-sticky');
   while (el) {
     const style = getComputedStyle(el);
     if (style.overflow !== 'visible') console.log(el, style.overflow);
     el = el.parentElement;
   }
   ```

4. **Is the Instorier container getting correct height?**
   ```js
   document.querySelector('.ictowf5f-container')?.scrollHeight
   // Should be ~22000px
   ```

---

## Common Mistakes to Avoid

| ❌ Don't | ✅ Do |
|----------|-------|
| Set `overflow: hidden` on body globally | Use `.hikayeler-page` class for specific pages |
| Set `overflow-y: auto` anywhere | Use `overflow: visible` or `overflow-x: clip` |
| Forget cleanup in useEffect | Always remove classes in cleanup function |
| Use JavaScript to set inline overflow styles | Let CSS `!important` rules handle it |

---

## Testing Protocol

1. Navigate to `/test-hikaye`
2. Wait 5 seconds for Instorier to load
3. Scroll down - content should animate/transition
4. Scroll to bottom - footer should be visible
5. Check console for errors

---

## Related CSP Requirements

Instorier requires these domains in Content-Security-Policy:
- `*.instorier.com`
- `*.instorier-cdn.com`

See `next.config.mjs` for full CSP configuration.
