"use client";

import { useState } from "react";
import Image from "next/image";
import { Container } from "@/components/responsive";
import { 
  sectionPadding, 
  typography, 
  colors, 
  borderRadius, 
  componentPadding,
  gap,
  margin,
  fontWeight,
  button
} from "@/lib/design-tokens";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { SmartButton } from "@/components/ui/smart-button";

export default function NewsletterBanner() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Handle newsletter signup here
    // TODO: Add API call for newsletter subscription
    console.log("Newsletter signup:", email);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setEmail("");
      // Show success message if needed
    }, 1000);
  };

  return (
    <section className={sectionPadding.md}>
      <Container padding="lg">
        <div 
          className={cn(
            "w-full relative overflow-hidden",
            borderRadius.lg,
            "hero-text-overlay",
            componentPadding.lg
          )}
        >
          {/* Cloud Effect Background Image */}
          <div className="absolute top-0 right-0 w-2/3 h-full pointer-events-none select-none opacity-20 dark:opacity-10">
            <Image
              src="/assets/images/Alara AI.jpeg"
              alt="Newsletter Background"
              fill
              className="object-cover object-left"
              style={{
                maskImage: "radial-gradient(circle at center right, black 0%, transparent 80%)",
                WebkitMaskImage: "radial-gradient(circle at center right, black 0%, transparent 80%)"
              }}
            />
          </div>

          <div className="relative z-10">
          <div className={cn(
            "flex flex-col lg:flex-row lg:items-start lg:justify-between",
            gap.lg
          )}>
            {/* Left Side - Title and Description */}
            <div className={cn("flex-1", "flex flex-col", gap.sm)}>
              <h2 className={cn(
                typography.h3,
                colors.foreground.primary,
                "font-bold"
              )}>
                Derin Bakış Bülteni
              </h2>
              <div className={cn("flex flex-col", gap.sm)}>
                <p className={cn(
                  typography.body,
                  colors.foreground.secondary
                )}>
                  Alara AI'ın haftanın öne çıkan gelişmelerini derlediği e-posta bültenine abone olun.
                </p>
                <p className={cn(
                  typography.body,
                  colors.foreground.secondary
                )}>
                  Derinlemesine gündem özetlerine erişin.
                </p>
              </div>
            </div>

            {/* Right Side - Form */}
            <div className={cn("flex-1 lg:flex-shrink-0 lg:max-w-md", "flex flex-col", gap.md)}>
              <form onSubmit={handleSubmit} className={cn("flex flex-col sm:flex-row", gap.sm)}>
                <div className="flex-1">
                  <Input
                    type="email"
                    placeholder="E-posta"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className={cn(
                      "w-full h-10 rounded-md",
                      colors.background.base,
                      colors.border.DEFAULT,
                      "dark:bg-gray-700"
                    )}
                  />
                </div>
                <div className={cn("flex items-center", margin.none, "p-0")}>
                  <SmartButton
                    type="submit"
                    disabled={isSubmitting}
                    width="auto"
                    size="md"
                    className={cn(
                      fontWeight.semibold,
                      margin.none,
                      "whitespace-nowrap",
                      "h-10", // Standard button height - no token available
                      "w-full sm:w-auto" // Responsive width - design tokens don't have responsive width utilities
                    )}
                  >
                    {isSubmitting ? "Gönderiliyor..." : "Gönder"}
                  </SmartButton>
                </div>
              </form>

              {/* Social Proof Section */}
              <div className={cn("flex items-center flex-wrap", gap.sm)}>
                {/* Profile Icons */}
                <div className={cn("flex items-center", "-space-x-2")}>
                  {/* Profile Photo 1 */}
                  <div className={cn(
                    "relative w-8 h-8 rounded-full border-2 border-purple-500 dark:border-purple-400",
                    colors.background.base,
                    "overflow-hidden"
                  )}>
                    <Image
                      src="/assets/images/author-avata-1.jpg"
                      alt="Newsletter subscriber"
                      fill
                      className="object-cover"
                      sizes="32px"
                    />
                  </div>
                  
                  {/* Profile Photo 2 */}
                  <div className={cn(
                    "relative w-8 h-8 rounded-full border-2 border-purple-500 dark:border-purple-400",
                    colors.background.base,
                    "overflow-hidden"
                  )}>
                    <Image
                      src="/assets/images/author-avata-2.jpg"
                      alt="Newsletter subscriber"
                      fill
                      className="object-cover"
                      sizes="32px"
                    />
                  </div>
                  
                  {/* Profile Photo 3 */}
                  <div className={cn(
                    "relative w-8 h-8 rounded-full border-2 border-purple-500 dark:border-purple-400",
                    colors.background.base,
                    "overflow-hidden"
                  )}>
                    <Image
                      src="/assets/images/author-avata-3.jpg"
                      alt="Newsletter subscriber"
                      fill
                      className="object-cover"
                      sizes="32px"
                    />
                  </div>
                </div>
                
                {/* Call to Action Text */}
                <p className={cn(
                  typography.bodySmall,
                  colors.foreground.secondary
                )}>
                  Bülteni takip edin
                </p>
              </div>
            </div>
          </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

