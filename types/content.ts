/**
 * Content Type Definitions
 *
 * ANS-Inspired Schema for standardized content structure
 * Based on Arc Publishing principles for content governance
 */

/**
 * Base Article interface - represents a single article/post
 */
export interface Article {
  id: string;
  title: string;
  author: string;
  category: string;
  date: string;
  readTime: string;
  image?: string;
  excerpt?: string;
  tag?: string;
  number?: string;
  isPremium?: boolean;
}

/**
 * Author information
 */
export interface Author {
  name: string;
  title?: string;
  bio?: string;
  avatar?: string;
  social?: {
    twitter?: string;
    linkedin?: string;
    website?: string;
  };
}

/**
 * Category information
 */
export interface Category {
  name: string;
  slug: string;
  description?: string;
}

/**
 * Advertisement structure
 */
export interface Advertisement {
  image: string;
  link: string;
}

/**
 * Featured Section
 * Editor's picks with main article and side articles
 */
export interface FeaturedSection {
  title: string;
  mainArticle: Article;
  sideArticles: Article[];
}

/**
 * Trending Section
 * Trending articles with optional numbering
 */
export interface TrendingSection {
  title: string;
  articles: Article[];
}

/**
 * Featured Slider Section
 * Articles displayed in a slider/carousel
 */
export interface FeaturedSliderSection {
  title: string;
  articles: Article[];
}

/**
 * Today Highlights Section
 * Highlighted articles with optional ad placement
 */
export interface TodayHighlightsSection {
  articles: Article[];
  ad?: Advertisement;
}

/**
 * Most Recent Section
 * Recent articles with main articles, side articles, and popular section
 */
export interface MostRecentSection {
  title: string;
  mainArticles: Article[];
  sideArticles: Article[];
  popular: {
    title: string;
    articles: Article[];
  };
  ad?: Advertisement;
}

/**
 * Category Section (e.g., Culture, The Startup)
 * Main article with related articles and side articles
 */
export interface CategorySection {
  title: string;
  description?: string;
  mainArticle: Article;
  articles: Article[];
  sideArticles: Article[];
}

/**
 * Author Posts Section
 * Articles by a specific author
 */
export interface AuthorPostsSection {
  articles: Article[];
}

/**
 * Highlight Posts Section
 * Curated highlight articles
 */
export interface HighlightPostsSection {
  title: string;
  articles: Article[];
}

/**
 * Related Posts Section
 * Articles related to current content
 */
export interface RelatedPostsSection {
  title: string;
  articles: Article[];
}

/**
 * Podcast Host information
 */
export interface PodcastHost {
  name: string;
  title: string;
}

/**
 * Podcast entry
 */
export interface Podcast {
  id: number;
  title: string;
  host: PodcastHost;
  platform: string;
  spotify_url: string;
  image_url: string;
}

/**
 * Podcast Section
 */
export interface PodcastSection {
  title: string;
  subtitle: string;
  description: string;
  podcasts: Podcast[];
}

/**
 * Complete Blog Data Structure
 * Matches the structure of data/blog.json
 */
export interface BlogData {
  featured: FeaturedSection;
  trending: TrendingSection;
  featuredSlider: FeaturedSliderSection;
  todayHighlights: TodayHighlightsSection;
  mostRecent: MostRecentSection;
  Culture: CategorySection;
  theStartup: CategorySection;
  RyanMarkPosts: AuthorPostsSection;
  hightlightPosts: HighlightPostsSection;
  relatedPosts: RelatedPostsSection;
  podcast_section: PodcastSection;
}

/**
 * Article metadata for SEO and structured data
 */
export interface ArticleMetadata {
  id: string;
  title: string;
  excerpt?: string;
  author: string;
  category: string;
  date: string;
  readTime: string;
  image?: string;
  publishedTime?: string; // ISO 8601 format
  modifiedTime?: string; // ISO 8601 format
  tags?: string[];
  canonicalUrl?: string;
}

/**
 * Content section type discriminator
 * Used for type-safe section handling
 */
export type ContentSection =
  | FeaturedSection
  | TrendingSection
  | FeaturedSliderSection
  | TodayHighlightsSection
  | MostRecentSection
  | CategorySection
  | AuthorPostsSection
  | HighlightPostsSection
  | RelatedPostsSection;

/**
 * Utility type for extracting all articles from BlogData
 */
export type AllArticles = Article[];

/**
 * Search result with relevance score
 */
export interface SearchResult {
  article: Article;
  score: number;
  matchedFields: string[];
}

/**
 * Pagination metadata
 */
export interface PaginationMeta {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

/**
 * Paginated content result
 */
export interface PaginatedResult<T> {
  items: T[];
  pagination: PaginationMeta;
}
