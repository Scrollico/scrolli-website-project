import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Check } from "lucide-react";

import { cn } from "@/lib/utils";
import { colors, borderRadius, borderWidth } from "@/lib/design-tokens";

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => {
  // #region agent log
  const rootRef = React.useCallback((node: HTMLButtonElement | null) => {
    if (typeof ref === 'function') ref(node);
    else if (ref) (ref as any).current = node;
    
    if (node) {
      const observer = new MutationObserver(() => {
        const state = node.getAttribute('data-state');
        if (state === 'checked') {
          const isDark = document.documentElement.classList.contains('dark') || document.body.classList.contains('dark-mode');
          const computed = window.getComputedStyle(node);
          const indicator = node.querySelector('[data-radix-checkbox-indicator]');
          const svg = indicator?.querySelector('svg');
          fetch('http://127.0.0.1:7244/ingest/146da770-4a69-4ea0-9f3a-c8d3db6921c4',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'checkbox.tsx:rootRef',message:'Checkbox checked state',data:{isDark,state,borderWidth:computed.borderWidth,borderColor:computed.borderColor,backgroundColor:computed.backgroundColor,textColor:computed.color,svgColor:svg?window.getComputedStyle(svg).color:'none',allClasses:node.className},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
        }
      });
      observer.observe(node, { attributes: true, attributeFilter: ['data-state'] });
      return () => observer.disconnect();
    }
  }, [ref]);
  // #endregion
  
  return (
  <CheckboxPrimitive.Root
    ref={rootRef}
    className={cn(
      "h-4 w-4 shrink-0 rounded-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
      // Border: ALWAYS 1px, NEVER changes
      "border border-gray-400 dark:border-gray-500",
      // Unchecked: transparent background
      "bg-transparent",
      // Light mode checked: primary fill, white checkmark
      "data-[state=checked]:bg-primary data-[state=checked]:text-white data-[state=checked]:border-primary",
      // Dark mode checked: beige fill, dark checkmark
      "dark:data-[state=checked]:!bg-[#F8F5E4] dark:data-[state=checked]:!text-gray-900 dark:data-[state=checked]:!border-[#F8F5E4]",
      // NO HOVER EFFECTS - hover does nothing, maintains exact same styles
      "hover:opacity-100",
      "hover:data-[state=unchecked]:bg-transparent hover:data-[state=unchecked]:border-gray-400 dark:hover:data-[state=unchecked]:border-gray-500",
      "hover:data-[state=checked]:bg-primary hover:data-[state=checked]:border-primary hover:data-[state=checked]:text-white dark:hover:data-[state=checked]:bg-[#F8F5E4] dark:hover:data-[state=checked]:border-[#F8F5E4] dark:hover:data-[state=checked]:text-gray-900",
      borderRadius.sm,
      className,
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator
      className={cn("flex items-center justify-center text-current")}
    >
      <Check className="h-4 w-4 stroke-[2.5]" />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
  );
});
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export { Checkbox };

