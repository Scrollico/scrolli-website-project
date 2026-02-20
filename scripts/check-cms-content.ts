
import { fetchArticles, getArticlesByCategory, getCategories } from '../lib/payload/client';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

// Try to load .env.local if .env doesn't exist or we want to prioritize it
if (fs.existsSync(path.resolve(process.cwd(), '.env.local'))) {
    dotenv.config({ path: '.env.local' });
} else {
    dotenv.config();
}

async function checkContent() {
    console.log('--- 1. Checking All Categories ---');
    const categories = await getCategories();

    if (categories && categories.docs) {
        console.log(`Found ${categories.docs.length} categories:`);
        categories.docs.forEach(c => {
            console.log(`- ${c.name} (slug: ${c.slug}, id: ${c.id})`);
        });
    } else {
        console.log('❌ Failed to fetch categories.');
    }

    console.log('\n--- 2. Searching for "Finans" Articles ---');
    // Try to find articles with category 'finans'
    // Note: We need to know the correct slug. Based on the list above we will know.
    // For now assuming 'finans' or 'finance'

    const finansArticles = await getArticlesByCategory('finans');
    console.log(`Articles with category slug 'finans': ${finansArticles.docs.length}`);

    if (finansArticles.docs.length === 0) {
        console.log('Trying uppercase "Finans"...');
        const finansArticlesUpper = await getArticlesByCategory('Finans');
        console.log(`Articles with category slug 'Finans': ${finansArticlesUpper.docs.length}`);
    }

    console.log('\n--- 3. Searching for Specific Article "BOTAŞ ve Türkmengaz" ---');
    // We need to find this article to see its metadata (slug, category, collection)
    // Fetching a batch of recent articles
    const allArticles = await fetchArticles({ limit: 100 });

    const targetArticle = allArticles.find(a =>
        (a.title && (a.title.includes('BOTAŞ') || a.title.includes('Türkmengaz')))
    );

    if (targetArticle) {
        console.log('✅ Found article:', targetArticle.title);
        console.log('  ID:', targetArticle.id);
        console.log('  Slug:', targetArticle.slug);
        console.log('  Collection:', (targetArticle as any).collection);
        console.log('  Category:', (targetArticle as any).category);
        console.log('  Published At:', targetArticle.publishedAt);

        // Check if it has a category field and what it looks like
        if ((targetArticle as any).category) {
            console.log('  Category Field:', JSON.stringify((targetArticle as any).category, null, 2));
        }
    } else {
        console.log('❌ Article "BOTAŞ ve Türkmengaz" not found in recent 100 articles.');
        console.log('Top 5 recent article titles:');
        allArticles.slice(0, 5).forEach(a => console.log(`- ${a.title}`));
    }
}

checkContent().catch(console.error);
