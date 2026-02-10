"use client";

import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { colors, typography } from "@/lib/design-tokens";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function SimplePremiumCTA() {
  const router = useRouter();
  
  return (
    <div className="relative w-full py-16 sm:py-24 overflow-hidden">
      {/* Background accents */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl -z-10" />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium bg-primary/10 text-primary mb-6">
          Abonelik Avantajları
        </div>
        <h2 className={cn(typography.h1, colors.foreground.primary, "mb-6 text-balance")}>
          Scrolli Premium’u Keşfet
        </h2>
        <p className={cn("text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed", colors.foreground.secondary)}>
          Sınırsız Scrolli deneyimiyle gündemin arka planını, derinlemesine analizleri ve özel hikayeleri keşfet. Tüm içeriklere tam erişim, reklamsız okuma.
        </p>
        <Button
          onClick={() => router.push("/subscribe")}
          size="lg"
          className="rounded-full h-12 sm:h-14 px-10 group"
        >
          <span className="text-lg">Scrolli Premium’a Katıl</span>
          <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform ml-2" />
        </Button>
      </div>
    </div>
  );
}
