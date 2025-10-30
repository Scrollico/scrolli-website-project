"use client";
import Link from 'next/link'
import blogData from '@/data/blog.json';
import Pagination from '@/components/elements/Pagination';
import { useState } from 'react';
import Image from 'next/image';

export default function Section1() {
  const { RyanMarkPosts, hightlightPosts } = blogData;
  const articlesPerPage = 5;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(RyanMarkPosts.articles.length / articlesPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const startIdx = (currentPage - 1) * articlesPerPage;
  const endIdx = startIdx + articlesPerPage;
  const paginatedArticles = RyanMarkPosts.articles.slice(startIdx, endIdx);

  return (
    <>
      <div className="content-widget">
        <div className="container">
          <div className="row">
            <div className="col-md-8">
              <div className="box box-author m_b_2rem">
                <div className="post-author row-flex">
                  <div className="author-img">
                    <Image
                      alt="author avatar"
                      src="/assets/images/author-avata-1.jpg"
                      className="avatar"
                      width={106}
                      height={106}
                    />
                  </div>
                  <div className="author-content">
                    <div className="top-author">
                      <h5 className="heading-font">
                        <Link href="/author" title="Ryan" rel="author">
                          Ryan Mark
                        </Link>
                      </h5>
                    </div>
                    <p className="d-none d-md-block">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse laoreet ut ligula et semper. Aenean consectetur, est id gravida venenatis.</p>
                    <div className="content-social-author">
                      <Link target="_blank" className="author-social" href="https://www.facebook.com">
                        Facebook
                      </Link>
                      <Link target="_blank" className="author-social" href="https://www.twitter.com">
                        Twitter
                      </Link>
                      <Link target="_blank" className="author-social" href="https://www.instagram.com">
                        Instagram
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
              <h4 className="spanborder">
                <span>Latest Posts</span>
              </h4>
              {paginatedArticles.map((article, idx) => (
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
              ))}
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
            {/*col-md-8*/}
            <div className="col-md-4 pl-md-5 sticky-sidebar">
              <div className="sidebar-widget latest-tpl-4">
                <h5 className="spanborder widget-title">
                  <span>{hightlightPosts.title}</span>
                </h5>
                <ol>
                  {hightlightPosts.articles.map((article, index) => (
                    <li key={index} className="d-flex">
                      <div className="post-count">{(index + 1).toString().padStart(2, '0')}</div>
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
