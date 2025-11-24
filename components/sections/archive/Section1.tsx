"use client"
import Link from 'next/link'
import blogData from '@/data/blog.json';
import Pagination from '@/components/elements/Pagination';
import { useState } from 'react';
import Image from 'next/image';
import { 
  sectionPadding, 
  componentPadding,
  gap,
  colors,
  borderRadius,
  elevationHover,
  surface,
  transition
} from "@/lib/design-tokens";
import { cn } from "@/lib/utils";
import { Heading, Text } from "@/components/ui/typography";
import { Container } from "@/components/responsive";
import ArticleMeta from './ArticleMeta';
import ArticleCard from './ArticleCard';

export default function Section1() {
  const { theStartup } = blogData;
  const articlesPerPage = 6;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(theStartup.articles.length / articlesPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Optional: smooth scroll to top of section
    // window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const startIdx = (currentPage - 1) * articlesPerPage;
  const endIdx = startIdx + articlesPerPage;
  const paginatedArticles = theStartup.articles.slice(startIdx, endIdx);

  return (
    <>
      {/* Main Archive Section */}
      <section className={cn(sectionPadding.md, colors.background.base)}>
        <Container>
          {/* Archive Header */}
          <header className={cn("text-center max-w-4xl mx-auto mb-12 flex flex-col", gap.sm)}>
              <Heading level={1} variant="h1">
                {theStartup.title}
              </Heading>
              <Text variant="body" color="secondary" className="max-w-2xl mx-auto">
                {theStartup.description}
              </Text>
          </header>

          <div className={cn("w-full h-px my-12 bg-gray-200 dark:bg-gray-700")} />

          {/* Featured Post */}
          <div className={cn(
            "grid grid-cols-1 md:grid-cols-2 overflow-hidden mb-16", 
            surface.raised,
            borderRadius.lg,
            transition.normal,
            elevationHover[2],
            "border border-transparent hover:border-gray-200 dark:hover:border-gray-700 group"
          )}>
            <Link href={`/article/${theStartup.mainArticle.id}`} className="relative w-full min-h-[300px] md:min-h-[400px] overflow-hidden">
               <Image 
                 src={theStartup.mainArticle.image}
                 alt={theStartup.mainArticle.title}
                 fill
                 className="object-cover transition-transform duration-500 group-hover:scale-105"
                 priority
                 sizes="(max-width: 768px) 100vw, 50vw"
               />
            </Link>
            <div className={cn("flex flex-col justify-center", componentPadding.lg, gap.md)}>
                <Text variant="caption" color="muted" className="uppercase tracking-wider font-medium">
                  {theStartup.mainArticle.tag}
                </Text>
                <Heading level={2} variant="h2">
                  <Link href={`/article/${theStartup.mainArticle.id}`} className={cn(colors.foreground.interactive, "hover:underline")}>
                    {theStartup.mainArticle.title}
                  </Link>
                </Heading>
                <Text variant="body" color="secondary" className="line-clamp-3">
                    {theStartup.mainArticle.excerpt}
                </Text>
                
                <div className="pt-6 mt-2 border-t border-gray-100 dark:border-gray-700">
                    <ArticleMeta 
                        author={theStartup.mainArticle.author}
                        category={theStartup.mainArticle.category}
                        date={theStartup.mainArticle.date}
                        readTime={theStartup.mainArticle.readTime}
                    />
                </div>
            </div>
          </div>

          <div className={cn("w-full h-px my-12 bg-gray-200 dark:bg-gray-700")} />

          {/* Article Grid */}
          <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3", gap.lg)}>
            {paginatedArticles.map((article, idx) => (
              <ArticleCard 
                key={article.id || idx}
                id={article.id}
                title={article.title}
                excerpt={article.excerpt}
                image={article.image}
                author={article.author}
                category={article.category}
                date={article.date}
                readTime={article.readTime}
              />
            ))}
          </div>
          
          <div className="mt-16">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>

        </Container>
      </section>

      {/* Ads Section */}
      <section className={cn(sectionPadding.md, colors.background.base)}>
        <Container>
          <div className={cn(
              "flex justify-center items-center overflow-hidden",
              surface.raised,
              componentPadding.md,
              borderRadius.lg
          )}>
            <Link href="#">
              <Image
                src="/assets/images/ads/ads-2.png"
                alt="Advertisement"
                width={600}
                height={71}
                className="max-w-full h-auto"
              />
            </Link>
          </div>
          <div className={cn("w-full h-px mt-12 bg-gray-200 dark:bg-gray-700")} />
        </Container>
      </section>
    </>
  );
}
