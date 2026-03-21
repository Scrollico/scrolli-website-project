# External Integrations

**Analysis Date:** 2026-03-21

## APIs & External Services

**Content Management:**
- Payload CMS - Headless CMS for articles, hikayeler (stories), daily briefings, curations
  - SDK/Client: HTTP REST API via `@/lib/payload/client.ts`
  - Auth: `PAYLOAD_API_KEY` (server-side only)
  - Base URL: `PAYLOAD_API_URL`
  - Endpoints: Fetches collections like gundem, hikayeler, collabs, stories, categories, tags, authors, navigation

**Subscription & Monetization:**
- RevenueCat - In-app purchase and subscription management
  - SDK/Client: `@revenuecat/purchases-js` v1.23.0
  - Public Key: `NEXT_PUBLIC_REVENUECAT_PUBLIC_KEY` (client-side)
  - Usage: Web-based subscription offerings and customer management
  - Product mapping: `web_billing_monthly`, `web_billing_yearly`, `web_billing_lifetime`
  - Webhook: Incoming via Supabase Edge Function at `supabase/functions/revenuecat-webhook/`
  - Webhook secret: `RC_WEBHOOK_SECRET` (stored in Supabase env)
  - API endpoints: `https://api.revenuecat.com`, `https://e.revenue.cat`

**Email:**
- Resend - Email delivery service
  - SDK/Client: HTTP REST API via direct fetch
  - Auth: `RESEND_API_KEY` (server-side only)
  - Endpoints: `https://api.resend.com/emails`
  - Usage: Contact form submissions (`/app/api/contact/route.ts`), gift article notifications
  - Optional: If not configured, messages logged to console instead

**Payment Processing:**
- Stripe - Noted in CSP headers but not actively used in current implementation
  - Client-side library: `https://js.stripe.com`
  - CSP allows frame-src from `https://js.stripe.com`
  - Status: CSP configured for future integration

**Push Notifications & Messaging:**
- OneSignal - Email and push notification platform
  - App ID: `ONESIGNAL_APP_ID` (public, client-side)
  - API Key: `ONESIGNAL_REST_API_KEY` (server-side only)
  - Webhook: Incoming via Supabase Edge Function at `supabase/functions/onesignal-webhook/`
  - Sync: Supabase Edge Function at `supabase/functions/onesignal-sync/`
  - Database integration: `newsletter_subscribers` and `profiles` tables store `onesignal_player_id`
  - Briefing preferences: JSONB array of selected briefing IDs for targeting

**Story/Article Embedding:**
- Instorier - Embedded story/article viewer for hikayeler articles
  - Domain: `*.instorier.com`, `*.instorier-cdn.com`
  - CSP configured for scripts, styles, fonts, images, and media from Instorier CDN
  - Implementation: Inline JavaScript embeds in article content (identified in `lib/payload/types.ts`)

## Data Storage

**Databases:**
- Supabase PostgreSQL - Primary database for user profiles, subscriptions, newsletter, bookmarks, gifts
  - Connection: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
  - Client libraries:
    - `@supabase/supabase-js` v2.39.0 (browser/client)
    - `@supabase/ssr` v0.1.0 (server-side rendering)
  - Tables:
    - `profiles` - User profile data, subscription status, article reading counts, gifts sent
    - `newsletter_subscribers` - Newsletter subscriptions with briefing preferences
    - `bookmarks` - Saved articles/content
    - `gift_articles` - Article gift tokens and redemption tracking
  - Authentication: Supabase Auth with magic links (OTP)
  - Real-time: WebSocket support via `wss://*.supabase.co`

**File Storage:**
- Azure Blob Storage - Media/image hosting
  - Domain: `scrollimedia.blob.core.windows.net`
  - Usage: Featured images, media assets
  - CSP allows image-src from Azure Blob Storage

- CMS Media Server - Payload CMS media endpoint
  - Domain: `cms.scrolli.co`
  - Usage: Article images, featured images

- External CDNs:
  - Unsplash - Stock photos (`images.unsplash.com`)
  - Webflow CDN - Asset hosting (`cdn.prod.website-files.com`, `uploads-ssl.webflow.com`)

**Caching:**
- In-memory cache (development disabled) - 30-second TTL in production
  - Implementation: `lib/payload/client.ts` with request collapsing
  - Edge runtime cache optimizations for Cloudflare Pages

## Authentication & Identity

**Auth Provider:**
- Supabase Authentication - OpenID-compatible auth backend
  - Method: Magic links (OTP email authentication)
  - Implementation: `lib/supabase/auth.ts`, `/app/auth/callback/route.ts`
  - PKCE flow: Enabled for security
  - Cookies: PKCE code verifier stored in cookies for SSR support
  - Session management: Handled by `@supabase/ssr`

**User Profiles:**
- Linked to Supabase Auth (user.id matches profiles.id)
- Profile fields: avatar, full_name, email, subscription status, article read counts, gift tracking
- RevenueCat integration: `revenuecat_customer_id` stored in profiles

## Monitoring & Observability

**Error Tracking:**
- None detected (no Sentry, Rollbar, or similar)
- Errors logged to console (development and production)

**Logs:**
- Console logging throughout codebase
- Next.js built-in logging

**Analytics:**
- Vercel Analytics (noted in CSP: `https://vitals.vercel-insights.com`)
- Not directly imported, likely injected by Vercel hosting

## CI/CD & Deployment

**Hosting:**
- Cloudflare Pages - Primary hosting platform
  - Compatibility: Node.js with `nodejs_compat` flag enabled
  - Build tool: `@cloudflare/next-on-pages`
  - Static output directory: `.vercel/output/static`
  - Wrangler config: `wrangler.toml`

- Vercel Analytics - Web vitals monitoring via Vercel

**Edge Functions:**
- Supabase Edge Functions (Deno-based)
  - `revenuecat-webhook` - Handles RevenueCat webhook events
  - `onesignal-webhook` - Handles OneSignal webhook events
  - `onesignal-sync` - Syncs user data with OneSignal
  - `newsletter-subscribe` - Newsletter subscription management
  - `create-subscription-user` - User creation on subscription

**E2E Testing:**
- Playwright 1.57.0 - Browser automation tests
  - Config: `playwright.config.ts`
  - Base URL: `http://localhost:3000` (configurable)
  - Reporter: HTML

## Environment Configuration

**Required env vars (critical):**
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL (public)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anon key (public)
- `PAYLOAD_API_URL` - Payload CMS API base URL (public)
- `PAYLOAD_API_KEY` - Payload CMS API key (secret)

**Optional but recommended:**
- `RESEND_API_KEY` - Email delivery (server-side only)
- `NEXT_PUBLIC_REVENUECAT_PUBLIC_KEY` - RevenueCat subscriptions (public)
- `RC_WEBHOOK_SECRET` - RevenueCat webhook validation (Supabase env var)
- `ONESIGNAL_APP_ID` - OneSignal app identifier (public)
- `ONESIGNAL_REST_API_KEY` - OneSignal API key (server-side only)
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase admin access (server-side only, used in Edge Functions)
- `CONTACT_EMAIL` - Contact form recipient email
- `NEXT_PUBLIC_SITE_URL` - Site URL for auth redirects

**Test Configuration:**
- `TEST_USER_EMAIL` - Test user email for E2E tests
- `TEST_USER_PASSWORD` - Test user password
- `PLAYWRIGHT_TEST_BASE_URL` - E2E test base URL (default: `http://localhost:3000`)

**Secrets location:**
- Local: `.env.local` (git-ignored, not committed)
- Production: Cloudflare Pages environment variables / Supabase dashboard secrets

## Webhooks & Callbacks

**Incoming Webhooks:**
- RevenueCat → Supabase Edge Function (`revenuecat-webhook`)
  - Events: Subscription purchase, renewal, expiration, cancellation, refund
  - Security: Authorization header validation with `RC_WEBHOOK_SECRET`
  - Updates: User subscription tier, premium status, subscription dates

- OneSignal → Supabase Edge Function (`onesignal-webhook`)
  - Events: Email unsubscribe, bounce, spam complaint
  - Actions: Deactivates newsletter subscribers

**Outgoing Webhooks/Callbacks:**
- Auth callback: Supabase → `/app/auth/callback/route.ts`
  - Handles magic link verification and session creation

- Subscription callback: RevenueCat → User sign-in flow
  - Triggered after payment completion in RevenueCat checkout

## Content Rendering & Embedding

**Map Services:**
- MapTiler - Vector map tiles
  - Domain: `*.maptiler.com`
  - CSP configured for connect-src and img-src

- OpenStreetMap - Map data
  - Domains: `*.openstreetmap.org`
  - CSP configured

- Stadia Maps - Alternative map service
  - Domains: `*.stadiamaps.com`
  - CSP configured

**Visualization & Data:**
- Flourish - Data visualizations and charts
  - Domain: `public.flourish.studio`, `flo.uri.sh`
  - CSP configured for scripts, styles, images, and frames

**Media Embedding:**
- YouTube - Video embedding
  - Domains: `www.youtube.com`, `youtube.com`, `youtube-nocookie.com`
  - CSP configured for media-src and frame-src

## Development & Local Testing

**Local Supabase Instance:**
- Optional: Supabase local development (supabase-cli)
- Connection test: `http://localhost:7244` (in CSP for local development)

---

*Integration audit: 2026-03-21*
