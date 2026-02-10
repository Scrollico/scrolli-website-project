"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/auth-provider";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { badge as badgeTokens, colors } from "@/lib/design-tokens";
import Link from "next/link";

export default function ProfilePage() {
    const { user, profile, isPremium, loading, signOut } = useAuth();
    const router = useRouter();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!loading && mounted && !user) {
            router.replace("/sign-in");
        }
    }, [user, loading, mounted, router]);

    if (loading || !mounted || !user) {
        return (
            <Layout>
                <div className={cn("flex min-h-[70vh] items-center justify-center", colors.background.base)}>
                    <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                </div>
            </Layout>
        );
    }

    // Format account ID (first 8 characters)
    const accountId = user.id.substring(0, 8);
    const userEmail = user.email || "N/A";

    // Calculate next bill date (30 days from now for demo)
    const nextBillDate = new Date();
    nextBillDate.setDate(nextBillDate.getDate() + 30);
    const formattedDate = nextBillDate.toLocaleDateString("tr-TR", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    return (
        <Layout>
            <div className={cn(
                "min-h-screen transition-colors duration-500",
                colors.background.base,
                colors.foreground.primary
            )}>
                {/* Main Grid Container - WordPress.com style */}
                <main className="grid max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 gap-4 md:gap-6">
                    {/* Page Header */}
                    <div className="mb-8">
                        <h1 className="text-2xl md:text-3xl font-bold mb-2">Scrolli Hesabım</h1>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            {userEmail}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                            Hesap ID: {accountId}
                        </p>
                    </div>

                    {/* Account Info Card */}
                    <div className="antialiased body bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 rounded p-4 md:p-6 lg:p-8">
                        <h2 className="text-lg font-semibold mb-4">Hesap Bilgileri</h2>
                        <div className="space-y-3">
                            <div>
                                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 tracking-wide mb-1">
                                    E-posta
                                </p>
                                <p className="text-sm font-medium">{userEmail}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                                    Giriş yapmak için bu e-postayı kullanın. Bildirimler de bu adrese gönderilir.
                                </p>
                            </div>
                            <div className="pt-3 border-t border-gray-200 dark:border-gray-800">
                                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 tracking-wide mb-1">
                                    Hesap ID
                                </p>
                                <p className="text-sm font-mono">{accountId}</p>
                            </div>
                        </div>
                    </div>

                    {/* Subscription & Billing Card */}
                    <div className="antialiased body bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 rounded p-4 md:p-6 lg:p-8">
                        <h2 className="text-lg font-semibold mb-4">Abonelik & Faturalama</h2>
                        
                        <div className="space-y-4">
                            {/* Current Plan */}
                            <div>
                                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 tracking-wide mb-2">
                                    Erişiminiz
                                </p>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className={cn(
                                                "inline-flex items-center gap-1.5 rounded-full text-xs font-bold tracking-wider",
                                                badgeTokens.padding,
                                                isPremium 
                                                    ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800"
                                                    : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600"
                                            )}>
                                                {isPremium ? "Premium" : "Standart"}
                                            </span>
                                        </div>
                                        <p className="text-sm font-medium">
                                            {isPremium ? "Scrolli Premium" : "Scrolli Standart"}
                                        </p>
                                    </div>
                                    {!isPremium && (
                                        <Link href="/pricing">
                                            <Button 
                                                size="sm" 
                                                className="h-8 text-xs font-semibold"
                                            >
                                                Premium'a Geç
                                            </Button>
                                        </Link>
                                    )}
                                </div>
                            </div>

                            {/* Next Bill Date (only for premium) */}
                            {isPremium && (
                                <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
                                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 tracking-wide mb-1">
                                        Sonraki Fatura
                                    </p>
                                    <p className="text-sm">
                                        €{isPremium ? "60" : "0"} - {formattedDate}
                                    </p>
                                </div>
                            )}

                            {/* Manage Subscription */}
                            <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
                                <Link href="/pricing">
                                    <Button 
                                        variant="outline" 
                                        size="sm" 
                                        className="h-8 text-xs font-semibold"
                                    >
                                        {isPremium ? "Aboneliği Yönet veya İptal Et" : "Paketi Yükselt"}
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Benefits Card */}
                    {isPremium && (
                        <div className="antialiased body bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 rounded p-4 md:p-6 lg:p-8">
                            <h2 className="text-lg font-semibold mb-4">Avantajlarınızı Keşfedin</h2>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                                Aboneliğiniz size ekstra erişim ve ayrıcalıklar sağlar.
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {[
                                    "Sınırsız Premium içerik",
                                    "Reklamsız deneyim",
                                    "Özel bültenler",
                                    "AI analiz araçları",
                                    "Öncelikli destek",
                                    "Özel etkinliklere erişim",
                                ].map((benefit, index) => (
                                    <div key={index} className="flex items-start gap-2">
                                        <svg
                                            className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M5 13l4 4L19 7"
                                            />
                                        </svg>
                                        <p className="text-sm text-gray-700 dark:text-gray-300">{benefit}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Upgrade CTA (for non-premium users) */}
                    {!isPremium && (
                        <div className="antialiased body bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border border-green-200 dark:border-green-800 rounded p-4 md:p-6 lg:p-8">
                            <h2 className="text-lg font-semibold mb-2">Premium'a Geçin</h2>
                            <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
                                Sınırsız içerik, özel bültenler ve reklamsız deneyim.
                            </p>
                            <Link href="/pricing">
                                <Button 
                                    className="bg-green-600 hover:bg-green-700 text-white"
                                >
                                    Hemen Yükselt
                                </Button>
                            </Link>
                        </div>
                    )}

                    {/* Sign Out */}
                    <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-800">
                        <Button
                            variant="outline"
                            onClick={async () => {
                                await signOut();
                                router.replace("/");
                            }}
                            className="text-red-600 dark:text-red-400 border-red-200 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-900/20"
                        >
                            Çıkış Yap
                        </Button>
                    </div>
                </main>
            </div>
        </Layout>
    );
}
