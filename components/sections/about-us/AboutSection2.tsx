"use client";

import { TimelineContent } from "@/components/ui/timeline-animation";
import { useRef } from "react";
import { Container } from "@/components/responsive";
import { 
  sectionPadding, 
  gap, 
  colors,
  borderRadius,
  typography,
  fontWeight
} from "@/lib/design-tokens";
import { cn } from "@/lib/utils";

export default function AboutSection2() {
  const heroRef = useRef<HTMLDivElement>(null);

  const revealVariants = {
    visible: (i: number) => ({
      y: 0,
      opacity: 1,
      filter: "blur(0px)",
      transition: {
        delay: i * 1.5,
        duration: 0.7,
      },
    }),
    hidden: {
      filter: "blur(10px)",
      y: 40,
      opacity: 0,
    },
  };

  const textVariants = {
    visible: (i: number) => ({
      filter: "blur(0px)",
      opacity: 1,
      transition: {
        delay: i * 0.3,
        duration: 0.7,
      },
    }),
    hidden: {
      filter: "blur(10px)",
      opacity: 0,
    },
  };

  return (
    <section className={cn(sectionPadding.xl, colors.background.elevated)}>
      <Container size="lg" padding="lg">
        <div className={cn("flex flex-col lg:flex-row items-start", gap.lg)} ref={heroRef}>
          {/* Content */}
          <div className={cn("flex-1", "px-4 md:px-6 lg:px-8", "py-4 md:py-6")}>
            <TimelineContent
              as="h2"
              animationNum={0}
              timelineRef={heroRef}
              customVariants={revealVariants}
              className={cn(
                typography.h2,
                fontWeight.semibold,
                colors.foreground.primary,
                "!leading-[110%] mb-8"
              )}
            >
              We are{" "}
              <TimelineContent
                as="span"
                animationNum={1}
                timelineRef={heroRef}
                customVariants={textVariants}
                className={cn(
                  "text-green-600 dark:text-green-400 border-2 border-green-500 dark:border-green-400 inline-block xl:h-16 border-dotted px-3 pt-0 pb-1",
                  borderRadius.md,
                  "align-middle"
                )}
              >
                rethinking
              </TimelineContent>{" "}
              media to be more impactful and always{" "}
              <TimelineContent
                as="span"
                animationNum={2}
                timelineRef={heroRef}
                customVariants={textVariants}
                className={cn(
                  "text-[#374152] dark:text-[#374152] border-2 border-[#374152] dark:border-[#374152] inline-block xl:h-16 border-dotted px-3 pt-0 pb-1",
                  borderRadius.md,
                  "align-middle"
                )}
              >
                audience-first
              </TimelineContent>
              . Our goal is to continually raise the bar and{" "}
              <TimelineContent
                as="span"
                animationNum={3}
                timelineRef={heroRef}
                customVariants={textVariants}
                className={cn(
                  "text-orange-600 dark:text-orange-400 border-2 border-orange-500 dark:border-orange-400 inline-block xl:h-16 border-dotted px-3 pt-0 pb-1",
                  borderRadius.md,
                  "align-middle"
                )}
              >
                challenge
              </TimelineContent>{" "}
              how journalism could{" "}
              <TimelineContent
                as="span"
                animationNum={4}
                timelineRef={heroRef}
                customVariants={textVariants}
                className={cn(
                  "text-green-600 dark:text-green-400 border-2 border-green-500 dark:border-green-400 inline-block xl:h-16 border-dotted px-3 pt-0 pb-1",
                  borderRadius.md,
                  "align-middle"
                )}
              >
                work for you
              </TimelineContent>
              .
            </TimelineContent>

            <div className={cn("mt-12", gap.md)}>
              <TimelineContent
                as="div"
                animationNum={5}
                timelineRef={heroRef}
                customVariants={textVariants}
                className={typography.bodyLarge}
              >
                <div className={cn(
                  fontWeight.medium,
                  colors.foreground.primary,
                  "mb-1 capitalize"
                )}>
                  We are Scrolli and we will
                </div>
                <div className={cn(
                  colors.foreground.secondary,
                  fontWeight.semibold,
                  "uppercase"
                )}>
                  take you deeper
                </div>
              </TimelineContent>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
