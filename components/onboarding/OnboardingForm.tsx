"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { SmartButton } from "@/components/ui/smart-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import {
  colors,
  typography,
  componentPadding,
  gap,
  marginBottom,
  borderRadius,
  elevation,
} from "@/lib/design-tokens";

export function OnboardingForm() {
  const router = useRouter();
  const supabase = createClient();
  const [fullName, setFullName] = useState("");
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (!fullName.trim()) {
      setError("Lütfen tam adınızı girin.");
      setIsLoading(false);
      return;
    }

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setError("Devam etmek için giriş yapmalısınız.");
        setIsLoading(false);
        router.push("/sign-in");
        return;
      }

      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          full_name: fullName.trim(),
          newsletter_subscribed: newsletterSubscribed,
          onboarding_completed: true,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

      if (updateError) {
        console.error("Error updating profile:", updateError);
        setError(updateError.message || "Bilgiler kaydedilemedi. Lütfen tekrar deneyin.");
        setIsLoading(false);
        return;
      }

      // If newsletter subscribed, also call newsletter-subscribe Edge Function
      if (newsletterSubscribed && user.email) {
        try {
          const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
          if (supabaseUrl) {
            // Default briefings for onboarding: ana-bulten and gundem-ozeti
            const defaultBriefings = ['ana-bulten', 'gundem-ozeti'];

            const response = await fetch(`${supabaseUrl}/functions/v1/newsletter-subscribe`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                email: user.email,
                briefings: defaultBriefings,
                userId: user.id,
              }),
            });

            if (!response.ok) {
              console.warn('Newsletter subscription API call failed, but profile was updated');
            }
          }
        } catch (newsletterError) {
          console.warn('Newsletter subscription error:', newsletterError);
          // Don't fail onboarding if newsletter subscription fails
        }
      }

      router.push("/");
      router.refresh();
    } catch (err) {
      console.error("Onboarding error:", err);
      setError("Beklenmedik bir hata oluştu.");
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        "w-full max-w-md mx-auto rounded-2xl p-8 md:p-10",
        colors.background.base,
        colors.border.light,
        elevation[3]
      )}
    >
      <div className={cn(marginBottom.lg)}>
        <h1 className={cn(typography.h2, marginBottom.sm, colors.foreground.primary)}>
          Hoş Geldiniz!
        </h1>
        <p className={cn(typography.body, colors.foreground.secondary)}>
          Profilinizi tamamlamak için lütfen birkaç detay paylaşın.
        </p>
      </div>

      <div className={cn("flex flex-col", gap.md)}>
        <div className={cn("flex flex-col", gap.sm)}>
          <Label htmlFor="fullName" className={cn(typography.label, colors.foreground.primary)}>
            Tam Adınız <span className="text-red-500">*</span>
          </Label>
          <Input
            id="fullName"
            type="text"
            placeholder="Adınız ve soyadınız"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            disabled={isLoading}
            required
            className={cn(borderRadius.md, "h-12")}
          />
        </div>

        <div className={cn("flex items-start space-x-3 py-2")}>
          <Checkbox
            id="newsletter"
            checked={newsletterSubscribed}
            onCheckedChange={(checked) => setNewsletterSubscribed(checked === true)}
            disabled={isLoading}
            className="mt-1"
          />
          <Label
            htmlFor="newsletter"
            className={cn(
              "text-sm font-normal cursor-pointer leading-tight",
              colors.foreground.secondary
            )}
          >
            En son haberler ve özel içerikler için bültenimize abone olun
          </Label>
        </div>

        {error && (
          <div
            className={cn(
              "p-4 rounded-xl text-sm bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-900/30"
            )}
          >
            {error}
          </div>
        )}

        <SmartButton
          type="submit"
          disabled={isLoading || !fullName.trim()}
          size="lg"
          className="w-full font-bold h-12"
        >
          {isLoading ? "Kaydediliyor..." : "Devam Et"}
        </SmartButton>
      </div>
    </form>
  );
}
