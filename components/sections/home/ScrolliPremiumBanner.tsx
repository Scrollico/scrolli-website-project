"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import {
  sectionPadding,
  colors,
} from "@/lib/design-tokens";
import { Heading, Text } from "@/components/ui/typography";
import { SmartButton } from "@/components/ui/smart-button";
import { Badge } from "@/components/ui/badge";
import { Container } from "@/components/responsive";
import { 
  ArrowRightIcon, 
  CheckIcon,
  PremiumContentBadgeIcon,
  AIIcon,
  PodcastIcon,
  NewsletterIcon
} from "@/components/icons/ScrolliIcons";

// Fallback for LockIcon since it wasn't in the snippet of ScrolliIcons.tsx visible
const LockIcon = ({ size = 24, className, ...props }: { size?: number, className?: string }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="1.5" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
    {...props}
  >
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
  </svg>
);

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

export default function ScrolliPremiumBanner() {
  const [currentJournalist, setCurrentJournalist] = useState<Journalist | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * journalists.length);
    setCurrentJournalist(journalists[randomIndex]);
  }, []);

  if (!currentJournalist) return null;

  return (
    <section className={sectionPadding.md}>
      <Container>
        {/* Main Bento Grid Container */}
        <div className={cn(
          "grid grid-cols-1 lg:grid-cols-12 overflow-hidden rounded-2xl border",
          "bg-[#F8F5E4] dark:bg-[#374152]", // Base beige/dark background
          "border-gray-200 dark:border-gray-700",
          "shadow-sm"
        )}>
          
          {/* Left Column: The Manifesto (Span 7) */}
          <div className={cn(
            "lg:col-span-7 p-8 md:p-10 flex flex-col justify-between relative",
            "border-b lg:border-b-0 lg:border-r border-gray-200 dark:border-gray-700"
          )}>
            {/* 
              Replacement for Noise Texture: "Subtle Grain" 
              Using a radial gradient pattern to create a subtle, paper-like feel without the specific "noise" look.
            */}
            <div className="absolute inset-0 opacity-[0.4] pointer-events-none mix-blend-multiply dark:mix-blend-soft-light" 
                 style={{ 
                   backgroundImage: `radial-gradient(#000 0.5px, transparent 0.5px), radial-gradient(#000 0.5px, transparent 0.5px)`,
                   backgroundSize: '20px 20px',
                   backgroundPosition: '0 0, 10px 10px',
                   opacity: 0.03
                 }} 
            />
            
            {/* Additional depth gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-transparent dark:from-white/5 pointer-events-none" />

            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <Badge 
                  variant="primary"
                  appearance="outline"
                  size="md"
                  className={cn("border-gray-900 text-gray-900 dark:border-gray-100 dark:text-gray-100")}
                >
                  Premium
                </Badge>
                <Text variant="caption" className="uppercase tracking-wider font-medium text-gray-500 dark:text-gray-400">
                  Support Independent Journalism
                </Text>
              </div>

              <Heading 
                level={2} 
                className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-gray-900 dark:text-gray-100 mb-6 leading-[1.1]"
              >
                Less breaking news. <br/>
                <span className="text-gray-500 dark:text-gray-400">More breakthrough stories.</span>
              </Heading>

              <div className="flex flex-wrap gap-3 mb-8">
                <Badge variant="secondary" appearance="light" size="md" className="bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400 border-amber-100 dark:border-amber-800/30 pl-1.5 pr-3 py-1.5 h-auto gap-2 shadow-sm">
                  <PremiumContentBadgeIcon size={16} className="text-amber-600 dark:text-amber-400" />
                  Premium Articles
                </Badge>
                <Badge variant="secondary" appearance="light" size="md" className="bg-indigo-50 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-400 border-indigo-100 dark:border-indigo-800/30 pl-1.5 pr-3 py-1.5 h-auto gap-2 shadow-sm">
                  <AIIcon size={16} className="text-indigo-600 dark:text-indigo-400" />
                  Alara AI
                </Badge>
                <Badge variant="secondary" appearance="light" size="md" className="bg-rose-50 text-rose-700 dark:bg-rose-900/20 dark:text-rose-400 border-rose-100 dark:border-rose-800/30 pl-1.5 pr-3 py-1.5 h-auto gap-2 shadow-sm">
                  <PodcastIcon size={16} className="text-rose-600 dark:text-rose-400" />
                  AI Podcasts
                </Badge>
                <Badge variant="secondary" appearance="light" size="md" className="bg-teal-50 text-teal-700 dark:bg-teal-900/20 dark:text-teal-400 border-teal-100 dark:border-teal-800/30 pl-1.5 pr-3 py-1.5 h-auto gap-2 shadow-sm">
                  <NewsletterIcon size={16} className="text-teal-600 dark:text-teal-400" />
                  Premium Newsletters
                </Badge>
              </div>

              {/* Journalist Spotlight - Moved & Compacted */}
              <div className="mb-8">
                 <div className={cn(
                  "p-4 rounded-xl flex items-center gap-4",
                  "bg-white/40 dark:bg-gray-800/40",
                  "border border-gray-100/50 dark:border-gray-700/50",
                  "backdrop-blur-sm"
                )}>
                  <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm flex-shrink-0 rotate-[-2deg]">
                    <Image
                      src={currentJournalist.photo}
                      alt={currentJournalist.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <Text className="font-serif text-sm italic text-gray-800 dark:text-gray-200 leading-snug mb-1">
                      "{currentJournalist.quote}"
                    </Text>
                    <div className="flex items-center gap-2">
                      <Text variant="caption" className="font-bold text-gray-900 dark:text-gray-100 text-xs">
                        {currentJournalist.name}
                      </Text>
                      <span className="text-gray-300 dark:text-gray-600 text-[10px]">•</span>
                      <Text variant="caption" className="text-gray-500 dark:text-gray-400 uppercase tracking-wide text-[10px]">
                        {currentJournalist.title}
                      </Text>
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative z-10 flex flex-col sm:flex-row gap-4 items-start sm:items-center mt-auto">
              <Link href="/premium" className="w-full sm:w-auto">
                <SmartButton 
                  variant="dark" // Explicitly using design system variant
                  size="lg" 
                  className="w-full sm:w-auto h-12 px-8 text-base shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
                >
                  Join for $9/mo
                  <ArrowRightIcon size={18} className="ml-2" />
                </SmartButton>
              </Link>
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300 text-sm font-medium px-2">
                <div className="w-5 h-5 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400">
                  <CheckIcon size={12} strokeWidth={3} />
                </div>
                <span>Cancel anytime</span>
              </div>
            </div>
            </div>
          </div>

          {/* Right Column: The Evidence (Span 5) */}
          <div className="lg:col-span-5 h-full flex flex-col">
            
            {/* Impact Breakdown - Moved & Compacted */}
            <div className={cn(
              "p-5 md:p-6",
              "bg-white/40 dark:bg-gray-800/40", 
              "border-b lg:border-l border-gray-200 dark:border-gray-700",
              "backdrop-blur-sm"
            )}>
              <div className="flex items-center justify-between mb-3">
                <Text variant="caption" className="uppercase tracking-wider font-bold text-gray-500 dark:text-gray-400 text-[10px]">
                  How your money spent with us
                </Text>
                <Badge variant="secondary" size="xs" className="bg-green-100/50 text-green-700 dark:bg-green-900/20 dark:text-green-300 border-none">
                  Verified
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
                    <span className="text-xs font-bold text-gray-900 dark:text-gray-100">60%</span>
                  </div>
                  <span className="text-[10px] text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wide">Journalists</span>
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-gray-500 dark:bg-gray-500" />
                    <span className="text-xs font-bold text-gray-900 dark:text-gray-100">30%</span>
                  </div>
                  <span className="text-[10px] text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wide">Investigations</span>
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-gray-300 dark:bg-gray-600" />
                    <span className="text-xs font-bold text-gray-900 dark:text-gray-100">10%</span>
                  </div>
                  <span className="text-[10px] text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wide">Platform</span>
                </div>
              </div>
            </div>

            {/* Locked Story Preview - Takes remaining height */}
            <Link href="/premium" className="block flex-1 group">
              <div 
                className={cn(
                  "h-full p-8 md:p-10 relative overflow-hidden flex flex-col justify-center",
                  "bg-gray-50/50 dark:bg-gray-900/30",
                  "transition-all duration-300 hover:bg-white/80 dark:hover:bg-gray-800/80",
                  "border-l border-gray-200 dark:border-gray-700"
                )}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                <div className="absolute top-6 right-6 z-20">
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 shadow-sm",
                    isHovered 
                      ? "bg-gray-900 text-white dark:bg-white dark:text-gray-900 scale-110" 
                      : "bg-white text-gray-400 dark:bg-gray-800 dark:text-gray-500 border border-gray-100 dark:border-gray-700"
                  )}>
                    <LockIcon size={14} />
                  </div>
                </div>

                <div className="relative z-10">
                  <Badge 
                    variant="secondary" 
                    size="sm" 
                    className="mb-4 bg-gray-200/50 text-gray-600 dark:bg-gray-700/50 dark:text-gray-300 border-none"
                  >
                    Exclusive Preview
                  </Badge>
                  
                  <Heading level={3} className="text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4 group-hover:text-gray-900 dark:group-hover:text-white transition-colors pr-8">
                    {exclusiveStory.title}
                  </Heading>

                  <div className="relative">
                    <Text className={cn(
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
                      <span className={cn(
                        "px-5 py-2.5 rounded-full text-sm font-bold shadow-lg",
                        "bg-gray-900 text-white dark:bg-white dark:text-gray-900",
                        "flex items-center gap-2 transform scale-105"
                      )}>
                        Unlock Story <ArrowRightIcon size={14} />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
