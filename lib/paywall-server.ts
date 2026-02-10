import { createClient } from "./supabase/server";
import { getSubscriptionStatus } from "./supabase/premium";
import { Article } from "@/types/content";

/**
 * Truncates HTML content to approximately 30% of its length.
 * Splits by block-level closing tags to maintain HTML validity.
 */
export function truncateContent(content: string, percentage: number = 0.3): string {
    if (!content) return "";
    
    // Split by block-level closing tags: </p>, </h2>, </figure>, etc.
    // The regex captures the tags to preserve them during splitting
    const blocks = content.split(/(<\/p>|<\/h[1-6]>|<\/figure>|<\/blockquote>|<\/ul>|<\/ol>|<\/div>)/i);
    
    // blocks array will contain: [content, tag, content, tag, ...]
    const totalBlocks = Math.floor(blocks.length / 2);
    if (totalBlocks <= 1) return content; // Too short to truncate meaningfully
    
    const truncateAtBlock = Math.max(1, Math.ceil(totalBlocks * percentage));
    const truncateIndex = truncateAtBlock * 2; // Each block is 2 elements in the array
    
    return blocks.slice(0, truncateIndex).join("");
}

/**
 * Checks if a gift token is valid for the given article on the server.
 */
async function validateGiftToken(giftToken: string, articleId: string): Promise<boolean> {
    const supabase = await createClient();
    
    const { data: gift, error } = await supabase
        .from("article_gifts")
        .select("id, read_at, expires_at, article_id")
        .eq("gift_token", giftToken)
        .single();

    if (error || !gift) return false;
    if (gift.article_id !== articleId) return false;

    // Check expiration
    const now = new Date();
    const expiresAt = new Date(gift.expires_at);
    if (now > expiresAt) return false;

    // Check if already used
    if (gift.read_at) return false;

    return true;
}

/**
 * Checks if the article has been accessed via a redeemed gift.
 * When redeemed=true is in the URL, check for very recent redemptions (last 5 minutes).
 * This allows anonymous users who just redeemed to access the article.
 */
async function checkRedeemedGiftAccess(articleId: string, isRecentRedemption: boolean = false): Promise<boolean> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    // For recent redemptions (redeemed=true), check very recent (5 minutes)
    // For general access, check last 24 hours
    const timeWindow = isRecentRedemption 
        ? 5 * 60 * 1000  // 5 minutes
        : 24 * 60 * 60 * 1000; // 24 hours
    
    let query = supabase
        .from("article_gifts")
        .select("id, read_at, article_id, redeemed_by_user_id")
        .eq("article_id", articleId)
        .not("read_at", "is", null)
        .gte("read_at", new Date(Date.now() - timeWindow).toISOString())
        .order("read_at", { ascending: false })
        .limit(1);
    
    // If user is logged in, prefer matching by user_id
    if (user?.id) {
        // First try to find by user_id
        const { data: userGift } = await supabase
            .from("article_gifts")
            .select("id")
            .eq("article_id", articleId)
            .eq("redeemed_by_user_id", user.id)
            .not("read_at", "is", null)
            .gte("read_at", new Date(Date.now() - timeWindow).toISOString())
            .limit(1)
            .maybeSingle();
        
        if (userGift) {
            return true;
        }
    }
    
    // For anonymous users or if no user-specific gift found, check any recent redemption
    // This is safe because redeemed=true means they just redeemed
    const { data: redeemedGifts, error } = await query;
    
    if (error) {
        console.error("Error checking redeemed gift:", error);
        return false;
    }
    
    return redeemedGifts && redeemedGifts.length > 0;
}

/**
 * Checks if the current user should be paywalled and returns either the full
 * or truncated article content.
 */
export async function getPaywalledArticle(
    article: Article, 
    giftToken?: string | null,
    redeemed?: boolean
): Promise<{ 
    article: Article; 
    isPaywalled: boolean;
}> {
    // 1. Check if article is even premium
    if (!article.isPremium) {
        return { article, isPaywalled: false };
    }

    // 2. Check for valid gift token
    if (giftToken) {
        const isValidGift = await validateGiftToken(giftToken, article.id);
        if (isValidGift) {
            return { article, isPaywalled: false };
        }
    }

    // 3. Check if article was accessed via a redeemed gift
    if (redeemed) {
        const hasRedeemedGift = await checkRedeemedGiftAccess(article.id, true);
        if (hasRedeemedGift) {
            console.log(`[SSR Paywall] Article accessed via redeemed gift: ${article.id}`);
            return { article, isPaywalled: false };
        }
    }

    // 4. Check subscription status
    const status = await getSubscriptionStatus();
    
    // If premium OR has free reads available, send full content
    if (status.isPremium || status.canReadMore) {
        return { article, isPaywalled: false };
    }

    // 5. User is unauthorized - truncate content for robustness
    console.log(`[SSR Paywall] Truncating content for article: ${article.id}`);
    
    return {
        article: {
            ...article,
            content: truncateContent(article.content || ""),
        },
        isPaywalled: true,
    };
}
