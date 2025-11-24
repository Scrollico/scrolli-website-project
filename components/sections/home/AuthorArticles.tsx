"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import blogData from "@/data/blog.json";
import { Heading, Text } from "@/components/ui/typography";
import { colors, gap, componentPadding, borderRadius } from "@/lib/design-tokens";
import { cn } from "@/lib/utils";

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
  // Show only 5 authors (simulating selection from 20)
  const authorsToShow = mockAuthors.slice(0, 5);
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
              <div className="absolute left-0 top-0 bottom-0 w-px border-l border-dotted border-gray-300 dark:border-gray-600 -translate-x-2" />
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
                "group flex flex-col justify-between h-[140px] cursor-pointer",
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
              {/* Article Title with View prefix */}
              <Heading
                level={3}
                variant="h6"
                className={cn(
                  "leading-[1.2] text-[10px] flex-1 mb-0 overflow-hidden",
                  colors.navbarBeige.text
                )}
                style={{
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                  wordBreak: 'break-word',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                <Link
                  href={`/article/${author.latestArticle.id}`}
                  className="hover:text-primary transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  View / {author.latestArticle.title}
                </Link>
              </Heading>

              {/* Author Image and Name - Horizontal */}
              <div className="flex items-center gap-1.5 mt-auto pt-1">
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
                  className={cn(colors.foreground.secondary, "text-[10px] leading-tight whitespace-nowrap")}
                >
                  {author.name}
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

