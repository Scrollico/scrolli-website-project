export const runtime = "edge";

export const runtime = "edge";

import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Attach the current cookie store to a redirect response so that
 * sessions set by exchangeCodeForSession/verifyOtp are sent back
 * to the browser with the redirect.
 */
function redirectWithCookies(
  url: URL,
  cookieStore: Awaited<ReturnType<typeof cookies>>
): NextResponse {
  const res = NextResponse.redirect(url);
  cookieStore.getAll().forEach((c) => res.cookies.set(c.name, c.value));
  return res;
}

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const next = requestUrl.searchParams.get("next") || "/";
  const errorParam = requestUrl.searchParams.get("error");
  const errorDescription = requestUrl.searchParams.get("error_description");

  const cookieStore = await cookies();
  const supabase = await createClient();

  // Log OAuth error parameters, but don't immediately redirect.
  // We'll only use them if we fail to establish a user session.
  if (errorParam) {
    console.error("Auth Callback Error:", errorParam, errorDescription);
  }

  // PKCE flow: Supabase redirects with ?code=... (magic link and OAuth).
  const code = requestUrl.searchParams.get("code");
  if (code) {
    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(
      code
    );
    if (exchangeError) {
      console.error("Auth Callback: Exchange Error:", exchangeError);
      return redirectWithCookies(
        new URL(
          `/sign-in?error=${encodeURIComponent(exchangeError.message)}`,
          requestUrl.origin
        ),
        cookieStore
      );
    }
  }

  // Legacy/implicit magic link: token_hash + type.
  const type = requestUrl.searchParams.get("type");
  const tokenHash = requestUrl.searchParams.get("token_hash");
  if ((type === "magiclink" || type === "email") && tokenHash) {
    const { error: verifyError } = await supabase.auth.verifyOtp({
      token_hash: tokenHash,
      type: type as "magiclink" | "email",
    });

    if (verifyError) {
      console.error("Auth Callback: Verify Error:", verifyError);
      return redirectWithCookies(
        new URL(
          `/sign-in?error=${encodeURIComponent(verifyError.message)}`,
          requestUrl.origin
        ),
        cookieStore
      );
    }
  }

  // Get the user to confirm session is active.
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    console.error(
      "Auth Callback: No user session found after auth flow.",
      userError
    );

    // If we received an explicit error from the provider, surface it.
    if (errorParam) {
      return redirectWithCookies(
        new URL(
          `/sign-in?error=${encodeURIComponent(
            errorDescription || errorParam
          )}`,
          requestUrl.origin
        ),
        cookieStore
      );
    }

    // Otherwise, generic sign-in redirect.
    return redirectWithCookies(
      new URL("/sign-in", requestUrl.origin),
      cookieStore
    );
  }

  // Check onboarding / premium status.
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("onboarding_completed, is_premium")
    .eq("id", user.id)
    .single();

  if (profileError) {
    if (profileError.code !== "PGRST116") {
      console.error("Auth Callback: Profile fetch error:", profileError);
    }

    // If profile doesn't exist, create it.
    const { error: createError } = await supabase.from("profiles").insert({
      id: user.id,
      email: user.email,
      is_premium: false,
      onboarding_completed: false,
      newsletter_subscribed: false,
    });

    if (createError) {
      console.error("Auth Callback: Profile creation error:", createError);
      // Fallback to home even if profile fails, to avoid loops.
      return redirectWithCookies(new URL(next, requestUrl.origin), cookieStore);
    }

    // New profile -> Onboarding.
    return redirectWithCookies(
      new URL("/onboarding", requestUrl.origin),
      cookieStore
    );
  }

  // Determine redirect destination.
  // Premium users or those who completed onboarding go to 'next' (usually home).
  if (profile?.onboarding_completed || profile?.is_premium) {
    return redirectWithCookies(new URL(next, requestUrl.origin), cookieStore);
  } else {
    return redirectWithCookies(
      new URL("/onboarding", requestUrl.origin),
      cookieStore
    );
  }
}
