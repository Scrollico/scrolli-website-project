const fs = require('fs');
const path = require('path');

const blogDataPath = path.join(__dirname, '../data/blog.json');
const blogData = JSON.parse(fs.readFileSync(blogDataPath, 'utf8'));

function isArticle(obj) {
    return obj && typeof obj === 'object' && obj.id && obj.title && obj.date;
}

function updateArticle(article) {
    if (isArticle(article)) {
        // Deterministic assignment based on ID to ensure consistency if run multiple times
        // Simple hash of the ID string
        let hash = 0;
        for (let i = 0; i < article.id.length; i++) {
            hash = ((hash << 5) - hash) + article.id.charCodeAt(i);
            hash |= 0; // Convert to 32bit integer
        }
        const normalizedHash = Math.abs(hash);

        // 30% chance of being premium
        // Use modulo 100, if < 30 then premium
        article.isPremium = (normalizedHash % 100) < 30;
    }
}

function traverse(obj) {
    if (!obj || typeof obj !== 'object') return;

    if (Array.isArray(obj)) {
        obj.forEach(item => traverse(item));
    } else {
        // Check if this object is an article itself
        if (isArticle(obj)) {
            updateArticle(obj);
        }

        // Continue traversing children
        Object.keys(obj).forEach(key => {
            traverse(obj[key]);
        });
    }
}

traverse(blogData);

fs.writeFileSync(blogDataPath, JSON.stringify(blogData, null, 4), 'utf8');
console.log('Successfully updated blog.json with isPremium flags.');
