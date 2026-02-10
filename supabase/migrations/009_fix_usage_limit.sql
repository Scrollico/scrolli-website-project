-- Migration: 009_fix_usage_limit
-- Description: Fix usage_limit default from 3 to 2 (2 free articles after first article)

-- Change default usage_limit to 2 (for 2 additional free articles after first)
ALTER TABLE public.profiles
ALTER COLUMN usage_limit SET DEFAULT 2;

-- Update existing free users to have limit of 2
UPDATE public.profiles
SET usage_limit = 2
WHERE is_premium = false AND usage_limit = 3;

-- Update comment to reflect new limit
COMMENT ON COLUMN public.profiles.usage_limit IS 'Maximum free articles allowed per period (default 2, for 2 additional free articles after first article which doesn''t count)';
