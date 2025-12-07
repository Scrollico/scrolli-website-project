# System Patterns

- Design tokens drive spacing, typography, colors, borders, elevation (`lib/design-tokens.ts`); avoid hardcoded Tailwind values.
- Typography via `components/ui/typography` (Heading/Text/etc.); prefer variants over manual classes.
- Layout: `Container`, `ResponsiveGrid`, section-based composition under `components/sections/`.
- Data flow: Static JSON (e.g., `data/blog.json`) consumed per section (featured, sliders, lists).
- Imagery: Always use Next.js `Image` with `fill`, `sizes`, and descriptive `alt`.
- Dark mode: Use `colors.background/foreground/border` tokens; verify both themes for every change.


