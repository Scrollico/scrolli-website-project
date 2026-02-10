/**
 * Environment Variable Check Endpoint
 * GET /api/env-check
 * 
 * This endpoint can be used to verify environment variables are set correctly.
 * Should be protected or removed in production.
 */

import { NextResponse } from "next/server";
import { validateEnvVars } from "@/lib/env-validation";

export async function GET() {
  // Only allow in development or with explicit flag
  const allowCheck = process.env.NODE_ENV !== "production" || process.env.ALLOW_ENV_CHECK === "true";
  
  if (!allowCheck) {
    return NextResponse.json(
      { error: "Not available" },
      { status: 404 }
    );
  }

  try {
    validateEnvVars();
    return NextResponse.json({
      success: true,
      message: "All critical environment variables are set",
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
