"use client";

export const runtime = "edge";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/auth-provider";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { colors, sectionPadding, containerPadding } from "@/lib/design-tokens";
import Link from "next/link";
import { User, Mail, Hash, Crown, CreditCard, Star, Shield, Newspaper, Headphones, CalendarHeart, LogOut } from "lucide-react";

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

    const accountId = user.id.substring(0, 8);
    const userEmail = user.email || "N/A";
    const displayName = profile?.full_name || userEmail.split("@")[0];

    const nextBillDate = new Date();
    nextBillDate.setDate(nextBillDate.getDate() + 30);
    const formattedDate = nextBillDate.toLocaleDateString("tr-TR", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    const benefits = [
        { icon: Crown, label: "Sınırsız Premium içerik" },
        { icon: Shield, label: "Reklamsız deneyim" },
        { icon: Newspaper, label: "Özel bültenler" },
        { icon: Star, label: "AI analiz araçları" },
        { icon: Headphones, label: "Öncelikli destek" },
        { icon: CalendarHeart, label: "Özel etkinliklere erişim" },
    ];

    return (
        <Layout>
            <div className={cn(
                "min-h-screen",
                colors.background.base,
                colors.foreground.primary
            )}>
                <main className={cn("max-w-2xl mx-auto", sectionPadding.lg, containerPadding.md)}>

                    {/* Profile Header */}
                    <div className="flex items-center gap-5 mb-12">
                        <div className="h-16 w-16 rounded-full bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-center flex-shrink-0">
                            {profile?.avatar_url ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={profile.avatar_url} alt="Avatar" className="h-full w-full object-cover rounded-full" />
                            ) : (
                                <User className="h-7 w-7 text-gray-400 dark:text-gray-500" />
                            )}
                        </div>
                        <div>
                            <div className="flex items-center gap-2.5 mb-1">
                                <h1 className="text-2xl font-bold">{displayName}</h1>
                                {isPremium && (
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#8080FF]/10 text-[#8080FF] dark:bg-[#8080FF]/20">
                                        Plus
                                    </span>
                                )}
                            </div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{userEmail}</p>
                        </div>
                    </div>

                    {/* Account Info */}
                    <section className="mb-10">
                        <h2 className="text-xs font-semibold tracking-widest uppercase text-gray-400 dark:text-gray-500 mb-4">
                            Hesap Bilgileri
                        </h2>
                        <div className="rounded-xl border border-gray-200/80 dark:border-gray-700/60 overflow-hidden">
                            <div className="flex items-center gap-4 px-5 py-4 border-b border-gray-100 dark:border-gray-800/60">
                                <Mail className="h-4 w-4 text-gray-400 dark:text-gray-500 flex-shrink-0" />
                                <div className="min-w-0">
                                    <p className="text-[13px] text-gray-500 dark:text-gray-400">E-posta</p>
                                    <p className="text-sm font-medium truncate">{userEmail}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 px-5 py-4">
                                <Hash className="h-4 w-4 text-gray-400 dark:text-gray-500 flex-shrink-0" />
                                <div className="min-w-0">
                                    <p className="text-[13px] text-gray-500 dark:text-gray-400">Hesap ID</p>
                                    <p className="text-sm font-mono font-medium">{accountId}</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Subscription */}
                    <section className="mb-10">
                        <h2 className="text-xs font-semibold tracking-widest uppercase text-gray-400 dark:text-gray-500 mb-4">
                            Abonelik
                        </h2>
                        <div className="rounded-xl border border-gray-200/80 dark:border-gray-700/60 overflow-hidden">
                            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-800/60">
                                <div className="flex items-center gap-4">
                                    <Crown className={cn("h-4 w-4 flex-shrink-0", isPremium ? "text-[#8080FF]" : "text-gray-400 dark:text-gray-500")} />
                                    <div>
                                        <p className="text-[13px] text-gray-500 dark:text-gray-400">Mevcut Plan</p>
                                        <p className="text-sm font-medium">
                                            {isPremium ? "Scrolli Plus" : "Scrolli Standart"}
                                        </p>
                                    </div>
                                </div>
                                {!isPremium && (
                                    <Link href="/pricing">
                                        <Button size="sm" className="h-8 text-xs font-semibold rounded-lg">
                                            Yükselt
                                        </Button>
                                    </Link>
                                )}
                            </div>

                            {isPremium && (
                                <div className="flex items-center gap-4 px-5 py-4 border-b border-gray-100 dark:border-gray-800/60">
                                    <CreditCard className="h-4 w-4 text-gray-400 dark:text-gray-500 flex-shrink-0" />
                                    <div>
                                        <p className="text-[13px] text-gray-500 dark:text-gray-400">Sonraki Fatura</p>
                                        <p className="text-sm font-medium">€60 · {formattedDate}</p>
                                    </div>
                                </div>
                            )}

                            <div className="px-5 py-4">
                                <Link href="/pricing">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="h-8 text-xs font-semibold rounded-lg"
                                    >
                                        {isPremium ? "Aboneliği Yönet" : "Planları Gör"}
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </section>

                    {/* Benefits (Premium only) */}
                    {isPremium && (
                        <section className="mb-10">
                            <h2 className="text-xs font-semibold tracking-widest uppercase text-gray-400 dark:text-gray-500 mb-4">
                                Avantajlarınız
                            </h2>
                            <div className="rounded-xl border border-gray-200/80 dark:border-gray-700/60 overflow-hidden">
                                <div className="grid grid-cols-1 sm:grid-cols-2">
                                    {benefits.map((benefit, index) => (
                                        <div
                                            key={index}
                                            className={cn(
                                                "flex items-center gap-3 px-5 py-3.5",
                                                index < benefits.length - (benefits.length % 2 === 0 ? 2 : 1) && "border-b border-gray-100 dark:border-gray-800/60",
                                                index % 2 === 0 && "sm:border-r sm:border-r-gray-100 sm:dark:border-r-gray-800/60"
                                            )}
                                        >
                                            <benefit.icon className="h-4 w-4 text-[#8080FF] flex-shrink-0" />
                                            <span className="text-sm">{benefit.label}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>
                    )}

                    {/* Upgrade CTA (non-premium) */}
                    {!isPremium && (
                        <section className="mb-10">
                            <div className="rounded-xl bg-gradient-to-br from-[#8080FF]/5 to-[#8080FF]/10 dark:from-[#8080FF]/10 dark:to-[#8080FF]/5 border border-[#8080FF]/20 p-6">
                                <div className="flex items-start gap-4">
                                    <div className="h-10 w-10 rounded-xl bg-[#8080FF]/10 flex items-center justify-center flex-shrink-0">
                                        <Star className="h-5 w-5 text-[#8080FF]" />
                                    </div>
                                    <div>
                                        <h3 className="text-base font-semibold mb-1">Scrolli Plus&apos;a Geçin</h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                                            Sınırsız içerik, özel bültenler ve reklamsız deneyim.
                                        </p>
                                        <Link href="/pricing">
                                            <Button size="sm" className="h-9 text-xs font-semibold rounded-lg">
                                                Hemen Yükselt
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </section>
                    )}

                    {/* Sign Out */}
                    <div className="pt-6 border-t border-gray-200/60 dark:border-gray-800/60">
                        <button
                            onClick={async () => {
                                await signOut();
                                router.replace("/");
                            }}
                            className="flex items-center gap-2.5 text-sm text-red-500 dark:text-red-400 hover:opacity-70 transition-opacity"
                        >
                            <LogOut className="h-4 w-4" />
                            <span>Çıkış Yap</span>
                        </button>
                    </div>
                </main>
            </div>
        </Layout>
    );
}
