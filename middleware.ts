import { createClient } from '@/lib/supabase/middleware';
import { NextResponse, type NextRequest } from 'next/server';
import { addCorsHeaders, handleOptionsRequest, checkRequestSize } from '@/lib/api/middleware';
import { checkRateLimit, createRateLimitResponse } from '@/lib/api/rate-limit';

export async function middleware(request: NextRequest) {
  // Handle CORS preflight for API routes
  if (request.method === 'OPTIONS' && request.nextUrl.pathname.startsWith('/api/')) {
    return handleOptionsRequest(request);
  }

  // Rate limiting for API routes
  if (request.nextUrl.pathname.startsWith('/api/')) {
    const rateLimitResult = checkRateLimit(request, request.nextUrl.pathname);
    if (rateLimitResult && !rateLimitResult.allowed) {
      const response = createRateLimitResponse(rateLimitResult.resetTime, rateLimitResult.config);
      return addCorsHeaders(response, request);
    }
  }

  // Check request size for POST/PUT API routes
  if ((request.method === 'POST' || request.method === 'PUT') && request.nextUrl.pathname.startsWith('/api/')) {
    const sizeCheck = await checkRequestSize(request);
    if (sizeCheck) {
      return addCorsHeaders(sizeCheck, request);
    }
  }

  // Create Supabase client and get initial response
  // This handles the session refresh if needed
  const { supabase, response } = createClient(request);

  let user = null;

  try {
    // Refresh session if expired - required for Server Components
    const {
      data,
    } = await supabase.auth.getUser();
    user = data.user;
  } catch (error) {
    console.error('[Middleware] Supabase client error:', error);
  }

  const pathname = request.nextUrl.pathname;

  if (pathname === '/sign-in') {
    console.log(`[Middleware] Visiting /sign-in. User session present: ${!!user}`);
  }

  // Define public routes (always accessible)
  const publicPaths = [
    '/sign-in',
    '/subscribe',
    '/auth/callback',
    '/onboarding',
    '/article',
    '/archive',
    '/categories',
    '/author',
    '/search',
    '/about-us',
    '/contact',
    '/pricing',
    '/kullanim-kosullari',
    '/kunye',
    '/api',
    '/404',
    '/design-system',
    '/typography',
  ];

  // Check if current path is a public route
  // Exact match for homepage, or starts with one of the public paths
  const isPublicRoute = pathname === '/' || publicPaths.some((path) => pathname.startsWith(path));

  // Auth routes (sign-in) - redirect if already authenticated
  if (pathname === '/sign-in' && user && supabase) {
    // Check onboarding status
    const { data: profile } = await supabase
      .from('profiles')
      .select('onboarding_completed')
      .eq('id', user.id)
      .maybeSingle();

    console.log(`[Middleware] Auth User on ${pathname}:`, user.id);
    console.log(`[Middleware] Profile found:`, !!profile);

    if (profile?.onboarding_completed) {
      // Already authenticated and onboarded, redirect to homepage
      return NextResponse.redirect(new URL('/', request.url));
    } else {
      // Authenticated but not onboarded, redirect to onboarding
      return NextResponse.redirect(new URL('/onboarding', request.url));
    }
  }

  // Onboarding route protection
  if (pathname === '/onboarding') {
    if (!user) {
      // Not authenticated, redirect to sign-in
      return NextResponse.redirect(new URL('/sign-in', request.url));
    }

    // Check if onboarding is already completed
    if (supabase) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('onboarding_completed')
        .eq('id', user.id)
        .maybeSingle();

      if (profile?.onboarding_completed) {
        // Already completed, redirect to homepage
        return NextResponse.redirect(new URL('/', request.url));
      }
    }
  }

  // For authenticated users accessing non-public routes
  // Check onboarding completion (except for onboarding page itself)
  if (user && !isPublicRoute && pathname !== '/onboarding' && supabase) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('onboarding_completed')
      .eq('id', user.id)
      .maybeSingle();

    if (!profile) {
      // If profile doesn't exist, create it
      const { error: createError } = await supabase
        .from('profiles')
        .insert({
          id: user.id,
          email: user.email,
          is_premium: false,
          onboarding_completed: false,
          newsletter_subscribed: false,
        });

      if (!createError) {
        return NextResponse.redirect(new URL('/onboarding', request.url));
      }
    } else if (!profile.onboarding_completed) {
      // Onboarding not completed, redirect to onboarding
      return NextResponse.redirect(new URL('/onboarding', request.url));
    }
  }

  // Add CORS headers to API route responses
  if (request.nextUrl.pathname.startsWith('/api/')) {
    return addCorsHeaders(response, request);
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
