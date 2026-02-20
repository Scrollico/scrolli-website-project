
import { config } from "dotenv";
import { resolve } from "path";
config({ path: resolve(process.cwd(), ".env.local") });

import { getPayloadConfig } from "../lib/payload/client";

async function checkMe() {
    const pConfig = getPayloadConfig();
    if (!pConfig) return;

    try {
        const response = await fetch(`${pConfig.url}/users/me`, {
            headers: pConfig.headers
        });
        console.log(`Status: ${response.status}`);
        const data = await response.json();
        console.log(JSON.stringify(data, null, 2));
    } catch (e: any) {
        console.log(`Error: ${e.message}`);
    }
}

checkMe();
