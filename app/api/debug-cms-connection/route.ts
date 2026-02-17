
export const runtime = "edge";

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
    // Match client.ts behavior: assume PAYLOAD_API_URL includes '/api' path if needed
    // Try to fetch from 'alaraai' collection to verify connectivity and schema
    const endpoint = `${baseUrl}/alaraai?limit=1&depth=1`;

    try {
        const start = Date.now();
        const res = await fetch(endpoint, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${PAYLOAD_API_KEY}`,
                'Content-Type': 'application/json',
            },
            signal: AbortSignal.timeout(10000),
        });
        const duration = Date.now() - start;

        const contentType = res.headers.get('content-type');
        let data;

        if (contentType && contentType.includes('application/json')) {
            data = await res.json();
            // Simplify the response but show keys for first item
            const articles = data.data || data.docs || [];
            if (Array.isArray(articles) && articles.length > 0) {
                const firstItem = articles[0];
                data.keys = Object.keys(firstItem);
                data.sample = {
                    id: firstItem.id,
                    slug: firstItem.slug,
                    title: firstItem.title,
                    hasContent: !!firstItem.content,
                    contentType: typeof firstItem.content,
                    contentPreview: firstItem.content ? (typeof firstItem.content === 'string' ? firstItem.content.substring(0, 100) : JSON.stringify(firstItem.content).substring(0, 100)) : null,
                    hasBody: !!firstItem.body,
                    bodyType: typeof firstItem.body,
                    bodyPreview: firstItem.body ? (typeof firstItem.body === 'string' ? firstItem.body.substring(0, 100) : JSON.stringify(firstItem.body).substring(0, 100)) : null,
                    source: firstItem.source,
                };
                data.docs_info = `[${articles.length} items returned]`;
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
