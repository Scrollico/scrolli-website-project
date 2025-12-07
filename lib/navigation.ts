import blogData from '@/data/blog.json';

export interface Category {
  slug: string;
  displayName: string;
}

/**
 * Maps Turkish category slugs to proper display names
 */
const categoryDisplayNames: Record<string, string> = {
  'eksen': 'Eksen',
  'zest': 'Zest',
  'gelecek': 'Gelecek',
  'genel': 'Genel',
  'fashion': 'Fashion',
  'programming': 'Programming',
  'living': 'Living',
  'gen': 'Gen',
};

/**
 * Format category name for display
 * Capitalizes first letter and handles Turkish characters
 */
function formatCategoryName(slug: string): string {
  // Check if we have a predefined display name
  if (categoryDisplayNames[slug.toLowerCase()]) {
    return categoryDisplayNames[slug.toLowerCase()];
  }
  
  // Otherwise, capitalize first letter and format
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

/**
 * Extract unique categories from blog.json
 * Returns sorted array of category objects with slug and display name
 */
export function getCategoriesFromBlog(): Category[] {
  const categoriesSet = new Set<string>();

  // Helper function to extract categories from articles array
  const extractFromArticles = (articles: any[]) => {
    if (!Array.isArray(articles)) return;
    articles.forEach((article: any) => {
      if (article?.category && typeof article.category === 'string') {
        categoriesSet.add(article.category);
      }
    });
  };

  // Extract from featured section
  if (blogData.featured?.mainArticle?.category) {
    categoriesSet.add(blogData.featured.mainArticle.category);
  }
  if (blogData.featured?.sideArticles) {
    extractFromArticles(blogData.featured.sideArticles);
  }

  // Extract from trending section
  if (blogData.trending?.articles) {
    extractFromArticles(blogData.trending.articles);
  }

  // Extract from featuredSlider section
  if (blogData.featuredSlider?.articles) {
    extractFromArticles(blogData.featuredSlider.articles);
  }

  // Extract from mostRecent section
  if (blogData.mostRecent?.mainArticles) {
    extractFromArticles(blogData.mostRecent.mainArticles);
  }
  if (blogData.mostRecent?.sideArticles) {
    extractFromArticles(blogData.mostRecent.sideArticles);
  }

  // Convert to array and sort
  const categories = Array.from(categoriesSet)
    .map(slug => ({
      slug,
      displayName: formatCategoryName(slug),
    }))
    .sort((a, b) => a.displayName.localeCompare(b.displayName, 'tr'));

  return categories;
}


