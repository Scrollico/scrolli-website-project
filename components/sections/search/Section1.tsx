"use client";
import Link from 'next/link'
import Image from 'next/image'
import blogData from '@/data/blog.json'
import Pagination from '@/components/elements/Pagination'
import { useState, useEffect } from 'react'

interface Section1Props {
  searchQuery: string;
}

interface SearchResult {
  article: any;
  score: number;
}

export default function Section1({ searchQuery }: Section1Props) {
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const articlesPerPage = 5;
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    // Combine all articles from different sections
    const allArticles = [
      ...blogData.Culture.articles,
      ...blogData.theStartup.articles,
      ...blogData.RyanMarkPosts.articles,
      ...blogData.mostRecent.mainArticles,
      ...blogData.todayHighlights.articles,
      blogData.featured.mainArticle,
      ...blogData.featured.sideArticles
    ].filter(Boolean); // Remove any null/undefined entries

    // Filter and score articles based on search query
    const searchLower = searchQuery.toLowerCase();
    const results: SearchResult[] = allArticles
      .map(article => {
        let score = 0;

        // Title matches get highest priority
        if (article.title?.toLowerCase().includes(searchLower)) {
          score += 3;
        }

        // Author matches get medium priority
        if (article.author?.toLowerCase().includes(searchLower)) {
          score += 2;
        }

        // Category matches get medium priority
        if (article.category?.toLowerCase().includes(searchLower)) {
          score += 2;
        }
        // Excerpt matches get lowest priority
        if ('excerpt' in article && article.excerpt?.toLowerCase().includes(searchLower)) {
          score += 1;
        }

        return { article, score };
      })
      .filter(result => result.score > 0) // Only keep results with matches
      .sort((a, b) => b.score - a.score); // Sort by score descending

    setSearchResults(results);
    setCurrentPage(1); // Reset to first page when search changes
  }, [searchQuery]);

  const totalPages = Math.ceil(searchResults.length / articlesPerPage);
  const startIdx = (currentPage - 1) * articlesPerPage;
  const endIdx = startIdx + articlesPerPage;
  const paginatedArticles = searchResults.slice(startIdx, endIdx);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <>
      <div className="content-widget">
        <div className="container">
          <div className="row">
            <div className="col-md-8">
              <h4 className="spanborder">
                Search results for
                <span className='ms-2'> "{searchQuery}"</span>
              </h4>
              {paginatedArticles.length > 0 ? (
                paginatedArticles.map(({ article }, idx) => (
                  <article key={idx} className="row justify-content-between mb-5 mr-0">
                    <div className="col-md-9 ">
                      <div className="align-self-center">
                        {article.tag && <div className="capsSubtle mb-2">{article.tag}</div>}
                        <h3 className="entry-title mb-3">
                          <Link href={`/article/${article.id}`}>{article.title}</Link>
                        </h3>
                        <div className="entry-excerpt">
                          <p>{article.excerpt}</p>
                        </div>
                        <div className="entry-meta align-items-center">
                          <Link href="/author">{article.author}</Link> in <Link href="/archive">{article.category}</Link>
                          <br />
                          <span>{article.date}</span>
                          <span className="middotDivider" />
                          <span className="readingTime" title={article.readTime}>
                            {article.readTime}
                          </span>
                          <span className="svgIcon svgIcon--star">
                            <svg className="svgIcon-use" width={15} height={15}>
                              <path d="M7.438 2.324c.034-.099.09-.099.123 0l1.2 3.53a.29.29 0 0 0 .26.19h3.884c.11 0 .127.049.038.111L9.8 8.327a.271.271 0 0 0-.099.291l1.2 3.53c.034.1-.011.131-.098.069l-3.142-2.18a.303.303 0 0 0-.32 0l-3.145 2.182c-.087.06-.132.03-.099-.068l1.2-3.53a.271.271 0 0 0-.098-.292L2.056 6.146c-.087-.06-.071-.112.038-.112h3.884a.29.29 0 0 0 .26-.19l1.2-3.52z" />
                            </svg>
                          </span>
                        </div>
                      </div>
                    </div>
                    <div
                      className="col-md-3 bgcover"
                      style={{
                        backgroundImage: `url(${article.image})`,
                      }}
                    />
                  </article>
                ))
              ) : (
                <div className="text-center py-5">
                  <h3>No results found for "{searchQuery}"</h3>
                  <p>Try different keywords or check your spelling</p>
                </div>
              )}
              {searchResults.length > 0 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              )}
            </div>
            {/*col-md-8*/}
            <div className="col-md-4 pl-md-5 sticky-sidebar">
              <div className="sidebar-widget latest-tpl-4">
                <h5 className="spanborder widget-title">
                  <span>Popular in Culture</span>
                </h5>
                <ol>
                  {blogData.mostRecent.popular.articles.map((article, idx) => (
                    <li key={idx} className="d-flex">
                      <div className="post-count">{article.number}</div>
                      <div className="post-content">
                        <h5 className="entry-title mb-3">
                          <Link href={`/article/${article.id}`}>{article.title}</Link>
                        </h5>
                        <div className="entry-meta align-items-center">
                          <Link href="/author">{article.author}</Link> in <Link href="/archive">{article.category}</Link>
                          <br />
                          <span>{article.date}</span>
                          <span className="middotDivider" />
                          <span className="readingTime" title={article.readTime}>
                            {article.readTime}
                          </span>
                          <span className="svgIcon svgIcon--star">
                            <svg className="svgIcon-use" width={15} height={15}>
                              <path d="M7.438 2.324c.034-.099.09-.099.123 0l1.2 3.53a.29.29 0 0 0 .26.19h3.884c.11 0 .127.049.038.111L9.8 8.327a.271.271 0 0 0-.099.291l1.2 3.53c.034.1-.011.131-.098.069l-3.142-2.18a.303.303 0 0 0-.32 0l-3.145 2.182c-.087.06-.132.03-.099-.068l1.2-3.53a.271.271 0 0 0-.098-.292L2.056 6.146c-.087-.06-.071-.112.038-.112h3.884a.29.29 0 0 0 .26-.19l1.2-3.52z" />
                            </svg>
                          </span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
            {/*col-md-4*/}
          </div>
        </div>
        {/*content-widget*/}
      </div>
      <div className="content-widget">
        <div className="container">
          <div className="sidebar-widget ads">
            <Link href="#">
              <Image
                src="/assets/images/ads/ads-2.png"
                alt="ads"
                width={600}
                height={71}
              />
            </Link>
          </div>
          <div className="hr" />
        </div>
      </div>
      {/*content-widget*/}
    </>
  );
}
