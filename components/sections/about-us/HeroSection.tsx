"use client";

import Image from "next/image";
import { Container } from "@/components/responsive";
import { Heading, Text } from "@/components/ui/typography";
import {
  sectionPadding,
  gap,
  colors,
  borderRadius,
} from "@/lib/design-tokens";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export default function HeroSection() {
  return (
    <section
      className={cn(sectionPadding.xl, colors.background.base)}
    >
      <Container size="lg" padding="lg">
        <div className={cn("flex flex-col", gap.xl)}>
          {/* Content at top - centered */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className={cn(
              "flex flex-col items-center text-center",
              gap.md,
              "py-8 md:py-12 lg:py-16",
              "px-4 md:px-6 lg:px-8"
            )}
          >
            <Heading level={2} variant="h2" color="primary">
              Scrolli
            </Heading>
            <Text
              variant="bodyLarge"
              color="secondary"
              className="max-w-3xl"
            >
              We are a new-generation media company based in Istanbul and
              London, focused on impact and innovation. By placing accuracy,
              depth, and technology at the heart of journalism, we embrace a
              publishing approach that adds value to information.
            </Text>
          </motion.div>

          {/* Full-width image below */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className={cn("relative w-full aspect-video md:aspect-[21/9]", borderRadius.lg, "overflow-hidden")}
          >
            <Image
              src="https://cdn.prod.website-files.com/63b053ef35937392bd426a55/67965c7b0ad59049d74d0c05_Open%20Laptop%20Minimal%20Office%20Nov%2027.webp"
              alt="Office workspace with laptop"
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px"
            />
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
