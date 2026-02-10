"use client";

import { useState } from "react";
import { useAuth } from "@/components/providers/auth-provider";
import { Button } from "@/components/ui/button";
import { SmartButton } from "@/components/ui/smart-button";
import { PaywallModal } from "@/components/premium/PaywallModal";
import { cn } from "@/lib/utils";
import { colors, typography, componentPadding, borderRadius, marginBottom } from "@/lib/design-tokens";
import Link from "next/link";
import { Crown } from "lucide-react";
import ScrolliPremiumBanner from "@/components/sections/home/ScrolliPremiumBanner";

interface PremiumGateProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  showUpgradeButton?: boolean;
}

export function PremiumGate({ children, fallback, showUpgradeButton = true }: PremiumGateProps) {
  const { user, isPremium, loading } = useAuth();
  const [showPaywall, setShowPaywall] = useState(false);

  // Show loading state
  if (loading) {
    return (
      <div className={cn("flex items-center justify-center p-8", colors.background.base)}>
        <p className={cn(typography.text.body, colors.foreground.secondary)}>Loading...</p>
      </div>
    );
  }

  // Not authenticated
  if (!user) {
    return (
      fallback || (
        <div
          className={cn(
            "flex flex-col items-center justify-center p-8 text-center",
            colors.background.elevated,
            borderRadius.lg,
            componentPadding.lg
          )}
        >
          <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center mb-4">
            <Crown className="h-8 w-8 text-white" />
          </div>
          <h3 className={cn(typography.heading.h3, marginBottom.sm, colors.foreground.primary)}>
            Premium Content
          </h3>
          <p className={cn(typography.text.body, marginBottom.md, colors.foreground.secondary)}>
            Please sign in to access premium content.
          </p>
          {showUpgradeButton && (
            <div className="flex gap-4">
              <Button asChild variant="default">
                <Link href="/sign-in">Sign In</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/pricing">View Pricing</Link>
              </Button>
            </div>
          )}
        </div>
      )
    );
  }

  // Not premium
  if (!isPremium) {
    return (
      <>
        {fallback || (
          <ScrolliPremiumBanner variant="simple" />
        )}
        <PaywallModal
          isOpen={showPaywall}
          onClose={() => setShowPaywall(false)}
        />
      </>
    );
  }

  // Premium user - show content
  return <>{children}</>;
}
