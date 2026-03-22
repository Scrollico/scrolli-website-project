"use client";
import Link from 'next/link'
import Image from 'next/image'
import blogData from '@/data/blog.json'
import Pagination from '@/components/elements/Pagination'
import { useState, useEffect } from 'react'
import { Container } from '@/components/responsive'
import { Heading, Text } from '@/components/ui/typography'
import { Badge } from '@/components/ui/badge'
import { Search } from 'lucide-react'
import { getAuthorName } from '@/lib/author-loader'
import {
  sectionPadding,
  colors,
  borderRadius,
} from '@/lib/design-tokens'
import { cn } from '@/lib/utils'

import { PremiumContentBadgeIcon } from "@/components/icons/scrolli-icons";

interface Section1Props {
  searchQuery: string;
}

interface SearchResult {
  article: any;
  score: number;
}

export default function Section1({ searchQuery: initialQuery }: Section1Props) {
  const [query, setQuery] = useState(initialQuery);
  const [inputValue, setInputValue] = useState(initialQuery);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const articlesPerPage = 6;
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage, query]);

  useEffect(() => {
    const allArticles = [
      ...blogData.Culture.articles,
      ...blogData.theStartup.articles,
      ...blogData.RyanMarkPosts.articles,
      ...blogData.mostRecent.mainArticles,
      ...blogData.todayHighlights.articles,
      blogData.featured.mainArticle,
      ...blogData.featured.sideArticles
    ].filter(Boolean);

    const searchLower = query.toLowerCase();

    const results: SearchResult[] = allArticles
      .map(article => {
        let score = 0;
        const title = (article as any).title;
        const author = (article as any).author;
        const category = (article as any).category;
        const tag = (article as any).tag;
        const excerpt = (article as any).excerpt;

        if (title?.toLowerCase().includes(searchLower)) score += 5;
        if (author?.toLowerCase().includes(searchLower)) score += 3;
        if (category?.toLowerCase().includes(searchLower)) score += 3;
        if (tag?.toLowerCase().includes(searchLower)) score += 2;
        if (excerpt?.toLowerCase().includes(searchLower)) score += 1;
        return { article, score };
      })
      .filter(result => result.score > 0)
      .sort((a, b) => b.score - a.score);

    const uniqueResults = results.filter((v, i, a) => a.findIndex(t => (t.article.id === v.article.id)) === i);
    setSearchResults(uniqueResults);
    setCurrentPage(1);
  }, [query]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setQuery(inputValue);
  };

  const totalPages = Math.ceil(searchResults.length / articlesPerPage);
  const startIdx = (currentPage - 1) * articlesPerPage;
  const paginatedArticles = searchResults.slice(startIdx, startIdx + articlesPerPage);

  return (
    <section className={cn("min-h-screen", sectionPadding.md, colors.background.base)}>
      <Container>
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-16">

          {/* Main Content */}
          <div className="flex-1 lg:w-2/3 xl:w-3/4">

            {/* Search Header */}
            <div className="mb-10 text-center lg:text-left">
              <Text className="mb-2 text-primary font-bold tracking-wider text-xs">
                Search Archives
              </Text>
              <Heading level={2} variant="h3" className={cn("mb-6", colors.foreground.primary)}>
                {searchResults.length > 0
                  ? `${searchResults.length} results for "${query}"`
                  : `No results found for "${query}"`
                }
              </Heading>

              {/* FIXED: Wrapper Pattern for Input + Button Alignment */}
              <form onSubmit={handleSearchSubmit} className="max-w-xl mx-auto lg:mx-0">
                <div
                  className={cn(
                    "flex items-center rounded-full",
                    colors.background.base,
                    "border border-gray-200 dark:border-gray-700",
                    "shadow-sm hover:shadow-md transition-shadow focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary"
                  )}
                  style={{ height: '56px', padding: '6px' }}
                >
                  {/* Icon */}
                  <div className="flex items-center justify-center w-12 text-gray-400" style={{ height: '44px' }}>
                    <Search className="w-5 h-5" />
                  </div>

                  {/* Native Input - explicit margin reset */}
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Search articles, topics, authors..."
                    className="flex-1 bg-transparent border-none outline-none text-gray-900 dark:text-white text-base placeholder:text-gray-400"
                    style={{ height: '44px', margin: 0 }}
                  />

                  {/* Button - explicit height and margin reset */}
                  <button
                    type="submit"
                    className="rounded-full px-6 bg-gray-900 hover:bg-black dark:bg-gray-700 dark:hover:bg-gray-600 text-white text-sm font-medium transition-colors"
                    style={{ height: '44px', margin: 0 }}
                  >
                    Search
                  </button>
                </div>
              </form>
            </div>

            {/* Results */}
            <div className="space-y-8">
              {paginatedArticles.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {paginatedArticles.map(({ article }, idx) => (
                      <Link
                        key={`${article.id}-${idx}`}
                        href={`/${article.id}`}
                        className="group block h-full"
                      >
                        <article className={cn(
                          "h-full flex flex-col overflow-hidden transition-all duration-300 hover:-translate-y-1",
                          borderRadius.lg,
                          colors.background.elevated,
                          article.isPremium
                            ? "ring-1 ring-amber-200 dark:ring-amber-900/50 bg-amber-50/30 dark:bg-amber-950/10"
                            : "shadow-sm hover:shadow-md border border-gray-100 dark:border-gray-800"
                        )}>
                          {/* Image */}
                          <div className="relative aspect-[16/10] w-full overflow-hidden bg-gray-100 dark:bg-gray-800">
                            <Image
                              src={article.image || "/assets/images/placeholder.jpg"}
                              alt={article.title}
                              fill
                              className="object-cover transition-transform duration-500 group-hover:scale-105"
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            />
                            {article.isPremium && (
                              <div className="absolute top-3 right-3 z-10">
                                <span className="flex items-center gap-1.5 bg-gray-900/90 backdrop-blur-sm text-amber-400 text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                                  <PremiumContentBadgeIcon size={14} />
                                  <span>PREMIUM</span>
                                </span>
                              </div>
                            )}
                            {article.category && (
                              <div className="absolute bottom-3 left-3 z-10">
                                <Badge className="text-[10px] font-bold tracking-wider shadow-sm border-none">
                                  {article.category}
                                </Badge>
                              </div>
                            )}
                          </div>

                          {/* Content */}
                          <div className="p-5 flex flex-col flex-1">
                            <div className="flex items-center gap-2 mb-2 text-[11px] text-muted-foreground font-medium tracking-wide">
                              <span>{getAuthorName(article.author?.replace(/-/g, ' ') || 'Scrolli')}</span>
                              <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600"></span>
                              <span>{article.date}</span>
                            </div>

                            <Heading level={4} variant="h6" className={cn(
                              "mb-2 line-clamp-2 text-lg leading-tight group-hover:text-primary transition-colors",
                              colors.foreground.primary
                            )}>
                              {article.title}
                            </Heading>

                            <Text variant="body" className="text-gray-500 dark:text-gray-400 line-clamp-2 mb-4 flex-1 text-sm leading-relaxed">
                              {article.excerpt}
                            </Text>

                            <div className="mt-auto pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
                              <span className="text-[11px] font-medium text-gray-400 flex items-center gap-1">
                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                                {article.readTime}
                              </span>
                              <span className="text-xs font-semibold text-primary flex items-center gap-1 transition-all group-hover:translate-x-1">
                                Read
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
                              </span>
                            </div>
                          </div>
                        </article>
                      </Link>
                    ))}
                  </div>

                  {/* Pagination */}
                  <div className="mt-16 flex justify-center border-t border-gray-200 dark:border-gray-800 pt-8">
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={setCurrentPage}
                    />
                  </div>
                </>
              ) : (
                <div className="py-20 text-center">
                  <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Search className="w-10 h-10 text-gray-400" />
                  </div>
                  <Heading level={3} variant="h4" className="mb-3">
                    We couldn't find anything for "{query}"
                  </Heading>
                  <Text className="text-gray-500 max-w-md mx-auto mb-8">
                    Try searching for different keywords or browsing our popular categories.
                  </Text>
                  <div className="flex flex-wrap justify-center gap-3">
                    {['Technology', 'Culture', 'Startups', 'Design', 'Science'].map(tag => (
                      <Badge
                        key={tag}
                        variant="outline"
                        className="cursor-pointer hover:bg-secondary hover:text-white transition-colors px-4 py-2 text-sm"
                        onClick={() => { setQuery(tag); setInputValue(tag); }}
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <aside className="hidden lg:block lg:w-1/3 xl:w-1/4">
            <div className={cn(
              "sticky top-24 p-6",
              colors.background.elevated,
              borderRadius.xl,
              "border border-gray-100 dark:border-gray-800"
            )}>
              <div className="flex items-center gap-2 mb-6 border-b border-gray-100 dark:border-gray-800 pb-4">
                <span className="w-1 h-5 bg-primary rounded-full"></span>
                <Heading level={5} variant="h6" className="tracking-widest text-xs font-bold text-gray-500">
                  Trending Now
                </Heading>
              </div>

              <div className="space-y-6">
                {blogData.mostRecent.popular.articles.slice(0, 5).map((article, idx) => (
                  <Link key={idx} href={`/${article.id}`} className="group block">
                    <div className="flex gap-4 items-baseline">
                      <span className="text-2xl font-display font-bold text-gray-300 dark:text-gray-700 leading-none group-hover:text-primary transition-colors min-w-[1.5rem]">
                        0{idx + 1}
                      </span>
                      <div className="space-y-1">
                        <Heading level={6} className={cn(
                          "text-sm font-semibold leading-snug group-hover:text-primary transition-colors line-clamp-2",
                          colors.foreground.primary
                        )}>
                          {article.title}
                        </Heading>
                        <Text variant="caption" className="text-[10px] tracking-wider text-gray-400">
                          {article.category}
                        </Text>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </Container>
    </section>
  );
}
