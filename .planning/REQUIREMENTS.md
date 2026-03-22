# Requirements: Scrolli UI Polish & Design System

**Defined:** 2026-03-21
**Core Value:** Consistent, responsive spacing from a single source of truth — and a pricing page that feels fluid and polished enough to convert visitors.

## v1 Requirements

### Design Tokens & Spacing

- [x] **TOKEN-01**: Fix `colors.border.subtle` token — currently resolves to `undefined`, bento borders render as nothing
- [x] **TOKEN-02**: Audit all 30 components with hardcoded `py-N`/`px-N`/`p-N`/`gap-N` classes and migrate to design token usage
- [x] **TOKEN-03**: Migrate pricing page components (`PricingSkeleton`, `bento-grid.tsx`, `scroll-morph-hero.tsx`) to use design tokens for all spacing
- [x] **TOKEN-04**: Ensure all button variants use consistent, responsive spacing from `button.padding` tokens
- [x] **TOKEN-05**: Wire existing ESLint design token plugin (`scripts/eslint-plugin-scrolli-design.ts`) into `next lint` to enforce token usage automatically
- [x] **TOKEN-06**: Verify all migrated components render correctly in both light and dark mode

### Scroll Animation

- [x] **SCROLL-01**: Replace competing `wheel` event listener + `virtualScroll` MotionValue architecture with GSAP ScrollTrigger `scrub` for scroll progress
- [x] **SCROLL-02**: Rebuild card orbital positions using `useTransform` with `style` prop (compositor thread) instead of `animate` prop (JS thread)
- [x] **SCROLL-03**: Achieve 60fps scroll-linked animation with fluid bidirectional (up and down) movement
- [x] **SCROLL-04**: Remove global `document.documentElement` class mutation (`pricing-scrollytelling` / `overflow: visible !important` hack)
- [x] **SCROLL-05**: Implement `prefers-reduced-motion` — show static layout instead of animation
- [x] **SCROLL-06**: Cards orbit/rotate in a circular path driven by scroll progress
- [x] **SCROLL-07**: Smooth scroll completion handoff — when animation finishes, normal page scroll resumes seamlessly

### Bento Grid

- [ ] **BENTO-01**: Redesign `BentoAbstract` visuals — replace placeholder gradient shapes with feature-specific illustrated compositions
- [ ] **BENTO-02**: Fix dark mode visibility — `primary` opacity values near-invisible in dark mode, use proper dark-aware tokens
- [ ] **BENTO-03**: Add entry animations using Framer Motion `whileInView` for staggered reveal on scroll

## v2 Requirements

### Design Tokens

- **TOKEN-V2-01**: Introduce CVA (class-variance-authority) variants for BentoCard and Button to make token consumption a TypeScript-enforced contract
- **TOKEN-V2-02**: Create visual regression testing for token changes

### Scroll Animation

- **SCROLL-V2-01**: Add mouse parallax depth layer to orbital cards
- **SCROLL-V2-02**: Preserve card flip on hover (front/back face revealing article detail)

### Bento Grid

- **BENTO-V2-01**: Expand to asymmetric grid proportions with varied card sizes
- **BENTO-V2-02**: Add hover micro-interactions (translate, scale, shadow lift)

## Out of Scope

| Feature | Reason |
|---------|--------|
| RevenueCat/pricing logic changes | This is purely visual/UX — subscription logic is a separate task |
| Subscribe flow bugs (form progression, button not working) | Documented in CONCERNS.md — separate milestone |
| New pages or routes | Only improving existing pricing page and component spacing |
| Content/CMS changes | No Payload modifications |
| Dark mode overhaul | Tokens already support it; just fixing broken references |
| CSS custom properties migration | Anti-feature per research — stay with Tailwind string tokens |
| Full atomic token system | Anti-feature — keep semantic category tokens |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| TOKEN-01 | Phase 1 | Complete |
| TOKEN-02 | Phase 1 | Complete |
| TOKEN-03 | Phase 1 | Complete |
| TOKEN-04 | Phase 1 | Complete |
| TOKEN-05 | Phase 1 | Complete |
| TOKEN-06 | Phase 1 | Complete |
| SCROLL-01 | Phase 2 | Complete |
| SCROLL-02 | Phase 2 | Complete |
| SCROLL-03 | Phase 2 | Complete |
| SCROLL-04 | Phase 2 | Complete |
| SCROLL-05 | Phase 2 | Complete |
| SCROLL-06 | Phase 2 | Complete |
| SCROLL-07 | Phase 2 | Complete |
| BENTO-01 | Phase 3 | Pending |
| BENTO-02 | Phase 3 | Pending |
| BENTO-03 | Phase 3 | Pending |

**Coverage:**
- v1 requirements: 16 total
- Mapped to phases: 16
- Unmapped: 0 ✓

---
*Requirements defined: 2026-03-21*
*Last updated: 2026-03-21 after initial definition*
