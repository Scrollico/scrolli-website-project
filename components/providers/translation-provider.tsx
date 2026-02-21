"use client"

import React, { createContext, useContext } from "react"

interface TranslationContextType {
    t: (key: string, fallback?: string) => string
    strings: Record<string, string>
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined)

interface TranslationProviderProps {
    initialStrings: Record<string, string>
    children: React.ReactNode
}

export function TranslationProvider({
    initialStrings,
    children,
}: TranslationProviderProps) {
    const t = (key: string, fallback?: string): string => {
        return initialStrings[key] || fallback || key
    }

    return (
        <TranslationContext.Provider value={{ t, strings: initialStrings }}>
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
