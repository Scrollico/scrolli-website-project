'use client';
import Link from 'next/link'
import Comments from './Comments';
import Image from 'next/image';
import blogData from '@/data/blog.json';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import { useState, useEffect } from 'react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface Article {
  id: string;
  title: string;
  excerpt?: string;
  author: string;
  category: string;
  date: string;
  readTime: string;
  image?: string;
  tag?: string;
  number?: string;
}

interface Section1Props {
  article: Article;
}

export default function Section1({ article }: Section1Props) {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollPercentage = (scrollTop / (documentHeight - windowHeight)) * 100;
      setScrollProgress(scrollPercentage);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <article className="container" itemScope itemType="https://schema.org/Article">
        {/* Article Header */}
        <header className="entry-header">
          <div className="mb-5">
            <h1 className="entry-title m_b_2rem" itemProp="headline">{article.title}</h1>
            <div className="entry-meta align-items-center" itemProp="author" itemScope itemType="https://schema.org/Person">
              <Link className="author-avatar" href="#">
                <Image
                  src="/assets/images/author-avata-2.jpg"
                  alt="author avatar"
                  width={50}
                  height={50}
                />
              </Link>
              <div className="entry-meta-line">
                <Link href="/author">{article.author}</Link> in <Link href="/archive">{article.category}</Link>
              </div>
              <div className="entry-meta-line">
                <span>{article.date}</span>
                <span className="middotDivider" />
                <span className="readingTime" title={article.readTime}>
                  {article.readTime}
                </span>
              </div>
            </div>
          </div>
        </header>
        {/*end single header*/}
        {article.image && (
          <figure className="image zoom mb-5 featured-image">
            <figure>
              <Link href={`/article/${article.id}`}>
                <Image
                  className="lazy img-fluid responsive-image"
                  src={article.image}
                  alt={article.title}
                  width={1240}
                  height={700}
                />
              </Link>
            </figure>
          </figure>
        )}
        {/*figure*/}
        <article className="entry-wraper mb-5">
          <div className="entry-left-col">
            <div className="social-sticky">
              <Link href="#">
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </Link>
              <Link href="#">
                <i className="icon-linkedin" />
              </Link>
              <Link href="#" className="social-heart">
                <i className={`icon-heart ${scrollProgress > 20 ? 'pulse-animation' : ''}`} />
              </Link>
            </div>
          </div>
          {article.excerpt && (
            <div className="excerpt mb-4">
              <p>{article.excerpt}</p>
            </div>
          )}
          <div className="entry-main-content dropcap">
            <p>
              Gosh jaguar ostrich quail one excited dear hello and <Link href="#">bound</Link>
              <sup>
                <Link href="#">[1]</Link>
              </sup>
              and the and bland moral misheard roadrunner flapped lynx far that and jeepers giggled far and far bald that roadrunner python inside held shrewdly the manatee.
            </p>
            <p>
              Thanks sniffed in hello after in foolhardy and some far purposefully much one at the much conjointly leapt skimpily that quail sheep some goodness <Link href="#">nightingale</Link> the instead exited expedient up far ouch mellifluous altruistic and and lighted more instead much when ferret but the.
            </p>
            <hr className="section-divider" />
            <p>
              Yet more some certainly yet alas abandonedly whispered <Link href="#">intriguingly</Link>
              <sup>
                <Link href="#">[2]</Link>
              </sup>
              well extensive one howled talkative admonishingly below a rethought overlaid dear gosh activated less <Link href="#">however</Link> hawk yet oh scratched ostrich some outside crud irrespective lightheartedly and much far amenably that the elephant since when.
            </p>
            <h2>The Guitar Legends</h2>
            <p>
              Furrowed this in the upset <Link href="#">some across</Link>
              <sup>
                <Link href="#">[3]</Link>
              </sup>
              tiger oh loaded house gosh whispered <Link href="#">faltering alas</Link>
              <sup>
                <Link href="#">[4]</Link>
              </sup>
              ouch cuckoo coward in scratched undid together bit fumblingly so besides salamander heron during the jeepers hello fitting jauntily much smoothly globefish darn blessedly far so along bluebird leopard and.
            </p>
            <blockquote>
              <p>
                Integer eu faucibus <Link href="#">dolor</Link>
                <sup>
                  <Link href="#">[5]</Link>
                </sup>
                . Ut venenatis tincidunt diam elementum imperdiet. Etiam accumsan semper nisl eu congue. Sed aliquam magna erat, ac eleifend lacus rhoncus in.
              </p>
            </blockquote>
            <p>Fretful human far recklessly while caterpillar well a well blubbered added one a some far whispered rampantly whispered while irksome far clung irrespective wailed more rosily and where saluted while black dear so yikes as considering recast to some crass until cow much less and rakishly overdrew consistent for by responsible oh one hypocritical less bastard hey oversaw zebra browbeat a well.</p>
            <h3>Getting Crypto Rich</h3>
            <p>And far contrary smoked some contrary among stealthy engagingly suspiciously a cockatoo far circa sank dully lewd slick cracked llama the much gecko yikes more squirrel sniffed this and the the much within uninhibited this abominable a blubbered overdid foresaw through alas the pessimistic.</p>
            <p>Gosh jaguar ostrich quail one excited dear hello and bound and the and bland moral misheard roadrunner flapped lynx far that and jeepers giggled far and far bald that roadrunner python inside held shrewdly the manatee.</p>
            <hr className="section-divider" />
            <p>Thanks sniffed in hello after in foolhardy and some far purposefully much one at the much conjointly leapt skimpily that quail sheep some goodness nightingale the instead exited expedient up far ouch mellifluous altruistic and and lighted more instead much when ferret but the.</p>
            {/*Begin Subcrible*/}
            <div className="border p-5 bg-lightblue mb-5">
              <div className="row justify-content-between">
                <div className="col-md-5 mb-2 mb-md-0">
                  <h5 className="font-weight-bold secondfont mb-3 mt-0">Become a member</h5>
                  <p className="small-text">Get the latest news right in your inbox. We never spam!</p>
                </div>
                <div className="col-md-7">
                  <div className="row">
                    <div className="col-md-12">
                      <input type="text" className="form-control" placeholder="Enter your e-mail address" />
                    </div>
                    <div className="col-md-12 mt-2">
                      <button type="submit" className="btn btn-success btn-block">
                        Subscribe
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/*End Subcrible*/}
            <p>Yet more some certainly yet alas abandonedly whispered intriguingly well extensive one howled talkative admonishingly below a rethought overlaid dear gosh activated less however hawk yet oh scratched ostrich some outside crud irrespective lightheartedly and much far amenably that the elephant since when.</p>
          </div>
          <div className="entry-bottom">
            <div className="tags-wrap heading">
              <span className="tags">
                <Link href="#" rel="tag">
                  fashion
                </Link>
                <Link href="#" rel="tag">
                  lifestyle
                </Link>
                <Link href="#" rel="tag">
                  news
                </Link>
                <Link href="#" rel="tag">
                  style
                </Link>
              </span>
            </div>
          </div>
          <div className="box box-author m_b_2rem">
            <div className="post-author row-flex">
              <div className="author-img">
                <Image
                  alt="author avatar"
                  src="/assets/images/author-avata-1.jpg"
                  className="avatar"
                  width={120}
                  height={120}
                />
              </div>
              <div className="author-content">
                <div className="top-author">
                  <h5 className="heading-font">
                    <Link href="/author" title={article.author} rel="author">
                      {article.author}
                    </Link>
                  </h5>
                </div>
                <p className="d-none d-md-block">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse laoreet ut ligula et semper. Aenean consectetur, est id gravida venenatis.</p>
              </div>
            </div>
          </div>
        </article>
        {/*entry-content*/}
        {/*Begin post related*/}
        <div className="related-posts mb-5">
          <h4 className="spanborder text-center">
            <span>{blogData.relatedPosts.title}</span>
          </h4>
          <div className="swiper-container">
            <Swiper
              modules={[Autoplay, Navigation, Pagination]}
              spaceBetween={30}
              slidesPerView={3}
              navigation={false}
              pagination={{ clickable: true }}
              loop={true}
              autoplay={{
                delay: 5000,
                disableOnInteraction: false,
              }}
              breakpoints={{
                320: {
                  slidesPerView: 1,
                  spaceBetween: 20
                },
                640: {
                  slidesPerView: 2,
                  spaceBetween: 20
                },
                768: {
                  slidesPerView: 3,
                  spaceBetween: 30
                }
              }}
              className="related-posts-slider"
            >
              {blogData.relatedPosts.articles.map((post) => (
                <SwiperSlide key={post.id}>
                  <article className="col-12">
                    <div className="mb-3 d-flex row">
                      <figure className="col-md-5">
                        <Link href={`/article/${post.id}`}>
                          <Image
                            className="lazy"
                            src={post.image}
                            alt={post.title}
                            width={180}
                            height={180}
                          />
                        </Link>
                      </figure>
                      <div className="entry-content col-md-7 pl-md-0">
                        <h5 className="entry-title mb-3">
                          <Link href={`/article/${post.id}`}>{post.title}</Link>
                        </h5>
                        <div className="entry-meta align-items-center">
                          <Link href="/author">{post.author}</Link> in <Link href="/archive">{post.category}</Link>
                          <br />
                          <span>{post.date}</span>
                          <span className="middotDivider" />
                          <span className="readingTime" title={post.readTime}>
                            {post.readTime}
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
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
        {/*End post related*/}
        <Comments />
      </article>
      <style jsx>{`
        .responsive-image {
          height: 400px;
          object-fit: cover;
        }
        .featured-image {
          max-height: 400px;
          object-fit: cover;
          object-position: center;
          overflow: hidden;
          display: flex;
          align-content: center;
          justify-content: center;
          align-items: center;
        }
        @media (min-width: 768px) {
          .responsive-image {
            height: 700px;
          }
          .featured-image {
            max-height: 700px;
          }
        }
        :global(.swiper-container) {
          padding-bottom: 50px;
        }
        :global(.swiper-pagination) {
          bottom: 0;
        }
        :global(.swiper-button-prev),
        :global(.swiper-button-next) {
          color: var(--primary);
        }

        /* Social heart pulse animation on scroll */
        .social-heart {
          opacity: 1;
          transition: opacity 0.3s ease;
        }

        .social-heart i {
          animation: none;
        }

        .social-heart i.pulse-animation {
          animation: heartPulse 2s ease-in-out infinite;
        }
      `}</style>

      <style jsx global>{`
        @keyframes heartPulse {
          0%, 100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.1);
            opacity: 0.8;
          }
        }

        .social-sticky i {
          vertical-align: middle;
          font-size: 13px;
        }
      `}</style>
    </>
  );
}
