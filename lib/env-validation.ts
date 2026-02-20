/**
 * Environment Variable Validation
 * Validates all required environment variables at startup
 */

const requiredEnvVars = {
  // Payload CMS (required for CMS operations)
  PAYLOAD_API_URL: process.env.PAYLOAD_API_URL,
  PAYLOAD_API_KEY: process.env.PAYLOAD_API_KEY,

  // Optional but recommended
  RESEND_API_KEY: process.env.RESEND_API_KEY,
  CONTACT_EMAIL: process.env.CONTACT_EMAIL,
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  NEXT_PUBLIC_REVENUECAT_PUBLIC_KEY: process.env.NEXT_PUBLIC_REVENUECAT_PUBLIC_KEY,
  RC_WEBHOOK_SECRET: process.env.RC_WEBHOOK_SECRET,
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
} as const;

const criticalEnvVars = [
  'PAYLOAD_API_URL',
  'PAYLOAD_API_KEY',
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
] as const;

/**
 * Validate environment variables
 * Throws error if critical variables are missing.
 * Skips validation during Next.js build phase so Vercel/build can complete;
 * validation runs at runtime when the app serves requests.
 */
export function validateEnvVars(): void {
  // Skip during build phase (e.g. Vercel "Collecting page data") so build succeeds.
  // Env vars are validated at runtime when layout runs on the server.
  if (process.env.NEXT_PHASE === 'phase-production-build') {
    return;
  }

  const missing: string[] = [];

  for (const varName of criticalEnvVars) {
    if (!requiredEnvVars[varName]) {
      missing.push(varName);
    }
  }

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}\n` +
      'Please check your .env.local file or deployment environment variables.'
    );
  }

  // Warn about optional but recommended variables
  const warnings: string[] = [];
  if (!requiredEnvVars.RESEND_API_KEY) {
    warnings.push('RESEND_API_KEY (email functionality will be limited)');
  }
  if (!requiredEnvVars.PAYLOAD_API_KEY) {
    warnings.push('PAYLOAD_API_KEY (Payload CMS API routes will not work)');
  }

  if (warnings.length > 0 && process.env.NODE_ENV !== 'production') {
    console.warn('⚠️  Optional environment variables not set:', warnings.join(', '));
  }
}

/**
 * Get environment variable with validation
 */
export function getEnvVar(name: keyof typeof requiredEnvVars): string {
  const value = requiredEnvVars[name];
  if (!value && criticalEnvVars.includes(name as typeof criticalEnvVars[number])) {
    throw new Error(`Required environment variable ${name} is not set`);
  }
  return value || '';
}
