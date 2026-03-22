"use client";

export const runtime = "edge";

import { useEffect, useRef, useState } from "react";
import { initializeRevenueCat, getOfferings, purchasePackage } from "@/lib/revenuecat/client";
import { useAuth } from "@/components/providers/auth-provider";
import { Button } from "@/components/ui/button";
import { Package } from "@revenuecat/purchases-js";
import { cn } from "@/lib/utils";
import { sectionPadding, containerPadding, colors, componentPadding } from "@/lib/design-tokens";

export default function TestPaywallPage() {
    const { user } = useAuth();
    const paywallContainerRef = useRef<HTMLDivElement>(null);
    const [logs, setLogs] = useState<string[]>([]);
    const [isInitialized, setIsInitialized] = useState(false);

    // Modes: 
    // - mobile: 375px rendering of standard Web Paywall
    // - card: 500px rendering of standard Web Paywall (Modal style)
    // - custom-horizontal: Fetches data manually and renders a custom React component
    const [containerMode, setContainerMode] = useState<'fit' | 'mobile' | 'card' | 'custom-horizontal'>('card');

    const [offerings, setOfferings] = useState<any>(null);
    const [loadingOfferings, setLoadingOfferings] = useState(false);

    const addLog = (message: string) => {
        setLogs((prev) => [`[${new Date().toLocaleTimeString()}] ${message}`, ...prev]);
        console.log(`[TestPaywall] ${message}`);
    };

    useEffect(() => {
        const init = async () => {
            try {
                addLog(`Initializing RevenueCat... User: ${user?.id || "Anonymous"}`);
                await initializeRevenueCat(user?.id);
                addLog("RevenueCat initialized successfully.");
                setIsInitialized(true);
            } catch (error: any) {
                addLog(`Error initializing RevenueCat: ${error.message}`);
            }
        };

        if (typeof window !== 'undefined') {
            init();
        }
    }, [user]);

    const fetchOfferingsData = async () => {
        setLoadingOfferings(true);
        try {
            addLog("Fetching Offerings/Products...");
            // Ensure initialized first
            await initializeRevenueCat(user?.id);
            const data = await getOfferings();
            addLog("Offerings fetched successfully.");
            setOfferings(data);
        } catch (e: any) {
            addLog("Error fetching offerings: " + e.message);
        }
        setLoadingOfferings(false);
    };

    const handlePurchase = async (pkg: Package) => {
        try {
            addLog(`Purchasing package: ${pkg.identifier}...`);
            const customerInfo = await purchasePackage(pkg, user?.email || undefined);
            addLog("Purchase successful!");
            addLog("Customer Info: " + JSON.stringify(customerInfo));
        } catch (e: any) {
            addLog("Purchase failed: " + e.message);
        }
    };

    const handleModeChange = (mode: 'fit' | 'mobile' | 'card' | 'custom-horizontal') => {
        setContainerMode(mode);
        if (mode === 'custom-horizontal' && !offerings) {
            fetchOfferingsData();
        }
    };

    const handleRenderPaywall = async () => {
        if (containerMode === 'custom-horizontal') {
            fetchOfferingsData();
            return;
        }

        if (!paywallContainerRef.current) {
            addLog("Error: Paywall container not found.");
            return;
        }

        try {
            addLog("Getting RevenueCat instance...");
            const purchases = await initializeRevenueCat(user?.id);

            addLog("Presenting Paywall...");
            // Standard Web Paywall
            // @ts-ignore
            const result = await purchases.presentPaywall({
                htmlTarget: paywallContainerRef.current,
            });

            if (result) {
                addLog(`Paywall result: ${JSON.stringify(result)}`);
            } else {
                addLog("Paywall closed or completed.");
            }

        } catch (err: any) {
            addLog(`Error presenting paywall: ${err}`);
            console.error(err);
        }
    };

    return (
        <div className={cn("container mx-auto", sectionPadding.md, containerPadding.md)}>
            <h1 className="text-3xl font-bold mb-8">RevenueCat Web Paywall Test</h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column: Controls & Logs */}
                <div className="space-y-6">
                    <div className={cn(componentPadding.md, colors.background.elevated, "rounded-xl border shadow-sm")}>
                        <h2 className="text-xl font-semibold mb-4">Controls</h2>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
                                <span>Status: {isInitialized ? <span className="text-green-600 font-bold">Initialized</span> : <span className="text-yellow-600">Initializing...</span>}</span>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Layout Mode</label>
                                <div className="flex flex-wrap gap-2">
                                    <button
                                        onClick={() => handleModeChange('mobile')}
                                        className={`px-3 py-1.5 text-xs font-medium rounded-md border transition-all ${containerMode === 'mobile' ? 'bg-black text-white border-black dark:bg-white dark:text-black' : 'bg-gray-50 text-gray-600 border-gray-200'}`}
                                    >
                                        Mobile (375px)
                                    </button>
                                    <button
                                        onClick={() => handleModeChange('card')}
                                        className={`px-3 py-1.5 text-xs font-medium rounded-md border transition-all ${containerMode === 'card' ? 'bg-black text-white border-black dark:bg-white dark:text-black' : 'bg-gray-50 text-gray-600 border-gray-200'}`}
                                    >
                                        Card (500px)
                                    </button>
                                    <button
                                        onClick={() => handleModeChange('custom-horizontal')}
                                        className={`px-3 py-1.5 text-xs font-medium rounded-md border transition-all ${containerMode === 'custom-horizontal' ? 'bg-black text-white border-black dark:bg-white dark:text-black' : 'bg-indigo-50 text-indigo-600 border-indigo-200'}`}
                                    >
                                        Custom Horizontal (Manual Data)
                                    </button>
                                </div>
                            </div>

                            <Button
                                onClick={handleRenderPaywall}
                                disabled={!isInitialized}
                                className="w-full"
                            >
                                {containerMode === 'custom-horizontal' ? 'Fetch Offerings & Render' : 'Render Standard Paywall'}
                            </Button>
                        </div>
                    </div>

                    <div className={cn(componentPadding.md, colors.background.elevated, "rounded-xl border shadow-sm")}>
                        <h2 className="text-xl font-semibold mb-4">Logs</h2>
                        <div className="bg-black text-green-400 p-4 rounded-lg font-mono text-xs h-[300px] overflow-y-auto">
                            {logs.length === 0 && <span className="opacity-50">Waiting for actions...</span>}
                            {logs.map((log, i) => (
                                <div key={i} className="mb-1 border-b border-white/10 pb-1 last:border-0">
                                    {log}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column: Preview Area */}
                <div className="space-y-6">
                    <div className={cn(componentPadding.md, colors.background.elevated, "rounded-xl border shadow-sm min-h-[600px] flex flex-col items-center")}>
                        <div className="w-full flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold">Preview</h2>
                            <span className="text-xs px-2 py-1 bg-gray-100 rounded text-gray-500">
                                {containerMode === 'custom-horizontal' ? 'Custom UI' : 'RevenueCat UI'}
                            </span>
                        </div>

                        <div className="w-full flex-1 bg-gray-100/50 dark:bg-neutral-950/50 rounded-xl p-8 flex items-start justify-center overflow-auto border border-dashed border-gray-200">

                            {/* --- Custom Horizontal Implementation --- */}
                            {containerMode === 'custom-horizontal' ? (
                                <div className="w-full max-w-4xl bg-white dark:bg-neutral-900 shadow-xl rounded-2xl overflow-hidden border border-gray-200 dark:border-neutral-800 flex flex-col md:flex-row min-h-[400px]">
                                    {/* Left: Image/Hero */}
                                    <div className="md:w-1/2 bg-gray-900 relative p-8 text-white flex flex-col justify-center">
                                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 to-purple-900 opacity-50" />
                                        <div className="relative z-10">
                                            <h3 className="text-3xl font-bold mb-4">Unlock Full Access</h3>
                                            <ul className="space-y-3">
                                                <li className="flex items-center gap-2"><span className="text-green-400">✓</span> Unlimited Articles</li>
                                                <li className="flex items-center gap-2"><span className="text-green-400">✓</span> Ad-free Experience</li>
                                                <li className="flex items-center gap-2"><span className="text-green-400">✓</span> Support Independent Journalism</li>
                                            </ul>
                                        </div>
                                    </div>

                                    {/* Right: Pricing/Offerings */}
                                    <div className="md:w-1/2 p-8 flex flex-col justify-center">
                                        {loadingOfferings ? (
                                            <div className="flex justify-center py-12">
                                                <div className="animate-spin h-8 w-8 border-4 border-indigo-500 border-t-transparent rounded-full" />
                                            </div>
                                        ) : offerings?.current ? (
                                            <div className="space-y-4">
                                                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Choose Your Plan</h4>
                                                {offerings.current.availablePackages.map((pkg: any) => (
                                                    <div
                                                        key={pkg.identifier}
                                                        onClick={() => handlePurchase(pkg)}
                                                        className="group p-4 rounded-xl border border-gray-200 hover:border-indigo-500 cursor-pointer transition-all hover:shadow-md bg-gray-50 hover:bg-white dark:bg-neutral-800 dark:hover:bg-neutral-700"
                                                    >
                                                        <div className="flex justify-between items-center mb-1">
                                                            <span className="font-bold text-gray-900 dark:text-white">{pkg.webBillingProduct?.title || pkg.product?.title || pkg?.identifier}</span>
                                                            <span className="text-indigo-600 font-bold">{pkg.webBillingProduct?.priceString || pkg.product?.priceString}</span>
                                                        </div>
                                                        <p className="text-xs text-gray-500">{pkg.webBillingProduct?.description || pkg.product?.description}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="text-center text-gray-500 py-8">
                                                <p>Click "Fetch Offerings" to load products from RevenueCat.</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                /* --- Standard RevenueCat UI Container --- */
                                <div
                                    id="show-paywall-here"
                                    ref={paywallContainerRef}
                                    className={`
                                        bg-white dark:bg-neutral-900 shadow-2xl overflow-hidden transition-all duration-500
                                        ${containerMode === 'mobile' ? 'w-[375px] rounded-[32px] border-[8px] border-gray-900' : ''}
                                        ${containerMode === 'card' ? 'w-[500px] rounded-2xl border border-gray-200' : ''}
                                    `}
                                    style={{
                                        minHeight: '650px'
                                    }}
                                >
                                    {!paywallContainerRef.current?.hasChildNodes() && (
                                        <div className="h-full flex flex-col items-center justify-center p-8 text-center text-gray-400">
                                            <span className="mb-2">RevenueCat Standard UI</span>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        <p className="text-xs text-gray-500 mt-4 text-center max-w-md">
                            {containerMode === 'custom-horizontal'
                                ? "This mode ignores the RevenueCat standard UI and builds a custom layout using their data API (getOfferings)."
                                : "Standard RevenueCat Web Paywalls are mobile-first. Use 'Card Mode' for the best desktop experience."}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
