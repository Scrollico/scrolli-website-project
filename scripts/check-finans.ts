
import { fetchArticles, getArticlesByCategory, getCategories } from '../lib/payload/client';
import dotenv from 'dotenv';

dotenv.config();

async function checkFinans() {
    console.log('--- Checking Categories ---');
    const categories = await getCategories();
    const finansCat = categories.docs.find(c => c.slug === 'finans' || c.name.toLowerCase() === 'finans');

    if (finansCat) {
        console.log('Found "Finans" category:', finansCat);
    } else {
        console.log('❌ "Finans" category not found in categories list.');
        console.log('Available categories:', categories.docs.map(c => `${c.name} (${c.slug})`).join(', '));
    }

    console.log('\n--- Checking Articles in "Finans" category (via getArticlesByCategory) ---');
    // Try lowercase and capitalized if needed, but usually slugs are lowercase
    const articles = await getArticlesByCategory('finans');
    console.log(`Found ${articles.docs.length} articles in "finans" category.`);

    if (articles.docs.length > 0) {
        console.log('First 3 articles:');
        articles.docs.slice(0, 3).forEach(a => {
            console.log(`- ${a.title} (${a.publishedAt})`);
        });
    }

    console.log('\n--- Searching for specific article "BOTAŞ ve Türkmengaz anlaştı" ---');
    // Fetch all articles and filter manually to find it and check its category
    // This is inefficient but good for debugging to find WHERE it is
    const allArticles = await fetchArticles({ limit: 500 }); // Fetch a reasonable amount
    const targetArticle = allArticles.find(a => a.title.includes('BOTAŞ') || a.title.includes('Türkmengaz'));

    if (targetArticle) {
        console.log('✅ Found article:', targetArticle.title);
        console.log('ID:', targetArticle.id);
        console.log('Collection:', (targetArticle as any).collection);
        console.log('Category:', (targetArticle as any).category);
        console.log('Published At:', targetArticle.publishedAt);
    } else {
        console.log('❌ Article "BOTAŞ ve Türkmengaz anlaştı" not found in recent 500 articles.');
    }
}

checkFinans().catch(console.error);
