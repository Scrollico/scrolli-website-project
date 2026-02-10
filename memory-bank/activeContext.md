# Active Context

- Current focus: Improve typography hierarchy and adherence to design tokens across sections (e.g., Editor's Picks).
- Recent change: Updated `lib/design-tokens.ts` typography scale (new 6xl/5xl/4xl for headings) and added `headingDecor.underline`.
- Applied: `components/sections/home/Section1.tsx` now uses Heading h1 variant with tokenized underline/border (no manual font sizes).
- Next considerations: Check other headings that still hardcode sizes/weights and migrate to `Heading` variants and tokens; verify light/dark rendering after scaling.
- Recent Change: Simplified the `ScrolliPremiumBanner` UI for article detail pages. Added a `variant="simple"` to `ScrolliPremiumBanner` that removes the right-side evidence panel and centers the manifesto for a cleaner article-gate experience. Update `ContentWithButton` and `PremiumGate` to use this variant.

## Hikayeler Scrollytelling Architecture (Rewritten)

**Status:** ✅ Complete rewrite from scratch - minimal shell architecture

**Key Components:**
- `components/sections/single/HikayelerArticle.tsx` - Minimal shell wrapper (no layout constraints)
- `components/sections/single/InlineScriptRenderer.tsx` - Thin bridge for Instorier embed injection

**Architecture Principles:**
1. **Single Mount Point**: One `div#hikayeler-story-root` receives Instorier HTML - no nested wrappers
2. **No Layout Constraints**: Shell components don't set `min-height: 100vh` or `overflow` - Instorier controls everything
3. **Dynamic Class Management**: `hikayeler-page` class added to `html/body` for `overflow:visible` (required for sticky positioning)
4. **Content Priority**: Instorier scrollytelling (`inlineScriptHtml`) takes precedence over fallback body content

**Instorier Contract (DO NOT BREAK):**
- Instorier creates `.ibG8wLku-container`, `.ibG8wLku-sticky`, and `.ibG8wLku-scroll-container-spacer`
- The spacer height is dynamically calculated (e.g., 7048px) to create scroll distance
- Position: sticky requires `overflow: visible` on all ancestors (handled by `.hikayeler-page` CSS)
- Scripts load from `stories.instorier.com` and must be re-executed after `innerHTML` injection

**CSS Rules:**
- `.hikayeler-article-shell` - Minimal wrapper, no layout constraints
- `.hikayeler-script-root` - Single mount point, no height/overflow styles
- `.hikayeler-page` - Applied to `html/body` for sticky positioning support
- See `app/globals.css` lines 302-358 for all Hikayeler-specific rules

**Testing Checklist:**
- ✅ Scroll behavior: sticky section and spacer work correctly
- ✅ No black gaps at bottom of story
- ✅ Scroll thumb length matches scroll distance
- ✅ Responsive: works on mobile/desktop
- ✅ Dark mode: story renders correctly
- ✅ Non-Hikayeler articles unaffected
