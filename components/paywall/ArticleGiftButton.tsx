"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/auth-provider";
import { GiftArticleModal } from "@/components/paywall";
import { SmartButton } from "@/components/ui/smart-button";
import { Gift } from "lucide-react";

interface ArticleGiftButtonProps {
    articleId: string;
    articleTitle?: string;
    className?: string;
    variant?: "default" | "outline" | "ghost" | "link" | "periwinkle";
}

/**
 * ArticleGiftButton - Button to gift an article
 * Shows on every article page for authenticated non-premium users
 */
export function ArticleGiftButton({ articleId, articleTitle, className, variant = "periwinkle" }: ArticleGiftButtonProps) {
    const { user } = useAuth();
    const [showModal, setShowModal] = useState(false);

    const router = useRouter();

    const handleClick = () => {
        // Strict check for authenticated user
        if (!user || user.role !== 'authenticated') {
            console.log("User not authenticated, redirecting to sign-in");
            const redirectUrl = `/sign-in?next=${encodeURIComponent(`/${articleId}`)}`;
            router.push(redirectUrl);
            return;
        }
        setShowModal(true);
    };

    return (
        <>
            <SmartButton
                onClick={handleClick}
                variant={variant}
                size="sm"
                className={className}
            >
                <Gift className="h-4 w-4 mr-2" />
                Makale Hediye Et
            </SmartButton>

            {showModal && (
                <GiftArticleModal
                    articleId={articleId}
                    articleTitle={articleTitle}
                    onClose={() => setShowModal(false)}
                    onSuccess={() => {
                        // Modal will auto-close
                    }}
                />
            )}
        </>
    );
}
