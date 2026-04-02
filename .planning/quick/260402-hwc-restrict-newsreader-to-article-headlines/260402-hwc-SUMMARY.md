---
phase: quick-260402-hwc
plan: 01
subsystem: typography
tags: [font, design-tokens, newsreader, instrument-sans, typography, editorial]
dependency_graph:
  requires: []
  provides: [font-display restricted to article headlines]
  affects: [all Heading components, article cards, article lists, category pages, single article, hikayeler, search]
tech_stack:
  added: []
  patterns: [design-token default override, explicit font class on article title Headings]
key_files:
  created: []
  modified:
    - lib/design-tokens.ts
    - components/sections/home/ArticleCard.tsx
    - components/sections/home/ArticleList.tsx
    - components/sections/home/Section1.tsx
    - components/sections/home/Section3.tsx
    - components/sections/archive/ArticleCard.tsx
    - components/sections/categories/DynamicCategorySection.tsx
    - components/sections/categories/Section1.tsx
    - components/sections/hikayeler/HikayelerListSection.tsx
    - components/sections/single/Section1.tsx
    - components/sections/home/NewsletterSignup.tsx
    - components/sections/search/Section1.tsx
decisions:
  - fontFamily.heading token switched to font-sans so all Heading components default to Instrument Sans
  - font-display restored surgically on 21 Heading elements that render article .title fields
  - NewsletterSignup briefing titles/descriptions use Instrument Sans — newsletter UX is chrome not editorial
  - Ordinal decorative spans in search use Instrument Sans — purely decorative UI chrome
metrics:
  duration: "~12m"
  completed: "2026-04-02"
  tasks: 3
  files: 12
---

# Quick Task 260402-hwc: Restrict Newsreader to Article Headlines — Summary

**One-liner:** fontFamily.heading token switched to font-sans (Instrument Sans) with font-display surgically restored on 21 article title Heading elements across 9 components.

## What Was Done

### Task 1: Switch fontFamily.heading token to font-sans (a3fdae2)
Changed `fontFamily.heading` in `lib/design-tokens.ts` from `"font-display"` to `"font-sans"`. This single change makes all `<Heading>` components default to Instrument Sans, which is the correct UI/UX font. Newsreader (font-display) is now exclusively applied via explicit className overrides on editorial content.

### Task 2: Restore font-display on article title Headings (c97d30a)
Added `"font-display"` className to Heading elements rendering article titles across 9 components. Discriminated carefully between article titles (ADD) and UI chrome (SKIP):

- **home/ArticleCard.tsx**: Article title Heading (line 88)
- **home/ArticleList.tsx**: Article title Heading (line 74)
- **home/Section1.tsx**: Article title Headings in grid cards (line 84)
- **home/Section3.tsx**: Featured article title + related article titles in CategoryColumn (lines 119, 193)
- **archive/ArticleCard.tsx**: Article title Heading (line 72)
- **categories/DynamicCategorySection.tsx**: Hero article, list articles, extra articles, popular sidebar articles (lines 172, 233, 342, 427). Skipped: category page title, "Daha Fazla", "En Çok Okunanlar"
- **categories/Section1.tsx**: Main article, article list, sideArticles, 4 sidebar popular article titles (lines 58, 111, 191, 249, 282, 315, 348). Skipped: `{Culture.title}` widget heading, "Popular in Culture"
- **hikayeler/HikayelerListSection.tsx**: Hero story title + grid article titles (lines 113, 188). Skipped: "Hikayeler" page title
- **single/Section1.tsx**: Main article headline + related posts slider titles (lines 121, 366). Skipped: "İlgili Makaleler" section label

### Task 3: Remove spurious font-display from NewsletterSignup and search (f84b97a)
- **NewsletterSignup.tsx**: Removed font-display from 5 occurrences — newsletter section heading, briefing title Headings, briefing description Text, frequency label, "Oku" link
- **search/Section1.tsx**: Removed font-display from ordinal number span (`01`, `02`, etc.) — decorative UI chrome

## Deviations from Plan

None — plan executed exactly as written.

## Success Criteria Verification

- `fontFamily.heading` in design-tokens.ts equals `"font-sans"`: PASSED
- All `<Heading>` components rendering article titles have `font-display` className: PASSED (21 elements across 9 components)
- No `font-display` on section labels, page titles, newsletter copy, widget labels, ordinal spans: PASSED
- `npx tsc --noEmit` — pre-existing errors only (ZodError.errors type, Supabase never types, unused vars); no new errors from our changes: PASSED

## Self-Check: PASSED

Files modified confirmed to exist:
- lib/design-tokens.ts
- components/sections/home/ArticleCard.tsx
- components/sections/home/ArticleList.tsx
- components/sections/home/Section1.tsx
- components/sections/home/Section3.tsx
- components/sections/archive/ArticleCard.tsx
- components/sections/categories/DynamicCategorySection.tsx
- components/sections/categories/Section1.tsx
- components/sections/hikayeler/HikayelerListSection.tsx
- components/sections/single/Section1.tsx
- components/sections/home/NewsletterSignup.tsx
- components/sections/search/Section1.tsx

Commits confirmed:
- a3fdae2: feat(quick-260402-hwc): switch fontFamily.heading token to font-sans
- c97d30a: feat(quick-260402-hwc): restore font-display on article title Headings only
- f84b97a: fix(quick-260402-hwc): remove spurious font-display from NewsletterSignup and search
