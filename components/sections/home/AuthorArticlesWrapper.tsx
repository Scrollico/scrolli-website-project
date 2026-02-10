import { getAuthorsWithLatestArticles } from "@/lib/payload/authors";
import AuthorArticles from "./AuthorArticles";

/**
 * Server component wrapper for AuthorArticles
 * Fetches authors with their latest articles from Payload CMS
 */
export default async function AuthorArticlesWrapper() {
  const authors = await getAuthorsWithLatestArticles(5);

  return <AuthorArticles authors={authors} />;
}
