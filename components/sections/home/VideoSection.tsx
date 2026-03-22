"use client";
import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
// SmartButton import removed as unused
import { Swiper, SwiperSlide } from 'swiper/react';
import { SectionHeader } from "@/components/ui/SectionHeader";
import 'swiper/css';
import { colors, sectionPadding, gap } from "@/lib/design-tokens";
import { cn } from "@/lib/utils";
import { PlayIcon, CloseIcon, ArrowLeftIcon, ArrowRightIcon } from "@/components/icons/scrolli-icons";

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

/** Hardcoded fallback videos — used when CMS data is unavailable */
const FALLBACK_VIDEOS: VideoItem[] = [
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

interface VideoSectionProps {
  /** CMS video data. Falls back to hardcoded videos if empty or undefined. */
  videos?: VideoItem[];
}

function VideoCard({
  video,
  onPlay,
  videoRef,
  index = 0,
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

  useEffect(() => {
    const videoElement = posterVideoRef.current;
    if (!videoElement) return undefined;

    // Remove videoElement.load() to prevent aggressive preloading

    const handleCanPlay = () => {
      // Logic to set preview frame
      if (videoElement.readyState >= 2 && videoElement.currentTime === 0) {
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
    // videoElement.load(); // Removed aggressive load

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

  return (
    <motion.div
      className="video-card-wrapper"
      ref={cardRef}
      initial={{ opacity: 0, scale: 0.7, y: 140 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{
        type: "spring",
        stiffness: 120,
        damping: 18,
        mass: 0.8,
        delay: Math.min(index * 0.06, 0.25),
      }}
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
              preload="metadata"
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
                  <div className="w-[50px] h-[50px] md:w-[56px] md:h-[56px] rounded-full bg-[#8080FF] flex items-center justify-center">
                    <PlayIcon size={24} className="text-[#F8F5E3] ml-1" />
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
  // scrollPositionRef removed as we use simple overflow: hidden now
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
    return undefined;
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
      // Prevent body scroll simply to avoid layout shifts (flicker)
      document.body.style.overflow = 'hidden';

      document.addEventListener('keydown', handleKeyDown);

      return () => {
        document.removeEventListener('keydown', handleKeyDown);
        document.body.style.overflow = '';
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
            className={cn("absolute right-8 top-1/2 -translate-y-1/2 flex flex-col", gap.lg)}
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
                <ArrowLeftIcon size={20} />
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
                <ArrowRightIcon size={20} />
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

export default function VideoSection({ videos: cmsVideos }: VideoSectionProps = {}) {
  const videos = cmsVideos && cmsVideos.length > 0 ? cmsVideos : FALLBACK_VIDEOS;
  const [selectedVideoIndex, setSelectedVideoIndex] = useState<number | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const firstVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const isVisible = entry.isIntersecting;
          if (isVisible && firstVideoRef.current) {
            firstVideoRef.current.play().catch(() => {
              // Ignore autoplay errors
            });
          } else if (!isVisible && firstVideoRef.current) {
            firstVideoRef.current.pause();
          }
        });
      },
      {
        threshold: 0.3,
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

  // Removed continuous rendering log to reduce console noise and minor CPU cycles
  // console.log('[VideoSection] selectedVideoIndex:', selectedVideoIndex, 'currentVideo:', currentVideo?.id);

  return (
    <>
      <div className={cn("content-widget", sectionPadding.md)} ref={sectionRef}>
        <div className="container">
          <div className="max-w-7xl mx-auto">
            <SectionHeader title="Watch Today's Videos" />
          </div>
        </div>
        <motion.div
          className="w-full mt-6"
          initial={{ scale: 0.92, opacity: 0.7 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{
            duration: 0.7,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
        >
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
        </motion.div>
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
