"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import blogData from "@/data/blog.json";
import { Heading, Text } from "@/components/ui/typography";
import { colors, gap, componentPadding, borderRadius } from "@/lib/design-tokens";
import { cn } from "@/lib/utils";
import { getAuthorAvatar, getAuthorName } from '@/lib/author-loader';

// Helper function to extract real authors and their latest articles from blog.json
function getRealAuthors() {
  const authorMap = new Map<string, { name: string; latestArticle: { id: string; title: string }; index: number }>();
  
  // Collect all articles from different sections (in order of priority: mostRecent first, then featured, etc.)
  const allArticles: Array<{ id: string; title: string; author: string }> = [];
  
  // Most recent articles (highest priority - these are the latest)
  if (blogData.mostRecent?.mainArticles) {
    blogData.mostRecent.mainArticles.forEach((article: any) => {
      if (article.author && article.title && article.id) {
        allArticles.push({
          id: article.id,
          title: article.title,
          author: article.author,
        });
      }
    });
  }
  if (blogData.mostRecent?.sideArticles) {
    blogData.mostRecent.sideArticles.forEach((article: any) => {
      if (article.author && article.title && article.id) {
        allArticles.push({
          id: article.id,
          title: article.title,
          author: article.author,
        });
      }
    });
  }
  
  // Featured articles
  if (blogData.featured?.mainArticle) {
    const article = blogData.featured.mainArticle;
    if (article.author && article.title && article.id) {
      allArticles.push({
        id: article.id,
        title: article.title,
        author: article.author,
      });
    }
  }
  if (blogData.featured?.sideArticles) {
    blogData.featured.sideArticles.forEach((article: any) => {
      if (article.author && article.title && article.id) {
        allArticles.push({
          id: article.id,
          title: article.title,
          author: article.author,
        });
      }
    });
  }
  
  // Today highlights
  if (blogData.todayHighlights?.articles) {
    blogData.todayHighlights.articles.forEach((article: any) => {
      if (article.author && article.title && article.id) {
        allArticles.push({
          id: article.id,
          title: article.title,
          author: article.author,
        });
      }
    });
  }
  
  // Featured slider
  if (blogData.featuredSlider?.articles) {
    blogData.featuredSlider.articles.forEach((article: any) => {
      if (article.author && article.title && article.id) {
        allArticles.push({
          id: article.id,
          title: article.title,
          author: article.author,
        });
      }
    });
  }
  
  // Keep only the first (latest) article for each author
  allArticles.forEach((article, index) => {
    if (!authorMap.has(article.author)) {
      authorMap.set(article.author, {
        name: article.author,
        latestArticle: {
          id: article.id,
          title: article.title,
        },
        index: index,
      });
    }
  });
  
  // Convert to array and sort by index to maintain order
  return Array.from(authorMap.values())
    .sort((a, b) => a.index - b.index)
    .map(({ index, ...rest }) => rest);
}

// Author avatar mapping - cycle through available avatars
const authorAvatars = [
  "/assets/images/author-avata-1.jpg",
  "/assets/images/author-avata-2.jpg",
  "/assets/images/author-avata-3.jpg",
  "/assets/images/author-avata-4.jpg",
];

// Helper function to format author name for display
// Now uses getAuthorName from author-loader for proper formatting
function formatAuthorName(authorSlug: string): string {
  return getAuthorName(authorSlug);
}

// Mock authors data - simulating 20 authors, showing 5
const mockAuthors = [
  {
    name: "Dave Gershgorn",
    avatar: "/assets/images/author-avata-1.jpg",
    latestArticle: {
      id: "home-internet-is-becoming-a-luxury-for-the-wealthy-2",
      title: "Home Internet Is Becoming a Luxury for the Wealthy"
    }
  },
  {
    name: "Ben Smith",
    avatar: "/assets/images/author-avata-2.jpg",
    latestArticle: {
      id: "trump-mbs-and-mamdani-at-the-predators-ball",
      title: "Trump, MBS, and Mamdani at the Predators' Ball"
    }
  },
  {
    name: "Darcy Reeder",
    avatar: "/assets/images/author-avata-3.jpg",
    latestArticle: {
      id: "why-lack-of-sleep-is-so-bad-for-you-1",
      title: "Why Lack of Sleep is So Bad For You"
    }
  },
  {
    name: "Anna Goldfarb",
    avatar: "/assets/images/author-avata-1.jpg",
    latestArticle: {
      id: "i-learned-how-to-die-before-i-knew-how-to-live-1",
      title: "I Learned How to Die Before I Knew How to Live"
    }
  },
  {
    name: "Azimi Şkalo",
    avatar: "/assets/images/author-avata-2.jpg",
    latestArticle: {
      id: "regulators-just-put-a-target-on-apples-back-1",
      title: "Regulators Just Put a Target on Apple's Back"
    }
  },
  // Additional mock authors (not shown, but available)
  {
    name: "Johan Doan",
    avatar: "/assets/images/author-avata-3.jpg",
    latestArticle: {
      id: "what-really-happens-to-airpods-when-they-die-1",
      title: "What Really Happens to AirPods When They Die"
    }
  },
  {
    name: "Furukawa",
    avatar: "/assets/images/author-avata-1.jpg",
    latestArticle: {
      id: "is-interactive-storytelling-the-future-of-media-1",
      title: "Is 'Interactive Storytelling' the Future of Media?"
    }
  },
  {
    name: "Glorida",
    avatar: "/assets/images/author-avata-2.jpg",
    latestArticle: {
      id: "how-not-to-get-a-30k-bill-from-firebase-1",
      title: "How NOT to get a $30k bill from Firebase"
    }
  },
  {
    name: "Rayan Mark",
    avatar: "/assets/images/author-avata-3.jpg",
    latestArticle: {
      id: "google-cant-figure-out-what-youtube-is-1",
      title: "Google Can't Figure Out What YouTube Is"
    }
  },
  {
    name: "Steven Job",
    avatar: "/assets/images/author-avata-1.jpg",
    latestArticle: {
      id: "what-i-wish-id-known-when-i-made-a-drastic-career-change",
      title: "What I Wish I'd Known When I Made a Drastic Career Change"
    }
  },
  {
    name: "Jordan Ellis",
    avatar: "/assets/images/author-avata-2.jpg",
    latestArticle: {
      id: "why-i-stopped-chasing-success-and-started-living-intentionally",
      title: "Why I Stopped Chasing 'Success' and Started Living Intentionally"
    }
  },
  {
    name: "Mark Harris",
    avatar: "/assets/images/author-avata-3.jpg",
    latestArticle: {
      id: "want-to-make-millions-then-act-like-a-millionaire",
      title: "Want To Make Millions? Then Act Like a Millionaire"
    }
  },
  {
    name: "Alentica",
    avatar: "/assets/images/author-avata-1.jpg",
    latestArticle: {
      id: "the-night-my-doorbell-camera-captured-a-shooting",
      title: "The Night My Doorbell Camera Captured a Shooting"
    }
  },
  {
    name: "Otimus",
    avatar: "/assets/images/author-avata-2.jpg",
    latestArticle: {
      id: "privacy-is-just-the-beginning-of-the-debate-over-tech",
      title: "Privacy Is Just the Beginning of the Debate Over Tech"
    }
  },
  {
    name: "Adam Philip",
    avatar: "/assets/images/author-avata-3.jpg",
    latestArticle: {
      id: "president-and-the-emails-who-will-guard-the-guards-2",
      title: "President and the emails. Who will guard the guards?"
    }
  },
  {
    name: "Aaron Gell",
    avatar: "/assets/images/author-avata-1.jpg",
    latestArticle: {
      id: "how-to-silence-the-persistent-ding-of-modern-life-2",
      title: "How to Silence the Persistent Ding of Modern Life"
    }
  },
  {
    name: "Atlantic",
    avatar: "/assets/images/author-avata-2.jpg",
    latestArticle: {
      id: "why-we-love-to-watch-2",
      title: "Why We Love to Watch"
    }
  },
  {
    name: "Alentica",
    avatar: "/assets/images/author-avata-3.jpg",
    latestArticle: {
      id: "how-health-apps-let-2",
      title: "How Health Apps Let"
    }
  },
  {
    name: "Dave Gershgorn",
    avatar: "/assets/images/author-avata-1.jpg",
    latestArticle: {
      id: "apple-is-designing-for-a-post-facebook-world-1",
      title: "Apple Is Designing for a Post-Facebook World"
    }
  },
  {
    name: "Ryan Mark",
    avatar: "/assets/images/author-avata-2.jpg",
    latestArticle: {
      id: "what-really-happens-to-airpods-when-they-die-1",
      title: "What Really Happens to AirPods When They Die"
    }
  }
];

export default function AuthorArticles() {
  // Get real authors from blog.json
  const realAuthors = useMemo(() => {
    const authors = getRealAuthors();
    // Map authors to real avatars from CSV, fallback to cycling through available avatars
    return authors.slice(0, 5).map((author, index) => {
      const realAvatar = getAuthorAvatar(author.name);
      return {
        ...author,
        avatar: realAvatar || authorAvatars[index % authorAvatars.length],
      };
    });
  }, []);
  
  // Use real authors if available, otherwise fallback to mock
  const authorsToShow = realAuthors.length > 0 ? realAuthors : mockAuthors.slice(0, 5);
  const [isDragging, setIsDragging] = useState(false);
  const gridRef = useRef<HTMLDivElement>(null);
  const dragState = useRef({
    isDown: false,
    startX: 0,
    scrollLeft: 0,
    isClick: true,
    animationId: 0,
  });

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;

    const handleMouseDown = (e: MouseEvent) => {
      dragState.current.isDown = true;
      dragState.current.isClick = true;
      grid.style.cursor = "grabbing";
      grid.style.userSelect = "none";
      dragState.current.startX = e.pageX - grid.offsetLeft;
      dragState.current.scrollLeft = grid.scrollLeft;
      setIsDragging(true);
    };

    const handleMouseLeave = () => {
      dragState.current.isDown = false;
      grid.style.cursor = "grab";
      setIsDragging(false);
    };

    const handleMouseUp = () => {
      dragState.current.isDown = false;
      grid.style.cursor = "grab";
      setIsDragging(false);
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!dragState.current.isDown) return;
      e.preventDefault();
      dragState.current.isClick = false;
      const x = e.pageX - grid.offsetLeft;
      const walk = (x - dragState.current.startX) * 2;
      grid.scrollLeft = dragState.current.scrollLeft - walk;
    };

    grid.addEventListener("mousedown", handleMouseDown);
    grid.addEventListener("mouseleave", handleMouseLeave);
    grid.addEventListener("mouseup", handleMouseUp);
    grid.addEventListener("mousemove", handleMouseMove);

    return () => {
      grid.removeEventListener("mousedown", handleMouseDown);
      grid.removeEventListener("mouseleave", handleMouseLeave);
      grid.removeEventListener("mouseup", handleMouseUp);
      grid.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  if (authorsToShow.length === 0) {
    return null;
  }

  return (
    <div className="w-full">
      <div
        ref={gridRef}
        className={cn(
          "flex gap-4 overflow-x-auto",
          "cursor-grab active:cursor-grabbing",
          "touch-pan-x",
          "[&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]",
          isDragging && "select-none"
        )}
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          WebkitOverflowScrolling: "touch",
        }}
      >
        {authorsToShow.map((author, index) => (
          <div key={`${author.name}-${index}`} className="relative">
            {/* Vertical Dotted Divider - Centered between cards */}
            {index > 0 && (
              <div
                className="absolute top-0 bottom-0 w-px border-l border-dotted border-gray-300 dark:border-gray-600 pointer-events-none"
                style={{ left: "-0.5rem" }}
              />
            )}
            <div
              className={cn(
                "w-[150px] flex-shrink-0",
                borderRadius.md,
                "overflow-hidden"
              )}
            >
            <article
              className={cn(
                "group flex flex-col justify-between h-[150px] cursor-pointer",
                "bg-[#F8F5E4] dark:bg-[#374152]",
                "hover:bg-[#F8F5E4]/80 dark:hover:bg-[#374152]/80",
                "transition-colors duration-200",
                "p-2 pt-1.5"
              )}
              onClick={(e) => {
                if (!dragState.current.isClick) {
                  e.preventDefault();
                }
                dragState.current.isClick = true;
                window.location.href = `/article/${author.latestArticle.id}`;
              }}
            >
              {/* Article Title - Limited to 3 lines with proper word breaking */}
              <div className="flex-1 mb-0 min-h-0">
                <Heading
                  level={3}
                  variant="h6"
                  className={cn(
                    "leading-tight text-[10px] line-clamp-3",
                    colors.navbarBeige.text
                  )}
                >
                  <Link
                    href={`/article/${author.latestArticle.id}`}
                    className="hover:text-primary transition-colors block break-words"
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  >
                    {author.latestArticle.title}
                  </Link>
                </Heading>
              </div>

              {/* Author Image and Name - Horizontal - More spacing from title */}
              <div className="flex items-center gap-1.5 mt-3 pt-2">
                <Link 
                  href={`/author/${author.name.toLowerCase().replace(/\s+/g, "-")}`}
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  <div className="relative w-7 h-7 rounded-sm overflow-hidden flex-shrink-0">
                    <Image
                      src={author.avatar}
                      alt={author.name}
                      fill
                      className="object-cover"
                      sizes="28px"
                    />
                  </div>
                </Link>
                <Text
                  variant="caption"
                  className={cn(colors.foreground.secondary, "text-[11px] leading-tight whitespace-nowrap")}
                >
                  {formatAuthorName(author.name)}
                </Text>
              </div>
            </article>
          </div>
          </div>
        ))}
      </div>
    </div>
  );
}

