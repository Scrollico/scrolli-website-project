import Layout from "@/components/layout/Layout"
import Section1 from '@/components/sections/single/Section1'
import blogData from '@/data/blog.json'

export default function Home() {
	// Using the first article from featured section as a default
	const article = blogData.featured.mainArticle

	return (
		<>
			<Layout classLisst="single">
				<Section1 article={article} />
			</Layout>
		</>
	)
}