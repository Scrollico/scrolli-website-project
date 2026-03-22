"use client";

import { useState } from "react";
import Image from "next/image";
import { Plus, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { colors, gap } from "@/lib/design-tokens";
import AlaraWPBanner from "./alara-wp-banner";

interface AlaraWPButtonProps {
    className?: string;
}

export default function AlaraWPButton({ className }: AlaraWPButtonProps) {
    const [isFollowing, setIsFollowing] = useState(false);
    const [showBanner, setShowBanner] = useState(false);

    const handleClick = () => {
        if (!isFollowing) {
            setIsFollowing(true);
            setShowBanner(true);
        } else {
            setIsFollowing(false);
        }
    };

    return (
        <>
            <button
                onClick={handleClick}
                className={cn(
                    "group flex items-center pl-1 pr-4 py-1 rounded-full",
                    gap.md,
                    colors.background.base,
                    "border", colors.border.DEFAULT,
                    "hover:bg-muted dark:hover:bg-gray-700",
                    "transition-all duration-200 shadow-sm",
                    className
                )}
            >
                <div className="relative w-8 h-8 rounded-full overflow-hidden border border-gray-100 dark:border-gray-600">
                    <Image
                        src="/assets/images/alara-sm.webp"
                        alt="Alara AI"
                        fill
                        className="object-cover"
                    />
                </div>

                <div className="flex flex-col items-start leading-none">
                    <span className={cn("text-[13px]", colors.foreground.primary)}>
                        <span className="font-bold">Subscribe</span> Alara AI
                    </span>
                </div>

                <div className={cn(
                    "ml-1 flex items-center justify-center w-5 h-5 rounded-full border transition-colors",
                    isFollowing
                        ? "bg-green-600 border-green-600 text-white"
                        : "border-gray-300 dark:border-gray-500 text-gray-400 group-hover:border-gray-400"
                )}>
                    {isFollowing ? (
                        <Check size={12} strokeWidth={3} />
                    ) : (
                        <Plus size={12} strokeWidth={3} />
                    )}
                </div>
            </button>

            <AlaraWPBanner
                isOpen={showBanner}
                onClose={() => setShowBanner(false)}
            />
        </>
    );
}
