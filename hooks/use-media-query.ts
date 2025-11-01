"use client";

import * as React from "react";

type MediaQueryCallback = (event: { matches: boolean; media: string }) => void;

/**
 * Older versions of Safari (shipped withCatalina and before) do not support addEventListener on matchMedia
 * https://stackoverflow.com/questions/56466261/matchmedia-addlistener-marked-as-deprecated-addeventlistener-equivalent
 * https://github.com/microsoft/fluentui/pull/10839
 */
function attachMediaListener(query: MediaQueryList, callback: MediaQueryCallback) {
  try {
    query.addEventListener("change", callback);
    return () => query.removeEventListener("change", callback);
  } catch (e) {
    query.addListener(callback);
    return () => query.removeListener(callback);
  }
}

function getInitialValue(query: string, defaultValue?: boolean) {
  if (typeof window === "undefined") {
    return defaultValue;
  }

  return window.matchMedia(query).matches;
}

export function useMediaQuery(query: string | (() => string), options?: { defaultValue?: boolean; initializeWithValue?: boolean }): boolean {
  const defaultValue = options?.defaultValue;
  const initializeWithValue = options?.initializeWithValue ?? true;

  const getQuery = React.useMemo(() => {
    if (typeof query === "function") {
      return query;
    }
    return () => query;
  }, [query]);

  const [matches, setMatches] = React.useState<boolean>(() => {
    if (initializeWithValue) {
      return getInitialValue(getQuery(), defaultValue);
    }
    return defaultValue ?? false;
  });

  React.useEffect(() => {
    const currentQuery = getQuery();

    const mediaQuery = window.matchMedia(currentQuery);

    if (mediaQuery.matches !== matches) {
      setMatches(mediaQuery.matches);
    }

    const listener = attachMediaListener(mediaQuery, (event) => {
      setMatches(event.matches);
    });

    return () => {
      listener();
    };
  }, [getQuery, matches]);

  return matches;
}

export function useMediaQueries(queries: string[]) {
  const [matches, setMatches] = React.useState<Record<string, boolean>>(() => {
    if (typeof window === "undefined") {
      return {};
    }

    return queries.reduce((acc, query) => {
      const media = window.matchMedia(query);
      acc[query] = media.matches;
      return acc;
    }, {} as Record<string, boolean>);
  });

  React.useEffect(() => {
    const mediaQueries = queries.map((query) => window.matchMedia(query));
    const listener = () => {
      const newMatches = mediaQueries.reduce((acc, mq) => {
        acc[mq.media] = mq.matches;
        return acc;
      }, {} as Record<string, boolean>);

      setMatches((prevMatches) => {
        if (JSON.stringify(prevMatches) !== JSON.stringify(newMatches)) {
          return newMatches;
        }
        return prevMatches;
      });
    };

    const cleanup = mediaQueries.map((mq) => attachMediaListener(mq, listener));
    return () => {
      cleanup.forEach((cleanup) => cleanup());
    };
  }, [queries.join()]);

  return matches;
}

export function useBreakpoint(breakpoint: "xs" | "sm" | "md" | "lg" | "xl" | "2xl"): boolean {
  const breakpoints: Record<typeof breakpoint, string> = {
    xs: "(max-width: 640px)",
    sm: "(min-width: 640px)",
    md: "(min-width: 768px)",
    lg: "(min-width: 1024px)",
    xl: "(min-width: 1280px)",
    "2xl": "(min-width: 1536px)",
  };

  return useMediaQuery(breakpoints[breakpoint]);
}

export function useIsMobile() {
  const isMobile = useMediaQuery("(max-width: 768px)");
  return { isMobile };
}
