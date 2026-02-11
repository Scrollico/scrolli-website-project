# Deployment Guide

## Required Environment Variables

The following environment variables **MUST** be configured in your production deployment platform (Vercel, Netlify, etc.) for the application to function correctly:

### Payload CMS Configuration

| Variable               | Description                                             | Example                      |
| ---------------------- | ------------------------------------------------------- | ---------------------------- |
| `PAYLOAD_API_URL`      | Base URL for Payload CMS API                            | `https://cms.scrolli.co/api` |
| `PAYLOAD_API_KEY`      | API authentication key for Payload CMS                  | `your-api-key-here`          |
| `PAYLOAD_FETCH_DRAFTS` | Whether to fetch draft articles (useful for previewing) | `true` or `false` (default)  |
| `PAYLOAD_LOCALE`       | The locale to fetch content for                         | `tr` (default) or `en`       |

> [!IMPORTANT]
> Without these environment variables, the application will not be able to fetch articles from Payload CMS, resulting in empty content sections on the homepage.

## Setting Environment Variables in Vercel

1. Navigate to your project in the Vercel dashboard
2. Go to **Settings** → **Environment Variables**
3. Add each variable:
   - **Name**: `PAYLOAD_API_URL`
   - **Value**: `https://cms.scrolli.co/api`
   - **Environments**: Select **Production**, **Preview**, and **Development**
4. Repeat for `PAYLOAD_API_KEY`
5. **Redeploy** your application for changes to take effect

## Verifying Configuration

### Check Environment Variables are Set

After deployment, you can verify environment variables are available by checking the server logs. The application will log an error if Payload CMS configuration is missing:

```
❌ Payload CMS Configuration Missing: {
  hasUrl: false,
  hasKey: false,
  nodeEnv: 'production'
}
```

### Test API Connectivity

You can test if the Payload CMS API is accessible:

```bash
curl -H "Authorization: Bearer YOUR_API_KEY" \
  "https://cms.scrolli.co/api/hikayeler?limit=1&locale=tr&draft=false"
```

This should return article data, not an error.

## Troubleshooting

### Articles Not Showing on Homepage

**Symptoms:**

- Homepage sections (Editor's Picks, Eksen, Gelecek) are empty
- Browser console shows no errors
- Server logs show "Payload CMS not configured" warnings

**Solution:**

1. Verify environment variables are set in production
2. Ensure variables are set for the **Production** environment (not just Preview)
3. Redeploy the application
4. Clear browser cache and reload

### 500 Internal Server Error

**Symptoms:**

- Pages return 500 errors
- Server logs show errors about missing configuration

**Solution:**

1. Check that `PAYLOAD_API_URL` and `PAYLOAD_API_KEY` are both set
2. Verify the API URL is correct (no trailing slash)
3. Verify the API key is valid
4. Redeploy the application

### Browser Console Shows Localhost Errors

**Symptoms:**

- Browser console shows failed requests to `localhost:3000` or `127.0.0.1:8788`
- Production site attempts to connect to local development servers

**Solution:**
This was caused by debug code in production components. This has been fixed in the latest deployment. If you still see these errors:

1. Clear your browser cache
2. Hard reload the page (Cmd+Shift+R on Mac, Ctrl+Shift+R on Windows)
3. Verify you're on the latest deployment

## Additional Environment Variables

Depending on your setup, you may also need:

- `NEXT_PUBLIC_SITE_URL`: Public URL of your site (e.g., `https://next.scrolli.co`)
- `SUPABASE_URL`: Supabase project URL
- `SUPABASE_ANON_KEY`: Supabase anonymous key
- Other service-specific keys

Refer to `.env.local.example` for a complete list of environment variables.
