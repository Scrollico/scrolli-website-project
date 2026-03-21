# Codebase Structure

**Analysis Date:** 2026-03-21

## Directory Layout

```
scrolli.co/
├── app/                          # Next.js App Router - pages and API routes
│   ├── [slug]/                   # Dynamic route for dynamic slug routing
│   ├── api/                      # API route handlers (server-side endpoints)
│   ├── auth/                     # Authentication routes (callback, signin)
│   ├── categories/               # Category archive page
│   ├── search/                   # Search results page
│   ├── single/                   # Article single page with [slug]
│   ├── pricing/                  # Subscription pricing page
│   ├── profile/                  # User profile (protected)
│   ├── onboarding/               # User onboarding flow (protected)
│   ├── subscribe/                # Newsletter subscription page
│   ├── gift/                     # Gift article page
│   ├── hikayeler/                # Stories collection page
│   ├── collabs/                  # Collaborations page
│   ├── archive/                  # Article archive
│   ├── author/                   # Author page
│   ├── about-us/                 # About us page
│   ├── contact/                  # Contact page
│   ├── design-system/            # Design system demo (dev/test)
│   ├── layout.tsx                # Root layout with providers
│   ├── page.tsx                  # Homepage
│   ├── error.tsx                 # Error boundary component
│   ├── global-error.tsx          # Global error boundary
│   ├── not-found.tsx             # 404 page
│   ├── sitemap.ts                # Dynamic sitemap generation
│   └── globals.css               # Global Tailwind/CSS styles
│
├── components/                   # React components (Server and Client)
│   ├── providers/                # Context providers (auth, theme, locale, RevenueCat)
│   │   ├── auth-provider.tsx
│   │   ├── theme-provider.tsx
│   │   ├── locale-provider.tsx
│   │   ├── translation-provider.tsx
│   │   ├── revenuecat-provider.tsx
│   │   └── NextTopLoaderClient.tsx
│   │
│   ├── layout/                   # Layout components
│   │   ├── Layout.tsx            # Main page layout wrapper
│   │   ├── header/               # Header/navbar components
│   │   ├── footer/               # Footer components
│   │   ├── MobileMenu.tsx        # Mobile navigation menu
│   │   └── PageTransition.tsx    # Page transition animations
│   │
│   ├── sections/                 # Page section components (feature-driven)
│   │   ├── home/                 # Homepage sections
│   │   │   ├── HeroSection.tsx
│   │   │   ├── Section1.tsx      # Editor's Picks
│   │   │   ├── ExclusiveStoriesSection.tsx
│   │   │   ├── LazySections.tsx  # Lazy-loaded sections
│   │   │   └── Section3Wrapper.tsx
│   │   ├── single/               # Article page sections
│   │   ├── archive/              # Archive page sections
│   │   ├── search/               # Search results sections
│   │   ├── hikayeler/            # Stories collection sections
│   │   ├── categories/           # Category page sections
│   │   └── about-us/             # About page sections
│   │
│   ├── ui/                       # Unstyled UI components (Radix + Tailwind)
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── dropdown-menu.tsx
│   │   ├── tabs.tsx
│   │   └── ... (radix-based components)
│   │
│   ├── paywall/                  # Paywall components
│   │   ├── Paywall.tsx           # Main paywall overlay
│   │   ├── PaywallOverlay.tsx
│   │   └── RevenueCatButton.tsx  # Purchase button
│   │
│   ├── elements/                 # Small reusable elements
│   │   ├── ArticleCard.tsx       # Article card component
│   │   ├── AuthorCard.tsx
│   │   ├── CategoryBadge.tsx
│   │   └── ... (small feature components)
│   │
│   ├── premium/                  # Premium/subscriber-only components
│   │   └── PremiumBadge.tsx
│   │
│   ├── onboarding/               # Onboarding flow components
│   │   ├── OnboardingFlow.tsx
│   │   └── ... (step components)
│   │
│   ├── design-system/            # Design system documentation
│   │   └── ... (component showcase)
│   │
│   ├── magicui/                  # Magic UI components (pre-built animated)
│   │   └── ... (animated components)
│   │
│   ├── responsive/               # Responsive layout helpers
│   │   ├── ResponsiveGrid.tsx
│   │   └── MobileDetector.tsx
│   │
│   ├── icons/                    # Custom SVG icons (Radix icons + custom)
│   │   └── ... (icon components)
│   │
│   └── Page Sections/            # Legacy/alternate section naming
│
├── lib/                          # Business logic, data fetching, utilities
│   ├── payload/                  # Payload CMS integration
│   │   ├── client.ts             # Payload API client with caching
│   │   ├── types.ts              # Payload collection types + mappers
│   │   ├── authors.ts            # Author-specific fetching
│   │   ├── serialize.ts          # Content serialization (Lexical → HTML)
│   │   └── update.ts             # Content update operations
│   │
│   ├── supabase/                 # Supabase (auth + database)
│   │   ├── client.ts             # Browser client for auth/queries
│   │   ├── server.ts             # Server client for auth
│   │   ├── middleware.ts         # Middleware session handling
│   │   ├── auth.ts               # Auth helper functions
│   │   ├── premium.ts            # Premium status checks
│   │   ├── types.ts              # Database types (auto-generated)
│   │   └── constants.ts          # Supabase constants
│   │
│   ├── revenuecat/               # RevenueCat integration
│   │   ├── client.ts             # RevenueCat client initialization
│   │   └── hooks.ts              # React hooks for entitlements
│   │
│   ├── api/                      # API route utilities
│   │   ├── validation.ts         # Zod schemas for input validation
│   │   ├── sanitize.ts           # Text/HTML sanitization functions
│   │   ├── middleware.ts         # CORS, rate limiting, request size checks
│   │   ├── auth.ts               # API authentication helpers
│   │   ├── errors.ts             # Error handling utilities
│   │   └── rate-limit.ts         # Rate limiting implementation
│   │
│   ├── content.ts                # Content fetching utilities (uses Payload client)
│   ├── homepage.ts               # Homepage content assembly (isFeatured + fallback logic)
│   ├── seo.ts                    # SEO metadata generation
│   ├── structured-data.ts        # JSON-LD structured data (Organization, Website, Article)
│   ├── navigation.ts             # Navigation menu utilities
│   ├── html-cleaner.ts           # HTML cleaning (Mailchimp form removal)
│   ├── design-tokens.ts          # Design system tokens (colors, spacing, etc.)
│   ├── utils.ts                  # General utility functions
│   ├── locale-config.ts          # Locale configuration (tr/en)
│   ├── env-validation.ts         # Environment variable validation
│   ├── author-loader.ts          # Client-side author data fetching
│   ├── author-loader-server.ts   # Server-side author data fetching
│   └── paywall-server.ts         # Server-side paywall/premium checks
│
├── types/                        # TypeScript type definitions
│   └── content.ts                # Content interface definitions (Article, Author, Category, etc.)
│
├── hooks/                        # React hooks
│   ├── useAuth.ts                # Auth context hook
│   ├── useLocale.ts              # Locale context hook
│   ├── useTranslation.ts         # Translation context hook
│   ├── useRevenueCat.ts          # RevenueCat entitlements hook
│   └── ... (custom hooks)
│
├── public/                       # Static assets
│   ├── assets/                   # Images, CSS, icons
│   │   ├── images/               # Hero images, logos, etc.
│   │   ├── css/                  # Legacy CSS files
│   │   └── fonts/                # Font files
│   └── sitemap.xml               # Static sitemap (updated at build)
│
├── scripts/                      # Utility scripts (not bundled)
│   ├── eslint-plugin-scrolli-design.ts    # Design compliance linter
│   ├── audit-design-compliance.ts         # Design system audit
│   ├── audit-contrast.js                  # A11y contrast checker
│   ├── auto-assign-featured-images.ts     # CMS image assignment
│   ├── test-revenuecat-flow.ts            # RevenueCat testing
│   ├── verify-revenuecat-config.ts        # RevenueCat config check
│   └── ... (50+ other scripts)
│
├── supabase/                     # Supabase database config
│   ├── migrations/               # Database migration files
│   ├── functions/                # Edge Functions (Deno)
│   └── config.toml               # Supabase CLI config
│
├── e2e/                          # End-to-end test setup
│   └── ... (Playwright config)
│
├── tests/                        # Integration/unit tests
│   └── ... (test files)
│
├── data/                         # Static data (fallbacks, seed data)
│   └── ... (JSON data files)
│
├── docs/                         # Documentation (CMS mapping, setup guides)
│   └── ... (markdown documentation)
│
├── .planning/                    # GSD planning documents
│   └── codebase/                 # Codebase analysis (ARCHITECTURE.md, STRUCTURE.md, etc.)
│
├── .claude/                      # Claude-specific config
│   └── CLAUDE.md                 # User's instructions for Claude
│
├── .cursor/                      # Cursor IDE config
│   ├── rules/
│   ├── commands/
│   └── skills/
│
├── .github/                      # GitHub config
│   └── workflows/                # CI/CD workflows
│
├── .husky/                       # Git hooks
│   └── ... (pre-commit, pre-push hooks)
│
├── middleware.ts                 # Next.js middleware (auth, rate limit, CORS)
├── next.config.js                # Next.js configuration
├── tsconfig.json                 # TypeScript configuration
├── tailwind.config.ts            # Tailwind CSS configuration
├── postcss.config.js             # PostCSS configuration
├── .eslintrc.json                # ESLint configuration
├── .npmrc                        # NPM configuration
├── package.json                  # Project dependencies
├── package-lock.json             # Dependency lockfile
├── playwright.config.ts          # Playwright E2E config
└── wrangler.toml                 # Cloudflare Pages config
```

## Directory Purposes

**app/**
- Purpose: Next.js App Router pages and API routes
- Contains: Page components, API handlers, error boundaries, layout
- Key files: `layout.tsx` (root layout), `page.tsx` (homepage), `error.tsx`, `global-error.tsx`

**components/**
- Purpose: Reusable UI components organized by feature/type
- Contains: React components (Server and Client), styled with Tailwind
- Key files: `providers/` (context), `layout/` (page structure), `sections/` (feature sections), `ui/` (base components)

**lib/**
- Purpose: Core business logic, data fetching, external integrations
- Contains: Payload client, Supabase client, API utilities, content mappers, validators
- Key files: `payload/client.ts` (CMS API), `supabase/client.ts` (auth), `api/validation.ts` (Zod schemas)

**types/**
- Purpose: Central TypeScript type definitions
- Contains: Content interfaces, schema types
- Key files: `content.ts` (Article, Section interfaces)

**hooks/**
- Purpose: Custom React hooks for state management and context
- Contains: Context hooks, custom data-fetching hooks
- Key files: Hook files matching component/feature names

**public/**
- Purpose: Static assets served as-is
- Contains: Images, legacy CSS, fonts, favicon
- Key files: `assets/images/`, `assets/css/` (legacy files)

**scripts/**
- Purpose: Build-time and utility scripts (not bundled)
- Contains: TypeScript/JavaScript utilities for design audit, CMS updates, testing
- Key files: Over 50 scripts for various tasks

**supabase/**
- Purpose: Supabase database and edge function configuration
- Contains: SQL migrations, Edge Function code, CLI config
- Key files: `migrations/` (schema changes)

## Key File Locations

**Entry Points:**
- `app/layout.tsx`: Root layout, initializes providers, fonts, global styles
- `app/page.tsx`: Homepage, fetches and composes sections
- `middleware.ts`: Request-level middleware for auth, CORS, rate limiting

**Configuration:**
- `next.config.js`: Next.js build config (image optimization, bundle analyzer)
- `tsconfig.json`: TypeScript configuration with path aliases
- `tailwind.config.ts`: Tailwind CSS theme and plugin configuration
- `playwright.config.ts`: E2E test configuration
- `wrangler.toml`: Cloudflare Pages deployment config

**Core Logic:**
- `lib/payload/client.ts`: Payload CMS API client with caching
- `lib/supabase/client.ts`: Supabase browser client
- `lib/api/validation.ts`: Zod schemas for input validation
- `lib/homepage.ts`: Homepage content assembly logic
- `lib/content.ts`: Content fetching and mapping utilities

**Testing:**
- `playwright.config.ts`: E2E test config
- `tests/`: Integration/unit tests
- `e2e/`: E2E test setup files

## Naming Conventions

**Files:**
- Pages: `page.tsx` (Next.js convention)
- Layout: `layout.tsx` (Next.js convention)
- API routes: `route.ts` (Next.js App Router convention)
- Components: PascalCase (e.g., `HeroSection.tsx`, `ArticleCard.tsx`)
- Utilities: camelCase (e.g., `content.ts`, `utils.ts`, `html-cleaner.ts`)
- Types: `types.ts`, `constants.ts`
- Hooks: `use[Feature].ts` (e.g., `useAuth.ts`, `useTranslation.ts`)

**Directories:**
- Feature directories: camelCase or lowercase (e.g., `sections`, `components`, `providers`)
- Domain-specific: feature name (e.g., `payload`, `supabase`, `revenuecat`)
- Route directories: kebab-case (e.g., `[slug]`, `sign-in`, `gift-article`)

**Exports:**
- Named exports for utilities and components
- Default export for pages and layouts
- Barrel files: index.ts re-exports from directory (some locations)

## Where to Add New Code

**New Feature (e.g., new content type):**
- Types: `types/content.ts` (new interface) or `lib/payload/types.ts` (Payload schema)
- Data fetching: `lib/payload/client.ts` (new fetch function), `lib/content.ts` (new mapper)
- Page: `app/[new-route]/page.tsx`
- Components: `components/sections/[feature]/` (new section components)
- API: `app/api/[feature]/route.ts` (if needed)
- Tests: `tests/` or `e2e/` (Playwright)

**New Component/Module:**
- If reusable UI: `components/ui/` or `components/elements/`
- If feature-specific: `components/[feature]/`
- If section: `components/sections/[page]/`
- If provider: `components/providers/`

**Utilities and Helpers:**
- Shared utilities: `lib/utils.ts` or domain-specific file (e.g., `lib/api/sanitize.ts`)
- API utilities: `lib/api/` (organized by concern: validation, sanitize, auth, errors, rate-limit)
- Payload utilities: `lib/payload/` (organized by concern: client, types, authors, serialize)

**Styles:**
- Global styles: `app/globals.css`
- Component-scoped: Use Tailwind className prop (no separate CSS files)
- Design tokens: `lib/design-tokens.ts` (colors, spacing, etc.)
- Legacy CSS: `public/assets/css/` (only for legacy, not new code)

## Special Directories

**app/api/**
- Purpose: Next.js API routes (server-only endpoints)
- Generated: No
- Committed: Yes
- Pattern: Route handlers in `route.ts`, organized by resource

**public/**
- Purpose: Static assets (served at root domain)
- Generated: Partially (favicons, sitemap.xml)
- Committed: Yes
- Note: Images and CSS here; anything not changing often

**.next/**
- Purpose: Next.js build output
- Generated: Yes (from `npm run build`)
- Committed: No (.gitignored)
- Note: Do not modify directly

**node_modules/**
- Purpose: Installed dependencies
- Generated: Yes (from `npm install`)
- Committed: No (.gitignored)

**supabase/**
- Purpose: Supabase CLI project files
- Generated: Partially (migrations auto-created)
- Committed: Yes
- Note: Migrations version control, functions are Deno TypeScript

**scripts/**
- Purpose: Development and utility scripts
- Generated: No
- Committed: Yes
- Pattern: TypeScript files use `tsx` runner, JavaScript for Node.js utilities

## Import Path Aliases

**Configured in tsconfig.json:**
- `@/` → project root directory
- Examples:
  - `@/components/...`
  - `@/lib/payload/client`
  - `@/types/content`
  - `@/hooks/useAuth`

**Usage:** Always use `@/` for imports (never relative imports for clarity)

---

*Structure analysis: 2026-03-21*
