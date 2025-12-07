"use client"

import { useMemo } from "react"
import { ImageCarouselHero } from "./ai-image-generator-hero"
import { getAllArticles } from "@/lib/content"
import { useRouter } from "next/navigation"

export default function ContentShowcaseHero() {
  const router = useRouter()

  // Get articles and extract images for the carousel
  const carouselImages = useMemo(() => {
    const articles = getAllArticles()
    
    // Filter articles that have images and get diverse content
    const articlesWithImages = articles
      .filter((article) => article.image && article.image.trim() !== "")
      .slice(0, 8) // Get first 8 articles with images

    return articlesWithImages.map((article, index) => ({
      id: article.id,
      src: article.image,
      alt: article.title || "Scrolli article",
      rotation: [-15, -8, 5, 12, -12, 8, -10, 10][index] || 0,
    }))
  }, [])

  const features = [
    {
      title: "Deep Analysis",
      description: "In-depth articles that explore complex topics with expert insights",
    },
    {
      title: "Diverse Perspectives",
      description: "Content covering politics, culture, technology, and more",
    },
    {
      title: "Quality Journalism",
      description: "Thoughtful reporting and analysis you can trust",
    },
  ]

  const handleCtaClick = () => {
    router.push("/")
  }

  return (
    <div data-section="content-showcase">
      <ImageCarouselHero
        title="Discover What We Do"
        subtitle="Scrolli Content"
        description="Explore our diverse range of content covering politics, culture, technology, and beyond. Quality journalism that matters."
        ctaText="Explore Articles"
        onCtaClick={handleCtaClick}
        images={carouselImages}
        features={features}
      />
    </div>
  )
}

