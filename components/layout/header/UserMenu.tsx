import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/auth-provider";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/typography";
import { cn } from "@/lib/utils";
import { colors } from "@/lib/design-tokens";
import { User, LogOut, Sun, Moon, Monitor, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "next-themes";
import { useDictionary } from "@/components/providers/dictionary-provider";

export function UserMenu() {
  const dictionary = useDictionary();
  const { user, profile, isPremium, loading, signOut } = useAuth();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    router.refresh();
  };

  // Close dropdown on route change
  useEffect(() => {
    setIsOpen(false);
  }, [router]);

  // Only calculate isDark after hydration to prevent mismatch
  const isDark = mounted && (theme === 'dark' || resolvedTheme === 'dark');

  if (loading) {
    return (
      <div
        className={cn(
          "h-9 w-9 rounded-full animate-pulse",
          colors.background.elevated
        )}
      />
    );
  }

  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <Button asChild variant="ghost" size="sm" className="hidden sm:flex">
          <Link href="/sign-in">{dictionary.common.signIn}</Link>
        </Button>
        <Button asChild variant="default" size="sm">
          <Link href="/pricing">{dictionary.common.subscribe}</Link>
        </Button>
      </div>
    );
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen} modal={false}>
      <DropdownMenuTrigger asChild>
        <button
          className={cn(
            "relative flex items-center justify-center gap-0 rounded-full transition-all duration-300",
            "outline-none focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0",
            "hover:opacity-80 group border-0 p-0",
            "h-9 w-auto"
          )}
          style={{
            background: isDark
              ? 'radial-gradient(ellipse at top left, #1e293b 0%, #0f172a 40%, #020617 100%)'
              : 'radial-gradient(ellipse at top left, #ffffff 0%, #f1f5f9 40%, #cbd5e1 100%)',
            boxShadow: isDark
              ? `
                inset 5px 5px 12px rgba(0, 0, 0, 0.9),
                inset -5px -5px 12px rgba(71, 85, 105, 0.4),
                inset 8px 8px 16px rgba(0, 0, 0, 0.7),
                inset -8px -8px 16px rgba(100, 116, 139, 0.2),
                inset 0 2px 4px rgba(0, 0, 0, 1),
                inset 0 -2px 4px rgba(71, 85, 105, 0.4),
                inset 0 0 20px rgba(0, 0, 0, 0.6),
                0 1px 1px rgba(255, 255, 255, 0.05),
                0 2px 4px rgba(0, 0, 0, 0.4),
                0 8px 16px rgba(0, 0, 0, 0.4),
                0 16px 32px rgba(0, 0, 0, 0.3),
                0 24px 48px rgba(0, 0, 0, 0.2)
              `
              : `
                inset 5px 5px 12px rgba(148, 163, 184, 0.5),
                inset -5px -5px 12px rgba(255, 255, 255, 1),
                inset 8px 8px 16px rgba(100, 116, 139, 0.3),
                inset -8px -8px 16px rgba(255, 255, 255, 0.9),
                inset 0 2px 4px rgba(148, 163, 184, 0.4),
                inset 0 -2px 4px rgba(255, 255, 255, 1),
                inset 0 0 20px rgba(203, 213, 225, 0.3),
                0 1px 2px rgba(255, 255, 255, 1),
                0 2px 4px rgba(0, 0, 0, 0.1),
                0 8px 16px rgba(0, 0, 0, 0.08),
                0 16px 32px rgba(0, 0, 0, 0.06),
                0 24px 48px rgba(0, 0, 0, 0.04)
              `,
            border: isDark
              ? '2px solid rgba(51, 65, 85, 0.6)'
              : '2px solid rgba(203, 213, 225, 0.6)',
          }}
          aria-label={dictionary.nav.menu}
        >
          {/* Inner effects to match the cinematic look */}
          <div
            className="absolute inset-[1px] rounded-full pointer-events-none"
            style={{
              boxShadow: isDark
                ? 'inset 0 2px 6px rgba(0, 0, 0, 0.9), inset 0 -1px 3px rgba(71, 85, 105, 0.3)'
                : 'inset 0 2px 6px rgba(100, 116, 139, 0.4), inset 0 -1px 3px rgba(255, 255, 255, 0.8)',
            }}
          />
          <div
            className="absolute inset-0 rounded-full pointer-events-none"
            style={{
              background: isDark
                ? `radial-gradient(ellipse at top, rgba(71, 85, 105, 0.15) 0%, transparent 50%), linear-gradient(to bottom, rgba(71, 85, 105, 0.2) 0%, transparent 30%, transparent 70%, rgba(0, 0, 0, 0.3) 100%)`
                : `radial-gradient(ellipse at top, rgba(255, 255, 255, 0.8) 0%, transparent 50%), linear-gradient(to bottom, rgba(255, 255, 255, 0.7) 0%, transparent 30%, transparent 70%, rgba(148, 163, 184, 0.15) 100%)`,
              mixBlendMode: 'overlay',
            }}
          />

          <div className="relative z-10 h-9 w-9 flex items-center justify-center overflow-hidden rounded-full p-0.5 flex-shrink-0">
            {profile?.avatar_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={profile.avatar_url}
                alt="Avatar"
                className="h-full w-full object-cover rounded-full"
              />
            ) : (
              <User className={cn("h-4 w-4", isDark ? "text-gray-300" : "text-gray-600")} />
            )}
          </div>

          {/* Dropdown Arrow - Minimal and Cute */}
          <ChevronDown
            className={cn(
              "h-3.5 w-3.5 transition-transform duration-200 flex-shrink-0",
              "text-gray-500 dark:text-gray-400",
              "mr-2",
              isOpen && "rotate-180"
            )}
          />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className={cn(
          "min-w-[240px] p-1",
          colors.background.elevated,
          colors.border.DEFAULT,
          colors.foreground.primary,
          "shadow-lg rounded-md"
        )}
        align="end"
        sideOffset={8}
      >
        {/* User Info Header - WordPress.com style */}
        <div className={cn("px-3 py-2.5 border-b", colors.border.DEFAULT)}>
          <div className="flex flex-col gap-0.5">
            {isPremium && (
              <span
                className={cn(
                  "inline-flex items-center gap-1 pl-0 pr-2.5 pt-0.5 pb-0 rounded-full text-[10px] font-bold tracking-wider w-fit -mt-0.5",
                  "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400",
                  "border border-green-200 dark:border-green-800"
                )}
              >
                {dictionary.common.premium}
              </span>
            )}
            <Text
              variant="bodySmall"
              className={cn("font-semibold truncate block text-sm", colors.foreground.primary)}
            >
              {profile?.full_name || user.email?.split("@")[0]}
            </Text>
            <Text
              variant="caption"
              className={cn("truncate block text-xs", colors.foreground.secondary)}
            >
              {user.email}
            </Text>
          </div>
        </div>

        {/* Account Section */}
        <DropdownMenuLabel className={cn("px-3 py-2 text-xs font-bold tracking-wider", colors.foreground.muted)}>
          {dictionary.nav.account}
        </DropdownMenuLabel>

        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link
              href="/profile"
              className={cn(
                "flex items-center gap-2.5 px-3 py-2 cursor-pointer w-full",
                "text-sm",
                colors.foreground.primary,
                "hover:bg-gray-50 dark:hover:bg-white/5",
                "transition-colors rounded-sm"
              )}
            >
              <User className={cn("h-4 w-4", colors.foreground.secondary)} />
              <span>{dictionary.nav.profile}</span>
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <Link
              href="/pricing"
              className={cn(
                "flex items-center gap-2.5 px-3 py-2 cursor-pointer w-full",
                "text-sm",
                colors.foreground.primary,
                "hover:bg-gray-50 dark:hover:bg-white/5",
                "transition-colors rounded-sm"
              )}
            >
              <span>
                {isPremium ? dictionary.nav.membership : dictionary.nav.upgrade}
              </span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator className="my-1" />

        {/* Preferences Section */}
        <DropdownMenuLabel className={cn("px-3 py-2 text-xs font-bold tracking-wider", colors.foreground.muted)}>
          {dictionary.nav.preferences}
        </DropdownMenuLabel>

        {/* Theme Submenu - Simplified */}
        <DropdownMenuSub>
          <DropdownMenuSubTrigger className={cn(
            "flex items-center gap-2.5 px-3 py-2 cursor-pointer",
            "text-sm",
            colors.foreground.primary,
            "hover:bg-gray-50 dark:hover:bg-white/5",
            "transition-colors rounded-sm outline-none"
          )}>
            {isDark ? (
              <Moon className={cn("h-4 w-4", colors.foreground.secondary)} />
            ) : (
              <Sun className={cn("h-4 w-4", colors.foreground.secondary)} />
            )}
            <span>{dictionary.nav.theme}</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent className={cn(
              "w-44 p-1",
              colors.background.elevated,
              colors.border.DEFAULT,
              colors.foreground.primary,
              "shadow-lg rounded-md"
            )}>
              <DropdownMenuRadioGroup value={resolvedTheme} onValueChange={setTheme}>
                <DropdownMenuRadioItem
                  value="light"
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 cursor-pointer rounded-sm",
                    "text-sm",
                    colors.foreground.primary,
                    "hover:bg-gray-50 dark:hover:bg-white/5"
                  )}
                >
                  <Sun className="h-4 w-4 text-amber-500" />
                  <span>{dictionary.nav.light}</span>
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem
                  value="dark"
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 cursor-pointer rounded-sm",
                    "text-sm",
                    colors.foreground.primary,
                    "hover:bg-gray-50 dark:hover:bg-white/5"
                  )}
                >
                  <Moon className="h-4 w-4 text-indigo-500" />
                  <span>{dictionary.nav.dark}</span>
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem
                  value="system"
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 cursor-pointer rounded-sm",
                    "text-sm",
                    colors.foreground.primary,
                    "hover:bg-gray-50 dark:hover:bg-white/5"
                  )}
                >
                  <Monitor className={cn("h-4 w-4", colors.foreground.secondary)} />
                  <span>{dictionary.nav.system}</span>
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>

        <DropdownMenuSeparator className="my-1" />

        {/* Logout */}
        <DropdownMenuItem
          onSelect={(e) => {
            e.preventDefault();
            handleSignOut();
          }}
          className={cn(
            "flex items-center gap-2.5 px-3 py-2 cursor-pointer",
            "text-sm text-red-600 dark:text-red-400",
            "hover:bg-red-50 dark:hover:bg-red-900/20",
            "transition-colors rounded-sm"
          )}
        >
          <LogOut className="h-4 w-4" />
          <span>{dictionary.nav.logout}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
