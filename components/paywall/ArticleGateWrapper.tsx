"use client";

import { useEffect, useState, useCallback, Suspense } from "react";
import { useAuth } from "@/components/providers/auth-provider";
import { createClient } from "@/lib/supabase/client";
import { useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
// import { colors } from "@/lib/design-tokens"; // unused
// import ScrolliPremiumBanner from "@/components/sections/home/ScrolliPremiumBanner"; // unused
import { CheckCircle2, Gift } from "lucide-react";
import { Text } from "@/components/ui/typography";
import { useDictionary } from "@/components/providers/dictionary-provider";

interface ArticleGateWrapperProps {
    articleId: string;
    children: React.ReactNode;
}

interface SubscriptionStatus {
    isAuthenticated: boolean;
    isPremium: boolean;
    articlesRead: number;
    usageLimit: number;
    canReadMore: boolean;
}

/**
 * ArticleGateWrapper - Client-side wrapper that handles paywall logic
 * Wraps article content and shows gates based on user's subscription status.
 */
function ArticleGateWrapperInner({ articleId, children }: ArticleGateWrapperProps) {
    const dictionary = useDictionary();
    const { user, isLoading: authLoading } = useAuth();
    const searchParams = useSearchParams();
    const giftToken = searchParams?.get("gift");
    const [status, setStatus] = useState<SubscriptionStatus | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    // Track which articles have been marked as read (keyed by articleId)
    const [markedArticles, setMarkedArticles] = useState<Set<string>>(new Set());
    const hasMarkedRead = markedArticles.has(articleId);
    const [giftValid, setGiftValid] = useState<boolean | null>(null);
    const [senderName, setSenderName] = useState<string | null>(null);
    const [showGiftBanner, setShowGiftBanner] = useState(false);
    // const [giftRedeemed, setGiftRedeemed] = useState(false); // unused
    // const [showPaywall, setShowPaywall] = useState(false); // unused here, visual logic moved to ContentWithButton
    // const [scrollProgress, setScrollProgress] = useState(0); // unused
    const supabase = createClient();

    // Check gift token validity and redeem
    // Check gift token validity and redeem
    useEffect(() => {
        async function validateAndRedeemGiftToken() {
            if (!giftToken) {
                setGiftValid(false);
                return;
            }

            try {
                // Determine if we should attempt redemption or just validation
                // Currently API does both (one-time use)

                const redeemResponse = await fetch("/api/redeem-gift", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        giftToken,
                        articleId,
                    }),
                });

                if (redeemResponse.ok) {
                    const data = await redeemResponse.json();
                    setGiftValid(true);

                    if (data.senderName) {
                        setSenderName(data.senderName);
                        setShowGiftBanner(true);
                        setTimeout(() => setShowGiftBanner(false), 5000);
                    }

                    console.log("✅ Gift redeemed successfully");
                } else {
                    const errorData = await redeemResponse.json();
                    console.error("Error redeeming gift:", errorData);
                    // 410 means already used or expired, show invalid
                    // 404 means invalid token
                    setGiftValid(false);
                }
            } catch (err) {
                console.error("Error validating gift token:", err);
                setGiftValid(false);
            }
        }

        validateAndRedeemGiftToken();
    }, [giftToken, articleId]);

    // Fetch subscription status with monthly reset logic
    useEffect(() => {
        async function fetchStatus() {
            if (authLoading) return;

            if (!user) {
                setStatus({
                    isAuthenticated: false,
                    isPremium: false,
                    articlesRead: 0,
                    usageLimit: 2,
                    canReadMore: false,
                });
                setIsLoading(false);
                return;
            }

            try {
                const { data: profile, error: fetchError } = await supabase
                    .from("profiles")
                    .select("is_premium, articles_read_count, usage_limit, last_reset_date, current_period_start")
                    .eq("id", user.id)
                    .maybeSingle();

                if (fetchError) {
                    console.error(`❌ Error fetching profile [${fetchError.code}]:`, fetchError.message);
                }

                const isPremium = profile?.is_premium ?? false;
                let articlesRead = profile?.articles_read_count != null ? profile.articles_read_count : 0;
                const usageLimit = profile?.usage_limit != null ? profile.usage_limit : 2;

                const lastResetDate = profile?.last_reset_date || profile?.current_period_start;

                // Check for monthly reset
                const currentMonthStart = new Date();
                currentMonthStart.setDate(1);
                currentMonthStart.setHours(0, 0, 0, 0);

                if (lastResetDate) {
                    const lastReset = new Date(lastResetDate);
                    lastReset.setHours(0, 0, 0, 0);

                    if (lastReset < currentMonthStart) {
                        const resetData: any = {
                            articles_read_count: 0,
                            last_reset_date: currentMonthStart.toISOString(),
                            current_period_start: currentMonthStart.toISOString().split('T')[0],
                            updated_at: new Date().toISOString(),
                        };

                        const { error: resetError } = await supabase
                            .from("profiles")
                            .update(resetData)
                            .eq("id", user.id);

                        if (!resetError) {
                            articlesRead = 0;
                        }
                    }
                }

                const canReadMore = isPremium || articlesRead < usageLimit;

                setStatus({
                    isAuthenticated: true,
                    isPremium,
                    articlesRead,
                    usageLimit,
                    canReadMore,
                });
            } catch (err) {
                console.error("Error fetching subscription status:", err);
                setStatus({
                    isAuthenticated: true,
                    isPremium: false,
                    articlesRead: 0,
                    usageLimit: 2,
                    canReadMore: true,
                });
            } finally {
                setIsLoading(false);
            }
        }

        fetchStatus();
    }, [user, authLoading, supabase]);

    // Mark article as read when user can access it (every read counts; 2 free reads total)
    // Never increment when access is via valid gift – gift path does not consume quota
    useEffect(() => {
        async function markAsRead() {
            if (!user || !status || hasMarkedRead || status.isPremium) {
                return;
            }
            if (giftToken && giftValid === true) {
                return;
            }

            try {
                const newCount = status.articlesRead + 1;

                const { error, data } = await supabase
                    .from("profiles")
                    .update({
                        articles_read_count: newCount,
                        updated_at: new Date().toISOString(),
                    })
                    .eq("id", user.id)
                    .select('articles_read_count, usage_limit, is_premium');

                if (!error && data && data.length > 0) {
                    const actualCount = data[0]?.articles_read_count ?? newCount;
                    setMarkedArticles(prev => new Set(prev).add(articleId));
                    const newCanReadMore = status.isPremium || actualCount < status.usageLimit;

                    setStatus((prev) =>
                        prev
                            ? {
                                ...prev,
                                articlesRead: actualCount,
                                canReadMore: newCanReadMore,
                            }
                            : prev
                    );
                }
            } catch (err) {
                console.error("Error marking article as read:", err);
            }
        }

        if (user && status && !hasMarkedRead) {
            markAsRead();
        }
    }, [user, status, hasMarkedRead, articleId, supabase, giftToken, giftValid]);

    if (isLoading || authLoading || (giftToken && giftValid === null)) {
        return <>{children}</>;
    }

    // Gift token access - allow anonymous access
    if (giftToken && giftValid) {
        return (
            <>
                {showGiftBanner && (
                    <div className="fixed top-0 left-0 right-0 z-50 animate-in slide-in-from-top duration-500">
                        <div className={cn(
                            "px-4 py-3 shadow-lg flex items-center justify-center gap-3",
                            "bg-gray-900 dark:bg-gray-900",
                            "border-b border-gray-800 dark:border-gray-700",
                            "text-white"
                        )}>
                            <Gift className="h-5 w-5 text-green-400" />
                            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-center sm:text-left">
                                <span className="font-semibold text-sm sm:text-base text-white">
                                    {dictionary.gift.received.replace("{senderName}", senderName || "")}
                                </span>
                                <span className="text-xs sm:text-sm text-gray-400 hidden sm:inline">•</span>
                                <span className="text-xs sm:text-sm text-gray-400">
                                    {dictionary.gift.enjoy}
                                </span>
                            </div>
                            <button
                                onClick={() => setShowGiftBanner(false)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-white/10 rounded-full transition-colors"
                            >
                                <CheckCircle2 className="h-5 w-5 text-gray-400 hover:text-white" />
                            </button>
                        </div>
                    </div>
                )}
                {children}
            </>
        );
    }

    // Invalid/expired gift token
    if (giftToken && giftValid === false) {
        return (
            <>
                <div className={cn(
                    "mb-4 p-4 rounded-lg",
                    "bg-red-50 dark:bg-red-900/20",
                    "border border-red-200 dark:border-red-800",
                    "text-center"
                )}>
                    <Text variant="body" className="text-red-800 dark:text-red-300">
                        {dictionary.gift.invalid}
                    </Text>
                </div>
                {children}
            </>
        );
    }

    // Paywall logic now handled entirely by ContentWithButton logic + state passed down
    // This wrapper largely acts as a side-effect handler (marking articles read)
    // and passing through content. The blocking layer happens in ContentWithButton 
    // which checks auth state independently/redundantly or relies on this wrapper implicitly allowing render.
    // Since we ALWAYS render children here regardless of limit status, the Child (ContentWithButton)
    // takes responsibility for truncating.
    return <>{children}</>;
}

/**
 * ArticleGateWrapper - Wrapper with Suspense for useSearchParams
 */
export function ArticleGateWrapper({ articleId, children }: ArticleGateWrapperProps) {
    return (
        <Suspense fallback={<>{children}</>}>
            <ArticleGateWrapperInner articleId={articleId}>
                {children}
            </ArticleGateWrapperInner>
        </Suspense>
    );
}

/**
 * NavbarUsageMeter - Export for use in the navbar
 * DISABLED: Component removed per user request
 */
export function NavbarUsageMeter() {
    // Component disabled - always return null
    return null;
}
