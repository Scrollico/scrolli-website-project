-- Migration: 012_onesignal_integration
-- Description: Add OneSignal tracking columns and briefing preferences to newsletter subscribers and profiles

-- Add OneSignal tracking columns to newsletter_subscribers table
ALTER TABLE public.newsletter_subscribers
ADD COLUMN IF NOT EXISTS onesignal_player_id TEXT,
ADD COLUMN IF NOT EXISTS onesignal_synced_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS briefing_preferences JSONB DEFAULT '[]'::jsonb;

-- Add index on onesignal_player_id for fast lookups
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_onesignal_player_id 
ON public.newsletter_subscribers(onesignal_player_id) 
WHERE onesignal_player_id IS NOT NULL;

-- Add index on email for OneSignal lookups (external_user_id = email)
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_email 
ON public.newsletter_subscribers(email);

-- Add OneSignal tracking column to profiles table (for authenticated users)
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS onesignal_player_id TEXT;

-- Add index on onesignal_player_id in profiles
CREATE INDEX IF NOT EXISTS idx_profiles_onesignal_player_id 
ON public.profiles(onesignal_player_id) 
WHERE onesignal_player_id IS NOT NULL;

-- Add comments for documentation
COMMENT ON COLUMN public.newsletter_subscribers.onesignal_player_id IS 'OneSignal player/subscriber ID for email notifications';
COMMENT ON COLUMN public.newsletter_subscribers.onesignal_synced_at IS 'Last sync timestamp with OneSignal';
COMMENT ON COLUMN public.newsletter_subscribers.briefing_preferences IS 'Array of briefing IDs user selected (e.g., ["ana-bulten", "gundem-ozeti"])';
COMMENT ON COLUMN public.profiles.onesignal_player_id IS 'OneSignal player/subscriber ID for authenticated users';
