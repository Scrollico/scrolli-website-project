
import { config } from "dotenv";
import { resolve } from "path";
import { getPayloadConfig } from "../lib/payload/client";

config({ path: resolve(process.cwd(), ".env.local") });

async function checkConfig() {
    const pConfig = getPayloadConfig();
    console.log("Payload Config URL:", pConfig?.url);

    if (pConfig) {
        const response = await fetch(`${pConfig.url}/media?limit=1`, { headers: pConfig.headers });
        console.log("Media fetch status:", response.status);
        if (response.ok) {
            const data = await response.json();
            console.log("Total media items:", data.totalDocs);
        } else {
            const text = await response.text();
            console.log("Error body:", text.substring(0, 100));
        }
    }
}

checkConfig();
