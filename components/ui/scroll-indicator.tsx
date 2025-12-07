"use client"

import { ChevronDown } from "lucide-react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { colors } from "@/lib/design-tokens"

export default function ScrollIndicator() {
  const scrollDown = () => {
    const nextSection = document.querySelector('[data-section="content-showcase"]')
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: "smooth", block: "start" })
    } else {
      window.scrollTo({
        top: window.innerHeight,
        behavior: "smooth",
      })
    }
  }

  return (
    <motion.button
      onClick={scrollDown}
      className={cn(
        "scroll-indicator-button",
        "flex flex-col items-center gap-3",
        "border-0 bg-transparent",
        "focus:outline-none focus:ring-0",
        "hover:opacity-60 transition-opacity duration-200"
      )}
      aria-label="Scroll down"
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
    >
      <span className={cn(
        "text-xs",
        colors.foreground.muted,
        "uppercase tracking-[0.15em] font-medium"
      )}>
        SCROLL
      </span>
      <motion.div
        animate={{
          y: [0, 4, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: [0.4, 0, 0.6, 1],
        }}
        className={cn(colors.foreground.muted)}
      >
        <ChevronDown className="w-4 h-4 stroke-[1.5]" />
      </motion.div>
    </motion.button>
  )
}

