export const runtime = "edge";

import { Metadata } from "next";
import Layout from "@/components/layout/Layout";
import { Container } from "@/components/responsive/Container";
import ArticleCard from "@/components/sections/archive/ArticleCard";
import { fetchCollabs, getNavigation } from "@/lib/payload/client";
import { mapCollabToArticle } from "@/lib/payload/types";
import { cn } from "@/lib/utils";
import { colors, gap as gapTokens } from "@/lib/design-tokens";

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
                    <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3", gapTokens["2xl"])}>
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
                    <p className={colors.foreground.secondary}>No collaborations found.</p>
                )}
            </Container>
        </Layout>
    );
}
