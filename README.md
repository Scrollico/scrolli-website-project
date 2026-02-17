# Scrolli - Next.js App

This is the Scrolli Next.js app, powered by Supabase, RevenueCat, Payload CMS, and OneSignal.

## Environment configuration & secrets

Real API keys and secrets **must never be committed** to the repository. Use the provided `.env.local.example` file as a template:

1. Copy the example file:
   ```bash
   cp .env.local.example .env.local
   ```
2. Replace all `demo_...`, `YOUR_...`, and placeholder values in `.env.local` with your real project credentials.
3. Keep `.env.local` local only – it is gitignored and should be configured separately in your hosting provider’s secret settings.

Key variables defined in `.env.local.example`:

- `PAYLOAD_API_URL` / `PAYLOAD_API_KEY` – Payload CMS endpoint and API key
- `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` – Supabase project URL and public anon key
- `SUPABASE_SERVICE_ROLE_KEY` – Supabase service role key (server-side only)
- `NEXT_PUBLIC_REVENUECAT_PUBLIC_KEY` / `RC_WEBHOOK_SECRET` – RevenueCat Web SDK key + webhook secret
- `ONESIGNAL_APP_ID` / `ONESIGNAL_REST_API_KEY` – OneSignal identifiers and REST API key
- `TEST_USER_EMAIL` / `TEST_USER_PASSWORD` – optional test credentials used only in local/e2e tests

All committed values in `.env.local.example` are **demo placeholders** only; always configure real keys via local `.env.local` and your deployment secret manager.