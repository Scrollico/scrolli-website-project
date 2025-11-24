"use client";

import { useState, useEffect } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus, vs } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { colors, borderRadius, componentPadding } from "@/lib/design-tokens";
import { cn } from "@/lib/utils";

interface CodeBlockProps {
  code: string;
  language?: string;
  showLineNumbers?: boolean;
  className?: string;
}

export default function CodeBlock({
  code,
  language = "tsx",
  showLineNumbers = true,
  className,
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const checkDarkMode = () => {
      const hasDarkMode = document.body.classList.contains("dark-mode") || 
                         document.documentElement.classList.contains("dark");
      setIsDark(hasDarkMode);
    };
    checkDarkMode();

    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.body, { attributes: true, attributeFilter: ["class"] });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    return () => observer.disconnect();
  }, []);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!mounted) {
    return (
      <div className={cn(
        "overflow-hidden",
        borderRadius.lg,
        colors.background.elevated,
        colors.border.DEFAULT,
        "border p-4"
      )}>
        <pre className="text-sm">
          <code>{code}</code>
        </pre>
      </div>
    );
  }

  return (
    <div className={cn("relative group", className)}>
      <div className={cn(
        "absolute top-2 right-2 z-10",
        "opacity-0 group-hover:opacity-100 transition-opacity"
      )}>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCopy}
          className="h-8 px-2"
          aria-label="Copy code"
        >
          {copied ? (
            <Check className="h-4 w-4" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </Button>
      </div>
      <div className={cn(
        "overflow-hidden",
        borderRadius.lg,
        colors.background.elevated,
        colors.border.DEFAULT,
        "border"
      )}>
        <SyntaxHighlighter
          language={language}
          style={isDark ? vscDarkPlus : vs}
          showLineNumbers={showLineNumbers}
          customStyle={{
            margin: 0,
            padding: "1rem",
            fontSize: "0.875rem",
            lineHeight: "1.5",
            background: "transparent !important",
            backgroundColor: "transparent !important",
          }}
          lineNumberStyle={{
            minWidth: "2.5em",
            paddingRight: "1em",
            color: isDark ? "#6b7280" : "#9ca3af",
            background: "transparent !important",
            backgroundColor: "transparent !important",
          }}
        >
          {code}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}

