// Test script to check if article fetching works
const { getArticleBySlug } = require('./lib/payload/client');

async function testArticleFetch() {
    try {
        const slug = "devlerin-yapay-zeka-ortakligi-100-milyar-dolar-kaynak-olusturacak-1767482252353";
        console.log('Testing article fetch for slug:', slug);

        const article = await getArticleBySlug(slug);
        console.log('Article found:', !!article);

        if (article) {
            console.log('Title:', article.title);
            console.log('Source:', article.source);
        } else {
            console.log('Article not found');
        }

    } catch (error) {
        console.error('Error:', error);
    }
}

testArticleFetch();