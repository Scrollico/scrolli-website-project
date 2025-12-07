# Tech Context

- Framework: Next.js 15 (App Router) with TypeScript 5.
- Styling: Tailwind CSS 3.4; design tokens in `lib/design-tokens.ts` (spacing, typography, colors, borders, elevation).
- Components: Radix UI primitives (tabs), shadcn-inspired UI, custom responsive containers.
- Media: Swiper.js carousels, Next.js `Image` for optimization, Framer Motion/GSAP available.
- Data: Static JSON under `data/` (e.g., `blog.json` for featured/trending content).
- Theming: Dark mode mandatory; tokens provide light/dark variants. Use `colors.*` tokens, avoid hardcoded Tailwind colors.


