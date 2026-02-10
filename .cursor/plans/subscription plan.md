# SCROLLI SUBSCRIPTION SYSTEM - PRD v1.0

**Project:** Scrolli Monetization Platform  
**Date:** January 10, 2026  
**Scope:** Email-gated freemium subscription system with RevenueCat + Stripe + Supabase + Next.js  
**Version:** 1.0

***

## 1. EXECUTIVE SUMMARY

Scrolli implements a **zero-friction freemium model** that prioritizes email capture, then monetizes engaged readers through a simple subscription system. The key innovation: **First article is completely free (email-only), not a paid subscription.**

### Core Mechanics:
- **Email gate (Free)** → 1st article access, email captured
- **Monthly free quota** → 2 additional free articles/month  
- **Gift mechanism** → Users can gift 2 articles/month to others
- **Paywall (Hard)** → After quota exceeded, shows subscription options
- **Subscription tiers** → $1.90/mo, $10.90/yr, $20.90/lifetime

***

## 2. USER JOURNEYS

### 2.1 NEW USER (FIRST-TIME VISITOR)

```
User visits article
       ↓
[Reads 30% of article]
       ↓
EMAIL GATE MODAL appears:
  "Read the full story"
  "Enter email to unlock this article"
  [Email input]
  [GET ARTICLE button]
       ↓
User enters email
       ↓
EMAIL VERIFICATION:
  "Check your inbox to confirm"
  (Email sent with verification link)
       ↓
User clicks email link
  OR
User can skip (article still shown)
       ↓
ARTICLE SHOWN (full content)
       ↓
User marked in DB:
  - email_confirmed: false (until they click link)
  - free_articles_used_this_month: 1
  - free_articles_gifted_used_this_month: 0
  - subscription_status: 'free'
  - created_at: now()
       ↓
SESSION 2 (Next article):
  User reads 2nd article (last free)
  Counter: "1 of 2 free articles left this month"
       ↓
SESSION 3 (Try 3rd article):
  PAYWALL TRIGGERED:
  "You've used your 2 free articles"
  "Get unlimited access + daily.alara + community"
  [3 subscription options]
```

### 2.2 RETURNING USER (Already email'd)

```
User visits article
       ↓
Check DB for user (by email/IP/cookie):
  - If subscription_status = 'premium'/'yearly'/'lifetime'
    → Show article (no gate)
  - If subscription_status = 'free'
    → Check free_articles_used_this_month
      
If articles_used < 2:
  Show article (no gate)
  
If articles_used >= 2:
  PAYWALL appears
```

### 2.3 SIGNUP FLOW (4 STEPS)

**IMPORTANT:** Signup path = MUST be subscription (paid).  
Signing in = existing users (no payment required).

```
STEP 1: CONFIRM EMAIL
┌──────────────────────────────┐
│ Let's verify your email      │
│                              │
│ Email: user@example.com      │
│ [SEND CONFIRMATION LINK]     │
│                              │
│ Link sent! Check inbox...    │
│ [RESEND] [USE ANOTHER EMAIL] │
└──────────────────────────────┘

STEP 2: CHOOSE PLAN
┌──────────────────────────────┐
│ REVIEW YOUR SUBSCRIPTION     │
│                              │
│ ▼ STARTER MONTHLY            │
│   $1.90/month                │
│   (Then $2.90/mo after)      │
│   Billed monthly             │
│   [CONTINUE]                 │
│                              │
│ ▶ STARTER YEARLY             │
│   $10.90/year                │
│   Save 56% vs monthly        │
│   [CONTINUE]                 │
│                              │
│ ▶ LIFETIME ACCESS            │
│   $20.90 (once)              │
│   Permanent access           │
│   [CONTINUE]                 │
└──────────────────────────────┘

STEP 3: PAYMENT
┌──────────────────────────────┐
│ PAYMENT METHOD               │
│                              │
│ [Stripe payment form]        │
│ - Card number                │
│ - Expiry                     │
│ - CVC                        │
│                              │
│ Order summary:               │
│ Starter Monthly: $1.90       │
│ + Tax: $0.15                 │
│ TOTAL: $2.05                 │
│                              │
│ [COMPLETE PURCHASE]          │
└──────────────────────────────┘

STEP 4: SUCCESS
┌──────────────────────────────┐
│ ✓ You're all set!            │
│                              │
│ Welcome to Scrolli Premium   │
│ Unlimited articles           │
│ Daily.alara digest           │
│ Community access             │
│                              │
│ [VIEW ARTICLE] [DASHBOARD]   │
│                              │
│ Check email for receipt      │
└──────────────────────────────┘
```

### 2.4 PAYWALL FLOW (Engaged User Hits Quota)

```
User tries to read 3rd article (month quota exceeded)

PAYWALL MODAL:
┌──────────────────────────────────────┐
│ You've read 2 free articles          │
│ this month                           │
│                                      │
│ Get unlimited access:                │
│ • All articles (past & future)       │
│ • Daily.alara digest                 │
│ • Community access                   │
│                                      │
│ PRICING:                             │
│ ┌────────────────────────────────┐   │
│ │ STARTER MONTHLY                │   │
│ │ $1.90/month                    │   │
│ │ (Then $2.90/mo)                │   │
│ │ [SUBSCRIBE NOW] ← Primary CTA  │   │
│ └────────────────────────────────┘   │
│                                      │
│ ┌────────────────────────────────┐   │
│ │ STARTER YEARLY                 │   │
│ │ $10.90/year (Save 56%)         │   │
│ │ [BEST VALUE]                   │   │
│ │ [SUBSCRIBE NOW]                │   │
│ └────────────────────────────────┘   │
│                                      │
│ ┌────────────────────────────────┐   │
│ │ LIFETIME ACCESS                │   │
│ │ $20.90 (One-time payment)      │   │
│ │ Permanent access               │   │
│ │ [SUBSCRIBE NOW]                │   │
│ └────────────────────────────────┘   │
│                                      │
│ OR                                   │
│                                      │
│ [GIFT ARTICLE] ← Secondary CTA       │
│ Get 1 more free article today        │
│ (Can gift 2x per month to others)    │
│                                      │
│ Already subscribed? [SIGN IN]        │
└──────────────────────────────────────┘
```

### 2.5 GIFT MECHANISM FLOW

```
User clicks [GIFT ARTICLE] on paywall

GIFT MODAL:
┌──────────────────────────────────┐
│ Gift an article to a friend      │
│                                  │
│ Your quota: 2 gifts/month (2)    │
│ Gifts used: 0                    │
│ Gifts remaining: 2               │
│                                  │
│ Friend's email:                  │
│ [email input]                    │
│                                  │
│ [SEND GIFT]                      │
│                                  │
│ They'll get a link to read this  │
│ article for free (no email req)  │
└──────────────────────────────────┘

WHAT HAPPENS:
- Email sent to friend
- Link = article access
- Friend's read is tracked
- Gift counted against sender's quota (2/month)
- Friend doesn't get free article quota
- Friend can still click-through to subscribe

Friend receives email:
Subject: "Friend shared an article with you"
Body:
  [Friend] shared this article:
  "Article Title"
  
  [READ ARTICLE]
  
  Enjoy reading on Scrolli!
```

***

## 3. DATA MODEL & LOGIC

### 3.1 User Table (Supabase)

```typescript
interface User {
  id: string (UUID)
  email: string (unique)
  email_confirmed: boolean
  
  // Free article tracking
  free_articles_used_this_month: number (0-2)
  free_articles_reset_date: Date (1st of month)
  
  // Gift tracking
  gifted_articles_used_this_month: number (0-2)
  gifted_articles_reset_date: Date (1st of month)
  
  // Subscription tracking
  subscription_status: 'free' | 'active' | 'cancelled' | 'expired'
  subscription_tier: 'starter_monthly' | 'starter_yearly' | 'lifetime' | null
  revenueCat_customerId: string
  revenueCat_entitlementId: string
  
  // Metadata
  created_at: Date
  updated_at: Date
  last_article_read_at: Date
}
```

### 3.2 Article Access Table (Supabase)

```typescript
interface ArticleAccess {
  id: string
  user_id: string
  article_id: string
  
  access_type: 'free' | 'gifted' | 'subscribed'
  // free = counts against 2/month quota
  // gifted = someone gifted it to them
  // subscribed = they paid for it
  
  read_at: Date
  read_percentage: number (0-100)
  completed: boolean
}
```

### 3.3 Gift Table (Supabase)

```typescript
interface ArticleGift {
  id: string
  from_user_id: string
  to_email: string
  article_id: string
  
  gift_link: string (unique JWT token)
  created_at: Date
  read_at: Date | null
  
  // For tracking gift conversions
  reader_user_id: string | null (if they sign up after reading)
}
```

### 3.4 Subscription Table (Supabase)

```typescript
interface Subscription {
  id: string
  user_id: string
  revenueCat_subscription_id: string
  
  tier: 'starter_monthly' | 'starter_yearly' | 'lifetime'
  price_usd: number (1.90 | 10.90 | 20.90)
  
  status: 'active' | 'cancelled' | 'expired' | 'paused'
  started_at: Date
  expires_at: Date | null (null for lifetime)
  cancelled_at: Date | null
  
  auto_renew: boolean (false for lifetime)
  
  stripe_customer_id: string
  stripe_subscription_id: string | null (null for lifetime)
}
```

***

## 4. BUSINESS LOGIC

### 4.1 Free Article Logic

```typescript
async function canReadFreeArticle(user: User): Promise<boolean> {
  // If subscribed, always allow
  if (user.subscription_status === 'active') return true
  
  // Check if free quota reset needed
  const today = new Date()
  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1)
  
  if (user.free_articles_reset_date < monthStart) {
    // Reset monthly quota
    await resetMonthlyQuota(user.id)
  }
  
  // Check remaining quota
  return user.free_articles_used_this_month < 2
}

async function recordArticleRead(
  userId: string,
  articleId: string,
  accessType: 'free' | 'gifted' | 'subscribed'
) {
  // Log the access
  await db.articleAccess.create({
    user_id: userId,
    article_id: articleId,
    access_type: accessType,
    read_at: new Date()
  })
  
  // Increment counter if free article
  if (accessType === 'free') {
    await db.user.update(
      { id: userId },
      { free_articles_used_this_month: { increment: 1 } }
    )
  }
}

async function resetMonthlyQuota(userId: string) {
  const monthStart = new Date()
  monthStart.setDate(1)
  
  await db.user.update(
    { id: userId },
    {
      free_articles_used_this_month: 0,
      gifted_articles_used_this_month: 0,
      free_articles_reset_date: monthStart
    }
  )
}
```

### 4.2 Paywall Trigger Logic

```typescript
function shouldShowPaywall(article: Article, user: User): boolean {
  // If subscribed → never show paywall
  if (user.subscription_status === 'active') return false
  
  // If first article (email gate) → show email modal, not paywall
  if (user.free_articles_used_this_month === 0) return false
  
  // If read 2+ articles this month → show paywall
  if (user.free_articles_used_this_month >= 2) return true
  
  return false
}
```

### 4.3 Gift Logic

```typescript
async function giftArticle(
  fromUserId: string,
  toEmail: string,
  articleId: string
): Promise<string> {
  const user = await db.user.findUnique({ id: fromUserId })
  
  // Check gift quota
  if (user.gifted_articles_used_this_month >= 2) {
    throw new Error('Gift quota exceeded (2/month)')
  }
  
  // Create gift record
  const giftToken = generateJWT({
    article_id: articleId,
    to_email: toEmail,
    expires_in: '7d'
  })
  
  const gift = await db.articleGift.create({
    from_user_id: fromUserId,
    to_email: toEmail,
    article_id: articleId,
    gift_link: giftToken,
    created_at: new Date()
  })
  
  // Increment gift counter
  await db.user.update(
    { id: fromUserId },
    { gifted_articles_used_this_month: { increment: 1 } }
  )
  
  // Send email to recipient
  await sendGiftEmail(toEmail, giftToken, article)
  
  return giftToken
}

async function redeemGift(giftToken: string) {
  // Verify JWT token
  const decoded = verifyJWT(giftToken)
  
  // Find gift record
  const gift = await db.articleGift.findUnique({ 
    where: { gift_link: giftToken } 
  })
  
  if (!gift || gift.read_at !== null) {
    throw new Error('Invalid or already-used gift')
  }
  
  // Allow reading without auth (email