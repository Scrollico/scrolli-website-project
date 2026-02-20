"use client";

import { createBrowserClient } from '@supabase/ssr';
import type { Database } from './types';
import type { CookieOptions } from '@supabase/ssr';
import { SupabaseClient } from '@supabase/supabase-js';

/**
 * Creates a Supabase client for use in Client Components.
 *
 * CRITICAL: For magic links (OTP) to work in Next.js SSR, we MUST use cookies
 * to store the PKCE code verifier. This allows the server-side callback route
 * to access the verifier and complete the auth flow.
 */
export function createClient(): SupabaseClient<Database> | null {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing Supabase environment variables');
    return null;
  }

  return createBrowserClient<Database>(
    supabaseUrl,
    supabaseKey,
    {
      cookies: {
        get(name: string) {
          if (typeof document === 'undefined') return undefined;
          const cookies = document.cookie.split('; ');
          const cookie = cookies.find(c => c.trim().startsWith(`${name}=`));
          if (!cookie) return undefined;
          return decodeURIComponent(cookie.trim().substring(name.length + 1));
        },
        set(name: string, value: string, options: CookieOptions) {
          if (typeof document === 'undefined') return;
          let cookieString = `${name}=${encodeURIComponent(value)}`;

          // Ensure path defaults to / so cookies are available across the site
          // This is critical for PKCE verifiers to be available at /auth/callback
          const path = options.path || '/';
          cookieString += `; path=${path}`;

          if (options.maxAge) {
            cookieString += `; max-age=${options.maxAge}`;
          }
          if (options.domain) {
            cookieString += `; domain=${options.domain}`;
          }
          if (options.sameSite) {
            cookieString += `; samesite=${options.sameSite}`;
          }
          if (options.secure) {
            cookieString += '; secure';
          }

          document.cookie = cookieString;
        },
        remove(name: string, options: CookieOptions) {
          if (typeof document === 'undefined') return;
          const path = options.path || '/';
          document.cookie = `${name}=; max-age=0; path=${path}`;
        },
      },
      auth: {
        flowType: 'pkce',
      },
    }
  );
}
