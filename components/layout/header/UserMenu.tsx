import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/auth-provider";
import { useTranslation } from "@/components/providers/translation-provider";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/typography";
import { cn } from "@/lib/utils";
import { colors, gap, componentPadding, neumorphicShadow } from "@/lib/design-tokens";
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

export function UserMenu() {
  const { user, profile, isPremium, loading, signOut } = useAuth();
  const { t } = useTranslation();
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
      <div className={cn("flex items-center", gap.sm)}>
        <Button asChild variant="ghost" size="sm" className="hidden sm:flex">
          <Link href="/sign-in">{t('signIn', 'Sign in')}</Link>
        </Button>
        <Link
          href="/pricing"
          className={cn(
            "inline-flex items-center justify-center whitespace-nowrap rounded-md text-xs font-medium h-8 px-3",
            "no-underline transition-opacity duration-200 hover:opacity-80",
            isDark ? "bg-[#F8F5E4] text-gray-900" : "bg-gray-700 text-white"
          )}
        >
          {t('subscribe', 'Subscribe')}
        </Link>
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
            boxShadow: isDark ? neumorphicShadow.dark : neumorphicShadow.light,
            border: isDark
              ? '2px solid rgba(51, 65, 85, 0.6)'
              : '2px solid rgba(203, 213, 225, 0.6)',
          }}
          aria-label="Kullanıcı menüsü"
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
          "min-w-[260px]",
          "p-2",
          colors.background.elevated,
          "border border-gray-200/80 dark:border-gray-700/80",
          colors.foreground.primary,
          "shadow-xl rounded-xl"
        )}
        align="end"
        sideOffset={10}
      >
        {/* User Info Header */}
        <div className="px-3 pt-3 pb-4">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2">
              <Text
                variant="bodySmall"
                className={cn("font-semibold truncate block text-[15px]", colors.foreground.primary)}
              >
                {profile?.full_name || user.email?.split("@")[0]}
              </Text>
              {isPremium && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#8080FF]/10 text-[#8080FF] dark:bg-[#8080FF]/20">
                  Plus
                </span>
              )}
            </div>
            <Text
              variant="caption"
              className={cn("truncate block text-[13px]", colors.foreground.muted)}
            >
              {user.email}
            </Text>
          </div>
        </div>

        <DropdownMenuSeparator className="mx-1 bg-gray-200/60 dark:bg-gray-700/60" />

        {/* Account Section */}
        <div className="py-1.5">
          <DropdownMenuItem asChild>
            <Link
              href="/profile"
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 cursor-pointer w-full",
                "text-[13px]",
                colors.foreground.primary,
                "hover:bg-gray-100/80 dark:hover:bg-white/5",
                "transition-colors rounded-lg"
              )}
            >
              <User className="h-4 w-4 text-gray-400 dark:text-gray-500" />
              <span>Profilim</span>
            </Link>
          </DropdownMenuItem>

          {!isPremium && (
            <DropdownMenuItem asChild>
              <Link
                href="/pricing"
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 cursor-pointer w-full",
                  "text-[13px]",
                  "text-[#8080FF]",
                  "hover:bg-gray-100/80 dark:hover:bg-white/5",
                  "transition-colors rounded-lg"
                )}
              >
                <svg className="h-4 w-4" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                <span>Premium&apos;a Geç</span>
              </Link>
            </DropdownMenuItem>
          )}
        </div>

        <DropdownMenuSeparator className="mx-1 bg-gray-200/60 dark:bg-gray-700/60" />

        {/* Theme Submenu */}
        <div className="py-1.5">
          <DropdownMenuSub>
            <DropdownMenuSubTrigger className={cn(
              "flex items-center gap-3 px-3 py-2.5 cursor-pointer w-full",
              "text-[13px]",
              colors.foreground.primary,
              "hover:bg-gray-100/80 dark:hover:bg-white/5",
              "transition-colors rounded-lg outline-none"
            )}>
              {isDark ? (
                <Moon className="h-4 w-4 text-gray-400 dark:text-gray-500" />
              ) : (
                <Sun className="h-4 w-4 text-gray-400 dark:text-gray-500" />
              )}
              <span>Tema</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent className={cn(
                "w-44 p-1.5",
                colors.background.elevated,
                "border border-gray-200/80 dark:border-gray-700/80",
                colors.foreground.primary,
                "shadow-xl rounded-xl"
              )}>
                <DropdownMenuRadioGroup value={resolvedTheme} onValueChange={setTheme}>
                  <DropdownMenuRadioItem
                    value="light"
                    className={cn(
                      "flex items-center gap-2.5 px-3 py-2 cursor-pointer rounded-lg",
                      "text-[13px]",
                      colors.foreground.primary,
                      "hover:bg-gray-100/80 dark:hover:bg-white/5"
                    )}
                  >
                    <Sun className="h-4 w-4 text-amber-500" />
                    <span>Aydınlık</span>
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem
                    value="dark"
                    className={cn(
                      "flex items-center gap-2.5 px-3 py-2 cursor-pointer rounded-lg",
                      "text-[13px]",
                      colors.foreground.primary,
                      "hover:bg-gray-100/80 dark:hover:bg-white/5"
                    )}
                  >
                    <Moon className="h-4 w-4 text-indigo-500" />
                    <span>Karanlık</span>
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem
                    value="system"
                    className={cn(
                      "flex items-center gap-2.5 px-3 py-2 cursor-pointer rounded-lg",
                      "text-[13px]",
                      colors.foreground.primary,
                      "hover:bg-gray-100/80 dark:hover:bg-white/5"
                    )}
                  >
                    <Monitor className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                    <span>Sistem</span>
                  </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
        </div>

        <DropdownMenuSeparator className="mx-1 bg-gray-200/60 dark:bg-gray-700/60" />

        {/* Logout */}
        <div className="py-1.5">
          <DropdownMenuItem
            onSelect={(e) => {
              e.preventDefault();
              handleSignOut();
            }}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 cursor-pointer",
              "text-[13px] text-red-500 dark:text-red-400",
              "hover:bg-red-50/80 dark:hover:bg-red-900/15",
              "transition-colors rounded-lg"
            )}
          >
            <LogOut className="h-4 w-4" />
            <span>Çıkış Yap</span>
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
