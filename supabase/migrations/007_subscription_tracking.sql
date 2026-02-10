-- Migration: 007_subscription_tracking
-- Description: Add subscription tier tracking and RevenueCat integration fields

-- Add subscription tracking columns
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS subscription_tier TEXT CHECK (subscription_tier IN ('monthly', 'yearly', 'lifetime', 'free')) DEFAULT 'free',
ADD COLUMN IF NOT EXISTS revenuecat_customer_id TEXT,
ADD COLUMN IF NOT EXISTS premium_since TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS current_period_start DATE DEFAULT CURRENT_DATE;

-- Add unique constraint for RevenueCat customer ID
CREATE UNIQUE INDEX IF NOT EXISTS idx_revenuecat_customer_id_unique ON public.profiles(revenuecat_customer_id) WHERE revenuecat_customer_id IS NOT NULL;

-- Add regular index for fast lookups
CREATE INDEX IF NOT EXISTS idx_subscription_tier ON public.profiles(subscription_tier);
CREATE INDEX IF NOT EXISTS idx_premium_since ON public.profiles(premium_since) WHERE premium_since IS NOT NULL;

-- Add comments for documentation
COMMENT ON COLUMN public.profiles.subscription_tier IS 'User subscription tier: monthly, yearly, lifetime, or free';
COMMENT ON COLUMN public.profiles.revenuecat_customer_id IS 'RevenueCat customer ID (app_user_id) for webhook processing';
COMMENT ON COLUMN public.profiles.premium_since IS 'Timestamp when user first became premium (for cohort analysis)';
COMMENT ON COLUMN public.profiles.current_period_start IS 'Start date of current billing period (for monthly article resets)';
