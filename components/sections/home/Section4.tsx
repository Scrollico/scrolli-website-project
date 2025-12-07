"use client"
import Link from 'next/link'
import blogData from "@/data/blog.json"
import Pagination from '@/components/elements/Pagination'
import Image from 'next/image'
import { useState } from 'react'
import { gradientVariants, cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Container } from "@/components/responsive"
import { Heading, Text } from "@/components/ui/typography"
import { colors, gap, componentPadding, sectionPadding, typography } from "@/lib/design-tokens"

export default function Section4() {
  const { mostRecent } = blogData;
  const [currentSidePage, setCurrentSidePage] = useState(1);
  const itemsPerPage = 4; // Hiển thị 4 bài viết trên mỗi trang

  const handleSidePageChange = (page: number) => {
    setCurrentSidePage(page);
  };

  // Tính toán các bài viết cần hiển thị cho trang hiện tại
  const startIndex = (currentSidePage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentSideArticles = mostRecent.sideArticles.slice(startIndex, endIndex);
  const totalSidePages = Math.ceil(mostRecent.sideArticles.length / itemsPerPage);

  return (
    <>
      <div className="content-widget">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-8 lg:gap-12">
            <div>
              <Heading level={2} variant="h2" decoration="underlinePrimary" className="mb-6">
                {mostRecent.title}
              </Heading>
              {mostRecent.mainArticles.map((article, index) => (
                <article key={index} className={cn("grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-6", gap.xl)}>
                  <div>
                    <div>
                      {/* Tag Badge */}
                      {article.tag && (
                        <div className={cn(gap.sm, "flex justify-start")}>
                          <Badge
                            variant={article.tag === "Editors' Pick" ? "primary" : "secondary"}
                            appearance={article.tag === "Editors' Pick" ? "default" : "outline"}
                            size="sm"
                            className="uppercase tracking-wide"
                          >
                            {article.tag}
                          </Badge>
                        </div>
                      )}
                      {/* Category Badge */}
                      {article.category && (
                        <div className={cn(gap.sm, "flex justify-start")}>
                          <Badge
                            variant="secondary"
                            appearance="outline"
                            size="sm"
                            className="uppercase tracking-wide"
                          >
                            {article.category}
                          </Badge>
                        </div>
                      )}
                      <Heading level={3} variant="h3" className={gap.md}>
                        <Link href={`/article/${article.id}`} className={colors.foreground.interactive}>{article.title}</Link>
                      </Heading>
                      <div className="entry-excerpt">
                        <Text variant="body" color="secondary">{article.excerpt}</Text>
                      </div>
                    </div>
                  </div>
                  <div className="relative rounded-lg overflow-hidden aspect-[4/3] md:aspect-[3/4]">
                    <div
                      className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                      style={{
                        backgroundImage: `url(${article.image})`,
                      }}
                    />
                    {/* Responsive gradient overlay for better text contrast */}
                    <div className={`absolute inset-0 ${gradientVariants.contentOverlay} opacity-70`} />
                  </div>
                </article>
              ))}
              <div className="row justify-content-between">
                <div className="divider-2" />
                <div className="row">
                  {currentSideArticles.map((article, index) => (
                    <article key={index} className="col-md-6 mb-4">
                      <div className="mb-3 d-flex row">
                        <figure className="col-md-5">
                          <Link href={`/article/${article.id}`}>
                            <Image
                              className="lazy w-full h-auto object-cover"
                              src={article.image}
                              alt={article.title}
                              width={190}
                              height={166}
                              sizes="(max-width: 768px) 100vw, 190px"
                            />
                          </Link>
                        </figure>
                        <div className="entry-content col-md-7 pl-md-0">
                          <h5 className="entry-title mb-3">
                            <Link href={`/article/${article.id}`}>{article.title}</Link>
                          </h5>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
                <div className="col-12">
                  <Pagination
                    currentPage={currentSidePage}
                    totalPages={totalSidePages}
                    onPageChange={handleSidePageChange}
                  />
                </div>
              </div>
            </div>
            {/*col-md-8*/}
            <div className="col-md-4 pl-md-5 sticky-sidebar">
              <div className="sidebar-widget latest-tpl-4">
                <h4 className="spanborder">
                  <span>{mostRecent.popular.title}</span>
                </h4>
                <ol>
                  {mostRecent.popular.articles.map((article, index) => (
                    <li key={index} className="d-flex">
                      <div className="post-count">{article.number}</div>
                      <div className="post-content">
                        <h5 className="entry-title mb-3">
                          <Link href={`/article/${article.id}`}>{article.title}</Link>
                        </h5>
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
            <Link href={mostRecent.ad.link}>
              <Image
                src={mostRecent.ad.image}
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
