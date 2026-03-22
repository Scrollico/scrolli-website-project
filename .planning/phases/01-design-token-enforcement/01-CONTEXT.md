# Phase 1: Design Token Enforcement - Context

**Gathered:** 2026-03-22
**Status:** Ready for planning

<domain>
## Phase Boundary

Fix broken token references, migrate all ~30 components with hardcoded spacing/color classes to use design tokens from `lib/design-tokens.ts`, migrate button padding to token system, wire up ESLint plugin for enforcement. No new token categories — only fix, extend (subtle border), and enforce the existing system.

</domain>

<decisions>
## Implementation Decisions

### Border Token Fix
- **D-01:** Add `colors.border.subtle` as a NEW token alongside existing ones (don't rename `light`)
- **D-02:** Use opacity-based value: `"border-border/30"` — follows existing pattern where `light` uses `border-border/50`
- **D-03:** After adding the token, update all bento grid references to use `colors.border.subtle` so borders render correctly in both light and dark mode

### Migration Scope
- **D-04:** Migrate ALL ~30 components with hardcoded spacing in a single sweep — not incremental/prioritized
- **D-05:** Migration includes BOTH spacing tokens (py-N/px-N/p-N/gap-N → sectionPadding/containerPadding/componentPadding/gap) AND color tokens (bg-white → colors.background.base, text-black → colors.foreground.primary, etc.)
- **D-06:** Full consistency pass aligns with TOKEN-06 requirement (light/dark mode verification)

### Button Spacing
- **D-07:** Migrate button.tsx CVA size variants from hardcoded padding (`h-10 px-4 py-2`) to `button.padding` tokens from design-tokens.ts
- **D-08:** May need to add height tokens to the button token object if height values don't currently exist

### General Spacing Quality
- **D-09:** Component margins and padding must look good overall — not just mechanically replacing classes, but ensuring the resulting spacing feels right visually

### Claude's Discretion
- ESLint plugin wiring approach (how to integrate `scripts/eslint-plugin-scrolli-design.ts` into `next lint`)
- Exact mapping of each hardcoded class to its token equivalent (case-by-case judgment)
- Whether to add any missing token sizes discovered during migration
- Order of component migration within the single sweep

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Design Token System
- `lib/design-tokens.ts` — Single source of truth for all spacing, color, typography, border, and composed tokens
- `lib/utils.ts` — Contains `cn()` utility (clsx + tailwind-merge) used for class composition

### Components to Migrate
- `components/ui/button.tsx` — Button component with CVA variants, currently imports `buttonPairs` but uses hardcoded size padding
- `components/ui/bento-grid.tsx` — Bento grid with broken `colors.border.subtle` reference
- `components/ui/scroll-morph-hero.tsx` — Scroll animation hero, pricing page component
- `components/sections/pricing/PricingSkeleton.tsx` — Pricing skeleton loader

### ESLint Enforcement
- `scripts/eslint-plugin-scrolli-design.ts` — Existing ESLint plugin that needs wiring into `next lint`

### Configuration
- `tailwind.config.js` — Tailwind CSS customization with semantic colors and custom spacing scale

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `lib/design-tokens.ts`: Comprehensive token system with sectionPadding, containerPadding, componentPadding, gap, margin, marginBottom, marginTop, colors (with surfacePairs, buttonPairs, pillPairs), typography, border, elevation, card, button, input composed tokens
- `lib/utils.ts`: `cn()` utility for Tailwind class merging
- `scripts/eslint-plugin-scrolli-design.ts`: Pre-built ESLint plugin ready to wire up
- `components/ui/button.tsx`: Already imports `buttonPairs` and `elevation` from design tokens — partially migrated

### Established Patterns
- Token consumption: `cn(sectionPadding.md, customClasses)` pattern used throughout
- Color tokens use CSS variables (bg-background, text-foreground) that auto-adapt to dark mode
- Button uses CVA (class-variance-authority) for variant management
- Components use `cn()` to merge base + variant + className prop classes

### Integration Points
- `tailwind.config.js` extends spacing with `section-xs` through `section-2xl` semantic tokens
- `button.tsx` already partially uses token system (variants use `buttonPairs`, sizes don't)
- All pricing page components compose into `app/pricing/page.tsx`

</code_context>

<specifics>
## Specific Ideas

- `colors.border.subtle` value: `"border-border/30"` (opacity-based, follows `light` pattern of `border-border/50`)
- Button padding tokens already defined: `button.padding.sm = "px-3 py-1.5"`, `button.padding.md = "px-4 py-2"`, `button.padding.lg = "px-6 py-3"`
- User emphasized overall spacing quality — not just mechanical class replacement but visually good margins/padding

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 01-design-token-enforcement*
*Context gathered: 2026-03-22*
