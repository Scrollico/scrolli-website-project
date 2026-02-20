'use client';

import { useEffect } from 'react';

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
        <div className="flex flex-col items-center justify-center min-h-[60vh] p-4 text-center">
            <h2 className="text-2xl font-bold mb-4">Something went wrong!</h2>
            <p className="mb-8 text-gray-600 dark:text-gray-400 max-w-md">
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
