import Link from "next/link";
import Image from 'next/image';
import blogData from "@/data/blog.json";

export default function Section1() {
  const { featured } = blogData;

  return (
    <>
      <div className="section-featured featured-style-1">
        <div className="container">
          <div className="row">
            {/*begin featured*/}
            <div className="col-sm-12">
              <h2 className="spanborder h4">
                <span>{featured.title}</span>
              </h2>
              <div className="row">
                {/* 1x3 Grid - 3 identical large cards */}
                {[featured.mainArticle, ...featured.sideArticles.slice(0, 2)].map((article, index) => (
                  <div key={index} className="col-sm-12 col-md-4">
                    <article className="first mb-3">
                      <figure>
                        <Link href={`/article/${article.id}`}>
                          <Image
                            className="lazy"
                            src={article.image}
                            alt={article.title}
                            width={404}
                            height={227}
                          />
                        </Link>
                      </figure>
                      <h3 className="entry-title mb-3">
                        <Link href={`/article/${article.id}`}>{article.title}</Link>
                      </h3>
                      <div className="entry-excerpt">
                        <p>{article.excerpt || "And black on meretriciously regardless well fearless irksomely as about hideous wistful bat less oh much and occasional useful rat darn jeepers far."}</p>
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
                    {index === 0 && (
                      <Link className="btn btn-green d-inline-block mb-4 mb-md-0" href="/archive">
                        All Featured
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            </div>
            {/*end featured*/}
          </div>
          {/*end row*/}
          <div className="divider" />
        </div>
        {/*end container*/}
      </div>
    </>
  );
}
