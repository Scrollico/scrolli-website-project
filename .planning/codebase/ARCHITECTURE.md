# Architecture

**Analysis Date:** 2026-03-21

## Pattern Overview

**Overall:** Next.js 15 Server Components with hybrid SSR/SSG, Payload CMS-driven content, Supabase authentication & database, RevenueCat subscription management.

**Key Characteristics:**
- Server-first rendering using Next.js App Router with selective edge runtime deployment
- Centralized content management via Payload CMS REST API with multi-locale support
- Client-side providers for auth context, theme, translation, and subscription state
- Middleware-based request handling for authentication, CORS, rate limiting, and session management
- Multi-source content mapping (Gündem/News, Hikayeler/Stories, Collabs, Alara AI, Curations)
- Premium content gating via RevenueCat SDK with Supabase profile verification

## Layers

**Page Layer (Server Components):**
- Purpose: Page-level data fetching and composition using async Server Components
- Location: `app/[routes]/page.tsx`, `app/layout.tsx`
- Contains: Page components that fetch data, compose sections, handle errors
- Depends on: Lib layer (payload/client, homepage, content utils), component layer
- Used by: Next.js routing system
- Pattern: async Server Components with ISR (60-second revalidation) or force-dynamic where needed

**Component Layer:**
- Purpose: Reusable UI components, sections, and layout composition
- Location: `components/` (organized by: providers, layout, sections, ui, elements, paywall, etc.)
- Contains: React components (mix of Server and Client), styled components, interactive widgets
- Depends on: Type layer, lib utilities, design tokens
- Used by: Page layer and other components
- Pattern: Composition over inheritance; providers wrap tree for context; sections are feature-driven

**Lib Layer (Business Logic & Data Access):**
- Purpose: Core business logic, data fetching, transformations, and external API integration
- Location: `lib/`
- Contains: Payload CMS client, Supabase clients, authentication, content mappers, utilities
- Depends on: External APIs (Payload CMS, Supabase, RevenueCat), type definitions
- Used by: Page layer, component layer, API routes

**API Layer (Server-Side Routes):**
- Purpose: Backend API endpoints for form submission, content management, gift redemption
- Location: `app/api/[routes]/route.ts`
- Contains: Next.js API Route handlers with validation, sanitization, rate limiting
- Depends on: Middleware, lib layer (API utilities, Supabase, etc.)
- Used by: Client-side fetch calls, external webhooks

**Type Layer:**
- Purpose: Centralized type definitions and interfaces
- Location: `types/`, `lib/payload/types.ts`, `lib/supabase/types.ts`
- Contains: TypeScript interfaces for Content (Article, Section types), Payload schema, Supabase database
- Depends on: Nothing
- Used by: All layers

**Middleware Layer:**
- Purpose: Request-level processing for authentication, CORS, rate limiting, session management
- Location: `middleware.ts`, `lib/supabase/middleware.ts`, `lib/api/middleware.ts`
- Contains: Request interceptors, Supabase session handling, route protection, CORS
- Depends on: Supabase client, API utilities
- Used by: Next.js middleware system (all requests)

## Data Flow

**Homepage Content Loading:**

1. User requests `/` (home page)
2. Server Component (`app/page.tsx`) calls `getHomepageContent(locale)` from `lib/homepage.ts`
3. `getHomepageContent` parallelizes fetches to Payload CMS:
   - `fetchArticles()` for featured/recent articles from Gündem collection
   - `fetchHikayeler()` for Hikayeler (stories) collection
   - `fetchDailyBriefings()` for daily briefing section
   - `fetchPayload()` for curations, collaborations, videos
4. Payload responses are mapped to `Article` interface via mappers (`mapGundemToArticle`, `mapHikayelerToArticle`, etc.)
5. Mapped articles passed to Layout and Section components for rendering
6. ISR revalidation at 60 seconds
7. Client-side RevenueCat context checks premium status if user is authenticated

**Article Single Page:**

1. User requests `/single/[slug]`
2. Server Component calls `getArticleBySlug(slug, locale)` from `lib/payload/client.ts`
3. Payload returns full article with Lexical-based content
4. Content is serialized/cleaned (mailchimp forms removed, HTML sanitized)
5. Component renders with Layout, related articles, paywall (if premium content)
6. Client-side RevenueCat checks `isPremium` flag; paywall visible if content premium and user not premium

**Authentication Flow:**

1. User navigates to `/sign-in`
2. Client Component (`<SignInForm>`) captures email
3. Form submits to POST `/api/auth/signin` (via Supabase client `signInWithOtp`)
4. Supabase sends OTP email
5. User clicks magic link → redirects to `/auth/callback?code=...&type=...`
6. Callback route exchanges code for session using Supabase client
7. Middleware (`middleware.ts`) refreshes session on every request
8. Authenticated users redirect to `/onboarding` if `onboarding_completed = false`
9. Onboarding completes → redirect to `/`

**Premium Content Access:**

1. User loads article with `isPremium: true`
2. `<Paywall>` component checks `useRevenueCatEntitlements()` hook
3. If user not entitled → paywall overlay blocks content
4. RevenueCat SDK fetches offerings from `GET /api/revenuecat/offerings`
5. User selects plan, RevenueCat handles purchase (on mobile via native SDKs, web via purchase link)
6. RevenueCat webhook updates Supabase `profiles.is_premium`
7. Next page load refreshes entitlements, paywall removed

**State Management:**

- **Theme:** Cookie-based (`theme` cookie) with localStorage fallback, hydrated in `<ThemeProvider>`
- **Locale:** Cookie-based (`next-locale` cookie), read from middleware and layout
- **Auth State:** Supabase session (via middleware + `<AuthProvider>` context), profile fetched on mount
- **RevenueCat:** Client-side context (`<RevenueCatProvider>`) maintains entitlements, refreshes on interval
- **Translation:** `<TranslationProvider>` with server-fetched `uiStrings` from Payload
- **UI Strings:** Server-fetched once at layout level via `getUIStrings(locale)`, passed via context

## Key Abstractions

**Article Abstraction:**
- Purpose: Unified interface for content from multiple Payload collections
- Examples: `types/content.ts` (Article interface), `lib/payload/types.ts` (PayloadGundem, PayloadHikayeler, etc.), mappers in `lib/payload/types.ts`
- Pattern: Discriminated union of Payload types → Article via source-based mappers

**Content Mapper Pattern:**
- Purpose: Transform Payload collection-specific types to unified Article interface
- Examples: `mapGundemToArticle()`, `mapHikayelerToArticle()`, `mapStoryToArticle()`, `mapCollabToArticle()`
- Pattern: Function takes Payload type, extracts fields, returns Article. Handles null/undefined gracefully.

**Payload CMS Client:**
- Purpose: Centralized Payload API interaction with caching and request collapsing
- Location: `lib/payload/client.ts`
- Pattern: `withCache()` wrapper for 30-second memory TTL, `PENDING_REQUESTS` map prevents duplicate concurrent fetches
- Methods: `fetchArticles()`, `getArticleBySlug()`, `fetchHikayeler()`, `getNavigation()`, etc.

**Supabase Auth Client:**
- Purpose: Server and client-side session management with middleware integration
- Location: `lib/supabase/client.ts` (client), `lib/supabase/server.ts` (server), `lib/supabase/middleware.ts` (middleware)
- Pattern: SSR-safe Supabase client using PKCE flow with cookie storage for magic link recovery
- Methods: `signInWithOtp()`, `getUser()`, `signOut()`

**Provider Pattern:**
- Purpose: App-wide context management for auth, theme, translations, locale, RevenueCat
- Location: `components/providers/`
- Examples: `<AuthProvider>` (Supabase user/session), `<ThemeProvider>` (dark/light), `<LocaleProvider>` (tr/en), `<RevenueCatProvider>` (entitlements)
- Pattern: Nested providers in root layout, context hooks in components

## Entry Points

**App Entry Point:**
- Location: `app/layout.tsx`
- Triggers: Every request
- Responsibilities: Initialize fonts, load global styles, set up providers, fetch site settings/UI strings, emit structured data

**Homepage Entry Point:**
- Location: `app/page.tsx`
- Triggers: GET `/`
- Responsibilities: Fetch homepage content from Payload, map articles, compose sections, handle errors gracefully

**Article Single Page:**
- Location: `app/single/[slug]/page.tsx`
- Triggers: GET `/single/*`
- Responsibilities: Fetch article by slug, check premium status, render paywall if needed, SEO metadata

**Auth Callback:**
- Location: `app/auth/callback/route.ts`
- Triggers: Magic link redirect from Supabase OTP
- Responsibilities: Exchange authorization code for session, redirect to onboarding or home

**API Routes:**
- Location: `app/api/*/route.ts`
- Examples: `/api/contact` (contact form), `/api/revenuecat/offerings` (subscription offerings), `/api/gift-article/*` (gift redemption)
- Responsibilities: Validate input, sanitize data, interact with external services, return JSON

## Error Handling

**Strategy:** Graceful degradation with fallbacks; development vs. production error visibility.

**Patterns:**

- **Server Component Errors:** Try-catch in async functions; return fallback UI or empty state
- **API Route Errors:** `getSafeErrorMessage()` returns generic message in production, detailed in development; `logError()` logs full details server-side
- **Payload CMS Failures:** `Promise.allSettled()` used to prevent one failure from blocking all; fallback to empty arrays
- **Supabase Auth Failures:** Silent failure with error logging; user remains unauthenticated
- **Client-Side Errors:** Error boundary at page level (`error.tsx`), global error handler (`global-error.tsx`)
- **Validation Errors:** Zod schemas validate input; return 400 with first error message
- **Rate Limit Errors:** Return 429 with `Retry-After` header

## Cross-Cutting Concerns

**Logging:**
- Server-side: `console.log()` and `console.error()` prefixed with context, e.g., `[Middleware]`, `[Layout]`
- Client-side: Error boundaries log to console; external service integration via Sentry (setup available but not yet configured)

**Validation:**
- Input validation: Zod schemas in `lib/api/validation.ts` for contact form, auth input, etc.
- Content validation: `isValidArticle()` checks for valid content and images before including in homepage
- Rate limit validation: Token-bucket algorithm in `lib/api/rate-limit.ts`

**Authentication:**
- Middleware-based session refresh on every request
- Supabase SSR client handles cookie-based PKCE flow
- Profile auto-creation on first protected route access
- Onboarding flow enforces completion before accessing protected routes

**CORS:**
- Middleware applies CORS headers to all `/api/*` responses
- Preflight (OPTIONS) requests handled automatically
- Allowed origins configurable via `lib/api/middleware.ts`

**Sanitization:**
- HTML input: `isomorphic-dompurify` removes scripts from article content
- Text input: Custom sanitizers for contact form (text, email, attribute)
- Mailchimp forms auto-removed from article HTML to prevent duplicate forms

**Caching:**
- CMS content: 30-second memory cache with request collapsing
- ISR: Homepage revalidated every 60 seconds
- Headers: Static assets use Next.js automatic caching
- Client-side: React Query not used; manual fetch caching via context

**Observability:**
- Server logs: Structured logging with context prefixes
- Client-side errors: Logged to console; external service ready for integration
- Performance: Next.js built-in analytics (Page Insights), Cloudflare edge metrics via `@cloudflare/next-on-pages`

---

*Architecture analysis: 2026-03-21*
