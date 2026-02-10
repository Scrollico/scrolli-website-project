# User Journey – MCP / Manual Runbook

Short steps to verify Supabase and RevenueCat state after critical paths (sign-in, subscribe, gift redeem, mark read).

---

## Prerequisites

- **Supabase**: `SUPABASE_URL` (or `NEXT_PUBLIC_SUPABASE_URL`) and `SUPABASE_SERVICE_ROLE_KEY` in `.env.local`.
- **RevenueCat**: Webhook secret `RC_WEBHOOK_SECRET` in Supabase Edge Function secrets; RevenueCat dashboard access for events.
- **MCP Supabase** (optional): If using Cursor MCP, ensure Supabase MCP is enabled to run queries from the IDE.
- **MCP RevenueCat** (optional): If using Cursor MCP, ensure RevenueCat MCP is enabled for entitlements and webhook config checks.
- Ensure `NEXT_PUBLIC_SUPABASE_URL` matches the Supabase MCP `get_project_url` result (same project).

---

## Pre-flight (Supabase + RevenueCat MCP + app)

Run before a full user-journey test run to confirm environment and test data.

### Supabase MCP

1. **get_project_url** (no args) → Confirm the returned URL matches `NEXT_PUBLIC_SUPABASE_URL` (e.g. `https://<project-ref>.supabase.co`).
2. **list_tables** with `schemas: ["public"]` → Confirm tables exist: `profiles`, `article_gifts`, `bookmarks`, `newsletter_subscribers`; row counts are sane.
3. **list_migrations** (no args) → Confirm expected migrations are applied (e.g. profiles, metered_subscription, gift_system, onesignal, improve_bookmarks).

### RevenueCat MCP

- **Project id**: Run **mcp_RC_get_project** (no args) to list projects; use the project `id` (e.g. `proj9f9c20ba` for Scrolli) as `project_id` below. Or from RevenueCat Dashboard → Project Settings.

1. **mcp_RC_list_entitlements** with `project_id: "proj9f9c20ba"` (or your project id) → Confirm premium entitlement(s) exist (e.g. "Scrolli Premium").
2. **mcp_RC_list_webhook_integrations** with `project_id: "proj9f9c20ba"` → Confirm webhook URL contains your Supabase URL and `/revenuecat-webhook`.

### App / test data

- With app running (`npm run dev`), GET `http://localhost:3000/api/test/article-slugs` (or `PLAYWRIGHT_TEST_BASE_URL` if different).
- Response must include `premiumSlug` and `freeSlug` so the E2E matrix can run. If missing, ensure CMS/content has at least one premium and one free article.

---

## Full run (E2E + backend script)

Run in order (app must be running for both).

1. **E2E user journey matrix** (starts dev server by default unless you set `USE_EXISTING_SERVER=1`):

   ```bash
   npx playwright test tests/e2e/user-journey-matrix.spec.ts
   ```

   With existing server:

   ```bash
   USE_EXISTING_SERVER=1 npx playwright test tests/e2e/user-journey-matrix.spec.ts
   ```

2. **Optional**: Run related specs in the same pass (sign-in, webhook, paywall UI):

   ```bash
   npx playwright test tests/e2e/auth.spec.ts tests/e2e/subscription-flow.spec.ts tests/e2e/revenuecat-paywall.spec.ts tests/e2e/premium-gating.spec.ts
   ```

3. **Backend script** (redeem-gift API):

   ```bash
   npx tsx scripts/test-user-journey-backend.ts
   ```

If E2E fail with `net::ERR_ABORTED` or redirect timeouts, re-run the user-journey-matrix suite once before investigating.

---

## Post-run verification (Supabase MCP)

After running the E2E matrix and/or backend script, use **Supabase MCP** `execute_sql` to validate backend state. Replace `<user_id>`, `<user_email>`, `<gift_token>`, and `<reader_user_id>` with real values from the test run or fixtures.

When using Cursor with Supabase MCP, use the MCP tool `execute_sql` with the same queries below.

### Profiles and counts (after mark-read tests, rows 5–6)

```sql
SELECT id, email, articles_read_count, usage_limit, is_premium
FROM profiles
WHERE id = '<user_id>';
```

- **Check**: `articles_read_count` incremented (1 then 2 after two premium reads), `usage_limit` = 2.

### Premium user (after row 8 or subscribe)

```sql
SELECT id, email, is_premium, subscription_tier, premium_since, current_period_start
FROM profiles
WHERE id = '<user_id>' OR email = '<user_email>';
```

- **Check**: `is_premium` = true, `subscription_tier` set (e.g. monthly, yearly, lifetime).

### Gift redeem (after rows 3, 10)

```sql
SELECT id, article_id, gift_token, read_at, expires_at, from_user_id
FROM article_gifts
WHERE gift_token = '<gift_token>';
```

- **Check**: `read_at` IS NOT NULL after redeem.

```sql
SELECT id, email, articles_read_count
FROM profiles
WHERE id = '<reader_user_id>';
```

- **Check**: For row 10 (logged-in + valid gift), `articles_read_count` unchanged after using gift.

---

## 1. After sign-in

**Goal**: Confirm profile exists and onboarding state is correct.

**Manual or MCP (execute_sql)**:

```sql
SELECT id, email, onboarding_completed, is_premium, articles_read_count, usage_limit, last_reset_date
FROM profiles
WHERE email = '<user_email>';
```

**Check**:

- Row exists.
- `onboarding_completed` = true after onboarding; false for new users until they complete it.
- `articles_read_count` = 0 for new user; unchanged until they read a premium article.

---

## 2. After article read (metered)

**Goal**: Confirm read count incremented and no double-count.

**Manual or MCP (execute_sql)**:

```sql
SELECT id, email, articles_read_count, usage_limit, is_premium
FROM profiles
WHERE id = '<user_id>';
```

**Check**:

- `articles_read_count` increased by 1 after reading one premium article (when not premium and not gift).
- `articles_read_count` ≤ `usage_limit` (default 2).
- Premium users: `articles_read_count` does not need to increment (or is ignored).

---

## 3. After gift redeem

**Goal**: Gift is one-time use; reader’s count not incremented.

**Manual or MCP (execute_sql)**:

```sql
-- Gift row: read_at set, article_id matches
SELECT id, article_id, gift_token, read_at, expires_at, from_user_id
FROM article_gifts
WHERE gift_token = '<gift_token>';

-- Reader profile: count unchanged when access was via gift
SELECT id, email, articles_read_count
FROM profiles
WHERE id = '<reader_user_id>';
```

**Check**:

- `article_gifts.read_at` is set after redeem.
- `article_gifts.article_id` matches the article that was opened.
- If reader was logged in and used gift: `profiles.articles_read_count` unchanged.

---

## 4. After subscribe (payment + webhook)

**Goal**: Profile updated to premium; correct user id.

**Manual or MCP (execute_sql)**:

```sql
SELECT id, email, is_premium, subscription_tier, premium_since, current_period_start
FROM profiles
WHERE id = '<user_id>' OR email = '<user_email>';
```

**Check**:

- `is_premium` = true.
- `subscription_tier` set (e.g. monthly, yearly, lifetime).
- Row updated is the same user who completed payment (match by id or email).

**RevenueCat**:

- Dashboard → Customers → find by `app_user_id` (Supabase user id) or email.
- Events: `INITIAL_PURCHASE` or `RENEWAL` for the product used.
- Webhook logs (if configured): event received and 2xx response.

---

## 5. Webhook delay

**Goal**: Ensure Supabase is updated within a reasonable time after payment.

**Steps**:

1. Complete a test purchase (sandbox).
2. Within 30s, run the “After subscribe” query above.
3. Confirm `is_premium` = true for the paying user.
4. If not, check Edge Function logs for `revenuecat-webhook` and RevenueCat webhook delivery.

---

## 6. Quick reference – env and scripts

| What                  | Where / Command                                                                   |
| --------------------- | --------------------------------------------------------------------------------- |
| Supabase URL          | `NEXT_PUBLIC_SUPABASE_URL` or `SUPABASE_URL`                                      |
| Service role          | `SUPABASE_SERVICE_ROLE_KEY` (server/scripts only)                                 |
| Webhook secret        | Supabase Dashboard → Edge Functions → revenuecat-webhook → Secrets                |
| E2E tests             | `npx playwright test tests/e2e/user-journey-matrix.spec.ts`                       |
| E2E (existing server) | `USE_EXISTING_SERVER=1 npx playwright test tests/e2e/user-journey-matrix.spec.ts` |
| Backend script        | `npx tsx scripts/test-user-journey-backend.ts` (with app running)                 |
| Webhook E2E           | `npx playwright test tests/e2e/revenuecat-paywall.spec.ts`                        |

---

## 7. MCP Supabase usage (Cursor)

If Supabase MCP is enabled:

1. Use the MCP tool **execute_sql** to run the SQL snippets in sections 1–4 and in **Post-run verification (Supabase MCP)** above (replace `<user_id>`, `<user_email>`, `<gift_token>`, `<reader_user_id>` with real values).
2. After sign-in: query `profiles` by email (section 1).
3. After mark read: query `profiles` by id, check `articles_read_count` (section 2 or Post-run).
4. After gift: query `article_gifts` by `gift_token` and `profiles` by reader id (section 3 or Post-run).
5. After subscribe: query `profiles` by id or email, check `is_premium` and `subscription_tier` (section 4 or Post-run).
