import Link from "next/link";
import Image from "next/image";
import blogData from "@/data/blog.json";

export default function Section1() {
  const { Culture } = blogData;
  return (
    <>
      <div className="content-widget">
        <div className="container">
          <div className="row">
            <div className="col-md-8">
              <h4 className="spanborder">
                <span>{Culture.title}</span>
              </h4>
              <article className="first mb-3">
                <figure>
                  <Link href={`/article/${Culture.mainArticle.id}`}>
                    <Image
                      src={Culture.mainArticle.image}
                      alt={Culture.mainArticle.title}
                      width={736}
                      height={520}
                    />
                  </Link>
                </figure>
                <h1 className="entry-title mb-3">
                  <Link href={`/article/${Culture.mainArticle.id}`}>{Culture.mainArticle.title}</Link>
                </h1>
                <div className="entry-excerpt">
                  <p>{Culture.mainArticle.excerpt}</p>
                </div>
                <div className="entry-meta align-items-center">
                  <Link className="author-avatar" href="#">
                    <Image
                      src="/assets/images/author-avata-1.jpg"
                      alt="author avatar"
                      width={40}
                      height={40}
                    />
                  </Link>
                  <Link href="/author">{Culture.mainArticle.author}</Link> in <Link href="/archive">{Culture.mainArticle.category}</Link>
                  <br />
                  <span>{Culture.mainArticle.date}</span>
                  <span className="middotDivider" />
                  <span className="readingTime" title={Culture.mainArticle.readTime}>
                    {Culture.mainArticle.readTime}
                  </span>
                  <span className="svgIcon svgIcon--star">
                    <svg className="svgIcon-use" width={15} height={15}>
                      <path d="M7.438 2.324c.034-.099.09-.099.123 0l1.2 3.53a.29.29 0 0 0 .26.19h3.884c.11 0 .127.049.038.111L9.8 8.327a.271.271 0 0 0-.099.291l1.2 3.53c.034.1-.011.131-.098.069l-3.142-2.18a.303.303 0 0 0-.32 0l-3.145 2.182c-.087.06-.132.03-.099-.068l1.2-3.53a.271.271 0 0 0-.098-.292L2.056 6.146c-.087-.06-.071-.112.038-.112h3.884a.29.29 0 0 0 .26-.19l1.2-3.52z" />
                    </svg>
                  </span>
                </div>
              </article>
              <div className="divider" />
              {Culture.articles.map((article, idx) => (
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
              <div className="row justify-content-between">
                <div className="divider-2" />
                {Culture.sideArticles.map((article, idx) => (
                  <article key={idx} className="col-md-6">
                    <div className="mb-3 d-flex row">
                      <figure className="col-md-5">
                        <Link href={`/article/${article.id}`}>
                          <Image
                            src={article.image}
                            alt={article.title}
                            width={190}
                            height={165}
                          />
                        </Link>
                      </figure>
                      <div className="entry-content col-md-7 pl-md-0">
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
                    </div>
                  </article>
                ))}
              </div>
            </div>
            {/*col-md-8*/}
            <div className="col-md-4 pl-md-5 sticky-sidebar">
              <div className="sidebar-widget latest-tpl-4">
                <h5 className="spanborder widget-title">
                  <span>Popular in Culture</span>
                </h5>
                <ol>
                  <li className="d-flex">
                    <div className="post-count">01</div>
                    <div className="post-content">
                      <h5 className="entry-title mb-3">
                        <Link href="/article/president-and-the-emails-who-will-guard-the-guards">President and the emails. Who will guard the guards?</Link>
                      </h5>
                      <div className="entry-meta align-items-center">
                        <Link href="/author">Alentica</Link> in <Link href="/archive">Police</Link>
                        <br />
                        <span>May 14</span>
                        <span className="middotDivider" />
                        <span className="readingTime" title="3 min read">
                          3 min read
                        </span>
                        <span className="svgIcon svgIcon--star">
                          <svg className="svgIcon-use" width={15} height={15}>
                            <path d="M7.438 2.324c.034-.099.09-.099.123 0l1.2 3.53a.29.29 0 0 0 .26.19h3.884c.11 0 .127.049.038.111L9.8 8.327a.271.271 0 0 0-.099.291l1.2 3.53c.034.1-.011.131-.098.069l-3.142-2.18a.303.303 0 0 0-.32 0l-3.145 2.182c-.087.06-.132.03-.099-.068l1.2-3.53a.271.271 0 0 0-.098-.292L2.056 6.146c-.087-.06-.071-.112.038-.112h3.884a.29.29 0 0 0 .26-.19l1.2-3.52z" />
                          </svg>
                        </span>
                      </div>
                    </div>
                  </li>
                  <li className="d-flex">
                    <div className="post-count">02</div>
                    <div className="post-content">
                      <h5 className="entry-title mb-3">
                        <Link href="/article/how-to-silence-the-persistent-ding-of-modern-life">How to Silence the Persistent Ding of Modern Life</Link>
                      </h5>
                      <div className="entry-meta align-items-center">
                        <Link href="/author">Alentica</Link> in <Link href="/archive">Police</Link>
                        <br />
                        <span>Jun 12</span>
                        <span className="middotDivider" />
                        <span className="readingTime" title="3 min read">
                          4 min read
                        </span>
                        <span className="svgIcon svgIcon--star">
                          <svg className="svgIcon-use" width={15} height={15}>
                            <path d="M7.438 2.324c.034-.099.09-.099.123 0l1.2 3.53a.29.29 0 0 0 .26.19h3.884c.11 0 .127.049.038.111L9.8 8.327a.271.271 0 0 0-.099.291l1.2 3.53c.034.1-.011.131-.098.069l-3.142-2.18a.303.303 0 0 0-.32 0l-3.145 2.182c-.087.06-.132.03-.099-.068l1.2-3.53a.271.271 0 0 0-.098-.292L2.056 6.146c-.087-.06-.071-.112.038-.112h3.884a.29.29 0 0 0 .26-.19l1.2-3.52z" />
                          </svg>
                        </span>
                      </div>
                    </div>
                  </li>
                  <li className="d-flex">
                    <div className="post-count">03</div>
                    <div className="post-content">
                      <h5 className="entry-title mb-3">
                        <Link href="/article/why-we-love-to-watch">Why We Love to Watch</Link>
                      </h5>
                      <div className="entry-meta align-items-center">
                        <Link href="/author">Alentica</Link> in <Link href="/archive">Police</Link>
                        <br />
                        <span>May 15</span>
                        <span className="middotDivider" />
                        <span className="readingTime" title="3 min read">
                          5 min read
                        </span>
                        <span className="svgIcon svgIcon--star">
                          <svg className="svgIcon-use" width={15} height={15}>
                            <path d="M7.438 2.324c.034-.099.09-.099.123 0l1.2 3.53a.29.29 0 0 0 .26.19h3.884c.11 0 .127.049.038.111L9.8 8.327a.271.271 0 0 0-.099.291l1.2 3.53c.034.1-.011.131-.098.069l-3.142-2.18a.303.303 0 0 0-.32 0l-3.145 2.182c-.087.06-.132.03-.099-.068l1.2-3.53a.271.271 0 0 0-.098-.292L2.056 6.146c-.087-.06-.071-.112.038-.112h3.884a.29.29 0 0 0 .26-.19l1.2-3.52z" />
                          </svg>
                        </span>
                      </div>
                    </div>
                  </li>
                  <li className="d-flex">
                    <div className="post-count">04</div>
                    <div className="post-content">
                      <h5 className="entry-title mb-3">
                        <Link href="/article/how-health-apps-let">How Health Apps Let</Link>
                      </h5>
                      <div className="entry-meta align-items-center">
                        <Link href="/author">Alentica</Link> in <Link href="/archive">Police</Link>
                        <br />
                        <span>April 27</span>
                        <span className="middotDivider" />
                        <span className="readingTime" title="3 min read">
                          6 min read
                        </span>
                        <span className="svgIcon svgIcon--star">
                          <svg className="svgIcon-use" width={15} height={15}>
                            <path d="M7.438 2.324c.034-.099.09-.099.123 0l1.2 3.53a.29.29 0 0 0 .26.19h3.884c.11 0 .127.049.038.111L9.8 8.327a.271.271 0 0 0-.099.291l1.2 3.53c.034.1-.011.131-.098.069l-3.142-2.18a.303.303 0 0 0-.32 0l-3.145 2.182c-.087.06-.132.03-.099-.068l1.2-3.53a.271.271 0 0 0-.098-.292L2.056 6.146c-.087-.06-.071-.112.038-.112h3.884a.29.29 0 0 0 .26-.19l1.2-3.52z" />
                          </svg>
                        </span>
                      </div>
                    </div>
                  </li>
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
