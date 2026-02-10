"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Heading, Text, Label } from "@/components/ui/typography";
import { colors, gap, componentPadding, borderRadius, interactions } from "@/lib/design-tokens";
import { cn } from "@/lib/utils";
import { getAuthorAvatar, getAuthorName } from '@/lib/author-loader';

export interface AuthorWithLatestArticle {
  name: string;
  slug: string;
  avatar?: string;
  latestArticle: {
    id: string;
    title: string;
  };
}

interface AuthorArticlesProps {
  authors?: AuthorWithLatestArticle[];
}

// Author avatar mapping - cycle through available avatars as fallback
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

export default function AuthorArticles({ authors = [] }: AuthorArticlesProps) {
  // Map authors to include avatars (from Payload or fallback)
  const authorsToShow = authors.map((author, index) => {
    const realAvatar = author.avatar || getAuthorAvatar(author.name);
    return {
      ...author,
      avatar: realAvatar || authorAvatars[index % authorAvatars.length],
    };
  });
  const [isDragging, setIsDragging] = useState(false);
  const gridRef = useRef<HTMLDivElement>(null);
  const dragState = useRef({
    isDown: false,
    startX: 0,
    scrollLeft: 0,
    isClick: true,
    lastX: 0,
    velocity: 0,
    lastTime: 0,
  });

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;

    // Mouse handlers
    const handleMouseDown = (e: MouseEvent) => {
      dragState.current.isDown = true;
      dragState.current.isClick = true;
      grid.style.cursor = "grabbing";
      grid.style.userSelect = "none";
      dragState.current.startX = e.pageX - grid.offsetLeft;
      dragState.current.scrollLeft = grid.scrollLeft;
      dragState.current.lastX = e.pageX;
      dragState.current.lastTime = Date.now();
      dragState.current.velocity = 0;
      setIsDragging(true);
    };

    const handleMouseLeave = () => {
      dragState.current.isDown = false;
      grid.style.cursor = "move";
      // Re-enable links
      const allLinks = grid.querySelectorAll('a');
      allLinks.forEach(link => {
        link.style.pointerEvents = '';
        link.style.userSelect = '';
      });
      setIsDragging(false);
    };

    const handleMouseUp = () => {
      // Re-enable links immediately if it was just a click (no drag)
      if (dragState.current.isClick) {
        const allLinks = grid.querySelectorAll('a');
        allLinks.forEach(link => {
          link.style.pointerEvents = '';
          link.style.userSelect = '';
        });
      } else {
        // If it was a drag, re-enable after a short delay
        setTimeout(() => {
          const allLinks = grid.querySelectorAll('a');
          allLinks.forEach(link => {
            link.style.pointerEvents = '';
            link.style.userSelect = '';
          });
        }, 100);
      }
      
      dragState.current.isDown = false;
      grid.style.cursor = "move";
      setIsDragging(false);
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!dragState.current.isDown) return;
      e.preventDefault();
      
      // Only disable links when actual dragging starts (movement detected)
      if (dragState.current.isClick) {
        const allLinks = grid.querySelectorAll('a');
        allLinks.forEach(link => {
          link.style.pointerEvents = 'none';
          link.style.userSelect = 'none';
          link.draggable = false;
        });
      }
      
      dragState.current.isClick = false;
      const x = e.pageX - grid.offsetLeft;
      const walk = (x - dragState.current.startX) * 1.5; // Reduced multiplier for smoother feel
      grid.scrollLeft = dragState.current.scrollLeft - walk;
      
      // Calculate velocity for momentum
      const now = Date.now();
      const deltaTime = now - dragState.current.lastTime;
      if (deltaTime > 0) {
        const deltaX = e.pageX - dragState.current.lastX;
        dragState.current.velocity = deltaX / deltaTime;
      }
      dragState.current.lastX = e.pageX;
      dragState.current.lastTime = now;
    };

    // Touch handlers for better mobile swipe
    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      dragState.current.isDown = true;
      dragState.current.isClick = true;
      dragState.current.startX = touch.pageX - grid.offsetLeft;
      dragState.current.scrollLeft = grid.scrollLeft;
      dragState.current.lastX = touch.pageX;
      dragState.current.lastTime = Date.now();
      dragState.current.velocity = 0;
      setIsDragging(true);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!dragState.current.isDown) return;
      e.preventDefault(); // Prevent text selection and link dragging
      
      // Only disable links when actual dragging starts (movement detected)
      if (dragState.current.isClick) {
        const allLinks = grid.querySelectorAll('a');
        allLinks.forEach(link => {
          link.style.pointerEvents = 'none';
          link.style.userSelect = 'none';
          link.draggable = false;
        });
      }
      
      const touch = e.touches[0];
      dragState.current.isClick = false;
      const x = touch.pageX - grid.offsetLeft;
      const walk = (x - dragState.current.startX) * 1.2; // Smooth touch scrolling
      grid.scrollLeft = dragState.current.scrollLeft - walk;
      
      // Calculate velocity
      const now = Date.now();
      const deltaTime = now - dragState.current.lastTime;
      if (deltaTime > 0) {
        const deltaX = touch.pageX - dragState.current.lastX;
        dragState.current.velocity = deltaX / deltaTime;
      }
      dragState.current.lastX = touch.pageX;
      dragState.current.lastTime = now;
    };

    const handleTouchEnd = () => {
      // Apply momentum scrolling
      if (Math.abs(dragState.current.velocity) > 0.1) {
        const momentum = dragState.current.velocity * 200; // Momentum multiplier
        const startScroll = grid.scrollLeft;
        const targetScroll = startScroll - momentum;
        const startTime = Date.now();
        const duration = 300; // ms

        const animate = () => {
          const elapsed = Date.now() - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const ease = 1 - Math.pow(1 - progress, 3); // Ease out cubic
          grid.scrollLeft = startScroll + (targetScroll - startScroll) * ease;
          
          if (progress < 1) {
            requestAnimationFrame(animate);
          }
        };
        requestAnimationFrame(animate);
      }
      
      // Re-enable links immediately if it was just a tap (no drag)
      if (dragState.current.isClick) {
        const allLinks = grid.querySelectorAll('a');
        allLinks.forEach(link => {
          link.style.pointerEvents = '';
          link.style.userSelect = '';
        });
      } else {
        // If it was a drag, re-enable after a short delay
        setTimeout(() => {
          const allLinks = grid.querySelectorAll('a');
          allLinks.forEach(link => {
            link.style.pointerEvents = '';
            link.style.userSelect = '';
          });
        }, 100);
      }
      
      dragState.current.isDown = false;
      setIsDragging(false);
    };

    // Mouse events
    grid.addEventListener("mousedown", handleMouseDown);
    grid.addEventListener("mouseleave", handleMouseLeave);
    grid.addEventListener("mouseup", handleMouseUp);
    grid.addEventListener("mousemove", handleMouseMove);
    
    // Touch events
    grid.addEventListener("touchstart", handleTouchStart, { passive: false });
    grid.addEventListener("touchmove", handleTouchMove, { passive: false });
    grid.addEventListener("touchend", handleTouchEnd, { passive: true });

    return () => {
      grid.removeEventListener("mousedown", handleMouseDown);
      grid.removeEventListener("mouseleave", handleMouseLeave);
      grid.removeEventListener("mouseup", handleMouseUp);
      grid.removeEventListener("mousemove", handleMouseMove);
      grid.removeEventListener("touchstart", handleTouchStart);
      grid.removeEventListener("touchmove", handleTouchMove);
      grid.removeEventListener("touchend", handleTouchEnd);
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
          "cursor-move",
          "touch-pan-x",
          "[&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]",
          isDragging && "select-none"
        )}
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          WebkitOverflowScrolling: "touch",
          scrollBehavior: "smooth",
          overscrollBehaviorX: "contain",
          userSelect: "none",
          WebkitUserSelect: "none",
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
                window.location.href = `/${author.latestArticle.id}`;
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
                    href={`/${author.latestArticle.id}`}
                    className={cn(interactions.hover, "block break-words")}
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
                <Label
                  as="span"
                  color="secondary"
                  className="leading-tight whitespace-nowrap"
                >
                  {formatAuthorName(author.name)}
                </Label>
              </div>
            </article>
          </div>
          </div>
        ))}
      </div>
    </div>
  );
}

