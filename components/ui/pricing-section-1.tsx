"use client";
import { TimelineContent } from "@/components/ui/timeline-animation";
import { VerticalCutReveal } from "@/components/ui/vertical-cut-reveal";
import { cn } from "@/lib/utils";
import { 
  sectionPadding, 
  containerPadding, 
  colors, 
  typography,
  gap
} from "@/lib/design-tokens";
import NumberFlow from "@number-flow/react";
import { CheckCheck } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useId, useRef, useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { SmartButton } from "@/components/ui/smart-button";

const PricingSwitch = ({
  buttons,
  onSwitch,
  className,
  layoutId,
}: {
  buttons: string[];
  onSwitch: (value: string) => void;
  className?: string;
  layoutId?: string;
}) => {
  const [selected, setSelected] = useState("0");
  const [mounted, setMounted] = useState(false);
  const { theme, resolvedTheme } = useTheme();
  const uniqueId = useId();
  const switchLayoutId = layoutId || `switch-${uniqueId}`;

  useEffect(() => {
    setMounted(true);
  }, []);

  // Determine if dark mode is active
  const isDark = mounted && (theme === 'dark' || resolvedTheme === 'dark');

  const handleSwitch = (value: string) => {
    setSelected(value);
    onSwitch(value);
  };

  return (
    <div
      className={cn(
        "relative z-10 w-full rounded-full",
        colors.background.elevated,
        colors.border.DEFAULT,
        "p-1 gap-1.5",
        className,
      )}
    >
      {buttons.map((button, index) => {
        const isSelected = selected === index.toString();
        return (
          <button
            key={index}
            onClick={() => handleSwitch(index.toString())}
            className={cn(
              "relative z-10 w-full sm:h-14 h-10 rounded-full sm:px-6 px-3 sm:py-2 py-1 font-medium pricing-switch-button",
              isSelected
                ? isDark
                  ? "text-gray-900 dark:text-gray-900 hover:text-gray-900"
                  : "text-white dark:text-white hover:text-white"
                : cn(colors.foreground.muted, "hover:text-current")
            )}
            data-selected={isSelected}
            style={
              isSelected
                ? isDark
                  ? { color: '#111827', zIndex: 20 }
                  : { color: '#ffffff', zIndex: 20 }
                : undefined
            }
          >
            {isSelected && (
              <motion.span
                layoutId={switchLayoutId}
                className={cn(
                  "absolute top-0 left-0 sm:h-14 h-10 w-full rounded-full border-4 shadow-sm z-0",
                  isDark
                    ? "bg-gradient-to-t from-[#F8F5E4] via-[#F8F5E4] to-[#F8F5E4] border-[#F8F5E4] shadow-[#F8F5E4]/20"
                    : "bg-gradient-to-t from-[#374152] via-[#374152] to-[#374152] border-[#374152] shadow-[#374152]/30"
                )}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            )}
            <span 
              className={cn(
                "relative z-10",
                isSelected
                  ? isDark
                    ? "text-gray-900 dark:text-gray-900"
                    : "text-white dark:text-white"
                  : ""
              )}
              style={
                isSelected
                  ? isDark
                    ? { color: '#111827' }
                    : { color: '#ffffff' }
                  : undefined
              }
            >
              {button}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default function PricingSection1() {
  const [subscriptionType, setSubscriptionType] = useState<"monthly" | "yearly" | "lifetime">("monthly");
  const pricingRef = useRef<HTMLDivElement>(null);

  const revealVariants = {
    visible: (i: number) => ({
      y: 0,
      opacity: 1,
      filter: "blur(0px)",
      transition: {
        delay: i * 0.3,
        duration: 0.5,
      },
    }),
    hidden: {
      filter: "blur(10px)",
      y: -20,
      opacity: 0,
    },
  };
  const timelineVaraints = {
    visible: (i: number) => ({
      y: 0,
      opacity: 1,
      filter: "blur(0px)",
      transition: {
        delay: i * 0.1,
        duration: 0.5,
      },
    }),
    hidden: {
      filter: "blur(10px)",
      y: -20,
      opacity: 0,
    },
  };

  const toggleSubscriptionType = (value: string) => {
    const index = Number.parseInt(value);
    if (index === 0) setSubscriptionType("monthly");
    else if (index === 1) setSubscriptionType("yearly");
    else setSubscriptionType("lifetime");
  };

  const calculatePrice = () => {
    if (subscriptionType === "lifetime") return 300;
    if (subscriptionType === "yearly") return 6.5;
    return 9; // Monthly
  };

  const currentPrice = calculatePrice();
  const showYearlyDiscount = subscriptionType === "yearly";
  const isLifetime = subscriptionType === "lifetime";

  const features = [
    "Unlimited Scrolli experience",
    "Weekly Deep Insights newsletter",
    "Exclusive stories for subscribers",
    "Alara AI Podcast",
    "Event participation",
  ];

  return (
    <div className={cn("w-full min-h-screen mx-auto relative", containerPadding.md, "pt-10")} ref={pricingRef}>
      <div className={cn(colors.background.base, sectionPadding.lg, containerPadding.md)}>
        <div
          className="absolute inset-0 z-0 dark:hidden"
          style={{
            background:
              "radial-gradient(125% 125% at 50% 90%, #fff 40%, #F8F5E4 100%)",
          }}
        />
        <div
          className="absolute inset-0 z-0 hidden dark:block"
          style={{
            background:
              "radial-gradient(125% 125% at 50% 90%, #374152 40%, #374152 100%)",
          }}
        />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h1 className={cn(typography.h1, colors.foreground.primary, "mb-4 leading-[120%]")}>
            <VerticalCutReveal
              splitBy="words"
              staggerDuration={0.15}
              staggerFrom="first"
              reverse={true}
              containerClassName="justify-center"
              transition={{
                type: "spring",
                stiffness: 250,
                damping: 40,
                delay: 0.4,
              }}
            >
              Get unlimited access to all Scrolli features
            </VerticalCutReveal>
          </h1>
        </div>
      </div>

      {/* Product Features */}
      <div className={containerPadding.md}>
        <div className="max-w-6xl mx-auto">
          <div className={cn("grid sm:grid-cols-2", gap.xl, "items-start")}>
            <div>
              <TimelineContent
                as="h3"
                animationNum={2}
                timelineRef={pricingRef}
                customVariants={revealVariants}
                className={cn(typography.h3, colors.foreground.primary, "mb-2")}
              >
                What's inside
              </TimelineContent>

              <div className={cn("space-y-4")}>
                {features.map((feature, index) => (
                  <TimelineContent
                    key={index}
                    as="div"
                    animationNum={3 + index}
                    timelineRef={pricingRef}
                    customVariants={timelineVaraints}
                    className="flex items-center"
                  >
                    <div className="w-6 h-6 bg-[#374152] dark:bg-[#374152] shadow-md shadow-[#374152]/50 dark:shadow-[#374152]/50 rounded-full flex items-center justify-center mr-3">
                      <CheckCheck className="h-4 w-4 text-white" />
                    </div>
                    <span className={colors.foreground.secondary}>{feature}</span>
                  </TimelineContent>
                ))}
              </div>
            </div>

            <div className={cn("space-y-8 min-h-[400px]")}>
              <TimelineContent
                as="div"
                animationNum={8}
                timelineRef={pricingRef}
                customVariants={revealVariants}
              >
                <h4 className={cn(typography.h6, colors.foreground.primary, "mb-2")}>
                  Subscription Period
                </h4>
                <p className={cn(typography.bodySmall, colors.foreground.muted, "mb-2")}>
                  Choose your billing cycle
                </p>
                <PricingSwitch
                  buttons={["Monthly", "Yearly", "Lifetime"]}
                  onSwitch={toggleSubscriptionType}
                  className="grid grid-cols-3 w-full"
                />
              </TimelineContent>

              <TimelineContent
                as="div"
                animationNum={10}
                timelineRef={pricingRef}
                customVariants={revealVariants}
                className="grid grid-cols-[1fr_auto] items-center gap-4 min-w-full"
              >
                <div className="flex items-center gap-2 min-w-0 overflow-hidden">
                  <span className={cn(typography.h2, colors.foreground.primary, "whitespace-nowrap")}>
                    USD
                    <NumberFlow
                      value={currentPrice}
                      className={cn(typography.h2)}
                    />
                  </span>
                  {isLifetime ? (
                    <span className={cn(typography.bodyLarge, colors.foreground.muted, "whitespace-nowrap")}>
                      one-time
                    </span>
                  ) : (
                    <span className={cn(typography.bodyLarge, colors.foreground.muted, "whitespace-nowrap")}>
                      /monthly
                    </span>
                  )}
                  {showYearlyDiscount && (
                    <span className={cn(typography.bodySmall, colors.success.DEFAULT, "font-medium whitespace-nowrap")}>
                      (-35%)
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <Link
                    href="/log-in"
                    className={cn(
                      typography.body,
                      colors.foreground.secondary,
                      "hover:" + colors.foreground.interactive.split(" ")[0],
                      "transition-colors underline whitespace-nowrap"
                    )}
                  >
                    Log in
                  </Link>
                  <Link href="/pricing" className="inline-block">
                    <SmartButton
                      size="lg"
                      width="auto"
                      className="h-10 sm:h-12 px-6 sm:px-8 text-base sm:text-lg font-semibold whitespace-nowrap"
                    >
                      Subscribe
                    </SmartButton>
                  </Link>
                </div>
              </TimelineContent>
            </div>
          </div>

          {/* Corporate Subscription CTA */}
          <TimelineContent
            as="div"
            animationNum={12}
            timelineRef={pricingRef}
            customVariants={revealVariants}
            className={cn(
              "text-center mt-12 pt-8 border-t",
              colors.border.DEFAULT
            )}
          >
            <p className={cn(typography.h5, colors.foreground.primary, "mb-2 font-semibold")}>
              Need a corporate subscription?
            </p>
            <p className={cn(typography.body, colors.foreground.secondary)}>
              Reach out to us for corporate subscription
            </p>
          </TimelineContent>
        </div>
      </div>
    </div>
  );
}

