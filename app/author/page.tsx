export const runtime = "edge";

import Layout from "@/components/layout/Layout";
import { getAuthors, getNavigation } from "@/lib/payload/client";
import { getMediaUrl } from "@/lib/payload/types";
import AuthorListSection from "@/components/sections/author/AuthorListSection";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Yazarlar | Scrolli",
  description: "Scrolli yazarlarını keşfedin.",
};

export default async function AuthorsPage() {
  const [authorsResponse, navigation] = await Promise.all([
    getAuthors(),
    getNavigation(),
  ]);

  const authors = authorsResponse.docs.map((author) => ({
    name: author.name,
    slug: author.slug,
    bio: author.bio,
    avatarUrl: getMediaUrl(author.avatar),
  }));

  return (
    <Layout classList="archive" navigation={navigation}>
      <AuthorListSection authors={authors} />
    </Layout>
  );
}
