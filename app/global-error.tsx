'use client';

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <html>
            <body className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 flex items-center justify-center min-h-screen font-sans">
                <div className="text-center p-8 max-w-md">
                    <h1 className="text-4xl font-bold mb-4">Something went wrong</h1>
                    <p className="mb-8 text-gray-600 dark:text-gray-400">
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
