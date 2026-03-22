---
phase: quick
plan: 1
type: execute
wave: 1
depends_on: []
files_modified:
  - app/layout.tsx
  - next.config.mjs
  - app/pricing/page.tsx
autonomous: true
requirements: [PERF-01]
must_haves:
  truths:
    - "Theme script runs before first paint (no FOUC)"
    - "External resource domains are preconnected for faster asset loading"
    - "optimizePackageImports covers all heavy dependencies"
    - "Pricing page below-fold components are lazy loaded"
  artifacts:
    - path: "app/layout.tsx"
      provides: "Preconnect hints, inline theme script, resource hints"
    - path: "next.config.mjs"
      provides: "Extended optimizePackageImports list"
    - path: "app/pricing/page.tsx"
      provides: "Dynamic imports for below-fold sections"
  key_links:
    - from: "app/layout.tsx"
      to: "External CDNs"
      via: "preconnect link tags"
      pattern: "rel=\"preconnect\""
---

<objective>
Page load speed optimization through high-impact quick wins: fix theme script timing to eliminate FOUC, add resource hints for external domains, expand tree-shaking via optimizePackageImports, and lazy-load below-fold pricing page components.

Purpose: Reduce LCP, eliminate flash of unstyled content, cut initial JS bundle size.
Output: Faster page loads with no behavioral changes.
</objective>

<execution_context>
@~/.claude/get-shit-done/workflows/execute-plan.md
@~/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@app/layout.tsx
@next.config.mjs
@app/pricing/page.tsx
@components/layout/Layout.tsx
</context>

<tasks>

<task type="auto">
  <name>Task 1: Fix theme script timing and add resource preconnect hints</name>
  <files>app/layout.tsx</files>
  <action>
Two changes to app/layout.tsx — no business logic changes:

1. **Move theme init script from afterInteractive to inline blocking.**
   The current `theme-preload` Script uses `strategy="afterInteractive"` which means it runs AFTER hydration — too late, causing flash of wrong theme. Change it to a raw `<script>` tag (not next/script) placed directly in `<head>` BEFORE any stylesheets, using `dangerouslySetInnerHTML`. This makes it parser-blocking and prevents FOUC. Remove the next/script import if no longer needed (but structured data scripts still use it, so keep the import).

   Specifically: Replace the `<Script id="theme-preload" strategy="afterInteractive" ...>` with:
   ```tsx
   <script
     id="theme-preload"
     dangerouslySetInnerHTML={{ __html: themeInitScript }}
   />
   ```
   Place it as the FIRST element inside `<head>`, before the theme-prepaint-guard style block.

2. **Add preconnect hints for external domains** used by the app.
   Add these `<link>` tags at the top of `<head>` (after the theme script):
   - `<link rel="preconnect" href="https://fonts.googleapis.com" />` (Next.js google fonts)
   - `<link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />` (font files)
   - `<link rel="dns-prefetch" href="https://scrollimedia.blob.core.windows.net" />` (article images from Azure)
   - `<link rel="dns-prefetch" href="https://cms.scrolli.co" />` (CMS API domain)

   Use `preconnect` for critical resources (fonts) and `dns-prefetch` for likely-but-not-guaranteed resources (images, CMS).

Do NOT change: provider nesting, structured data scripts, deferred CSS logic, metadata generation, body structure.
  </action>
  <verify>
    <automated>cd /Volumes/max/DevS/scrolli.co && grep -n 'id="theme-preload"' app/layout.tsx | grep -v 'strategy' && grep -c 'preconnect\|dns-prefetch' app/layout.tsx | grep -q '[2-9]' && echo "PASS" || echo "FAIL"</automated>
  </verify>
  <done>Theme script is an inline blocking script (no strategy prop), preconnect/dns-prefetch hints exist for fonts.googleapis.com, fonts.gstatic.com, scrollimedia.blob.core.windows.net, and cms.scrolli.co</done>
</task>

<task type="auto">
  <name>Task 2: Expand optimizePackageImports and lazy-load pricing below-fold</name>
  <files>next.config.mjs, app/pricing/page.tsx</files>
  <action>
Two files, two independent changes:

**next.config.mjs — Expand optimizePackageImports:**
The current list is: `['lucide-react', 'framer-motion', '@radix-ui/react-tabs', '@radix-ui/react-checkbox']`.

Add these packages that are used across many components and benefit from tree-shaking:
- `'swiper'` (used in 3 components — full package is large)
- `'react-syntax-highlighter'` (large package, only used in CodeBlock)
- `'@radix-ui/react-dialog'` (common Radix primitive)
- `'@radix-ui/react-dropdown-menu'` (common Radix primitive)
- `'@radix-ui/react-accordion'` (common Radix primitive)

Final list:
```js
optimizePackageImports: [
  'lucide-react',
  'framer-motion',
  'swiper',
  'react-syntax-highlighter',
  '@radix-ui/react-tabs',
  '@radix-ui/react-checkbox',
  '@radix-ui/react-dialog',
  '@radix-ui/react-dropdown-menu',
  '@radix-ui/react-accordion',
],
```

**app/pricing/page.tsx — Dynamic import for below-fold components:**
The PortfolioGallery, BentoGridWithFeatures, SimplePremiumCTA, and CorporateSubscriptionCTA are all below the fold (below the pricing cards). Convert them to dynamic imports:

Add at top of file:
```tsx
import dynamic from "next/dynamic";
```

Replace the direct imports of these 4 components with dynamic imports:
```tsx
const PortfolioGallery = dynamic(
  () => import("@/components/ui/portfolio-gallery").then(mod => ({ default: mod.PortfolioGallery })),
  { ssr: false }
);

const SimplePremiumCTA = dynamic(
  () => import("@/components/ui/simple-premium-cta").then(mod => ({ default: mod.SimplePremiumCTA })),
  { ssr: false }
);

const CorporateSubscriptionCTA = dynamic(
  () => import("@/components/ui/corporate-subscription-cta"),
  { ssr: false }
);

const BentoGridWithFeatures = dynamic(
  () => import("@/components/ui/bento-grid").then(mod => ({ default: mod.BentoGridWithFeatures })),
  { ssr: false }
);
```

Remove the original static import lines for these 4 components. Keep the `type BentoFeature` import as a type-only import:
```tsx
import type { BentoFeature } from '@/components/ui/bento-grid';
```

Keep RevenueCatPricing as a static import (it is above the fold in a Suspense boundary already).

Do NOT change: component props, JSX structure, runtime export, data fetching, design tokens usage, BentoAbstract component, bentoFeatures array.
  </action>
  <verify>
    <automated>cd /Volumes/max/DevS/scrolli.co && grep -c 'optimizePackageImports' next.config.mjs && grep -c "dynamic(" app/pricing/page.tsx | grep -q '[3-9]' && npx next build 2>&1 | tail -5 || echo "Build check — review output"</automated>
  </verify>
  <done>next.config.mjs has 9 entries in optimizePackageImports. pricing/page.tsx uses dynamic() for PortfolioGallery, BentoGridWithFeatures, SimplePremiumCTA, CorporateSubscriptionCTA. Build succeeds without errors.</done>
</task>

</tasks>

<verification>
- `grep 'preconnect\|dns-prefetch' app/layout.tsx` shows 4 resource hints
- Theme script has NO `strategy` attribute (it is a raw `<script>` tag)
- `grep 'dynamic(' app/pricing/page.tsx` shows 4 dynamic imports
- `npx next build` completes without errors
- Visual: No flash of wrong theme on page load (manual check)
</verification>

<success_criteria>
- Theme init script executes before first paint (inline, no strategy="afterInteractive")
- 4 preconnect/dns-prefetch hints in layout head
- optimizePackageImports expanded from 4 to 9 entries
- 4 below-fold pricing page components lazy-loaded via next/dynamic
- No changes to business logic, component behavior, or visual output
- Build succeeds
</success_criteria>

<output>
After completion, create `.planning/quick/260322-uwb-page-load-speed-optimization/260322-uwb-SUMMARY.md`
</output>
