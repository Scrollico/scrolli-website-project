
import { config } from "dotenv";
import { resolve } from "path";
config({ path: resolve(process.cwd(), ".env.local") });

import { getPayloadConfig } from "../lib/payload/client";

async function testAuth() {
    const pConfig = getPayloadConfig();
    if (!pConfig) return;

    const apiKey = process.env.PAYLOAD_API_KEY;
    const testArticleId = "6994e1fc9b4b19ec5a727a74"; // Peter Thiel one

    const headersToTest = [
        { name: "Bearer", value: `Bearer ${apiKey}` },
        { name: "API-Key", value: `API-Key ${apiKey}` },
        { name: "Users API-Key", value: `users API-Key ${apiKey}` },
        { name: "X-API-KEY", header: "X-API-KEY", value: apiKey },
        { name: "Simple Key", value: apiKey }
    ];

    for (const h of headersToTest) {
        console.log(`\n--- Testing ${h.name} ---`);
        const headers: any = { "Content-Type": "application/json" };
        if (h.header) {
            headers[h.header] = h.value;
        } else {
            headers["Authorization"] = h.value;
        }

        try {
            const response = await fetch(`${pConfig.url}/gundem/${testArticleId}?locale=tr`, {
                method: "PATCH",
                headers: headers,
                body: JSON.stringify({ isFeatured: false }) // Harmless update
            });
            console.log(`Status: ${response.status}`);
            if (!response.ok) {
                const text = await response.text();
                console.log(`Error: ${text}`);
            } else {
                console.log(`✅ SUCCESS!`);
            }
        } catch (e: any) {
            console.log(`Error: ${e.message}`);
        }
    }
}

testAuth();
