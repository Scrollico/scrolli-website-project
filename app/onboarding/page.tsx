export const runtime = "edge";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { OnboardingForm } from "@/components/onboarding/OnboardingForm";
import { Container } from "@/components/responsive";
import { cn } from "@/lib/utils";
import { sectionPadding, containerPadding } from "@/lib/design-tokens";

export default async function OnboardingPage() {
  const supabase = await createClient();

  // Check if user is authenticated
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    // Not authenticated, redirect to sign-in
    redirect("/sign-in");
  }

  // Check if onboarding is already completed
  const { data: profile } = await supabase
    .from("profiles")
    .select("onboarding_completed")
    .eq("id", user.id)
    .maybeSingle();

  if (profile?.onboarding_completed) {
    // Already completed, redirect to homepage
    redirect("/");
  }

  return (
    <div className={cn("min-h-screen flex items-center justify-center", sectionPadding.md, containerPadding.sm)}>
      <Container size="sm">
        <OnboardingForm />
      </Container>
    </div>
  );
}
