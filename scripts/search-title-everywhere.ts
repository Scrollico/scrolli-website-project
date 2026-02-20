
import { config } from "dotenv";
import { resolve } from "path";

config({ path: resolve(process.cwd(), ".env.local") });

const PAYLOAD_API_URL = process.env.PAYLOAD_API_URL;
const PAYLOAD_API_KEY = process.env.PAYLOAD_API_KEY;

async function searchEverywhere() {
    const titlePart = process.argv[2] || "Limp Bizkit";
    const collections = ["gundem", "hikayeler", "alaraai", "collabs", "stories", "curations"];

    console.log(`🔍 Searching for title like "${titlePart}" in all collections...\n`);

    for (const collection of collections) {
        for (const locale of ["tr", "en"]) {
            const url = `${PAYLOAD_API_URL}/${collection}?where[or][0][title][like]=${encodeURIComponent(titlePart)}&where[or][1][slug][like]=${encodeURIComponent(titlePart)}&locale=${locale}&depth=1&draft=true`;

            try {
                const response = await fetch(url, {
                    headers: {
                        "Authorization": `Bearer ${PAYLOAD_API_KEY}`
                    }
                });
                const data = await response.json();

                if (data.docs && data.docs.length > 0) {
                    console.log(`✅ Found ${data.docs.length} matches in "${collection}" (locale: ${locale}, draft: true):`);
                    data.docs.forEach((doc: any) => {
                        console.log(`   - Title: ${doc.title}`);
                        console.log(`     Slug: ${doc.slug}`);
                        console.log(`     ID: ${doc.id}`);
                        console.log(`     Status: ${doc._status}`);
                        console.log(`     Has content: ${!!doc.content}`);
                    });
                }
            } catch (error) {
                console.error(`Error searching "${collection}" (locale: ${locale}):`, error);
            }
        }
    }
}

searchEverywhere();
