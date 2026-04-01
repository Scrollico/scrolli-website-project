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
    transition,
    link,
} from "@/lib/design-tokens";
import { cn } from "@/lib/utils";
import { Heading, Text } from "@/components/ui/typography";
import { Container } from "@/components/responsive";
import { Article } from "@/types/content";
import { ArrowRight } from "lucide-react";

interface DynamicCategorySectionProps {
    categoryName: string;
    articles: Article[];
    popularArticles?: Article[];
}

function capitalize(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function AuthorInitialAvatar({ name }: { name: string }) {
    return (
        <div className={cn(
            "w-8 h-8 rounded-full flex-shrink-0",
            "flex items-center justify-center",
            "bg-gray-200 dark:bg-gray-700",
            "text-xs font-semibold",
            colors.foreground.secondary
        )}>
            {name.charAt(0).toUpperCase()}
        </div>
    );
}

export default function DynamicCategorySection({
    categoryName,
    articles,
    popularArticles = []
}: DynamicCategorySectionProps) {

    if (!articles || articles.length === 0) {
        return (
            <section className={cn(sectionPadding.md, colors.background.base)}>
                <Container>
                    <div className="text-center py-24">
                        <Heading level={2} variant="h3" className="mb-4">
                            {capitalize(categoryName)}
                        </Heading>
                        <Text variant="body" color="muted">
                            Bu kategoride henüz yayınlanmış içerik yok.
                        </Text>
                    </div>
                </Container>
            </section>
        );
    }

    const mainArticle = articles[0];
    const listArticles = articles.slice(1, 6);
    const extraArticles = articles.slice(6, 10);

    return (
        <>
            {/* Category Header Bar */}
            <div className={cn(
                "border-b",
                colors.border.DEFAULT,
                colors.background.elevated
            )}>
                <Container>
                    <div className="flex items-center gap-2 py-3">
                        <Link
                            href="/"
                            className={cn(typography.caption, colors.foreground.muted, "hover:underline")}
                        >
                            Ana Sayfa
                        </Link>
                        <span className={cn(typography.caption, colors.foreground.muted)}>/</span>
                        <span className={cn(typography.caption, colors.foreground.primary, "font-semibold capitalize")}>
                            {categoryName}
                        </span>
                    </div>
                </Container>
            </div>

            <section className={cn(sectionPadding.md, colors.background.base)}>
                <Container>
                    {/* Section Title */}
                    <div className="mb-8 md:mb-10">
                        <div className="flex items-center justify-between">
                            <Heading
                                level={1}
                                variant="h1"
                                className={cn(
                                    "capitalize",
                                    "border-l-4 border-primary pl-4",
                                    colors.foreground.primary
                                )}
                            >
                                {categoryName}
                            </Heading>
                            <Text variant="caption" color="muted">
                                {articles.length} yazı
                            </Text>
                        </div>
                    </div>

                    <div className={cn("grid grid-cols-1 lg:grid-cols-12", gap.xl)}>
                        {/* Main Content - 8 columns */}
                        <div className="lg:col-span-8">

                            {/* Hero Article */}
                            {mainArticle && (
                                <article className={cn(
                                    "mb-10 md:mb-14",
                                    "pb-10 md:pb-14",
                                    "border-b",
                                    colors.border.DEFAULT
                                )}>
                                    {/* Hero Image */}
                                    {(mainArticle.image || mainArticle.thumbnail) && (
                                        <Link href={`/${mainArticle.id}`} prefetch={true} className="block mb-5 group">
                                            <div className={cn(
                                                "relative w-full overflow-hidden",
                                                borderRadius.lg,
                                                "aspect-[16/9]"
                                            )}>
                                                <Image
                                                    src={mainArticle.image || mainArticle.thumbnail || ""}
                                                    alt={mainArticle.title}
                                                    fill
                                                    className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 65vw, 700px"
                                                    priority
                                                />
                                            </div>
                                        </Link>
                                    )}

                                    {/* Category Badge */}
                                    {mainArticle.category && (
                                        <div className="mb-3">
                                            <Link href={`/categories?cat=${mainArticle.category}`}>
                                                <Badge className="cursor-pointer tracking-wide border-none bg-gray-200/50 text-gray-600 dark:bg-gray-700/50 dark:text-gray-300 uppercase text-[10px]">
                                                    {mainArticle.category}
                                                </Badge>
                                            </Link>
                                        </div>
                                    )}

                                    {/* Title */}
                                    <Heading level={2} variant="h2" className="mb-4">
                                        <Link
                                            href={`/${mainArticle.id}`}
                                            className={cn(colors.foreground.primary, link.title)}
                                        >
                                            {mainArticle.title}
                                        </Link>
                                    </Heading>

                                    {/* Excerpt */}
                                    {mainArticle.excerpt && (
                                        <Text variant="body" color="secondary" className="mb-5 line-clamp-3">
                                            {mainArticle.excerpt}
                                        </Text>
                                    )}

                                    {/* Author + Meta */}
                                    <div className={cn("flex items-center", gap.sm)}>
                                        <AuthorInitialAvatar name={mainArticle.author} />
                                        <div className={cn("flex flex-wrap items-center", gap.xs, typography.caption, colors.foreground.muted)}>
                                            <Link
                                                href={`/author/${mainArticle.authorSlug || mainArticle.author.toLowerCase().replace(/\s+/g, "-")}`}
                                                className={cn(colors.foreground.interactive, "font-medium")}
                                            >
                                                {mainArticle.author}
                                            </Link>
                                            <span>·</span>
                                            <span>{mainArticle.date}</span>
                                            {mainArticle.readTime && (
                                                <>
                                                    <span>·</span>
                                                    <span>{mainArticle.readTime}</span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </article>
                            )}

                            {/* Article List */}
                            <div className={cn("flex flex-col", gap.md)}>
                                {listArticles.map((article, idx) => (
                                    <article
                                        key={article.id}
                                        className={cn(
                                            "flex flex-col sm:flex-row",
                                            gap.md,
                                            "pb-6 md:pb-7",
                                            idx < listArticles.length - 1 && "border-b",
                                            colors.border.DEFAULT
                                        )}
                                    >
                                        <div className="flex-1 min-w-0">
                                            <div className={cn("flex flex-col", gap.xs)}>
                                                {article.category && (
                                                    <Link href={`/categories?cat=${article.category}`}>
                                                        <Badge className="self-start cursor-pointer tracking-wide border-none bg-gray-200/50 text-gray-600 dark:bg-gray-700/50 dark:text-gray-300 uppercase text-[10px]">
                                                            {article.category}
                                                        </Badge>
                                                    </Link>
                                                )}
                                                <Heading level={3} variant="h4" className="mb-1">
                                                    <Link
                                                        href={`/${article.id}`}
                                                        className={cn(colors.foreground.primary, link.title, "line-clamp-2")}
                                                    >
                                                        {article.title}
                                                    </Link>
                                                </Heading>
                                                {article.excerpt && (
                                                    <Text variant="body" color="secondary" className="line-clamp-2 mb-2">
                                                        {article.excerpt}
                                                    </Text>
                                                )}
                                                <div className={cn(
                                                    "flex flex-wrap items-center",
                                                    gap.xs,
                                                    typography.caption,
                                                    colors.foreground.muted
                                                )}>
                                                    <Link
                                                        href={`/author/${article.authorSlug || article.author.toLowerCase().replace(/\s+/g, "-")}`}
                                                        className={colors.foreground.interactive}
                                                    >
                                                        {article.author}
                                                    </Link>
                                                    <span>·</span>
                                                    <span>{article.date}</span>
                                                    {article.readTime && (
                                                        <>
                                                            <span>·</span>
                                                            <span>{article.readTime}</span>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Thumbnail */}
                                        {(article.thumbnail || article.image) && (
                                            <Link
                                                href={`/${article.id}`}
                                                className={cn(
                                                    "w-full sm:w-36 lg:w-44 flex-shrink-0",
                                                    "block overflow-hidden",
                                                    borderRadius.md,
                                                    "aspect-[16/10] sm:aspect-[4/3]",
                                                    "relative"
                                                )}
                                            >
                                                <Image
                                                    src={article.thumbnail || article.image || ""}
                                                    alt={article.title}
                                                    fill
                                                    className={cn(
                                                        "object-cover",
                                                        transition.normal,
                                                        "hover:scale-105"
                                                    )}
                                                    sizes="(max-width: 640px) 100vw, 176px"
                                                />
                                            </Link>
                                        )}
                                    </article>
                                ))}
                            </div>

                            {/* Extra Articles Grid (small cards) */}
                            {extraArticles.length > 0 && (
                                <div className="mt-10 md:mt-14">
                                    <div className={cn(
                                        "border-b-2 border-primary pb-2 mb-6 flex items-center justify-between"
                                    )}>
                                        <Heading level={5} variant="h5">
                                            Daha Fazla
                                        </Heading>
                                    </div>
                                    <div className={cn("grid grid-cols-1 sm:grid-cols-2", gap.md)}>
                                        {extraArticles.map((article) => (
                                            <article
                                                key={article.id}
                                                className={cn("flex", gap.sm)}
                                            >
                                                {(article.thumbnail || article.image) && (
                                                    <Link
                                                        href={`/${article.id}`}
                                                        className={cn(
                                                            "relative flex-shrink-0",
                                                            "w-24 h-20",
                                                            borderRadius.md,
                                                            "overflow-hidden block"
                                                        )}
                                                    >
                                                        <Image
                                                            src={article.thumbnail || article.image || ""}
                                                            alt={article.title}
                                                            fill
                                                            className="object-cover transition-transform duration-300 hover:scale-105"
                                                            sizes="96px"
                                                        />
                                                    </Link>
                                                )}
                                                <div className="flex-1 min-w-0">
                                                    <Heading level={5} variant="h6" className="mb-1">
                                                        <Link
                                                            href={`/${article.id}`}
                                                            className={cn(colors.foreground.primary, link.title, "line-clamp-2")}
                                                        >
                                                            {article.title}
                                                        </Link>
                                                    </Heading>
                                                    <div className={cn(typography.caption, colors.foreground.muted)}>
                                                        <span>{article.date}</span>
                                                    </div>
                                                </div>
                                            </article>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* View All Button */}
                            {articles.length > 6 && (
                                <div className="mt-10 flex justify-center">
                                    <Link
                                        href={`/categories?cat=${categoryName}`}
                                        className={cn(
                                            "inline-flex items-center gap-2",
                                            "px-6 py-3",
                                            borderRadius.md,
                                            border.thin,
                                            colors.border.DEFAULT,
                                            colors.background.elevated,
                                            typography.bodySmall,
                                            colors.foreground.primary,
                                            "font-medium",
                                            "hover:shadow-md",
                                            transition.normal,
                                            "group"
                                        )}
                                    >
                                        Tüm Yazıları Gör ({articles.length})
                                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* Sidebar - 4 columns */}
                        <aside className="lg:col-span-4">
                            <div className={cn(
                                "sticky top-20",
                            )}>
                                {/* Popular Articles */}
                                <div className={cn(
                                    borderRadius.lg,
                                    border.thin,
                                    colors.background.elevated,
                                    elevation[1],
                                    componentPadding.md
                                )}>
                                    <div className="border-b-2 border-primary pb-2 mb-5">
                                        <Heading level={5} variant="h5">
                                            En Çok Okunanlar
                                        </Heading>
                                    </div>
                                    <ol className={cn("flex flex-col", gap.md)}>
                                        {popularArticles.length > 0 ? (
                                            popularArticles.slice(0, 8).map((article, idx) => (
                                                <li key={article.id} className={cn(
                                                    "flex items-start",
                                                    gap.sm,
                                                    idx < popularArticles.slice(0, 8).length - 1 && "pb-4 border-b",
                                                    colors.border.DEFAULT
                                                )}>
                                                    {/* Rank number */}
                                                    <div className={cn(
                                                        "flex-shrink-0 w-6 h-6",
                                                        "flex items-center justify-center",
                                                        "text-xs font-black",
                                                        colors.foreground.muted
                                                    )}>
                                                        {String(idx + 1).padStart(2, '0')}
                                                    </div>

                                                    {/* Content */}
                                                    <div className="flex-1 min-w-0 flex gap-2 items-start">
                                                        <div className="flex-1 min-w-0">
                                                            <Heading level={6} variant="h6" className="mb-1">
                                                                <Link
                                                                    href={`/${article.id}`}
                                                                    className={cn(
                                                                        colors.foreground.primary,
                                                                        link.title,
                                                                        "line-clamp-2"
                                                                    )}
                                                                >
                                                                    {article.title}
                                                                </Link>
                                                            </Heading>
                                                            <div className={cn(
                                                                "flex items-center",
                                                                gap.xs,
                                                                typography.caption,
                                                                colors.foreground.muted
                                                            )}>
                                                                <Link
                                                                    href={`/author/${article.authorSlug || article.author.toLowerCase().replace(/\s+/g, "-")}`}
                                                                    className={colors.foreground.interactive}
                                                                >
                                                                    {article.author}
                                                                </Link>
                                                                <span>·</span>
                                                                <span>{article.date}</span>
                                                            </div>
                                                        </div>

                                                        {/* Small thumbnail */}
                                                        {(article.thumbnail || article.image) && (
                                                            <Link
                                                                href={`/${article.id}`}
                                                                className={cn(
                                                                    "relative flex-shrink-0 w-16 h-14",
                                                                    borderRadius.md,
                                                                    "overflow-hidden block"
                                                                )}
                                                            >
                                                                <Image
                                                                    src={article.thumbnail || article.image || ""}
                                                                    alt={article.title}
                                                                    fill
                                                                    className="object-cover"
                                                                    sizes="64px"
                                                                />
                                                            </Link>
                                                        )}
                                                    </div>
                                                </li>
                                            ))
                                        ) : (
                                            <Text variant="body" color="muted">
                                                Henüz popüler içerik yok.
                                            </Text>
                                        )}
                                    </ol>
                                </div>
                            </div>
                        </aside>
                    </div>
                </Container>
            </section>
        </>
    );
}
