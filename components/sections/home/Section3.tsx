import Link from 'next/link'
import blogData from "@/data/blog.json";
import Image from 'next/image';
import { gradientVariants } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PodcastSection from './PodcastSection';

export default function Section3() {
  const { todayHighlights } = blogData;

  return (
    <>
      <div className="content-widget">
        <Tabs defaultValue="tümü" className="w-full">
          <TabsList className="bg-transparent p-0 h-auto gap-2 mb-8 mt-12 justify-center w-full">
            <TabsTrigger
              value="tümü"
              className="rounded-lg px-4 py-2 text-sm font-medium transition-all data-[state=active]:bg-green-600 data-[state=active]:text-white data-[state=active]:border-0 data-[state=inactive]:bg-white data-[state=inactive]:text-gray-900 data-[state=inactive]:border data-[state=inactive]:border-gray-300 dark:data-[state=inactive]:bg-gray-800 dark:data-[state=inactive]:text-gray-300 dark:data-[state=inactive]:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              Tümü
            </TabsTrigger>
            <TabsTrigger
              value="eksen"
              className="rounded-lg px-4 py-2 text-sm font-medium transition-all data-[state=active]:bg-green-600 data-[state=active]:text-white data-[state=active]:border-0 data-[state=inactive]:bg-white data-[state=inactive]:text-gray-900 data-[state=inactive]:border data-[state=inactive]:border-gray-300 dark:data-[state=inactive]:bg-gray-800 dark:data-[state=inactive]:text-gray-300 dark:data-[state=inactive]:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              Eksen
            </TabsTrigger>
            <TabsTrigger
              value="zest"
              className="rounded-lg px-4 py-2 text-sm font-medium transition-all data-[state=active]:bg-green-600 data-[state=active]:text-white data-[state=active]:border-0 data-[state=inactive]:bg-white data-[state=inactive]:text-gray-900 data-[state=inactive]:border data-[state=inactive]:border-gray-300 dark:data-[state=inactive]:bg-gray-800 dark:data-[state=inactive]:text-gray-300 dark:data-[state=inactive]:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              Zest
            </TabsTrigger>
            <TabsTrigger
              value="finans"
              className="rounded-lg px-4 py-2 text-sm font-medium transition-all data-[state=active]:bg-green-600 data-[state=active]:text-white data-[state=active]:border-0 data-[state=inactive]:bg-white data-[state=inactive]:text-gray-900 data-[state=inactive]:border data-[state=inactive]:border-gray-300 dark:data-[state=inactive]:bg-gray-800 dark:data-[state=inactive]:text-gray-300 dark:data-[state=inactive]:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              Finans
            </TabsTrigger>
            <TabsTrigger
              value="gelecek"
              className="rounded-lg px-4 py-2 text-sm font-medium transition-all data-[state=active]:bg-green-600 data-[state=active]:text-white data-[state=active]:border-0 data-[state=inactive]:bg-white data-[state=inactive]:text-gray-900 data-[state=inactive]:border data-[state=inactive]:border-gray-300 dark:data-[state=inactive]:bg-gray-800 dark:data-[state=inactive]:text-gray-300 dark:data-[state=inactive]:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              Gelecek
            </TabsTrigger>
          </TabsList>

          <TabsContent value="tümü">
            <div className="container">
              <div className="row">
                <div className="col-md-10">
                  <div className="row justify-content-between">
                    {todayHighlights.articles.map((article, index) => (
                      <article key={index} className="col-md-6">
                        <div className="mb-3 d-flex row">
                          <figure className="col-md-5 relative">
                            <Link href={`/article/${article.id}`}>
                              <Image
                                src={article.image}
                                alt={article.title}
                                width={180}
                                height={180}
                                className="w-full h-auto object-cover"
                                sizes="(max-width: 768px) 100vw, 180px"
                              />
                              {/* Responsive gradient overlay for better visual depth */}
                              <div className={`absolute inset-0 ${gradientVariants.contentOverlay} opacity-60`} />
                            </Link>
                          </figure>
                          <div className="entry-content col-md-7 pl-md-0">
                            <h5 className="entry-title mb-3">
                              <Link href={`/article/${article.id}`}>{article.title}</Link>
                            </h5>
                            <div className="entry-excerpt">
                              <p>{article.excerpt}</p>
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
          </TabsContent>

          <TabsContent value="eksen">
            <div className="container">
              <div className="row">
                <div className="col-md-10">
                  <div className="row justify-content-between">
                    {todayHighlights.articles.slice(0, 1).map((article, index) => (
                      <article key={index} className="col-md-6">
                        <div className="mb-3 d-flex row">
                          <figure className="col-md-5 relative">
                            <Link href={`/article/${article.id}`}>
                              <Image
                                src={article.image}
                                alt={article.title}
                                width={180}
                                height={180}
                                className="w-full h-auto object-cover"
                                sizes="(max-width: 768px) 100vw, 180px"
                              />
                              {/* Responsive gradient overlay for better visual depth */}
                              <div className={`absolute inset-0 ${gradientVariants.contentOverlay} opacity-60`} />
                            </Link>
                          </figure>
                          <div className="entry-content col-md-7 pl-md-0">
                            <h5 className="entry-title mb-3">
                              <Link href={`/article/${article.id}`}>{article.title}</Link>
                            </h5>
                            <div className="entry-excerpt">
                              <p>{article.excerpt}</p>
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
          </TabsContent>

          <TabsContent value="zest">
            <div className="container">
              <div className="row">
                <div className="col-md-10">
                  <div className="row justify-content-between">
                    {todayHighlights.articles.slice(1, 2).map((article, index) => (
                      <article key={index} className="col-md-6">
                        <div className="mb-3 d-flex row">
                          <figure className="col-md-5 relative">
                            <Link href={`/article/${article.id}`}>
                              <Image
                                src={article.image}
                                alt={article.title}
                                width={180}
                                height={180}
                                className="w-full h-auto object-cover"
                                sizes="(max-width: 768px) 100vw, 180px"
                              />
                              {/* Responsive gradient overlay for better visual depth */}
                              <div className={`absolute inset-0 ${gradientVariants.contentOverlay} opacity-60`} />
                            </Link>
                          </figure>
                          <div className="entry-content col-md-7 pl-md-0">
                            <h5 className="entry-title mb-3">
                              <Link href={`/article/${article.id}`}>{article.title}</Link>
                            </h5>
                            <div className="entry-excerpt">
                              <p>{article.excerpt}</p>
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
          </TabsContent>

          <TabsContent value="finans">
            <div className="container">
              <div className="row">
                <div className="col-md-10">
                  <div className="row justify-content-between">
                    {todayHighlights.articles.slice(2, 3).map((article, index) => (
                      <article key={index} className="col-md-6">
                        <div className="mb-3 d-flex row">
                          <figure className="col-md-5 relative">
                            <Image
                              src={article.image}
                              alt={article.title}
                              width={180}
                              height={180}
                              className="w-full h-auto object-cover"
                              sizes="(max-width: 768px) 100vw, 180px"
                            />
                            {/* Responsive gradient overlay for better visual depth */}
                            <div className={`absolute inset-0 ${gradientVariants.contentOverlay} opacity-60`} />
                          </figure>
                          <div className="entry-content col-md-7 pl-md-0">
                            <h5 className="entry-title mb-3">
                              <Link href={`/article/${article.id}`}>{article.title}</Link>
                            </h5>
                            <div className="entry-excerpt">
                              <p>{article.excerpt}</p>
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
          </TabsContent>

          <TabsContent value="gelecek">
            <div className="container">
              <div className="row">
                <div className="col-md-10">
                  <div className="row justify-content-between">
                    {todayHighlights.articles.slice(0, 2).map((article, index) => (
                      <article key={index} className="col-md-6">
                        <div className="mb-3 d-flex row">
                          <figure className="col-md-5 relative">
                            <Link href={`/article/${article.id}`}>
                              <Image
                                src={article.image}
                                alt={article.title}
                                width={180}
                                height={180}
                                className="w-full h-auto object-cover"
                                sizes="(max-width: 768px) 100vw, 180px"
                              />
                              {/* Responsive gradient overlay for better visual depth */}
                              <div className={`absolute inset-0 ${gradientVariants.contentOverlay} opacity-60`} />
                            </Link>
                          </figure>
                          <div className="entry-content col-md-7 pl-md-0">
                            <h5 className="entry-title mb-3">
                              <Link href={`/article/${article.id}`}>{article.title}</Link>
                            </h5>
                            <div className="entry-excerpt">
                              <p>{article.excerpt}</p>
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
          </TabsContent>
        </Tabs>
      </div>
      {/*content-widget*/}
      
      {/* Podcast Section */}
      <PodcastSection />
    </>
  );
}
