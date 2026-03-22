'use client';

import { cn } from '@/lib/utils';
import { colors, componentPadding } from '@/lib/design-tokens';

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <html>
            <body className={cn(colors.background.base, colors.foreground.primary, "flex items-center justify-center min-h-screen font-sans")}>
                <div className={cn("text-center max-w-md", componentPadding.lg)}>
                    <h1 className="text-4xl font-bold mb-4">Something went wrong</h1>
                    <p className={cn("mb-8", colors.foreground.secondary)}>
                        We encountered a critical error. Please try again later.
                    </p>
                    <button
                        onClick={() => reset()}
                        className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                        Try again
                    </button>
                </div>
            </body>
        </html>
    );
}
