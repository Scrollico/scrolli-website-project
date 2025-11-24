"use client";
import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { SmartButton } from "@/components/ui/smart-button";
import { Swiper, SwiperSlide } from 'swiper/react';
import { SectionHeader } from "@/components/ui/SectionHeader";
import 'swiper/css';
import { colors } from "@/lib/design-tokens";
import { cn } from "@/lib/utils";
import { PlayIcon, CloseIcon, ArrowLeftIcon, ArrowRightIcon } from "@/components/icons/ScrolliIcons";

interface VideoItem {
  id: string;
  title: string;
  videoUrl: string;
  overlayText?: {
    location?: string;
    date?: string;
    quote?: string;
    source?: string;
    author?: string;
    role?: string;
  };
}

const videos: VideoItem[] = [
  {
    id: '1',
    title: "Türkiye'de yasa dışı bahis piyasasında dönen paranın 40 milyar dolar olduğu tahmin ediliyor.",
    videoUrl: "/assets/videos/scrolli1.mp4",
  },
  {
    id: '2',
    title: "2021'den bu yana Marmaray hattında en az 29 kişi hayatına son verdi ya da girişimde bulundu.",
    videoUrl: "/assets/videos/scrolli2.mp4",
  },
  {
    id: '3',
    title: "Anna Wintour, Vogue US'te 37 yılın ardından tarihi bir dönem kapatıyor.",
    videoUrl: "/assets/videos/scrolli3.mp4",
  },
  {
    id: '4',
    title: "Çin'in dikkati, Pakistan'ın endişeleri ve Taliban'ın hedefleri Wakhan'da buluşuyor.",
    videoUrl: "/assets/videos/scrolli4.mp4",
  },
  {
    id: '5',
    title: "Bir yıldır 'derinlik' sunuyoruz. Destek veren tüm abonelerimize teşekkürler.",
    videoUrl: "/assets/videos/scrolli5.mp4",
  },
  {
    id: '6',
    title: "Türkiye ile Birleşik Krallık arasında Eurofighter Typhoon süreci resmen başladı.",
    videoUrl: "/assets/videos/scrolli6.mp4",
  },
  {
    id: '7',
    title: "Yapay zeka ile yalnızlık arasındaki ince çizgi: Seran Demiral ve Ayhan Asar değerlendiriyor.",
    videoUrl: "/assets/videos/scrolli7.mp4",
  },
];

function VideoCard({
  video,
  onPlay,
  videoRef,
  index = 0
}: {
  video: VideoItem;
  onPlay: () => void;
  videoRef?: React.RefObject<HTMLVideoElement>;
  index?: number;
}) {
  const handleClick = () => {
    console.log('[VideoCard] Click handler fired for video:', video.id);
    onPlay();
  };
  const posterVideoRef = useRef<HTMLVideoElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const isInView = useInView(cardRef, { once: true, margin: "-100px" });

  useEffect(() => {
    const videoElement = posterVideoRef.current;
    if (!videoElement) return undefined;

    videoElement.load();

    const handleCanPlay = () => {
      if (videoElement.readyState >= 2) {
        videoElement.currentTime = 0.1;
      }
    };

    const handlePlaying = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handlePlay = () => setIsPlaying(true);

    videoElement.addEventListener('canplay', handleCanPlay);
    videoElement.addEventListener('loadedmetadata', handleCanPlay);
    videoElement.addEventListener('playing', handlePlaying);
    videoElement.addEventListener('play', handlePlay);
    videoElement.addEventListener('pause', handlePause);

    return () => {
      videoElement.removeEventListener('canplay', handleCanPlay);
      videoElement.removeEventListener('loadedmetadata', handleCanPlay);
      videoElement.removeEventListener('playing', handlePlaying);
      videoElement.removeEventListener('play', handlePlay);
      videoElement.removeEventListener('pause', handlePause);
    };
  }, [video.videoUrl]);

  // Autoplay first video when it enters viewport
  useEffect(() => {
    if (!videoRef || !videoRef.current) return undefined;

    const videoElement = videoRef.current;
    videoElement.load();

    const handleCanPlayThrough = () => {
      videoElement.play().catch(() => {
        setIsPlaying(false);
      });
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            videoElement.addEventListener('canplaythrough', handleCanPlayThrough, { once: true });
            videoElement.play().catch(() => {
              setIsPlaying(false);
            });
            observer.disconnect();
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px',
      }
    );

    const cardElement = cardRef.current;
    if (cardElement) {
      observer.observe(cardElement);
    }

    return () => {
      observer.disconnect();
      videoElement.removeEventListener('canplaythrough', handleCanPlayThrough);
    };
  }, [videoRef]);

  // Animation variants for slide-in and pop-up effect
  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 50,
      scale: 0.9,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        delay: index * 0.1, // Stagger animation based on index
      },
    },
  };

  return (
    <motion.div
      className="video-card-wrapper"
      ref={cardRef}
      variants={cardVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      whileHover={{
        scale: 1.02,
        y: -5,
        transition: { duration: 0.2 },
      }}
      whileTap={{ scale: 0.98 }}
    >
      <article className="video-card">
        <div className="video-thumbnail-link" onClick={handleClick}>
          <div className="video-thumbnail">
            <video
              ref={videoRef || posterVideoRef}
              src={video.videoUrl}
              className="absolute inset-0 w-full h-full object-cover"
              muted
              playsInline
              preload="auto"
              loop
              autoPlay={!!videoRef}
              poster=""
              onLoadedMetadata={(e) => {
                const video = e.currentTarget;
                if (video.readyState >= 2) {
                  video.currentTime = 0.1;
                }
              }}
              onCanPlay={(e) => {
                const video = e.currentTarget;
                if (video.currentTime === 0) {
                  video.currentTime = 0.1;
                }
              }}
            />
            {!isPlaying && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                <div className="play-button">
                  <div className="w-[50px] h-[50px] md:w-[56px] md:h-[56px] rounded-full bg-black/85 flex items-center justify-center">
                    <PlayIcon size={24} className="text-white ml-1" accentColor="white" />
                  </div>
                </div>
              </div>
            )}
            {video.overlayText && (
              <div className="video-overlay-text">
                {video.overlayText.location && (
                  <div className="overlay-location">{video.overlayText.location}</div>
                )}
                {video.overlayText.date && (
                  <div className="overlay-date">{video.overlayText.date}</div>
                )}
                {video.overlayText.quote && (
                  <div className="overlay-quote">{video.overlayText.quote}</div>
                )}
                {video.overlayText.source && (
                  <div className="overlay-source">{video.overlayText.source}</div>
                )}
                {video.overlayText.author && (
                  <div className="overlay-author">{video.overlayText.author}</div>
                )}
                {video.overlayText.role && (
                  <div className="overlay-role">{video.overlayText.role}</div>
                )}
              </div>
            )}
          </div>
        </div>
        <h3 className="video-title flex-shrink-0">
          {video.title.trim()}
        </h3>
      </article>
    </motion.div>
  );
}

function VideoPlayerModal({
  video,
  isOpen,
  onClose,
  onPrevious,
  onNext,
  hasPrevious,
  hasNext,
}: {
  video: VideoItem;
  isOpen: boolean;
  onClose: () => void;
  onPrevious: () => void;
  onNext: () => void;
  hasPrevious: boolean;
  hasNext: boolean;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const scrollPositionRef = useRef<{ x: number; y: number } | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen && videoRef.current) {
      // Small delay to ensure modal is rendered before playing video
      const playTimer = setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.load();
          videoRef.current.play().catch(() => {
            // Ignore autoplay errors
          });
        }
      }, 300); // Delay to match animation
      return () => clearTimeout(playTimer);
    }
  }, [isOpen, video.id]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowUp' && hasPrevious) {
        e.preventDefault();
        onPrevious();
      } else if (e.key === 'ArrowDown' && hasNext) {
        e.preventDefault();
        onNext();
      }
    };

    if (isOpen) {
      // Save current scroll position only if not already saved
      if (!scrollPositionRef.current) {
        scrollPositionRef.current = {
          x: window.scrollX,
          y: window.scrollY,
        };
      }

      const scrollY = scrollPositionRef.current.y;

      // Save original styles
      const originalOverflow = document.body.style.overflow;
      const originalPosition = document.body.style.position;
      const originalTop = document.body.style.top;
      const originalWidth = document.body.style.width;

      // Prevent body scroll while keeping scroll position
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';

      document.addEventListener('keydown', handleKeyDown);

      return () => {
        document.removeEventListener('keydown', handleKeyDown);

        // Restore original styles
        document.body.style.overflow = originalOverflow || '';
        document.body.style.position = originalPosition || '';
        document.body.style.top = originalTop || '';
        document.body.style.width = originalWidth || '';

        // Restore scroll position
        if (scrollPositionRef.current) {
          window.scrollTo(scrollPositionRef.current.x, scrollPositionRef.current.y);
          scrollPositionRef.current = null; // Clear after restoring
        }
      };
    }

    return () => { };
  }, [isOpen, hasPrevious, hasNext, onClose, onPrevious, onNext]);

  // Animation variants for professional modal effects
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.3,
        ease: [0.4, 0, 0.2, 1],
      },
    },
    exit: {
      opacity: 0,
      transition: {
        duration: 0.2,
        ease: [0.4, 0, 1, 1],
      },
    },
  };

  const videoContainerVariants = {
    hidden: {
      opacity: 0,
      scale: 0.8,
      y: 20,
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
        delay: 0.1,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.9,
      y: 10,
      transition: {
        duration: 0.2,
        ease: [0.4, 0, 1, 1],
      },
    },
  };

  const buttonVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 25,
        delay: 0.2,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      transition: { duration: 0.15 },
    },
  };

  if (!mounted) {
    return null;
  }

  const modalContent = (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div
          key="modal-backdrop"
          className="video-player-modal fixed inset-0 bg-black flex items-center justify-center"
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={backdropVariants}
          style={{
            zIndex: 999999,
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: '#000',
            margin: 0,
            padding: 0,
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              onClose();
            }
          }}
        >
          {/* Close Button */}
          <motion.button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onClose();
            }}
            className={cn(
              "absolute top-4 right-4 transition-colors p-2 border-none outline-none bg-transparent",
              colors.foreground.inverse,
              colors.foreground.inverseHover
            )}
            style={{ zIndex: 1000000 }}
            variants={buttonVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Close video player"
          >
            <CloseIcon size={24} />
          </motion.button>

          {/* Navigation Buttons */}
          <motion.div
            className="absolute right-8 top-1/2 -translate-y-1/2 flex flex-col gap-4"
            style={{ zIndex: 1000000 }}
            variants={buttonVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <motion.button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onPrevious();
              }}
              disabled={!hasPrevious}
              className={cn(
                "transition-opacity border-none outline-none bg-transparent",
                colors.foreground.inverse,
                hasPrevious ? "opacity-100 hover:opacity-80 cursor-pointer" : "opacity-30 cursor-not-allowed"
              )}
              whileHover={hasPrevious ? { scale: 1.1 } : {}}
              whileTap={hasPrevious ? { scale: 0.95 } : {}}
              aria-label="Previous video"
            >
              <div className="w-8 h-8 rounded-full bg-black/50 flex items-center justify-center text-white">
                <ArrowLeftIcon size={20} accentColor="white" />
              </div>
            </motion.button>
            <motion.button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onNext();
              }}
              disabled={!hasNext}
              className={cn(
                "transition-opacity border-none outline-none bg-transparent",
                colors.foreground.inverse,
                hasNext ? "opacity-100 hover:opacity-80 cursor-pointer" : "opacity-30 cursor-not-allowed"
              )}
              whileHover={hasNext ? { scale: 1.1 } : {}}
              whileTap={hasNext ? { scale: 0.95 } : {}}
              aria-label="Next video"
            >
              <div className="w-8 h-8 rounded-full bg-black/50 flex items-center justify-center text-white">
                <ArrowRightIcon size={20} accentColor="white" />
              </div>
            </motion.button>
          </motion.div>

          {/* Video Player */}
          <motion.div
            className="w-full h-full flex items-center justify-center max-w-7xl mx-auto px-4 video-container-visible"
            variants={videoContainerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <video
              ref={videoRef}
              src={video.videoUrl}
              controls
              autoPlay
              playsInline
              className="w-full h-full max-h-[90vh] object-contain"
              onEnded={() => {
                if (hasNext) {
                  setTimeout(() => onNext(), 500);
                }
              }}
              onLoadedMetadata={() => {
                // Ensure video is visible when metadata loads
                if (videoRef.current && isOpen) {
                  videoRef.current.style.opacity = '1';
                  videoRef.current.style.visibility = 'visible';
                  videoRef.current.style.display = 'block';
                }
              }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  // Render modal via portal to document.body to bypass any parent container constraints
  return createPortal(modalContent, document.body);
}

export default function VideoSection() {
  const [selectedVideoIndex, setSelectedVideoIndex] = useState<number | null>(null);
  const [isInView, setIsInView] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const firstVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsInView(entry.isIntersecting);
        });
      },
      {
        threshold: 0.5,
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (firstVideoRef.current) {
      if (isInView) {
        firstVideoRef.current.play().catch(() => {
          // Ignore autoplay errors
        });
      } else {
        firstVideoRef.current.pause();
      }
    }
  }, [isInView]);

  const handlePlay = (index: number) => {
    console.log('[VideoSection] handlePlay called with index:', index);
    setSelectedVideoIndex(index);
  };

  const handleClose = () => {
    setSelectedVideoIndex(null);
  };

  const handlePrevious = () => {
    if (selectedVideoIndex !== null && selectedVideoIndex > 0) {
      setSelectedVideoIndex(selectedVideoIndex - 1);
    }
  };

  const handleNext = () => {
    if (selectedVideoIndex !== null && selectedVideoIndex < videos.length - 1) {
      setSelectedVideoIndex(selectedVideoIndex + 1);
    }
  };

  const currentVideo = selectedVideoIndex !== null ? videos[selectedVideoIndex] : null;
  const hasPrevious = selectedVideoIndex !== null && selectedVideoIndex > 0;
  const hasNext = selectedVideoIndex !== null && selectedVideoIndex < videos.length - 1;

  console.log('[VideoSection] selectedVideoIndex:', selectedVideoIndex, 'currentVideo:', currentVideo?.id);

  return (
    <>
      <div className="content-widget pt-8 md:pt-10 lg:pt-12" ref={sectionRef}>
        <div className="container">
          <div className="max-w-7xl mx-auto">
            <SectionHeader title="Watch Today's Videos" />
          </div>
        </div>
        <div className="w-full mt-6">
          <Swiper
            spaceBetween={20}
            slidesPerView={1.5}
            loop={false}
            speed={600}
            grabCursor={true}
            breakpoints={{
              480: {
                slidesPerView: 2,
                spaceBetween: 20,
              },
              640: {
                slidesPerView: 2.5,
                spaceBetween: 24,
              },
              768: {
                slidesPerView: 3,
                spaceBetween: 24,
              },
              1024: {
                slidesPerView: 3.5,
                spaceBetween: 32,
              },
              1280: {
                slidesPerView: 4,
                spaceBetween: 40,
              },
            }}
            className="videos-swiper pb-12"
          >
            {videos.map((video, index) => (
              <SwiperSlide key={video.id}>
                <VideoCard
                  video={video}
                  onPlay={() => handlePlay(index)}
                  videoRef={index === 0 ? firstVideoRef : undefined}
                  index={index}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
        <div className="divider-2 mt-8 md:mt-12"></div>
      </div>

      {currentVideo && (
        <VideoPlayerModal
          video={currentVideo}
          isOpen={selectedVideoIndex !== null}
          onClose={handleClose}
          onPrevious={handlePrevious}
          onNext={handleNext}
          hasPrevious={hasPrevious}
          hasNext={hasNext}
        />
      )}
    </>
  );
}
