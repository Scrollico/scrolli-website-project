"use client";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { ReactNode, useEffect } from "react";

interface PageTransitionProps {
  children: ReactNode;
}

const pageVariants = {
  initial: {
    opacity: 0,
    y: 10, // Reduced from 30px for faster animation
  },
  animate: {
    opacity: 1,
    y: 0,
  },
  exit: {
    opacity: 0,
    y: -10, // Reduced from -30px for faster animation
  },
};

const pageTransition = {
  type: "tween",
  ease: [0.4, 0, 0.2, 1], // Faster easing curve
  duration: 0.2, // Reduced from 0.6s to 0.2s for instant feel
};

export default function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();

  useEffect(() => {
    // Scroll to top on page transition
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "instant" });
    }
  }, [pathname]);

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        initial="initial"
        animate="animate"
        exit="exit"
        variants={pageVariants}
        transition={pageTransition}
        className="w-full"
        style={{ willChange: 'opacity, transform' }} // Optimize for GPU acceleration
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
