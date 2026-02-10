'use client';

import dynamic from 'next/dynamic';
import { HikayeLoader } from './HikayeLoader';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

const InlineScriptRenderer = dynamic(
    () => import('./InlineScriptRenderer'),
    { ssr: false }
);

const ContentWithButton = dynamic(
    () => import('./ContentWithButton'),
    { ssr: false }
);

interface Article {
    id: string;
    title: string;
    inlineScriptHtml?: string;
    content?: string;
}

interface HikayelerArticleProps {
    article: Article;
}

/**
 * HikayelerArticle - Minimal Shell for Instorier Scrollytelling Stories
 * 
 * ARCHITECTURE:
 * ============
 * 
 * This component provides a minimal shell structure:
 * 
 *   <div.hikayeler-article-shell>  (minimal wrapper, no layout constraints)
 *     <HikayeLoader />              (full-screen overlay, fades out)
 *     <div.opacity-wrapper>         (fade-in transition)
 *       <InlineScriptRenderer />    (single mount node for Instorier)
 *     </div>
 *   </div>
 * 
 * KEY PRINCIPLES:
 * - Instorier controls viewport height and scrolling (we don't set min-height: 100vh)
 * - No overflow constraints on shell (Instorier manages its own scroll)
 * - No background colors (Instorier provides its own)
 * - Single mount point for Instorier HTML (no nested wrappers)
 * 
 * CONTENT PRIORITY:
 * - If inlineScriptHtml exists → Render Instorier scrollytelling (primary)
 * - Else if content exists → Render fallback body content (secondary)
 * - Never render both simultaneously
 */
export default function HikayelerArticle({ article }: HikayelerArticleProps) {
    const [loading, setLoading] = useState(true);
    const [progress, setProgress] = useState(0);

    // Progress animation
    useEffect(() => {
        if (!loading) {
            setProgress(100);
            return;
        }
        const startTime = Date.now();
        const duration = 2500;
        const timer = setInterval(() => {
            const elapsed = Date.now() - startTime;
            const t = Math.min(elapsed / duration, 1);
            setProgress((1 - Math.pow(1 - t, 3)) * 100);
            if (elapsed >= duration) clearInterval(timer);
        }, 20);
        return () => clearInterval(timer);
    }, [loading]);

    // Safety timer: always reveal after 5s
    useEffect(() => {
        const safetyTimer = setTimeout(() => {
            if (loading) setLoading(false);
        }, 5000);
        return () => clearTimeout(safetyTimer);
    }, [loading]);

    // Content detection
    const hasInlineHtml = !!article.inlineScriptHtml?.trim();
    const hasBodyContent = !!article.content?.trim();

    // If only body content (no script), reveal immediately
    useEffect(() => {
        if (!hasInlineHtml && hasBodyContent) {
            setLoading(false);
        }
    }, [hasInlineHtml, hasBodyContent]);

    // Error state: no content at all
    if (!hasInlineHtml && !hasBodyContent) {
        return (
            <div className="flex items-center justify-center min-h-screen text-gray-500">
                İçerik yüklenemedi.
            </div>
        );
    }

    return (
        <div className="hikayeler-article-shell">
            {/* Full-screen loading overlay */}
            <HikayeLoader isLoading={loading} progress={progress} />

            {/* Content wrapper with fade-in transition */}
            <div
                className={cn(
                    'hikayeler-content-wrapper',
                    'transition-opacity duration-1000',
                    loading ? 'opacity-0' : 'opacity-100'
                )}
                style={{ 
                    visibility: loading ? 'hidden' : 'visible'
                }}
            >
                {/* PRIMARY: Instorier scrollytelling (if available) */}
                {hasInlineHtml ? (
                    <InlineScriptRenderer
                        html={article.inlineScriptHtml!}
                        onLoadComplete={() => setLoading(false)}
                    />
                ) : (
                    /* FALLBACK: Regular article body content (only if no script) */
                    <div className="w-full relative min-h-screen bg-background">
                        <div
                            className={cn(
                                'prose prose-lg max-w-none dark:prose-invert mx-auto px-4 py-10 md:py-14',
                                'text-foreground max-w-3xl'
                            )}
                        >
                            <ContentWithButton
                                content={article.content!}
                                className="article-content prose prose-lg max-w-none dark:prose-invert"
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
