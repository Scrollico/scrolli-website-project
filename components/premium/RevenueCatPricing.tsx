"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/auth-provider";
import { useRevenueCat } from "@/components/providers/revenuecat-provider";
import { getOfferings, purchasePackage } from "@/lib/revenuecat/client";
import { SmartButton } from "@/components/ui/smart-button";
import { CheckCheck, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import {
    typography,
    colors,
    gap,
    containerPadding,
    sectionPadding,
} from "@/lib/design-tokens";
import Link from "next/link";
import { TimelineContent } from "@/components/ui/timeline-animation";
import { VerticalCutReveal } from "@/components/ui/vertical-cut-reveal";
import NumberFlow from "@number-flow/react";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import ScrollIndicator from "@/components/ui/scroll-indicator";

const PricingSwitch = ({
    buttons,
    onSwitch,
    selectedIndex,
    className,
}: {
    buttons: string[];
    onSwitch: (index: number) => void;
    selectedIndex: number;
    className?: string;
}) => {
    const [mounted, setMounted] = useState(false);
    const { theme, resolvedTheme } = useTheme();
    const uniqueId = useRef(Math.random().toString(36));

    useEffect(() => {
        setMounted(true);
    }, []);

    const isDark = mounted && (theme === 'dark' || resolvedTheme === 'dark');

    return (
        <div
            className={cn(
                "relative z-10 w-full rounded-full",
                colors.border.DEFAULT,
                "p-1 gap-1.5",
                className,
            )}
        >
            {buttons.map((button, index) => {
                const isSelected = selectedIndex === index;
                return (
                    <button
                        key={index}
                        onClick={() => onSwitch(index)}
                        className={cn(
                            "relative z-10 w-full sm:h-14 h-10 rounded-full sm:px-6 px-3 sm:py-2 py-1 font-medium pricing-switch-button",
                            isSelected
                                ? isDark
                                    ? "text-gray-900 dark:text-gray-900 hover:text-gray-900"
                                    : "text-white dark:text-white hover:text-white"
                                : isDark
                                    ? "text-gray-300 dark:text-gray-300 hover:text-current"
                                    : "text-gray-900 dark:text-gray-300 hover:text-current"
                        )}
                        data-selected={isSelected}
                        style={
                            isSelected
                                ? isDark
                                    ? { color: '#111827', zIndex: 20 }
                                    : { color: '#ffffff', zIndex: 20 }
                                : undefined
                        }
                    >
                        {isSelected && (
                            <motion.span
                                layoutId={`switch-${uniqueId.current}`}
                                className={cn(
                                    "absolute top-0 left-0 sm:h-14 h-10 w-full rounded-full border-4 shadow-sm z-0",
                                    isDark
                                        ? "bg-gradient-to-t from-[#F8F5E4] via-[#F8F5E4] to-[#F8F5E4] border-[#F8F5E4] shadow-[#F8F5E4]/20"
                                        : "bg-gradient-to-t from-[#374152] via-[#374152] to-[#374152] border-[#374152] shadow-[#374152]/30"
                                )}
                                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                            />
                        )}
                        <span
                            className={cn(
                                "relative z-10",
                                isSelected
                                    ? isDark
                                        ? "text-gray-900 dark:text-gray-900"
                                        : "text-white dark:text-white"
                                    : ""
                            )}
                            style={
                                isSelected
                                    ? isDark
                                        ? { color: '#111827' }
                                        : { color: '#ffffff' }
                                    : undefined
                            }
                        >
                            {button}
                        </span>
                    </button>
                );
            })}
        </div>
    );
};

export default function RevenueCatPricing() {
    const router = useRouter();
    const { user } = useAuth();
    const { isInitialized, isLoading: rcLoading, customerInfo, refreshCustomerInfo } = useRevenueCat();
    const [offerings, setOfferings] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [purchasing, setPurchasing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedPlanIndex, setSelectedPlanIndex] = useState(0); // 0=Monthly, 1=Yearly, 2=Lifetime
    const pricingRef = useRef<HTMLDivElement>(null);

    const revealVariants = {
        visible: (i: number) => ({
            y: 0,
            opacity: 1,
            filter: "blur(0px)",
            transition: {
                delay: i * 0.3,
                duration: 0.5,
            },
        }),
        hidden: {
            filter: "blur(10px)",
            y: -20,
            opacity: 0,
        },
    };
    const timelineVaraints = {
        visible: (i: number) => ({
            y: 0,
            opacity: 1,
            filter: "blur(0px)",
            transition: {
                delay: i * 0.1,
                duration: 0.5,
            },
        }),
        hidden: {
            filter: "blur(10px)",
            y: -20,
            opacity: 0,
        },
    };

    useEffect(() => {
        let timeoutId: NodeJS.Timeout | null = null;

        console.log("🔄 RevenueCatPricing useEffect triggered", {
            rcLoading,
            isInitialized,
            user: user?.id ? `logged in (${user.id.substring(0, 8)}...)` : "anonymous"
        });

        async function fetchOfferings() {
            console.log("🔍 fetchOfferings() called", {
                rcLoading,
                isInitialized,
                customerInfo: customerInfo ? "exists" : "null"
            });

            // Wait for RevenueCat to initialize, but with a timeout
            if (rcLoading) {
                console.log("⏳ Waiting for RevenueCat to finish loading...");
                // Set a timeout to show error if initialization takes too long
                timeoutId = setTimeout(() => {
                    if (rcLoading) {
                        setError("RevenueCat initialization is taking too long. Please check your API key configuration and refresh the page.");
                        setLoading(false);
                    }
                }, 10000); // 10 second timeout
                return;
            }

            if (!isInitialized) {
                console.error("❌ RevenueCat is not initialized");
                setError("RevenueCat SDK is not initialized. Please check your NEXT_PUBLIC_REVENUECAT_PUBLIC_KEY configuration in .env.local and refresh the page.");
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError(null);

                console.log("📡 Calling getOfferings()...");
                const data = await getOfferings();

                console.log("=== 🎯 RevenueCat Offerings Debug ===");
                console.log("📦 Full Response:", data);
                console.log("📦 Full Response (JSON):", JSON.stringify(data, null, 2));
                console.log("🔍 Current Offering:", data?.current);
                console.log("🔍 Current Offering Identifier:", data?.current?.identifier);
                console.log("📋 Current Offering Packages:", data?.current?.availablePackages);
                console.log("📋 Package Count:", data?.current?.availablePackages?.length || 0);
                console.log("📚 All Offerings:", data?.all);
                console.log("📚 All Offerings Keys:", Object.keys(data?.all || {}));
                console.log("📚 All Offerings Count:", Object.keys(data?.all || {}).length);

                if (!data?.current && data?.all && Object.keys(data.all).length > 0) {
                    console.warn("⚠️ WARNING: Offerings exist but none are marked as Current!");
                    console.warn("Available offerings:", Object.keys(data.all));
                }

                console.log("====================================");

                if (!data) {
                    setError("No offerings data returned from RevenueCat. Please check your RevenueCat configuration.");
                } else if (!data.current) {
                    const allOfferings = data.all || {};
                    const offeringKeys = Object.keys(allOfferings);

                    console.log("All Offerings:", allOfferings);
                    console.log("Offering Keys:", offeringKeys);

                    if (offeringKeys.length === 0) {
                        setError("No offerings configured in RevenueCat Dashboard. Please create an offering and add packages.");
                    } else {
                        const offeringDetails = offeringKeys.map(key => {
                            const offering = allOfferings[key];
                            return `${key} (${offering?.identifier || 'no identifier'})`;
                        }).join(", ");

                        setError(
                            `Found ${offeringKeys.length} offering(s) but none are marked as "Current". ` +
                            `Please go to RevenueCat Dashboard → Products → Offerings → Select your offering → Mark as Current. ` +
                            `Available offerings: ${offeringDetails}`
                        );
                    }
                } else {
                    const packages = data.current.availablePackages || [];
                    console.log("Current Offering Packages:", packages);
                    console.log("Package Count:", packages.length);

                    if (packages.length === 0) {
                        setError(
                            `Current offering "${data.current.identifier}" has no packages. ` +
                            `Please add packages (Monthly, Yearly, Lifetime) to your offering in RevenueCat Dashboard.`
                        );
                    } else {
                        console.log("✅ Successfully loaded offerings with packages:", packages.length);

                        if (packages.length > 0) {
                            console.log("📦 First Package Structure:", {
                                identifier: packages[0].identifier,
                                packageType: packages[0].packageType,
                                hasProduct: !!packages[0].product,
                                hasWebBillingProduct: !!packages[0].webBillingProduct,
                                webBillingProduct: packages[0].webBillingProduct,
                                product: packages[0].product,
                                fullPackage: packages[0],
                            });
                            console.log("📦 All Packages:", packages.map((p: any) => ({
                                identifier: p.identifier,
                                type: p.packageType,
                                webBillingProduct: p.webBillingProduct,
                                product: p.product
                            })));
                        }

                        setOfferings(data);
                    }
                }
            } catch (err: any) {
                // Log the entire error object to understand its structure
                console.error("❌ Failed to fetch offerings - Full error object:", err);
                console.error("Error type:", typeof err);
                console.error("Error constructor:", err?.constructor?.name);
                console.error("Error details:", {
                    message: err?.message,
                    errorCode: err?.errorCode,
                    underlyingErrorMessage: err?.underlyingErrorMessage,
                    name: err?.name,
                    stack: err?.stack,
                    // Check for common error properties
                    code: err?.code,
                    status: err?.status,
                    statusCode: err?.statusCode,
                    response: err?.response,
                    // Check if it's a string
                    stringValue: typeof err === 'string' ? err : null,
                    // Check all enumerable properties
                    allKeys: err && typeof err === 'object' ? Object.keys(err) : null,
                });

                let errorMessage = "Failed to load pricing. ";

                // Handle string errors
                if (typeof err === 'string') {
                    errorMessage += err;
                }
                // Check for specific error types
                else if (err?.message?.includes("API key") || err?.message?.includes("Web Billing") || err?.errorCode === "CREDENTIALS_ERROR") {
                    errorMessage += "Please check your RevenueCat Web Billing API key configuration. Make sure NEXT_PUBLIC_REVENUECAT_PUBLIC_KEY is set correctly in .env.local";
                } else if (err?.message?.includes("not initialized")) {
                    errorMessage += "RevenueCat SDK is not initialized. Please refresh the page.";
                } else if (err?.underlyingErrorMessage === "Failed to fetch" || err?.errorCode === 10) {
                    // Network error - likely CSP or ad blocker
                    errorMessage += "Network request blocked. This may be caused by: 1) Content Security Policy restrictions, 2) Ad blocker blocking RevenueCat requests, or 3) Browser extension blocking the connection. Please check your browser console and try disabling ad blockers.";
                } else if (err?.underlyingErrorMessage) {
                    // Use underlying error message if available (more specific)
                    errorMessage += err.underlyingErrorMessage;
                } else if (err?.message) {
                    errorMessage += err.message;
                } else if (err?.errorCode) {
                    errorMessage += `Error code: ${err.errorCode}. Please check the browser console for more details.`;
                } else if (err?.code) {
                    errorMessage += `Error code: ${err.code}. Please check the browser console for more details.`;
                } else if (err?.status || err?.statusCode) {
                    errorMessage += `HTTP ${err.status || err.statusCode} error. Please check the browser console for more details.`;
                } else {
                    // Last resort: stringify the error to see what we have
                    try {
                        const errorStr = JSON.stringify(err, Object.getOwnPropertyNames(err));
                        console.error("Error as JSON:", errorStr);
                        if (errorStr && errorStr !== '{}') {
                            errorMessage += `Unexpected error format. Check console for details. Error: ${errorStr.substring(0, 200)}`;
                        } else {
                            errorMessage += "Error performing request. Please check your network connection and try again.";
                        }
                    } catch (stringifyError) {
                        errorMessage += "Error performing request. Please check your network connection and try again.";
                    }
                }

                setError(errorMessage);
            } finally {
                setLoading(false);
            }
        }

        fetchOfferings();

        return () => {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
        };
    }, [isInitialized, rcLoading, customerInfo]);

    const handlePurchase = () => {
        // Map selectedPlanIndex to plan type
        const planTypes = ["monthly", "yearly", "lifetime"];
        const planType = planTypes[selectedPlanIndex];

        // Get return URL from query params or referrer
        const searchParams = new URLSearchParams(window.location.search);
        const returnUrl = searchParams.get("return") ||
            (typeof window !== "undefined" && document.referrer && new URL(document.referrer).pathname.match(/^\/[a-z0-9-]+-\d+$/)
                ? new URL(document.referrer).pathname
                : null);

        // Redirect to subscribe page with plan parameter and return URL
        const subscribeUrl = `/subscribe?plan=${planType}${returnUrl ? `&return=${encodeURIComponent(returnUrl)}` : ""}`;
        router.push(subscribeUrl);
    };

    // Common features for all plans
    const features = [
        "Unlimited Scrolli experience",
        "Weekly Deep Insights newsletter",
        "Exclusive stories for subscribers",
        "Alara AI Podcast",
        "Event participation",
    ];

    // Get selected package and price
    const getSelectedPackage = () => {
        if (!offerings?.current) return null;
        const packages = offerings.current.availablePackages || [];
        // Map selectedPlanIndex to RevenueCat package identifiers
        const packageIdentifiers = ["$rc_monthly", "$rc_annual", "$rc_lifetime"];
        const selectedIdentifier = packageIdentifiers[selectedPlanIndex];
        return packages.find((p: any) => p.identifier === selectedIdentifier);
    };

    const getPrice = () => {
        const pkg = getSelectedPackage();
        if (!pkg) {
            console.warn("No package selected");
            return 0;
        }

        const product = pkg.webBillingProduct || pkg.product;
        if (!product) {
            console.warn("Package has no product:", pkg);
            return 0;
        }

        // Extract price from product - Web Billing format
        // Priority: currentPrice.formattedPrice > priceString.formattedPrice > price.formattedPrice > amount calculations

        // Check for currentPrice (Web Billing format)
        if (product.currentPrice?.formattedPrice) {
            const match = product.currentPrice.formattedPrice.match(/[\d.]+/);
            if (match) {
                return parseFloat(match[0]);
            }
        }

        // Check for priceString.formattedPrice
        if (product.priceString?.formattedPrice) {
            const match = product.priceString.formattedPrice.match(/[\d.]+/);
            if (match) {
                return parseFloat(match[0]);
            }
        }

        // Check for price.formattedPrice
        if (product.price?.formattedPrice) {
            const match = product.price.formattedPrice.match(/[\d.]+/);
            if (match) {
                return parseFloat(match[0]);
            }
        }

        // Fallback: try to extract from amount (cents)
        if (product.currentPrice?.amount) {
            return product.currentPrice.amount / 100;
        }
        if (product.priceString?.amount) {
            return product.priceString.amount / 100;
        }
        if (product.price?.amount) {
            return product.price.amount / 100;
        }

        // Fallback: try amountMicros
        if (product.currentPrice?.amountMicros) {
            return product.currentPrice.amountMicros / 1000000;
        }
        if (product.priceString?.amountMicros) {
            return product.priceString.amountMicros / 1000000;
        }
        if (product.price?.amountMicros) {
            return product.price.amountMicros / 1000000;
        }

        console.warn("Could not extract price from product:", product);
        return 0;
    };

    const getCurrency = () => {
        const pkg = getSelectedPackage();
        if (!pkg) return "USD";

        const product = pkg.webBillingProduct || pkg.product;
        if (!product) return "USD";

        if (product.priceString) {
            if (typeof product.priceString === 'object') {
                return product.priceString.currency || "USD";
            }
            // If priceString is a string, try to extract currency symbol
            if (typeof product.priceString === 'string') {
                const currencyMatch = product.priceString.match(/^[^\d\s]+/);
                if (currencyMatch) {
                    const symbol = currencyMatch[0];
                    // Map common symbols to codes
                    const symbolMap: Record<string, string> = {
                        '$': 'USD',
                        '€': 'EUR',
                        '£': 'GBP',
                        '₺': 'TRY',
                    };
                    return symbolMap[symbol] || symbol;
                }
            }
        }
        if (product.price && typeof product.price === 'object') {
            return product.price.currency || "USD";
        }
        return "USD";
    };

    const getFormattedPrice = () => {
        const pkg = getSelectedPackage();
        if (!pkg) return "N/A";

        const product = pkg.webBillingProduct || pkg.product;
        if (!product) return "N/A";

        // Try to get formatted price directly
        if (product.priceString) {
            if (typeof product.priceString === 'string') {
                return product.priceString; // Already formatted
            } else if (typeof product.priceString === 'object' && product.priceString.formattedPrice) {
                return product.priceString.formattedPrice;
            }
        }
        if (product.price && typeof product.price === 'object' && product.price.formattedPrice) {
            return product.price.formattedPrice;
        }

        // Fallback: format manually
        const price = getPrice();
        const currency = getCurrency();
        if (price > 0) {
            return `${currency}${price.toFixed(2)}`;
        }
        return "N/A";
    };

    const currentPrice = getPrice();
    const currency = getCurrency();
    const formattedPrice = getFormattedPrice();
    const isLifetime = selectedPlanIndex === 2;
    const showYearlyDiscount = selectedPlanIndex === 1;

    // Debug: Log price extraction
    useEffect(() => {
        if (offerings?.current) {
            const pkg = getSelectedPackage();
            console.log("💰 Price Debug:", {
                selectedPlanIndex,
                package: pkg,
                product: pkg ? (pkg.webBillingProduct || pkg.product) : null,
                extractedPrice: currentPrice,
                currency,
                formattedPrice,
            });
        }
    }, [selectedPlanIndex, offerings]);

    if (loading) {
        return (
            <div className={cn("w-full", sectionPadding.lg, containerPadding.md)}>
                <div className="max-w-6xl mx-auto text-center">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto text-gray-400" />
                    <p className={cn(typography.body, colors.foreground.muted, "mt-4")}>
                        Loading pricing...
                    </p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={cn("w-full", sectionPadding.lg, containerPadding.md)}>
                <div className="max-w-6xl mx-auto text-center">
                    <p className={cn(typography.body, "text-red-500 mb-4")}>
                        {error}
                    </p>
                    <p className={cn(typography.bodySmall, colors.foreground.muted)}>
                        Check the browser console for more details. Make sure NEXT_PUBLIC_REVENUECAT_PUBLIC_KEY is set correctly in .env.local
                    </p>
                </div>
            </div>
        );
    }

    if (!offerings?.current) {
        return (
            <div className={cn("w-full", sectionPadding.lg, containerPadding.md)}>
                <div className="max-w-6xl mx-auto text-center">
                    <p className={cn(typography.body, "text-red-500")}>
                        No pricing plans available. Please configure offerings in RevenueCat Dashboard.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className={cn("w-full mx-auto relative", colors.background.base, containerPadding.md, "pt-10 pb-12")} ref={pricingRef}>
            <div className={cn(sectionPadding.lg, containerPadding.md)}>
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className={cn(typography.h1, colors.foreground.primary, "mb-4 leading-[120%]")}>
                        <VerticalCutReveal
                            splitBy="words"
                            staggerDuration={0.15}
                            staggerFrom="first"
                            reverse={true}
                            containerClassName="justify-center"
                            transition={{
                                type: "spring",
                                stiffness: 250,
                                damping: 40,
                                delay: 0.4,
                            }}
                        >
                            Get unlimited access to all Scrolli features
                        </VerticalCutReveal>
                    </h1>
                </div>
            </div>

            {/* Product Features */}
            <div className={containerPadding.md}>
                <div className="max-w-6xl mx-auto">
                    <div className={cn("grid sm:grid-cols-2", gap.xl, "items-start")}>
                        <div>
                            <TimelineContent
                                as="h3"
                                animationNum={2}
                                timelineRef={pricingRef}
                                customVariants={revealVariants}
                                className={cn(typography.h3, colors.foreground.primary, "mb-2")}
                            >
                                What's inside
                            </TimelineContent>

                            <div className={cn("space-y-4")}>
                                {features.map((feature, index) => (
                                    <TimelineContent
                                        key={index}
                                        as="div"
                                        animationNum={3 + index}
                                        timelineRef={pricingRef}
                                        customVariants={timelineVaraints}
                                        className="flex items-center"
                                    >
                                        <div className="w-6 h-6 bg-[#374152] dark:bg-[#374152] shadow-md shadow-[#374152]/50 dark:shadow-[#374152]/50 rounded-full flex items-center justify-center mr-3">
                                            <CheckCheck className="h-4 w-4 text-white" />
                                        </div>
                                        <span className={colors.foreground.secondary}>{feature}</span>
                                    </TimelineContent>
                                ))}
                            </div>
                        </div>

                        <div className={cn("space-y-8 min-h-[400px]")}>
                            <TimelineContent
                                as="div"
                                animationNum={8}
                                timelineRef={pricingRef}
                                customVariants={revealVariants}
                            >
                                <h4 className={cn(typography.h6, colors.foreground.primary, "mb-2")}>
                                    Subscription Period
                                </h4>
                                <p className={cn(typography.bodySmall, colors.foreground.muted, "mb-2")}>
                                    Choose your billing cycle
                                </p>
                                <PricingSwitch
                                    buttons={["Monthly", "Yearly", "Lifetime"]}
                                    onSwitch={setSelectedPlanIndex}
                                    selectedIndex={selectedPlanIndex}
                                    className="grid grid-cols-3 w-full"
                                />
                            </TimelineContent>

                            <TimelineContent
                                as="div"
                                animationNum={10}
                                timelineRef={pricingRef}
                                customVariants={revealVariants}
                                className="grid grid-cols-[1fr_auto] items-center gap-4 min-w-full"
                            >
                                <div className="flex items-center gap-2 min-w-0 overflow-hidden">
                                    {currentPrice > 0 ? (
                                        <>
                                            <span className={cn(typography.h2, colors.foreground.primary, "whitespace-nowrap")}>
                                                {currency}
                                                <NumberFlow
                                                    value={currentPrice}
                                                    className={cn(typography.h2)}
                                                />
                                            </span>
                                            {isLifetime ? (
                                                <span className={cn(typography.bodyLarge, colors.foreground.muted, "whitespace-nowrap")}>
                                                    one-time
                                                </span>
                                            ) : (
                                                <span className={cn(typography.bodyLarge, colors.foreground.muted, "whitespace-nowrap")}>
                                                    /monthly
                                                </span>
                                            )}
                                            {showYearlyDiscount && (
                                                <span className={cn(typography.bodySmall, colors.success.DEFAULT, "font-medium whitespace-nowrap")}>
                                                    (-35%)
                                                </span>
                                            )}
                                        </>
                                    ) : (
                                        <span className={cn(typography.h2, colors.foreground.primary, "whitespace-nowrap")}>
                                            {formattedPrice !== "N/A" ? formattedPrice : "Loading..."}
                                        </span>
                                    )}
                                </div>
                                <div className="flex items-center gap-3 flex-shrink-0">
                                    <SmartButton
                                        onClick={handlePurchase}
                                        size="lg"
                                        width="auto"
                                        className="h-10 sm:h-12 px-6 sm:px-8 text-base sm:text-lg font-semibold whitespace-nowrap"
                                    >
                                        Subscribe
                                    </SmartButton>
                                </div>
                            </TimelineContent>
                        </div>
                    </div>

                    {/* Scroll Indicator */}
                    <div className="flex justify-center pt-0 pb-2 mt-[-40px] relative z-20">
                        <ScrollIndicator />
                    </div>
                </div>
            </div>
        </div>
    );
}
