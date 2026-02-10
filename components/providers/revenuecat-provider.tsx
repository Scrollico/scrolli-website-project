/**
 * RevenueCat Provider
 * 
 * Initializes RevenueCat SDK when user logs in and provides
 * subscription context throughout the app.
 */

"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useAuth } from '@/components/providers/auth-provider';
import { initializeRevenueCat, getCustomerInfo, restorePurchases } from '@/lib/revenuecat/client';
import type { Purchases } from '@revenuecat/purchases-js';

interface RevenueCatContextType {
    isInitialized: boolean;
    isLoading: boolean;
    customerInfo: any | null;
    refreshCustomerInfo: () => Promise<void>;
}

const RevenueCatContext = createContext<RevenueCatContextType | undefined>(undefined);

export function RevenueCatProvider({ children }: { children: ReactNode }) {
    const { user } = useAuth();
    const [isInitialized, setIsInitialized] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [customerInfo, setCustomerInfo] = useState<any | null>(null);

    // Initialize RevenueCat (works for both anonymous and logged-in users)
    useEffect(() => {
        async function initialize() {
            try {
                setIsLoading(true);

                // CRITICAL: Always pass Supabase user ID to RevenueCat
                // This ensures app_user_id in webhooks matches the Supabase UUID
                if (user?.id) {
                    console.log(`🔐 RevenueCatProvider: Initializing with Supabase user ID: ${user.id.substring(0, 8)}...`);
                } else {
                    console.log('🔐 RevenueCatProvider: Initializing with anonymous ID (user will be configured on login)');
                }

                // Initialize RevenueCat - pass user ID if available, otherwise anonymous ID
                // The client handles anonymous ID generation automatically
                await initializeRevenueCat(user?.id);
                setIsInitialized(true);

                // Only fetch customer info if user is logged in
                if (user?.id) {
                    try {
                        console.log('📡 Fetching RevenueCat customer info...');
                        const info = await getCustomerInfo();
                        setCustomerInfo(info);
                        console.log(`✅ RevenueCat customer info loaded for user: ${user.id.substring(0, 8)}...`);
                    } catch (error: any) {
                        console.error('⚠️ Failed to fetch customer info:', {
                            message: error?.message,
                            errorCode: error?.errorCode,
                            underlyingError: error?.underlyingErrorMessage,
                        });

                        // Check if it's an API key issue
                        if (error?.message?.includes('network') || error?.message?.includes('request')) {
                            console.error(
                                '❌ Network error fetching customer info. Possible causes:\n' +
                                '1. Invalid or incomplete RevenueCat API key\n' +
                                '2. Network connectivity issues\n' +
                                '3. RevenueCat service unavailable\n' +
                                'Please verify NEXT_PUBLIC_REVENUECAT_PUBLIC_KEY in .env.local'
                            );
                        }

                        // Don't fail initialization - user can still browse premium content, just can't purchase
                        setCustomerInfo(null);
                    }
                } else {
                    setCustomerInfo(null);
                }
            } catch (error) {
                console.error('❌ Failed to initialize RevenueCat:', error);
                setIsInitialized(false);
                setCustomerInfo(null);
            } finally {
                setIsLoading(false);
            }
        }

        initialize();
    }, [user?.id]); // Only re-run if user ID changes (not just user object)

    const refreshCustomerInfo = async () => {
        if (!isInitialized) return;

        try {
            const info = await getCustomerInfo();
            setCustomerInfo(info);
        } catch (error) {
            console.error('Failed to refresh customer info:', error);
        }
    };

    return (
        <RevenueCatContext.Provider value={{ isInitialized, isLoading, customerInfo, refreshCustomerInfo }}>
            {children}
        </RevenueCatContext.Provider>
    );
}

export function useRevenueCat() {
    const context = useContext(RevenueCatContext);
    if (context === undefined) {
        throw new Error('useRevenueCat must be used within RevenueCatProvider');
    }
    return context;
}
