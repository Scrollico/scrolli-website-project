export const runtime = "edge";

import { Metadata } from "next";
import Layout from "@/components/layout/Layout";
import { Container } from "@/components/responsive/Container";
import ArticleCard from "@/components/sections/archive/ArticleCard";
import { fetchCollabs, getNavigation } from "@/lib/payload/client";
import { mapCollabToArticle } from "@/lib/payload/types";

export const metadata: Metadata = {
    title: "Collaborations | Scrolli",
    description: "Sponsored content and collaborations.",
};

export default async function CollabsPage() {
    const [collabs, navigation] = await Promise.all([
        fetchCollabs({ limit: 20 }),
        getNavigation(),
    ]);

    const articles = collabs.map(mapCollabToArticle);

    return (
        <Layout classList="archive" navigation={navigation}>
            <Container size="lg" padding="md">
                <h1 className="text-3xl font-bold mb-8 mt-4">Collaborations</h1>
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
                    <p className="text-gray-500">No collaborations found.</p>
                )}
            </Container>
        </Layout>
    );
}
