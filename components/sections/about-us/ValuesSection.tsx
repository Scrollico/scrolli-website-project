"use client";

import { Container } from "@/components/responsive";
import {
  sectionPadding,
  colors,
  typography,
  fontWeight
} from "@/lib/design-tokens";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

type ValueType = {
  index: string;
  title: string;
  description: string;
};

const values: ValueType[] = [
  {
    index: "01",
    title: "Innovation",
    description:
      "We design product-focused, innovative projects that are built on the foundation of innovation in journalism.",
  },
  {
    index: "02",
    title: "Impact",
    description:
      "We go beyond headlines and simply delivering information. We uncover the meaning and context behind the facts.",
  },
  {
    index: "03",
    title: "Transformation",
    description:
      "We make media transformation sustainable by going beyond news, integrating advertising, marketing, and product development.",
  },
];

export default function ValuesSection() {
  return (
    <section className={cn(sectionPadding.xl, colors.background.base)}>
      <Container size="lg" padding="lg">
        <div className="divide-y divide-gray-200 dark:divide-gray-800">
          {values.map((value, i) => (
            <motion.div
              key={value.index}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="grid grid-cols-12 gap-x-8 py-10 md:py-12"
            >
              <span className={cn(
                "col-span-1 tabular-nums",
                typography.bodySmall,
                colors.foreground.muted,
                fontWeight.light
              )}>
                {value.index}
              </span>
              <h3 className={cn(
                "col-span-11 md:col-span-3",
                typography.h5,
                colors.foreground.primary,
                fontWeight.medium,
                "mb-3 md:mb-0"
              )}>
                {value.title}
              </h3>
              <p className={cn(
                "col-span-11 md:col-span-8 md:col-start-5",
                typography.bodySmall,
                colors.foreground.secondary,
                fontWeight.light,
                "leading-relaxed"
              )}>
                {value.description}
              </p>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
