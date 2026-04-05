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
// Section 2 -- Editorial Value (3-column image grid with overlays)
// ---------------------------------------------------------------------------

function EditorialValue({ articles }: { articles: Article[] }) {
  const displayArticles = articles.slice(0, 3);

  return (
    <section className={cn(surfacePairs.brand.beige, sectionPadding.xl)}>
      <div className={cn("max-w-7xl mx-auto", containerPadding.lg)}>
        <FadeInOnScroll>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight tracking-tight text-center mb-4">
            Gazeteciliğin geleceğini birlikte inşa ediyoruz
          </h2>
          <p className={cn(colors.foreground.secondary, "text-center max-w-2xl mx-auto text-base md:text-lg leading-relaxed mb-12")}>
            Bağımsız gazetecilik, okuyucularının desteğiyle ayakta kalır.
            Scrolli Premium ile kaliteli haberciliğe katkıda bulunun.
          </p>
        </FadeInOnScroll>

        <div className={cn("grid grid-cols-1 md:grid-cols-3", gap.xl)}>
          {displayArticles.map((article, i) => (
            <FadeInOnScroll key={article.id ?? i}>
              <div className="relative aspect-[3/4] rounded-xl overflow-hidden group">
                {article.thumbnail || article.image ? (
                  <Image
                    src={(article.thumbnail || article.image)!}
                    alt={article.title ?? ""}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-[#8080FF]/20 via-[#8080FF]/10 to-[#8080FF]/5" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  {article.category && (
                    <span className="inline-block px-2 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wide bg-white/20 text-white backdrop-blur-sm mb-2">
                      {article.category}
                    </span>
                  )}
                  <h3 className="text-lg md:text-xl font-semibold text-white leading-tight line-clamp-2">
                    {article.title}
                  </h3>
                </div>
              </div>
            </FadeInOnScroll>
          ))}

          {/* Fallback cards when no articles */}
          {displayArticles.length === 0 && [
            { label: "Araştırma", title: "Bağımsız Araştırmacı Gazetecilik" },
            { label: "Analiz", title: "Derinlemesine Sektör Analizleri" },
            { label: "Röportaj", title: "Özel Röportajlar ve Söyleşiler" },
          ].map((item, i) => (
            <FadeInOnScroll key={i}>
              <div className="relative aspect-[3/4] rounded-xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[#8080FF]/20 via-[#8080FF]/10 to-[#8080FF]/5" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <span className="inline-block px-2 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wide bg-white/20 text-white backdrop-blur-sm mb-2">
                    {item.label}
                  </span>
                  <h3 className="text-lg font-semibold text-white leading-tight">
                    {item.title}
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
// Section 3 -- Feature Showcase (alternating editorial panels)
// ---------------------------------------------------------------------------

const features = [
  {
    num: "01",
    icon: Crown,
    title: "Premium Makaleler",
    description:
      "Derinlemesine analizler, özel röportajlar ve sadece üyelere özel içerikler. Mainstream medyanın görmezden geldiği hikayeleri size getiriyoruz.",
    accentColor: "#8080FF",
  },
  {
    num: "02",
    icon: Headphones,
    title: "Günlük Bülten + AI Podcastler",
    description:
      "Her sabah özenle hazırlanmış bülten ve yapay zekâ destekli podcast özetleri. Günü anlamak için ihtiyacınız olan her şey, tek bir yerden.",
    accentColor: "#8080FF",
  },
  {
    num: "03",
    icon: CalendarHeart,
    title: "Özel Etkinlikler + Öncelikli Destek",
    description:
      "Sadece üyelere özel etkinlikler, webinarlar ve öncelikli iletişim hattı. Gazetecilerle doğrudan bağlantı kurma fırsatı.",
    accentColor: "#8080FF",
  },
];

function FeatureShowcase({ articles }: { articles: Article[] }) {
  return (
    <section className={cn(colors.background.base, sectionPadding["2xl"])}>
      <div className={cn("max-w-7xl mx-auto", containerPadding.lg)}>
        <div className="flex flex-col gap-20 md:gap-32">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            const isEven = i % 2 === 1;
            // Use article images for visual panels if available
            const article = articles[i];
            const hasImage = article && (article.thumbnail || article.image);

            return (
              <FadeInOnScroll key={feature.title}>
                <div className={cn("grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-0 rounded-2xl overflow-hidden")}>
                  {/* Visual panel */}
                  <div
                    className={cn(
                      "relative min-h-[300px] md:min-h-[420px] flex items-end overflow-hidden",
                      isEven && "md:order-2"
                    )}
                  >
                    {hasImage ? (
                      <>
                        <Image
                          src={(article.thumbnail || article.image)!}
                          alt={feature.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, 50vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                      </>
                    ) : (
                      <div
                        className="absolute inset-0"
                        style={{
                          background: `linear-gradient(135deg, #${i === 0 ? "6060CC" : i === 1 ? "374152" : "8080CC"} 0%, #${i === 0 ? "8080FF" : i === 1 ? "4A5568" : "A0A0FF"} 100%)`,
                        }}
                      />
                    )}
                    {/* Editorial number label */}
                    <div className="relative z-10 p-8 md:p-12">
                      <span className="text-[120px] md:text-[160px] font-bold leading-none text-white/10 select-none absolute top-4 left-6 pointer-events-none">
                        {feature.num}
                      </span>
                      <div className="relative">
                        <div className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-white/20 backdrop-blur-sm mb-3">
                          <Icon className="h-6 w-6 text-white" />
                        </div>
                        <p className="text-white/80 text-sm font-medium uppercase tracking-widest">
                          {feature.num} — Premium
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Text panel */}
                  <div
                    className={cn(
                      "flex flex-col justify-center p-8 md:p-12 lg:p-16",
                      colors.background.elevated,
                      isEven && "md:order-1"
                    )}
                  >
                    <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight tracking-tight mb-6">
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
            &ldquo;Scrolli, Türkiye&rsquo;nin en önemli bağımsız gazetecilik platformlarından biri. Premium üyelik, bu misyonu desteklemenin en iyi yolu.&rdquo;
          </blockquote>

          <div className="flex flex-col items-center gap-3">
            <div className="relative h-16 w-16 rounded-full overflow-hidden">
              <Image
                src="/assets/images/author-avata-1.jpg"
                alt="Ayşe Yılmaz"
                fill
                className="object-cover object-center"
                sizes="64px"
              />
            </div>
            <div>
              <p className={cn(fontWeight.semibold, "text-base")}>Ayşe Yılmaz</p>
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

  const fallbacks = [
    { title: "Bağımsız Araştırmacı Gazetecilik", img: "/assets/images/author-avata-2.jpg" },
    { title: "Derinlemesine Sektör Analizleri", img: "/assets/images/author-avata-3.jpg" },
    { title: "Özel Röportajlar ve Söyleşiler", img: "/assets/images/author-avata-4.jpg" },
  ];

  return (
    <section className={cn(colors.background.base, sectionPadding.xl)}>
      <div className={cn("max-w-7xl mx-auto", containerPadding.lg)}>
        <FadeInOnScroll>
          <div className="flex flex-wrap justify-center gap-12 md:gap-16">
            {(galleryArticles.length > 0 ? galleryArticles : fallbacks.map((f, i) => ({
              id: `fallback-${i}`,
              title: f.title,
              thumbnail: f.img,
              image: f.img,
              category: undefined,
              slug: "",
            } as unknown as Article))).map((article, i) => (
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
                <p className="text-lg font-semibold text-center leading-tight max-w-[16rem]">
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
          <h2 className="text-4xl md:text-5xl font-bold leading-tight tracking-tight mb-4">
            Bağımsız gazeteciliği destekle
          </h2>
          <p className={cn(colors.foreground.secondary, "text-base md:text-lg leading-relaxed mb-8 max-w-xl mx-auto")}>
            Scrolli Premium ile kaliteli, bağımsız habercilik ekosistemine destek olun.
            Her abonelik, özgür gazeteciliğin gücüne güç katar.
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
            Scrolli Premium&rsquo;a Katıl
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
    title: "Kapalı Analizler",
    description: "Kurumunuza özel, derinlemesine sektörel analiz raporları.",
  },
  {
    icon: Users,
    title: "Özel Buluşmalar",
    description: "Sektör liderlerinin katıldığı özel etkinlikler ve webinarlar.",
  },
  {
    icon: Mail,
    title: "Kurumsal Erişim",
    description: "Ekibiniz için sınırsız premium içerik erişimi.",
  },
];

function ScrolliBusiness() {
  return (
    <section className={cn(surfacePairs.brand.beige, sectionPadding.xl)}>
      <div className={cn("max-w-7xl mx-auto", containerPadding.lg)}>
        <FadeInOnScroll>
          <h2 className="text-3xl md:text-4xl font-bold leading-tight tracking-tight text-center mb-12">
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
              Bize Ulaşın
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
          <h3 className={cn("text-xl md:text-2xl font-semibold leading-tight tracking-tight mb-3")}>
            Kurumsal abonelik mi arıyorsunuz?
          </h3>
          <a
            href="mailto:info@scrolli.co"
            className={cn(colors.foreground.secondary, "inline-flex items-center gap-1.5 text-base hover:opacity-80 transition-opacity")}
          >
            Bize ulaşın
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
      <FeatureShowcase articles={articles} />
      <Testimonial />
      <ArticleGallery articles={articles} />
      <FinalCTA />
      <ScrolliBusiness />
      <CorporateCTA />
    </>
  );
}
