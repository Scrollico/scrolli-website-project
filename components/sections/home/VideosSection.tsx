'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface VideoCard {
  id: string;
  title: string;
  caption: string;
  thumbnail: string;
  duration?: string;
}

const videoData: VideoCard[] = [
  {
    id: 'home-internet-luxury',
    title: 'Home Internet Is Becoming a Luxury for the Wealthy',
    caption: 'Dave Gershgorn in OneZero • Jun 14 • 3 min read',
    thumbnail: '/assets/images/thumb/thumb-1240x700.jpg',
    duration: '2:45'
  },
  {
    id: 'doorbell-camera-shooting',
    title: 'The Night My Doorbell Camera Captured a Shooting',
    caption: 'Alentica in Police • Jun 16 • 7 min read',
    thumbnail: '/assets/images/thumb/thumb-700x512.jpg',
    duration: '3:12'
  },
  {
    id: 'privacy-tech-debate',
    title: 'Privacy Is Just the Beginning of the Debate Over Tech',
    caption: 'Otimus in Startup • May 15 • 6 min read',
    thumbnail: '/assets/images/thumb/thumb-700x512-2.jpg',
    duration: '1:58'
  },
  {
    id: 'millionaire-mindset',
    title: 'Want To Make Millions? Then Act Like a Millionaire',
    caption: 'Mark Harris in Heated • May 13 • 12 min read',
    thumbnail: '/assets/images/thumb/thumb-700x512-3.jpg',
    duration: '4:30'
  },
  {
    id: 'career-change-advice',
    title: 'What I Wish I\'d Known When I Made a Drastic Career Change',
    caption: 'Steven Job in The Startup • 2 days ago • 8 min read',
    thumbnail: '/assets/images/thumb/thumb-1400x778.jpg',
    duration: '3:45'
  }
];

export default function ArticlesSection() {
  const [isDragging, setIsDragging] = useState(false);
  const gridRef = useRef<HTMLDivElement>(null);
  const hasShownSwipeDemo = useRef(false);

  // Drag state
  const dragState = useRef({
    isDown: false,
    startX: 0,
    scrollLeft: 0,
    velocity: 0,
    lastX: 0,
    animationId: 0,
    dragDistance: 0, // Track drag distance to distinguish clicks from drags
    isClick: true // Assume it's a click until proven otherwise
  });

  // Swipe demonstration function
  const showSwipeDemo = () => {
    const grid = gridRef.current;
    if (!grid) return;

    const startScrollLeft = grid.scrollLeft;
    const demoScrollDistance = 200; // Scroll 200px to the right as demo
    const duration = 800; // 800ms animation
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function for smooth animation
      const easeOutCubic = 1 - Math.pow(1 - progress, 3);
      const currentScroll = startScrollLeft + (demoScrollDistance * easeOutCubic);

      grid.scrollLeft = currentScroll;

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        // After demo scroll, smoothly scroll back to start
        setTimeout(() => {
          const backStartTime = Date.now();
          const backDuration = 600;

          const animateBack = () => {
            const backElapsed = Date.now() - backStartTime;
            const backProgress = Math.min(backElapsed / backDuration, 1);

            const easeInOutCubic = backProgress < 0.5
              ? 4 * backProgress * backProgress * backProgress
              : 1 - Math.pow(-2 * backProgress + 2, 3) / 2;

            grid.scrollLeft = currentScroll - (demoScrollDistance * easeInOutCubic);

            if (backProgress < 1) {
              requestAnimationFrame(animateBack);
            }
          };

          animateBack();
        }, 1000); // Wait 1 second before scrolling back
      }
    };

    animate();
  };

  useEffect(() => {
    // Show swipe demo only once per session
    if (!hasShownSwipeDemo.current && typeof window !== 'undefined') {
      const demoShown = sessionStorage.getItem('videosSwipeDemoShown');
      if (!demoShown) {
        setTimeout(() => {
          showSwipeDemo();
          hasShownSwipeDemo.current = true;
          sessionStorage.setItem('videosSwipeDemoShown', 'true');
        }, 2000); // Start demo 2 seconds after component mounts
      }
    }
  }, []);


  // Enhanced drag functionality (inspired by Embla Carousel)
  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;

    let startTime = 0;
    let isDraggingLocal = false;
    let dragStartX = 0;
    let dragScrollLeft = 0;
    let dragDistance = 0;

    // Check if device is mobile/touch (like dragFree in Embla)
    const isMobile = window.innerWidth <= 768 || 'ontouchstart' in window;

    const handleStart = (clientX: number) => {
      isDraggingLocal = true;
      setIsDragging(true);
      startTime = Date.now();
      dragDistance = 0; // Reset drag distance

      dragStartX = clientX - grid.offsetLeft;
      dragScrollLeft = grid.scrollLeft;

      // Initialize drag state
      dragState.current.isClick = true; // Assume it's a click initially
      dragState.current.dragDistance = 0;

      grid.style.cursor = 'grab';
      grid.style.userSelect = 'none';
      grid.style.scrollBehavior = 'auto'; // Disable smooth scrolling during drag

      // Cancel any ongoing animation
      cancelAnimationFrame(dragState.current.animationId);
    };

    const handleMove = (clientX: number) => {
      if (!isDraggingLocal) return;

      const deltaX = clientX - grid.offsetLeft - dragStartX;
      const sensitivity = isMobile ? 1.0 : 1.2; // More sensitive on mobile (dragFree-like)
      grid.scrollLeft = dragScrollLeft - (deltaX * sensitivity);

      // Track drag distance to distinguish clicks from drags
      dragDistance = Math.abs(deltaX);
      dragState.current.dragDistance = dragDistance;

      // If drag distance exceeds threshold, it's not a click anymore
      if (dragDistance > 5) { // 5px threshold for click vs drag
        dragState.current.isClick = false;
      }

      // Calculate velocity for momentum (smoother calculation)
      const now = Date.now();
      const deltaTime = now - startTime;
      if (deltaTime > 16) { // Only update velocity if enough time has passed (~60fps)
        dragState.current.velocity = (deltaX * sensitivity) / deltaTime;
      }
    };

    const handleEnd = () => {
      if (!isDraggingLocal) return;

      isDraggingLocal = false;
      setIsDragging(false);

      grid.style.cursor = 'pointer';
      grid.style.userSelect = '';
      grid.style.scrollBehavior = 'auto';

      // Reset drag state - no momentum scrolling
      dragState.current.dragDistance = 0;
    };

    // Mouse events
    const handleMouseDown = (e: MouseEvent) => {
      e.preventDefault();
      handleStart(e.clientX);
    };

    const handleMouseMove = (e: MouseEvent) => {
      handleMove(e.clientX);
    };

    const handleMouseUp = () => {
      handleEnd();
    };

    // Touch events
    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      handleStart(touch.clientX);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        e.preventDefault();
        const touch = e.touches[0];
        handleMove(touch.clientX);
      }
    };

    const handleTouchEnd = () => {
      handleEnd();
    };

    // Add event listeners
    grid.addEventListener('mousedown', handleMouseDown);
    grid.addEventListener('mousemove', handleMouseMove);
    grid.addEventListener('mouseup', handleMouseUp);
    grid.addEventListener('mouseleave', handleMouseUp);

    grid.addEventListener('touchstart', handleTouchStart, { passive: false });
    grid.addEventListener('touchmove', handleTouchMove, { passive: false });
    grid.addEventListener('touchend', handleTouchEnd);

    // Prevent context menu on long press
    grid.addEventListener('contextmenu', (e) => {
      if (isDraggingLocal) e.preventDefault();
    });

    // Cleanup
    return () => {
      grid.removeEventListener('mousedown', handleMouseDown);
      grid.removeEventListener('mousemove', handleMouseMove);
      grid.removeEventListener('mouseup', handleMouseUp);
      grid.removeEventListener('mouseleave', handleMouseUp);

      grid.removeEventListener('touchstart', handleTouchStart);
      grid.removeEventListener('touchmove', handleTouchMove);
      grid.removeEventListener('touchend', handleTouchEnd);

      cancelAnimationFrame(dragState.current.animationId);
    };
  }, []);

  return (
    <>
      <div className="videos-section">
        <div className="videos-container">
          <div className="videos-header">
            <h2 className="videos-title">Watch Today's Videos</h2>
            <div className="videos-divider"></div>
          </div>
          
          <div
            className={`videos-grid ${isDragging ? 'dragging' : ''}`}
            ref={gridRef}
          >
            {videoData.map((video) => {
              const handleCardClick = (e: React.MouseEvent) => {
                // Only navigate if it was actually a click (not a drag)
                if (!dragState.current.isClick) {
                  e.preventDefault();
                  e.stopPropagation();
                }
                // Reset click state after handling
                dragState.current.isClick = true;
              };

              return (
                <div key={video.id} className="video-card">
                  <div className="video-media">
                    <Link href={`/article/${video.id}`} onClick={handleCardClick}>
                            <Image
                              src={video.thumbnail}
                              alt={video.title}
                              width={400}
                              height={225}
                              className="video-thumbnail"
                              quality={95}
                              priority={false}
                            />
                    </Link>
                  </div>

                  <div className="video-content">
                    <h3 className="video-title">
                      <Link href={`/article/${video.id}`} onClick={handleCardClick}>{video.title}</Link>
                    </h3>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      
      <style jsx>{`
        .videos-section {
          width: 100vw;
          max-width: 1800px;
          margin: 0 auto;
          padding: 32px 24px;
          background: transparent;
        }
        
        .videos-container {
          width: 100%;
        }
        
        .videos-header {
          margin-bottom: 32px;
        }
        
        .videos-title {
          font-family: 'Cabin', sans-serif;
          font-weight: 700;
          font-size: clamp(1.25rem, 5vw, 2rem);
          line-height: 1.2;
          color: #222;
          margin: 0 0 16px 0;
        }
        
        .videos-divider {
          width: 100%;
          height: 1px;
          background: #eaeaea;
          margin: 16px 0;
        }
        
        .videos-grid {
          display: flex;
          gap: 16px;
          overflow-x: auto;
          scrollbar-width: none;
          -ms-overflow-style: none;
          cursor: grab;
          user-select: none;
          touch-action: pan-x;
          scroll-behavior: auto; /* Changed from smooth to auto for fluid dragging */
          -webkit-overflow-scrolling: touch;
        }
        
        .videos-grid:active {
          cursor: grabbing;
        }
        
        .videos-grid:hover {
          cursor: grab;
        }
        
        .videos-grid.dragging {
          cursor: grabbing;
          scroll-behavior: auto;
        }
        
        .videos-grid * {
          cursor: inherit;
        }
        
        .videos-grid::-webkit-scrollbar {
          display: none;
        }
        
        .video-card {
          background: transparent;
          border-radius: 4px;
          overflow: hidden;
          flex: 0 0 30%;
          position: relative;
          cursor: inherit;
          transition: none; /* Remove transitions during dragging */
        }
        
        .video-card:not(:last-child)::after {
          content: '';
          position: absolute;
          right: -8px;
          top: 20%;
          bottom: 20%;
          width: 1px;
          background: rgba(0, 0, 0, 0.1);
        }
        
        .dark-mode .video-card:not(:last-child)::after {
          background: rgba(255, 255, 255, 0.2);
        }
        
        .video-media {
          position: relative;
          aspect-ratio: 3/4;
          overflow: hidden;
        }
        
        .video-thumbnail {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        
        .video-overlay {
          display: none;
        }
        
        .video-content {
          padding: 16px;
        }
        
        .video-title {
          font-family: 'Cabin', sans-serif;
          font-weight: 500;
          font-size: 1.4rem;
          line-height: 1.3;
          color: rgba(0, 0, 0, .84);
          margin: 0;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        .dark-mode .video-title {
          color: rgba(255, 255, 255, .84) !important;
        }

        
        .video-title a {
          color: inherit;
          text-decoration: none;
        }
        
        /* Responsive Design */
        @media (max-width: 1440px) {
          .videos-grid {
            grid-template-columns: repeat(4, 1fr);
          }
        }
        
        @media (max-width: 1024px) {
          .videos-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        
        @media (max-width: 600px) {
          .videos-section {
            padding: 24px 16px;
          }
          
          .videos-grid {
            grid-template-columns: 1fr;
            gap: 16px;
          }
        }
      `}</style>
    </>
  );
}
