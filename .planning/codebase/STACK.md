# Technology Stack

**Analysis Date:** 2026-03-21

## Languages

**Primary:**
- TypeScript 5.x - Used throughout the codebase for type safety
- JavaScript (ES2017+) - Legacy support and configuration files
- SQL - Supabase database migrations and queries

**Secondary:**
- TSX - React component files with TypeScript
- CSS - Tailwind CSS utility-first styling

## Runtime

**Environment:**
- Node.js 22.0.0 or higher (see `package.json` engines field)

**Package Manager:**
- npm (v10+) - Primary package manager
- lockfileVersion: 3 (package-lock.json)

## Frameworks

**Core:**
- Next.js 15.5.7 - Full-stack React framework with App Router
- React 18 - UI component library
- React DOM 18 - React rendering

**UI & Components:**
- Radix UI (multiple packages) - Headless, accessible component system
  - `@radix-ui/react-accordion` v1.2.3
  - `@radix-ui/react-avatar` v1.1.11
  - `@radix-ui/react-checkbox` v1.3.3
  - `@radix-ui/react-dialog` v1.1.15
  - `@radix-ui/react-dropdown-menu` v2.1.16
  - `@radix-ui/react-icons` v1.3.2
  - `@radix-ui/react-label` v2.1.8
  - `@radix-ui/react-separator` v1.1.8
  - `@radix-ui/react-slot` v1.2.4
  - `@radix-ui/react-switch` v1.2.6
  - `@radix-ui/react-tabs` v1.1.13
- Tailwind CSS 3.4.0 - CSS framework with utility classes
- Framer Motion 12.23.24 - Animation library for React
- GSAP 3.13.0 - High-performance animation library

**Carousel & Sliders:**
- Embla Carousel React 8.6.0 - Headless carousel component
- Swiper 11.2.6 - Touch slider library

**Forms:**
- React Hook Form 7.65.0 - Performant form state management
- `@hookform/resolvers` 5.2.2 - Schema validation resolvers for React Hook Form
- Zod 4.1.12 - TypeScript-first schema validation

**Code Display:**
- React Syntax Highlighter 16.1.0 - Code syntax highlighting
- `@types/react-syntax-highlighter` 15.5.13 - Type definitions

**Utilities:**
- Clsx 2.1.1 - Conditional CSS class names
- Tailwind Merge 3.3.1 - Merge Tailwind CSS classes intelligently
- Tailwindcss Animate 1.0.7 - Tailwind CSS animation utilities
- Next Themes 0.4.6 - Dark mode support
- NextJS Toploader 3.9.17 - Progress bar for page navigation
- Vaul 1.1.2 - Unstyled drawer component
- `@number-flow/react` 0.5.10 - Animated number counter component
- React Easy Crop 5.5.6 - Image cropping component
- isomorphic-dompurify 3.3.0 - XSS sanitization utility
- `@types/dompurify` 3.0.5 - Type definitions for DOMPurify

**Testing & E2E:**
- Playwright 1.57.0 - Browser automation and E2E testing
- `@playwright/test` 1.57.0 - Playwright test runner

**Build & Dev Tools:**
- TypeScript 5.x - Type checking
- ESLint 9.x - Code linting with Next.js config
- `eslint-config-next` 15.5.7 - Next.js ESLint rules
- Autoprefixer 10.4.21 - CSS vendor prefixing
- PostCSS 8.5.6 - CSS transformation
- Husky 9.1.7 - Git hooks management
- tsx 4.21.0 - TypeScript execution
- `@cloudflare/next-on-pages` 1.13.16 - Cloudflare Pages adapter
- `@next/bundle-analyzer` 15.3.2 - Bundle size analysis
- Dotenv 17.2.3 - Environment variable loading
- Cross-env 7.0.3 - Cross-platform environment variables

**Type Definitions:**
- `@types/node` 22.x - Node.js type definitions
- `@types/react` 18.x - React type definitions
- `@types/react-dom` 18.x - React DOM type definitions

## Key Dependencies

**Critical:**
- `@supabase/supabase-js` 2.39.0 - Database, auth, and real-time backend
- `@supabase/ssr` 0.1.0 - Supabase auth support for Next.js SSR
- `@revenuecat/purchases-js` 1.23.0 - Subscription management and in-app purchases

**Content & CMS:**
- Payload CMS API (via REST) - Headless CMS for articles, hikayeler, stories, curations

**Styling:**
- Tailwind CSS - CSS framework with extensive customization
- CSS Grid, Flexbox - Native CSS layout

**Bundle Analysis:**
- `@next/bundle-analyzer` - Analyze Next.js bundle sizes

## Configuration

**Environment:**
- Configured via `.env.local` (local development) and hosting provider secrets
- Critical env vars: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `PAYLOAD_API_URL`, `PAYLOAD_API_KEY`
- Optional: `RESEND_API_KEY`, `NEXT_PUBLIC_REVENUECAT_PUBLIC_KEY`, `RC_WEBHOOK_SECRET`, `ONESIGNAL_APP_ID`, `ONESIGNAL_REST_API_KEY`

**Build:**
- `next.config.mjs` - Next.js configuration with image optimization disabled for Cloudflare compatibility
- `tsconfig.json` - TypeScript compiler configuration with strict mode enabled
- `tailwind.config.js` - Tailwind CSS customization with semantic colors and design tokens
- `playwright.config.ts` - E2E test configuration with Edge runtime support
- `.npmrc` - npm configuration
- `wrangler.toml` - Cloudflare Pages configuration with Node.js compatibility enabled

**ESLint & Prettier:**
- ESLint 9 configured via `eslint-config-next`
- No Prettier config detected; linting handles formatting

## Platform Requirements

**Development:**
- Node.js >= 22.0.0
- npm 10+
- OS: macOS, Linux, or Windows (with cross-env)

**Production:**
- Cloudflare Pages runtime with nodejs_compat flag enabled
- Edge runtime compatible (some routes use `export const runtime = "edge"`)
- Supabase PostgreSQL database (remote)
- NextAuth/Supabase Auth for authentication

**Image Optimization:**
- Disabled (unoptimized: true) for Cloudflare Pages compatibility
- Images served from: Unsplash, Webflow CDN, Azure Blob Storage, CMS domain

**CSP Headers:**
- Content Security Policy configured for Instorier, Stripe, Flourish, MapTiler, OpenStreetMap, Stadia Maps, YouTube integration

---

*Stack analysis: 2026-03-21*
