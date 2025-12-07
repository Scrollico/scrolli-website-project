"use client";

import { useState, useEffect, useRef } from "react";
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

const STORAGE_KEY = 'newsletter-popup-dismissed';
const TIME_DELAY_MS = 30000; // 30 seconds
const SCROLL_THRESHOLD_PERCENT = 25; // 25% scroll

// localStorage utility functions
const isPopupDismissed = (): boolean => {
    if (typeof window === 'undefined') return false;
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) return false;
        const data = JSON.parse(stored);
        return data.dismissed === true;
    } catch {
        return false;
    }
};

const setPopupDismissed = (): void => {
    if (typeof window === 'undefined') return;
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({
            dismissed: true,
            timestamp: Date.now()
        }));
    } catch (error) {
        // localStorage might be disabled or full
        console.error('Failed to save dismissal state:', error);
    }
};

export default function NewsletterPopup() {
    const [isMounted, setIsMounted] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [email, setEmail] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { theme, resolvedTheme } = useTheme();
    const pageLoadTimeRef = useRef<number | null>(null);
    const hasShownRef = useRef<boolean>(false);

    // Initialize component and check localStorage
    useEffect(() => {
        setIsMounted(true);
        pageLoadTimeRef.current = Date.now();
        
        // Check if popup was previously dismissed
        if (isPopupDismissed()) {
            return;
        }
    }, []);

    // Handle external open event (if needed)
    useEffect(() => {
        const handleOpenEvent = () => {
            if (!isPopupDismissed() && !hasShownRef.current) {
                setIsVisible(true);
                hasShownRef.current = true;
            }
        };

        window.addEventListener('openNewsletter', handleOpenEvent);
        return () => window.removeEventListener('openNewsletter', handleOpenEvent);
    }, []);

    // Scroll and time-based trigger logic
    useEffect(() => {
        // Don't set up listeners if already dismissed or already shown
        if (isPopupDismissed() || hasShownRef.current || !pageLoadTimeRef.current) {
            return;
        }

        const checkAndShowPopup = () => {
            if (hasShownRef.current) return;

            // Check if 30 seconds have passed
            const timeElapsed = Date.now() - (pageLoadTimeRef.current || 0);
            if (timeElapsed < TIME_DELAY_MS) {
                return; // Not enough time has passed
            }

            // Calculate scroll percentage
            const scrollTop = window.scrollY || window.pageYOffset;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            
            // Prevent division by zero
            if (docHeight <= 0) return;

            const scrollPercent = (scrollTop / docHeight) * 100;

            // Show popup if scroll threshold is reached
            if (scrollPercent >= SCROLL_THRESHOLD_PERCENT) {
                setIsVisible(true);
                hasShownRef.current = true;
            }
        };

        const handleScroll = () => {
            checkAndShowPopup();
        };

        // Check periodically in case user stops scrolling after 30 seconds
        const intervalId = setInterval(() => {
            checkAndShowPopup();
        }, 1000); // Check every second

        // Initial check
        checkAndShowPopup();

        window.addEventListener("scroll", handleScroll, { passive: true });
        
        return () => {
            window.removeEventListener("scroll", handleScroll);
            clearInterval(intervalId);
        };
    }, []);

    const handleDismiss = () => {
        setIsVisible(false);
        setPopupDismissed(); // Save to localStorage
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate API call
        // TODO: Replace with actual API call
        setTimeout(() => {
            setIsSubmitting(false);
            setEmail("");
            handleDismiss(); // Close after success
        }, 1000);
    };

    // Don't render if not visible or not mounted
    if (!isVisible || !isMounted) {
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
