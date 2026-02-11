/**
 * Environment Variable Check Endpoint
 * GET /api/env-check
 *
 * Verifies env vars and optionally tests Payload CMS connectivity.
 * Enable in production by setting ALLOW_ENV_CHECK=true in Vercel.
 */

import { NextResponse } from "next/server";
import { validateEnvVars } from "@/lib/env-validation";
import { getPayloadConfig } from "@/lib/payload/client";

export async function GET() {
  const allowCheck =
    process.env.NODE_ENV !== "production" ||
    process.env.ALLOW_ENV_CHECK === "true";

  if (!allowCheck) {
    return NextResponse.json({ error: "Not available" }, { status: 404 });
  }

  try {
    validateEnvVars();
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }

  // Optional: test Payload CMS connectivity (no CORS – server-side only)
  const payloadConfig = getPayloadConfig();
  let payloadStatus: "ok" | "missing_config" | "fetch_failed" = "ok";
  let payloadError: string | null = null;

  if (!payloadConfig) {
    payloadStatus = "missing_config";
    payloadError = "PAYLOAD_API_URL or PAYLOAD_API_KEY not set";
  } else {
    try {
      const res = await fetch(`${payloadConfig.url}/gundem?limit=1&locale=tr&draft=false&trash=false`, {
        headers: payloadConfig.headers,
        cache: "no-store",
      });
      if (!res.ok) {
        payloadStatus = "fetch_failed";
        payloadError = `Payload API returned ${res.status} ${res.statusText}`;
      }
    } catch (err) {
      payloadStatus = "fetch_failed";
      payloadError = err instanceof Error ? err.message : "Network error";
    }
  }

  return NextResponse.json({
    success: true,
    message: "Critical environment variables are set",
    payload: {
      status: payloadStatus,
      error: payloadError,
      hint:
        payloadStatus !== "ok"
          ? "Set PAYLOAD_API_URL (e.g. https://cms.scrolli.co/api) and PAYLOAD_API_KEY in Vercel → Settings → Environment Variables for Production."
          : undefined,
    },
  });
}
