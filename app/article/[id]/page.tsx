import { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import Layout from "@/components/layout/Layout";
import Section1 from "@/components/sections/single/Section1";
import { findArticleById } from "@/lib/content";
import { generateArticleMetadata, formatDateForSEO } from "@/lib/seo";
import {
  generateArticleStructuredData,
  generateBreadcrumbStructuredData,
  generateArticleBreadcrumbs,
} from "@/lib/structured-data";
import { Article } from "@/types/content";

interface ArticlePageProps {
  params: Promise<{ id: string }>;
}

// Generate metadata for SEO
export async function generateMetadata({
  params,
}: ArticlePageProps): Promise<Metadata> {
  const { id } = await params;
  const article = findArticleById(id);

  if (!article) {
    return {
      title: "Article Not Found",
      description: "The article you're looking for doesn't exist.",
    };
  }

  return generateArticleMetadata(article);
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { id } = await params;
  const article = findArticleById(id);

    if (!article) {
        return (
            <Layout>
                <div className="container">
                    <div className="row">
                        <div className="col-md-8">
                            <h1>Article not found</h1>
                            <p>The article you're looking for doesn't exist.</p>
                            <Link href="/" className="btn btn-green">
                                Back to Home
                            </Link>
                        </div>
                    </div>
                </div>
            </Layout>
        );
    }

  // Generate structured data
  const articleStructuredData = generateArticleStructuredData(article, {
    publishedTime: formatDateForSEO(article.date),
  });
  const breadcrumbData = generateBreadcrumbStructuredData(
    generateArticleBreadcrumbs(article)
  );

    return (
    <>
      <Script
        id="article-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleStructuredData),
        }}
      />
      <Script
        id="breadcrumb-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbData),
        }}
      />
        <Layout classList="single">
            <Section1 article={article} />
        </Layout>
    </>
    );
} 