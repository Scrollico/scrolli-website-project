"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Heading, Text } from "@/components/ui/typography";
import { useEffect, useState } from "react";
import { componentPadding } from "@/lib/design-tokens";

interface HikayeLoaderProps {
    isLoading: boolean;
    progress: number;
}

export function HikayeLoader({ isLoading, progress }: HikayeLoaderProps) {
    // Start true to mount instantly
    const [show, setShow] = useState(true);

    useEffect(() => {
        if (!isLoading) {
            // Delay unmount to allow exit animation to play
            const timer = setTimeout(() => setShow(false), 1000);
            return () => clearTimeout(timer);
        } else {
            setShow(true);
            return undefined;
        }
    }, [isLoading]);

    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{
                        opacity: 0,
                        y: -30,
                        transition: { duration: 1, ease: [0.65, 0, 0.35, 1] }
                    }}
                    className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#F8F5E4] dark:bg-[#374152]"
                >
                    <div className={`w-full max-w-xs flex flex-col items-center ${componentPadding.md}`}>
                        {/* Logo or Brand Mark (Optional, keeping it minimal) */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="mb-8"
                        >
                            <Heading variant="h2" className="tracking-[0.2em] text-[#374152] dark:text-[#F8F5E4]">
                                SCROLLI
                            </Heading>
                        </motion.div>

                        {/* Progress Percentage */}
                        <div className="relative w-full mb-4">
                            <div className="flex justify-between items-baseline mb-2">
                                <Text variant="caption" className="text-[#374152]/60 dark:text-[#F8F5E4]/60 tracking-widest">
                                    Loading Story
                                </Text>
                                <motion.span
                                    className="text-2xl font-medium tabular-nums text-[#374152] dark:text-[#F8F5E4]"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                >
                                    {Math.round(progress)}%
                                </motion.span>
                            </div>

                            {/* Progress Bar Track */}
                            <div className="h-[2px] w-full bg-[#374152]/10 dark:bg-[#F8F5E4]/10 rounded-full overflow-hidden">
                                {/* Progress Bar Fill */}
                                <motion.div
                                    className="h-full bg-[#8080FF]"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progress}%` }}
                                    transition={{ ease: "easeOut", duration: 0.3 }}
                                />
                            </div>
                        </div>

                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className="text-xs tracking-[0.3em] text-[#374152]/40 dark:text-[#F8F5E4]/40 mt-4"
                        >
                            Please Wait
                        </motion.p>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
