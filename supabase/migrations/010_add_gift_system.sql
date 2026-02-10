-- Migration: 010_add_gift_system
-- Description: Add gift article system - users can gift 2 articles per month to others

-- Create article_gifts table
CREATE TABLE IF NOT EXISTS public.article_gifts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  from_user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  to_email TEXT NOT NULL,
  article_id TEXT NOT NULL,
  gift_token TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  read_at TIMESTAMPTZ NULL,
  reader_user_id UUID NULL REFERENCES public.profiles(id) ON DELETE SET NULL
);

-- Create indexes for efficient queries
CREATE INDEX IF NOT EXISTS idx_article_gifts_from_user ON public.article_gifts(from_user_id);
CREATE INDEX IF NOT EXISTS idx_article_gifts_token ON public.article_gifts(gift_token);
CREATE INDEX IF NOT EXISTS idx_article_gifts_to_email ON public.article_gifts(to_email);
CREATE INDEX IF NOT EXISTS idx_article_gifts_expires_at ON public.article_gifts(expires_at);

-- Add gift tracking columns to profiles table
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS gifts_sent_this_month INT DEFAULT 0,
ADD COLUMN IF NOT EXISTS gifts_reset_date TIMESTAMPTZ DEFAULT NOW();

-- Add comments for documentation
COMMENT ON COLUMN public.profiles.gifts_sent_this_month IS 'Number of articles gifted this month (max 2, separate from free articles)';
COMMENT ON COLUMN public.profiles.gifts_reset_date IS 'Date when gift quota was last reset (1st of month, calendar month)';

COMMENT ON TABLE public.article_gifts IS 'Tracks article gifts - allows anonymous access to articles via gift tokens';
COMMENT ON COLUMN public.article_gifts.gift_token IS 'Unique token for gift access (one-time use, expires after 7 days)';
COMMENT ON COLUMN public.article_gifts.expires_at IS 'Token expiration date (7 days from creation)';
COMMENT ON COLUMN public.article_gifts.read_at IS 'Timestamp when gift was redeemed (one-time use)';

-- Enable RLS on article_gifts table
ALTER TABLE public.article_gifts ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can view their own sent gifts
CREATE POLICY "Users can view own sent gifts"
ON public.article_gifts FOR SELECT
USING (auth.uid() = from_user_id);

-- RLS Policy: Users can create gifts (insert)
CREATE POLICY "Users can create gifts"
ON public.article_gifts FOR INSERT
WITH CHECK (auth.uid() = from_user_id);

-- RLS Policy: Service role can update gifts (for tracking redemption)
CREATE POLICY "Service role can update gifts"
ON public.article_gifts FOR UPDATE
USING (auth.role() = 'service_role');
