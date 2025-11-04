"use client";
import { useState, useRef, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';

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
  videoRef
}: {
  video: VideoItem;
  onPlay: () => void;
  videoRef?: React.RefObject<HTMLVideoElement>;
}) {
  const posterVideoRef = useRef<HTMLVideoElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const videoElement = posterVideoRef.current;
    if (!videoElement) return undefined;
      // Ensure video loads and shows first frame
      videoElement.load();
      const handleCanPlay = () => {
        if (videoElement.readyState >= 2) {
          videoElement.currentTime = 0.1;
        }
      };
      
      const handlePlaying = () => {
        setIsPlaying(true);
        console.log('Video is playing');
      };
      
      const handlePause = () => {
        setIsPlaying(false);
        console.log('Video is paused');
      };

      const handlePlay = () => {
        setIsPlaying(true);
        console.log('Video play event');
      };

      const handleLoadedData = () => {
        console.log('Video loaded, readyState:', videoElement.readyState);
      };

      videoElement.addEventListener('canplay', handleCanPlay);
      videoElement.addEventListener('loadedmetadata', handleCanPlay);
      videoElement.addEventListener('loadeddata', handleLoadedData);
      videoElement.addEventListener('playing', handlePlaying);
      videoElement.addEventListener('play', handlePlay);
      videoElement.addEventListener('pause', handlePause);
      
      return () => {
        videoElement.removeEventListener('canplay', handleCanPlay);
        videoElement.removeEventListener('loadedmetadata', handleCanPlay);
        videoElement.removeEventListener('loadeddata', handleLoadedData);
        videoElement.removeEventListener('playing', handlePlaying);
        videoElement.removeEventListener('play', handlePlay);
        videoElement.removeEventListener('pause', handlePause);
      };
  }, [video.videoUrl]);

  // Autoplay first video when it enters viewport
  useEffect(() => {
    if (!videoRef || !videoRef.current) return undefined;

    const videoElement = videoRef.current;
    
    // Force video to load
    videoElement.load();
    
    // Wait for video to be ready, then play
    const tryPlay = () => {
      if (videoElement.readyState >= 3) { // HAVE_FUTURE_DATA or higher
        console.log('Video ready, attempting autoplay');
        const playPromise = videoElement.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              console.log('Autoplay successful');
              setIsPlaying(true);
            })
            .catch((error) => {
              console.error('Autoplay blocked:', error);
              setIsPlaying(false);
            });
        }
      } else {
        // Wait a bit more
        setTimeout(tryPlay, 100);
      }
    };

    const handleCanPlayThrough = () => {
      console.log('Video can play through');
      const playPromise = videoElement.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            console.log('Autoplay successful (canPlayThrough)');
            setIsPlaying(true);
          })
          .catch((error) => {
            console.error('Autoplay blocked (canPlayThrough):', error);
            setIsPlaying(false);
          });
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            console.log('Video in viewport, readyState:', videoElement.readyState);
            videoElement.addEventListener('canplaythrough', handleCanPlayThrough, { once: true });
            tryPlay();
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
    <div className="video-card-wrapper" ref={cardRef}>
      <article className="video-card">
        <div className="video-thumbnail-link" onClick={onPlay}>
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
                // Show first frame
                const video = e.currentTarget;
                if (video.readyState >= 2) {
                  video.currentTime = 0.1;
                }
              }}
              onCanPlay={(e) => {
                // Ensure first frame is shown
                const video = e.currentTarget;
                if (video.currentTime === 0) {
                  video.currentTime = 0.1;
                }
              }}
            />
            {!isPlaying && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                <div className="play-button">
                  <svg width="50" height="50" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="md:w-[56px] md:h-[56px]">
                    <circle cx="24" cy="24" r="22" fill="#000" fillOpacity="0.85"/>
                    <path d="M18 16L30 24L18 32V16Z" fill="#fff"/>
                  </svg>
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
    </div>
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
  const modalRef = useRef<HTMLDivElement>(null);
  const [genieState, setGenieState] = useState<'entering' | 'exiting' | 'idle'>('idle');

  useEffect(() => {
    if (isOpen) {
      setGenieState('entering');
      if (videoRef.current) {
        videoRef.current.play().catch(console.error);
      }
      return undefined;
    } else {
      setGenieState('exiting');
      const timer = setTimeout(() => {
        setGenieState('idle');
      }, 300); // Match animation duration
      return () => clearTimeout(timer);
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
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, hasPrevious, hasNext, onClose, onPrevious, onNext]);

  if (!isOpen && genieState === 'idle') return null;

  return (
    <div 
      ref={modalRef}
      className={`video-player-modal fixed inset-0 z-[9999] bg-black flex items-center justify-center ${
        genieState === 'entering' ? 'genie-entering' : genieState === 'exiting' ? 'genie-exiting' : ''
      }`}
    >
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-50 text-white hover:text-gray-300 transition-colors p-2 border-none outline-none bg-transparent"
        aria-label="Close video player"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {/* Navigation Buttons */}
      <div className="absolute right-8 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-4">
        <button
          onClick={onPrevious}
          disabled={!hasPrevious}
          className={`text-white transition-opacity border-none outline-none bg-transparent ${
            hasPrevious ? 'opacity-100 hover:opacity-80 cursor-pointer' : 'opacity-30 cursor-not-allowed'
          }`}
          aria-label="Previous video"
        >
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="16" cy="16" r="15" fill="rgba(0,0,0,0.5)" stroke="white" strokeWidth="1"/>
            <path d="M16 10L10 16L16 22" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
          </svg>
        </button>
        <button
          onClick={onNext}
          disabled={!hasNext}
          className={`text-white transition-opacity border-none outline-none bg-transparent ${
            hasNext ? 'opacity-100 hover:opacity-80 cursor-pointer' : 'opacity-30 cursor-not-allowed'
          }`}
          aria-label="Next video"
        >
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="16" cy="16" r="15" fill="rgba(0,0,0,0.5)" stroke="white" strokeWidth="1"/>
            <path d="M16 10L22 16L16 22" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
          </svg>
        </button>
      </div>

      {/* Video Player */}
      <div className="w-full h-full flex items-center justify-center max-w-7xl mx-auto px-4">
        <video
          ref={videoRef}
          src={video.videoUrl}
          controls
          autoPlay
          className="w-full h-full max-h-[90vh] object-contain"
          onEnded={() => {
            if (hasNext) {
              setTimeout(() => onNext(), 500);
            }
          }}
        />
      </div>

    </div>
  );
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
        threshold: 0.5, // Trigger when 50% of the section is visible
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
        firstVideoRef.current.play().catch(console.error);
      } else {
        firstVideoRef.current.pause();
      }
    }
  }, [isInView]);

  const handlePlay = (index: number) => {
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

  return (
    <>
      <div className="content-widget" ref={sectionRef}>
        <div className="container">
          <div className="max-w-7xl mx-auto mb-8">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold tracking-tight text-black dark:text-white mb-4">Watch Today's Videos</h2>
            <div className="w-12 h-0.5 bg-primary"></div>
          </div>
        </div>
        <div className="w-full mt-6">
          <Swiper
              spaceBetween={20}
              slidesPerView={1.5}
              loop={false}
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
