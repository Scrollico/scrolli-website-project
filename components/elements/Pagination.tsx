"use client";

import { cn } from "@/lib/utils";
import {
  colors,
  borderRadius,
  border,
  componentPadding,
  typography,
  transition,
  button
} from "@/lib/design-tokens";
import { ChevronRight } from "lucide-react";
import { useRef, useEffect } from "react";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange?: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
    const scrollPositionRef = useRef<number>(0);
    const isChangingPageRef = useRef<boolean>(false);

    useEffect(() => {
        if (isChangingPageRef.current) {
            // Restore scroll position after page change
            const savedPosition = scrollPositionRef.current;
            requestAnimationFrame(() => {
                window.scrollTo({
                    top: savedPosition,
                    behavior: 'instant' as ScrollBehavior
                });
                // Double check after a short delay
                setTimeout(() => {
                    window.scrollTo({
                        top: savedPosition,
                        behavior: 'instant' as ScrollBehavior
                    });
                }, 0);
            });
            isChangingPageRef.current = false;
        }
    }, [currentPage]);

    const handlePageChange = (page: number, e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        e.stopPropagation();
        
        // Save current scroll position
        scrollPositionRef.current = window.scrollY;
        isChangingPageRef.current = true;
        
        // Prevent any default scroll behavior
        const savedPosition = scrollPositionRef.current;
        
        onPageChange?.(page);
        
        // Immediately restore scroll position
        window.scrollTo({
            top: savedPosition,
            behavior: 'instant' as ScrollBehavior
        });
        
        // Restore again after render
        requestAnimationFrame(() => {
            window.scrollTo({
                top: savedPosition,
                behavior: 'instant' as ScrollBehavior
            });
        });
    };

    const renderPageNumbers = () => {
        const pages = [];
        const maxVisiblePages = 5;
        const halfVisible = Math.floor(maxVisiblePages / 2);

        let startPage = Math.max(1, currentPage - halfVisible);
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        // First page
        if (startPage > 1) {
            pages.push(
                <li key="1">
                    <button 
                        type="button" 
                        onClick={(e) => handlePageChange(1, e)}
                        className={cn(
                            button.padding.sm,
                            borderRadius.md,
                            colors.foreground.secondary,
                            "hover:bg-gray-100 dark:hover:bg-gray-700",
                            transition.normal,
                            "font-normal",
                            "inline-flex items-center justify-center",
                            "min-w-[2.5rem]"
                        )}
                    >
                        1
                    </button>
                </li>
            );
            if (startPage > 2) {
                pages.push(
                    <li key="ellipsis-start">
                        <span className={cn("px-2", colors.foreground.muted)}>...</span>
                    </li>
                );
            }
        }

        // Page numbers
        for (let i = startPage; i <= endPage; i++) {
            pages.push(
                <li key={i}>
                    {i === currentPage ? (
                        <button
                            type="button"
                            aria-current="page"
                            disabled
                            className={cn(
                                button.padding.sm,
                                borderRadius.md,
                                colors.primary.bg,
                                colors.foreground.onDark,
                                "font-normal",
                                "inline-flex items-center justify-center",
                                "min-w-[2.5rem]"
                            )}
                        >
                            {i}
                        </button>
                    ) : (
                        <button
                            type="button"
                            onClick={(e) => handlePageChange(i, e)}
                            className={cn(
                                button.padding.sm,
                                borderRadius.md,
                                colors.foreground.secondary,
                                "hover:bg-gray-100 dark:hover:bg-gray-700",
                                "hover:opacity-90",
                                transition.normal,
                                "font-normal",
                                "inline-flex items-center justify-center",
                                "min-w-[2.5rem]"
                            )}
                        >
                            {i}
                        </button>
                    )}
                </li>
            );
        }

        // Last page
        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                pages.push(
                    <li key="ellipsis-end">
                        <span className={cn("px-2", colors.foreground.muted)}>...</span>
                    </li>
                );
            }
            pages.push(
                <li key={totalPages}>
                    <button 
                        type="button" 
                        onClick={(e) => handlePageChange(totalPages, e)}
                        className={cn(
                            button.padding.sm,
                            borderRadius.md,
                            colors.foreground.secondary,
                            "hover:bg-gray-100 dark:hover:bg-gray-700",
                            transition.normal,
                            "font-normal",
                            "inline-flex items-center justify-center",
                            "min-w-[2.5rem]"
                        )}
                    >
                        {totalPages}
                    </button>
                </li>
            );
        }

        return pages;
    };

    return (
        <nav aria-label="Pagination">
            <ul className={cn(
                "flex items-center justify-center gap-2 flex-wrap",
                typography.bodySmall
            )}>
                {renderPageNumbers()}
                {currentPage < totalPages && (
                    <li>
                        <button
                            type="button"
                            onClick={(e) => handlePageChange(Math.min(currentPage + 1, totalPages), e)}
                            className={cn(
                                button.padding.sm,
                                borderRadius.md,
                                colors.foreground.secondary,
                                "hover:bg-gray-100 dark:hover:bg-gray-700",
                                "hover:opacity-90",
                                transition.normal,
                                "flex items-center justify-center",
                                "min-w-[2.5rem]"
                            )}
                            aria-label="Next page"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </li>
                )}
            </ul>
        </nav>
    );
}
