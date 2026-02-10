/**
 * API Middleware Utilities
 * Request size limits, CORS, and other API middleware functions
 */

import { NextRequest, NextResponse } from "next/server";

// Maximum request body size (10MB)
const MAX_REQUEST_SIZE = 10 * 1024 * 1024; // 10MB

/**
 * Check if request body size exceeds limit
 */
export async function checkRequestSize(request: NextRequest): Promise<NextResponse | null> {
  const contentLength = request.headers.get("content-length");
  
  if (contentLength) {
    const size = parseInt(contentLength, 10);
    if (size > MAX_REQUEST_SIZE) {
      return NextResponse.json(
        { error: `Request body too large. Maximum size is ${MAX_REQUEST_SIZE / 1024 / 1024}MB` },
        { status: 413 }
      );
    }
  }
  
  return null;
}

/**
 * Add CORS headers to response
 */
export function addCorsHeaders(response: NextResponse, request: NextRequest): NextResponse {
  const origin = request.headers.get("origin");
  const allowedOrigins = [
    process.env.NEXT_PUBLIC_SITE_URL,
    "http://localhost:3000",
    "https://scrolli.co",
  ].filter(Boolean) as string[];

  // Allow requests from same origin or configured origins
  if (origin && allowedOrigins.some(allowed => origin.startsWith(allowed))) {
    response.headers.set("Access-Control-Allow-Origin", origin);
  } else if (!origin) {
    // Same-origin request
    response.headers.set("Access-Control-Allow-Origin", "*");
  }

  response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  response.headers.set("Access-Control-Max-Age", "86400"); // 24 hours

  return response;
}

/**
 * Handle OPTIONS request for CORS preflight
 */
export function handleOptionsRequest(request: NextRequest): NextResponse {
  const response = new NextResponse(null, { status: 204 });
  return addCorsHeaders(response, request);
}
