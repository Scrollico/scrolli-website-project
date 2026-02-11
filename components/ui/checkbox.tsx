import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Check } from "lucide-react";

import { cn } from "@/lib/utils";
import { borderRadius } from "@/lib/design-tokens";

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => {
  return (
  <CheckboxPrimitive.Root
    ref={ref}
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

