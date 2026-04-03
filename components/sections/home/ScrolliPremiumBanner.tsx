"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import {
  sectionPadding,
  componentPadding,
} from "@/lib/design-tokens";
import { Heading, Text } from "@/components/ui/typography";
import { SmartButton } from "@/components/ui/smart-button";
import { Badge } from "@/components/ui/badge";
import { Container } from "@/components/responsive";
import {
  ArrowRightIcon,
  CheckIcon,
} from "@/components/icons/scrolli-icons";
import { FileText, Sparkles, Headphones, Mail } from "lucide-react";



interface Journalist {
  name: string;
  title: string;
  photo: string;
  quote: string;
}

interface ExclusiveStory {
  title: string;
  excerpt: string;
  category: string;
}

const journalists: Journalist[] = [
  {
    name: "Sarah Chen",
    title: "Investigative Reporter",
    photo: "/assets/images/author-avata-1.jpg",
    quote: "Your support allows me to spend months investigating corruption.",
  },
  {
    name: "Marcus Johnson",
    title: "Political Correspondent",
    photo: "/assets/images/author-avata-2.jpg",
    quote: "Independent funding means I can expose what's really happening.",
  },
  {
    name: "Elena Rodriguez",
    title: "Climate Journalist",
    photo: "/assets/images/author-avata-3.jpg",
    quote: "You help us report from communities that mainstream media ignores.",
  },
];

const exclusiveStory: ExclusiveStory = {
  title: "The Hidden Network: How Dark Money Flows Through Local Politics",
  excerpt: "A six-month investigation reveals how anonymous donors influence city council decisions across 12 states...",
  category: "Deep Dive",
};

export default function ScrolliPremiumBanner({ 
  embedded = false, 
  containerSize = "lg", 
  includeSection = false,
  variant = "default"
}: { 
  embedded?: boolean; 
  containerSize?: "sm" | "md" | "lg" | "xl" | "full"; 
  includeSection?: boolean;
  variant?: "default" | "simple";
}) {
  const [currentJournalist, setCurrentJournalist] = useState<Journalist>(journalists[0]);
  const [isHovered, setIsHovered] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { theme, resolvedTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
    const randomIndex = Math.floor(Math.random() * journalists.length);
    setCurrentJournalist(journalists[randomIndex]);
  }, []);

  const isDark = mounted && (theme === 'dark' || resolvedTheme === 'dark');

  // Removed null check to prevent hydration mismatch/DOM removal errors
  // if (!currentJournalist) return null;

  const isSimple = variant === "simple";

  const content = (
    <div className={cn(
      "grid grid-cols-1 overflow-hidden rounded-2xl border",
      embedded || isSimple ? "gap-0" : "lg:grid-cols-12",
      "border-gray-200/50 dark:border-gray-700/50",
      "shadow-2xl hover:shadow-[0_25px_60px_-12px_rgba(0,0,0,0.25)] transition-shadow duration-300",
      "bg-gray-100/60 dark:bg-gray-900/60 backdrop-blur-md"
    )}>

      {/* Left Column: The Manifesto */}
      <div
        className={cn(
          cn(componentPadding.lg, "flex flex-col justify-between relative"),
          isSimple ? "col-span-1 items-center text-center" : (embedded ? "col-span-1" : "lg:col-span-7"),
          !isSimple && "border-b lg:border-b-0 lg:border-r border-gray-200 dark:border-gray-700",
          embedded && !isSimple && "border-r-0 border-b",
          // Transparent background with subtle tint
          "bg-transparent"
        )}
      >
        {/* Single depth gradient — replaces stacked noise + gradient layers */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent dark:from-white/5 pointer-events-none" />

        <div className={cn("relative z-10 w-full", isSimple && "max-w-2xl flex flex-col items-center")}>
          <div className={cn("mb-3", isSimple && "flex justify-center")}>
            <Image
              src={isDark ? "/assets/images/plus/scrolli-plus-dark.svg" : "/assets/images/plus/scrolli-plus-light.svg"}
              alt="Scrolli Plus"
              width={isSimple ? 44 : 72}
              height={isSimple ? 12 : 20}
              className={cn("w-auto opacity-90", isSimple ? "h-3" : "h-5")}
              priority
            />
          </div>
          <div className={cn("mb-6", isSimple && "text-center")}>
            <Text variant="caption" as="span" className="tracking-wider font-medium text-gray-500 dark:text-gray-400 m-0">
              Bağımsız Gazeteciliği Destekle
            </Text>
          </div>

          <Heading
            level={2}
            variant={isSimple ? "h3" : "h2"}
            className={cn("tracking-tight mb-6 leading-[1.15]", isSimple && "text-2xl md:text-3xl")}
          >
            Daha az son dakika. <br />
            <span className="text-gray-500 dark:text-gray-400">Daha çok çığır açan hikâyeler.</span>
          </Heading>

          <div className={cn("flex flex-wrap gap-2 mb-8", isSimple && "justify-center")}>
            <Badge variant="secondary" className="leading-none bg-gray-200/50 text-gray-600 dark:bg-gray-700/50 dark:text-gray-300 border-none pl-2 pr-3 py-1.5 h-auto shadow-sm gap-1.5">
              <FileText size={14} className="text-gray-500 dark:text-gray-400 shrink-0" />
              Premium Makaleler
            </Badge>
            <Badge variant="secondary" className="leading-none bg-gray-200/50 text-gray-600 dark:bg-gray-700/50 dark:text-gray-300 border-none pl-2 pr-3 py-1.5 h-auto shadow-sm gap-1.5">
              <Sparkles size={14} className="text-gray-500 dark:text-gray-400 shrink-0" />
              Günlük Bülten
            </Badge>
            <Badge variant="secondary" className="leading-none bg-gray-200/50 text-gray-600 dark:bg-gray-700/50 dark:text-gray-300 border-none pl-2 pr-3 py-1.5 h-auto shadow-sm gap-1.5">
              <Headphones size={14} className="text-gray-500 dark:text-gray-400 shrink-0" />
              AI Podcastler
            </Badge>
            <Badge variant="secondary" className="leading-none bg-gray-200/50 text-gray-600 dark:bg-gray-700/50 dark:text-gray-300 border-none pl-2 pr-3 py-1.5 h-auto shadow-sm gap-1.5">
              <Mail size={14} className="text-gray-500 dark:text-gray-400 shrink-0" />
              Premium Bültenler
            </Badge>
          </div>

          {/* Journalist Spotlight - Moved & Compacted */}
          <div className={cn("mb-6 w-full", isSimple && "max-w-md")}>
            <div className={cn(
              "p-4 rounded-xl flex items-center gap-4",
              // Improved transparency for glassy effect
              "bg-white/40 dark:bg-gray-800/40",
              "border border-gray-200/60 dark:border-gray-600/50",
              "backdrop-blur-md",
              isSimple && "text-left"
            )}>
              <div className="relative w-12 h-12 rounded-full overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm flex-shrink-0">
                <Image
                  src={currentJournalist.photo}
                  alt={currentJournalist.name}
                  fill
                  className="object-cover object-center"
                  sizes="48px"
                />
              </div>
              <div className="flex-1 min-w-0">
                <Text as="div" className="font-serif text-xs italic text-gray-800 dark:text-gray-200 leading-snug mb-1">
                  "{currentJournalist.quote}"
                </Text>
                <div className="flex items-center gap-2">
                  <Text variant="caption" as="span" className="font-bold text-gray-900 dark:text-gray-100 text-xs">
                    {currentJournalist.name}
                  </Text>
                  <span className="text-gray-300 dark:text-gray-600 text-[10px]">•</span>
                  <Text variant="caption" as="span" className="text-gray-500 dark:text-gray-400 tracking-wide text-[10px] capitalize">
                    {currentJournalist.title.toLowerCase()}
                  </Text>
                </div>
              </div>
            </div>
          </div>

          <div className={cn("relative z-10 flex flex-col sm:flex-row gap-4 items-start sm:items-center mt-auto pt-6", isSimple && "items-center justify-center")}>
            <Link href="/pricing" className="w-full sm:w-auto no-underline">
              <SmartButton
                forceVariant="brand-charcoal"
                size="lg"
                className="w-full sm:w-auto h-12 px-8 text-base shadow-lg hover:shadow-xl transition-all duration-300"
                style={{ color: 'white' }}
              >
                Abone Ol — ₺249/ay
                <ArrowRightIcon size={18} className="ml-2" />
              </SmartButton>
            </Link>
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300 text-sm font-medium px-2">
              <div className="w-5 h-5 rounded-full bg-[#E3E5FF] dark:bg-[#E3E5FF]/20 flex items-center justify-center text-[#8080FF]">
                <CheckIcon size={12} strokeWidth={3} />
              </div>
              <span>İstediğin zaman iptal et</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: The Evidence */}
      {!isSimple && (
        <div className={cn(
          "h-full flex flex-col",
          embedded ? "col-span-1" : "lg:col-span-5"
        )}>

          {/* Impact Breakdown - Moved & Compacted */}
          <div
            className={cn(
              "p-5 md:p-6",
              "border-b lg:border-l border-gray-200 dark:border-gray-700",
              "backdrop-blur-sm",
              embedded && "border-l-0",
              // Transparent background
              "bg-transparent"
            )}
          >
            <div className="flex items-center justify-between mb-3">
              <Text variant="caption" as="span" className="tracking-wider font-bold text-gray-500 dark:text-gray-400 text-[10px]">
                Aboneliğiniz nasıl kullanılıyor
              </Text>
              <Badge variant="secondary" className="bg-green-100/50 text-green-700 dark:bg-green-900/20 dark:text-green-300 border-none">
                Doğrulanmış
              </Badge>
            </div>

            <div className="flex w-full h-2 rounded-full overflow-hidden mb-3 gap-[1px]">
              <div className="h-full bg-gray-900 dark:bg-gray-100 w-[60%]" />
              <div className="h-full bg-gray-500 dark:bg-gray-500 w-[30%]" />
              <div className="h-full bg-gray-300 dark:bg-gray-600 w-[10%]" />
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-900 dark:bg-gray-100" />
                  <span className="text-sm font-bold text-gray-900 dark:text-gray-100">60%</span>
                </div>
                <span className="text-[10px] text-gray-500 dark:text-gray-400 font-medium tracking-wide">Gazeteciler</span>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-500 dark:bg-gray-500" />
                  <span className="text-sm font-bold text-gray-900 dark:text-gray-100">30%</span>
                </div>
                <span className="text-[10px] text-gray-500 dark:text-gray-400 font-medium tracking-wide">Soruşturmalar</span>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-300 dark:bg-gray-600" />
                  <span className="text-sm font-bold text-gray-900 dark:text-gray-100">10%</span>
                </div>
                <span className="text-[10px] text-gray-500 dark:text-gray-400 font-medium tracking-wide">Platform</span>
              </div>
            </div>
          </div>

          {/* Locked Story Preview - Takes remaining height */}
          <Link href="/pricing" className="block flex-1 group no-underline text-gray-900 dark:text-gray-100" style={{ textDecoration: 'none' }}>
            <div
              className={cn(
                "h-full p-8 md:p-10 relative overflow-hidden flex flex-col justify-center",
                "bg-gray-200/40 dark:bg-gray-800/40 backdrop-blur-sm",
                "transition-all duration-300 hover:bg-gray-200/60 dark:hover:bg-gray-800/60",
                "border-l border-gray-200 dark:border-gray-700",
                embedded && "border-l-0"
              )}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <div className="relative z-10">
                <Badge
                  variant="secondary"
                  className="mb-4 bg-gray-200/50 text-gray-600 dark:bg-gray-700/50 dark:text-gray-300 border-none"
                >
                  Özel Önizleme
                </Badge>

                <Heading level={3} className="text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4 transition-colors pr-8">
                  {exclusiveStory.title}
                </Heading>

              <div className="relative">
                <Text as="div" className={cn(
                  "text-gray-600 dark:text-gray-400 text-base leading-relaxed font-serif",
                  "transition-all duration-500",
                  isHovered ? "blur-[3px] opacity-60" : "blur-[0.5px]"
                )}>
                  {exclusiveStory.excerpt} ... The investigation uncovers a complex web of shell companies and offshore accounts used to funnel money into local elections.
                </Text>

                  <div className={cn(
                    "absolute inset-0 flex items-center justify-center opacity-0 transform translate-y-4 transition-all duration-300 delay-75",
                    isHovered && "opacity-100 translate-y-0"
                  )}>
                    <SmartButton
                      forceVariant="brand-charcoal"
                      size="sm"
                      className="rounded-full px-5 py-2.5 shadow-lg flex items-center gap-2 transform scale-105"
                      style={{ color: 'white' }}
                    >
                      <span>Hikâyeyi Aç</span> <ArrowRightIcon size={14} />
                    </SmartButton>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </div>
      )}
    </div>
  );

  if (embedded) {
    return (
      <div className="my-8">
        {content}
      </div>
    );
  }

  const containerContent = (
    <Container size={isSimple ? "sm" : containerSize}>
      {content}
    </Container>
  );

  if (includeSection) {
    return (
      <section className={sectionPadding.md}>
        {containerContent}
      </section>
    );
  }

  return containerContent;
}

