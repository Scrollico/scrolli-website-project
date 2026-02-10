"use client";

import { useState, useCallback, useEffect } from "react";
import { useAuth } from "@/components/providers/auth-provider";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import {
    colors,
    typography,
    elevation,
} from "@/lib/design-tokens";
import { X, Gift, Loader2, CheckCircle2, QrCode, Link as LinkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Text } from "@/components/ui/typography";
import Image from "next/image";

interface GiftArticleModalProps {
    articleId: string;
    articleTitle?: string;
    onClose: () => void;
    onSuccess?: () => void;
}

type ShareMethod = "link" | "qr";

/**
 * GiftArticleModal - Modal for gifting articles to others
 * Allows authenticated users to gift articles (2 per month quota)
 * Supports link sharing and QR code generation
 */
export function GiftArticleModal({
    articleId,
    articleTitle,
    onClose,
    onSuccess,
}: GiftArticleModalProps) {
    const { user } = useAuth();
    const [shareMethod, setShareMethod] = useState<ShareMethod>("link");
    const [giftUrl, setGiftUrl] = useState<string | null>(null);
    const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [giftsRemaining, setGiftsRemaining] = useState<number | null>(null);
    const [copied, setCopied] = useState(false);
    const supabase = createClient();

    // Fetch gift quota on mount
    useEffect(() => {
        async function fetchGiftQuota() {
            if (!user) return;

            try {
                const { data: profile } = await supabase
                    .from("profiles")
                    .select("gifts_sent_this_month")
                    .eq("id", user.id)
                    .single();

                if (profile) {
                    setGiftsRemaining(Math.max(0, 2 - (profile.gifts_sent_this_month || 0)));
                }
            } catch (err) {
                console.error("Error fetching gift quota:", err);
            }
        }

        fetchGiftQuota();
    }, [user, supabase]);

    const handleSubmit = useCallback(
        async (e: React.FormEvent) => {
            e.preventDefault();
            setIsSubmitting(true);
            setError(null);

            try {
                // Get current session token for explicit auth (fallback for cookie issues)
                const { data: { session } } = await supabase.auth.getSession();
                const token = session?.access_token;

                const response = await fetch("/api/gift-article", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        ...(token ? { "Authorization": `Bearer ${token}` } : {}),
                    },
                    body: JSON.stringify({
                        articleId,
                        shareMethod,
                    }),
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.error || "Failed to create gift link");
                }

                setSuccess(true);
                setGiftUrl(data.giftUrl);
                if (data.qrCodeUrl) {
                    setQrCodeUrl(data.qrCodeUrl);
                }
                setGiftsRemaining((prev) => (prev !== null ? Math.max(0, prev - 1) : null));
                onSuccess?.();

                // Do NOT auto-close, let user copy link or save QR
            } catch (err: any) {
                setError(err.message || "Failed to create gift link. Please try again.");
            } finally {
                setIsSubmitting(false);
            }
        },
        [articleId, shareMethod, onSuccess, supabase]
    );

    const handleCopy = useCallback(() => {
        if (giftUrl) {
            navigator.clipboard.writeText(giftUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    }, [giftUrl]);

    if (!user) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div
                className={cn(
                    "w-full max-w-md rounded-2xl p-6 shadow-2xl animate-in slide-in-from-bottom duration-500",
                    colors.background.base,
                    elevation[3]
                )}
            >
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-full bg-[#E3E5FF] dark:bg-[#E3E5FF]/20">
                            <Gift className="h-5 w-5 text-[#8080FF]" />
                        </div>
                        <div>
                            <h2 className={cn(typography.h3, colors.foreground.primary)}>
                                Makale Hediye Et
                            </h2>
                            {giftsRemaining !== null && (
                                <Text variant="caption" className={colors.foreground.muted}>
                                    {giftsRemaining} hediye hakkın kaldı (bu ay)
                                </Text>
                            )}
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className={cn(
                            "p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors",
                            colors.foreground.muted
                        )}
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {success && giftUrl ? (
                    <div className="text-center py-6">
                        <CheckCircle2 className="h-14 w-14 text-[#8080FF] mx-auto mb-4" />
                        <h3 className={cn(typography.h4, colors.foreground.primary, "mb-2")}>
                            Hediye Linki Oluşturuldu!
                        </h3>
                        <Text variant="body" className={cn(colors.foreground.secondary, "mb-4")}>
                            ⚠️ Link <strong>tek kullanımlık</strong> ve 7 gün geçerlidir
                        </Text>

                        {shareMethod === "qr" && qrCodeUrl ? (
                            <div className="mb-6">
                                <div className="relative w-64 h-64 mx-auto mb-4 rounded-lg overflow-hidden border-2 border-gray-200 dark:border-gray-700">
                                    <Image
                                        src={qrCodeUrl}
                                        alt="QR Code"
                                        fill
                                        className="object-contain"
                                    />
                                </div>
                                <Text variant="caption" className={colors.foreground.muted}>
                                    Bu QR kodu telefon kamerasıyla tarayabilirsiniz
                                </Text>
                                <div className="mt-4">
                                    <a
                                        href={qrCodeUrl}
                                        download={`gift-${articleId}.png`}
                                        className={cn(
                                            "inline-block px-4 py-2 rounded-lg",
                                            "bg-[#8080FF] hover:bg-[#8080FF]/90",
                                            "text-[#F8F5E3] font-semibold transition-colors"
                                        )}
                                    >
                                        QR Kodu İndir
                                    </a>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2 p-2 rounded-lg bg-gray-100 dark:bg-gray-800 mb-6 border border-gray-200 dark:border-gray-700">
                                <code className="flex-1 text-sm overflow-hidden text-ellipsis whitespace-nowrap px-2 font-mono text-gray-600 dark:text-gray-300">
                                    {giftUrl}
                                </code>
                                <Button
                                    size="sm"
                                    variant="secondary"
                                    onClick={handleCopy}
                                >
                                    {copied ? "Kopyalandı!" : "Kopyala"}
                                </Button>
                            </div>
                        )}

                        <Button
                            onClick={onClose}
                            variant="default"
                            className="w-full"
                        >
                            Tamam
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {articleTitle && (
                            <div className={cn(
                                "p-4 rounded-lg",
                                colors.background.elevated,
                                "border",
                                colors.border.DEFAULT
                            )}>
                                <Text variant="caption" className={cn(colors.foreground.muted, "mb-1 block")}>
                                    Hediye Edilecek Makale
                                </Text>
                                <Text variant="bodySmall" className={colors.foreground.primary}>
                                    {articleTitle}
                                </Text>
                            </div>
                        )}

                        {/* Share Method Selection */}
                        <div>
                            <Label className="mb-2 block">Paylaşım Yöntemi</Label>
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    onClick={() => setShareMethod("link")}
                                    className={cn(
                                        "p-4 rounded-lg border-2 transition-all",
                                        shareMethod === "link"
                                            ? "border-[#8080FF] bg-[#E3E5FF]/30 dark:bg-[#E3E5FF]/10"
                                            : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                                    )}
                                >
                                    <LinkIcon className="h-6 w-6 mx-auto mb-2 text-[#8080FF]" />
                                    <Text variant="bodySmall" className="font-semibold">Link</Text>
                                </button>
                                <button
                                    onClick={() => setShareMethod("qr")}
                                    className={cn(
                                        "p-4 rounded-lg border-2 transition-all",
                                        shareMethod === "qr"
                                            ? "border-[#8080FF] bg-[#E3E5FF]/30 dark:bg-[#E3E5FF]/10"
                                            : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                                    )}
                                >
                                    <QrCode className="h-6 w-6 mx-auto mb-2 text-[#8080FF]" />
                                    <Text variant="bodySmall" className="font-semibold">QR Kod</Text>
                                </button>
                            </div>
                        </div>

                        {giftsRemaining !== null && giftsRemaining === 0 ? (
                            <div className={cn(
                                "p-3 rounded-lg",
                                "bg-amber-50 dark:bg-amber-900/20",
                                "border border-amber-200 dark:border-amber-800"
                            )}>
                                <Text variant="caption" className="text-amber-700 dark:text-amber-400">
                                    Bu ay hediye hakkınız doldu. Ayın 1'inde yenilenecek.
                                </Text>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div className={cn(
                                    "p-4 rounded-lg",
                                    "bg-blue-50 dark:bg-blue-900/20",
                                    "border border-blue-200 dark:border-blue-800"
                                )}>
                                    <Text variant="bodySmall" className="text-blue-700 dark:text-blue-400">
                                        ⚠️ <strong>Önemli:</strong> Oluşturduğunuz hediye linki <strong>tek kullanımlıktır</strong>.
                                        Link kullanıldıktan sonra bir daha açılamaz.
                                    </Text>
                                </div>
                                {error && (
                                    <Text variant="caption" className="text-red-600 dark:text-red-400">
                                        {error}
                                    </Text>
                                )}
                            </div>
                        )}

                        <div className="flex gap-3 pt-2">
                            <Button
                                type="button"
                                onClick={onClose}
                                variant="outline"
                                size="lg"
                                className="flex-1"
                                disabled={isSubmitting}
                            >
                                İptal
                            </Button>
                            <Button
                                onClick={(e) => handleSubmit(e as any)}
                                size="lg"
                                className="flex-1"
                                disabled={isSubmitting || (giftsRemaining !== null && giftsRemaining === 0)}
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                        Oluşturuluyor...
                                    </>
                                ) : (
                                    <>
                                        <Gift className="mr-2 h-5 w-5" />
                                        {shareMethod === "qr" ? "QR Kod Oluştur" : "Linki Oluştur"}
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
