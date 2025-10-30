"use client";

import { cn } from "@/lib/utils";
import { motion, useAnimation } from "framer-motion";
import { ReactNode, useEffect } from "react";

interface MarqueeProps {
  children: ReactNode;
  className?: string;
  reverse?: boolean;
  pauseOnHover?: boolean;
  vertical?: boolean;
  repeat?: number;
}

export default function Marquee({
  children,
  className,
  reverse = false,
  repeat = 4,
}: MarqueeProps) {
  const controls = useAnimation();

  useEffect(() => {
    controls.start({
      x: reverse ? "100%" : "-100%",
      transition: {
        duration: 20,
        repeat: Infinity,
        ease: "linear",
      },
    });
  }, [controls, reverse]);

  return (
    <div
      className={cn(
        "group relative flex overflow-hidden p-2 [--duration:40s] [--gap:1rem]",
        className,
      )}
    >
      <motion.div
        animate={controls}
        className="flex w-max min-w-full shrink-0 items-center justify-around gap-[--gap]"
        style={{
          transform: reverse ? "translateX(100%)" : "translateX(0%)",
        }}
      >
        {Array.from({ length: repeat }).map((_, i) => (
          <div key={i} className="flex shrink-0 items-center justify-center gap-[--gap]">
            {children}
          </div>
        ))}
      </motion.div>
    </div>
  );
}
