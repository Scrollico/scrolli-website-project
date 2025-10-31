'use client';
import Link from 'next/link';
import Image from 'next/image';
import { Container, ResponsiveGrid } from '@/components/responsive';

interface ArticleCard {
  id: string;
  title: string;
  caption: string;
  thumbnail: string;
}

const articleData: ArticleCard[] = [
  {
    id: 'home-internet-luxury',
    title: 'Home Internet Is Becoming a Luxury for the Wealthy',
    caption: 'Dave Gershgorn in OneZero • Jun 14 • 3 min read',
    thumbnail: '/assets/images/thumb/thumb-1240x700.jpg'
  },
  {
    id: 'doorbell-camera-shooting',
    title: 'The Night My Doorbell Camera Captured a Shooting',
    caption: 'Alentica in Police • Jun 16 • 7 min read',
    thumbnail: '/assets/images/thumb/thumb-700x512.jpg'
  },
  {
    id: 'privacy-tech-debate',
    title: 'Privacy Is Just the Beginning of the Debate Over Tech',
    caption: 'Otimus in Startup • May 15 • 6 min read',
    thumbnail: '/assets/images/thumb/thumb-700x512-2.jpg'
  },
  {
    id: 'millionaire-mindset',
    title: 'Want To Make Millions? Then Act Like a Millionaire',
    caption: 'Mark Harris in Heated • May 13 • 12 min read',
    thumbnail: '/assets/images/thumb/thumb-700x512-3.jpg'
  },
  {
    id: 'career-change-advice',
    title: 'What I Wish I\'d Known When I Made a Drastic Career Change',
    caption: 'Steven Job in The Startup • 2 days ago • 8 min read',
    thumbnail: '/assets/images/thumb/thumb-1400x778.jpg'
  }
];

export default function ArticlesSection() {
  return (
    <section className="py-12 md:py-16 lg:py-20">
      <Container>
        {/* Section Header */}
        <div className="mb-8 md:mb-12">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">Latest Articles</h2>
          <hr className="border-t border-border" />
        </div>

        {/* Articles Grid */}
        <ResponsiveGrid columns={{ default: 1, sm: 2, lg: 3, xl: 4 }} gap="md" className="mb-8 md:mb-12">
          {articleData.map((article) => (
            <article key={article.id} className="group bg-card rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
              {/* Article Image */}
              <figure className="relative overflow-hidden">
                <Link href={`/article/${article.id}`}>
                  <Image
                    src={article.thumbnail}
                    alt={article.title}
                    width={400}
                    height={225}
                    className="w-full h-48 md:h-52 object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                    quality={95}
                  />
                </Link>
              </figure>

              {/* Article Content */}
              <div className="p-4">
                <h3 className="text-base md:text-lg font-semibold mb-2 leading-tight line-clamp-2">
                  <Link
                    href={`/article/${article.id}`}
                    className="text-foreground hover:text-primary transition-colors"
                  >
                    {article.title}
                  </Link>
                </h3>

                <div className="text-sm text-muted-foreground">
                  <span>{article.caption}</span>
                </div>
              </div>
            </article>
          ))}
        </ResponsiveGrid>
      </Container>
    </section>
  );
}