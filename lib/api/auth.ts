/**
 * API Authentication Utilities
 * Shared authentication helpers for API routes
 */

import { NextRequest, NextResponse } from "next/server";

/**
 * Validate Payload CMS API key from Authorization header
 */
export function validatePayloadApiKey(request: NextRequest): boolean {
  const authHeader = request.headers.get("Authorization");
  const expectedKey = process.env.PAYLOAD_API_KEY;

  if (!expectedKey) {
    console.error("PAYLOAD_API_KEY not configured");
    return false;
  }

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return false;
  }

  const providedKey = authHeader.substring(7); // Remove "Bearer " prefix
  return providedKey === expectedKey;
}

/**
 * Middleware response for unauthorized requests
 */
export function unauthorizedResponse(message: string = "Unauthorized") {
  return NextResponse.json(
    { error: message },
    { status: 401 }
  );
}

/**
 * Middleware response for missing API key
 */
export function missingApiKeyResponse() {
  return NextResponse.json(
    { error: "API key required. Provide Authorization: Bearer <token> header" },
    { status: 401 }
  );
}
