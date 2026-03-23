"use client"

import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { colors, sectionPadding } from "@/lib/design-tokens"
import { Article } from "@/types/content"

interface PortfolioGalleryProps {
  title?: string;
  subtitle?: string;
  archiveButton?: {
    text: string;
    href: string;
  };
  images?: Array<{
    src: string;
    alt: string;
    title?: string;
  }>;
  articles?: Article[];
  className?: string;
  maxHeight?: number;
  spacing?: string;
  onImageClick?: (index: number) => void;
  pauseOnHover?: boolean;
  marqueeRepeat?: number;
}

const FALLBACK_IMAGES = [
  { src: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop&q=80", alt: "SaaS Dashboard" },
  { src: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop&q=80", alt: "Analytics" },
  { src: "https://images.unsplash.com/photo-1553028826-f4804a6dba3b?w=800&h=600&fit=crop&q=80", alt: "E-Commerce" },
  { src: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&h=600&fit=crop&q=80", alt: "Mobile App" },
  { src: "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800&h=600&fit=crop&q=80", alt: "Brand Identity" },
  { src: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&h=600&fit=crop&q=80", alt: "Marketing" },
  { src: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&h=600&fit=crop&q=80", alt: "Photography" },
  { src: "https://images.unsplash.com/photo-1542744094-3a31f272c490?w=800&h=600&fit=crop&q=80", alt: "Design" },
  { src: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=600&fit=crop&q=80", alt: "Development" },
  { src: "https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=800&h=600&fit=crop&q=80", alt: "Code" },
]

export function PortfolioGallery({
  title = "Hikayelerimizi keşfedin",
  subtitle = "Derinlemesine analizler ve özel hikayeler. En güncel haberlerimizi ve özel içeriklerimizi keşfedin.",
  archiveButton = {
    text: "Tüm hikayeleri gör",
    href: "/",
  },
  images: customImages,
  articles,
  className = "",
  maxHeight = 120,
  spacing = "-space-x-72 md:-space-x-80",
  onImageClick,
  pauseOnHover = true,
  marqueeRepeat = 4,
}: PortfolioGalleryProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  const images = customImages || (articles && articles.length > 0
    ? articles
        .filter((a) => a.thumbnail || a.image) // skip articles without images
        .map((article) => ({
          src: article.thumbnail || article.image || "",
          alt: article.title || "Article",
        }))
        .filter((img) => img.src.startsWith("http")) // only valid URLs
    : FALLBACK_IMAGES)

  // If no valid article images, fall back to defaults
  const displayImages = images.length > 0 ? images : FALLBACK_IMAGES

  return (
    <section
      aria-label={title}
      className={cn(
        "relative py-20 px-4",
        colors.background.base,
        sectionPadding.lg,
        className
      )}
    >
      <div className={cn(
        "max-w-7xl mx-auto backdrop-blur-sm rounded-2xl border overflow-hidden",
        colors.background.elevated,
        colors.border.light
      )}>
        {/* Header Section */}
        <div className="relative z-10 text-center pt-16 pb-8 px-8">
          <h2 className={cn(
            "text-4xl md:text-6xl font-bold mb-4 text-balance",
            colors.foreground.primary
          )}>
            {title}
          </h2>

          {subtitle && (
            <p className={cn(
              "text-sm md:text-base max-w-lg mx-auto leading-relaxed mb-8",
              colors.foreground.muted
            )}>
              {subtitle}
            </p>
          )}

          <Link
            href={archiveButton.href}
            className={cn(
              "inline-flex items-center gap-3 px-6 py-3 rounded-full font-medium transition-colors group mb-20",
              "bg-foreground text-background hover:bg-foreground/90"
            )}
          >
            <span>{archiveButton.text}</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Desktop 3D overlapping layout - hidden on mobile */}
        <div className="hidden md:block relative overflow-hidden h-[400px] -mb-[200px]">
          <div className={cn("flex pb-8 pt-40 items-end justify-center", spacing)}>
            {displayImages.map((image, index) => {
              const totalImages = images.length
              const middle = Math.floor(totalImages / 2)
              const distanceFromMiddle = Math.abs(index - middle)
              const staggerOffset = maxHeight - distanceFromMiddle * 20
              const zIndex = totalImages - index

              const isHovered = hoveredIndex === index
              const isOtherHovered = hoveredIndex !== null && hoveredIndex !== index
              const yOffset = isHovered ? -120 : isOtherHovered ? 0 : -staggerOffset

              return (
                <motion.div
                  key={index}
                  className="flex-shrink-0"
                  style={{
                    zIndex: isHovered ? 100 : zIndex,
                    transform: "perspective(5000px) rotateY(-45deg)",
                  }}
                  initial={{ y: 200, opacity: 0 }}
                  animate={{ y: yOffset, opacity: 1 }}
                  transition={{
                    duration: 0.3,
                    delay: index * 0.05,
                    ease: [0.25, 0.1, 0.25, 1],
                  }}
                >
                  {/* Hover is detected on this inner div — no 3D transform skew on hit area */}
                  <div
                    className={cn(
                      "relative aspect-video w-64 md:w-80 lg:w-96 rounded-lg overflow-hidden cursor-pointer transition-transform duration-200",
                      isHovered && "scale-105"
                    )}
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                    onClick={() => onImageClick?.(index)}
                    style={{
                      boxShadow: `
                        rgba(0, 0, 0, 0.01) 0.796px 0px 0.796px 0px,
                        rgba(0, 0, 0, 0.03) 2.41px 0px 2.41px 0px,
                        rgba(0, 0, 0, 0.08) 6.38px 0px 6.38px 0px,
                        rgba(0, 0, 0, 0.25) 20px 0px 20px 0px
                      `,
                    }}
                  >
                    <img
                      src={image.src || FALLBACK_IMAGES[0].src}
                      alt={image.alt}
                      className="w-full h-full object-cover object-left-top"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* Mobile marquee layout */}
        <div className="block md:hidden relative pb-8">
          <div
            className={cn(
              "group flex overflow-hidden p-2 [--duration:40s] [--gap:1rem] [gap:var(--gap)]",
              "flex-row"
            )}
          >
            {Array(marqueeRepeat)
              .fill(0)
              .map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    "flex shrink-0 justify-around [gap:var(--gap)]",
                    "animate-marquee flex-row",
                    { "group-hover:[animation-play-state:paused]": pauseOnHover }
                  )}
                >
                  {displayImages.map((image, index) => (
                    <div
                      key={`${i}-${index}`}
                      className="cursor-pointer flex-shrink-0"
                      onClick={() => onImageClick?.(index)}
                    >
                      <div
                        className="relative aspect-video w-64 rounded-lg overflow-hidden"
                        style={{
                          boxShadow: `
                            rgba(0, 0, 0, 0.01) 0.796px 0px 0.796px 0px,
                            rgba(0, 0, 0, 0.03) 2.41px 0px 2.41px 0px,
                            rgba(0, 0, 0, 0.08) 6.38px 0px 6.38px 0px,
                            rgba(0, 0, 0, 0.25) 20px 0px 20px 0px
                          `,
                        }}
                      >
                        <img
                          src={image.src || FALLBACK_IMAGES[0].src}
                          alt={image.alt}
                          className="w-full h-full object-cover object-left-top"
                          loading="lazy"
                          decoding="async"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ))}
          </div>
        </div>
      </div>
    </section>
  )
}
