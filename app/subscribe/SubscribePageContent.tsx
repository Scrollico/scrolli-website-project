"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    colors,
    typography,
    sectionPadding,
    containerPadding,
    componentPadding,
    borderRadius,
    elevation,
    gap,
} from "@/lib/design-tokens";
import { Heading, Text } from "@/components/ui/typography";
import { SmartButton } from "@/components/ui/smart-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/components/providers/auth-provider";
import { useRevenueCat } from "@/components/providers/revenuecat-provider";
import { getOfferings, purchasePackage, loginUser } from "@/lib/revenuecat/client";
import { createClient } from "@/lib/supabase/client";
import { Loader2, CheckCircle2, XCircle, Mail, CreditCard, ArrowRight, ArrowLeft, Lock } from "lucide-react";

type PlanType = "monthly" | "yearly" | "lifetime";
type Step = "review" | "email" | "payment" | "success";

const benefits = [
    {
        icon: "📰",
        title: "Unlimited Article Access",
        description: "Read all articles and access the entire archive",
    },
    {
        icon: "🚫",
        title: "Ad-Free Experience",
        description: "Uninterrupted reading without any advertisements",
    },
    {
        icon: "⭐",
        title: "Exclusive Content",
        description: "Access to premium analyses and special stories",
    },
    {
        icon: "🔔",
        title: "Early Access",
        description: "Be the first to read new content",
    },
];

// Email validation function
const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

export function SubscribePageContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { user, profile, updateProfileLocal } = useAuth();
    const { isInitialized, isLoading: rcLoading, refreshCustomerInfo } = useRevenueCat();

    const [offerings, setOfferings] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [purchasing, setPurchasing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    // Multi-step state
    const [currentStep, setCurrentStep] = useState<Step>("review");
    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    // User ID for payment (either from signed-in user or created account)
    const [paymentUserId, setPaymentUserId] = useState<string | null>(null);

    // Track where user came from
    const [returnUrl, setReturnUrl] = useState<string | null>(null);

    // Get plan from URL parameter
    const planParam = searchParams.get("plan");
    const planType: PlanType | null =
        planParam === "monthly" || planParam === "yearly" || planParam === "lifetime"
            ? planParam
            : null;

    // When logged in, always use that account for payment (force user A – no different email)
    useEffect(() => {
        if (user?.email) {
            setEmail(user.email);
        }
    }, [user?.email]);

    // Get return URL from query params or referrer
    useEffect(() => {
        const returnParam = searchParams.get("return");
        if (returnParam) {
            setReturnUrl(returnParam);
        } else if (typeof window !== "undefined" && document.referrer) {
            // Try to extract article URL from referrer
            try {
                const referrerUrl = new URL(document.referrer);
                if (referrerUrl.pathname.startsWith("/article/")) {
                    setReturnUrl(referrerUrl.pathname);
                }
            } catch (e) {
                // Invalid referrer URL, ignore
            }
        }
    }, [searchParams]);

    // Redirect to pricing if no valid plan is selected
    useEffect(() => {
        if (!planType) {
            router.push("/pricing");
        }
    }, [planType, router]);

    // Note: We allow users to proceed to payment step without being authenticated
    // Authentication will happen when they click "Subscribe Now"

    // Fetch offerings
    useEffect(() => {
        async function fetchOfferings() {
            if (rcLoading || !isInitialized) return;

            try {
                setLoading(true);
                const data = await getOfferings();
                setOfferings(data);
            } catch (err: any) {
                console.error("Failed to fetch offerings:", err);
                setError("Failed to load pricing information. Please try again.");
            } finally {
                setLoading(false);
            }
        }

        fetchOfferings();
    }, [isInitialized, rcLoading]);

    // Get the package for the selected plan
    const getSelectedPackage = () => {
        if (!offerings?.current?.availablePackages) return null;

        const packages = offerings.current.availablePackages;
        const packageIdentifiers = ["$rc_monthly", "$rc_annual", "$rc_lifetime"];

        // Map plan type to package identifier
        let identifierIndex = 0;
        if (planType === "yearly") identifierIndex = 1;
        if (planType === "lifetime") identifierIndex = 2;

        const selectedIdentifier = packageIdentifiers[identifierIndex];
        return packages.find((p: any) => p.identifier === selectedIdentifier);
    };

    const selectedPackage = getSelectedPackage();
    const product = selectedPackage?.webBillingProduct || selectedPackage?.product;

    // Extract price information
    const getPriceInfo = () => {
        if (!product) return { price: "Loading...", period: "" };

        let price = "N/A";
        if (product.currentPrice?.formattedPrice) {
            price = product.currentPrice.formattedPrice;
        } else if (product.priceString?.formattedPrice) {
            price = product.priceString.formattedPrice;
        } else if (product.price?.formattedPrice) {
            price = product.price.formattedPrice;
        }

        let period = "";
        if (planType === "monthly") period = "/month";
        else if (planType === "yearly") period = "/year";
        else if (planType === "lifetime") period = "one-time";

        return { price, period };
    };

    const { price, period } = getPriceInfo();

    // Handle review step continue - check if signed in, skip email if yes
    const handleReviewContinue = () => {
        if (user) {
            // Already signed in - skip to payment
            console.log("✅ User already signed in, skipping to payment");
            setCurrentStep("payment");
        } else {
            // Not signed in - collect email
            setCurrentStep("email");
        }
    };

    // Handle email collection - NO PASSWORD, just collect email and proceed
    const handleEmailSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setEmailError(null);

        if (!email.trim()) {
            setEmailError("Please enter your email address");
            return;
        }

        if (!validateEmail(email)) {
            setEmailError("Please enter a valid email address");
            return;
        }

        // Just proceed to payment - account creation happens in payment handler
        console.log("📧 Email collected, proceeding to payment");
        setCurrentStep("payment");
    };

    // Handle payment - create/get user account, configure RevenueCat, open checkout
    const handlePayment = async () => {
        if (!selectedPackage) {
            setError("Selected plan is not available. Please try again or choose a different plan.");
            return;
        }

        try {
            setPurchasing(true);
            setError(null);
            setIsProcessing(true);

            let userId: string;

            // Step 1: Get or create user account (logged in = always charge this user, never different email)
            if (user) {
                userId = user.id;
                console.log(`✅ Using signed-in user ID: ${userId.substring(0, 8)}... (force account)`);
            } else if (email) {
                // User not signed in but email provided - create or get account via Edge Function
                console.log(`📧 Creating/getting user account for: ${email}`);
                const supabase = createClient();
                const { data: { session } } = await supabase.auth.getSession();

                if (session?.user) {
                    // User signed in during the process
                    userId = session.user.id;
                } else {
                    // Call Edge Function to create or get user account
                    const response = await fetch(
                        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/create-subscription-user`,
                        {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
                            },
                            body: JSON.stringify({
                                email: email.trim(),
                                planType: planType,
                            }),
                        }
                    );

                    if (!response.ok) {
                        const errorData = await response.json();
                        throw new Error(errorData.error || errorData.details || "Failed to create user account");
                    }

                    const result = await response.json();
                    if (!result.success || !result.userId) {
                        throw new Error(result.error || "Failed to create user account");
                    }

                    userId = result.userId;
                    setPaymentUserId(userId);
                    console.log(`✅ User account ready: ${userId.substring(0, 8)}... (${result.isNewUser ? 'new' : 'existing'})`);

                    // If we have a sign-in link, store it for automatic sign-in after payment
                    if (result.signInLink) {
                        // Store in sessionStorage for use after payment
                        sessionStorage.setItem('pending_signin_link', result.signInLink);
                    }
                }
            } else {
                throw new Error("Email is required to proceed with payment");
            }

            // Step 2: Configure RevenueCat with user ID BEFORE payment (CRITICAL for webhook)
            console.log(`🔐 Configuring RevenueCat with user ID: ${userId.substring(0, 8)}...`);
            // CRITICAL: Pass email so RevenueCat can match webhooks even if UUID mismatch occurs
            await loginUser(userId, email || user?.email || undefined);

            // Verify RevenueCat is configured
            if (!isInitialized) {
                // Wait a moment for initialization
                await new Promise(resolve => setTimeout(resolve, 500));
            }

            // Step 3: Open RevenueCat hosted checkout
            console.log(`💳 Opening RevenueCat checkout for package: ${selectedPackage.identifier}`);
            const customerEmail = email || user?.email || undefined;
            const customerInfo = await purchasePackage(selectedPackage, customerEmail);

            // Step 4: Payment successful - handle post-payment
            if (customerInfo?.entitlements?.active?.['Scrolli Premium']) {
                await refreshCustomerInfo();

                // Update local profile state
                if (profile) {
                    updateProfileLocal({
                        ...profile,
                        is_premium: true,
                        subscription_tier: planType || 'monthly',
                    });
                }

                // Step 5: Automatically sign in user if not already signed in
                if (!user && email) {
                    console.log(`🔐 Attempting automatic sign-in for: ${email}`);
                    const supabase = createClient();

                    // Check if we have a sign-in link from account creation
                    const signInLink = sessionStorage.getItem('pending_signin_link');

                    if (signInLink) {
                        try {
                            console.log(`✅ Using sign-in link to authenticate`);
                            // The sign-in link from Supabase admin.generateLink contains the token
                            // We can extract it and use verifyOtp, or redirect to it
                            // For automatic sign-in, we'll redirect to the link which will auto-sign in
                            const linkUrl = new URL(signInLink);
                            const callbackUrl = returnUrl
                                ? `${window.location.origin}/auth/callback?next=${encodeURIComponent(returnUrl)}`
                                : `${window.location.origin}/auth/callback`;

                            // Set redirect_to in the link
                            linkUrl.searchParams.set('redirect_to', callbackUrl);

                            // Clear stored link and redirect - this will automatically sign them in
                            sessionStorage.removeItem('pending_signin_link');

                            // Small delay to ensure state is saved, then redirect
                            setTimeout(() => {
                                window.location.href = linkUrl.toString();
                            }, 100);
                            return; // Exit early, redirecting
                        } catch (signInError) {
                            console.warn("Failed to use sign-in link:", signInError);
                            // Fall through to email fallback
                        }
                    }

                    // Fallback: Send magic link email if automatic sign-in failed
                    console.log(`📧 Sending magic link email to: ${email}`);
                    try {
                        await supabase.auth.signInWithOtp({
                            email: email.trim(),
                            options: {
                                emailRedirectTo: `${window.location.origin}/auth/callback${returnUrl ? `?next=${encodeURIComponent(returnUrl)}` : ''}`,
                                shouldCreateUser: false, // User already exists
                            },
                        });
                    } catch (emailError) {
                        console.warn("Failed to send magic link:", emailError);
                        // Don't fail the flow - user can verify later
                    }
                }

                setSuccess(true);
                setCurrentStep("success");

                // Redirect after a short delay (only if not already redirecting from auto sign-in)
                setTimeout(() => {
                    if (returnUrl) {
                        router.push(returnUrl);
                    } else {
                        router.push("/");
                    }
                }, 1500);
            } else {
                // Payment succeeded but entitlement not active yet (webhook delay)
                await refreshCustomerInfo();

                // Also attempt automatic sign-in if user not already signed in
                if (!user && email) {
                    console.log(`🔐 Attempting automatic sign-in for: ${email}`);
                    const supabase = createClient();
                    const signInLink = sessionStorage.getItem('pending_signin_link');

                    if (signInLink) {
                        try {
                            console.log(`✅ Using sign-in link to authenticate`);
                            const linkUrl = new URL(signInLink);
                            const callbackUrl = returnUrl
                                ? `${window.location.origin}/auth/callback?next=${encodeURIComponent(returnUrl)}`
                                : `${window.location.origin}/auth/callback`;

                            linkUrl.searchParams.set('redirect_to', callbackUrl);
                            sessionStorage.removeItem('pending_signin_link');

                            setTimeout(() => {
                                window.location.href = linkUrl.toString();
                            }, 100);
                            return; // Exit early, redirecting
                        } catch (signInError) {
                            console.warn("Failed to use sign-in link:", signInError);
                        }
                    }
                }

                setSuccess(true);
                setCurrentStep("success");

                setTimeout(() => {
                    if (returnUrl) {
                        router.push(returnUrl);
                    } else {
                        router.push("/");
                    }
                }, 1500);
            }
        } catch (err: any) {
            console.error("Purchase failed:", err);

            if (err?.errorCode === 'USER_CANCELLED' || err?.userCancelled || err?.message?.includes('cancelled')) {
                // User cancelled checkout - don't show error
                return;
            }

            // Provide helpful error messages
            let errorMessage = err?.message || "Purchase failed. Please try again.";

            if (err?.message?.includes('not configured') || err?.message?.includes('not initialized')) {
                errorMessage = "Payment system is not ready. Please refresh the page and try again.";
            } else if (err?.message?.includes('user') && err?.message?.includes('not found')) {
                errorMessage = "Account setup failed. Please try again.";
            } else if (err?.message?.includes('credentials') || err?.errorCode === 'CREDENTIALS_ERROR') {
                errorMessage = "Payment configuration error. Please contact support if this persists.";
            }

            setError(errorMessage);
        } finally {
            setPurchasing(false);
            setIsProcessing(false);
        }
    };

    // Show loading state
    if (loading || !planType) {
        return (
            <section className={cn(sectionPadding.lg, containerPadding.lg, colors.background.base)}>
                <div className="max-w-4xl mx-auto text-center">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto text-gray-400 mb-4" />
                    <Text variant="body" className={colors.foreground.muted}>
                        Loading subscription details...
                    </Text>
                </div>
            </section>
        );
    }

    // Capitalize plan name for display
    const planName = planType.charAt(0).toUpperCase() + planType.slice(1);

    return (
        <section className={cn(sectionPadding.lg, containerPadding.lg, colors.background.base)}>
            <div className="max-w-2xl mx-auto">
                {/* Progress Indicator */}
                <div className="mb-8">
                    <div className="flex items-center justify-center gap-2 md:gap-4 mb-4">
                        {/* Step 1: Review */}
                        <div className={cn(
                            "flex items-center gap-2",
                            currentStep === "review" ? colors.foreground.primary : colors.foreground.muted
                        )}>
                            <div className={cn(
                                "w-8 h-8 rounded-full flex items-center justify-center",
                                currentStep === "review"
                                    ? "bg-green-600 text-white"
                                    : currentStep === "email" || currentStep === "payment" || currentStep === "success"
                                        ? "bg-green-100 dark:bg-green-900/30 text-green-600"
                                        : "bg-gray-200 dark:bg-gray-700 text-gray-500"
                            )}>
                                {currentStep === "review" ? "1" : <CheckCircle2 className="h-5 w-5" />}
                            </div>
                            <Text variant="bodySmall" className="font-medium hidden sm:inline">Review</Text>
                        </div>

                        <div className={cn(
                            "h-0.5 w-8 md:w-12",
                            currentStep === "email" || currentStep === "payment" || currentStep === "success"
                                ? "bg-green-600"
                                : "bg-gray-200 dark:bg-gray-700"
                        )} />

                        {/* Step 2: Email (hidden if user is signed in) */}
                        {!user && (
                            <>
                                <div className={cn(
                                    "flex items-center gap-2",
                                    currentStep === "email" ? colors.foreground.primary : colors.foreground.muted
                                )}>
                                    <div className={cn(
                                        "w-8 h-8 rounded-full flex items-center justify-center",
                                        currentStep === "email"
                                            ? "bg-green-600 text-white"
                                            : currentStep === "payment" || currentStep === "success"
                                                ? "bg-green-100 dark:bg-green-900/30 text-green-600"
                                                : "bg-gray-200 dark:bg-gray-700 text-gray-500"
                                    )}>
                                        {currentStep === "email" ? "2" : <CheckCircle2 className="h-5 w-5" />}
                                    </div>
                                    <Text variant="bodySmall" className="font-medium hidden sm:inline">Email</Text>
                                </div>

                                <div className={cn(
                                    "h-0.5 w-8 md:w-12",
                                    currentStep === "payment" || currentStep === "success"
                                        ? "bg-green-600"
                                        : "bg-gray-200 dark:bg-gray-700"
                                )} />
                            </>
                        )}

                        {/* Step 3: Payment */}
                        <div className={cn(
                            "flex items-center gap-2",
                            currentStep === "payment" ? colors.foreground.primary : colors.foreground.muted
                        )}>
                            <div className={cn(
                                "w-8 h-8 rounded-full flex items-center justify-center",
                                currentStep === "payment"
                                    ? "bg-green-600 text-white"
                                    : currentStep === "success"
                                        ? "bg-green-100 dark:bg-green-900/30 text-green-600"
                                        : "bg-gray-200 dark:bg-gray-700 text-gray-500"
                            )}>
                                {currentStep === "payment" ? (user ? "2" : "3") : currentStep === "success" ? <CheckCircle2 className="h-5 w-5" /> : (user ? "2" : "3")}
                            </div>
                            <Text variant="bodySmall" className="font-medium hidden sm:inline">Payment</Text>
                        </div>
                    </div>
                </div>

                {/* Step 1: Review Subscription */}
                {currentStep === "review" && (
                    <div className={cn(
                        componentPadding.lg,
                        borderRadius.lg,
                        colors.background.elevated,
                        elevation[2]
                    )}>
                        <div className="flex items-center justify-center gap-2 mb-6">
                            <Lock className="h-4 w-4 text-green-600" />
                            <Text variant="caption" className={cn(colors.foreground.muted, "tracking-wider")}>
                                Secure & Encrypted
                            </Text>
                        </div>

                        <div className="mb-6">
                            <Heading level={2} variant="h2" className="mb-4 text-center">
                                Review Your Subscription
                            </Heading>

                            {/* Plan Details Card */}
                            <div className={cn(
                                "p-6 rounded-xl mb-4",
                                colors.background.base,
                                "border-2 border-gray-200 dark:border-gray-700"
                            )}>
                                <div className="flex items-center justify-between mb-4">
                                    <div>
                                        <Text variant="caption" className={cn(colors.foreground.muted, "tracking-wider mb-1")}>
                                            Plan
                                        </Text>
                                        <Heading level={3} variant="h4">
                                            {planName} Plan
                                        </Heading>
                                    </div>
                                    <div className="text-right">
                                        <div className={cn(typography.h2, colors.foreground.primary)}>
                                            {price}
                                        </div>
                                        <Text variant="bodySmall" className={colors.foreground.muted}>
                                            {period}
                                        </Text>
                                    </div>
                                </div>
                                <Text variant="bodySmall" className={colors.foreground.secondary}>
                                    Pricing subject to change. Cancel anytime.
                                </Text>
                            </div>
                        </div>

                        <SmartButton
                            onClick={handleReviewContinue}
                            size="lg"
                            width="full"
                            className="mt-6"
                        >
                            Continue
                            <ArrowRight className="ml-2 h-5 w-5" />
                        </SmartButton>
                    </div>
                )}

                {/* Step 2: Email Collection (NO PASSWORD) */}
                {currentStep === "email" && (
                    <div className={cn(
                        componentPadding.lg,
                        borderRadius.lg,
                        colors.background.elevated,
                        elevation[2]
                    )}>
                        <div className="text-center mb-6">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 mb-4">
                                <Mail className="h-8 w-8 text-green-600" />
                            </div>
                            <Heading level={2} variant="h2" className="mb-2">
                                Enter Your Email
                            </Heading>
                            <Text variant="body" className={colors.foreground.secondary}>
                                We'll use this email for your account and subscription updates
                            </Text>
                        </div>

                        <form onSubmit={handleEmailSubmit} className="space-y-4">
                            <div>
                                <Label htmlFor="email">Email Address</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={(e) => {
                                        setEmail(e.target.value);
                                        setEmailError(null);
                                    }}
                                    className={cn(
                                        emailError && "border-red-500 focus:border-red-500"
                                    )}
                                    disabled={isProcessing}
                                />
                                {emailError && (
                                    <Text variant="caption" className="text-red-600 dark:text-red-400 mt-1">
                                        {emailError}
                                    </Text>
                                )}
                            </div>

                            <SmartButton
                                type="submit"
                                disabled={isProcessing || !email.trim()}
                                size="lg"
                                width="full"
                                className="mt-6"
                            >
                                Continue
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </SmartButton>
                        </form>
                    </div>
                )}

                {/* Step 2: Payment */}
                {currentStep === "payment" && (
                    <div className={cn(
                        componentPadding.lg,
                        borderRadius.lg,
                        colors.background.elevated,
                        elevation[2]
                    )}>
                        <div className="text-center mb-6">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 mb-4">
                                <CreditCard className="h-8 w-8 text-green-600" />
                            </div>
                            <Heading level={2} variant="h2" className="mb-2">
                                Choose Your Payment Method
                            </Heading>
                            <Text variant="body" className={colors.foreground.secondary}>
                                Complete your subscription with a secure payment
                            </Text>
                        </div>

                        {/* Credit Card Logos */}
                        <div className="flex items-center justify-center gap-4 mb-6">
                            <div className="text-2xl font-bold text-gray-400">Visa</div>
                            <div className="text-2xl font-bold text-gray-400">Mastercard</div>
                            <div className="text-sm font-bold text-gray-400">AMEX</div>
                            <div className="text-sm font-bold text-gray-400">Discover</div>
                        </div>

                        {/* Plan Summary */}
                        <div className={cn(
                            "mb-6 p-6 rounded-xl",
                            colors.background.base,
                            "border-2 border-green-200 dark:border-green-800"
                        )}>
                            <div className="flex items-center justify-between mb-2">
                                <div>
                                    <Text variant="caption" className={cn(colors.foreground.muted, "tracking-wider mb-1")}>
                                        Selected Plan
                                    </Text>
                                    <Heading level={3} variant="h4">
                                        {planName} Plan
                                    </Heading>
                                </div>
                                <div className="text-right">
                                    <div className={cn(typography.h2, colors.foreground.primary)}>
                                        {price}
                                    </div>
                                    <Text variant="bodySmall" className={colors.foreground.muted}>
                                        {period}
                                    </Text>
                                </div>
                            </div>
                            {(user?.email || email) && (
                                <Text variant="caption" className={colors.foreground.muted}>
                                    Email: {user?.email || email}
                                </Text>
                            )}
                        </div>

                        {error && (
                            <div className={cn(
                                "mb-6 p-4 rounded-lg",
                                "bg-red-50 dark:bg-red-900/20",
                                "border border-red-200 dark:border-red-800",
                                "flex items-start gap-3"
                            )}>
                                <XCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                                <Text variant="bodySmall" className="text-red-600 dark:text-red-400">
                                    {error}
                                </Text>
                            </div>
                        )}

                        <div className="flex gap-4">
                            <SmartButton
                                onClick={() => setCurrentStep(user ? "review" : "email")}
                                variant="outline"
                                size="lg"
                                className="flex-1"
                                disabled={purchasing}
                            >
                                <ArrowLeft className="mr-2 h-5 w-5" />
                                Back
                            </SmartButton>
                            <SmartButton
                                onClick={handlePayment}
                                disabled={purchasing || !selectedPackage}
                                size="lg"
                                className="flex-1"
                            >
                                {purchasing ? (
                                    <>
                                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        Subscribe Now - {price}
                                        <ArrowRight className="ml-2 h-5 w-5" />
                                    </>
                                )}
                            </SmartButton>
                        </div>

                        <Text variant="caption" className={cn(colors.foreground.muted, "text-center mt-4 block")}>
                            Cancel anytime. No hidden fees.
                        </Text>
                    </div>
                )}

                {/* Step 3: Success */}
                {currentStep === "success" && (
                    <div className={cn(
                        componentPadding.lg,
                        borderRadius.lg,
                        colors.background.elevated,
                        elevation[2],
                        "text-center"
                    )}>
                        <CheckCircle2 className="h-16 w-16 text-green-600 mx-auto mb-4" />
                        <Heading level={2} variant="h2" className="mb-2">
                            Subscription Successful!
                        </Heading>
                        {!user && email && (
                            <Text variant="body" className={cn(colors.foreground.secondary, "mb-4")}>
                                Check your email ({email}) to verify your account and access your subscription.
                            </Text>
                        )}
                        <Text variant="bodyLarge" className={cn(colors.foreground.secondary, "mb-2")}>
                            {user ? "Your premium access is now active." : "Your subscription is active."} Redirecting you{returnUrl ? " back to the article" : " to the homepage"}...
                        </Text>
                        <Text variant="body" className={cn(colors.foreground.muted, "mb-6")}>
                            If you don&apos;t see premium access yet, it may take a few seconds.
                        </Text>
                        <Loader2 className="h-6 w-6 animate-spin mx-auto text-gray-400" aria-hidden="true" />
                    </div>
                )}

                {/* Benefits Section (shown on review step only) */}
                {currentStep === "review" && (
                    <div className="mt-12">
                        <Heading level={3} variant="h3" className="text-center mb-8">
                            What You'll Get
                        </Heading>
                        <div className={cn("grid sm:grid-cols-2 gap-6", gap.lg)}>
                            {benefits.map((benefit, i) => (
                                <div
                                    key={i}
                                    className={cn(
                                        componentPadding.md,
                                        borderRadius.lg,
                                        colors.background.elevated,
                                        "border",
                                        colors.border.DEFAULT
                                    )}
                                >
                                    <div className="text-3xl mb-3">{benefit.icon}</div>
                                    <Heading level={4} variant="h6" className="mb-2">
                                        {benefit.title}
                                    </Heading>
                                    <Text variant="bodySmall" className={colors.foreground.secondary}>
                                        {benefit.description}
                                    </Text>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}
