"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { CloseIcon, ArrowRightIcon } from "@/components/icons/ScrolliIcons";
import { useTheme } from "next-themes";
import {
    typography,
    colors,
    borderRadius,
    gap,
    fontWeight,
    button
} from "@/lib/design-tokens";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { SmartButton } from "@/components/ui/smart-button";

export default function NewsletterPopup() {
    const [isMounted, setIsMounted] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [isDismissed, setIsDismissed] = useState(false);
    const [email, setEmail] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { theme, resolvedTheme } = useTheme();

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        const handleOpenEvent = () => {
            setIsVisible(true);
            setIsDismissed(false);
        };

        window.addEventListener('openNewsletter', handleOpenEvent);
        return () => window.removeEventListener('openNewsletter', handleOpenEvent);
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            if (isDismissed) return;

            // Calculate scroll percentage
            const scrollTop = window.scrollY || window.pageYOffset;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;

            // console.log("Scroll Debug:", { scrollTop, docHeight, percent: scrollTop / docHeight });

            // Show immediately for testing if requested, otherwise use scroll logic
            // For now, let's make it show up more easily (e.g. > 100px)
            if (scrollTop > 100) {
                setIsVisible(true);
            }
        };

        // Initial check
        handleScroll();

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, [isDismissed]);

    // Debug: Force visible immediately on mount
    useEffect(() => {
        if (!isDismissed) setIsVisible(true);
    }, [isDismissed]);

    const handleDismiss = () => {
        setIsVisible(false);
        setIsDismissed(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate API call
        console.log("Newsletter modal signup:", email);

        setTimeout(() => {
            setIsSubmitting(false);
            setEmail("");
            handleDismiss(); // Close after success
        }, 1000);
    };

    console.log("NewsletterPopup RENDER state:", { isVisible, isDismissed });

    if (!isVisible) {
        console.log("NewsletterPopup: Not visible, returning null");
        return null;
    }

    console.log("NewsletterPopup: Rendering modal");

    if (!isMounted) {
        return null;
    }

    // Determine if dark mode is active
    const isDark = isMounted && (theme === 'dark' || resolvedTheme === 'dark');

    const content = (
        <AnimatePresence mode="wait">
            {isVisible && (
                <>
                    {/* Blur Backdrop - Covers entire page */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        onClick={handleDismiss}
                        style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            width: '100%',
                            height: '100%',
                            zIndex: 9999,
                            backgroundColor: isDark ? 'rgba(0, 0, 0, 0.6)' : 'rgba(0, 0, 0, 0.4)',
                            backdropFilter: 'blur(8px)',
                            WebkitBackdropFilter: 'blur(8px)',
                            cursor: 'pointer'
                        }}
                        aria-hidden="true"
                    />

                    {/* Newsletter Popup */}
                    <motion.div
                        initial={{ transform: "translateY(100%)", opacity: 0 }}
                        animate={{ transform: "translateY(0)", opacity: 1 }}
                        exit={{ transform: "translateY(100%)", opacity: 0 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        data-newsletter-popup
                        style={{
                            position: 'fixed',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            width: '100%',
                            zIndex: 10000,
                            backgroundColor: isDark ? '#1f2937' : '#F8F5E4',
                            borderTop: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)'
                        }}
                    >
                        <div
                            className="w-full max-w-2xl mx-auto px-4 py-5 md:px-6 md:py-6"
                        >
                            <div className="relative space-y-3">
                                {/* Close Button - Top Right */}
                                <button
                                    onClick={handleDismiss}
                                    className={cn(
                                        "absolute top-2 right-2",
                                        "w-8 h-8 rounded-full flex items-center justify-center",
                                        "hover:bg-black/5 dark:hover:bg-white/10 transition-colors",
                                        colors.foreground.primary
                                    )}
                                    aria-label="Close newsletter modal"
                                >
                                    <CloseIcon size={16} />
                                </button>

                                {/* Title */}
                                <h2 className={cn(
                                    typography.h3,
                                    colors.foreground.primary,
                                    "font-serif font-bold text-xl"
                                )}>
                                    Scrolli Bülteni
                                </h2>

                                {/* Description */}
                                <p className={cn(
                                    typography.body,
                                    colors.foreground.primary,
                                    "text-sm leading-relaxed"
                                )}>
                                    Güvenebileceğiniz günlük haber bülteni. Her hafta içi.
                                </p>

                                {/* Email Input Label */}
                                <label className={cn(
                                    "text-sm font-semibold px-2 py-1 inline-block w-fit mt-1",
                                    "bg-yellow-300 dark:bg-yellow-500/30",
                                    colors.foreground.primary
                                )}>
                                    E-posta adresi
                                </label>

                                {/* Email Input Field */}
                                <Input
                                    type="email"
                                    placeholder="E-posta adresiniz"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className={cn(
                                        "w-full h-11 px-4 text-base",
                                        "border border-gray-300 dark:border-gray-600",
                                        "bg-white dark:bg-gray-800",
                                        "focus-visible:ring-2 focus-visible:ring-[#374152] dark:focus-visible:ring-gray-500",
                                        "placeholder:text-gray-400 dark:placeholder:text-gray-500",
                                        colors.foreground.primary
                                    )}
                                />

                                {/* Primary CTA Button */}
                                <SmartButton
                                    type="button"
                                    onClick={handleSubmit}
                                    disabled={isSubmitting}
                                    size="lg"
                                    width="full"
                                    className="mt-2 rounded-lg font-semibold"
                                >
                                    {isSubmitting ? "Gönderiliyor..." : "I want to subscribe"}
                                </SmartButton>

                                {/* Take me back to the news */}
                                <button
                                    onClick={handleDismiss}
                                    data-back-to-news
                                    className="w-full flex items-center justify-center gap-2 mt-3 pt-1 text-sm text-gray-700 dark:text-gray-200 cursor-pointer"
                                >
                                    <span>Take me back to the news</span>
                                    <ArrowRightIcon size={16} strokeWidth={2} />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );

    return createPortal(content, document.body);
}
