# User Journey Test Matrix – UI, UX, Backend, Frontend

## Decisions (test environment)

- **Environment**: E2E runs **locally** (e.g. `npm run dev` + local/staging Supabase).
- **RevenueCat**: Use **real RevenueCat sandbox** and **real webhook** to Supabase in payment tests.
- **Test data**: **Discover from API** – fetch article list, pick first premium / first free (and first Hikayeler if needed).
- **Hikayeler**: Same paywall/quota/gift rules as standard articles; add separate UI tests if the component differs.

---

## Scope

- **UI**: What the user sees (elements, copy, states, dark mode).
- **UX**: Flows, redirects, errors, loading states, accessibility.
- **Backend**: Supabase (profiles, article_gifts), RevenueCat webhook, Edge Functions, API routes.
- **Frontend**: Client state (auth, profile, isPaywalled), components, no hydration/state bugs.

Test each matrix row with all four layers where relevant.

---

## 1. Matrix: Article access (anonymous / logged in / quota / gift)

| # | Auth | Premium | Quota | Article | Gift | What to test |
|---|------|---------|-------|---------|------|--------------|
| 1 | Anon | - | - | Free | Any | Full content, no gate. |
| 2 | Anon | - | - | Premium | None | ~30% preview, then paywall/sign-in CTA. |
| 3 | Anon | - | - | Premium | Valid | Validate gift, full content, redeem. |
| 4 | Anon | - | - | Premium | Invalid | Error message, then preview + paywall. |
| 5 | Logged in | No | 0 | Premium | None | Full content, **mark read (1)**. |
| 6 | Logged in | No | 1 | Premium | None | Full content, **mark read (2)**. |
| 7 | Logged in | No | 2 | Premium | None | Paywall (no full content). |
| 8 | Logged in | Yes | - | Premium | None | Full content, no count. |
| 9 | Logged in | Any | Any | Free | Any | Full content. |
| 10 | Logged in | No | Any | Premium | Valid | Redeem gift, full content, **no increment**. |
| 11 | Logged in | No | Any | Premium | Invalid | Error, then quota/paywall. |

---

## 2. Test cases per layer (by matrix row)

### 2.1 UI

- **1 (anon, free article)** – Article body visible, no paywall banner, Premium/Free badge correct; dark mode OK.
- **2 (anon, premium, no gift)** – ~30% visible, paywall/sign-in CTA after preview, no full content in DOM; copy correct.
- **3 (anon, premium, valid gift)** – Full content, gift banner (“X sana bu makaleyi hediye etti!”), no paywall.
- **4 (anon, premium, invalid gift)** – Error message, preview + paywall.
- **5–6 (logged in, under quota)** – Full content, no paywall, usage meter “X/2” correct after read.
- **7 (logged in, at limit)** – Paywall, upgrade CTA, usage “2/2”.
- **8 (logged in, premium)** – Full content, no paywall, no usage count.
- **9 (logged in, free)** – Full content, free badge, no gate.
- **10 (logged in + valid gift)** – Full content, gift banner, usage count unchanged.
- **11 (logged in + invalid gift)** – Invalid message, then quota/paywall UI.

**UI consistency**: CTAs link to `/subscribe` or `/pricing`; loading states present; mobile usable.

### 2.2 UX

- **1** – No unexpected redirects, no sign-in modal for free article.
- **2** – Sign in → `/sign-in`; Subscribe → `/subscribe` or `/pricing`; return URL preserved.
- **3** – Gift redeems automatically; banner dismissible; refresh with same `?gift=` → already used error.
- **4** – Invalid gift: clear error, then same as 2 (preview + paywall).
- **5–6** – Count 0→1, 1→2; no onboarding redirect if done; same article = one count per article.
- **7** – Upgrade/Subscribe leads to subscribe flow; no full content on scroll.
- **8–9** – No paywall, no unnecessary modals.
- **10** – Gift redeems, stay on article, count unchanged (backend assert).
- **11** – After error, can still sign in or subscribe.

**UX flows**: Sign-in from paywall → callback → redirect to `next` or home; subscribe with `?return=` → redirect back; logged-in subscribe = no email step; after payment (webhook delay) next load shows premium.

### 2.3 Backend

- **1** – No profile required; no server error for anon on free article.
- **2** – SSR `getPaywalledArticle` returns truncated + `isPaywalled: true` for anon + premium.
- **3** – SSR returns full content when gift valid; `POST /api/redeem-gift` 200, `read_at` set; `article_gifts` updated.
- **4** – Invalid/used/expired: `getPaywalledArticle` no access; redeem API 4xx; no `read_at`.
- **5–6** – `profiles.articles_read_count` increments 0→1, 1→2; `usage_limit` = 2; SSR full content when under quota.
- **7** – SSR truncated + `isPaywalled: true`; no increment when no access.
- **8** – `is_premium` true; full content; no read count increment.
- **9** – Free article: full content regardless of auth/quota.
- **10** – Gift valid: redeem sets `read_at`; **articles_read_count not incremented**.
- **11** – Invalid gift: no `read_at`; quota applies.

**Subscribe & webhook**: create-subscription-user (no auth) creates/finds user; (logged in) not called. Webhook INITIAL_PURCHASE/RENEWAL updates `profiles.is_premium` by app_user_id or email. Webhook delay: Supabase updated within 30s; next load sees premium.

### 2.4 Frontend

- Auth state in sync after sign-in and `refreshProfile()` post-payment.
- `ContentWithButton` receives `isPaywalled` from server; no full content when true.
- Paywall `ArticleGateWrapper` (articleId) runs on article page; one increment per article when not premium and not gift.
- Gift: `giftValid` from `/api/redeem-gift`; when true, mark-as-read does not run.
- Subscribe (logged in): email step skipped; `handlePayment` uses `user.id` and `user.email` only.
- No hydration mismatch; return URL passed to auth callback when using magic link.

---

## 3. Checklist summary (copy-paste for runs)

**Article access**

- [ ] 1 – Anon, free article: full content, UI/UX/backend.
- [ ] 2 – Anon, premium: preview + paywall, SSR truncation.
- [ ] 3 – Anon, valid gift: full content, redeem, backend `read_at`, no count.
- [ ] 4 – Anon, invalid gift: error, preview + paywall.
- [ ] 5 – Logged in, 0→1: full content, count 1, backend increment.
- [ ] 6 – Logged in, 1→2: full content, count 2, backend increment.
- [ ] 7 – Logged in, at limit: paywall, no full content.
- [ ] 8 – Premium: full content, no count.
- [ ] 9 – Free article: full content.
- [ ] 10 – Logged in + valid gift: full content, redeem, **no increment** (backend).
- [ ] 11 – Logged in + invalid gift: error, then quota/paywall.

**Subscribe & auth**

- [ ] Subscribe anon: email → payment → redirect; webhook → Supabase; next load premium.
- [ ] Subscribe logged in: no email step, charge current user only; webhook updates same user.
- [ ] Sign-in from paywall → callback → redirect; onboarding when needed.
- [ ] Return URL from article to subscribe → success → redirect back to article.

**Backend**

- [ ] `getPaywalledArticle`: anon/premium, under quota, at limit, gift valid/invalid.
- [ ] Redeem-gift API: 200 + `read_at`; 4xx for invalid/used/expired.
- [ ] Mark-as-read: increment when not premium and not gift; gift path never increments.
- [ ] Webhook: INITIAL_PURCHASE/RENEWAL updates correct profile.

**Frontend**

- [ ] Auth/profile/isPremium in sync; paywall state (SSR + client) consistent; PaywallGateWrapper on article page; gift path skips increment.

---

## 4. Existing test assets

- `tests/e2e/subscription-flow.spec.ts` – subscription, paywall, webhook.
- `tests/e2e/premium-gating.spec.ts` – premium gate UI.
- `tests/e2e/revenuecat-paywall.spec.ts` – RevenueCat paywall.
- `tests/e2e/auth.spec.ts` – sign-in.
- `tests/helpers/supabase-helpers.ts` – profile, count, reset.
- `tests/helpers/revenuecat-helpers.ts` – webhook, premium wait.

## 5. MCP / manual runbook

See [docs/user-journey-runbook.md](user-journey-runbook.md) for Supabase and RevenueCat verification steps.
