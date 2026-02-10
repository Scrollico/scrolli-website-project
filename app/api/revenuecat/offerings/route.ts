/**
 * Server-side API route to fetch RevenueCat offerings
 * This bypasses ad blockers by proxying requests through our own domain
 * Uses RevenueCat SDK on server-side to get the exact same format as client-side
 */

import { NextResponse } from "next/server";
import { Purchases } from "@revenuecat/purchases-js";

export async function GET() {
  try {
    const apiKey = process.env.NEXT_PUBLIC_REVENUECAT_PUBLIC_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "RevenueCat API key not configured" },
        { status: 500 },
      );
    }

    // Validate key format
    if (!apiKey.startsWith("rcb_")) {
      return NextResponse.json(
        { error: "Invalid RevenueCat API key format" },
        { status: 500 },
      );
    }

    // Use RevenueCat SDK on server-side to get the exact same format
    // This ensures compatibility with client-side code
    const anonymousUserId = `anon_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const purchases = await Purchases.configure({
      apiKey: apiKey,
      appUserId: anonymousUserId,
    });

    // Fetch offerings using SDK (same method as client-side)
    const offerings = await purchases.getOfferings();

    // Return the offerings data in the exact same format as the SDK
    return NextResponse.json({
      success: true,
      data: offerings,
    });
  } catch (error: any) {
    console.error(
      "❌ Error fetching RevenueCat offerings (server-side):",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        error: error?.message || "Failed to fetch offerings",
        errorCode: error?.errorCode,
        underlyingErrorMessage: error?.underlyingErrorMessage,
      },
      { status: 500 },
    );
  }
}
