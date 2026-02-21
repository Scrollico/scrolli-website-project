import Layout from "@/components/layout/Layout"
import DynamicCategorySection from "@/components/sections/categories/DynamicCategorySection"
import { getArticlesByCategory, getFeaturedArticles, getCategories, getNavigation } from "@/lib/payload/client"
import { mapGundemToArticle, mapHikayelerToArticle, mapCollabToArticle, mapStoryToArticle, PayloadGundem, PayloadHikayeler, PayloadAlaraai, PayloadCollab, PayloadStory } from "@/lib/payload/types"
import { Article } from "@/types/content"
import { Metadata } from "next";
import { cookies } from "next/headers";
import { NEXT_LOCALE_COOKIE } from "@/lib/locale-config";

// export const dynamic = 'force-dynamic';

export async function generateMetadata(
	props: {
		searchParams: Promise<{ [key: string]: string | string[] | undefined }>
	}
): Promise<Metadata> {
	const params = await props.searchParams;
	let categorySlug = typeof params.cat === 'string' ? params.cat : (Array.isArray(params.cat) ? params.cat[0] : undefined);

	if (!categorySlug) {
		try {
			const cookieStore = await cookies();
			const locale = cookieStore.get(NEXT_LOCALE_COOKIE)?.value || "tr";
			const categories = await getCategories(locale);
			if (categories?.docs?.[0]?.slug) {
				categorySlug = categories?.docs?.[0]?.slug;
			}
		} catch (e) {
			console.error("Error fetching categories for metadata", e);
		}
	}

	const safeCategoryName = categorySlug || 'news';
	const capitalizedTitle = safeCategoryName.charAt(0).toUpperCase() + safeCategoryName.slice(1);

	return {
		title: `${capitalizedTitle} Categories - Scrolli`,
		description: `Browse articles in ${safeCategoryName} category`,
	};
}

// Helper to map any payload content type to Article
function mapContentToArticle(
	content: PayloadGundem | PayloadHikayeler | PayloadAlaraai | PayloadCollab | PayloadStory,
	locale: string = "tr"
): Article {
	if (content.source === "Gündem") {
		return mapGundemToArticle(content as PayloadGundem, locale);
	} else if (content.source === "Alara AI") {
		return mapGundemToArticle(content as PayloadAlaraai, locale);
	} else if (content.source === "Hikayeler") {
		return mapHikayelerToArticle(content as PayloadHikayeler, locale);
	} else if (content.source === "Collabs") {
		return mapCollabToArticle(content as PayloadCollab, locale);
	} else if (content.source === "Stories") {
		return mapStoryToArticle(content as PayloadStory, locale);
	}
	// Fallback
	return mapGundemToArticle(content as PayloadGundem, locale);
}

export default async function Categories(
	props: {
		searchParams: Promise<{ [key: string]: string | string[] | undefined }>
	}
) {
	const params = await props.searchParams;
	const cookieStore = await cookies();
	const locale = cookieStore.get(NEXT_LOCALE_COOKIE)?.value || "tr";

	let categorySlug = typeof params.cat === 'string' ? params.cat : (Array.isArray(params.cat) ? params.cat[0] : undefined);

	if (!categorySlug) {
		const categories = await getCategories(locale);
		if (categories?.docs?.length > 0) {
			categorySlug = categories?.docs?.[0]?.slug;
		}
	}

	const validCategorySlug = categorySlug || 'finans';

	const [articlesResult, featuredResult, navigationResult] = await Promise.allSettled([
		getArticlesByCategory(validCategorySlug, locale),
		getFeaturedArticles(locale),
		getNavigation(locale),
	]);

	const articlesResponse = articlesResult.status === 'fulfilled' ? articlesResult.value : { docs: [], totalDocs: 0, limit: 0, totalPages: 0 };
	const featuredArticlesResponse = featuredResult.status === 'fulfilled' ? featuredResult.value : [];
	const navigation = navigationResult.status === 'fulfilled' ? navigationResult.value : null;

	// Map the specific category articles (which are Gundem)
	const articles: Article[] = articlesResponse.docs.map((doc: PayloadGundem) => mapGundemToArticle(doc, locale));

	// Map the featured/popular articles (which can be mixed types)
	const popularArticles: Article[] = featuredArticlesResponse.map((doc: PayloadGundem | PayloadHikayeler | PayloadAlaraai | PayloadCollab | PayloadStory) => mapContentToArticle(doc, locale));

	return (
		<>
			<Layout classList="categories" navigation={navigation}>
				<DynamicCategorySection
					categoryName={validCategorySlug}
					articles={articles}
					popularArticles={popularArticles}
				/>
			</Layout>
		</>
	)
}
