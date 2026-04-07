"use client";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { ReactNode, useCallback, useEffect, useRef } from "react";

interface PageTransitionProps {
  children: ReactNode;
}

const pageVariants = {
  initial: {
    opacity: 0,
    y: 10,
  },
  animate: {
    opacity: 1,
    y: 0,
  },
  exit: {
    opacity: 0,
    y: -10,
  },
};

const pageTransition = {
  type: "tween",
  ease: [0.4, 0, 0.2, 1],
  duration: 0.2,
};

/**
 * Clear will-change and transform from the PageTransition wrapper.
 * Persistent will-change:transform creates a new CSS containing block
 * that breaks position:sticky and position:fixed for ALL descendants.
 * We need it during animation for GPU acceleration, but must remove it
 * immediately after so scroll-pinned sections work correctly.
 */
function clearWillChange(el: HTMLElement | null) {
  if (!el) return;
  el.style.willChange = "auto";
  el.style.transform = "";
}

export default function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "instant" });
    }
  }, [pathname]);

  // On mount and after each navigation: clear will-change once animation settles.
  // initial={false} means no animation on first render, so onAnimationComplete won't fire.
  // This effect handles both cases: initial load (immediate) and navigation (after 300ms).
  useEffect(() => {
    const timer = setTimeout(() => {
      clearWillChange(wrapperRef.current);
    }, 300); // 200ms animation + 100ms buffer
    return () => clearTimeout(timer);
  }, [pathname]);

  // Also clear on animation complete for navigations (belt + suspenders)
  const handleAnimationComplete = useCallback((definition: string) => {
    if (definition === "animate") {
      requestAnimationFrame(() => clearWillChange(wrapperRef.current));
    }
  }, []);

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        ref={wrapperRef}
        initial="initial"
        animate="animate"
        exit="exit"
        variants={pageVariants}
        transition={pageTransition}
        className="w-full"
        onAnimationComplete={handleAnimationComplete}
        style={{ willChange: "opacity, transform" }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
