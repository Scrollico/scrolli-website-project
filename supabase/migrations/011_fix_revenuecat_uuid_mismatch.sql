-- Migration: 011_fix_revenuecat_uuid_mismatch
-- Description: Fix RevenueCat customer ID mismatches by updating revenuecat_customer_id to match user ID
-- This ensures webhooks can correctly identify users

-- Update profiles where revenuecat_customer_id doesn't match the user ID
-- This fixes cases where RevenueCat was configured with a different UUID
UPDATE profiles
SET 
  revenuecat_customer_id = id::text,
  updated_at = NOW()
WHERE revenuecat_customer_id IS NOT NULL
  AND revenuecat_customer_id::uuid != id
  AND id IN (
    -- Only update users who have a premium_since date (they had a subscription)
    -- This prevents accidentally changing IDs for users who never subscribed
    SELECT id FROM profiles WHERE premium_since IS NOT NULL
  );

-- Add a comment explaining the fix
COMMENT ON COLUMN public.profiles.revenuecat_customer_id IS 
'RevenueCat customer ID (app_user_id). Should match Supabase user.id. If mismatched, webhooks may update wrong user or fail.';
