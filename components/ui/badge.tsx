import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { badge as badgeTokens, fontSize, fontWeight } from "@/lib/design-tokens"

const badgeVariants = cva(
  `inline-flex items-center justify-center rounded-full border text-center ${badgeTokens.padding} ${fontSize.xs} ${fontWeight.semibold} leading-none transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2`,
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-[#8080FF] text-[#F8F5E3] hover:opacity-90",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:opacity-90",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:opacity-90",
        outline: "text-foreground border-border hover:bg-muted",
        success:
          "border-transparent bg-success text-white hover:opacity-90",
        warning:
          "border-transparent bg-warning text-white hover:opacity-90",
        // Periwinkle Subtle variant - light mode: light purple bg; dark mode: darker bg + light text for contrast
        subtle:
          "border-transparent bg-[#E3E5FF] text-[#4A4AB3] hover:opacity-90 dark:bg-[#4A4AB3]/30 dark:text-[#E3E5FF] dark:hover:opacity-90",
        // Supabase-style subtle variants
        "success-subtle":
          "border-green-200 bg-green-50 text-green-700 dark:border-green-900/50 dark:bg-green-900/20 dark:text-green-400",
        "warning-subtle":
          "border-yellow-200 bg-yellow-50 text-yellow-700 dark:border-yellow-900/50 dark:bg-yellow-900/20 dark:text-yellow-400",
        "destructive-subtle":
          "border-red-200 bg-red-50 text-red-700 dark:border-red-900/50 dark:bg-red-900/20 dark:text-red-400",
        "primary-subtle":
          "border-gray-200 bg-gray-50 text-gray-700 dark:border-gray-800 dark:bg-gray-800/50 dark:text-gray-300",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
  VariantProps<typeof badgeVariants> { }

function Badge({ className, variant, children, ...props }: BadgeProps) {
  // Filter out props that shouldn't be passed to DOM elements
  const { asChild, appearance, size, ...domProps } = props as any;

  // Process children to ensure Title Case if it's a string
  const processedChildren = React.useMemo(() => {
    if (typeof children === 'string' && children.length > 0) {
      // Use Turkish locale for proper case transformation (e.g., İ -> i, I -> ı)
      return children.charAt(0).toLocaleUpperCase('tr-TR') + children.slice(1).toLocaleLowerCase('tr-TR');
    }
    return children;
  }, [children]);

  return (
    <div className={cn(badgeVariants({ variant }), className)} {...domProps}>
      <span className="inline-flex flex-row items-center justify-center gap-2 [margin-inline-start:0.05em] min-h-[1em]">
        {processedChildren}
      </span>
    </div>
  )
}

export { Badge, badgeVariants }
