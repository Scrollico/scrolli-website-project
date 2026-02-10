"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Container } from "@/components/responsive";
import { Heading, Text } from "@/components/ui/typography";
import { SmartButton } from "@/components/ui/smart-button";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
    colors,
    componentPadding,
    elevation,
} from "@/lib/design-tokens";
import { Gift, Loader2, CheckCircle2, XCircle, Clock } from "lucide-react";

interface Article {
    id: string;
    title: string;
    subtitle?: string;
    excerpt?: string;
    author: string;
    category: string;
    date: string;
    readTime: string;
    image?: string;
    isPremium?: boolean;
}

interface GiftRedemptionClientProps {
    token: string;
    article: Article;
    senderName: string;
    recipientEmail: string | null;
    expiresAt: string;
    isExpired: boolean;
}

export default function GiftRedemptionClient({
    token,
    article,
    senderName,
    recipientEmail,
    expiresAt,
    isExpired,
}: GiftRedemptionClientProps) {
    const router = useRouter();
    const [isRedeeming, setIsRedeeming] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleRedeem = async () => {
        if (isExpired) {
            setError("Bu hediye linkinin süresi dolmuş");
            return;
        }

        setIsRedeeming(true);
        setError(null);

        try {
            const response = await fetch("/api/redeem-gift", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    giftToken: token,
                    articleId: article.id,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Hediye kullanılırken bir hata oluştu");
            }

            // Store redeemed gift in localStorage for client-side access check
            try {
                const redeemedGifts = JSON.parse(localStorage.getItem("redeemedGifts") || "[]");
                if (!redeemedGifts.includes(article.id)) {
                    localStorage.setItem("redeemedGifts", JSON.stringify([...redeemedGifts, article.id]));
                }
            } catch (e) {
                console.error("Error storing redeemed gift:", e);
            }

            // Success! Redirect to article
            router.push(`/${article.id}?redeemed=true`);
        } catch (err: any) {
            setError(err.message || "Hediye kullanılırken bir hata oluştu. Lütfen tekrar deneyin.");
        } finally {
            setIsRedeeming(false);
        }
    };

    // Calculate time remaining
    const expiryDate = new Date(expiresAt);
    const now = new Date();
    const timeRemaining = expiryDate.getTime() - now.getTime();
    const daysRemaining = Math.ceil(timeRemaining / (1000 * 60 * 60 * 24));

    return (
        <div className={cn("min-h-screen", colors.background.base, "py-12 md:py-20")}>
            <Container size="md">
                <div
                    className={cn(
                        "rounded-2xl overflow-hidden",
                        colors.background.elevated,
                        elevation[2],
                        "animate-in fade-in slide-in-from-bottom-4 duration-700"
                    )}
                >
                    {/* Header Section */}
                    <div
                        className={cn(
                            "text-center",
                            componentPadding.lg,
                            "border-b",
                            colors.border.DEFAULT,
                            "bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20"
                        )}
                    >
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 mb-4">
                            <Gift className="h-8 w-8 text-green-600" />
                        </div>
                        <Heading level={1} variant="h2" className={cn(colors.foreground.primary, "mb-3")}>
                            🎁 Bir Makale Hediyen Var!
                        </Heading>
                        <Text variant="body" className={cn(colors.foreground.secondary, "mb-2")}>
                            <strong>{senderName}</strong> sana özel bir makale hediye etti
                        </Text>
                        {recipientEmail && (
                            <Text variant="caption" className={colors.foreground.muted}>
                                Kime: {recipientEmail}
                            </Text>
                        )}
                    </div>

                    {/* Article Preview */}
                    <div className={componentPadding.lg}>
                        <div className={cn("rounded-lg overflow-hidden", colors.background.base, "border", colors.border.DEFAULT)}>
                            {article.image && (
                                <div className="relative w-full aspect-video">
                                    <Image
                                        src={article.image}
                                        alt={article.title}
                                        fill
                                        className="object-cover"
                                        sizes="(max-width: 768px) 100vw, 600px"
                                    />
                                </div>
                            )}
                            <div className={componentPadding.md}>
                                {article.isPremium && (
                                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200 mb-3">
                                        <span className="text-xs font-semibold tracking-wider">Premium</span>
                                    </div>
                                )}
                                <Heading level={3} variant="h3" className={cn(colors.foreground.primary, "mb-3")}>
                                    {article.title}
                                </Heading>
                                {article.subtitle && (
                                    <Text variant="body" className={cn(colors.foreground.secondary, "mb-3")}>
                                        {article.subtitle}
                                    </Text>
                                )}
                                {article.excerpt && (
                                    <Text variant="bodySmall" className={cn(colors.foreground.muted, "line-clamp-3")}>
                                        {article.excerpt}
                                    </Text>
                                )}
                                <div className="flex flex-wrap items-center gap-3 mt-4 text-sm text-gray-500 dark:text-gray-400">
                                    {article.author && <span>{article.author}</span>}
                                    {article.date && <span>•</span>}
                                    {article.date && <span>{article.date}</span>}
                                    {article.readTime && <span>•</span>}
                                    {article.readTime && <span>{article.readTime}</span>}
                                </div>
                            </div>
                        </div>

                        {/* Expiry Info */}
                        <div
                            className={cn(
                                "mt-6 p-4 rounded-lg",
                                isExpired
                                    ? "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
                                    : "bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800"
                            )}
                        >
                            <div className="flex items-start gap-3">
                                {isExpired ? (
                                    <XCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                                ) : (
                                    <Clock className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                                )}
                                <div className="flex-1">
                                    {isExpired ? (
                                        <>
                                            <Text variant="bodySmall" className="text-red-700 dark:text-red-400 font-semibold mb-1">
                                                Hediye Linkinin Süresi Dolmuş
                                            </Text>
                                            <Text variant="caption" className="text-red-600 dark:text-red-400">
                                                Bu hediye linki {new Date(expiresAt).toLocaleDateString('tr-TR')} tarihinde sona erdi.
                                            </Text>
                                        </>
                                    ) : (
                                        <>
                                            <Text variant="bodySmall" className="text-blue-700 dark:text-blue-400 font-semibold mb-1">
                                                ⚠️ Tek Kullanımlık Link
                                            </Text>
                                            <Text variant="caption" className="text-blue-600 dark:text-blue-400">
                                                Bu link bir kez kullanılabilir ve {daysRemaining} gün içinde geçerliliğini yitirecek.
                                                "Makaleyi Oku" butonuna bastığınızda link kullanılmış sayılacak.
                                            </Text>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Error Display */}
                        {error && (
                            <div className="mt-4 p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                                <Text variant="bodySmall" className="text-red-700 dark:text-red-400">
                                    {error}
                                </Text>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="mt-6 flex flex-col sm:flex-row gap-3">
                            <SmartButton
                                onClick={handleRedeem}
                                size="lg"
                                className="flex-1"
                                disabled={isRedeeming || isExpired}
                            >
                                {isRedeeming ? (
                                    <>
                                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                        Hediye Kullanılıyor...
                                    </>
                                ) : isExpired ? (
                                    "Link Süresi Dolmuş"
                                ) : (
                                    <>
                                        <CheckCircle2 className="mr-2 h-5 w-5" />
                                        Makaleyi Oku
                                    </>
                                )}
                            </SmartButton>
                            <Button
                                onClick={() => router.push("/")}
                                variant="outline"
                                size="lg"
                            >
                                Ana Sayfaya Dön
                            </Button>
                        </div>

                        {/* Info Box */}
                        <div className={cn("mt-6 p-4 rounded-lg", colors.background.base, "border", colors.border.DEFAULT)}>
                            <Text variant="caption" className={colors.foreground.muted}>
                                💡 <strong>Bilgi:</strong> Bu hediye linki kullanıldıktan sonra bir daha kullanılamaz.
                                Makaleyi okumak için hazır olduğunuzda yukarıdaki butona tıklayın.
                            </Text>
                        </div>
                    </div>
                </div>
            </Container>
        </div>
    );
}
