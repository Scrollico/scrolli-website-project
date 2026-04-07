"use client";

import { useRef, ReactNode, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  useInView,
} from "framer-motion";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/typography/Heading";
import { Text } from "@/components/ui/typography/Text";
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
  Newspaper,
  Bell,
  Gift,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/components/providers/translation-provider";
import { Article } from "@/types/content";
import {
  border,
  borderRadius,
  colors,
  componentPadding,
  containerPadding,
  elevation,
  fontWeight,
  gap,
  lineHeight,
  marginBottom,
  marginTop,
  sectionPadding,
  surfacePairs,
  typography,
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
  const { t } = useTranslation();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0.7, 1], [1, 0]);

  const words = t("pricing.headline").split(" ");

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
              {t("pricing.badge")}
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
            {t("pricing.subheadline")}
          </p>
        </FadeIn>

        <FadeIn delay={0.7}>
          <div className="flex items-center justify-center gap-8 md:gap-16 mt-14">
            {[
              { value: 250, suffix: "+", label: t("pricing.statArticles") },
              { value: 50, suffix: "K+", label: t("pricing.statReaders") },
              { value: 12, suffix: "+", label: t("pricing.statJournalists") },
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
            {t("pricing.startExploring")}
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
   Section 2 — Üç metin mockup paneli (yatay scroll yok, görselsiz)
   ═══════════════════════════════════════════════════════════════════════════ */

function StoriesMoreSpaceSection() {
  const { t } = useTranslation();
  const panels = [
    { headline: t("pricing.moreSpaceDiscovery"), body: t("pricing.moreSpaceDiscoveryBody") },
    { headline: t("pricing.moreSpaceThinking"), body: t("pricing.moreSpaceThinkingBody") },
    { headline: t("pricing.moreSpaceSatisfaction"), body: t("pricing.moreSpaceSatisfactionBody") },
  ];
  return (
    <section
      className={cn(sectionPadding.lg, colors.background.base)}
      style={{
        background: `linear-gradient(to bottom, ${BRAND.beige} 0%, var(--background, #fff) 10%, var(--background, #fff) 90%, ${BRAND.beige} 100%)`,
      }}
    >
      <div className={cn("grid grid-cols-1 md:grid-cols-3", gap.lg)}>
        {panels.map((panel, i) => (
          <FadeIn key={i} direction="up" delay={0.08 * i}>
            <div
              className={cn(
                "flex flex-col min-h-[280px] md:min-h-0 md:aspect-square",
                borderRadius["2xl"],
                border.thin,
                colors.background.elevated,
                elevation[1],
                componentPadding.lg
              )}
            >
              <p className={cn(typography.h4, colors.foreground.primary, marginBottom.sm)}>
                {panel.headline}
              </p>
              <p className={cn(typography.bodySmall, colors.foreground.secondary, lineHeight.relaxed)}>
                {panel.body}
              </p>
              <div className={cn("mt-auto flex flex-col", gap.sm, marginTop.lg)}>
                <div
                  className={cn("h-2 w-full", borderRadius.full, colors.background.base, "opacity-60")}
                  aria-hidden
                />
                <div
                  className={cn("h-2 w-4/5", borderRadius.full, colors.background.base, "opacity-40")}
                  aria-hidden
                />
              </div>
            </div>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}

function HorizontalScrollGallery({ articles: _articles }: { articles: Article[] }) {
  return <StoriesMoreSpaceSection />;
}

/* ═══════════════════════════════════════════════════════════════════════════
   Section 3 — Phone Mockup Scrollytelling
   Phone stays centered, USP steps appear alternating L/R on scroll
   ═══════════════════════════════════════════════════════════════════════════ */

/** Pricing phone scrollytelling: exactly 4 steps, one viewport-height scroll per step */

const PHONE_STEP_GRADIENTS = [
  "from-[#5A5ACD] to-[#8080FF]",
  "from-[#374152] to-[#4B5563]",
  "from-[#6A6AE0] to-[#9999FF]",
  "from-[#059669] to-[#10B981]",
] as const;

type PhoneStep = {
  icon: typeof Newspaper;
  title: string;
  description: string;
  screen: string;
};

/* Phone screen mockup content */
function PhoneScreen({ activeStep, progress: _progress, steps }: { activeStep: number; progress: number; steps: PhoneStep[] }) {
  return (
    <div className="relative w-[240px] md:w-[280px] lg:w-[300px] aspect-[9/19.5] mx-auto">
      {/* Phone frame */}
      <div className="absolute inset-0 rounded-[2.5rem] md:rounded-[3rem] bg-[#1a1a1a] shadow-2xl shadow-black/30 p-[3px]">
        <div className="w-full h-full rounded-[2.3rem] md:rounded-[2.8rem] overflow-hidden bg-[#0a0a0a] relative">
          {/* Notch */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[100px] md:w-[120px] h-[28px] md:h-[32px] bg-[#1a1a1a] rounded-b-2xl z-10" />

          {/* Screen content */}
          <div
            className={cn(
              "absolute inset-0 bg-gradient-to-br transition-all duration-700",
              PHONE_STEP_GRADIENTS[activeStep] ?? PHONE_STEP_GRADIENTS[0]
            )}
          >
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
              {steps.map((step, i) => {
                const Icon = step.icon;
                return (
                  <motion.div
                    key={step.title}
                    className="absolute flex flex-col items-center gap-4"
                    initial={false}
                    animate={{
                      opacity: activeStep === i ? 1 : 0,
                      scale: activeStep === i ? 1 : 0.92,
                    }}
                    transition={{ duration: 0.35, ease: EASE_OUT_EXPO }}
                    style={{ pointerEvents: activeStep === i ? "auto" : "none" }}
                  >
                    <div className="h-16 w-16 md:h-20 md:w-20 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center">
                      <Icon className="h-8 w-8 md:h-10 md:w-10 text-white" />
                    </div>
                    <span className="text-white/90 text-sm md:text-base font-semibold text-center">
                      {step.title}
                    </span>

                    <div className="flex gap-1.5 mt-2">
                      {steps.map((_, j) => (
                        <div
                          key={j}
                          className={cn(
                            "h-1.5 rounded-full transition-all duration-300",
                            j === activeStep ? "bg-white w-4" : "w-1.5 bg-white/30"
                          )}
                        />
                      ))}
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Home indicator */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-[100px] h-[4px] bg-white/20 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}

type PhonePinPhase = "before" | "pinned" | "after";

function PhoneScrollytelling() {
  const { t } = useTranslation();
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const [activeStep, setActiveStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [pinPhase, setPinPhase] = useState<PhonePinPhase>("before");

  const phoneSteps: PhoneStep[] = [
    {
      icon: Newspaper,
      title: t("pricing.phonePremiumContent"),
      description: t("pricing.phonePremiumContentDesc"),
      screen: "article",
    },
    {
      icon: Bell,
      title: t("pricing.phoneSmartNotifications"),
      description: t("pricing.phoneSmartNotificationsDesc"),
      screen: "notifications",
    },
    {
      icon: Headphones,
      title: t("pricing.phoneAiPodcasts"),
      description: t("pricing.phoneAiPodcastsDesc"),
      screen: "podcast",
    },
    {
      icon: Gift,
      title: t("pricing.phoneExclusiveEvents"),
      description: t("pricing.phoneExclusiveEventsDesc"),
      screen: "events",
    },
  ];

  /**
   * One full viewport scroll (~100vh) advances one step. Phone mock stays visually fixed
   * via position:fixed while the tall section scrolls behind it.
   */
  useEffect(() => {
    const section = containerRef.current;
    if (!section) return;

    let ticking = false;
    const stepCount = phoneSteps.length;

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const rect = section.getBoundingClientRect();
        const sectionH = section.offsetHeight;
        const viewH = window.innerHeight;
        const runway = sectionH - viewH;

        if (runway <= 0) {
          ticking = false;
          return;
        }

        // Decide whether we're before, inside, or after the pinned runway
        let nextPhase: PhonePinPhase;
        if (rect.top > 0) {
          nextPhase = "before";
        } else if (rect.bottom <= viewH + 0.5) {
          nextPhase = "after";
        } else {
          nextPhase = "pinned";
        }
        setPinPhase((prev) => (prev === nextPhase ? prev : nextPhase));

        const scrolled = -rect.top;
        const clamped = Math.max(0, Math.min(scrolled, runway));
        const prog = clamped / runway;

        // Discrete steps: each ~1 viewport of travel inside the runway advances 0→1→2→3
        const step = Math.min(Math.floor(clamped / viewH), stepCount - 1);

        setActiveStep(step);
        setProgress(prog);
        ticking = false;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  if (shouldReduceMotion) {
    return (
      <section className={cn(colors.background.base, "py-16 md:py-24")}>
        <div className={cn("max-w-5xl mx-auto", containerPadding.lg)}>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">{t("pricing.scrolliExperience")}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {phoneSteps.map((step) => {
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

  const phoneStageBg = `linear-gradient(to bottom, var(--background, #fff) 0%, ${BRAND.beige} 15%, ${BRAND.beige} 85%, var(--background, #fff) 100%)`;

  return (
    <section
      ref={containerRef}
      className="relative isolate"
      style={{
        height: `${(phoneSteps.length + 1) * 100}vh`,
        background: phoneStageBg,
      }}
    >
      <div
        className={cn(
          "h-screen w-full overflow-hidden",
          pinPhase === "before" && "relative",
          pinPhase === "pinned" && "fixed inset-x-0 top-0 z-[35]",
          pinPhase === "after" && "absolute bottom-0 left-0 right-0"
        )}
        style={{ background: phoneStageBg }}
      >
        <div
          className={cn(
            "relative mx-auto h-full max-w-6xl",
            containerPadding.lg
          )}
        >
          {/* Phone: centered with layout, not FramerMotion y — pixel-stable between steps */}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div className="relative z-10">
              <PhoneScreen activeStep={activeStep} progress={progress} steps={phoneSteps} />
            </div>
          </div>

          {/* Steps: alternating left/right, only one fully visible at a time */}
          {phoneSteps.map((step, i) => {
            const Icon = step.icon;
            const isLeft = i % 2 === 0;
            const isActive = i === activeStep;

            return (
              <motion.div
                key={step.title}
                className={cn(
                  "pointer-events-none absolute top-1/2 w-[42%] md:w-[35%]",
                  isLeft ? "left-0" : "right-0"
                )}
                initial={false}
                animate={{
                  opacity: isActive ? 1 : 0,
                  x: isActive ? 0 : isLeft ? -20 : 20,
                  y: "-50%",
                }}
                transition={{ duration: 0.45, ease: EASE_OUT_EXPO }}
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
            {phoneSteps.map((_, i) => (
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

/* features array is defined inside FeaturePanels to access t() */

type FeatureItem = {
  num: string;
  icon: typeof Crown;
  title: string;
  subtitle: string;
  description: string;
};

function FeaturePanel({ feature, index, article, isLast }: { feature: FeatureItem; index: number; article?: Article; isLast?: boolean }) {
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

      {!isLast && (
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
  const { t } = useTranslation();
  const features: FeatureItem[] = [
    {
      num: "01",
      icon: Crown,
      title: t("pricing.featurePremiumArticles"),
      subtitle: t("pricing.featurePremiumSubtitle"),
      description: t("pricing.featurePremiumDesc"),
    },
    {
      num: "02",
      icon: Headphones,
      title: t("pricing.featureDailyBulletin"),
      subtitle: t("pricing.featureDailySubtitle"),
      description: t("pricing.featureDailyDesc"),
    },
    {
      num: "03",
      icon: CalendarHeart,
      title: t("pricing.featureExclusiveEvents"),
      subtitle: t("pricing.featureExclusiveSubtitle"),
      description: t("pricing.featureExclusiveDesc"),
    },
  ];

  return (
    <section className="relative">
      {features.map((feature, i) => {
        const article = articles.filter((a) => a.thumbnail || a.image)[i + 3];
        return <FeaturePanel key={feature.title} feature={feature} index={i} article={article} isLast={i === features.length - 1} />;
      })}
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   Section 5 — Testimonial
   ═══════════════════════════════════════════════════════════════════════════ */

type TestimonialItem = {
  quote: string;
  name: string;
  role: string;
  avatar?: string;
};

function Testimonial() {
  const { t } = useTranslation();
  const testimonials: TestimonialItem[] = [
    {
      quote: t("pricing.testimonial1Quote"),
      name: t("pricing.testimonial1Name"),
      role: t("pricing.testimonial1Role"),
      avatar: "/assets/images/author-avata-1.jpg",
    },
    {
      quote: t("pricing.testimonial2Quote"),
      name: t("pricing.testimonial2Name"),
      role: t("pricing.testimonial2Role"),
    },
    {
      quote: t("pricing.testimonial3Quote"),
      name: t("pricing.testimonial3Name"),
      role: t("pricing.testimonial3Role"),
    },
    {
      quote: t("pricing.testimonial4Quote"),
      name: t("pricing.testimonial4Name"),
      role: t("pricing.testimonial4Role"),
    },
  ];
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [activeIndex, setActiveIndex] = useState(0);
  const [slideCount, setSlideCount] = useState(0);

  useEffect(() => {
    if (!carouselApi) return;

    const update = () => {
      setActiveIndex(carouselApi.selectedScrollSnap());
      setSlideCount(carouselApi.scrollSnapList().length);
    };

    update();
    carouselApi.on("select", update);
    carouselApi.on("reInit", update);
    return () => {
      carouselApi.off("select", update);
      carouselApi.off("reInit", update);
    };
  }, [carouselApi]);

  return (
    <section ref={ref} className={cn(surfacePairs.brand.beige, sectionPadding["2xl"], "relative overflow-hidden")}>
      <div className={cn("max-w-7xl mx-auto relative z-10", containerPadding.lg)}>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: EASE_OUT_EXPO }}
        >
          <Carousel
            setApi={setCarouselApi}
            opts={{ align: "start", loop: true }}
            className="w-full"
          >
            <CarouselContent className="-ml-6">
              {testimonials.map((item) => (
                <CarouselItem
                  key={item.name}
                  className="pl-6 md:basis-1/2"
                >
                  <article
                    className={cn(
                      "h-full",
                      componentPadding.md
                    )}
                  >
                    <svg
                      className={cn(
                        "h-5 w-5 mb-5",
                        colors.foreground.muted
                      )}
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden
                    >
                      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                    </svg>

                    <p className={cn(typography.bodyLarge, colors.foreground.primary, lineHeight.relaxed, marginBottom.lg)}>
                      {item.quote}
                    </p>

                    <div className={cn("h-px w-full", colors.border.light, marginBottom.sm)} />

                    <div className={cn("flex items-baseline justify-between", gap.sm)}>
                      <span className={cn(fontWeight.semibold, typography.bodySmall, colors.foreground.primary)}>
                        {item.name}
                      </span>
                      <span className={cn(typography.caption, colors.foreground.muted)}>
                        {item.role}
                      </span>
                    </div>
                  </article>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>

          {/* Dots (minimal, common pattern) */}
          {slideCount > 1 && (
            <div className={cn("mt-8 flex items-center justify-center", gap.sm)}>
              {Array.from({ length: slideCount }).map((_, i) => (
                <button
                  key={i}
                  type="button"
                  className={cn(
                    "h-2 w-2 transition-opacity",
                    borderRadius.full,
                    i === activeIndex ? "opacity-100" : "opacity-30",
                    "bg-current",
                    colors.foreground.primary
                  )}
                  aria-label={`Yorum ${i + 1}`}
                  aria-current={i === activeIndex ? "true" : undefined}
                  onClick={() => carouselApi?.scrollTo(i)}
                />
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   Section 6 — Final CTA
   ═══════════════════════════════════════════════════════════════════════════ */

function FinalCTA() {
  const { t } = useTranslation();
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className={cn(colors.background.base, sectionPadding["2xl"], "relative overflow-hidden")}>
      <div
        className={cn(
          "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none blur-3xl",
          borderRadius.full
        )}
        style={{ background: `radial-gradient(circle, ${BRAND.periwinkle}12 0%, transparent 60%)` }}
      />

      <div className={cn("max-w-4xl mx-auto text-center relative z-10", containerPadding.lg)}>
        <motion.div
          className={cn("mx-auto flex max-w-3xl flex-col items-center", gap.lg)}
          initial={{ opacity: 0, y: 18 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: EASE_OUT_EXPO }}
        >
          <Heading level={2} variant="h2" className={cn("text-balance", colors.foreground.primary)}>
            {t("pricing.ctaHeadline")}
          </Heading>

          <Text
            variant="bodyLarge"
            color="secondary"
            className={cn("max-w-2xl text-balance", lineHeight.relaxed)}
          >
            {t("pricing.ctaBody")}
          </Text>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: EASE_OUT_EXPO, delay: 0.12 }}
          >
            <Button asChild size="lg" variant="brand-charcoal" className={cn("gap-2", borderRadius.full)}>
              <Link href="/subscribe">
                {t("pricing.ctaButton")}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   Section 7 — Scrolli+ Business
   ═══════════════════════════════════════════════════════════════════════════ */

function ScrolliBusiness() {
  const { t } = useTranslation();
  const businessFeatures = [
    { icon: Building2, title: t("pricing.businessAnalytics"), description: t("pricing.businessAnalyticsDesc") },
    { icon: Users, title: t("pricing.businessMeetings"), description: t("pricing.businessMeetingsDesc") },
    { icon: Mail, title: t("pricing.businessAccess"), description: t("pricing.businessAccessDesc") },
  ];
  return (
    <section className={cn(surfacePairs.brand.beige, "relative py-24 md:py-32 lg:py-40 overflow-hidden")}>
      <FloatingOrb className="top-20 right-[10%]" size={250} delay={1} />

      <div className={cn("max-w-7xl mx-auto relative z-10", containerPadding.lg)}>
        <FadeIn>
          <div className="text-center mb-16 md:mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#8080FF]/10 mb-6">
              <Building2 className="h-3.5 w-3.5 text-[#8080FF]" />
              <span className="text-sm uppercase tracking-[0.2em] text-[#8080FF] font-medium">{t("pricing.businessBadge")}</span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight tracking-tight">
              {t("pricing.businessTitle")}
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
              {t("pricing.businessContactUs")}
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
  const { t } = useTranslation();
  return (
    <section className={cn(colors.background.base, "py-16 md:py-20 border-t", colors.border.light)}>
      <div className={cn("max-w-3xl mx-auto text-center", containerPadding.lg)}>
        <FadeIn>
          <h3 className="text-xl md:text-2xl font-semibold leading-tight tracking-tight mb-4">
            {t("pricing.corporateQuestion")}
          </h3>
          <a href="mailto:info@scrolli.co" className="inline-flex items-center gap-2 text-base text-[#8080FF] hover:opacity-70 transition-opacity font-medium">
            {t("pricing.corporateContactUs")}
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
