# Instorier Integration Guide

> Complete documentation for integrating Instorier interactive stories in Scrolli.

## Overview

Hikayeler (Stories) articles use [Instorier](https://instorier.com) for interactive, scroll-jacking content. This guide covers the technical implementation, CSP requirements, and troubleshooting.

---

## Architecture

```
User navigates to /{slug}
        ↓
app/[slug]/page.tsx
        ↓
Check: isHikayeler && has inlineScriptHtml?
        ↓
YES → HikayelerMinimal → InlineScriptRenderer
        ↓
Inject external <script> → Instorier takes over
```

### Key Files

| File | Purpose |
|------|---------|
| `app/[slug]/page.tsx` | Article routing, detects hikayeler articles |
| `components/sections/single/HikayelerMinimal.tsx` | Minimal wrapper (no headers/related) |
| `components/sections/single/InlineScriptRenderer.tsx` | Script injection + hikayeler-page class |
| `app/globals.css` | `.hikayeler-page` overflow + footer margin rules |
| `next.config.mjs` | Content Security Policy headers |

---

## Content Security Policy (CSP)

Instorier content requires these domains whitelisted:

| Directive | Required Domains |
|-----------|------------------|
| `script-src` | `*.instorier.com`, `*.instorier-cdn.com`, `https://public.flourish.studio` |
| `style-src` | `*.instorier.com`, `*.instorier-cdn.com`, `https://public.flourish.studio` |
| `font-src` | `*.instorier-cdn.com`, `https://files.instorier.com` |
| `img-src` | `*.instorier.com`, `*.instorier-cdn.com`, `*.stadiamaps.com`, `*.flourish.studio` |
| `media-src` | `*.instorier.com`, `*.instorier-cdn.com`, `https://www.youtube.com` |
| `connect-src` | `*.instorier.com`, `*.instorier-cdn.com`, `*.stadiamaps.com`, `*.maptiler.com`, `*.openstreetmap.org`, `https://public.flourish.studio` |
| `frame-src` | `https://www.youtube.com`, `https://flo.uri.sh`, `https://public.flourish.studio` |

### Why These Domains?

- **Instorier CDN**: Core story content, scripts, fonts
- **Stadia Maps**: MapLibre map tiles (used for interactive maps)
- **MapTiler/OpenStreetMap**: Alternative map providers
- **Flourish**: Interactive data visualizations/charts
- **YouTube**: Embedded video content

---

## CSS Requirements

### Sticky Positioning Fix

Instorier uses `position: sticky` for scroll-jacking. This requires `overflow: visible` on ALL ancestor elements.

```css
/* globals.css */
html.hikayeler-page,
body.hikayeler-page {
  overflow: visible !important;
  overflow-x: clip !important; /* Prevents horizontal scroll */
  height: auto !important;
  min-height: 100vh !important;
}
```

### Footer Gap Fix

Remove the 80px footer margin on hikayeler pages:

```css
/* globals.css */
.hikayeler-page .footer-modern,
.hikayeler-page footer {
  margin-top: 0 !important;
}
```

### Class Application

`InlineScriptRenderer.tsx` adds the `.hikayeler-page` class dynamically:

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

## Troubleshooting

### Maps Show as Grey Boxes

**Cause:** CSP blocking map tile requests

**Fix:** Add `*.stadiamaps.com` to `connect-src` and `img-src` in `next.config.mjs`

### Story Content Doesn't Scroll

**Cause:** `overflow: auto` or `overflow: hidden` on html/body

**Fix:** Ensure `.hikayeler-page` class is applied with `overflow: visible`

### White Gap Between Story and Footer

**Cause:** Footer has `margin-top: 80px` by default

**Fix:** CSS rule removes margin for `.hikayeler-page` pages

### Flourish Charts Not Loading

**Cause:** CSP blocking Flourish domains

**Fix:** Add `https://public.flourish.studio` and `https://flo.uri.sh` to CSP

### YouTube Videos Not Playing

**Cause:** CSP blocking YouTube frames

**Fix:** Add `https://www.youtube.com` to `frame-src` and `media-src`

---

## Testing Protocol

### Browser Test

1. Navigate to a hikayeler article (e.g., `/turkiyenin-endemik-turleri-...`)
2. Wait 8-10 seconds for content to load
3. Check console for CSP errors
4. Scroll through story - verify sticky positioning works
5. Check maps display geographic features (not grey boxes)
6. Scroll to bottom - verify footer is flush (no white gap)

### Expected Console Logs

- ✅ `🚀 Initializing Instorier content...` - Script starting
- ✅ `✅ Script 1 loaded` - External script loaded
- ⚠️ `AbortError: The user aborted a request` - Expected during fast scrolling (harmless)

### Screenshot Verification Points

1. **Top**: Navbar visible, story title/hero visible
2. **Middle**: Maps with geographic features, charts loading
3. **Bottom**: Story end transitions directly to footer

---

## Quick Reference

```bash
# Test a hikayeler article locally
open http://localhost:3000/turkiyenin-endemik-turleri-kacakcilik-ve-iklim-kiskacinda-1767482136430

# Check CSP configuration
grep -A 20 "Content-Security-Policy" next.config.mjs

# Check hikayeler CSS rules
grep -A 10 "hikayeler-page" app/globals.css
```

---

## Related Documentation

- [HIKAYELER_ARTICLE_DETAIL_TASK.md](./HIKAYELER_ARTICLE_DETAIL_TASK.md) - Original task document
- [.agent/memories/instorier-sticky-fix.md](../.agent/memories/instorier-sticky-fix.md) - Sticky positioning fix details
