"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { SmartButton } from "@/components/ui/smart-button";
import { CheckCheck, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { typography, colors } from "@/lib/design-tokens";
import { useAuth } from "@/components/providers/auth-provider";
import { useRevenueCat } from "@/components/providers/revenuecat-provider";
import { getOfferings, purchasePackage } from "@/lib/revenuecat/client";
import Link from "next/link";

interface PaywallModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    description?: string;
}

export function PaywallModal({
    isOpen,
    onClose,
    title = "Unlock Premium Content",
    description = "Subscribe to access exclusive stories, AI podcasts, and more.",
}: PaywallModalProps) {
    const { user } = useAuth();
    const { isInitialized, refreshCustomerInfo } = useRevenueCat();
    const [offerings, setOfferings] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [purchasing, setPurchasing] = useState(false);

    // Fetch offerings when modal opens
    useState(() => {
        if (isOpen && isInitialized && !offerings) {
            setLoading(true);
            getOfferings()
                .then(setOfferings)
                .catch((err) => console.error("Failed to fetch offerings:", err))
                .finally(() => setLoading(false));
        }
    });

    const handlePurchase = async (packageToPurchase: any) => {
        if (!user) {
            window.location.href = "/subscribe";
            return;
        }

        try {
            setPurchasing(true);
            await purchasePackage(packageToPurchase, user.email || undefined);
            await refreshCustomerInfo();
            onClose();
            alert("Purchase successful! Your premium access is now active.");
        } catch (err: any) {
            console.error("Purchase failed:", err);
            if (!err.userCancelled) {
                alert("Purchase failed. Please try again.");
            }
        } finally {
            setPurchasing(false);
        }
    };

    const benefits = [
        "Unlimited access to all premium articles",
        "Weekly Deep Insights newsletter",
        "Alara AI Podcast episodes",
        "Ad-free reading experience",
        "Exclusive event invitations",
        "Priority customer support",
    ];

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle className={cn(typography.h3, colors.foreground.primary)}>
                        {title}
                    </DialogTitle>
                    <DialogDescription className={cn(typography.body, colors.foreground.secondary)}>
                        {description}
                    </DialogDescription>
                </DialogHeader>

                <div className={cn("space-y-6 py-4")}>
                    {/* Benefits */}
                    <div>
                        <h4 className={cn(typography.h6, colors.foreground.primary, "mb-3")}>
                            What you'll get:
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {benefits.map((benefit, index) => (
                                <div key={index} className="flex items-start gap-2">
                                    <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <CheckCheck className="h-3 w-3 text-white" />
                                    </div>
                                    <span className={cn(typography.bodySmall, colors.foreground.secondary)}>
                                        {benefit}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Pricing Options */}
                    {loading ? (
                        <div className="text-center py-8">
                            <Loader2 className="h-8 w-8 animate-spin mx-auto text-gray-400" />
                            <p className={cn(typography.bodySmall, colors.foreground.muted, "mt-2")}>
                                Loading pricing...
                            </p>
                        </div>
                    ) : offerings?.current ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {offerings.current.availablePackages?.slice(0, 2).map((pkg: any) => (
                                <div
                                    key={pkg.identifier}
                                    className="border border-gray-200 dark:border-gray-800 rounded-lg p-4"
                                >
                                    <div className="text-center mb-4">
                                        <h5 className={cn(typography.h6, colors.foreground.primary)}>
                                            {pkg.product.title}
                                        </h5>
                                        <div className="flex items-baseline justify-center gap-1 mt-2">
                                            <span className={cn(typography.h4, colors.foreground.primary)}>
                                                {pkg.product.priceString}
                                            </span>
                                            <span className={cn(typography.bodySmall, colors.foreground.muted)}>
                                                /{pkg.packageType === "MONTHLY" ? "month" : "year"}
                                            </span>
                                        </div>
                                    </div>
                                    <SmartButton
                                        onClick={() => handlePurchase(pkg)}
                                        disabled={purchasing}
                                        className="w-full"
                                        size="sm"
                                    >
                                        {purchasing ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Processing...
                                            </>
                                        ) : (
                                            "Subscribe"
                                        )}
                                    </SmartButton>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-4">
                            <p className={cn(typography.body, colors.foreground.muted)}>
                                Unable to load pricing. Please{" "}
                                <Link href="/pricing" className="text-green-600 hover:text-green-700 font-medium">
                                    visit our pricing page
                                </Link>
                                .
                            </p>
                        </div>
                    )}

                    {/* Footer */}
                    {!user && (
                        <div className="text-center pt-4 border-t border-gray-200 dark:border-gray-800">
                            <p className={cn(typography.bodySmall, colors.foreground.muted)}>
                                Already have an account?{" "}
                                <Link href="/sign-in" className="text-green-600 hover:text-green-700 font-medium">
                                    Sign in
                                </Link>
                            </p>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
