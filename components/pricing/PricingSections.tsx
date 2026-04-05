"use client";

import { useRef, ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useReducedMotion,
} from "framer-motion";
import {
  Crown,
  Headphones,
  CalendarHeart,
  ArrowRight,
  Building2,
  Mail,
  Users,
  ChevronDown,
} from "lucide-react";
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
// Shared animation wrapper — fast trigger, snappy timing
// ---------------------------------------------------------------------------

function FadeIn({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1], delay }}
    >
      {children}
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Section divider — smooth gradient between bg colors
// ---------------------------------------------------------------------------

const BG_COLORS = {
  beige: "#F8F5E4",
  white: "var(--background, #ffffff)",
} as const;

function SectionDivider({
  from,
  to,
  height = "h-20 md:h-28",
}: {
  from: keyof typeof BG_COLORS;
  to: keyof typeof BG_COLORS;
  height?: string;
}) {
  return (
    <div
      className={cn("w-full", height)}
      style={{
        background: `linear-gradient(to bottom, ${BG_COLORS[from]}, ${BG_COLORS[to]})`,
      }}
    />
  );
}

// ---------------------------------------------------------------------------
// Section 1 — Editorial Statement
// Large centered headline with staggered word reveal
// ---------------------------------------------------------------------------

function EditorialStatement() {
  const words = "Gazeteciliğin geleceğini birlikte inşa ediyoruz".split(" ");

  return (
    <section className={cn(surfacePairs.brand.beige, "py-24 md:py-32 lg:py-40")}>
      <div className={cn("max-w-5xl mx-auto text-center", containerPadding.lg)}>
        <FadeIn>
          <p className="text-sm md:text-base uppercase tracking-[0.2em] text-[#8080FF] font-medium mb-6 md:mb-8">
            Scrolli Premium
          </p>
        </FadeIn>

        <h2 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-[1.05] tracking-tight mb-8">
          {words.map((word, i) => (
            <FadeIn
              key={i}
              className="inline-block mr-[0.3em]"
              delay={i * 0.05}
            >
              {word}
            </FadeIn>
          ))}
        </h2>

        <FadeIn delay={0.3}>
          <p
            className={cn(
              colors.foreground.secondary,
              "text-lg md:text-xl leading-relaxed max-w-2xl mx-auto"
            )}
          >
            Bağımsız gazetecilik, okuyucularının desteğiyle ayakta kalır.
            Scrolli Premium ile kaliteli haberciliğe katkıda bulunun.
          </p>
        </FadeIn>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Section 2 — Horizontal Scroll Article Gallery
// Scroll-linked horizontal motion — articles slide left as user scrolls down
// ---------------------------------------------------------------------------

// Inner component that uses useScroll — only rendered when we have articles
function HorizontalScrollInner({ displayArticles }: { displayArticles: Article[] }) {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const rawX = useTransform(scrollYProgress, [0, 1], ["2%", "-55%"]);
  const x = useSpring(rawX, { stiffness: 120, damping: 35, mass: 0.4 });
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });
  const hintOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);

  return (
    <section
      ref={containerRef}
      className="relative h-[200vh] md:h-[220vh]"
      style={{
        background: `linear-gradient(to bottom, #F8F5E4 0%, var(--background, #ffffff) 12%, var(--background, #ffffff) 88%, #F8F5E4 100%)`,
      }}
    >
      <div className="sticky top-0 h-screen flex flex-col justify-center overflow-hidden">
        <div
          className={cn(
            "max-w-7xl mx-auto w-full flex items-baseline justify-between mb-8 md:mb-10",
            containerPadding.lg
          )}
        >
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-[#8080FF] font-medium mb-2">
              Keşfedin
            </p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
              Hikayelerimiz
            </h2>
          </div>
          <Link
            href="/"
            className={cn(
              "hidden md:inline-flex items-center gap-2 text-sm font-medium",
              colors.foreground.secondary,
              "hover:opacity-70 transition-opacity"
            )}
          >
            Tümünü gör
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <motion.div
          style={{ x }}
          className="flex gap-5 md:gap-6 pl-4 md:pl-8 lg:pl-12 xl:pl-16"
        >
          {displayArticles.map((article, i) => (
            <motion.div
              key={article.id ?? i}
              className="relative flex-shrink-0 w-[260px] md:w-[320px] lg:w-[360px] aspect-[3/4] rounded-2xl overflow-hidden group cursor-pointer"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <Image
                src={(article.thumbnail || article.image)!}
                alt={article.title ?? ""}
                fill
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                sizes="(max-width: 768px) 260px, (max-width: 1024px) 320px, 360px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6">
                {article.category && (
                  <span className="inline-block px-2.5 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider bg-white/15 text-white backdrop-blur-sm mb-2.5">
                    {article.category}
                  </span>
                )}
                <h3 className="text-base md:text-lg font-semibold text-white leading-snug line-clamp-2">
                  {article.title}
                </h3>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <div className="max-w-7xl mx-auto w-full mt-8 md:mt-10 px-4 md:px-8 lg:px-12 xl:px-16">
          <div className="h-[2px] bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-[#8080FF] rounded-full origin-left"
              style={{ scaleX }}
            />
          </div>
          <motion.div
            className="flex items-center justify-center gap-1.5 mt-4"
            style={{ opacity: hintOpacity }}
          >
            <motion.div
              animate={{ y: [0, 5, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            >
              <ChevronDown className="h-4 w-4 text-muted-foreground/60" />
            </motion.div>
            <span className="text-xs text-muted-foreground/60 font-medium tracking-wide">
              Keşfetmek için kaydırın
            </span>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function HorizontalScrollGallery({ articles }: { articles: Article[] }) {
  const shouldReduceMotion = useReducedMotion();

  const displayArticles = articles
    .filter((a) => a.thumbnail || a.image)
    .slice(0, 10);

  // Fallback: simple snap scroll (no useScroll hooks = no hydration crash)
  if (shouldReduceMotion || displayArticles.length === 0) {
    return (
      <section className={cn(colors.background.base, "py-16 md:py-24")}>
        <div className={cn("max-w-7xl mx-auto", containerPadding.lg)}>
          <div className="flex items-baseline justify-between mb-8">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-[#8080FF] font-medium mb-2">
                Keşfedin
              </p>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
                Hikayelerimiz
              </h2>
            </div>
            <Link
              href="/"
              className={cn(
                "hidden md:inline-flex items-center gap-2 text-sm font-medium",
                colors.foreground.secondary,
                "hover:opacity-70 transition-opacity"
              )}
            >
              Tümünü gör
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4 -mx-4 px-4 scrollbar-hide">
            {displayArticles.slice(0, 6).map((article, i) => (
              <div
                key={article.id ?? i}
                className="relative flex-shrink-0 w-[260px] md:w-[300px] aspect-[3/4] rounded-2xl overflow-hidden snap-start"
              >
                <Image
                  src={(article.thumbnail || article.image)!}
                  alt={article.title ?? ""}
                  fill
                  className="object-cover"
                  sizes="300px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  {article.category && (
                    <span className="inline-block px-2.5 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider bg-white/15 text-white backdrop-blur-sm mb-2">
                      {article.category}
                    </span>
                  )}
                  <h3 className="text-base font-semibold text-white leading-snug line-clamp-2">
                    {article.title}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return <HorizontalScrollInner displayArticles={displayArticles} />;
}

// ---------------------------------------------------------------------------
// Section 3 — Feature Panels (alternating, full-bleed editorial style)
// ---------------------------------------------------------------------------

const features = [
  {
    num: "01",
    icon: Crown,
    title: "Premium Makaleler",
    subtitle: "Daha derin",
    description:
      "Derinlemesine analizler, özel röportajlar ve sadece üyelere özel içerikler. Mainstream medyanın görmezden geldiği hikayeleri size getiriyoruz.",
  },
  {
    num: "02",
    icon: Headphones,
    title: "Günlük Bülten + AI Podcastler",
    subtitle: "Daha akıllı",
    description:
      "Her sabah özenle hazırlanmış bülten ve yapay zekâ destekli podcast özetleri. Günü anlamak için ihtiyacınız olan her şey, tek bir yerden.",
  },
  {
    num: "03",
    icon: CalendarHeart,
    title: "Özel Etkinlikler + Öncelikli Destek",
    subtitle: "Daha yakın",
    description:
      "Sadece üyelere özel etkinlikler, webinarlar ve öncelikli iletişim hattı. Gazetecilerle doğrudan bağlantı kurma fırsatı.",
  },
];

function FeaturePanelImage({
  src,
  alt,
  fallbackGradient,
  num,
}: {
  src?: string;
  alt: string;
  fallbackGradient: string;
  num: string;
}) {
  return (
    <FadeIn className="relative min-h-[50vh] md:min-h-full overflow-hidden">
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      ) : (
        <div className="absolute inset-0" style={{ background: fallbackGradient }} />
      )}

      {src && (
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:to-transparent" />
      )}

      {/* Editorial number watermark */}
      <span
        className="absolute bottom-6 right-8 md:bottom-10 md:right-12 text-[140px] md:text-[200px] lg:text-[260px] font-bold leading-none select-none pointer-events-none"
        style={{ color: "rgba(255,255,255,0.08)" }}
      >
        {num}
      </span>
    </FadeIn>
  );
}

function FeaturePanels({ articles }: { articles: Article[] }) {
  const gradients = [
    "linear-gradient(135deg, #5A5ACD 0%, #8080FF 100%)",
    "linear-gradient(135deg, #374152 0%, #4B5563 100%)",
    "linear-gradient(135deg, #6A6AE0 0%, #9999FF 100%)",
  ];

  return (
    <section className="relative">
      {features.map((feature, i) => {
        const Icon = feature.icon;
        const isEven = i % 2 === 1;
        const article = articles.filter((a) => a.thumbnail || a.image)[i + 3];
        const imageSrc = article
          ? (article.thumbnail || article.image) ?? undefined
          : undefined;
        const isBeige = i % 2 === 0;

        return (
          <div
            key={feature.title}
            className={cn(
              "relative",
              isBeige ? surfacePairs.brand.beige : colors.background.base
            )}
          >
            <div className="max-w-[1400px] mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 min-h-[70vh] md:min-h-[80vh]">
                {/* Visual panel with parallax */}
                <div className={cn(isEven && "md:order-2")}>
                  <FeaturePanelImage
                    src={imageSrc}
                    alt={feature.title}
                    fallbackGradient={gradients[i]}
                    num={feature.num}
                  />
                </div>

                {/* Text panel */}
                <div
                  className={cn(
                    "flex flex-col justify-center px-6 py-16 md:px-12 lg:px-20 xl:px-24",
                    isEven && "md:order-1"
                  )}
                >
                  <FadeIn delay={0.08}>
                    <div className="flex items-center gap-3 mb-6">
                      <div className="h-10 w-10 rounded-xl bg-[#8080FF]/10 flex items-center justify-center">
                        <Icon className="h-5 w-5 text-[#8080FF]" />
                      </div>
                      <span className="text-xs uppercase tracking-[0.2em] text-[#8080FF] font-medium">
                        {feature.num} — {feature.subtitle}
                      </span>
                    </div>
                  </FadeIn>

                  <FadeIn delay={0.16}>
                    <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-[1.1] tracking-tight mb-6">
                      {feature.title}
                    </h3>
                  </FadeIn>

                  <FadeIn delay={0.24}>
                    <p
                      className={cn(
                        colors.foreground.secondary,
                        "text-base md:text-lg leading-relaxed max-w-md"
                      )}
                    >
                      {feature.description}
                    </p>
                  </FadeIn>
                </div>
              </div>
            </div>

            {/* Smooth transition to next panel if colors differ */}
            {i < features.length - 1 && (
              <div
                className="h-16 md:h-20 w-full"
                style={{
                  background: isBeige
                    ? `linear-gradient(to bottom, #F8F5E4, var(--background, #ffffff))`
                    : `linear-gradient(to bottom, var(--background, #ffffff), #F8F5E4)`,
                }}
              />
            )}
          </div>
        );
      })}
    </section>
  );
}

// ---------------------------------------------------------------------------
// Section 4 — Testimonial
// Full-width editorial quote with parallax
// ---------------------------------------------------------------------------

function Testimonial() {
  return (
    <section
      className={cn(surfacePairs.brand.beige, "py-24 md:py-32 lg:py-40")}
    >
      <div
        className={cn("max-w-4xl mx-auto text-center", containerPadding.lg)}
      >
        <FadeIn>
          <div className="mb-8">
            <svg
              className="mx-auto h-10 w-10 text-[#8080FF]/30"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
            </svg>
          </div>
        </FadeIn>

        <FadeIn delay={0.08}>
          <blockquote className="font-display italic text-2xl md:text-3xl lg:text-4xl leading-relaxed tracking-tight mb-10">
            Scrolli, Türkiye&rsquo;nin en önemli bağımsız gazetecilik
            platformlarından biri. Premium üyelik, bu misyonu desteklemenin en
            iyi yolu.
          </blockquote>
        </FadeIn>

        <FadeIn delay={0.16}>
          <div className="flex flex-col items-center gap-3">
            <div className="relative h-14 w-14 rounded-full overflow-hidden ring-2 ring-[#8080FF]/20 ring-offset-2 ring-offset-[#F8F5E4]">
              <Image
                src="/assets/images/author-avata-1.jpg"
                alt="Ayşe Yılmaz"
                fill
                className="object-cover"
                sizes="56px"
              />
            </div>
            <div>
              <p className={cn(fontWeight.semibold, "text-base")}>
                Ayşe Yılmaz
              </p>
              <p className={cn(colors.foreground.muted, "text-sm")}>
                Gazeteci &amp; Yazar
              </p>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Section 5 — Final CTA
// ---------------------------------------------------------------------------

function FinalCTA() {
  return (
    <section className={cn(colors.background.base, "py-24 md:py-32 lg:py-40")}>
      <div className={cn("max-w-4xl mx-auto text-center", containerPadding.lg)}>
        <FadeIn>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.05] tracking-tight mb-6">
            Bağımsız gazeteciliği destekle
          </h2>
        </FadeIn>

        <FadeIn delay={0.08}>
          <p
            className={cn(
              colors.foreground.secondary,
              "text-lg md:text-xl leading-relaxed mb-10 max-w-2xl mx-auto"
            )}
          >
            Scrolli Premium ile kaliteli, bağımsız habercilik ekosistemine
            destek olun. Her abonelik, özgür gazeteciliğin gücüne güç katar.
          </p>
        </FadeIn>

        <FadeIn delay={0.16}>
          <Link
            href="/subscribe"
            className={cn(
              buttonPairs.charcoal.all,
              borderRadius.full,
              "inline-flex items-center gap-2.5 px-8 py-4 text-base font-medium transition-all duration-200"
            )}
          >
            Scrolli Premium&rsquo;a Katıl
            <ArrowRight className="h-5 w-5" />
          </Link>
        </FadeIn>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Section 6 — Scrolli+ Business
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
    <section className={cn(surfacePairs.brand.beige, "py-20 md:py-28 lg:py-32")}>
      <div className={cn("max-w-7xl mx-auto", containerPadding.lg)}>
        <FadeIn>
          <div className="text-center mb-14 md:mb-16">
            <p className="text-sm uppercase tracking-[0.2em] text-[#8080FF] font-medium mb-3">
              Kurumsal
            </p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight tracking-tight">
              Scrolli+ Business
            </h2>
          </div>
        </FadeIn>

        <div className={cn("grid grid-cols-1 md:grid-cols-3", gap.xl)}>
          {businessFeatures.map((feat, i) => {
            const Icon = feat.icon;
            return (
              <FadeIn key={feat.title} delay={i * 0.08}>
                <div className="text-center">
                  <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-[#8080FF]/10 mb-5">
                    <Icon className="h-6 w-6 text-[#8080FF]" />
                  </div>
                  <h3 className={cn(fontWeight.semibold, "text-xl mb-3")}>
                    {feat.title}
                  </h3>
                  <p
                    className={cn(
                      colors.foreground.secondary,
                      "text-base leading-relaxed max-w-xs mx-auto"
                    )}
                  >
                    {feat.description}
                  </p>
                </div>
              </FadeIn>
            );
          })}
        </div>

        <FadeIn delay={0.24}>
          <div className="text-center mt-12">
            <a
              href="mailto:info@scrolli.co"
              className={cn(
                buttonPairs.charcoal.all,
                borderRadius.full,
                "inline-flex items-center gap-2.5 px-8 py-4 text-base font-medium transition-all duration-200"
              )}
            >
              Bize Ulaşın
              <ArrowRight className="h-5 w-5" />
            </a>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Section 7 — Corporate CTA (minimal)
// ---------------------------------------------------------------------------

function CorporateCTA() {
  return (
    <section
      className={cn(
        colors.background.base,
        "py-16 md:py-20 border-t",
        colors.border.light
      )}
    >
      <div className={cn("max-w-3xl mx-auto text-center", containerPadding.lg)}>
        <FadeIn>
          <h3 className="text-xl md:text-2xl font-semibold leading-tight tracking-tight mb-4">
            Kurumsal abonelik mi arıyorsunuz?
          </h3>
          <a
            href="mailto:info@scrolli.co"
            className={cn(
              colors.foreground.secondary,
              "inline-flex items-center gap-2 text-base hover:opacity-70 transition-opacity"
            )}
          >
            Bize ulaşın
            <ArrowRight className="h-4 w-4" />
          </a>
        </FadeIn>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Main export
// ---------------------------------------------------------------------------

export default function PricingSections({
  articles,
}: {
  articles: Article[];
}) {
  return (
    <>
      <EditorialStatement />
      <SectionDivider from="beige" to="white" />
      <HorizontalScrollGallery articles={articles} />
      <FeaturePanels articles={articles} />
      <SectionDivider from="beige" to="white" />
      <Testimonial />
      <SectionDivider from="beige" to="white" />
      <FinalCTA />
      <SectionDivider from="white" to="beige" />
      <ScrolliBusiness />
      <SectionDivider from="beige" to="white" />
      <CorporateCTA />
    </>
  );
}
