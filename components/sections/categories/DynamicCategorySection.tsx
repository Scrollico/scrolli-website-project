"use client";
import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
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
import { FreeContentBadgeIcon, PremiumContentBadgeIcon } from "@/components/icons/scrolli-icons";
import { Article } from "@/types/content";

interface DynamicCategorySectionProps {
    categoryName: string;
    articles: Article[];
    popularArticles?: Article[];
}

export default function DynamicCategorySection({
    categoryName,
    articles,
    popularArticles = []
}: DynamicCategorySectionProps) {

    // If no articles, show a message
    if (!articles || articles.length === 0) {
        return (
            <section className={cn(sectionPadding.md, colors.background.base)}>
                <Container>
                    <Heading level={2} variant="h3" className="text-center py-20">
                        No articles found in {categoryName}.
                    </Heading>
                </Container>
            </section>
        );
    }

    const mainArticle = articles[0];
    const listArticles = articles.slice(1, 5); // Next 4 articles
    const sideArticles = articles.slice(5, 9); // Next 4 articles for the grid

    return (
        <>
            <section className={cn(sectionPadding.md, colors.background.base)}>
                <Container>
                    <div className={cn("grid grid-cols-1 lg:grid-cols-12", gap.lg)}>
                        {/* Main Content - 8 columns */}
                        <div className="lg:col-span-8">
                            <Heading level={4} variant="h4" className={cn("spanborder border-b-2 border-primary pb-2 mb-6 capitalize")}>
                                {categoryName}
                            </Heading>

                            {/* Featured Article */}
                            {mainArticle && (
                                <article className={cn("mb-8 md:mb-12")}>
                                    <figure className="mb-6 relative">
                                        <Link href={`/${mainArticle.id}`} prefetch={true}>
                                            {mainArticle.image ? (
                                                <Image
                                                    src={mainArticle.image}
                                                    alt={mainArticle.title}
                                                    width={736}
                                                    height={520}
                                                    className="w-full h-auto object-cover rounded-lg"
                                                />
                                            ) : (
                                                <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500">
                                                    No Image
                                                </div>
                                            )}
                                        </Link>
                                        <div className="absolute top-2 right-2 z-10 pointer-events-none">
                                            {mainArticle.isPremium ? (
                                                <PremiumContentBadgeIcon size={24} className="drop-shadow-md" />
                                            ) : (
                                                <FreeContentBadgeIcon size={24} className="drop-shadow-md" />
                                            )}
                                        </div>
                                    </figure>
                                    <Heading level={1} variant="h1" className="mb-4">
                                        <Link href={`/${mainArticle.id}`} className={cn(colors.foreground.interactive, "hover:underline", transition.normal)}>
                                            {mainArticle.title}
                                        </Link>
                                    </Heading>
                                    <div className={cn("entry-excerpt overflow-hidden mb-6")}>
                                        <Text variant="body" color="secondary" className="line-clamp-3">
                                            {mainArticle.excerpt}
                                        </Text>
                                    </div>
                                    <div className={cn("entry-meta flex flex-wrap items-center", gap.sm, typography.caption, colors.foreground.muted)}>
                                        <Link className="author-avatar flex-shrink-0" href="#">
                                            {/* Placeholder avatar or author image if available */}
                                            <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-xs">
                                                {mainArticle.author.charAt(0)}
                                            </div>
                                        </Link>
                                        <div className={cn("flex flex-wrap items-center", gap.xs)}>
                                            <Link href={`/author/${mainArticle.author.toLowerCase().replace(/\s+/g, "-")}`} className={colors.foreground.interactive}>{mainArticle.author}</Link>
                                            <span>in</span>
                                            <Link href={`/categories?cat=${mainArticle.category}`}>
                                                <Badge className="ml-1 cursor-pointer">
                                                    {mainArticle.category}
                                                </Badge>
                                            </Link>
                                        </div>
                                        <div className={cn("flex items-center", gap.xs)}>
                                            <span>{mainArticle.date}</span>
                                            <span className="middotDivider" />
                                            <span className="readingTime" title={mainArticle.readTime}>
                                                {mainArticle.readTime}
                                            </span>
                                        </div>
                                    </div>
                                </article>
                            )}

                            {/* Spacing */}
                            <div className={cn(margin.xl)} />

                            {/* Articles List */}
                            <div className={cn("flex flex-col", gap.lg)}>
                                {listArticles.map((article, idx) => (
                                    <article key={idx} className={cn("flex flex-col md:flex-row", gap.md, "pb-6 md:pb-8", idx < listArticles.length - 1 && "border-b", colors.border.DEFAULT)}>
                                        <div className="flex-1 min-w-0">
                                            <div className={cn("flex flex-col", gap.sm)}>
                                                {article.tag && (
                                                    <Text variant="caption" color="muted" className="mb-0">
                                                        {article.tag}
                                                    </Text>
                                                )}
                                                <Heading level={3} variant="h5" className="mb-2">
                                                    <Link href={`/${article.id}`} className={cn(colors.foreground.interactive, "hover:underline", transition.normal, "block overflow-hidden")}>
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
                                                        <Link href={`/author/${article.author.toLowerCase().replace(/\s+/g, "-")}`} className={colors.foreground.interactive}>{article.author}</Link>
                                                        <span>in</span>
                                                        <Link href={`/categories?cat=${article.category}`}>
                                                            <Badge className="ml-1 cursor-pointer">
                                                                {article.category}
                                                            </Badge>
                                                        </Link>
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
                                            {article.image && (
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
                                            )}
                                            <div className="absolute top-2 right-2 z-10 pointer-events-none">
                                                {article.isPremium ? (
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
                            {sideArticles.length > 0 && (
                                <div className="mt-12 md:mt-16">
                                    <div className={cn("grid grid-cols-1 md:grid-cols-2", gap.lg)}>
                                        {sideArticles.map((article, idx) => (
                                            <article key={idx} className={cn("flex flex-col md:flex-row", gap.md)}>
                                                <figure className="w-full md:w-32 lg:w-40 flex-shrink-0 relative">
                                                    <Link href={`/${article.id}`} className={cn("block", transition.normal, "hover:opacity-90")}>
                                                        {article.image && (
                                                            <Image
                                                                src={article.image}
                                                                alt={article.title}
                                                                width={190}
                                                                height={165}
                                                                className="w-full h-auto object-cover rounded-md"
                                                                sizes="(max-width: 768px) 100vw, 190px"
                                                            />
                                                        )}
                                                    </Link>
                                                    <div className="absolute top-2 right-2 z-10 pointer-events-none">
                                                        {article.isPremium ? (
                                                            <PremiumContentBadgeIcon size={20} className="drop-shadow-md" />
                                                        ) : (
                                                            <FreeContentBadgeIcon size={20} className="drop-shadow-md" />
                                                        )}
                                                    </div>
                                                </figure>
                                                <div className={cn("flex-1 min-w-0 flex flex-col justify-center")}>
                                                    <Heading level={5} variant="h6" className="mb-2">
                                                        <Link href={`/${article.id}`} className={cn(colors.foreground.interactive, "hover:underline", transition.normal, "block overflow-hidden")}>
                                                            <span className="line-clamp-2 block">{article.title}</span>
                                                        </Link>
                                                    </Heading>
                                                    <div className={cn("flex flex-wrap items-center", gap.sm, typography.caption, colors.foreground.muted)}>
                                                        <div className={cn("flex flex-wrap items-center", gap.xs)}>
                                                            <Link href={`/author/${article.author.toLowerCase().replace(/\s+/g, "-")}`} className={colors.foreground.interactive}>{article.author}</Link>
                                                            <span>in</span>
                                                            <Link href={`/categories?cat=${article.category}`}>
                                                                <Badge className="ml-1 cursor-pointer">
                                                                    {article.category}
                                                                </Badge>
                                                            </Link>
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
                            )}
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
                                    Popular
                                </Heading>
                                <ol className={cn("flex flex-col", gap.md)}>
                                    {popularArticles.map((article, idx) => (
                                        <li key={idx} className={cn("flex items-start", gap.md)}>
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
                                                {String(idx + 1).padStart(2, '0')}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <Heading level={5} variant="h6" className="mb-2">
                                                    <Link href={`/${article.id}`} className={cn(colors.foreground.interactive, "hover:underline", transition.normal, "block overflow-hidden")}>
                                                        <span className="line-clamp-2 block">{article.title}</span>
                                                    </Link>
                                                </Heading>
                                                <div className={cn("flex flex-wrap items-center", gap.sm, typography.caption, colors.foreground.muted)}>
                                                    <div className={cn("flex flex-wrap items-center", gap.xs)}>
                                                        <Link href="/author" className={colors.foreground.interactive}>{article.author}</Link>
                                                        <span>in</span>
                                                        <Link href={`/categories?cat=${article.category}`} className={colors.foreground.interactive}>{article.category}</Link>
                                                    </div>
                                                    <div className={cn("flex items-center", gap.xs)}>
                                                        <span>{article.date}</span>
                                                        <span className="middotDivider" />
                                                        <span className="readingTime" title={article.readTime}>{article.readTime}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                    {popularArticles.length === 0 && (
                                        <Text>No popular articles found.</Text>
                                    )}
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
