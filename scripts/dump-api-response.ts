
import { config } from "dotenv";
import { resolve } from "path";
import { getPayloadConfig } from "../lib/payload/client";

config({ path: resolve(process.cwd(), ".env.local") });

async function dumpResponse() {
    const pConfig = getPayloadConfig();
    if (!pConfig) return;

    const collections = ['gundem', 'media'];
    for (const coll of collections) {
        console.log(`\n--- Collection: ${coll} ---`);
        const response = await fetch(`${pConfig.url}/${coll}?limit=1`, { headers: pConfig.headers });
        if (response.ok) {
            const data = await response.json();
            console.log(JSON.stringify(data, null, 2));
        } else {
            console.log(`Error: ${response.status}`);
        }
    }
}

dumpResponse();
