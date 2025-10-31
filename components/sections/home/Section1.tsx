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

                <div className="flex flex-wrap items-center gap-2 text-xs md:text-sm text-muted-foreground">
                  <Link href="/author" className="hover:text-primary transition-colors">
                    {article.author}
                  </Link>
                  <span>in</span>
                  <Link href="/archive" className="hover:text-primary transition-colors">
                    {article.category}
                  </Link>
                  <span>•</span>
                  <span>{article.date}</span>
                  <span>•</span>
                  <span title={article.readTime}>{article.readTime}</span>
                  <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
              </div>

              {/* CTA Button for first article */}
              {index === 0 && (
                <div className="px-4 md:px-6 pb-4 md:pb-6">
                  <Link
                    href="/archive"
                    className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors text-sm font-medium"
                  >
                    All Featured
                  </Link>
                </div>
              )}
            </article>
          ))}
        </ResponsiveGrid>

        {/* Divider */}
        <hr className="border-t border-border mt-12 md:mt-16" />
      </Container>
    </section>
  );
}
