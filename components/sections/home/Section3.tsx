import Link from 'next/link'
import blogData from "@/data/blog.json";
import Image from 'next/image';

export default function Section3() {
  const { todayHighlights } = blogData;

  return (
    <>
      <div className="content-widget">
        <div className="container">
          <div className="row">
            <div className="col-md-10">
              <div className="row justify-content-between">
                {todayHighlights.articles.map((article, index) => (
                  <article key={index} className="col-md-6">
                    <div className="mb-3 d-flex row">
                      <figure className="col-md-5">
                        <Link href={`/article/${article.id}`}>
                          <Image
                            src={article.image}
                            alt={article.title}
                            width={180}
                            height={180}
                          />
                        </Link>
                      </figure>
                      <div className="entry-content col-md-7 pl-md-0">
                        <h5 className="entry-title mb-3">
                          <Link href={`/article/${article.id}`}>{article.title}</Link>
                        </h5>
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
                  </article>
                ))}
              </div>
            </div>
            <div className="col-md-2">
              <div className="sidebar-widget ads">
                <Link href={todayHighlights.ad.link}>
                  <Image
                    src={todayHighlights.ad.image}
                    alt="ads"
                    width={166}
                    height={346}
                  />
                </Link>
              </div>
            </div>
          </div>
          <div className="divider-2" />
        </div>
      </div>
      {/*content-widget*/}
    </>
  );
}
