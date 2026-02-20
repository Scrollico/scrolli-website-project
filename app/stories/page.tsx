export const runtime = "edge";

import { Metadata } from "next";
import Layout from "@/components/layout/Layout";
import { Container } from "@/components/responsive/Container";
import ArticleCard from "@/components/sections/archive/ArticleCard";
import { fetchStories, getNavigation } from "@/lib/payload/client";
import { mapStoryToArticle } from "@/lib/payload/types";

export const metadata: Metadata = {
    title: "Stories | Scrolli",
    description: "Interactive stories and visual narratives.",
};

export default async function StoriesPage() {
    const [stories, navigation] = await Promise.all([
        fetchStories({ limit: 20 }),
        getNavigation(),
    ]);

    const articles = stories.map(mapStoryToArticle);

    return (
        <Layout classList="archive" navigation={navigation}>
            <Container size="lg" padding="md">
                <h1 className="text-3xl font-bold mb-8 mt-4">Stories</h1>
                {articles.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {articles.map((article) => (
                            <ArticleCard
                                key={article.id}
                                id={article.id}
                                title={article.title}
                                excerpt={article.excerpt || ""}
                                image={article.image || article.thumbnail || "/assets/images/placeholder.jpg"}
                                author={article.author}
                                category={article.category}
                                date={article.date}
                                readTime={article.readTime}
                                isPremium={article.isPremium}
                            />
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500">No stories found.</p>
                )}
            </Container>
        </Layout>
    );
}
