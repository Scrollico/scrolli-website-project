"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { X, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";

interface AlaraWPBannerProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function AlaraWPBanner({ isOpen, onClose }: AlaraWPBannerProps) {
    const [isMounted, setIsMounted] = useState(false);
    const { theme, resolvedTheme } = useTheme();

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) return null;

    const isDark = theme === 'dark' || resolvedTheme === 'dark';

    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 z-[9998] bg-black/20 backdrop-blur-[2px]"
                    />

                    {/* Banner */}
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className={cn(
                            "fixed z-[9999] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
                            "w-[90vw] max-w-[400px]",
                            isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200",
                            "rounded-xl shadow-2xl",
                            "border",
                            "overflow-hidden"
                        )}
                    >
                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="absolute top-3 right-3 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                        >
                            <X size={20} />
                        </button>

                        <div className="flex flex-col items-center text-center p-8 pt-10">
                            {/* Profile Image */}
                            <div className="relative w-16 h-16 rounded-full overflow-hidden mb-4 border-2 border-white dark:border-gray-800 shadow-sm">
                                <Image
                                    src="/assets/images/alara-sm.webp"
                                    alt="Alara AI"
                                    fill
                                    className="object-cover"
                                />
                            </div>

                            {/* Title */}
                            <h2 className="text-2xl font-serif font-bold text-gray-900 dark:text-white mb-2">
                                Alara AI
                            </h2>

                            {/* Description */}
                            <p className="text-gray-600 dark:text-gray-300 text-[15px] leading-relaxed mb-6">
                                You'll see more on this topic in your recommendations.
                            </p>

                            {/* Following Button */}
                            <button
                                className={cn(
                                    "flex items-center gap-2 px-6 py-2.5 rounded-full",
                                    "bg-white dark:bg-gray-800",
                                    "border border-gray-300 dark:border-gray-600",
                                    "text-gray-900 dark:text-white font-medium text-sm",
                                    "hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                )}
                            >
                                <span>Following</span>
                                <Check size={16} />
                            </button>

                            {/* Newsletter Toggle (Optional - mimicking the WP screenshot) */}
                            <div className="w-full mt-8 pt-6 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
                                <div className="text-left">
                                    <div className="font-bold text-sm text-gray-900 dark:text-white">The 7: Tracking Alara newsletter</div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400">Catch up quickly every weeknight</div>
                                </div>
                                <div className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 dark:bg-gray-700">
                                    <span className="translate-x-6 inline-block h-4 w-4 transform rounded-full bg-white transition" />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>,
        document.body
    );
}
