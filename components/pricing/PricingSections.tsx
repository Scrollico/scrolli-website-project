"use client";

import { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Crown, Headphones, CalendarHeart, ArrowRight, Building2, Mail, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { Article } from "@/types/content";
import {
  colors,
  surfacePairs,
  buttonPairs,
  sectionPadding,
  containerPadding,
  borderRadius,
  button,
  fontWeight,
  gap,
} from "@/lib/design-tokens";

// ---------------------------------------------------------------------------
// FadeInOnScroll wrapper
// ---------------------------------------------------------------------------

function FadeInOnScroll({ children, className }: { children: ReactNode; className?: string }) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Section 2 -- Editorial Value
// ---------------------------------------------------------------------------

function EditorialValue({ articles }: { articles: Article[] }) {
  const displayArticles = articles.slice(0, 3);

  return (
    <section className={cn(surfacePairs.brand.beige, sectionPadding.xl)}>
      <div className={cn("max-w-7xl mx-auto", containerPadding.lg)}>
        <FadeInOnScroll>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold leading-tight tracking-tight text-center mb-4">
            Gazetecili\u011fin gelece\u011fini birlikte in\u015fa ediyoruz
          </h2>
          <p className={cn(colors.foreground.secondary, "text-center max-w-2xl mx-auto text-base md:text-lg leading-relaxed mb-12")}>
            Ba\u011f\u0131ms\u0131z gazetecilik, okuyucular\u0131n\u0131n deste\u011fiyle ayakta kal\u0131r.
            Scrolli Premium ile kaliteli habercili\u011fe katk\u0131da bulunun.
          </p>
        </FadeInOnScroll>

        <div className={cn("grid grid-cols-1 md:grid-cols-3", gap.xl)}>
          {displayArticles.map((article, i) => (
            <FadeInOnScroll key={article.id ?? i}>
              <div className="relative aspect-[16/9] rounded-xl overflow-hidden group">
                {article.thumbnail || article.image ? (
                  <Image
                    src={(article.thumbnail || article.image)!}
                    alt={article.title ?? ""}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-[#8080FF]/30 to-[#8080FF]/5" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  {article.category && (
                    <span className="inline-block px-2 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wide bg-white/20 text-white backdrop-blur-sm mb-2">
                      {article.category}
                    </span>
                  )}
                  <h3 className="font-display text-lg md:text-xl font-semibold text-white leading-tight line-clamp-2">
                    {article.title}
                  </h3>
                </div>
              </div>
            </FadeInOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Section 3 -- Feature Showcase
// ---------------------------------------------------------------------------

const features = [
  {
    icon: Crown,
    title: "Premium Makaleler",
    description:
      "Derinlemesine analizler, \u00f6zel r\u00f6portajlar ve sadece \u00fcyelere \u00f6zel i\u00e7erikler.",
    gradient: "from-[#8080FF]/20 to-[#8080FF]/5",
  },
  {
    icon: Headphones,
    title: "G\u00fcnl\u00fck B\u00fclten + AI Podcastler",
    description:
      "Her sabah \u00f6zenle haz\u0131rlanm\u0131\u015f b\u00fclten ve yapay zek\u00e2 destekli podcast \u00f6zetleri.",
    gradient: "from-[#8080FF]/15 to-[#8080FF]/5",
  },
  {
    icon: CalendarHeart,
    title: "\u00d6zel Etkinlikler + \u00d6ncelikli Destek",
    description:
      "Sadece \u00fcyelere \u00f6zel etkinlikler, webinarlar ve \u00f6ncelikli ileti\u015fim hatt\u0131.",
    gradient: "from-[#8080FF]/10 to-[#8080FF]/5",
  },
];

function FeatureShowcase() {
  return (
    <section className={cn(colors.background.base, sectionPadding["2xl"])}>
      <div className={cn("max-w-7xl mx-auto", containerPadding.lg)}>
        <div className="flex flex-col gap-16 md:gap-24">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            const isEven = i % 2 === 1;

            return (
              <FadeInOnScroll key={feature.title}>
                <div className={cn("grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center")}>
                  {/* Image / visual area */}
                  <div className={cn("relative aspect-[4/3] rounded-2xl overflow-hidden flex items-center justify-center bg-gradient-to-br", feature.gradient, isEven && "md:order-2")}>
                    <div className="h-20 w-20 rounded-2xl flex items-center justify-center bg-[#8080FF]/10 border border-[#8080FF]/20">
                      <Icon className={cn("h-10 w-10", colors.foreground.primary)} />
                    </div>
                  </div>

                  {/* Text area */}
                  <div className={cn(isEven && "md:order-1")}>
                    <h3 className="font-display text-3xl md:text-4xl font-bold leading-tight tracking-tight mb-4">
                      {feature.title}
                    </h3>
                    <p className={cn(colors.foreground.secondary, "text-base md:text-lg leading-relaxed")}>
                      {feature.description}
                    </p>
                  </div>
                </div>
              </FadeInOnScroll>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Section 4 -- Testimonial
// ---------------------------------------------------------------------------

function Testimonial() {
  return (
    <section className={cn(surfacePairs.brand.beige, sectionPadding.xl)}>
      <div className={cn("max-w-4xl mx-auto text-center", containerPadding.lg)}>
        <FadeInOnScroll>
          <blockquote className="font-display italic text-2xl md:text-3xl lg:text-4xl leading-relaxed tracking-tight mb-8">
            &ldquo;Scrolli, T\u00fcrkiye&rsquo;nin en \u00f6nemli ba\u011f\u0131ms\u0131z gazetecilik platformlar\u0131ndan biri. Premium \u00fcyelik, bu misyonu desteklemenin en iyi yolu.&rdquo;
          </blockquote>

          <div className="flex flex-col items-center gap-3">
            <div className="h-16 w-16 rounded-full bg-gray-300 dark:bg-gray-600" aria-hidden="true" />
            <div>
              <p className={cn(fontWeight.semibold, "text-base")}>Ay\u015fe Y\u0131lmaz</p>
              <p className={cn(colors.foreground.muted, "text-sm")}>Gazeteci &amp; Yazar</p>
            </div>
          </div>
        </FadeInOnScroll>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Section 5 -- Article Gallery (circular crops)
// ---------------------------------------------------------------------------

function ArticleGallery({ articles }: { articles: Article[] }) {
  const galleryArticles = articles.length >= 6 ? articles.slice(3, 6) : articles.slice(0, 3);

  return (
    <section className={cn(colors.background.base, sectionPadding.xl)}>
      <div className={cn("max-w-7xl mx-auto", containerPadding.lg)}>
        <FadeInOnScroll>
          <div className="flex flex-wrap justify-center gap-12 md:gap-16">
            {galleryArticles.map((article, i) => (
              <div key={article.id ?? i} className="flex flex-col items-center gap-4">
                <div className="relative w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden">
                  {article.thumbnail || article.image ? (
                    <Image
                      src={(article.thumbnail || article.image)!}
                      alt={article.title ?? ""}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 192px, 256px"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-[#8080FF]/20 to-[#8080FF]/5" />
                  )}
                </div>
                <p className="font-display text-lg text-center leading-tight max-w-[16rem]">
                  {article.title}
                </p>
              </div>
            ))}
          </div>
        </FadeInOnScroll>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Section 6 -- Final CTA
// ---------------------------------------------------------------------------

function FinalCTA() {
  return (
    <section className={cn(colors.background.base, sectionPadding["2xl"])}>
      <div className={cn("max-w-3xl mx-auto text-center", containerPadding.lg)}>
        <FadeInOnScroll>
          <h2 className="font-display text-4xl md:text-5xl font-bold leading-tight tracking-tight mb-4">
            Ba\u011f\u0131ms\u0131z gazetecili\u011fi destekle
          </h2>
          <p className={cn(colors.foreground.secondary, "text-base md:text-lg leading-relaxed mb-8 max-w-xl mx-auto")}>
            Scrolli Premium ile kaliteli, ba\u011f\u0131ms\u0131z habercilik ekosistemine destek olun.
            Her abonelik, \u00f6zg\u00fcr gazetecili\u011fin g\u00fcc\u00fcne g\u00fc\u00e7 katar.
          </p>
          <Link
            href="/subscribe"
            className={cn(
              buttonPairs.charcoal.all,
              borderRadius.full,
              button.padding.lg,
              "inline-flex items-center gap-2 text-base font-medium transition-colors"
            )}
          >
            Scrolli Premium&rsquo;a Kat\u0131l
            <ArrowRight className="h-5 w-5" />
          </Link>
        </FadeInOnScroll>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Section 7 -- Scrolli+ Business
// ---------------------------------------------------------------------------

const businessFeatures = [
  {
    icon: Building2,
    title: "Kapal\u0131 Analizler",
    description: "Kurumunuza \u00f6zel, derinlemesine sekt\u00f6rel analiz raporlar\u0131.",
  },
  {
    icon: Users,
    title: "\u00d6zel Bulu\u015fmalar",
    description: "Sekt\u00f6r liderlerinin kat\u0131ld\u0131\u011f\u0131 \u00f6zel etkinlikler ve webinarlar.",
  },
  {
    icon: Mail,
    title: "Kurumsal Eri\u015fim",
    description: "Ekibiniz i\u00e7in s\u0131n\u0131rs\u0131z premium i\u00e7erik eri\u015fimi.",
  },
];

function ScrolliBusiness() {
  return (
    <section className={cn(surfacePairs.brand.beige, sectionPadding.xl)}>
      <div className={cn("max-w-7xl mx-auto", containerPadding.lg)}>
        <FadeInOnScroll>
          <h2 className="font-display text-3xl md:text-4xl font-bold leading-tight tracking-tight text-center mb-12">
            Scrolli+ Business
          </h2>

          <div className={cn("grid grid-cols-1 md:grid-cols-3", gap.xl)}>
            {businessFeatures.map((feat) => {
              const Icon = feat.icon;
              return (
                <div key={feat.title} className="text-center">
                  <div className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-[#8080FF]/10 mb-4">
                    <Icon className="h-6 w-6 text-[#8080FF]" />
                  </div>
                  <h3 className={cn(fontWeight.semibold, "text-lg mb-2")}>{feat.title}</h3>
                  <p className={cn(colors.foreground.secondary, "text-sm leading-relaxed")}>
                    {feat.description}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="text-center mt-10">
            <a
              href="mailto:info@scrolli.co"
              className={cn(
                buttonPairs.primary.all,
                borderRadius.full,
                button.padding.lg,
                "inline-flex items-center gap-2 text-base font-medium transition-colors"
              )}
            >
              Bize Ula\u015f\u0131n
              <ArrowRight className="h-5 w-5" />
            </a>
          </div>
        </FadeInOnScroll>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Section 8 -- Corporate CTA (minimal)
// ---------------------------------------------------------------------------

function CorporateCTA() {
  return (
    <section className={cn(colors.background.base, sectionPadding.lg, "border-t", colors.border.DEFAULT)}>
      <div className={cn("max-w-3xl mx-auto text-center", containerPadding.lg)}>
        <FadeInOnScroll>
          <h3 className={cn("font-display text-xl md:text-2xl font-semibold leading-tight tracking-tight mb-3")}>
            Kurumsal abonelik mi ar\u0131yorsunuz?
          </h3>
          <a
            href="mailto:info@scrolli.co"
            className={cn(colors.foreground.secondary, "inline-flex items-center gap-1.5 text-base hover:opacity-80 transition-opacity")}
          >
            Bize ula\u015f\u0131n
            <ArrowRight className="h-4 w-4" />
          </a>
        </FadeInOnScroll>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Main export
// ---------------------------------------------------------------------------

export default function PricingSections({ articles }: { articles: Article[] }) {
  return (
    <>
      <EditorialValue articles={articles} />
      <FeatureShowcase />
      <Testimonial />
      <ArticleGallery articles={articles} />
      <FinalCTA />
      <ScrolliBusiness />
      <CorporateCTA />
    </>
  );
}
