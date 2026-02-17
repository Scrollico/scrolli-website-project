"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/auth-provider";
import { useRevenueCat } from "@/components/providers/revenuecat-provider";
import { getOfferings, purchasePackage } from "@/lib/revenuecat/client";
import { cn } from "@/lib/utils";
import {
    badge as badgeTokens,
    colors,
    fontSize,
    typography,
} from "@/lib/design-tokens";
import { Loader2, X } from "lucide-react";
import { useDictionary } from "@/components/providers/dictionary-provider";

interface PaywallSlideUpProps {
    onClose?: () => void;
    articlesRead?: number;
    limit?: number;
}

/**
 * PaywallSlideUp - Hard paywall when user hits article limit
 * Modern "bottom sheet" design with RevenueCat integration.
 */
export function PaywallSlideUp({
    onClose,
    articlesRead = 3,
    limit = 3
}: PaywallSlideUpProps) {
    const dictionary = useDictionary();
    const router = useRouter();
    const { user } = useAuth();
    const { isInitialized, refreshCustomerInfo } = useRevenueCat();
    const [selectedPlan, setSelectedPlan] = useState<0 | 1 | 2>(0); // 0=monthly, 1=yearly, 2=lifetime
    const [offerings, setOfferings] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [purchasing, setPurchasing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [purchaseError, setPurchaseError] = useState<string | null>(null);

    // Fetch RevenueCat offerings
    useEffect(() => {
        async function fetchOfferings() {
            if (!isInitialized) return;

            try {
                const data = await getOfferings();
                if (data?.current) {
                    setOfferings(data);
                } else {
                    setError("No pricing available. Please try again later.");
                }
            } catch (err) {
                console.error("Failed to fetch offerings:", err);
                setError("Failed to load pricing. Please refresh.");
            } finally {
                setLoading(false);
            }
        }

        fetchOfferings();
    }, [isInitialized]);

    const handleSubscribe = async () => {
        if (!offerings?.current || purchasing) return;

        // CRITICAL: Ensure user is authenticated and RevenueCat is configured
        if (!user) {
            setPurchaseError(dictionary.paywall.loginRequired);
            router.push("/sign-in?next=" + encodeURIComponent(window.location.pathname));
            return;
        }

        if (!isInitialized) {
            setPurchaseError(dictionary.paywall.preparingPayment);
            return;
        }

        setPurchasing(true);
        setPurchaseError(null);

        try {
            // Get the selected package from offerings
            const packages = offerings.current.availablePackages || [];
            const packageTypes = ["MONTHLY", "ANNUAL", "LIFETIME"];
            const selectedPackageType = packageTypes[selectedPlan];

            const selectedPackage = packages.find(
                (pkg: any) => pkg.packageType === selectedPackageType
            );

            if (!selectedPackage) {
                throw new Error(`Package ${selectedPackageType} not found`);
            }

            console.log("🛒 Purchasing package:", {
                identifier: selectedPackage.identifier,
                type: selectedPackage.packageType,
                userId: user.id.substring(0, 8) + "...",
            });

            // Purchase the package directly via RevenueCat
            const customerInfo = await purchasePackage(selectedPackage, user.email || undefined);

            console.log("✅ Purchase successful:", customerInfo);

            // Refresh customer info in the provider
            if (refreshCustomerInfo) {
                await refreshCustomerInfo();
            }

            // Close the modal and reload to show premium content
            onClose?.();

            // Reload the page to refresh subscription status
            window.location.reload();
        } catch (err: any) {
            console.error("❌ Purchase failed:", err);

            // Handle user cancellation gracefully
            if (err?.userCancelled || err?.message?.includes("cancelled")) {
                setPurchaseError(dictionary.paywall.purchaseCancelled);
            } else {
                setPurchaseError(
                    err?.message ||
                    dictionary.paywall.purchaseError
                );
            }
        } finally {
            setPurchasing(false);
        }
    };

    // Get pricing from RevenueCat packages
    const getPackagePrice = (packageType: string) => {
        if (!offerings?.current) return "...";
        const packages = offerings.current.availablePackages || [];
        const pkg = packages.find((p: any) => p.packageType === packageType);
        if (!pkg) return "N/A";

        const product = pkg.webBillingProduct || pkg.product;
        if (!product) return "N/A";

        // Extract formatted price - try multiple formats
        // Priority: currentPrice.formattedPrice > priceString.formattedPrice > price.formattedPrice

        if (product.currentPrice?.formattedPrice) {
            return product.currentPrice.formattedPrice;
        }

        if (product.priceString) {
            if (typeof product.priceString === 'string') return product.priceString;
            if (product.priceString.formattedPrice) return product.priceString.formattedPrice;
        }

        if (product.price?.formattedPrice) return product.price.formattedPrice;

        // Fallback: try to format from amount
        if (product.currentPrice?.amount) {
            const amount = product.currentPrice.amount / 100;
            const currency = product.currentPrice.currency || "USD";
            return `${currency}${amount.toFixed(2)}`;
        }

        return "N/A";
    };

    const monthlyPrice = getPackagePrice("MONTHLY");
    const yearlyPrice = getPackagePrice("ANNUAL");
    const lifetimePrice = getPackagePrice("LIFETIME");

    return (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div
                className={cn(
                    "w-full max-w-lg rounded-t-2xl p-6 shadow-2xl animate-in slide-in-from-bottom duration-500",
                    colors.background.base
                )}
            >
                {/* Header */}
                <div className="mb-6 text-center relative">
                    {onClose && (
                        <button
                            onClick={onClose}
                            disabled={purchasing}
                            className={cn(
                                "absolute top-0 right-0 p-2 rounded-full",
                                "hover:bg-gray-100 dark:hover:bg-gray-800",
                                "transition-colors",
                                "disabled:opacity-50 disabled:cursor-not-allowed"
                            )}
                            aria-label="Close"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    )}
                    <div className="mx-auto mb-3 w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                        <svg
                            className="w-6 h-6 text-green-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                            />
                        </svg>
                    </div>
                    <h2 className={cn(typography.h3, colors.foreground.primary)}>
                        {dictionary.paywall.unlockUnlimited}
                    </h2>
                    <p className={cn(typography.bodySmall, colors.foreground.muted, "mt-2")}>
                        {dictionary.paywall.limitReached.replace("{articlesRead}", articlesRead.toString())}
                    </p>
                </div>

                {/* Plan Cards */}
                {loading ? (
                    <div className="flex justify-center items-center py-8">
                        <Loader2 className="h-6 w-6 animate-spin text-green-600" />
                        <span className="ml-2 text-sm text-gray-500">Loading pricing...</span>
                    </div>
                ) : error ? (
                    <div className="text-center py-4 text-red-500 text-sm">
                        {error}
                    </div>
                ) : (
                    <div className="space-y-3 mb-6">
                        {/* Monthly Plan */}
                        <button
                            type="button"
                            onClick={() => setSelectedPlan(0)}
                            disabled={purchasing}
                            className={cn(
                                "w-full p-4 rounded-xl flex justify-between items-center transition-all",
                                "border-2",
                                selectedPlan === 0
                                    ? "border-green-600 bg-green-50 dark:bg-green-900/20"
                                    : cn("border-gray-200 dark:border-gray-600", colors.background.base, "hover:border-gray-400 dark:hover:border-gray-500")
                            )}
                        >
                            <div className="flex items-center gap-3">
                                <div
                                    className={cn(
                                        "w-5 h-5 rounded-full border-2 flex items-center justify-center",
                                        selectedPlan === 0
                                            ? "border-green-600 bg-green-600"
                                            : "border-gray-300 dark:border-gray-500"
                                    )}
                                >
                                    {selectedPlan === 0 && (
                                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                            <path
                                                fillRule="evenodd"
                                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    )}
                                </div>
                                <span className={cn("font-semibold", colors.foreground.primary)}>
                                    {dictionary.paywall.monthly}
                                </span>
                            </div>
                            <span className={cn("font-bold", colors.foreground.primary)}>
                                {monthlyPrice}
                            </span>
                        </button>

                        {/* Yearly Plan - Best Value */}
                        <button
                            type="button"
                            onClick={() => setSelectedPlan(1)}
                            disabled={purchasing}
                            className={cn(
                                "w-full p-4 rounded-xl flex justify-between items-center transition-all",
                                "border-2",
                                selectedPlan === 1
                                    ? "border-green-600 bg-green-50 dark:bg-green-900/20"
                                    : cn("border-gray-200 dark:border-gray-600", colors.background.base, "hover:border-gray-400 dark:hover:border-gray-500")
                            )}
                        >
                            <div className="flex items-center gap-3">
                                <div
                                    className={cn(
                                        "w-5 h-5 rounded-full border-2 flex items-center justify-center",
                                        selectedPlan === 1
                                            ? "border-green-600 bg-green-600"
                                            : "border-gray-300 dark:border-gray-500"
                                    )}
                                >
                                    {selectedPlan === 1 && (
                                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                            <path
                                                fillRule="evenodd"
                                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    )}
                                </div>
                                <div className="text-left">
                                    <span className={cn("font-semibold", colors.foreground.primary)}>
                                        {dictionary.paywall.yearly}
                                    </span>
                                    <span className={cn("ml-2", badgeTokens.padding, fontSize.xs, "font-medium bg-green-600 text-white rounded-full")}>
                                        {dictionary.paywall.mostPopular}
                                    </span>
                                </div>
                            </div>
                            <span className={cn("font-bold", colors.foreground.primary)}>
                                {yearlyPrice}
                            </span>
                        </button>

                        {/* Lifetime Plan */}
                        <button
                            type="button"
                            onClick={() => setSelectedPlan(2)}
                            disabled={purchasing}
                            className={cn(
                                "w-full p-4 rounded-xl flex justify-between items-center transition-all",
                                "border-2",
                                selectedPlan === 2
                                    ? "border-green-600 bg-green-50 dark:bg-green-900/20"
                                    : cn("border-gray-200 dark:border-gray-600", colors.background.base, "hover:border-gray-400 dark:hover:border-gray-500")
                            )}
                        >
                            <div className="flex items-center gap-3">
                                <div
                                    className={cn(
                                        "w-5 h-5 rounded-full border-2 flex items-center justify-center",
                                        selectedPlan === 2
                                            ? "border-green-600 bg-green-600"
                                            : "border-gray-300 dark:border-gray-500"
                                    )}
                                >
                                    {selectedPlan === 2 && (
                                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                            <path
                                                fillRule="evenodd"
                                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    )}
                                </div>
                                <div className="text-left">
                                    <span className={cn("font-semibold", colors.foreground.primary)}>
                                        {dictionary.paywall.lifetime}
                                    </span>
                                    <span className={cn("ml-2", badgeTokens.padding, fontSize.xs, "font-medium bg-yellow-600 text-white rounded-full")}>
                                        {dictionary.paywall.bestValue}
                                    </span>
                                </div>
                            </div>
                            <span className={cn("font-bold", colors.foreground.primary)}>
                                {lifetimePrice}
                            </span>
                        </button>
                    </div>
                )}

                {/* Purchase Error */}
                {purchaseError && (
                    <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                        <p className={cn("text-sm text-center", colors.error.DEFAULT)}>
                            {purchaseError}
                        </p>
                    </div>
                )}

                {/* CTA Button */}
                <button
                    onClick={handleSubscribe}
                    disabled={loading || !!error || purchasing}
                    className={cn(
                        "w-full py-3 rounded-full font-bold text-white text-center transition-all",
                        "bg-green-600 hover:bg-green-700",
                        "disabled:opacity-50 disabled:cursor-not-allowed",
                        "flex items-center justify-center gap-2"
                    )}
                >
                    {purchasing ? (
                        <>
                            <Loader2 className="h-5 w-5 animate-spin" />
                            <span>{dictionary.common.loading}</span>
                        </>
                    ) : (
                        dictionary.paywall.subscribeNow
                    )}
                </button>

                <p className={cn("mt-3 text-center text-xs", colors.foreground.muted)}>
                    {dictionary.paywall.cancelAnytime}
                </p>

                {/* What you get */}
                <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <p className={cn("text-sm font-medium mb-3", colors.foreground.secondary)}>
                        {dictionary.paywall.benefitsTitle}
                    </p>
                    <ul className="space-y-2">
                        {dictionary.paywall.benefits.map((benefit, i) => (
                            <li key={i} className="flex items-center gap-2 text-sm">
                                <svg className="w-4 h-4 text-green-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                    <path
                                        fillRule="evenodd"
                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                                <span className={colors.foreground.secondary}>{benefit}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}
