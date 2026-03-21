# Scrolli UI Polish & Design System

## What This Is

A focused UI improvement milestone for scrolli.co, a Turkish-language digital magazine platform built on Next.js 15 with Payload CMS and Supabase. This milestone standardizes the spacing/design token system across all components and redesigns the pricing page's scrollytelling animation and bento features section.

## Core Value

Every component uses consistent, responsive spacing from a single source of truth — and the pricing page feels fluid and polished enough to convert visitors.

## Requirements

### Validated

- ✓ Design token system exists (`lib/design-tokens.ts`) with section padding, container padding, component padding, gap system — existing
- ✓ Tailwind config has custom spacing scale (`section-xs` through `section-2xl`) — existing
- ✓ Responsive container component exists (`components/responsive`) — existing
- ✓ Pricing page structure with RevenueCatPricing, IntroAnimation, BentoGrid, SimplePremiumCTA, CorporateSubscriptionCTA — existing
- ✓ Scroll-morph-hero component exists (`components/ui/scroll-morph-hero.tsx`) — existing
- ✓ Bento grid component exists (`components/ui/bento-grid.tsx`) — existing

### Active

- [ ] Audit and standardize all component margins/padding to use design tokens consistently
- [ ] Ensure all button variants use consistent, responsive spacing
- [ ] Fix pricing page scrollytelling animation that freezes on scroll
- [ ] Rebuild scroll animation with orbiting/rotating circle article cards
- [ ] Make scroll animation fluid bidirectionally (up and down)
- [ ] Redesign bento card on pricing page for much higher visual quality

### Out of Scope

- Pricing logic/RevenueCat integration changes — this is purely visual/UX
- New pages or routes — only improving existing pricing page and component spacing
- Subscribe flow bugs (documented in CONCERNS.md) — separate task
- Content/CMS changes — no Payload modifications
- Dark mode overhaul — tokens already support it, just ensure consistency

## Context

- Platform deploys to Cloudflare Pages with Edge runtime
- Design tokens in `lib/design-tokens.ts` follow Arc Publishing principles with 4px grid
- Tailwind config extends spacing with semantic `section-*` tokens
- Pricing page components: `RevenueCatPricing` (pricing cards), `IntroAnimation` aka `scroll-morph-hero` (scrollytelling), `BentoGridWithFeatures` (features grid)
- The scroll-morph-hero freezes during scroll-linked animation — needs complete rebuild
- Bento grid has 6 features with abstract visuals — needs redesign using user's bento skill
- GSAP 3.13.0 and Framer Motion 12.x both available for animations
- Codebase uses `cn()` utility (clsx + tailwind-merge) for class composition

## Constraints

- **Runtime**: Must be Cloudflare Pages Edge compatible — no Node-only APIs
- **Tech stack**: Next.js 15 + Tailwind CSS 3.4 + existing design token system
- **Animation libs**: Use GSAP and/or Framer Motion (already installed)
- **Performance**: Scroll animations must be 60fps — no jank
- **Accessibility**: Respect `prefers-reduced-motion`

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Use existing design-tokens.ts as foundation | Already established, just needs enforcement | — Pending |
| Orbiting circle cards for scroll animation | User wants carousel-like orbital motion on scroll | — Pending |
| Redesign bento with user's bento skill | User has a specialized skill for high-quality bento layouts | — Pending |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd:transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd:complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-03-21 after initialization*
