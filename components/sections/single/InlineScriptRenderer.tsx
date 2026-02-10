'use client';

import { useEffect, useRef } from 'react';

interface InlineScriptRendererProps {
    html: string;
    onLoadComplete?: () => void;
}

/**
 * InlineScriptRenderer - Thin Bridge for Instorier Scrollytelling
 * 
 * INSTORIER CONTRACT (DO NOT BREAK):
 * ===================================
 * 
 * The Instorier embed expects:
 * 1. A single root container div where it can inject its HTML
 * 2. The injected HTML contains:
 *    - A root div with class/id matching pattern `ibG8wLku-container` (or similar)
 *    - Script tags that load from stories.instorier.com
 * 3. After script execution, Instorier creates:
 *    - `.ibG8wLku-sticky` - Contains the sticky viewport content (images, text overlays)
 *    - `.ibG8wLku-scroll-container-spacer` - A spacer div with calculated height (e.g., 7048px)
 *      that creates the scroll distance for the scrollytelling effect
 * 
 * CRITICAL REQUIREMENTS:
 * - The mount container MUST NOT have overflow constraints (let Instorier control scrolling)
 * - The mount container MUST NOT have min-height: 100vh (Instorier manages its own height)
 * - The mount container MUST NOT wrap the injected HTML in extra layout divs
 * - Scripts MUST be re-executed after innerHTML injection (React strips script tags)
 * - External scripts MUST load only once per page view
 * 
 * LAYOUT ASSUMPTIONS:
 * - Instorier expects full viewport control for sticky positioning
 * - The spacer height is calculated dynamically based on content
 * - Position: sticky requires overflow: visible on all ancestors (handled by .hikayeler-page class)
 * 
 * HOW TO UPDATE INSTORIER EMBED SAFELY:
 * - The inlineScriptHtml comes from Payload CMS
 * - If Instorier changes their container structure, update this contract documentation
 * - Test thoroughly: scroll behavior, spacer height, sticky positioning
 */
export default function InlineScriptRenderer({ html, onLoadComplete }: InlineScriptRendererProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const hasExecuted = useRef(false);
    const scriptsLoadedRef = useRef<Set<string>>(new Set());

    useEffect(() => {
        if (!containerRef.current || hasExecuted.current || !html) return;

        hasExecuted.current = true;
        const container = containerRef.current;
        let completed = false;
        
        const done = () => {
            if (completed) return;
            completed = true;
            
            // Add hikayeler-page class to html/body for overflow:visible (required for sticky)
            document.documentElement.classList.add('hikayeler-page');
            document.body.classList.add('hikayeler-page');
            
            onLoadComplete?.();
        };

        // Safety: always reveal content after 8s so we never leave a black screen
        const safetyTimer = setTimeout(done, 8000);

        // 1. Clear any existing content (defensive cleanup)
        container.innerHTML = '';

        // 2. Inject the Instorier HTML directly into our mount node
        container.innerHTML = html;

        // 3. Find and re-execute scripts (React strips script tags from innerHTML)
        const scripts = container.querySelectorAll('script');
        let scriptsLoaded = 0;
        const totalScripts = Array.from(scripts).filter(s => s.src).length;

        scripts.forEach((oldScript) => {
            const scriptSrc = oldScript.src;
            
            // Prevent duplicate script loading
            if (scriptSrc && scriptsLoadedRef.current.has(scriptSrc)) {
                console.warn(`[InlineScriptRenderer] Script already loaded, skipping: ${scriptSrc}`);
                scriptsLoaded++;
                if (scriptsLoaded === totalScripts) {
                    clearTimeout(safetyTimer);
                    done();
                }
                return;
            }

            const newScript = document.createElement('script');

            // Copy all attributes
            Array.from(oldScript.attributes).forEach(attr => {
                newScript.setAttribute(attr.name, attr.value);
            });

            // Copy inline script content
            if (oldScript.textContent) {
                newScript.textContent = oldScript.textContent;
            }

            // Handle external script loading
            if (newScript.src) {
                scriptsLoadedRef.current.add(newScript.src);
                
                newScript.onload = () => {
                    scriptsLoaded++;
                    if (scriptsLoaded === totalScripts) {
                        clearTimeout(safetyTimer);
                        done();
                    }
                };
                
                newScript.onerror = () => {
                    console.error(`[InlineScriptRenderer] Failed to load script: ${newScript.src}`);
                    scriptsLoaded++;
                    if (scriptsLoaded === totalScripts) {
                        clearTimeout(safetyTimer);
                        done();
                    }
                };
            }

            // Replace old script with executable one
            oldScript.parentNode?.replaceChild(newScript, oldScript);
        });

        // No external scripts: complete after inline scripts have run
        if (totalScripts === 0) {
            clearTimeout(safetyTimer);
            queueMicrotask(done);
        }

        // Cleanup: Remove hikayeler-page class when component unmounts
        return () => {
            clearTimeout(safetyTimer);
            document.documentElement.classList.remove('hikayeler-page');
            document.body.classList.remove('hikayeler-page');
        };
    }, [html, onLoadComplete]);

    // Defensive check: Log if Instorier container is not created after injection
    useEffect(() => {
        if (!containerRef.current || !html) return;
        
        const checkInstorierContainer = setTimeout(() => {
            const hasInstorierContainer = containerRef.current?.querySelector('[class*="ibG8wLku-container"], [id*="ibG8wLku"]');
            if (!hasInstorierContainer) {
                console.warn('[InlineScriptRenderer] Instorier container not detected after injection. Check script loading.');
            }
        }, 3000);

        return () => clearTimeout(checkInstorierContainer);
    }, [html]);

    // Render exactly ONE mount node - no extra wrappers, no layout styles
    return (
        <div
            ref={containerRef}
            id="hikayeler-story-root"
            className="hikayeler-script-root"
            // NO width/height/overflow/min-height styles here - Instorier controls everything
        />
    );
}
