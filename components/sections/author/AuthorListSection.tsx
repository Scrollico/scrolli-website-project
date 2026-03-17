"use client";

import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/responsive";
import { Heading, Text } from "@/components/ui/typography";
import { SectionHeader } from "@/components/ui/SectionHeader";
import {
  sectionPadding,
  gap,
  componentPadding,
  colors,
  borderRadius,
  border,
  elevation,
  link,
} from "@/lib/design-tokens";
import { cn } from "@/lib/utils";

const FALLBACK_AVATARS = [
  "/assets/images/author-avata-1.jpg",
  "/assets/images/author-avata-2.jpg",
  "/assets/images/author-avata-3.jpg",
  "/assets/images/author-avata-4.jpg",
];

interface AuthorItem {
  name: string;
  slug: string;
  bio?: string;
  avatarUrl?: string;
}

interface AuthorListSectionProps {
  authors: AuthorItem[];
}

export default function AuthorListSection({ authors }: AuthorListSectionProps) {
  if (authors.length === 0) {
    return (
      <section className={sectionPadding.md}>
        <Container>
          <Text variant="body" color="secondary">
            Henüz yazar bulunmuyor.
          </Text>
        </Container>
      </section>
    );
  }

  return (
    <section className={sectionPadding.md}>
      <Container>
        <div className="mb-8 md:mb-12">
          <SectionHeader title="Yazarlar" level={2} variant="h2" />
        </div>

        <div className={cn("grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5", gap.lg)}>
          {authors.map((author, index) => (
            <Link
              key={author.slug}
              href={`/author/${author.slug}`}
              className={cn(
                "group flex flex-col items-center text-center",
                borderRadius.lg,
                border.thin,
                colors.background.elevated,
                elevation[1],
                componentPadding.md,
                "transition-all duration-200",
                "hover:shadow-md hover:-translate-y-0.5"
              )}
            >
              <div className="relative w-20 h-20 md:w-24 md:h-24 mb-3 flex-shrink-0">
                <Image
                  alt={author.name}
                  src={author.avatarUrl || FALLBACK_AVATARS[index % FALLBACK_AVATARS.length]}
                  className={cn(
                    borderRadius.full,
                    "object-cover",
                    border.thin,
                    colors.border.light
                  )}
                  fill
                  sizes="(max-width: 768px) 80px, 96px"
                  unoptimized={!!author.avatarUrl && author.avatarUrl.startsWith("http")}
                />
              </div>

              <Heading
                level={5}
                variant="h5"
                className={cn("mb-1", link.title)}
              >
                {author.name}
              </Heading>

              {author.bio && (
                <Text
                  variant="caption"
                  color="secondary"
                  className="line-clamp-2"
                >
                  {author.bio}
                </Text>
              )}
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
