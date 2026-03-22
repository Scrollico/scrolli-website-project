"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { SmartButton } from "@/components/ui/smart-button";
import { cn } from "@/lib/utils";
import { sectionPadding, colors } from "@/lib/design-tokens";

export default function ArticleNewsletterBanner() {
    const [email, setEmail] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [mounted, setMounted] = useState(false);
    const { resolvedTheme } = useTheme();

    useEffect(() => {
        setMounted(true);
    }, []);

    const isDark = mounted && resolvedTheme === "dark";

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setIsSubmitting(true);
        // Simulate API call
        setTimeout(() => {
            setIsSubmitting(false);
            setEmail("");
        }, 1500);
    };

    return (
        <div
            className={cn(
                "my-12 relative overflow-hidden rounded-2xl border shadow-lg",
                "flex flex-col items-center justify-center",
                isDark ? "border-neutral-800 bg-neutral-900" : "border-[#e8e5d1]"
            )}
            style={{
                background: isDark
                    ? 'linear-gradient(135deg, #1f2937 0%, #111827 100%)'
                    : 'linear-gradient(135deg, #f8f5e4 0%, #f0edd9 25%, #e8e5d1 50%, #f0edd9 75%, #f8f5e4 100%)',
                maxWidth: 1245,
                marginLeft: "auto",
                marginRight: "auto",
                minHeight: 411,
            }}
        >
            {/* Dotted Pattern Overlay - Adaptive */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    backgroundImage: `radial-gradient(circle, ${isDark ? '#fff' : '#000'} 1px, transparent 1px)`,
                    backgroundSize: '24px 24px',
                    opacity: isDark ? 0.05 : 0.03,
                    mixBlendMode: isDark ? 'overlay' : 'multiply',
                }}
            />

            {/* Subtle Gradient Overlay for Depth */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    background: isDark
                        ? 'linear-gradient(to bottom right, rgba(255,255,255,0.05) 0%, transparent 50%)'
                        : 'linear-gradient(to bottom right, rgba(255,255,255,0.3) 0%, transparent 50%)',
                }}
            />

            <div className="relative z-10 px-6 py-10 md:px-12 md:py-12 flex flex-col items-center text-center">
                {/* Scrolli Icon/Logo Placeholder */}
                <div className="mb-6 w-12 h-12 rounded-lg bg-green-600 flex items-center justify-center text-white font-serif font-bold text-2xl shadow-md">
                    S
                </div>

                {/* Subtitle */}
                <p className={cn(
                    "text-xs tracking-[0.2em] font-bold mb-4",
                    isDark ? "text-green-400" : "text-green-700"
                )}>
                    Premium'a Özel Sayılar
                </p>

                {/* Title */}
                <div role="heading" aria-level={2} className={cn(
                    "text-3xl md:text-4xl font-bold mb-4 font-serif text-center",
                    isDark ? "text-white" : "text-gray-900"
                )}>
                    Scrolli Bülten
                </div>

                {/* Description */}
                <p className={cn(
                    "text-base mb-8 max-w-lg leading-relaxed text-center mx-auto",
                    isDark ? "text-gray-300" : "text-gray-600"
                )}>
                    Her hafta müzik, sinema, eğlence ve sanat dünyasından söyleşiler, incelemeler,
                    öneriler ve keşif notları e-posta kutunda.
                </p>

                {/* FIXED: Wrapper Pattern for Input + Button Alignment */}
                <form onSubmit={handleSubmit} className="w-full max-w-sm mx-auto">
                    <div
                        className={cn(
                            "flex items-center rounded-full",
                            isDark ? "bg-neutral-800 border-neutral-700" : `${colors.background.base} border-gray-200`,
                            "border",
                            "shadow-sm focus-within:ring-2 focus-within:ring-green-500/20 focus-within:border-green-500"
                        )}
                        style={{ height: '38px', padding: '2px' }}
                    >
                        {/* Native Input - No border, transparent bg, explicit margin reset */}
                        <input
                            type="email"
                            placeholder="E-posta adresini gir..."
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className={cn(
                                "flex-1 bg-transparent border-none outline-none px-3 text-sm placeholder:text-gray-400",
                                isDark ? "text-white" : "text-gray-900"
                            )}
                            style={{ height: '34px', margin: 0 }}
                        />

                        <SmartButton
                            type="submit"
                            disabled={isSubmitting}
                            forceVariant={isDark ? "brand-beige" : "brand-charcoal"}
                            className="rounded-full px-3 text-[11px] font-medium whitespace-nowrap flex-shrink-0"
                            style={{ height: '34px', margin: 0, minWidth: '125px', width: '160px' }}
                        >
                            {isSubmitting ? "..." : "Ücretsiz Kaydol"}
                        </SmartButton>
                    </div>
                </form>
            </div>
        </div>
    );
}
