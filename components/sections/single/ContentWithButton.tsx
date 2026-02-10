'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import FollowButton from '@/components/ui/follow-button';
import ScrolliPremiumBanner from '@/components/sections/home/ScrolliPremiumBanner';
import ArticleNewsletterBanner from './ArticleNewsletterBanner';
import { useAuth } from '@/components/providers/auth-provider';
import { createClient } from '@/lib/supabase/client';
import { cn } from '@/lib/utils';

interface ContentWithButtonProps {
  content: string;
  className?: string;
  isPaywalled?: boolean;
  articleId?: string;
}

export default function ContentWithButton({ content, className, isPaywalled = false, articleId }: ContentWithButtonProps) {
  const [splitContent, setSplitContent] = useState<{ firstHalf: string; secondHalf: string } | null>(null);
  const [isProcessing, setIsProcessing] = useState(true);
  const [showPremiumBanner, setShowPremiumBanner] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  const [shouldShowPaywall, setShouldShowPaywall] = useState(false);
  const [hasRedeemedGift, setHasRedeemedGift] = useState(false);
  const { isPremium, user } = useAuth();
  const supabase = createClient();
  const searchParams = useSearchParams();
  const redeemed = searchParams?.get("redeemed") === "true";

  useEffect(() => {
    if (!content || typeof content !== 'string' || content.trim().length === 0) {
      setSplitContent({ firstHalf: '', secondHalf: '' });
      setIsProcessing(false);
      return;
    }

    setIsProcessing(true);

    if (isPaywalled) {
      setSplitContent({ firstHalf: content, secondHalf: '' });
      setIsProcessing(false);
      return;
    }

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = content;
    const children = Array.from(tempDiv.children);

    if (children.length < 4) {
      setSplitContent({ firstHalf: content, secondHalf: '' });
      setIsProcessing(false);
      return;
    }

    const thirtyPercentIndex = Math.ceil(children.length * 0.3);
    const firstHalfDiv = document.createElement('div');
    const secondHalfDiv = document.createElement('div');

    children.forEach((child, index) => {
      if (index < thirtyPercentIndex) {
        firstHalfDiv.appendChild(child.cloneNode(true));
      } else {
        secondHalfDiv.appendChild(child.cloneNode(true));
      }
    });

    setSplitContent({
      firstHalf: firstHalfDiv.innerHTML,
      secondHalf: secondHalfDiv.innerHTML,
    });
    setIsProcessing(false);
  }, [content, isPaywalled]);

  useEffect(() => {
    async function checkPaywallStatus() {
      // Check if article was accessed via redeemed gift (check localStorage first)
      if (articleId) {
        try {
          // Check localStorage first (set when gift is redeemed)
          const redeemedGifts = JSON.parse(localStorage.getItem("redeemedGifts") || "[]");
          if (redeemedGifts.includes(articleId)) {
            setHasRedeemedGift(true);
            setShouldShowPaywall(false);
            return;
          }

          // If redeemed=true in URL, also check database for recently redeemed gifts
          if (redeemed) {
            const { data: redeemedGift } = await supabase
              .from("article_gifts")
              .select("id")
              .eq("article_id", articleId)
              .not("read_at", "is", null)
              .gte("read_at", new Date(Date.now() - 5 * 60 * 1000).toISOString()) // Last 5 minutes
              .limit(1)
              .maybeSingle();

            if (redeemedGift) {
              // Store in localStorage for future visits
              const currentGifts = JSON.parse(localStorage.getItem("redeemedGifts") || "[]");
              if (!currentGifts.includes(articleId)) {
                localStorage.setItem("redeemedGifts", JSON.stringify([...currentGifts, articleId]));
              }
              setHasRedeemedGift(true);
              setShouldShowPaywall(false);
              return;
            }
          }
        } catch (err) {
          console.error("Error checking redeemed gift:", err);
        }
      }

      if (isPremium) {
        setShouldShowPaywall(false);
        return;
      }
      if (!user) {
        setShouldShowPaywall(true);
        return;
      }
      try {
        if (isPaywalled) {
          setShouldShowPaywall(true);
          return;
        }
        const { data: profile } = await supabase
          .from("profiles")
          .select("is_premium, articles_read_count, usage_limit")
          .eq("id", user.id)
          .single();

        const articlesRead = profile?.articles_read_count ?? 0;
        const usageLimit = profile?.usage_limit ?? 2;
        setShouldShowPaywall(articlesRead >= usageLimit);
      } catch (err) {
        setShouldShowPaywall(false);
      }
    }
    checkPaywallStatus();
  }, [user, isPremium, supabase, isPaywalled, redeemed, articleId]);

  if (isProcessing) return null;

  // Normalize content to a string before doing any string operations
  const normalizedContent =
    typeof content === "string"
      ? content
      : content == null
      ? ""
      : String(content);

  if (!normalizedContent || normalizedContent.trim().length === 0) {
    return (
      <div className="text-center py-12 text-gray-500 dark:text-gray-400">
        <p className="text-lg mb-2">İçerik henüz yüklenemedi.</p>
        <p className="text-sm">Lütfen sayfayı yenileyin veya daha sonra tekrar deneyin.</p>
      </div>
    );
  }

  return (
    <div className={cn(className || "entry-main-content dropcap article-content", "relative")}>
      {/* Visible content section */}
      <div dangerouslySetInnerHTML={{ __html: splitContent?.firstHalf || normalizedContent }} />

      {/* Paywall Banner - Renders immediately at the end of content if paywalled */}
      {shouldShowPaywall ? (
        <div className="relative mt-8" style={{ width: '100vw', marginLeft: 'calc(-50vw + 50%)', marginRight: 'calc(-50vw + 50%)' }}>
          {/* Top gradient for seamless transition - Covers the end of firstHalf */}
          <div className="absolute -top-[320px] left-0 right-0 h-[320px] bg-gradient-to-t from-background via-background/95 via-background/40 to-transparent z-10 pointer-events-none" />

          <div className="w-full bg-background border-t border-border/30 relative z-20 flex flex-col items-center justify-center">
            <ScrolliPremiumBanner containerSize="full" variant="simple" />
            <ArticleNewsletterBanner />
          </div>
        </div>
      ) : (
        /* Only render the second half if NOT paywalled */
        splitContent?.secondHalf && (
          <div dangerouslySetInnerHTML={{ __html: splitContent.secondHalf }} />
        )
      )}
    </div>
  );
}
