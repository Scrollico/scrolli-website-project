"use client";

export const runtime = "edge";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/auth-provider";
import { Component as AnimatedCharactersLoginPage } from "@/components/ui/animated-characters-login-page";

export default function SignInPage() {
  const { user, profile, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Wait for auth to load
    if (loading) return;

    // If user is logged in, redirect based on onboarding status
    if (user) {
      if (profile?.onboarding_completed) {
        router.replace("/");
      } else {
        router.replace("/onboarding");
      }
    }
  }, [user, profile, loading, router]);

  // Show loading state while checking auth
  if (loading) {
    return null;
  }

  // If user is logged in, don't render the login page (redirect will happen)
  if (user) {
    return null;
  }

  return <AnimatedCharactersLoginPage />;
}











