import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
    const PAYLOAD_API_URL = process.env.PAYLOAD_API_URL;
    const PAYLOAD_API_KEY = process.env.PAYLOAD_API_KEY;

    // Mask sensitive values for security in response
    const envStatus = {
        PAYLOAD_API_URL: PAYLOAD_API_URL
            ? `${PAYLOAD_API_URL.substring(0, 15)}...`
            : 'undefined',
        PAYLOAD_API_KEY: PAYLOAD_API_KEY
            ? `${PAYLOAD_API_KEY.substring(0, 4)}...${PAYLOAD_API_KEY.substring(PAYLOAD_API_KEY.length - 4)}`
            : 'undefined',
        NODE_ENV: process.env.NODE_ENV,
    };

    if (!PAYLOAD_API_URL || !PAYLOAD_API_KEY) {
        return NextResponse.json({
            success: false,
            message: 'Critical environment variables are missing',
            envStatus,
        }, { status: 500 });
    }

    // Construct URL
    const baseUrl = PAYLOAD_API_URL.replace(/\/+$/, "");
    // Try to fetch a single item from 'hikayeler' collection to verify connectivity
    const endpoint = `${baseUrl}/api/hikayeler?limit=1&depth=0`;

    try {
        const start = Date.now();
        const res = await fetch(endpoint, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${PAYLOAD_API_KEY}`,
                'Content-Type': 'application/json',
            },
            // Set a timeout to avoid hanging indefinitely if connection is blocked
            signal: AbortSignal.timeout(10000),
        });
        const duration = Date.now() - start;

        const contentType = res.headers.get('content-type');
        let data;

        if (contentType && contentType.includes('application/json')) {
            data = await res.json();
            // Simplify the response for the debug view
            if (data.docs && Array.isArray(data.docs)) {
                data.docs = `[${data.docs.length} items returned]`;
            }
        } else {
            const text = await res.text();
            data = {
                error: 'Response was not JSON',
                snippet: text.substring(0, 500)
            };
        }

        return NextResponse.json({
            success: res.ok,
            httpStatus: res.status,
            httpStatusText: res.statusText,
            duration: `${duration}ms`,
            targetUrl: endpoint,
            envStatus,
            responseData: data,
        });

    } catch (error: any) {
        return NextResponse.json({
            success: false,
            message: 'Network request failed',
            errorName: error.name,
            errorMessage: error.message,
            cause: error.cause ? String(error.cause) : undefined,
            targetUrl: endpoint,
            envStatus,
        }, { status: 500 });
    }
}
