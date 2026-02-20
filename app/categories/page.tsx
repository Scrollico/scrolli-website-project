
import Layout from "@/components/layout/Layout"
import DynamicCategorySection from "@/components/sections/categories/DynamicCategorySection"
import { getArticlesByCategory, getFeaturedArticles, getCategories } from "@/lib/payload/client"
import { mapGundemToArticle, mapHikayelerToArticle, mapCollabToArticle, mapStoryToArticle, PayloadGundem, PayloadHikayeler, PayloadAlaraai, PayloadCollab, PayloadStory } from "@/lib/payload/types"
import { Article } from "@/types/content"
import { Metadata } from "next";

export const dynamic = 'force-dynamic';

export async function generateMetadata(
	props: {
		searchParams: Promise<{ [key: string]: string | string[] | undefined }>
	}
): Promise<Metadata> {
	const params = await props.searchParams;
	let categorySlug = typeof params.cat === 'string' ? params.cat : (Array.isArray(params.cat) ? params.cat[0] : undefined);

	if (!categorySlug) {
		const categories = await getCategories();
		if (categories.docs.length > 0) {
			categorySlug = categories.docs[0].slug;
		} else {
			categorySlug = 'finans'; // Fallback if no categories found
		}
	}

	return {
		title: `${categorySlug.charAt(0).toUpperCase() + categorySlug.slice(1)} Categories - Scrolli`,
		description: `Browse articles in ${categorySlug} category`,
	};
}

// Helper to map any payload content type to Article
function mapContentToArticle(content: PayloadGundem | PayloadHikayeler | PayloadAlaraai | PayloadCollab | PayloadStory): Article {
	if (content.source === "Gündem") {
		return mapGundemToArticle(content as PayloadGundem);
	} else if (content.source === "Alara AI") {
		return mapGundemToArticle(content as PayloadAlaraai);
	} else if (content.source === "Hikayeler") {
		return mapHikayelerToArticle(content as PayloadHikayeler);
	} else if (content.source === "Collabs") {
		return mapCollabToArticle(content as PayloadCollab);
	} else if (content.source === "Stories") {
		return mapStoryToArticle(content as PayloadStory);
	}
	// Fallback
	return mapGundemToArticle(content as PayloadGundem);
}

export default async function Categories(
	props: {
		searchParams: Promise<{ [key: string]: string | string[] | undefined }>
	}
) {
	const params = await props.searchParams;
	let categorySlug = typeof params.cat === 'string' ? params.cat : (Array.isArray(params.cat) ? params.cat[0] : undefined);

	if (!categorySlug) {
		const categories = await getCategories();
		if (categories.docs.length > 0) {
			categorySlug = categories.docs[0].slug;
		}
	}

	const validCategorySlug = categorySlug || 'finans';

	const [articlesResponse, featuredArticlesResponse] = await Promise.all([
		getArticlesByCategory(validCategorySlug),
		getFeaturedArticles()
	]);

	// Map the specific category articles (which are Gundem)
	const articles: Article[] = articlesResponse.docs.map(doc => mapGundemToArticle(doc));

	// Map the featured/popular articles (which can be mixed types)
	const popularArticles: Article[] = featuredArticlesResponse.map(mapContentToArticle);

	return (
		<>
			<Layout classList="categories">
				<DynamicCategorySection
					categoryName={validCategorySlug}
					articles={articles}
					popularArticles={popularArticles}
				/>
			</Layout>
		</>
	)
}
