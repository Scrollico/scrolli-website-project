'use client';

import { useEffect } from 'react';
import { cn } from '@/lib/utils';
import { colors, componentPadding } from '@/lib/design-tokens';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error('Application error:', error);
    }, [error]);

    return (
        <div className={cn("flex flex-col items-center justify-center min-h-[60vh] text-center", componentPadding.md)}>
            <h2 className="text-2xl font-bold mb-4">Something went wrong!</h2>
            <p className={cn("mb-8 max-w-md", colors.foreground.secondary)}>
                We apologize for the inconvenience. An unexpected error occurred.
            </p>
            <button
                onClick={() => reset()}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
                Try again
            </button>
        </div>
    );
}
