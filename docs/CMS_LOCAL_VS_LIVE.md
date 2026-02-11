# Why CMS Shows on Localhost but Not on Live (Vercel)

## The two setups

### 1. Payload CMS is on the internet (e.g. cms.scrolli.co)

- **Local:** Your `.env.local` has `PAYLOAD_API_URL=https://cms.scrolli.co/api` and `PAYLOAD_API_KEY=...`. The Next app (localhost) fetches from that URL → content shows.
- **Live:** Vercel must use the **same** URL and key. If content is missing on live, it’s almost always one of these:

| Check | What to do |
|-------|------------|
| **Env vars not set on Vercel** | Vercel → Project → **Settings** → **Environment Variables**. Add `PAYLOAD_API_URL` and `PAYLOAD_API_KEY` for **Production** (and Preview if you use it). |
| **Wrong environment** | Variables only in “Development” don’t apply to Production. Add them for **Production**. |
| **Different or wrong values** | `PAYLOAD_API_URL` must be exactly the same as local (e.g. `https://cms.scrolli.co/api`, no trailing slash). `PAYLOAD_API_KEY` must be the same key your Payload project expects. |
| **Redeploy** | After changing env vars, trigger a **new deployment** (Redeploy in Vercel). Old builds keep using the old env. |

### 2. Payload CMS runs only on your machine (localhost)

- **Local:** `.env.local` has something like `PAYLOAD_API_URL=http://localhost:4000` (or another port). Next.js and Payload both run on your computer, so the app can reach the CMS.
- **Live:** Vercel runs on the internet. It **cannot** reach `http://localhost:...` on your laptop. So if `PAYLOAD_API_URL` on Vercel is:
  - Not set → no CMS config → no content.
  - Set to `http://localhost:...` → requests go to Vercel’s own “localhost”, not your CMS → no content.

**Fix:** Deploy Payload CMS to a public URL (e.g. `https://cms.scrolli.co`) and use that in Vercel:

- On Vercel set:
  - `PAYLOAD_API_URL=https://cms.scrolli.co/api` (or your real Payload URL)
  - `PAYLOAD_API_KEY=<key from that Payload instance>`
- Redeploy the Next.js app.

---

## Quick check on live

1. **Env-check (optional):** In Vercel, add env var `ALLOW_ENV_CHECK=true` for Production, redeploy, then open:
   - `https://<your-vercel-domain>/api/env-check`
   - Response includes a `payload` section: `ok` = CMS reachable, `missing_config` = vars not set, `fetch_failed` = wrong URL/key or CMS down.

2. **Vercel env vars:** In the dashboard, confirm for **Production**:
   - `PAYLOAD_API_URL` = your **public** Payload URL (e.g. `https://cms.scrolli.co/api`).
   - `PAYLOAD_API_KEY` = the API key that Payload expects for that server.

3. **Redeploy** after any env change.

---

## Summary

- **Local works** = your machine has the right `PAYLOAD_API_URL` and `PAYLOAD_API_KEY` (e.g. in `.env.local`), and that URL is reachable from your machine (same machine or public CMS).
- **Live doesn’t** = Vercel either doesn’t have those vars, has them for the wrong environment, has wrong values, or is pointing at a CMS that isn’t deployed on the internet (e.g. localhost). Fix env vars and redeploy; if your CMS was only on localhost, deploy it to a public URL and use that URL on Vercel.
