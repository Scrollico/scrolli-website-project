"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/components/providers/auth-provider";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import {
    colors,
    borderRadius,
    typography,
    componentPadding,
    elevation,
    gap,
} from "@/lib/design-tokens";
import { useTranslation } from "@/components/providers/translation-provider";

interface EmailGateModalProps {
    articleId: string;
    onSuccess?: () => void;
}

/**
 * EmailGateModal - HARD GATE for anonymous users
 * Shows immediately to block content until email is provided.
 * Collects email and signs user up, counting the current article as their first read.
 */
export function EmailGateModal({ articleId, onSuccess }: EmailGateModalProps) {
    const { user, isLoading } = useAuth();
    const { t } = useTranslation();
    const [email, setEmail] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const supabase = createClient();

    // Hard gate is always visible for non-authenticated users (no scroll trigger)

    const handleSubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            // Sign up with email (magic link)
            const { data, error: signUpError } = await supabase.auth.signInWithOtp({
                email,
                options: {
                    emailRedirectTo: `${window.location.origin}/auth/callback?next=${window.location.pathname}`,
                    data: {
                        // Track that this signup came from an article gate
                        signup_source: "article_gate",
                        first_article_id: articleId,
                    },
                },
            });

            if (signUpError) {
                throw signUpError;
            }

            setSuccessMessage(t('emailGate.successMessage'));

            // After successful signup, the user will be redirected via magic link
            // The auth callback will handle setting articles_read_count = 1

            onSuccess?.();
        } catch (err: any) {
            setError(err.message || t('emailGate.errorGeneric'));
        } finally {
            setIsSubmitting(false);
        }
    }, [email, articleId, supabase.auth, onSuccess]);

    // Don't show if user is logged in or still loading
    if (isLoading || user) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div
                className={cn(
                    "w-full max-w-lg rounded-t-2xl p-6 shadow-2xl animate-in slide-in-from-bottom duration-500",
                    colors.background.base
                )}
            >
                {/* Header */}
                <div className="mb-4 text-center">
                    <h2 className={cn(typography.h3, colors.foreground.primary)}>
                        {t('emailGate.title')}
                    </h2>
                    <p className={cn(typography.bodySmall, colors.foreground.muted, "mt-2")}>
                        {t('emailGate.subtitle')}
                    </p>
                </div>

                {successMessage ? (
                    <div className={cn(
                        "p-4 rounded-lg text-center",
                        colors.success.bg,
                        colors.success.DEFAULT
                    )}>
                        <p className="font-medium">{successMessage}</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Email Input */}
                        <div>
                            <label htmlFor="email" className="sr-only">
                                {t('emailGate.emailLabel')}
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder={t('emailGate.emailPlaceholder')}
                                required
                                disabled={isSubmitting}
                                className={cn(
                                    "w-full px-4 py-3 rounded-xl border",
                                    colors.border.DEFAULT,
                                    colors.background.base,
                                    colors.foreground.primary,
                                    "focus:ring-2 focus:ring-green-600 focus:border-transparent",
                                    "disabled:opacity-50"
                                )}
                            />
                        </div>

                        {/* Error Message */}
                        {error && (
                            <p className={cn("text-sm text-center", colors.error.DEFAULT)}>
                                {error}
                            </p>
                        )}

                        {/* CTA Button */}
                        <button
                            type="submit"
                            disabled={isSubmitting || !email}
                            className={cn(
                                "w-full py-3 rounded-full font-bold text-white transition-all",
                                "bg-green-600 hover:bg-green-700",
                                "disabled:opacity-50 disabled:cursor-not-allowed"
                            )}
                        >
                            {isSubmitting ? t('emailGate.sending') : t('emailGate.submit')}
                        </button>

                        <p className={cn("text-center text-xs", colors.foreground.muted)}>
                            {t('emailGate.disclaimer')}
                        </p>
                    </form>
                )}
            </div>
        </div>
    );
}
