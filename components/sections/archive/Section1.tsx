"use client"
import Link from 'next/link'
import blogData from '@/data/blog.json';
import Pagination from '@/components/elements/Pagination';
import { useState } from 'react';
import Image from 'next/image';

export default function Section1() {
  const { theStartup } = blogData;
  const articlesPerPage = 6;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(theStartup.articles.length / articlesPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const startIdx = (currentPage - 1) * articlesPerPage;
  const endIdx = startIdx + articlesPerPage;
  const paginatedArticles = theStartup.articles.slice(startIdx, endIdx);

  return (
    <>
      <div className="content-widget">
        <div className="container">
          {/*Begin Archive Header*/}
          <div className="row">
            <div className="col-12 archive-header text-center pt-3 pb-3">
              <h1 className="mb-3">{theStartup.title}</h1>
              <p className="archive-intro">{theStartup.description}</p>
            </div>
          </div>
          <div className="divider" />
          {/*End Archive Header*/}
          {/*Begin Featured Post*/}
          <div className="row justify-content-between post-has-bg ml-0 mr-0">
            <div
              className="col-lg-6 col-md-4 bgcover d-none d-md-block pl-md-0 ml-0"
              style={{
                backgroundImage: `url(${theStartup.mainArticle.image})`,
                minHeight: 400,
              }}
            />
            <div className="col-lg-6 col-md-8">
              <div className="pt-5 pb-5 ps-md-5 pe-5 align-self-center">
                <div className="capsSubtle mb-2">{theStartup.mainArticle.tag}</div>
                <h2 className="entry-title mb-3">
                  <Link href={`/article/${theStartup.mainArticle.id}`}>{theStartup.mainArticle.title}</Link>
                </h2>
                <div className="entry-excerpt">
                  <p>{theStartup.mainArticle.excerpt}</p>
                </div>
                <div className="entry-meta align-items-center">
                  <Link href="/author">{theStartup.mainArticle.author}</Link> in <Link href="/archive">{theStartup.mainArticle.category}</Link>
                  <br />
                  <span>{theStartup.mainArticle.date}</span>
                  <span className="middotDivider" />
                  <span className="readingTime" title={theStartup.mainArticle.readTime}>
                    {theStartup.mainArticle.readTime}
                  </span>
                  <span className="svgIcon svgIcon--star">
                    <svg className="svgIcon-use" width={15} height={15}>
                      <path d="M7.438 2.324c.034-.099.09-.099.123 0l1.2 3.53a.29.29 0 0 0 .26.19h3.884c.11 0 .127.049.038.111L9.8 8.327a.271.271 0 0 0-.099.291l1.2 3.53c.034.1-.011.131-.098.069l-3.142-2.18a.303.303 0 0 0-.32 0l-3.145 2.182c-.087.06-.132.03-.099-.068l1.2-3.53a.271.271 0 0 0-.098-.292L2.056 6.146c-.087-.06-.071-.112.038-.112h3.884a.29.29 0 0 0 .26-.19l1.2-3.52z" />
                    </svg>
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="divider" />
          {/*End Featured Post*/}
          <div className="row">
            {paginatedArticles.map((article, idx) => (
              <article key={idx} className="post-list-style-2 mb-5 col-md-4">
                <Link href={`/article/${article.id}`}>
                  <figure
                    className="bgcover d-none d-md-block"
                    style={{
                      backgroundImage: `url(${article.image})`,
                      minHeight: 200,
                    }}
                  />
                </Link>
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
              </article>
            ))}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
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
