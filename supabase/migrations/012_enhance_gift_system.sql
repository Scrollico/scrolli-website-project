-- Migration: 012_enhance_gift_system
-- Description: Enhance gift system with single-use enforcement, tracking, and QR codes

-- Add tracking and security columns
ALTER TABLE public.article_gifts
ADD COLUMN IF NOT EXISTS redeemed_by_user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS redeemed_at_ip TEXT,
ADD COLUMN IF NOT EXISTS redeemed_user_agent TEXT,
ADD COLUMN IF NOT EXISTS qr_code_url TEXT,
ADD COLUMN IF NOT EXISTS share_method TEXT CHECK (share_method IN ('email', 'link', 'qr')),
ADD COLUMN IF NOT EXISTS redemption_metadata JSONB DEFAULT '{}'::jsonb;

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_article_gifts_redeemed_by_user ON public.article_gifts(redeemed_by_user_id);
CREATE INDEX IF NOT EXISTS idx_article_gifts_read_at ON public.article_gifts(read_at) WHERE read_at IS NOT NULL;

-- Add comments for documentation
COMMENT ON COLUMN public.article_gifts.redeemed_by_user_id IS 'User who redeemed the gift (may be different from recipient)';
COMMENT ON COLUMN public.article_gifts.redeemed_at_ip IS 'IP address from which gift was redeemed';
COMMENT ON COLUMN public.article_gifts.redeemed_user_agent IS 'Browser user agent when gift was redeemed';
COMMENT ON COLUMN public.article_gifts.qr_code_url IS 'URL to QR code image for mobile sharing';
COMMENT ON COLUMN public.article_gifts.share_method IS 'How the gift was shared: email, link, or qr';
COMMENT ON COLUMN public.article_gifts.redemption_metadata IS 'Additional metadata about redemption (location, device info, etc.)';

-- Create function to prevent race conditions on gift redemption
CREATE OR REPLACE FUNCTION public.redeem_gift_token(
    p_gift_token TEXT,
    p_article_id TEXT,
    p_redeemed_by_user_id UUID,
    p_redeemed_at_ip TEXT,
    p_redeemed_user_agent TEXT,
    p_redemption_metadata JSONB
)
RETURNS TABLE (
    success BOOLEAN,
    error_message TEXT,
    sender_name TEXT,
    gift_id UUID
) AS $$
DECLARE
    v_gift RECORD;
    v_sender_name TEXT := 'Bir arkadaşın';
BEGIN
    -- Lock the row for update to prevent race conditions
    SELECT * INTO v_gift
    FROM public.article_gifts
    WHERE gift_token = p_gift_token
    FOR UPDATE NOWAIT;
    
    -- Check if gift exists
    IF NOT FOUND THEN
        RETURN QUERY SELECT FALSE, 'Geçersiz hediye linki'::TEXT, ''::TEXT, NULL::UUID;
        RETURN;
    END IF;
    
    -- Check if article matches
    IF v_gift.article_id != p_article_id THEN
        RETURN QUERY SELECT FALSE, 'Bu hediye linki başka bir makale için'::TEXT, ''::TEXT, NULL::UUID;
        RETURN;
    END IF;
    
    -- Check expiration
    IF NOW() > v_gift.expires_at THEN
        RETURN QUERY SELECT FALSE, 'Hediye linkinin süresi dolmuş (7 gün geçerlidir)'::TEXT, ''::TEXT, NULL::UUID;
        RETURN;
    END IF;
    
    -- Check if already redeemed
    IF v_gift.read_at IS NOT NULL THEN
        RETURN QUERY SELECT FALSE, 'Bu hediye linki daha önce kullanılmış'::TEXT, ''::TEXT, NULL::UUID;
        RETURN;
    END IF;
    
    -- Get sender name
    SELECT COALESCE(p.full_name, p.email, 'Bir arkadaşın')
    INTO v_sender_name
    FROM public.profiles p
    WHERE p.id = v_gift.from_user_id;
    
    -- Mark as redeemed atomically
    UPDATE public.article_gifts
    SET 
        read_at = NOW(),
        redeemed_by_user_id = p_redeemed_by_user_id,
        redeemed_at_ip = p_redeemed_at_ip,
        redeemed_user_agent = p_redeemed_user_agent,
        redemption_metadata = p_redemption_metadata
    WHERE id = v_gift.id;
    
    RETURN QUERY SELECT TRUE, NULL::TEXT, v_sender_name, v_gift.id;
EXCEPTION
    WHEN lock_not_available THEN
        -- Someone else is redeeming this gift right now
        RETURN QUERY SELECT FALSE, 'Bu hediye şu anda kullanılıyor, lütfen birkaç saniye bekleyin'::TEXT, ''::TEXT, NULL::UUID;
    WHEN OTHERS THEN
        -- Generic error
        RETURN QUERY SELECT FALSE, 'Bir hata oluştu, lütfen tekrar deneyin'::TEXT, ''::TEXT, NULL::UUID;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users (they'll call via API)
-- Note: The function is SECURITY DEFINER, so it runs with creator's privileges
-- This allows the service role to execute it via API
GRANT EXECUTE ON FUNCTION public.redeem_gift_token TO service_role;

-- Create view for gift analytics (optional, for future admin dashboard)
CREATE OR REPLACE VIEW public.gift_analytics AS
SELECT 
    from_user_id,
    COUNT(*) as total_gifts_sent,
    COUNT(CASE WHEN read_at IS NOT NULL THEN 1 END) as total_redeemed,
    COUNT(CASE WHEN read_at IS NULL AND expires_at > NOW() THEN 1 END) as total_pending,
    COUNT(CASE WHEN read_at IS NULL AND expires_at <= NOW() THEN 1 END) as total_expired,
    MAX(created_at) as last_gift_sent,
    AVG(EXTRACT(EPOCH FROM (read_at - created_at))/3600) as avg_hours_to_redemption
FROM public.article_gifts
GROUP BY from_user_id;

COMMENT ON VIEW public.gift_analytics IS 'Analytics view for gift system (for admin dashboard)';
