# Active Context

- Current focus: Improve typography hierarchy and adherence to design tokens across sections (e.g., Editor’s Picks).
- Recent change: Updated `lib/design-tokens.ts` typography scale (new 6xl/5xl/4xl for headings) and added `headingDecor.underline`.
- Applied: `components/sections/home/Section1.tsx` now uses Heading h1 variant with tokenized underline/border (no manual font sizes).
- Next considerations: Check other headings that still hardcode sizes/weights and migrate to `Heading` variants and tokens; verify light/dark rendering after scaling.


