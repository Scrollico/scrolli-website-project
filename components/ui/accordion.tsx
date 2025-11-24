"use client"

import * as React from "react"
import * as AccordionPrimitive from "@radix-ui/react-accordion"
import { ChevronDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { 
  colors, 
  borderRadius, 
  elevation, 
  elevationHover,
  componentPadding,
  transition,
  typography,
  borderWidth
} from "@/lib/design-tokens"

const Accordion = AccordionPrimitive.Root

const AccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Item
    ref={ref}
    className={cn(
      borderRadius.lg,
      colors.background.base,
      colors.border.DEFAULT,
      borderWidth[1],
      elevation[1],
      elevationHover[2],
      transition.normal,
      "mb-4 last:mb-0",
      className
    )}
    {...props}
  />
))
AccordionItem.displayName = "AccordionItem"

const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Header className="flex">
    <AccordionPrimitive.Trigger
      ref={ref}
      className={cn(
        "flex flex-1 items-center justify-between",
        componentPadding.md,
        "text-left font-semibold",
        colors.foreground.primary,
        transition.normal,
        // Hover state: blue background with white text
        "hover:opacity-80 dark:hover:opacity-80",
        // Active/open state: only rotate chevron, don't change text color
        "[&[data-state=open]>svg]:rotate-180",
        // Ensure chevron is white on hover
        "hover:[&>svg]:text-white dark:hover:[&>svg]:text-white",
        className,
      )}
      {...props}
    >
      {children}
      <ChevronDown className={cn(
        "h-5 w-5 shrink-0",
        colors.foreground.muted,
        transition.normal
      )} />
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
))
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName

const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className={cn(
      "overflow-hidden",
      typography.bodySmall,
      transition.normal,
      "data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
    )}
    {...props}
  >
    <div className={cn(
      componentPadding.lg,
      "pt-6 pb-6",
      colors.foreground.secondary,
      "leading-relaxed",
      className
    )}>{children}</div>
  </AccordionPrimitive.Content>
))

AccordionContent.displayName = AccordionPrimitive.Content.displayName

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }