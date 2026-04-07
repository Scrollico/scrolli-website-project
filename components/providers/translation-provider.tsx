"use client"

import React, { createContext, useContext, useMemo } from "react"
import translations from "@/lib/translations"
import type { Locale } from "@/lib/locale-config"

interface TranslationContextType {
    t: (key: string, fallback?: string) => string
    strings: Record<string, string>
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined)

interface TranslationProviderProps {
    /** CMS-fetched strings — these override local dictionary values */
    initialStrings: Record<string, string>
    /** Current locale for selecting the right local dictionary */
    locale?: Locale
    children: React.ReactNode
}

export function TranslationProvider({
    initialStrings,
    locale = "tr",
    children,
}: TranslationProviderProps) {
    const merged = useMemo(() => {
        const localDict = translations[locale] ?? translations.tr;
        // Local dictionary is the base; CMS strings override
        return { ...localDict, ...initialStrings };
    }, [locale, initialStrings]);

    const t = (key: string, fallback?: string): string => {
        return merged[key] || fallback || key
    }

    return (
        <TranslationContext.Provider value={{ t, strings: merged }}>
            {children}
        </TranslationContext.Provider>
    )
}

export function useTranslation() {
    const context = useContext(TranslationContext)
    if (context === undefined) {
        throw new Error("useTranslation must be used within a TranslationProvider")
    }
    return context
}
