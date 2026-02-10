"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import Link from "next/link";
import { createPortal } from "react-dom";
import NextImage from "next/image";
import { X, Search, ChevronRight, Home, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { Heading, Text } from "@/components/ui/typography";
import { SmartButton } from "@/components/ui/smart-button";
import { UserMenu } from "./UserMenu";
import CinematicThemeSwitcher from "@/components/ui/cinematic-theme-switcher";
import { NavbarUsageMeter } from "@/components/paywall";
import { colors, typography, elevation, borderRadius, componentPadding } from "@/lib/design-tokens";

interface Category {
    slug: string;
    displayName: string;
    thumbnail?: string;
}

interface MobileSidebarProps {
    isOpen: boolean;
    onClose: () => void;
    categories: Category[];
    sidebarLinks: { label: string; href: string }[];
}

export default function MobileSidebar({
    isOpen,
    onClose,
    categories,
    sidebarLinks,
}: MobileSidebarProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [mounted, setMounted] = useState(false);
    const searchInputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();
    const { theme, resolvedTheme } = useTheme();

    useEffect(() => {
        setMounted(true);
    }, []);

    // Only calculate isDark after hydration to prevent mismatch
    const isDark = mounted && (theme === 'dark' || resolvedTheme === 'dark');

    // #region agent log
    useEffect(() => {
        if (mounted) {
            fetch('http://127.0.0.1:7244/ingest/146da770-4a69-4ea0-9f3a-c8d3db6921c4', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ location: 'MobileSidebar.tsx:49', message: 'Dark mode state', data: { theme, resolvedTheme, isDark, mounted, htmlClasses: document.documentElement.className }, timestamp: Date.now(), sessionId: 'debug-session', runId: 'run1', hypothesisId: 'C' }) }).catch(() => { });
        }
    }, [mounted, theme, resolvedTheme, isDark]);
    // #endregion

    // Auto-focus search on open
    useEffect(() => {
        if (isOpen && searchInputRef.current) {
            setTimeout(() => searchInputRef.current?.focus(), 100);
        }
    }, [isOpen]);

    // Handle search submit
    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
            onClose();
        }
    };

    // Category thumbnails - use first letter as fallback
    const categoryThumbnails = useMemo(() => {
        return categories.slice(0, 6).map((cat) => ({
            ...cat,
            thumbnail: cat.thumbnail || `/assets/images/categories/${cat.slug}.jpg`,
        }));
    }, [categories]);


    if (!mounted) return null;

    // Use a portal to move the sidebar outside of any stacking contexts (header/layout)
    // This ensures it stays on top of everything including sticky elements and transforming content
    return createPortal(
        <AnimatePresence mode="wait">
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 z-[9998] bg-black/60 backdrop-blur-sm md:hidden"
                        onClick={onClose}
                    />

                    {/* Sidebar Panel */}
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
                        className={cn(
                            "fixed top-0 bottom-0 right-0 z-[9999] w-[85vw] max-w-[340px] md:hidden",
                            "flex flex-col overflow-hidden",
                            "bg-[#F8F5E4] dark:bg-[#374152]",
                            "rounded-l-[32px]", // Gemini-style rounded left corners
                            elevation[5]
                        )}
                        style={{ left: "auto" }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header with Close Button */}
                        <div className="flex items-center justify-between p-4 pl-6 border-b border-gray-200/50 dark:border-gray-700/50">
                            <Link href="/" onClick={onClose} className="flex items-center">
                                {/* Single Logo - Adapts to Dark Mode automatically */}
                                <NextImage
                                    src={mounted && isDark ? "/assets/images/Standart/icon-alternative2.svg" : "/assets/images/Standart/icon-alternative.svg"}
                                    alt="Scrolli"
                                    width={32}
                                    height={32}
                                    className="h-8 w-8"
                                    unoptimized
                                />
                            </Link>
                            <button
                                onClick={onClose}
                                className={cn(
                                    "p-2 rounded-full",
                                    "bg-white dark:bg-gray-800",
                                    "hover:bg-gray-100 dark:hover:bg-gray-700",
                                    "border border-gray-100 dark:border-gray-700",
                                    "transition-colors focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
                                )}
                                aria-label="Close menu"
                            >
                                <X className="h-5 w-5 text-gray-700 dark:text-gray-100" />
                            </button>
                        </div>

                        {/* Scrollable Content */}
                        <div className="flex-1 overflow-visible">
                            {/* Search Bar */}
                            <div className="p-4 pt-6">
                                <form onSubmit={handleSearch}>
                                    <div className="relative">
                                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                        <input
                                            ref={searchInputRef}
                                            type="text"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            placeholder="Ara..."
                                            className={cn(
                                                "w-full h-12 pl-12 pr-4",
                                                "bg-white dark:bg-gray-800",
                                                "text-gray-900 dark:text-gray-100",
                                                "placeholder:text-gray-400 dark:placeholder:text-gray-500",
                                                "rounded-full",
                                                "focus:outline-none focus:ring-2 focus:ring-primary/50",
                                                "transition-all"
                                                // Removed border to fix "thick gray corner" look
                                            )}
                                        />
                                        {searchQuery && (
                                            <button
                                                type="button"
                                                onClick={() => setSearchQuery("")}
                                                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                                            >
                                                <X className="h-4 w-4 text-gray-400" />
                                            </button>
                                        )}
                                    </div>
                                </form>
                            </div>

                            {/* Quick Actions */}
                            <div className="px-4 pb-4 flex gap-3">
                                <Link
                                    href="/"
                                    onClick={onClose}
                                    ref={(el) => {
                                        // #region agent log
                                        if (el) {
                                            const span = el.querySelector('span');
                                            if (span) {
                                                const computed = window.getComputedStyle(span);
                                                fetch('http://127.0.0.1:7244/ingest/146da770-4a69-4ea0-9f3a-c8d3db6921c4', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ location: 'MobileSidebar.tsx:190', message: 'Span color debug', data: { isDark, computedColor: computed.color, computedClasses: span.className, parentColor: window.getComputedStyle(el).color, hasDarkMode: document.documentElement.classList.contains('dark') || document.documentElement.classList.contains('dark-mode') }, timestamp: Date.now(), sessionId: 'debug-session', runId: 'run1', hypothesisId: 'A' }) }).catch(() => { });
                                            }
                                        }
                                        // #endregion
                                    }}
                                    className={cn(
                                        "flex-1 flex items-center justify-center gap-2 h-11",
                                        "bg-white dark:bg-gray-800",
                                        "text-gray-900 dark:text-gray-100",
                                        "rounded-xl border border-gray-200 dark:border-gray-700",
                                        "hover:bg-gray-50 dark:hover:bg-gray-700/80",
                                        "transition-colors shadow-sm"
                                    )}
                                >
                                    <Home className="h-4 w-4 text-gray-900 dark:text-gray-100" />
                                    <span
                                        className="text-sm font-medium text-black dark:text-gray-100 mobile-sidebar-anasayfa-text"
                                        ref={(el) => {
                                            // #region agent log
                                            if (el) {
                                                const computed = window.getComputedStyle(el);
                                                const parent = el.parentElement;
                                                fetch('http://127.0.0.1:7244/ingest/146da770-4a69-4ea0-9f3a-c8d3db6921c4', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ location: 'MobileSidebar.tsx:190', message: 'Span element debug POST-FIX', data: { computedColor: computed.color, actualClasses: el.className, parentComputedColor: parent ? window.getComputedStyle(parent).color : null, isDarkMode: document.documentElement.classList.contains('dark') || document.documentElement.classList.contains('dark-mode'), hasImportant: computed.getPropertyValue('color').includes('important'), inlineStyle: el.style.color }, timestamp: Date.now(), sessionId: 'debug-session', runId: 'post-fix', hypothesisId: 'B' }) }).catch(() => { });
                                            }
                                            // #endregion
                                        }}
                                    >
                                        Ana Sayfa
                                    </span>
                                </Link>
                                <Link
                                    href="/pricing"
                                    onClick={onClose}
                                    className={cn(
                                        "flex-1 flex items-center justify-center gap-2 h-11",
                                        "bg-gradient-to-t from-[#1F2937] via-[#374152] to-[#6B7280]", // Replaced generic bg-primary with brand charcoal gradient
                                        "text-white shadow-sm",
                                        "rounded-xl",
                                        "hover:opacity-90",
                                        "transition-opacity"
                                    )}
                                >
                                    <Sparkles className="h-4 w-4" />
                                    <span className="text-sm font-medium">Premium</span>
                                </Link>
                            </div>

                            {/* Categories Section */}
                            <div className="px-4 pb-4">
                                <div className="flex items-center justify-between mb-3">
                                    <Text variant="caption" className="tracking-wider font-semibold text-gray-500 dark:text-gray-400">
                                        Kategoriler
                                    </Text>
                                    <Link
                                        href="/categories"
                                        onClick={onClose}
                                        className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 flex items-center gap-0.5"
                                    >
                                        Tümü <ChevronRight className="h-3 w-3" />
                                    </Link>
                                </div>
                                <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-none">
                                    {categoryThumbnails.map((cat) => (
                                        <Link
                                            key={cat.slug}
                                            href={`/categories?cat=${cat.slug}`}
                                            onClick={onClose}
                                            className={cn(
                                                "flex-shrink-0 w-20 group",
                                                "active:scale-[0.97] transition-transform"
                                            )}
                                        >
                                            <div className={cn(
                                                "w-20 h-20 rounded-2xl overflow-hidden mb-1.5",
                                                "bg-gray-200 dark:bg-gray-700",
                                                "border border-gray-200/50 dark:border-gray-700/50",
                                                "relative"
                                            )}>
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <span className="text-2xl font-bold text-gray-400 dark:text-gray-500">
                                                        {cat.displayName.charAt(0)}
                                                    </span>
                                                </div>
                                            </div>
                                            <Text variant="caption" className="text-center text-gray-700 dark:text-gray-300 truncate block text-xs">
                                                {cat.displayName}
                                            </Text>
                                        </Link>
                                    ))}
                                </div>
                            </div>

                            {/* Divider */}
                            <div className="mx-4 border-t border-gray-200/50 dark:border-gray-700/50" />

                            {/* Navigation Links */}
                            <nav className="p-4 space-y-1">
                                {sidebarLinks.map((link) => (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        onClick={onClose}
                                        className={cn(
                                            "flex items-center justify-between py-3 px-3 -mx-3",
                                            "rounded-xl",
                                            "text-gray-700 dark:text-gray-300",
                                            "hover:bg-gray-100/50 dark:hover:bg-gray-700/30",
                                            "transition-colors"
                                        )}
                                    >
                                        <Text variant="body" className="font-medium">
                                            {link.label}
                                        </Text>
                                        <ChevronRight className="h-4 w-4 text-gray-400" />
                                    </Link>
                                ))}
                            </nav>
                        </div>

                        {/* Footer - User Section */}
                        <div className="border-t border-gray-200/50 dark:border-gray-700/50 p-4 space-y-4">
                            {/* Usage Meter */}
                            <div className="flex items-center justify-center">
                                <NavbarUsageMeter />
                            </div>

                            {/* User Menu */}
                            <div onClick={onClose}>
                                <UserMenu />
                            </div>

                            {/* Theme Toggle */}
                            <div className="flex items-center justify-end pt-2">
                                <CinematicThemeSwitcher />
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>,
        document.body
    );
}
