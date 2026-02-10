-- Migration: 008_remove_old_revenuecat_id
-- Description: Remove deprecated revenuecat_id column (replaced by revenuecat_customer_id)

-- Drop the old revenuecat_id column since we're now using revenuecat_customer_id
ALTER TABLE public.profiles 
DROP COLUMN IF EXISTS revenuecat_id;

-- Add comment to document the change
COMMENT ON COLUMN public.profiles.revenuecat_customer_id IS 'RevenueCat customer ID (app_user_id) for webhook processing. Replaces the old revenuecat_id column.';
