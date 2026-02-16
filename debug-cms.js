const path = require('path');
const fs = require('fs');

// Simple dotenv parser since we might not have the package available in this context
// or to avoid module loading issues
function loadEnv() {
    try {
        const envPath = path.resolve(process.cwd(), '.env.local');
        if (!fs.existsSync(envPath)) {
            console.error('❌ .env.local not found');
            return {};
        }
        const envContent = fs.readFileSync(envPath, 'utf8');
        const env = {};
        envContent.split('\n').forEach(line => {
            const match = line.match(/^([^=]+)=(.*)$/);
            if (match) {
                let value = match[2].trim();
                // Remove quotes if present
                if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
                    value = value.slice(1, -1);
                }
                env[match[1].trim()] = value;
            }
        });
        return env;
    } catch (error) {
        console.error('Error loading .env.local:', error);
        return {};
    }
}

const env = loadEnv();
const API_URL = env.PAYLOAD_API_URL;
const API_KEY = env.PAYLOAD_API_KEY;

if (!API_URL || !API_KEY) {
    console.error('❌ Missing API URL or Key in .env.local');
    console.log('API_URL:', API_URL);
    console.log('API_KEY:', API_KEY ? '******' : 'Missing');
    process.exit(1);
}

console.log('✅ Configuration loaded');
console.log('URL:', API_URL);

async function fetchCollection(collection, limit = 3) {
    console.log(`\nFetching ${collection}...`);
    try {
        const response = await fetch(`${API_URL}/${collection}?limit=${limit}&locale=tr`, {
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            console.error(`❌ Failed to fetch ${collection}: ${response.status} ${response.statusText}`);
            const text = await response.text();
            console.error('Response:', text.substring(0, 200));
            return null;
        }

        const data = await response.json();
        console.log(`✅ ${collection}: Found ${data.docs ? data.docs.length : 0} items`);
        if (data.docs && data.docs.length > 0) {
            console.log(`   Sample: ${data.docs[0].title || data.docs[0].slug}`);
            if (collection === 'hikayeler') {
                // Log all keys to see what we actually get
                console.log('   Keys available:', Object.keys(data.docs[0]));
                console.log(`   InlineScript: ${!!data.docs[0].inlineScriptHtml}`);
            }
        }
        return data;
    } catch (error) {
        console.error(`❌ Error fetching ${collection}:`, error.message);
        return null;
    }
}

async function run() {
    await fetchCollection('gundem');
    await fetchCollection('hikayeler');
}

run();
