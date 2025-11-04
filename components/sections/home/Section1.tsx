"use client";
import Link from "next/link";
import Image from 'next/image';
import blogData from "@/data/blog.json";
import { Container, ResponsiveGrid } from "@/components/responsive";
import { News, type NewsArticle } from "@/components/ui/sidebar-news";
import { gradientVariants } from "@/lib/utils";

export default function Section1() {
  const { featured } = blogData;

  const newsArticles: NewsArticle[] = [
    {
      href: "https://scrolli.co",
      title: "EU Announces Sweeping Climate Policy Reforms",
      summary: "European leaders agree on ambitious carbon neutrality targets by 2035, reshaping energy policies across member states.",
      image: "https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=400&h=300&fit=crop",
    },
    {
      href: "https://scrolli.co",
      title: "Global Summit Addresses Rising Sea Levels",
      summary: "Climate scientists warn of accelerated ice sheet melting as world leaders convene for emergency environmental talks.",
      image: "https://images.unsplash.com/photo-1681354416283-4acdad4f3014?w=400&h=300&fit=crop",
    },
    {
      href: "https://scrolli.co",
      title: "Political Upheaval in Climate Legislation",
      summary: "Partisan divisions deepen as lawmakers debate historic environmental protection bills amid growing public pressure.",
      image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=300&fit=crop",
    },
    {
      href: "https://scrolli.co",
      title: "Renewable Energy Investments Reach Record High",
      summary: "Solar and wind power sectors see unprecedented funding as governments worldwide accelerate green energy transitions.",
      image: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=400&h=300&fit=crop",
    },
    {
      href: "https://scrolli.co",
      title: "Climate Refugees: The Growing Crisis",
      summary: "Displacement caused by extreme weather events reaches critical levels, prompting urgent international response discussions.",
      image: "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?w=400&h=300&fit=crop",
    },
  ];

  return (
    <section className="py-12 md:py-16 lg:py-20">
      <Container>
        {/* Section Title */}
        <div className="mb-8 md:mb-12">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold border-b-2 border-primary pb-2 inline-block">
            {featured.title}
          </h2>
        </div>

        {/* Featured Articles Grid */}
        <ResponsiveGrid columns={{ default: 1, md: 3 }} gap="lg" className="mb-8 md:mb-12">
          {[featured.mainArticle, ...featured.sideArticles.slice(0, 2)].map((article) => (
            <article key={article.id} className="group bg-card rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
              {/* Article Image */}
              <figure className="relative overflow-hidden w-full aspect-[16/9]">
                <Link href={`/article/${article.id}`} className="block w-full h-full">
                  <Image
                    src={article.image}
                    alt={article.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
                  />
                  {/* Responsive gradient overlay for better text contrast */}
                  <div className={`absolute inset-0 ${gradientVariants.contentOverlay}`} />
                </Link>
              </figure>

              {/* Article Content */}
              <div className="p-4 md:p-6">
                <h3 className="text-lg md:text-xl font-bold leading-tight">
                  <Link
                    href={`/article/${article.id}`}
                    className="text-foreground hover:text-primary transition-colors"
                  >
                    {article.title}
                  </Link>
                </h3>
              </div>

            </article>
          ))}
        </ResponsiveGrid>

        {/* Divider */}
        <hr className="border-t border-border mt-12 md:mt-16" />
      </Container>

      {/* Alara AI CTA Banner */}
      <div className="mt-12 md:mt-16">
        <Container>
          <div
            className="relative overflow-hidden rounded-2xl p-8 md:p-12 border border-border bg-card"
          >
            {/* Subtle gradient overlay for visual depth */}
            <div className={`absolute inset-0 ${gradientVariants.textOverlay} opacity-30`} />
            {/* Slight radial silver gradient from bottom to top */}
            <div 
              className="absolute inset-0 opacity-90" 
              style={{ 
                background: 'radial-gradient(ellipse 150% 110% at center bottom, rgba(192, 192, 192, 0.3) 0%, rgba(192, 192, 192, 0.18) 20%, rgba(192, 192, 192, 0.1) 40%, rgba(192, 192, 192, 0.04) 60%, transparent 95%)' 
              }} 
            />
            <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
              {/* Animation section - 30% */}
              <div className="w-full md:w-[30%]">
                <div className="relative h-[300px]">
                  <News articles={newsArticles} />
                </div>
              </div>

              {/* Text section - 70% */}
              <div className="w-full md:w-[70%] text-left">
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                  Discover Alara AI
                </h2>
                <p className="text-lg md:text-xl text-muted-foreground">
                  Experience the future of artificial intelligence. Transform your workflow with our cutting-edge AI platform.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </div>
    </section>
  );
}
