export const runtime = "edge";

import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Layout from "@/components/layout/Layout";
import { getAuthorBySlug, getArticlesByAuthorId } from "@/lib/payload/client";
import { getNavigation } from "@/lib/payload/client";
import { mapGundemToArticle, mapHikayelerToArticle, getMediaUrl } from "@/lib/payload/types";
import { getLocale } from "@/lib/dictionaries";
import { Article } from "@/types/content";
import AuthorBySlugSection from "@/components/sections/author/AuthorBySlugSection";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const author = await getAuthorBySlug(decodeURIComponent(slug));
  if (!author) return { title: "Yazar bulunamadı" };
  return {
    title: `${author.name} | Scrolli`,
    description: author.bio ?? `${author.name} yazarının Scrolli'deki yazıları.`,
  };
}

export default async function AuthorSlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);
  const locale = await getLocale();

  const author = await getAuthorBySlug(decodedSlug);
  if (!author) {
    notFound();
  }

  const [payloadArticles, navigation] = await Promise.all([
    getArticlesByAuthorId(author.id, 50),
    getNavigation(),
  ]);
  const articles: Article[] = payloadArticles.map((post) =>
    post.source === "Gündem"
      ? mapGundemToArticle(post, locale)
      : mapHikayelerToArticle(post, locale)
  );

  const avatarUrl = author.avatar ? getMediaUrl(author.avatar) : undefined;

  return (
    <Layout classList="archive" navigation={navigation}>
      <AuthorBySlugSection
        name={author.name}
        slug={author.slug}
        avatarUrl={avatarUrl}
        bio={author.bio}
        articles={articles}
      />
    </Layout>
  );
}
