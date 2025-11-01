"use client";
import Link from "next/link";
import Image from 'next/image';
import blogData from "@/data/blog.json";
import { Container, ResponsiveGrid } from "@/components/responsive";

export default function Section1() {
  const { featured } = blogData;

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
          {[featured.mainArticle, ...featured.sideArticles.slice(0, 2)].map((article, index) => (
            <article key={article.id} className="group bg-card rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
              {/* Article Image */}
              <figure className="relative overflow-hidden">
                <Link href={`/article/${article.id}`}>
                  <Image
                    src={article.image}
                    alt={article.title}
                    width={404}
                    height={227}
                    className="w-full h-48 md:h-56 object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
                  />
                </Link>
              </figure>

              {/* Article Content */}
              <div className="p-4 md:p-6">
                <h3 className="text-lg md:text-xl font-bold mb-3 leading-tight">
                  <Link
                    href={`/article/${article.id}`}
                    className="text-foreground hover:text-primary transition-colors"
                  >
                    {article.title}
                  </Link>
                </h3>

                <div className="text-sm md:text-base text-muted-foreground mb-4 line-clamp-3">
                  <p>{article.excerpt || "And black on meretriciously regardless well fearless irksomely as about hideous wistful bat less oh much and occasional useful rat darn jeepers far."}</p>
                </div>
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
          <div className="relative overflow-hidden rounded-2xl p-8 md:p-12">
            <div className="flex flex-col md:flex-row items-center gap-8">
              {/* Animation section - 30% */}
              <div className="w-full md:w-[30%]">
                {/* Animation placeholder - user will provide code */}
                <div className="w-full aspect-square bg-gray-100 rounded-xl flex items-center justify-center">
                  <span className="text-gray-400 text-sm">Animation</span>
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
