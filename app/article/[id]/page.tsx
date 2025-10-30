"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import blogData from '@/data/blog.json';
import Layout from '@/components/layout/Layout';
import Section1 from '@/components/sections/single/Section1';
import { useParams } from 'next/navigation';

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

export default function ArticlePage() {
    const params = useParams();
    const articleId = params.id as string;
    const [article, setArticle] = useState<Article | null>(null);

    useEffect(() => {
        // Search for article in all sections of blogData
        const findArticle = () => {
            // Search in featured section
            if (blogData.featured.mainArticle.id === articleId) {
                return blogData.featured.mainArticle;
            }
            const featuredSideArticle = blogData.featured.sideArticles.find(article => article.id === articleId);
            if (featuredSideArticle) return featuredSideArticle;

            // Search in trending section
            const trendingArticle = blogData.trending.articles.find(article => article.id === articleId);
            if (trendingArticle) return trendingArticle;

            // Search in featuredSlider section
            const sliderArticle = blogData.featuredSlider.articles.find(article => article.id === articleId);
            if (sliderArticle) return sliderArticle;

            // Search in todayHighlights section
            const highlightArticle = blogData.todayHighlights.articles.find(article => article.id === articleId);
            if (highlightArticle) return highlightArticle;

            // Search in mostRecent section
            const mostRecentMainArticle = blogData.mostRecent.mainArticles.find(article => article.id === articleId);
            if (mostRecentMainArticle) return mostRecentMainArticle;
            const mostRecentSideArticle = blogData.mostRecent.sideArticles.find(article => article.id === articleId);
            if (mostRecentSideArticle) return mostRecentSideArticle;

            // Search in Culture section
            if (blogData.Culture.mainArticle.id === articleId) {
                return blogData.Culture.mainArticle;
            }
            const cultureArticle = blogData.Culture.articles.find(article => article.id === articleId);
            if (cultureArticle) return cultureArticle;
            const cultureSideArticle = blogData.Culture.sideArticles.find(article => article.id === articleId);
            if (cultureSideArticle) return cultureSideArticle;

            // Search in theStartup section
            if (blogData.theStartup.mainArticle.id === articleId) {
                return blogData.theStartup.mainArticle;
            }
            const startupArticle = blogData.theStartup.articles.find(article => article.id === articleId);
            if (startupArticle) return startupArticle;

            // Search in RyanMarkPosts section
            const ryanMarkArticle = blogData.RyanMarkPosts.articles.find(article => article.id === articleId);
            if (ryanMarkArticle) return ryanMarkArticle;

            // Search in hightlightPosts section
            const highlightPostArticle = blogData.hightlightPosts.articles.find(article => article.id === articleId);
            if (highlightPostArticle) return highlightPostArticle;

            // Search in relatedPosts section
            const relatedPost = blogData.relatedPosts.articles.find(article => article.id === articleId);
            if (relatedPost) return relatedPost;

            return null;
        };

        const foundArticle = findArticle();
        setArticle(foundArticle);
    }, [articleId]);

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

    return (
        <Layout classLisst="single">
            <Section1 article={article} />
        </Layout>
    );
} 