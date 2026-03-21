<!-- GSD:project-start source:PROJECT.md -->
## Project

**Scrolli UI Polish & Design System**

A focused UI improvement milestone for scrolli.co, a Turkish-language digital magazine platform built on Next.js 15 with Payload CMS and Supabase. This milestone standardizes the spacing/design token system across all components and redesigns the pricing page's scrollytelling animation and bento features section.

**Core Value:** Every component uses consistent, responsive spacing from a single source of truth — and the pricing page feels fluid and polished enough to convert visitors.

### Constraints

- **Runtime**: Must be Cloudflare Pages Edge compatible — no Node-only APIs
- **Tech stack**: Next.js 15 + Tailwind CSS 3.4 + existing design token system
- **Animation libs**: Use GSAP and/or Framer Motion (already installed)
- **Performance**: Scroll animations must be 60fps — no jank
- **Accessibility**: Respect `prefers-reduced-motion`
<!-- GSD:project-end -->

<!-- GSD:stack-start source:codebase/STACK.md -->
## Technology Stack

## Languages
- TypeScript 5.x - Used throughout the codebase for type safety
- JavaScript (ES2017+) - Legacy support and configuration files
- SQL - Supabase database migrations and queries
- TSX - React component files with TypeScript
- CSS - Tailwind CSS utility-first styling
## Runtime
- Node.js 22.0.0 or higher (see `package.json` engines field)
- npm (v10+) - Primary package manager
- lockfileVersion: 3 (package-lock.json)
## Frameworks
- Next.js 15.5.7 - Full-stack React framework with App Router
- React 18 - UI component library
- React DOM 18 - React rendering
- Radix UI (multiple packages) - Headless, accessible component system
- Tailwind CSS 3.4.0 - CSS framework with utility classes
- Framer Motion 12.23.24 - Animation library for React
- GSAP 3.13.0 - High-performance animation library
- Embla Carousel React 8.6.0 - Headless carousel component
- Swiper 11.2.6 - Touch slider library
- React Hook Form 7.65.0 - Performant form state management
- `@hookform/resolvers` 5.2.2 - Schema validation resolvers for React Hook Form
- Zod 4.1.12 - TypeScript-first schema validation
- React Syntax Highlighter 16.1.0 - Code syntax highlighting
- `@types/react-syntax-highlighter` 15.5.13 - Type definitions
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
- Playwright 1.57.0 - Browser automation and E2E testing
- `@playwright/test` 1.57.0 - Playwright test runner
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
- `@types/node` 22.x - Node.js type definitions
- `@types/react` 18.x - React type definitions
- `@types/react-dom` 18.x - React DOM type definitions
## Key Dependencies
- `@supabase/supabase-js` 2.39.0 - Database, auth, and real-time backend
- `@supabase/ssr` 0.1.0 - Supabase auth support for Next.js SSR
- `@revenuecat/purchases-js` 1.23.0 - Subscription management and in-app purchases
- Payload CMS API (via REST) - Headless CMS for articles, hikayeler, stories, curations
- Tailwind CSS - CSS framework with extensive customization
- CSS Grid, Flexbox - Native CSS layout
- `@next/bundle-analyzer` - Analyze Next.js bundle sizes
## Configuration
- Configured via `.env.local` (local development) and hosting provider secrets
- Critical env vars: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `PAYLOAD_API_URL`, `PAYLOAD_API_KEY`
- Optional: `RESEND_API_KEY`, `NEXT_PUBLIC_REVENUECAT_PUBLIC_KEY`, `RC_WEBHOOK_SECRET`, `ONESIGNAL_APP_ID`, `ONESIGNAL_REST_API_KEY`
- `next.config.mjs` - Next.js configuration with image optimization disabled for Cloudflare compatibility
- `tsconfig.json` - TypeScript compiler configuration with strict mode enabled
- `tailwind.config.js` - Tailwind CSS customization with semantic colors and design tokens
- `playwright.config.ts` - E2E test configuration with Edge runtime support
- `.npmrc` - npm configuration
- `wrangler.toml` - Cloudflare Pages configuration with Node.js compatibility enabled
- ESLint 9 configured via `eslint-config-next`
- No Prettier config detected; linting handles formatting
## Platform Requirements
- Node.js >= 22.0.0
- npm 10+
- OS: macOS, Linux, or Windows (with cross-env)
- Cloudflare Pages runtime with nodejs_compat flag enabled
- Edge runtime compatible (some routes use `export const runtime = "edge"`)
- Supabase PostgreSQL database (remote)
- NextAuth/Supabase Auth for authentication
- Disabled (unoptimized: true) for Cloudflare Pages compatibility
- Images served from: Unsplash, Webflow CDN, Azure Blob Storage, CMS domain
- Content Security Policy configured for Instorier, Stripe, Flourish, MapTiler, OpenStreetMap, Stadia Maps, YouTube integration
<!-- GSD:stack-end -->

<!-- GSD:conventions-start source:CONVENTIONS.md -->
## Conventions

## Naming Patterns
- `camelCase` for source files: `env-validation.ts`, `supabase-helpers.ts`
- `PascalCase` for React component files: `Button.tsx`, `SectionHeader.tsx`
- Lowercase for utility/helper files: `utils.ts`, `design-tokens.ts`
- Kebab-case for feature directories: `/sections/hikayeler`, `/components/Page Sections`
- `camelCase` for all functions: `getUser()`, `verifyPremiumStatus()`, `fetchArticles()`
- `camelCase` for async functions: `async function getProfile()`, `async function fetchHikayeler()`
- Prefix with action verb: `get*`, `fetch*`, `verify*`, `setup*`, `cleanup*`
- Private helper functions: Standard camelCase without leading underscore
- `camelCase` for all variables: `testEmail`, `testUserId`, `isPremium`
- `UPPER_SNAKE_CASE` for constants: `WEBHOOK_TEST_TIMEOUT`, `CACHE_TTL`, `FREE_ARTICLE_LIMIT`
- Locale/configuration constants: `NEXT_PUBLIC_SUPABASE_URL` (env var style)
- Component state variables: `camelCase`: `hasUpgradeButton`, `isBlocked`
- `PascalCase` for interfaces: `Profile`, `ButtonProps`, `SectionHeaderProps`
- `PascalCase` for types: `Article`, `PayloadGundem`, `PayloadResponse`
- Type suffix convention: `Props` for component prop types, `Response` for API responses
- Generic types from external packages preserved: `ClassValue`, `VariantProps`
## Code Style
- No `.prettierrc` configured; relies on ESLint defaults
- 2-space indentation (observed in all files)
- Semicolons required at statement ends
- String quotes: Double quotes (`"`) throughout codebase
- Trailing commas in objects/arrays (ES5+ style)
- ESLint 9 with Next.js core-web-vitals config: `extends: "next/core-web-vitals"`
- Custom rules in `.eslintrc.json`:
- No additional ESLint plugins configured
- `strict: true` enforced in `tsconfig.json`
- `noUnusedLocals: true` - unused variables cause errors
- `noUnusedParameters: true` - unused params must be prefixed with `_`
- `noImplicitReturns: true` - all code paths must return
- `noFallthroughCasesInSwitch: true` - switch statements must be exhaustive
- Target: `ES2017` with `module: "esnext"`
## Import Organization
- Root alias: `@/*` maps to `./*` (project root)
- Example: `@/lib/utils`, `@/components/ui`, `@/types/content`
- Consistent across all TypeScript/TSX files
- Enables importing from root without relative paths
- Most directories don't use `index.ts` exports
- Direct imports from specific files: `import { Button } from "@/components/ui/button"`
- Exception: `/components/ui/typography` may use sub-imports
## Error Handling
- Try-catch blocks with `console.error()` logging:
- Server-side functions return `null` on error (graceful degradation)
- Supabase errors checked via `.error` property: `if (error) { console.error() }`
- Environment validation throws on critical missing vars: `throw new Error("Missing required environment variable...")`
- Constructor validation: `if (!value) throw new Error("message")`
- Environment variable validation: throws during startup
- Invalid parameters: throw for programming errors, not runtime errors
- Message format: descriptive error messages with context
- `console.error()` - failures, exceptions, configuration issues
- `console.warn()` - missing optional config, degraded functionality
- `console.log()` - not used in production code
- Enhanced error context: `console.error("Context:", { hasUrl: !!var, nodeEnv: process.env.NODE_ENV })`
## Comments
- Function purpose (JSDoc-style for exported functions)
- Non-obvious algorithm logic
- Business rule explanations
- Complex async/await patterns
- Configuration file sections
- Required for exported functions and components:
- Optional for internal helpers
- Prefer single-line for simple functions
- Multi-line for complex signatures or business logic
- Explain "why" not "what" (code shows what)
- Section separators: `// --- Sub-Second Mastery: Cache & Request Collapsing ---`
- Numbered steps for complex flows: `// 1. Check Memory Cache`, `// 2. Check Pending Requests`
## Function Design
- Prefer functions under 50 lines
- Utility functions: 10-30 lines typical
- Complex operations: split into helper functions
- Server routes: 30-80 lines acceptable
- Use destructuring for objects: `{ className, variant, size, ...props }`
- Limit parameters: max 3-4, use object for more
- Type all parameters explicitly
- Mark optional with `?`: `asChild?: boolean`
- Async functions return `Promise<T>`
- Server operations return `null | T` for graceful failures
- Component functions return JSX element
- Utility functions return specific types, never implicit `any`
## Module Design
- Named exports preferred: `export function getUser() {}`
- Default exports for React components: `export default Button`
- Mixed allowed: named helpers + default component export
- Type exports: `export type Profile = {}`
- Related functions grouped together: `getUser`, `getProfile`, `checkPremiumStatus`
- Internal helper functions before public exports
- Section comments separate logical groups:
- Centralized constants in `/lib/design-tokens.ts`
- Exported as objects with keys: `colors.background.base`, `sectionPadding.md`
- Token values are Tailwind class strings: `"py-8 md:py-12 lg:py-16"`
- Used via `cn()` utility to merge classes: `cn(sectionPadding.md, customClasses)`
## Component Conventions
- Functional components with hooks: `export function Button({ variant, size, ...props })`
- Forward ref wrapper for DOM elements: `React.forwardRef<HTMLButtonElement, ButtonProps>`
- CVA (class-variance-authority) for variant styling:
- Display name for debugging: `Button.displayName = "Button"`
- Design token classes over hardcoded Tailwind: `colors.background.base` not `bg-white`
- Dark mode support via token system (automatic `dark:` variants)
- Never use `bg-white` without `dark:bg-black` equivalent
- Merge utilities: `cn(baseClasses, conditionalClasses, classNameProp)`
- Spread HTML attributes: `React.HTMLAttributes<HTMLDivElement>`
- Combine with variant props: `extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants>`
- Optional className override: `className?: string`
- Pass through unknown props: `{...props}`
## Test Conventions
<!-- GSD:conventions-end -->

<!-- GSD:architecture-start source:ARCHITECTURE.md -->
## Architecture

## Pattern Overview
- Server-first rendering using Next.js App Router with selective edge runtime deployment
- Centralized content management via Payload CMS REST API with multi-locale support
- Client-side providers for auth context, theme, translation, and subscription state
- Middleware-based request handling for authentication, CORS, rate limiting, and session management
- Multi-source content mapping (Gündem/News, Hikayeler/Stories, Collabs, Alara AI, Curations)
- Premium content gating via RevenueCat SDK with Supabase profile verification
## Layers
- Purpose: Page-level data fetching and composition using async Server Components
- Location: `app/[routes]/page.tsx`, `app/layout.tsx`
- Contains: Page components that fetch data, compose sections, handle errors
- Depends on: Lib layer (payload/client, homepage, content utils), component layer
- Used by: Next.js routing system
- Pattern: async Server Components with ISR (60-second revalidation) or force-dynamic where needed
- Purpose: Reusable UI components, sections, and layout composition
- Location: `components/` (organized by: providers, layout, sections, ui, elements, paywall, etc.)
- Contains: React components (mix of Server and Client), styled components, interactive widgets
- Depends on: Type layer, lib utilities, design tokens
- Used by: Page layer and other components
- Pattern: Composition over inheritance; providers wrap tree for context; sections are feature-driven
- Purpose: Core business logic, data fetching, transformations, and external API integration
- Location: `lib/`
- Contains: Payload CMS client, Supabase clients, authentication, content mappers, utilities
- Depends on: External APIs (Payload CMS, Supabase, RevenueCat), type definitions
- Used by: Page layer, component layer, API routes
- Purpose: Backend API endpoints for form submission, content management, gift redemption
- Location: `app/api/[routes]/route.ts`
- Contains: Next.js API Route handlers with validation, sanitization, rate limiting
- Depends on: Middleware, lib layer (API utilities, Supabase, etc.)
- Used by: Client-side fetch calls, external webhooks
- Purpose: Centralized type definitions and interfaces
- Location: `types/`, `lib/payload/types.ts`, `lib/supabase/types.ts`
- Contains: TypeScript interfaces for Content (Article, Section types), Payload schema, Supabase database
- Depends on: Nothing
- Used by: All layers
- Purpose: Request-level processing for authentication, CORS, rate limiting, session management
- Location: `middleware.ts`, `lib/supabase/middleware.ts`, `lib/api/middleware.ts`
- Contains: Request interceptors, Supabase session handling, route protection, CORS
- Depends on: Supabase client, API utilities
- Used by: Next.js middleware system (all requests)
## Data Flow
- **Theme:** Cookie-based (`theme` cookie) with localStorage fallback, hydrated in `<ThemeProvider>`
- **Locale:** Cookie-based (`next-locale` cookie), read from middleware and layout
- **Auth State:** Supabase session (via middleware + `<AuthProvider>` context), profile fetched on mount
- **RevenueCat:** Client-side context (`<RevenueCatProvider>`) maintains entitlements, refreshes on interval
- **Translation:** `<TranslationProvider>` with server-fetched `uiStrings` from Payload
- **UI Strings:** Server-fetched once at layout level via `getUIStrings(locale)`, passed via context
## Key Abstractions
- Purpose: Unified interface for content from multiple Payload collections
- Examples: `types/content.ts` (Article interface), `lib/payload/types.ts` (PayloadGundem, PayloadHikayeler, etc.), mappers in `lib/payload/types.ts`
- Pattern: Discriminated union of Payload types → Article via source-based mappers
- Purpose: Transform Payload collection-specific types to unified Article interface
- Examples: `mapGundemToArticle()`, `mapHikayelerToArticle()`, `mapStoryToArticle()`, `mapCollabToArticle()`
- Pattern: Function takes Payload type, extracts fields, returns Article. Handles null/undefined gracefully.
- Purpose: Centralized Payload API interaction with caching and request collapsing
- Location: `lib/payload/client.ts`
- Pattern: `withCache()` wrapper for 30-second memory TTL, `PENDING_REQUESTS` map prevents duplicate concurrent fetches
- Methods: `fetchArticles()`, `getArticleBySlug()`, `fetchHikayeler()`, `getNavigation()`, etc.
- Purpose: Server and client-side session management with middleware integration
- Location: `lib/supabase/client.ts` (client), `lib/supabase/server.ts` (server), `lib/supabase/middleware.ts` (middleware)
- Pattern: SSR-safe Supabase client using PKCE flow with cookie storage for magic link recovery
- Methods: `signInWithOtp()`, `getUser()`, `signOut()`
- Purpose: App-wide context management for auth, theme, translations, locale, RevenueCat
- Location: `components/providers/`
- Examples: `<AuthProvider>` (Supabase user/session), `<ThemeProvider>` (dark/light), `<LocaleProvider>` (tr/en), `<RevenueCatProvider>` (entitlements)
- Pattern: Nested providers in root layout, context hooks in components
## Entry Points
- Location: `app/layout.tsx`
- Triggers: Every request
- Responsibilities: Initialize fonts, load global styles, set up providers, fetch site settings/UI strings, emit structured data
- Location: `app/page.tsx`
- Triggers: GET `/`
- Responsibilities: Fetch homepage content from Payload, map articles, compose sections, handle errors gracefully
- Location: `app/single/[slug]/page.tsx`
- Triggers: GET `/single/*`
- Responsibilities: Fetch article by slug, check premium status, render paywall if needed, SEO metadata
- Location: `app/auth/callback/route.ts`
- Triggers: Magic link redirect from Supabase OTP
- Responsibilities: Exchange authorization code for session, redirect to onboarding or home
- Location: `app/api/*/route.ts`
- Examples: `/api/contact` (contact form), `/api/revenuecat/offerings` (subscription offerings), `/api/gift-article/*` (gift redemption)
- Responsibilities: Validate input, sanitize data, interact with external services, return JSON
## Error Handling
- **Server Component Errors:** Try-catch in async functions; return fallback UI or empty state
- **API Route Errors:** `getSafeErrorMessage()` returns generic message in production, detailed in development; `logError()` logs full details server-side
- **Payload CMS Failures:** `Promise.allSettled()` used to prevent one failure from blocking all; fallback to empty arrays
- **Supabase Auth Failures:** Silent failure with error logging; user remains unauthenticated
- **Client-Side Errors:** Error boundary at page level (`error.tsx`), global error handler (`global-error.tsx`)
- **Validation Errors:** Zod schemas validate input; return 400 with first error message
- **Rate Limit Errors:** Return 429 with `Retry-After` header
## Cross-Cutting Concerns
- Server-side: `console.log()` and `console.error()` prefixed with context, e.g., `[Middleware]`, `[Layout]`
- Client-side: Error boundaries log to console; external service integration via Sentry (setup available but not yet configured)
- Input validation: Zod schemas in `lib/api/validation.ts` for contact form, auth input, etc.
- Content validation: `isValidArticle()` checks for valid content and images before including in homepage
- Rate limit validation: Token-bucket algorithm in `lib/api/rate-limit.ts`
- Middleware-based session refresh on every request
- Supabase SSR client handles cookie-based PKCE flow
- Profile auto-creation on first protected route access
- Onboarding flow enforces completion before accessing protected routes
- Middleware applies CORS headers to all `/api/*` responses
- Preflight (OPTIONS) requests handled automatically
- Allowed origins configurable via `lib/api/middleware.ts`
- HTML input: `isomorphic-dompurify` removes scripts from article content
- Text input: Custom sanitizers for contact form (text, email, attribute)
- Mailchimp forms auto-removed from article HTML to prevent duplicate forms
- CMS content: 30-second memory cache with request collapsing
- ISR: Homepage revalidated every 60 seconds
- Headers: Static assets use Next.js automatic caching
- Client-side: React Query not used; manual fetch caching via context
- Server logs: Structured logging with context prefixes
- Client-side errors: Logged to console; external service ready for integration
- Performance: Next.js built-in analytics (Page Insights), Cloudflare edge metrics via `@cloudflare/next-on-pages`
<!-- GSD:architecture-end -->

<!-- GSD:workflow-start source:GSD defaults -->
## GSD Workflow Enforcement

Before using Edit, Write, or other file-changing tools, start work through a GSD command so planning artifacts and execution context stay in sync.

Use these entry points:
- `/gsd:quick` for small fixes, doc updates, and ad-hoc tasks
- `/gsd:debug` for investigation and bug fixing
- `/gsd:execute-phase` for planned phase work

Do not make direct repo edits outside a GSD workflow unless the user explicitly asks to bypass it.
<!-- GSD:workflow-end -->



<!-- GSD:profile-start -->
## Developer Profile

> Profile not yet configured. Run `/gsd:profile-user` to generate your developer profile.
> This section is managed by `generate-claude-profile` -- do not edit manually.
<!-- GSD:profile-end -->
