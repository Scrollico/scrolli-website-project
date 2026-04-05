"use client";

import { useRef, ReactNode, useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useReducedMotion,
  useInView,
  useMotionValueEvent,
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
  Sparkles,
  Smartphone,
  Newspaper,
  Bell,
  Gift,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Article } from "@/types/content";
import {
  colors,
  surfacePairs,
  buttonPairs,
  containerPadding,
  fontWeight,
  gap,
} from "@/lib/design-tokens";

/* ═══════════════════════════════════════════════════════════════════════════
   Brand palette
   ═══════════════════════════════════════════════════════════════════════════ */

const BRAND = {
  beige: "#F8F5E4",
  periwinkle: "#8080FF",
  charcoal: "#374152",
} as const;

/* ═══════════════════════════════════════════════════════════════════════════
   Animation primitives
   ═══════════════════════════════════════════════════════════════════════════ */

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;

function FadeIn({
  children,
  className,
  delay = 0,
  direction = "up",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
}) {
  const shouldReduceMotion = useReducedMotion();
  if (shouldReduceMotion) return <div className={className}>{children}</div>;

  const offsets = {
    up: { y: 40, x: 0 },
    down: { y: -40, x: 0 },
    left: { y: 0, x: 60 },
    right: { y: 0, x: -60 },
    none: { y: 0, x: 0 },
  };

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, ...offsets[direction] }}
      whileInView={{ opacity: 1, y: 0, x: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.8, ease: EASE_OUT_EXPO, delay }}
    >
      {children}
    </motion.div>
  );
}

function ScaleIn({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const shouldReduceMotion = useReducedMotion();
  if (shouldReduceMotion) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, scale: 0.85 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.9, ease: EASE_OUT_EXPO, delay }}
    >
      {children}
    </motion.div>
  );
}

function AnimatedNumber({ value, suffix = "" }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const duration = 1200;
    const step = (timestamp: number) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      setDisplay(Math.round(eased * value));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [isInView, value]);

  return (
    <span ref={ref}>
      {display}
      {suffix}
    </span>
  );
}

function FloatingOrb({
  className,
  color = BRAND.periwinkle,
  size = 200,
  delay = 0,
}: {
  className?: string;
  color?: string;
  size?: number;
  delay?: number;
}) {
  return (
    <motion.div
      className={cn("absolute rounded-full pointer-events-none blur-3xl", className)}
      style={{
        width: size,
        height: size,
        background: `radial-gradient(circle, ${color}25 0%, transparent 70%)`,
      }}
      animate={{ y: [0, -20, 0], x: [0, 10, 0], scale: [1, 1.05, 1] }}
      transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay }}
    />
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   Section divider
   ═══════════════════════════════════════════════════════════════════════════ */

const BG_COLORS = {
  beige: BRAND.beige,
  white: "var(--background, #ffffff)",
} as const;

function SectionDivider({
  from,
  to,
  height = "h-24 md:h-32",
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

/* ═══════════════════════════════════════════════════════════════════════════
   Section 1 — Editorial Statement
   ═══════════════════════════════════════════════════════════════════════════ */

function EditorialStatement() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0.7, 1], [1, 0]);

  const words = "Gazeteciliğin geleceğini birlikte inşa ediyoruz".split(" ");

  return (
    <motion.section
      ref={ref}
      className={cn(surfacePairs.brand.beige, "relative py-28 md:py-36 lg:py-48 overflow-hidden")}
      style={{ opacity }}
    >
      <FloatingOrb className="top-10 left-[10%]" size={300} delay={0} />
      <FloatingOrb className="bottom-20 right-[5%]" size={250} color="#6A6AE0" delay={2} />

      <motion.div
        className="absolute left-1/2 top-0 w-px h-20 -translate-x-1/2"
        style={{ background: `linear-gradient(to bottom, transparent, ${BRAND.periwinkle}40)` }}
        initial={{ scaleY: 0 }}
        whileInView={{ scaleY: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, ease: EASE_OUT_EXPO }}
      />

      <motion.div
        className={cn("max-w-5xl mx-auto text-center relative z-10", containerPadding.lg)}
        style={{ y: backgroundY }}
      >
        <FadeIn>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#8080FF]/10 mb-8 md:mb-10">
            <Sparkles className="h-3.5 w-3.5 text-[#8080FF]" />
            <span className="text-sm uppercase tracking-[0.2em] text-[#8080FF] font-medium">
              Scrolli Premium
            </span>
          </div>
        </FadeIn>

        <h2 className="text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-bold leading-[1.02] tracking-tight mb-10">
          {words.map((word, i) => (
            <motion.span
              key={i}
              className="inline-block mr-[0.25em]"
              initial={{ opacity: 0, y: 50, rotateX: -40 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.7, ease: EASE_OUT_EXPO, delay: i * 0.06 }}
            >
              {word}
            </motion.span>
          ))}
        </h2>

        <FadeIn delay={0.5}>
          <p className={cn(colors.foreground.secondary, "text-lg md:text-xl lg:text-2xl leading-relaxed max-w-2xl mx-auto")}>
            Bağımsız gazetecilik, okuyucularının desteğiyle ayakta kalır.
            Scrolli Premium ile kaliteli haberciliğe katkıda bulunun.
          </p>
        </FadeIn>

        <FadeIn delay={0.7}>
          <div className="flex items-center justify-center gap-8 md:gap-16 mt-14">
            {[
              { value: 250, suffix: "+", label: "Premium Makale" },
              { value: 50, suffix: "K+", label: "Aktif Okuyucu" },
              { value: 12, suffix: "+", label: "Ödüllü Gazeteci" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#8080FF]">
                  <AnimatedNumber value={stat.value} suffix={stat.suffix} />
                </div>
                <div className={cn("text-xs md:text-sm mt-1", colors.foreground.muted)}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </FadeIn>

        <motion.div
          className="mt-16 md:mt-20 flex flex-col items-center gap-2"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 1.2, duration: 0.8 }}
        >
          <span className={cn("text-xs tracking-wider uppercase", colors.foreground.muted)}>
            Keşfetmeye başlayın
          </span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <ChevronDown className="h-5 w-5 text-[#8080FF]/60" />
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   Section 2 — Horizontal Scroll Gallery (robust JS-driven pinning)
   ═══════════════════════════════════════════════════════════════════════════ */

const PLACEHOLDER_CARDS = [
  { title: "Türkiye'nin Enerji Geleceği", category: "Analiz", gradient: "from-blue-600 to-indigo-800" },
  { title: "Dijital Medyanın Dönüşümü", category: "Teknoloji", gradient: "from-purple-600 to-violet-800" },
  { title: "Bağımsız Gazeteciliğin Yükselişi", category: "Gazetecilik", gradient: "from-emerald-600 to-teal-800" },
  { title: "Yapay Zekâ ve Habercilik", category: "AI", gradient: "from-rose-600 to-pink-800" },
  { title: "Sürdürülebilir Ekonomi Raporu", category: "Ekonomi", gradient: "from-amber-600 to-orange-800" },
  { title: "Kültür Sanat Dünyasından", category: "Kültür", gradient: "from-cyan-600 to-blue-800" },
  { title: "Seçim Analizi 2024", category: "Politika", gradient: "from-indigo-600 to-purple-800" },
  { title: "Startup Ekosistemi", category: "İş Dünyası", gradient: "from-teal-600 to-emerald-800" },
];

function HorizontalScrollInner({
  displayArticles,
  hasRealArticles,
}: {
  displayArticles: Article[];
  hasRealArticles: boolean;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  // Raw scroll listener for buttery pinning (no state lag)
  const [pinY, setPinY] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const section = containerRef.current;
    if (!section) return;

    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const rect = section.getBoundingClientRect();
        const sectionH = section.offsetHeight;
        const viewH = window.innerHeight;
        const runway = sectionH - viewH;

        if (runway <= 0) {
          setPinY(0);
          setProgress(0);
          ticking = false;
          return;
        }

        // How far into the section we've scrolled (0 = top aligned, runway = bottom aligned)
        const scrolled = -rect.top;
        const clamped = Math.max(0, Math.min(scrolled, runway));

        setPinY(clamped);
        setProgress(clamped / runway);
        ticking = false;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Horizontal translate derived from progress
  const xPercent = progress * -55;
  const hintOp = Math.max(0, 1 - progress / 0.12);

  const cards = hasRealArticles
    ? displayArticles.map((article, i) => (
        <motion.div
          key={article.id ?? i}
          className="relative flex-shrink-0 w-[280px] md:w-[340px] lg:w-[380px] aspect-[3/4] rounded-2xl overflow-hidden group cursor-pointer shadow-lg shadow-black/5"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: EASE_OUT_EXPO, delay: i * 0.08 }}
          whileHover={{ scale: 1.03, y: -8 }}
        >
          <Image
            src={(article.thumbnail || article.image)!}
            alt={article.title ?? ""}
            fill
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
            sizes="(max-width: 768px) 280px, (max-width: 1024px) 340px, 380px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6">
            {article.category && (
              <span className="inline-block px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider bg-white/15 text-white backdrop-blur-sm mb-3">
                {article.category}
              </span>
            )}
            <h3 className="text-base md:text-lg font-semibold text-white leading-snug line-clamp-2">
              {article.title}
            </h3>
          </div>
        </motion.div>
      ))
    : PLACEHOLDER_CARDS.map((card, i) => (
        <motion.div
          key={i}
          className={cn(
            "relative flex-shrink-0 w-[280px] md:w-[340px] lg:w-[380px] aspect-[3/4] rounded-2xl overflow-hidden group cursor-pointer shadow-lg shadow-black/10 bg-gradient-to-br",
            card.gradient
          )}
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: EASE_OUT_EXPO, delay: i * 0.08 }}
          whileHover={{ scale: 1.03, y: -8 }}
        >
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-8 right-8 w-32 h-32 border border-white/30 rounded-full" />
            <div className="absolute bottom-12 left-6 w-20 h-20 border border-white/20 rounded-full" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6">
            <span className="inline-block px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider bg-white/15 text-white backdrop-blur-sm mb-3">
              {card.category}
            </span>
            <h3 className="text-base md:text-lg font-semibold text-white leading-snug">
              {card.title}
            </h3>
          </div>
        </motion.div>
      ));

  return (
    <section
      ref={containerRef}
      className="relative h-[250vh] md:h-[300vh]"
      style={{
        background: `linear-gradient(to bottom, ${BRAND.beige} 0%, var(--background, #fff) 8%, var(--background, #fff) 92%, ${BRAND.beige} 100%)`,
      }}
    >
      {/* Pinned content — JS-driven translateY */}
      <div
        ref={contentRef}
        className="absolute top-0 left-0 right-0 h-screen flex flex-col justify-center overflow-hidden will-change-transform"
        style={{
          transform: `translate3d(0, ${pinY}px, 0)`,
          background: `var(--background, #ffffff)`,
        }}
      >
        {/* Header */}
        <div className={cn("max-w-7xl mx-auto w-full flex items-end justify-between mb-8 md:mb-12", containerPadding.lg)}>
          <FadeIn direction="left">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-[#8080FF] font-medium mb-2">
                Keşfedin
              </p>
              <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                Hikayelerimiz
              </h2>
            </div>
          </FadeIn>
          <FadeIn direction="right" delay={0.2}>
            <Link
              href="/"
              className="hidden md:inline-flex items-center gap-2 text-sm font-medium pb-2 text-[#8080FF] hover:opacity-70 transition-opacity"
            >
              Tümünü gör
              <ArrowRight className="h-4 w-4" />
            </Link>
          </FadeIn>
        </div>

        {/* Horizontal track — direct style for zero-lag */}
        <div
          className="flex gap-5 md:gap-7 pl-4 md:pl-8 lg:pl-12 xl:pl-16 will-change-transform"
          style={{ transform: `translate3d(${xPercent}%, 0, 0)` }}
        >
          {cards}
        </div>

        {/* Progress bar */}
        <div className="max-w-7xl mx-auto w-full mt-10 md:mt-14 px-4 md:px-8 lg:px-12 xl:px-16">
          <div className="h-[2px] bg-gray-200/60 dark:bg-gray-700/60 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full origin-left will-change-transform"
              style={{
                transform: `scaleX(${progress})`,
                background: `linear-gradient(90deg, ${BRAND.periwinkle}, #6A6AE0)`,
              }}
            />
          </div>
          <div
            className="flex items-center justify-center gap-2 mt-5 transition-opacity duration-300"
            style={{ opacity: hintOp }}
          >
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <ChevronDown className="h-4 w-4 text-[#8080FF]/50" />
            </motion.div>
            <span className="text-xs text-muted-foreground/50 font-medium tracking-wider uppercase">
              Kaydırarak keşfedin
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

function HorizontalScrollGallery({ articles }: { articles: Article[] }) {
  const shouldReduceMotion = useReducedMotion();
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => { setIsMounted(true); }, []);

  const displayArticles = articles.filter((a) => a.thumbnail || a.image).slice(0, 10);
  const hasRealArticles = displayArticles.length > 0;

  if (shouldReduceMotion || !isMounted) {
    return (
      <section className={cn(colors.background.base, "py-16 md:py-24")}>
        <div className={cn("max-w-7xl mx-auto", containerPadding.lg)}>
          <div className="flex items-baseline justify-between mb-8">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-[#8080FF] font-medium mb-2">Keşfedin</p>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Hikayelerimiz</h2>
            </div>
          </div>
          <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4 -mx-4 px-4 scrollbar-hide">
            {PLACEHOLDER_CARDS.slice(0, 6).map((card, i) => (
              <div
                key={i}
                className={cn("relative flex-shrink-0 w-[260px] md:w-[300px] aspect-[3/4] rounded-2xl overflow-hidden snap-start bg-gradient-to-br", card.gradient)}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <span className="inline-block px-2.5 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider bg-white/15 text-white backdrop-blur-sm mb-2">
                    {card.category}
                  </span>
                  <h3 className="text-base font-semibold text-white leading-snug">{card.title}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return <HorizontalScrollInner displayArticles={displayArticles} hasRealArticles={hasRealArticles} />;
}

/* ═══════════════════════════════════════════════════════════════════════════
   Section 3 — Phone Mockup Scrollytelling
   Phone stays centered, USP steps appear alternating L/R on scroll
   ═══════════════════════════════════════════════════════════════════════════ */

const PHONE_STEPS = [
  {
    icon: Newspaper,
    title: "Premium İçerik",
    description: "Derinlemesine analizler, özel röportajlar ve üyelere özel makaleler. Her gün yeni bir bakış açısı.",
    screen: "article",
  },
  {
    icon: Bell,
    title: "Akıllı Bildirimler",
    description: "Günün öne çıkan haberleri, kişiselleştirilmiş bülten ve anlık bildirimlerle her zaman güncel kalın.",
    screen: "notifications",
  },
  {
    icon: Headphones,
    title: "AI Podcast Özetleri",
    description: "Yapay zekâ ile özetlenmiş sesli haberler. Yolda, sporda veya işte — haberleri dinleyin.",
    screen: "podcast",
  },
  {
    icon: Gift,
    title: "Özel Etkinlikler",
    description: "Gazetecilerle buluşmalar, kapalı webinarlar ve sadece üyelere özel deneyimler.",
    screen: "events",
  },
  {
    icon: Zap,
    title: "Erken Erişim",
    description: "Yeni özelliklere, beta araçlara ve özel projelere herkesten önce erişin.",
    screen: "early",
  },
];

/* Phone screen mockup content */
function PhoneScreen({ activeStep, progress }: { activeStep: number; progress: number }) {
  const screenColors = [
    "from-[#5A5ACD] to-[#8080FF]",
    "from-[#374152] to-[#4B5563]",
    "from-[#6A6AE0] to-[#9999FF]",
    "from-[#059669] to-[#10B981]",
    "from-[#D97706] to-[#F59E0B]",
  ];

  const screenIcons = [Newspaper, Bell, Headphones, Gift, Zap];

  return (
    <div className="relative w-[240px] md:w-[280px] lg:w-[300px] aspect-[9/19.5] mx-auto">
      {/* Phone frame */}
      <div className="absolute inset-0 rounded-[2.5rem] md:rounded-[3rem] bg-[#1a1a1a] shadow-2xl shadow-black/30 p-[3px]">
        <div className="w-full h-full rounded-[2.3rem] md:rounded-[2.8rem] overflow-hidden bg-[#0a0a0a] relative">
          {/* Notch */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[100px] md:w-[120px] h-[28px] md:h-[32px] bg-[#1a1a1a] rounded-b-2xl z-10" />

          {/* Screen content */}
          <div className={cn("absolute inset-0 bg-gradient-to-br transition-all duration-700", screenColors[activeStep] ?? screenColors[0])}>
            {/* Status bar */}
            <div className="pt-10 px-5 flex items-center justify-between">
              <span className="text-[10px] text-white/60 font-medium">09:41</span>
              <div className="flex items-center gap-1">
                <div className="w-3.5 h-2 border border-white/40 rounded-sm">
                  <div className="w-2/3 h-full bg-white/60 rounded-sm" />
                </div>
              </div>
            </div>

            {/* Main content */}
            <div className="flex flex-col items-center justify-center h-full pb-20 px-6">
              {screenIcons.map((Icon, i) => (
                <motion.div
                  key={i}
                  className="absolute flex flex-col items-center gap-4"
                  initial={false}
                  animate={{
                    opacity: activeStep === i ? 1 : 0,
                    scale: activeStep === i ? 1 : 0.8,
                    y: activeStep === i ? 0 : 20,
                  }}
                  transition={{ duration: 0.5, ease: EASE_OUT_EXPO }}
                >
                  <div className="h-16 w-16 md:h-20 md:w-20 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center">
                    <Icon className="h-8 w-8 md:h-10 md:w-10 text-white" />
                  </div>
                  <span className="text-white/90 text-sm md:text-base font-semibold text-center">
                    {PHONE_STEPS[i].title}
                  </span>

                  {/* Decorative dots */}
                  <div className="flex gap-1.5 mt-2">
                    {PHONE_STEPS.map((_, j) => (
                      <div
                        key={j}
                        className={cn(
                          "w-1.5 h-1.5 rounded-full transition-all duration-300",
                          j === activeStep ? "bg-white w-4" : "bg-white/30"
                        )}
                      />
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Home indicator */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-[100px] h-[4px] bg-white/20 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}

function PhoneScrollytelling() {
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const [activeStep, setActiveStep] = useState(0);
  const [pinY, setPinY] = useState(0);
  const [progress, setProgress] = useState(0);

  // JS-driven pinning (same robust technique as horizontal scroll)
  useEffect(() => {
    const section = containerRef.current;
    if (!section) return;

    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const rect = section.getBoundingClientRect();
        const sectionH = section.offsetHeight;
        const viewH = window.innerHeight;
        const runway = sectionH - viewH;

        if (runway <= 0) { ticking = false; return; }

        const scrolled = -rect.top;
        const clamped = Math.max(0, Math.min(scrolled, runway));
        const prog = clamped / runway;

        setPinY(clamped);
        setProgress(prog);

        // Determine active step from progress
        const stepCount = PHONE_STEPS.length;
        const step = Math.min(Math.floor(prog * stepCount), stepCount - 1);
        setActiveStep(step);

        ticking = false;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (shouldReduceMotion) {
    return (
      <section className={cn(colors.background.base, "py-16 md:py-24")}>
        <div className={cn("max-w-5xl mx-auto", containerPadding.lg)}>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Scrolli deneyimi</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {PHONE_STEPS.map((step) => {
              const Icon = step.icon;
              return (
                <div key={step.title} className="flex gap-4">
                  <div className="h-10 w-10 rounded-xl bg-[#8080FF]/10 flex items-center justify-center flex-shrink-0">
                    <Icon className="h-5 w-5 text-[#8080FF]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">{step.title}</h3>
                    <p className={cn(colors.foreground.secondary, "text-sm leading-relaxed")}>{step.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      ref={containerRef}
      className="relative"
      style={{
        height: `${(PHONE_STEPS.length + 1) * 100}vh`,
        background: `linear-gradient(to bottom, var(--background, #fff) 0%, ${BRAND.beige} 15%, ${BRAND.beige} 85%, var(--background, #fff) 100%)`,
      }}
    >
      {/* Pinned viewport */}
      <div
        className="absolute top-0 left-0 right-0 h-screen overflow-hidden will-change-transform"
        style={{ transform: `translate3d(0, ${pinY}px, 0)` }}
      >
        <div className={cn("max-w-6xl mx-auto h-full flex items-center relative", containerPadding.lg)}>
          {/* Phone in center */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
            <PhoneScreen activeStep={activeStep} progress={progress} />
          </div>

          {/* Steps: alternating left/right */}
          {PHONE_STEPS.map((step, i) => {
            const Icon = step.icon;
            const isLeft = i % 2 === 0;
            const isActive = i === activeStep;
            const isPast = i < activeStep;

            return (
              <motion.div
                key={step.title}
                className={cn(
                  "absolute w-[42%] md:w-[35%]",
                  isLeft ? "left-0" : "right-0"
                )}
                style={{ top: "50%", y: "-50%" }}
                initial={false}
                animate={{
                  opacity: isActive ? 1 : isPast ? 0.15 : 0,
                  x: isActive ? 0 : isLeft ? -40 : 40,
                  scale: isActive ? 1 : 0.95,
                }}
                transition={{ duration: 0.6, ease: EASE_OUT_EXPO }}
              >
                <div className={cn("p-6 md:p-8 rounded-2xl", isLeft ? "text-right" : "text-left")}>
                  <div className={cn("flex items-center gap-3 mb-4", isLeft ? "justify-end" : "justify-start")}>
                    <div className={cn(
                      "h-11 w-11 rounded-xl flex items-center justify-center transition-colors duration-500",
                      isActive ? "bg-[#8080FF] text-white" : "bg-[#8080FF]/10 text-[#8080FF]",
                      isLeft && "order-2"
                    )}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="text-xs uppercase tracking-[0.2em] text-[#8080FF] font-semibold">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>

                  <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight mb-3">
                    {step.title}
                  </h3>

                  <p className={cn(colors.foreground.secondary, "text-base md:text-lg leading-relaxed max-w-sm", isLeft && "ml-auto")}>
                    {step.description}
                  </p>

                  {/* Decorative line */}
                  <motion.div
                    className={cn("h-px mt-6", isLeft ? "ml-auto" : "mr-auto")}
                    style={{
                      maxWidth: 80,
                      background: `linear-gradient(${isLeft ? "to left" : "to right"}, ${BRAND.periwinkle}60, transparent)`,
                    }}
                    initial={false}
                    animate={{ scaleX: isActive ? 1 : 0 }}
                    transition={{ duration: 0.8, ease: EASE_OUT_EXPO }}
                  />
                </div>
              </motion.div>
            );
          })}

          {/* Step indicators */}
          <div className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 flex flex-col gap-2 z-20">
            {PHONE_STEPS.map((_, i) => (
              <div
                key={i}
                className={cn(
                  "w-1.5 rounded-full transition-all duration-500",
                  i === activeStep ? "h-6 bg-[#8080FF]" : "h-1.5 bg-[#8080FF]/20"
                )}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   Section 4 — Feature Panels (alternating editorial with parallax)
   ═══════════════════════════════════════════════════════════════════════════ */

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

function FeaturePanel({ feature, index, article }: { feature: (typeof features)[number]; index: number; article?: Article }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });

  const imageY = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["5%", "-5%"]);

  const Icon = feature.icon;
  const isEven = index % 2 === 1;
  const isBeige = index % 2 === 0;
  const imageSrc = article ? (article.thumbnail || article.image) ?? undefined : undefined;

  const gradients = [
    "linear-gradient(135deg, #5A5ACD 0%, #8080FF 100%)",
    "linear-gradient(135deg, #374152 0%, #4B5563 100%)",
    "linear-gradient(135deg, #6A6AE0 0%, #9999FF 100%)",
  ];

  return (
    <div
      ref={ref}
      className={cn("relative overflow-hidden", isBeige ? surfacePairs.brand.beige : colors.background.base)}
    >
      <div className="max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 min-h-[75vh] md:min-h-[85vh]">
          <motion.div className={cn("relative min-h-[50vh] md:min-h-full overflow-hidden", isEven && "md:order-2")} style={{ y: imageY }}>
            {imageSrc ? (
              <Image src={imageSrc} alt={feature.title} fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
            ) : (
              <div className="absolute inset-0" style={{ background: gradients[index] }}>
                <motion.div
                  className="absolute top-1/4 left-1/4 w-48 h-48 md:w-64 md:h-64 border border-white/10 rounded-full"
                  animate={{ scale: [1, 1.1, 1], rotate: [0, 5, 0] }}
                  transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.div
                  className="absolute bottom-1/4 right-1/4 w-32 h-32 md:w-48 md:h-48 border border-white/10 rounded-full"
                  animate={{ scale: [1, 1.15, 1], rotate: [0, -5, 0] }}
                  transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                />
              </div>
            )}
            <motion.span
              className="absolute bottom-4 right-6 md:bottom-8 md:right-10 text-[160px] md:text-[220px] lg:text-[280px] font-bold leading-none select-none pointer-events-none"
              style={{ color: "rgba(255,255,255,0.06)" }}
              initial={{ opacity: 0, x: 40 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 1, ease: EASE_OUT_EXPO, delay: 0.3 }}
            >
              {feature.num}
            </motion.span>
          </motion.div>

          <motion.div className={cn("flex flex-col justify-center px-6 py-20 md:px-12 lg:px-20 xl:px-28", isEven && "md:order-1")} style={{ y: textY }}>
            <motion.div className="flex items-center gap-3 mb-8" initial={{ opacity: 0, x: -20 }} animate={isInView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.6, ease: EASE_OUT_EXPO, delay: 0.1 }}>
              <div className="h-11 w-11 rounded-xl bg-[#8080FF]/10 flex items-center justify-center">
                <Icon className="h-5 w-5 text-[#8080FF]" />
              </div>
              <span className="text-xs uppercase tracking-[0.25em] text-[#8080FF] font-semibold">
                {feature.num} — {feature.subtitle}
              </span>
            </motion.div>

            <motion.h3 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold leading-[1.05] tracking-tight mb-7" initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, ease: EASE_OUT_EXPO, delay: 0.2 }}>
              {feature.title}
            </motion.h3>

            <motion.p className={cn(colors.foreground.secondary, "text-base md:text-lg lg:text-xl leading-relaxed max-w-lg")} initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, ease: EASE_OUT_EXPO, delay: 0.35 }}>
              {feature.description}
            </motion.p>

            <motion.div
              className="mt-10 h-px max-w-[120px]"
              style={{ background: `linear-gradient(to right, ${BRAND.periwinkle}60, transparent)` }}
              initial={{ scaleX: 0 }}
              animate={isInView ? { scaleX: 1 } : {}}
              transition={{ duration: 1, ease: EASE_OUT_EXPO, delay: 0.5 }}
            />
          </motion.div>
        </div>
      </div>

      {index < features.length - 1 && (
        <div
          className="h-20 md:h-24 w-full"
          style={{
            background: isBeige
              ? `linear-gradient(to bottom, ${BRAND.beige}, var(--background, #ffffff))`
              : `linear-gradient(to bottom, var(--background, #ffffff), ${BRAND.beige})`,
          }}
        />
      )}
    </div>
  );
}

function FeaturePanels({ articles }: { articles: Article[] }) {
  return (
    <section className="relative">
      {features.map((feature, i) => {
        const article = articles.filter((a) => a.thumbnail || a.image)[i + 3];
        return <FeaturePanel key={feature.title} feature={feature} index={i} article={article} />;
      })}
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   Section 5 — Testimonial
   ═══════════════════════════════════════════════════════════════════════════ */

function Testimonial() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className={cn(surfacePairs.brand.beige, "relative py-28 md:py-36 lg:py-48 overflow-hidden")}>
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[300px] md:text-[500px] font-serif leading-none select-none pointer-events-none"
        style={{ color: `${BRAND.periwinkle}06` }}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={isInView ? { scale: 1, opacity: 1 } : {}}
        transition={{ duration: 1.5, ease: EASE_OUT_EXPO }}
      >
        &ldquo;
      </motion.div>

      <div className={cn("max-w-4xl mx-auto text-center relative z-10", containerPadding.lg)}>
        <motion.div className="mb-8" initial={{ scale: 0, opacity: 0 }} animate={isInView ? { scale: 1, opacity: 1 } : {}} transition={{ duration: 0.6, ease: EASE_OUT_EXPO }}>
          <div className="mx-auto h-12 w-12 rounded-full bg-[#8080FF]/10 flex items-center justify-center">
            <svg className="h-5 w-5 text-[#8080FF]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
            </svg>
          </div>
        </motion.div>

        <motion.blockquote
          className="font-display italic text-2xl md:text-3xl lg:text-4xl xl:text-5xl leading-[1.3] tracking-tight mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: EASE_OUT_EXPO, delay: 0.15 }}
        >
          Scrolli, Türkiye&rsquo;nin en önemli bağımsız gazetecilik
          platformlarından biri. Premium üyelik, bu misyonu desteklemenin en
          iyi yolu.
        </motion.blockquote>

        <motion.div className="flex flex-col items-center gap-4" initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, ease: EASE_OUT_EXPO, delay: 0.3 }}>
          <div className="relative h-16 w-16 rounded-full overflow-hidden ring-2 ring-[#8080FF]/20 ring-offset-4 ring-offset-[#F8F5E4]">
            <Image src="/assets/images/author-avata-1.jpg" alt="Ayşe Yılmaz" fill className="object-cover" sizes="64px" />
          </div>
          <div>
            <p className={cn(fontWeight.semibold, "text-base md:text-lg")}>Ayşe Yılmaz</p>
            <p className={cn(colors.foreground.muted, "text-sm md:text-base")}>Gazeteci &amp; Yazar</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   Section 6 — Final CTA
   ═══════════════════════════════════════════════════════════════════════════ */

function FinalCTA() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className={cn(colors.background.base, "relative py-28 md:py-36 lg:py-48 overflow-hidden")}>
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] md:w-[800px] md:h-[800px] rounded-full pointer-events-none blur-3xl"
        style={{ background: `radial-gradient(circle, ${BRAND.periwinkle}12 0%, transparent 60%)` }}
      />

      <div className={cn("max-w-4xl mx-auto text-center relative z-10", containerPadding.lg)}>
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={isInView ? { opacity: 1, scale: 1 } : {}} transition={{ duration: 1, ease: EASE_OUT_EXPO }}>
          <h2 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-[1.02] tracking-tight mb-7">
            Bağımsız gazeteciliği destekle
          </h2>
        </motion.div>

        <motion.p
          className={cn(colors.foreground.secondary, "text-lg md:text-xl lg:text-2xl leading-relaxed mb-12 max-w-2xl mx-auto")}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: EASE_OUT_EXPO, delay: 0.15 }}
        >
          Scrolli Premium ile kaliteli, bağımsız habercilik ekosistemine
          destek olun. Her abonelik, özgür gazeteciliğin gücüne güç katar.
        </motion.p>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, ease: EASE_OUT_EXPO, delay: 0.3 }}>
          <Link
            href="/subscribe"
            className="relative inline-flex items-center gap-3 px-10 py-5 text-lg font-medium rounded-full text-white transition-all duration-300 bg-gradient-to-r from-[#374152] to-[#4B5563] hover:from-[#4B5563] hover:to-[#374152] shadow-lg shadow-black/10 hover:shadow-xl hover:shadow-black/15 hover:-translate-y-0.5"
          >
            Scrolli Premium&rsquo;a Katıl
            <ArrowRight className="h-5 w-5" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   Section 7 — Scrolli+ Business
   ═══════════════════════════════════════════════════════════════════════════ */

const businessFeatures = [
  { icon: Building2, title: "Kapalı Analizler", description: "Kurumunuza özel, derinlemesine sektörel analiz raporları." },
  { icon: Users, title: "Özel Buluşmalar", description: "Sektör liderlerinin katıldığı özel etkinlikler ve webinarlar." },
  { icon: Mail, title: "Kurumsal Erişim", description: "Ekibiniz için sınırsız premium içerik erişimi." },
];

function ScrolliBusiness() {
  return (
    <section className={cn(surfacePairs.brand.beige, "relative py-24 md:py-32 lg:py-40 overflow-hidden")}>
      <FloatingOrb className="top-20 right-[10%]" size={250} delay={1} />

      <div className={cn("max-w-7xl mx-auto relative z-10", containerPadding.lg)}>
        <FadeIn>
          <div className="text-center mb-16 md:mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#8080FF]/10 mb-6">
              <Building2 className="h-3.5 w-3.5 text-[#8080FF]" />
              <span className="text-sm uppercase tracking-[0.2em] text-[#8080FF] font-medium">Kurumsal</span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight tracking-tight">
              Scrolli+ Business
            </h2>
          </div>
        </FadeIn>

        <div className={cn("grid grid-cols-1 md:grid-cols-3", gap.xl)}>
          {businessFeatures.map((feat, i) => {
            const Icon = feat.icon;
            return (
              <ScaleIn key={feat.title} delay={i * 0.1}>
                <div className="group text-center p-8 md:p-10 rounded-3xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-[#8080FF]/5 hover:border-[#8080FF]/15 transition-all duration-500 hover:shadow-lg hover:shadow-[#8080FF]/5 hover:-translate-y-1">
                  <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-gradient-to-br from-[#8080FF]/15 to-[#6A6AE0]/10 mb-6 group-hover:scale-110 transition-transform duration-500">
                    <Icon className="h-7 w-7 text-[#8080FF]" />
                  </div>
                  <h3 className={cn(fontWeight.semibold, "text-xl md:text-2xl mb-4")}>{feat.title}</h3>
                  <p className={cn(colors.foreground.secondary, "text-base md:text-lg leading-relaxed max-w-xs mx-auto")}>{feat.description}</p>
                </div>
              </ScaleIn>
            );
          })}
        </div>

        <FadeIn delay={0.3}>
          <div className="text-center mt-14 md:mt-16">
            <a
              href="mailto:info@scrolli.co"
              className="relative inline-flex items-center gap-3 px-10 py-5 text-lg font-medium rounded-full text-white transition-all duration-300 bg-gradient-to-r from-[#374152] to-[#4B5563] hover:from-[#4B5563] hover:to-[#374152] shadow-lg shadow-black/10 hover:shadow-xl hover:shadow-black/15 hover:-translate-y-0.5"
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

/* ═══════════════════════════════════════════════════════════════════════════
   Section 8 — Corporate CTA
   ═══════════════════════════════════════════════════════════════════════════ */

function CorporateCTA() {
  return (
    <section className={cn(colors.background.base, "py-16 md:py-20 border-t", colors.border.light)}>
      <div className={cn("max-w-3xl mx-auto text-center", containerPadding.lg)}>
        <FadeIn>
          <h3 className="text-xl md:text-2xl font-semibold leading-tight tracking-tight mb-4">
            Kurumsal abonelik mi arıyorsunuz?
          </h3>
          <a href="mailto:info@scrolli.co" className="inline-flex items-center gap-2 text-base text-[#8080FF] hover:opacity-70 transition-opacity font-medium">
            Bize ulaşın
            <ArrowRight className="h-4 w-4" />
          </a>
        </FadeIn>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   Main export
   ═══════════════════════════════════════════════════════════════════════════ */

export default function PricingSections({ articles }: { articles: Article[] }) {
  return (
    <>
      <EditorialStatement />
      <SectionDivider from="beige" to="white" />
      <HorizontalScrollGallery articles={articles} />
      <PhoneScrollytelling />
      <SectionDivider from="white" to="beige" />
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
