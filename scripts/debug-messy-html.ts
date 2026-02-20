import { getArticleBySlug } from '../lib/payload/client';
import { mapHikayelerToArticle } from '../lib/payload/types';
import fs from 'fs';
import path from 'path';

// Manual env loading
const envPath = path.resolve(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
    const envConfig = fs.readFileSync(envPath, 'utf8');
    envConfig.split('\n').forEach(line => {
        const [key, value] = line.split('=');
        if (key && value) {
            process.env[key.trim()] = value.trim();
        }
    });
}

async function main() {
    const slug = 'giacinto-bosco-yercekimine-meydan-okuyan-dusler-1771364893618';
    console.log(`Fetching article with slug: ${slug}`);

    try {
        const payloadArticle = await getArticleBySlug(slug);

        if (!payloadArticle) {
            console.error('Article not found in Payload CMS');
            return;
        }

        const mappedArticle = mapHikayelerToArticle(payloadArticle as any);
        console.log('\n--- Mapped Article ---');
        console.log('Mapped inlineScriptHtml:', mappedArticle.inlineScriptHtml ? 'Present' : 'Undefined');
        console.log('Mapped content type:', typeof mappedArticle.content);
        if (mappedArticle.content) {
            console.log('Mapped content (first 200 chars):', mappedArticle.content.substring(0, 200));
        } else {
            console.log('Mapped content is undefined (Correctly suppressed)');
        }

    } catch (error) {
        console.error('Error fetching article:', error);
    }
}

main();
