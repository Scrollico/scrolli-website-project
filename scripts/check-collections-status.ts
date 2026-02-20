
import dotenv from 'dotenv';
import path from 'path';

// Load .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

import { getPayloadConfig } from "../lib/payload/client";

async function checkCollectionsStatus() {
    const config = getPayloadConfig();
    if (!config) {
        console.error("Payload config missing");
        process.exit(1);
    }

    const collections = [
        'gundem',
        'hikayeler',
        'authors', // Checking if this endpoint exists
        'users',   // Checking if this endpoint exists
        'collabs'  // Checking if this endpoint exists (unlikely)
    ];

    console.log(`Checking collections against: ${config.url}`);

    for (const collection of collections) {
        try {
            const res = await fetch(`${config.url}/${collection}?limit=1&sort=-publishedAt`, {
                headers: config.headers,
            });

            if (res.ok) {
                const data = await res.json();
                const items = data.data || data.docs || [];
                const count = data.meta?.totalDocs ?? data.totalDocs ?? (items ? items.length : 'N/A');
                console.log(`\n[${collection}]`);
                console.log(`  Status: OK`);
                console.log(`  Total Docs: ${count}`);

                if (items && items.length > 0) {
                    const doc = items[0];
                    console.log(`  Latest Item: ${doc.title || doc.name || doc.id}`);
                    console.log(`  Date: ${doc.publishedAt || doc.createdAt}`);
                }
            } else {
                console.log(`\n[${collection}]`);
                console.log(`  Status: ${res.status} ${res.statusText}`);
            }
        } catch (error: any) {
            console.log(`\n[${collection}]`);
            console.log(`  Error: ${error.message}`);
        }
    }

    // Specific check for Collabs (Hikayeler with isCollab=true)
    try {
        const config = getPayloadConfig();
        if (!config) return;

        console.log(`\n[Hikayeler: isCollab=true]`);
        const res = await fetch(`${config.url}/hikayeler?where[isCollab][equals]=true&limit=1`, {
            headers: config.headers,
        });
        if (res.ok) {
            const data = await res.json();
            const count = data.meta?.totalDocs ?? data.totalDocs;
            console.log(`  Total Collab Stories: ${count}`);
        } else {
            console.log(`  Status: ${res.status} ${res.statusText}`);
        }
    } catch (error: any) {
        console.log(`  Error: ${error.message}`);
    }
}

checkCollectionsStatus();
