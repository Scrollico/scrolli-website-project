-- Migration: 006_metered_subscription
-- Description: Add columns for metered article access (1 Free + 2 Metered model)

-- Add columns for tracking article reads and usage limits
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS articles_read_count INT DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_reset_date TIMESTAMPTZ DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS usage_limit INT DEFAULT 3;

-- Add comment for documentation
COMMENT ON COLUMN public.profiles.articles_read_count IS 'Number of articles read in the current billing period';
COMMENT ON COLUMN public.profiles.last_reset_date IS 'Date when the article count was last reset (monthly)';
COMMENT ON COLUMN public.profiles.usage_limit IS 'Maximum free articles allowed per period (default 3)';

-- Create index for efficient queries on reset date (for scheduled resets)
CREATE INDEX IF NOT EXISTS idx_profiles_last_reset_date ON public.profiles(last_reset_date);
