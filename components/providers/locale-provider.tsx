"use client";

import React, { createContext, useContext, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { NEXT_LOCALE_COOKIE, Locale } from "@/lib/locale-config";

interface LocaleContextType {
    locale: Locale;
    setLocale: (newLocale: Locale) => void;
    isPending: boolean;
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

/**
 * LocaleProvider manages the application's current language state.
 * It persists the choice in a cookie so server components can access it.
 */
export function LocaleProvider({
    children,
    initialLocale = "tr",
}: {
    children: React.ReactNode;
    initialLocale?: Locale;
}) {
    const [locale, setLocaleState] = useState<Locale>(initialLocale);
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    // Update locale state and persist in cookie
    const setLocale = (newLocale: Locale) => {
        if (newLocale === locale) return;

        setLocaleState(newLocale);

        // Set cookie that expires in 1 year
        const expires = new Date();
        expires.setFullYear(expires.getFullYear() + 1);
        document.cookie = `${NEXT_LOCALE_COOKIE}=${newLocale}; path=/; expires=${expires.toUTCString()}; SameSite=Lax`;

        // Refresh the page to update server components with the new locale
        // Using reload for a full refresh ensures the RootLayout picks up the cookie
        startTransition(() => {
            window.location.reload();
        });
    };

    return (
        <LocaleContext.Provider value={{ locale, setLocale, isPending }}>
            {children}
        </LocaleContext.Provider>
    );
}

export function useLocale() {
    const context = useContext(LocaleContext);
    if (context === undefined) {
        throw new Error("useLocale must be used within a LocaleProvider");
    }
    return context;
}
