"use client";
import Link from "next/link";
import Image from "next/image";
import blogData from "@/data/blog.json";
import {
  sectionPadding,
  componentPadding,
  gap,
  typography,
  colors,
  borderRadius,
  border,
  elevation,
  margin,
  transition
} from "@/lib/design-tokens";
import { cn } from "@/lib/utils";
import { Heading, Text } from "@/components/ui/typography";
import { Container } from "@/components/responsive";
import { getAuthorName } from '@/lib/author-loader';

import { FreeContentBadgeIcon, PremiumContentBadgeIcon } from "@/components/icons/ScrolliIcons";

export default function Section1() {
  const { Culture } = blogData;
  return (
    <>
      <section className={cn(sectionPadding.md, colors.background.base)}>
        <Container>
          <div className={cn("grid grid-cols-1 lg:grid-cols-12", gap.lg)}>
            {/* Main Content - 8 columns */}
            <div className="lg:col-span-8">
              <Heading level={4} variant="h4" className={cn("spanborder border-b-2 border-primary pb-2 mb-6")}>
                {Culture.title}
              </Heading>

              {/* Featured Article */}
              <article className={cn("mb-8 md:mb-12")}>
                <figure className="mb-6 relative">
                  <Link href={`/article/${Culture.mainArticle.id}`} prefetch={true}>
                    <Image
                      src={Culture.mainArticle.image}
                      alt={Culture.mainArticle.title}
                      width={736}
                      height={520}
                      className="w-full h-auto object-cover rounded-lg"
                    />
                  </Link>
                  <div className="absolute top-2 right-2 z-10 pointer-events-none">
                    {(Culture.mainArticle as any).isPremium ? (
                      <PremiumContentBadgeIcon size={24} className="drop-shadow-md" />
                    ) : (
                      <FreeContentBadgeIcon size={24} className="drop-shadow-md" />
                    )}
                  </div>
                </figure>
                <Heading level={1} variant="h1" className="mb-4">
                  <Link href={`/article/${Culture.mainArticle.id}`} className={cn(colors.foreground.interactive, "hover:underline", transition.normal)}>
                    {Culture.mainArticle.title}
                  </Link>
                </Heading>
                <div className={cn("entry-excerpt overflow-hidden mb-6")}>
                  <Text variant="body" color="secondary" className="line-clamp-3">
                    {Culture.mainArticle.excerpt}
                  </Text>
                </div>
                <div className={cn("entry-meta flex flex-wrap items-center", gap.sm, typography.caption, colors.foreground.muted)}>
                  <Link className="author-avatar flex-shrink-0" href="#">
                    <Image
                      src="/assets/images/author-avata-1.jpg"
                      alt="author avatar"
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                  </Link>
                  <div className={cn("flex flex-wrap items-center", gap.xs)}>
                    <Link href="/author" className={colors.foreground.interactive}>{Culture.mainArticle.author}</Link>
                    <span>in</span>
                    <Link href="/archive" className={colors.foreground.interactive}>{Culture.mainArticle.category}</Link>
                  </div>
                  <div className={cn("flex items-center", gap.xs)}>
                    <span>{Culture.mainArticle.date}</span>
                    <span className="middotDivider" />
                    <span className="readingTime" title={Culture.mainArticle.readTime}>
                      {Culture.mainArticle.readTime}
                    </span>
                  </div>
                </div>
              </article>

              {/* Spacing */}
              <div className={cn(margin.xl)} />

              {/* Articles List */}
              <div className={cn("flex flex-col", gap.lg)}>
                {Culture.articles.map((article, idx) => (
                  <article key={idx} className={cn("flex flex-col md:flex-row", gap.md, "pb-6 md:pb-8", idx < Culture.articles.length - 1 && "border-b", colors.border.DEFAULT)}>
                    <div className="flex-1 min-w-0">
                      <div className={cn("flex flex-col", gap.sm)}>
                        {article.tag && (
                          <Text variant="caption" color="muted" className="mb-0">
                            {article.tag}
                          </Text>
                        )}
                        <Heading level={3} variant="h5" className="mb-2">
                          <Link href={`/article/${article.id}`} className={cn(colors.foreground.interactive, "hover:underline", transition.normal, "block overflow-hidden")}>
                            <span className="line-clamp-2 block">{article.title}</span>
                          </Link>
                        </Heading>
                        <div className={cn("entry-excerpt overflow-hidden mb-4")}>
                          <Text variant="body" color="secondary" className="line-clamp-2">
                            {article.excerpt}
                          </Text>
                        </div>
                        <div className={cn("entry-meta flex flex-wrap items-center", gap.sm, typography.caption, colors.foreground.muted)}>
                          <div className={cn("flex flex-wrap items-center", gap.xs)}>
                            <Link href={`/author/${article.author.toLowerCase().replace(/\s+/g, "-")}`} className={colors.foreground.interactive}>{getAuthorName(article.author)}</Link>
                            <span>in</span>
                            <Link href="/archive" className={colors.foreground.interactive}>{article.category}</Link>
                          </div>
                          <div className={cn("flex items-center", gap.xs)}>
                            <span>{article.date}</span>
                            <span className="middotDivider" />
                            <span className="readingTime" title={article.readTime}>
                              {article.readTime}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="relative">
                      <div
                        className={cn(
                          "w-full md:w-32 lg:w-40 flex-shrink-0",
                          "aspect-[4/3] md:aspect-square",
                          borderRadius.md,
                          "overflow-hidden",
                          "bg-cover bg-center"
                        )}
                        style={{
                          backgroundImage: `url(${article.image})`,
                        }}
                      />
                      <div className="absolute top-2 right-2 z-10 pointer-events-none">
                        {(article as any).isPremium ? (
                          <PremiumContentBadgeIcon size={20} className="drop-shadow-md" />
                        ) : (
                          <FreeContentBadgeIcon size={20} className="drop-shadow-md" />
                        )}
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              {/* Side Articles Grid */}
              <div className="mt-12 md:mt-16">
                <div className={cn("grid grid-cols-1 md:grid-cols-2", gap.lg)}>
                  {Culture.sideArticles.map((article, idx) => (
                    <article key={idx} className={cn("flex flex-col md:flex-row", gap.md)}>
                      <figure className="w-full md:w-32 lg:w-40 flex-shrink-0 relative">
                        <Link href={`/article/${article.id}`} className={cn("block", transition.normal, "hover:opacity-90")}>
                          <Image
                            src={article.image}
                            alt={article.title}
                            width={190}
                            height={165}
                            className="w-full h-auto object-cover rounded-md"
                            sizes="(max-width: 768px) 100vw, 190px"
                          />
                        </Link>
                        <div className="absolute top-2 right-2 z-10 pointer-events-none">
                          {(article as any).isPremium ? (
                            <PremiumContentBadgeIcon size={20} className="drop-shadow-md" />
                          ) : (
                            <FreeContentBadgeIcon size={20} className="drop-shadow-md" />
                          )}
                        </div>
                      </figure>
                      <div className={cn("flex-1 min-w-0 flex flex-col justify-center")}>
                        <Heading level={5} variant="h6" className="mb-2">
                          <Link href={`/article/${article.id}`} className={cn(colors.foreground.interactive, "hover:underline", transition.normal, "block overflow-hidden")}>
                            <span className="line-clamp-2 block">{article.title}</span>
                          </Link>
                        </Heading>
                        <div className={cn("flex flex-wrap items-center", gap.sm, typography.caption, colors.foreground.muted)}>
                          <div className={cn("flex flex-wrap items-center", gap.xs)}>
                            <Link href={`/author/${article.author.toLowerCase().replace(/\s+/g, "-")}`} className={colors.foreground.interactive}>{getAuthorName(article.author)}</Link>
                            <span>in</span>
                            <Link href="/archive" className={colors.foreground.interactive}>{article.category}</Link>
                          </div>
                          <div className={cn("flex items-center", gap.xs)}>
                            <span>{article.date}</span>
                            <span className="middotDivider" />
                            <span className="readingTime" title={article.readTime}>
                              {article.readTime}
                            </span>
                          </div>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar - 4 columns */}
            <aside className={cn("lg:col-span-4 lg:pl-8")}>
              <div className={cn(
                "sticky top-4",
                borderRadius.lg,
                border.thin,
                colors.background.elevated,
                elevation[1],
                componentPadding.md
              )}>
                <Heading level={5} variant="h6" className={cn("spanborder widget-title border-b-2 border-primary pb-2", margin.sm)}>
                  Popular in Culture
                </Heading>
                <ol className={cn("flex flex-col", gap.md)}>
                  <li className={cn("flex items-start", gap.md)}>
                    <div className={cn(
                      "flex-shrink-0",
                      "w-8 h-8",
                      "flex items-center justify-center",
                      borderRadius.md,
                      colors.background.base,
                      colors.foreground.primary,
                      typography.bodySmall,
                      "font-semibold"
                    )}>
                      01
                    </div>
                    <div className="flex-1 min-w-0">
                      <Heading level={5} variant="h6" className="mb-2">
                        <Link href="/article/president-and-the-emails-who-will-guard-the-guards" className={cn(colors.foreground.interactive, "hover:underline", transition.normal, "block overflow-hidden")}>
                          <span className="line-clamp-2 block">President and the emails. Who will guard the guards?</span>
                        </Link>
                      </Heading>
                      <div className={cn("flex flex-wrap items-center", gap.sm, typography.caption, colors.foreground.muted)}>
                        <div className={cn("flex flex-wrap items-center", gap.xs)}>
                          <Link href="/author" className={colors.foreground.interactive}>Alentica</Link>
                          <span>in</span>
                          <Link href="/archive" className={colors.foreground.interactive}>Police</Link>
                        </div>
                        <div className={cn("flex items-center", gap.xs)}>
                          <span>May 14</span>
                          <span className="middotDivider" />
                          <span className="readingTime" title="3 min read">3 min read</span>
                        </div>
                      </div>
                    </div>
                  </li>
                  <li className={cn("flex items-start", gap.md)}>
                    <div className={cn(
                      "flex-shrink-0",
                      "w-8 h-8",
                      "flex items-center justify-center",
                      borderRadius.md,
                      colors.background.base,
                      colors.foreground.primary,
                      typography.bodySmall,
                      "font-semibold"
                    )}>
                      02
                    </div>
                    <div className="flex-1 min-w-0">
                      <Heading level={5} variant="h6" className="mb-2">
                        <Link href="/article/how-to-silence-the-persistent-ding-of-modern-life" className={cn(colors.foreground.interactive, "hover:underline", transition.normal, "block overflow-hidden")}>
                          <span className="line-clamp-2 block">How to Silence the Persistent Ding of Modern Life</span>
                        </Link>
                      </Heading>
                      <div className={cn("flex flex-wrap items-center", gap.sm, typography.caption, colors.foreground.muted)}>
                        <div className={cn("flex flex-wrap items-center", gap.xs)}>
                          <Link href="/author" className={colors.foreground.interactive}>Alentica</Link>
                          <span>in</span>
                          <Link href="/archive" className={colors.foreground.interactive}>Police</Link>
                        </div>
                        <div className={cn("flex items-center", gap.xs)}>
                          <span>Jun 12</span>
                          <span className="middotDivider" />
                          <span className="readingTime" title="3 min read">4 min read</span>
                        </div>
                      </div>
                    </div>
                  </li>
                  <li className={cn("flex items-start", gap.md)}>
                    <div className={cn(
                      "flex-shrink-0",
                      "w-8 h-8",
                      "flex items-center justify-center",
                      borderRadius.md,
                      colors.background.base,
                      colors.foreground.primary,
                      typography.bodySmall,
                      "font-semibold"
                    )}>
                      03
                    </div>
                    <div className="flex-1 min-w-0">
                      <Heading level={5} variant="h6" className="mb-2">
                        <Link href="/article/why-we-love-to-watch" className={cn(colors.foreground.interactive, "hover:underline", transition.normal, "block overflow-hidden")}>
                          <span className="line-clamp-2 block">Why We Love to Watch</span>
                        </Link>
                      </Heading>
                      <div className={cn("flex flex-wrap items-center", gap.sm, typography.caption, colors.foreground.muted)}>
                        <div className={cn("flex flex-wrap items-center", gap.xs)}>
                          <Link href="/author" className={colors.foreground.interactive}>Alentica</Link>
                          <span>in</span>
                          <Link href="/archive" className={colors.foreground.interactive}>Police</Link>
                        </div>
                        <div className={cn("flex items-center", gap.xs)}>
                          <span>May 15</span>
                          <span className="middotDivider" />
                          <span className="readingTime" title="3 min read">5 min read</span>
                        </div>
                      </div>
                    </div>
                  </li>
                  <li className={cn("flex items-start", gap.md)}>
                    <div className={cn(
                      "flex-shrink-0",
                      "w-8 h-8",
                      "flex items-center justify-center",
                      borderRadius.md,
                      colors.background.base,
                      colors.foreground.primary,
                      typography.bodySmall,
                      "font-semibold"
                    )}>
                      04
                    </div>
                    <div className="flex-1 min-w-0">
                      <Heading level={5} variant="h6" className="mb-2">
                        <Link href="/article/how-health-apps-let" className={cn(colors.foreground.interactive, "hover:underline", transition.normal, "block overflow-hidden")}>
                          <span className="line-clamp-2 block">How Health Apps Let</span>
                        </Link>
                      </Heading>
                      <div className={cn("flex flex-wrap items-center", gap.sm, typography.caption, colors.foreground.muted)}>
                        <div className={cn("flex flex-wrap items-center", gap.xs)}>
                          <Link href="/author" className={colors.foreground.interactive}>Alentica</Link>
                          <span>in</span>
                          <Link href="/archive" className={colors.foreground.interactive}>Police</Link>
                        </div>
                        <div className={cn("flex items-center", gap.xs)}>
                          <span>April 27</span>
                          <span className="middotDivider" />
                          <span className="readingTime" title="3 min read">6 min read</span>
                        </div>
                      </div>
                    </div>
                  </li>
                </ol>
              </div>
            </aside>
          </div>
        </Container>
      </section>

      {/* Ads Section */}
      <section className={cn(sectionPadding.sm, colors.background.base)}>
        <Container>
          <div className={cn(
            "flex justify-center",
            "pb-8",
            "border-b",
            colors.border.DEFAULT
          )}>
            <Link href="#" className="block">
              <Image
                src="/assets/images/ads/ads-2.png"
                alt="ads"
                width={600}
                height={71}
                className="w-full max-w-full h-auto"
              />
            </Link>
          </div>
        </Container>
      </section>
    </>
  );
}
