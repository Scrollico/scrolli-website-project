import Layout from "@/components/layout/Layout"
import Section1 from '@/components/sections/search/Section1'
import { Metadata } from "next"

export const metadata: Metadata = {
	title: 'Search',
}

export default async function Search({
	searchParams,
}: {
	searchParams: any
}) {
	const params = await searchParams;
	const query = params?.q || '';

	return (
		<>
			<Layout classLisst="search">
				<Section1 searchQuery={query} />
			</Layout>
		</>
	)
}