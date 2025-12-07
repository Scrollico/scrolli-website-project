'use client';

import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { type ThemeProviderProps } from 'next-themes/dist/types';
import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';

function ThemeSync() {
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const runId = 'pre-fix';

  // #region agent log helper
  const sendLog = (
    message: string,
    data: Record<string, unknown>,
    hypothesisId: string
  ) => {
    fetch('http://127.0.0.1:7242/ingest/25c500f4-9175-49cc-869e-0ae52ea13b91', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId: 'debug-session',
        runId,
        hypothesisId,
        location: 'components/providers/theme-provider.tsx:sendLog',
        message,
        data,
        timestamp: Date.now(),
      }),
    }).catch(() => {});
  };
  // #endregion

  // #region agent log
  sendLog('render entry', {
    theme,
    resolvedTheme,
    mounted,
    htmlClasses: typeof document !== 'undefined' ? Array.from(document.documentElement.classList) : [],
    bodyClasses: typeof document !== 'undefined' ? Array.from(document.body?.classList || []) : [],
  }, 'A');
  // #endregion

  useEffect(() => {
    setMounted(true);
    // #region agent log
    sendLog('mount effect executed', {
      theme,
      resolvedTheme,
      htmlClasses: Array.from(document.documentElement.classList),
      bodyClasses: Array.from(document.body.classList),
    }, 'A');
    // #endregion
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    const isDark = theme === 'dark' || resolvedTheme === 'dark';
    const cookieValue = theme === 'system' ? 'system' : isDark ? 'dark' : 'light';
    
    // #region agent log
    sendLog('theme effect before apply', {
      theme,
      resolvedTheme,
      mounted,
      isDark,
      htmlClasses: Array.from(document.documentElement.classList),
      bodyClasses: Array.from(document.body.classList),
    }, 'B');
    // #endregion

    if (isDark) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark-mode');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark-mode');
    }

    // Persist for SSR bootstrap
    document.cookie = `${'theme'}=${cookieValue}; path=/; max-age=31536000; SameSite=Lax`;

    // #region agent log
    sendLog('theme cookie write', {
      theme,
      resolvedTheme,
      cookieValue,
    }, 'C');
    // #endregion

    // #region agent log
    sendLog('theme effect after apply', {
      theme,
      resolvedTheme,
      mounted,
      isDark,
      htmlClasses: Array.from(document.documentElement.classList),
      bodyClasses: Array.from(document.body.classList),
    }, 'B');
    // #endregion
  }, [theme, resolvedTheme, mounted]);

  return null;
}

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider {...props}>
      <ThemeSync />
      {children}
    </NextThemesProvider>
  );
}

