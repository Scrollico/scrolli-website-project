"use client";

import { Container } from "@/components/responsive";
import { 
  sectionPadding, 
  gap, 
  colors,
  componentPadding,
  typography,
  fontWeight
} from "@/lib/design-tokens";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Lightbulb, Target, Cog } from "lucide-react";
import React from "react";

type FeatureType = {
  title: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  description: string;
};

interface FeatureCardProps {
  feature: FeatureType;
  className?: string;
}

const values: FeatureType[] = [
  {
    title: "Innovation",
    icon: Lightbulb,
    description:
      "We design product-focused, innovative projects that are built on the foundation of innovation in journalism.",
  },
  {
    title: "Impact",
    icon: Target,
    description:
      "We go beyond headlines and simply delivering information. We uncover the meaning and context behind the facts.",
  },
  {
    title: "Transformation",
    icon: Cog,
    description:
      "We make media transformation sustainable by going beyond news, integrating advertising, marketing, and product development.",
  },
];

function FeatureCard({ feature, className }: FeatureCardProps) {
  const [pattern, setPattern] = React.useState<number[][]>([]);

  React.useEffect(() => {
    setPattern(genRandomPattern());
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6 }}
      className={cn(
        'relative overflow-hidden',
        componentPadding.md,
        colors.background.base,
        className
      )}
    >
      <div className="pointer-events-none absolute top-0 left-1/2 -mt-2 -ml-20 h-full w-full [mask-image:linear-gradient(white,transparent)]">
        <div className="from-gray-900/5 to-gray-900/1 absolute inset-0 bg-gradient-to-r [mask-image:radial-gradient(farthest-side_at_top,white,transparent)] opacity-100">
          <GridPattern
            width={20}
            height={20}
            x="-12"
            y="4"
            squares={pattern}
            className="fill-gray-900/5 stroke-gray-900/25 absolute inset-0 h-full w-full mix-blend-overlay"
          />
        </div>
      </div>
      <feature.icon className={cn(colors.foreground.muted, "size-6")} strokeWidth={1} aria-hidden />
      <h3 className={cn(
        "mt-10",
        typography.h6,
        colors.foreground.primary,
        fontWeight.medium
      )}>{feature.title}</h3>
      <p className={cn(
        colors.foreground.secondary,
        "relative z-20 mt-2",
        typography.bodySmall,
        fontWeight.light
      )}>{feature.description}</p>
    </motion.div>
  );
}

function GridPattern({
  width,
  height,
  x,
  y,
  squares,
  ...props
}: React.ComponentProps<'svg'> & { width: number; height: number; x: string; y: string; squares?: number[][] }) {
  const patternId = React.useId();

  return (
    <svg aria-hidden="true" {...props}>
      <defs>
        <pattern id={patternId} width={width} height={height} patternUnits="userSpaceOnUse" x={x} y={y}>
          <path d={`M.5 ${height}V.5H${width}`} fill="none" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" strokeWidth={0} fill={`url(#${patternId})`} />
      {squares && (
        <svg x={x} y={y} className="overflow-visible">
          {squares.map(([x, y], index) => (
            <rect strokeWidth="0" key={index} width={width + 1} height={height + 1} x={x * width} y={y * height} />
          ))}
        </svg>
      )}
    </svg>
  );
}

function genRandomPattern(length?: number): number[][] {
  length = length ?? 5;
  return Array.from({ length }, () => [
    Math.floor(Math.random() * 4) + 7, // random x between 7 and 10
    Math.floor(Math.random() * 6) + 1, // random y between 1 and 6
  ]);
}

export default function ValuesSection() {
  return (
    <section className={cn(sectionPadding.xl, colors.background.base)}>
      <Container size="lg" padding="lg">
        <div className={cn("grid grid-cols-1 md:grid-cols-3", gap.lg)}>
          {values.map((value) => (
            <FeatureCard
              key={value.title}
              feature={value}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}
