"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Container } from "@/components/responsive";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Heading, Text } from "@/components/ui/typography";
import { sectionPadding } from "@/lib/design-tokens";
import { cn } from "@/lib/utils";

export interface PodcastItem {
  id: string | number;
  title: string;
  host: {
    name: string;
    title: string;
  };
  platform: string;
  spotify_url: string;
  image_url: string;
}

export interface PodcastGalleryProps {
  title?: string;
  subtitle?: string;
  description?: string;
  items: PodcastItem[];
}

export function PodcastGallery({
  title = "Podcast",
  subtitle,
  description,
  items = [],
}: PodcastGalleryProps) {
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (!carouselApi) {
      return;
    }

    const updateSelection = () => {
      setCanScrollPrev(carouselApi.canScrollPrev());
      setCanScrollNext(carouselApi.canScrollNext());
      setCurrentSlide(carouselApi.selectedScrollSnap());
    };

    updateSelection();
    carouselApi.on("select", updateSelection);
    return () => {
      carouselApi.off("select", updateSelection);
    };
  }, [carouselApi]);

  return (
    <section className={sectionPadding.xl}>
      <Container size="xl">
        {/* Header */}
        <div className="flex items-end justify-between md:mb-14 lg:mb-16">
          <SectionHeader
            title={title}
            subtitle={subtitle}
            description={description}
            className="flex-1"
          />
          <div className="hidden shrink-0 gap-2 md:flex dark:!bg-gray-800 dark:!text-white" data-podcast-nav="true">
            <Button
              size="icon"
              variant="ghost"
              onClick={() => {
                carouselApi?.scrollPrev();
              }}
              disabled={!canScrollPrev}
              className="disabled:pointer-events-auto"
            >
              <ArrowLeft className="size-5" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => {
                carouselApi?.scrollNext();
              }}
              disabled={!canScrollNext}
              className="disabled:pointer-events-auto"
            >
              <ArrowRight className="size-5" />
            </Button>
          </div>
        </div>
      </Container>

      <div className="w-full">
        <Carousel
          setApi={setCarouselApi}
          opts={{
            breakpoints: {
              "(max-width: 768px)": {
                dragFree: true,
              },
            },
          }}
        >
          <CarouselContent className="ml-0 2xl:ml-[max(8rem,calc(50vw-700px))] 2xl:mr-[max(0rem,calc(50vw-700px))]">
            {items.map((item) => (
              <CarouselItem
                key={item.id}
                className="max-w-[320px] pl-[20px] lg:max-w-[360px]"
              >
                <Link
                  href={item.spotify_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group rounded-xl"
                >
                  <div className="group relative h-full min-h-[27rem] max-w-full overflow-hidden rounded-xl md:aspect-[5/4] lg:aspect-[16/9]">
                    <Image
                      src={item.image_url}
                      alt={item.title}
                      fill
                      className="absolute h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
                      sizes="(max-width: 640px) 280px, (max-width: 1024px) 320px, 360px"
                    />

                    {/* Gradient overlay - similar to Gallery4 */}
                    <div className="absolute inset-0 h-full bg-gradient-to-t from-black/80 via-black/40 to-transparent dark:from-black/90 dark:via-black/50 dark:to-transparent" />

                    {/* Text overlay at bottom */}
                    <div className="absolute inset-x-0 bottom-0 flex flex-col items-start p-6 md:p-8">
                      {/* Host info */}
                      <Text
                        variant="bodySmall"
                        className="mb-2 text-white/90 dark:text-gray-300"
                      >
                        {item.host.name} · {item.host.title}
                      </Text>
                      
                      {/* Title */}
                      <Heading
                        level={3}
                        variant="h4"
                        className="mb-2 pt-4 md:mb-3 md:pt-4 lg:pt-4 text-white dark:text-white"
                      >
                        {item.title}
                      </Heading>

                      {/* Read more link */}
                      <Text
                        variant="bodySmall"
                        className="mb-8 flex items-center md:mb-12 lg:mb-9 text-white dark:text-white transition-colors group-hover:text-white/80"
                      >
                        Listen on Spotify{" "}
                        <ArrowRight className="ml-2 size-5 transition-transform group-hover:translate-x-1" />
                      </Text>
                    </div>
                  </div>
                </Link>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

        {/* Pagination Dots */}
        <div className="mt-8 flex justify-center gap-2">
          {items.map((_, index) => (
            <button
              key={index}
              className={cn(
                "h-2 w-2 rounded-full transition-colors",
                currentSlide === index
                  ? "bg-primary dark:bg-primary"
                  : "bg-primary/20 dark:bg-primary/20"
              )}
              onClick={() => carouselApi?.scrollTo(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

