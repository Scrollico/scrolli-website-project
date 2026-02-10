"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/auth-provider";
import { useTheme } from "next-themes";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuPortal,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuCheckboxItem,
    DropdownMenuSeparator,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    UserIcon,
    SettingsIcon,
    LogOutIcon,
    NewsIcon,
    BookmarkIcon,
    CommunityIcon,
} from "@/components/icons/scrolli-icons";
import { cn } from "@/lib/utils";
import { colors, borderRadius } from "@/lib/design-tokens";
import { Sun, Moon, Monitor, Bell, ChevronDown } from "lucide-react";
import NextImage from "next/image";

interface AccountMenuProps {
    className?: string;
}

export default function AccountMenu({ className }: AccountMenuProps) {
    const { user, profile, signOut } = useAuth();
    const { setTheme, resolvedTheme } = useTheme();
    const router = useRouter();

    const handleSignOut = async () => {
        await signOut();
        router.replace("/");
    };

    const displayName = profile?.full_name || profile?.username || user?.email?.split("@")[0] || "User";

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button
                    className={cn(
                        "flex items-center gap-2 rounded-xl px-3 py-2 font-medium transition-all duration-200",
                        "bg-white/80 dark:bg-white/10 backdrop-blur-sm",
                        "border border-gray-200/50 dark:border-white/10",
                        "hover:bg-white dark:hover:bg-white/20",
                        "text-gray-900 dark:text-gray-100",
                        "shadow-sm hover:shadow-md",
                        className
                    )}
                >
                    {/* Avatar */}
                    <div className="h-8 w-8 rounded-full overflow-hidden ring-2 ring-primary/20 flex-shrink-0">
                        {profile?.avatar_url ? (
                            <NextImage
                                src={profile.avatar_url}
                                alt={displayName}
                                width={32}
                                height={32}
                                className="object-cover h-full w-full"
                            />
                        ) : (
                            <div className="h-full w-full bg-primary/10 flex items-center justify-center">
                                <UserIcon size={16} className="text-primary" />
                            </div>
                        )}
                    </div>
                    <span className="hidden sm:inline text-sm font-semibold max-w-[120px] truncate">
                        {displayName}
                    </span>
                    <ChevronDown className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
                className={cn(
                    "w-64 p-2",
                    "bg-[#f7f4e1]/95 dark:bg-[#374151]/95 backdrop-blur-xl",
                    "border border-gray-200/50 dark:border-white/10",
                    "text-gray-900 dark:text-gray-100",
                    "shadow-xl"
                )}
                align="end"
            >
                {/* User Info Header */}
                <div className="flex items-center gap-3 p-3 mb-2 rounded-xl bg-gray-50/50 dark:bg-white/5">
                    <div className="h-10 w-10 rounded-full overflow-hidden ring-2 ring-primary/20 flex-shrink-0">
                        {profile?.avatar_url ? (
                            <NextImage
                                src={profile.avatar_url}
                                alt={displayName}
                                width={40}
                                height={40}
                                className="object-cover h-full w-full"
                            />
                        ) : (
                            <div className="h-full w-full bg-primary/10 flex items-center justify-center">
                                <UserIcon size={20} className="text-primary" />
                            </div>
                        )}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-gray-900 dark:text-gray-100 truncate">
                            {displayName}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                            {user?.email}
                        </p>
                    </div>
                </div>

                {/* Account Section */}
                <DropdownMenuLabel className="text-xs font-bold tracking-wider text-gray-500 dark:text-gray-400 px-2">
                    Hesap
                </DropdownMenuLabel>

                <DropdownMenuItem
                    className="flex items-center gap-3 py-2.5 px-3 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5"
                    onClick={() => router.push("/profile")}
                >
                    <div className="h-8 w-8 rounded-lg bg-gray-100 dark:bg-white/10 flex items-center justify-center text-gray-500 dark:text-gray-400">
                        <UserIcon size={16} />
                    </div>
                    <span className="flex-1 font-medium">Profilim</span>
                </DropdownMenuItem>

                {/* Membership */}
                <DropdownMenuItem
                    className="flex items-center gap-3 py-2.5 px-3 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5"
                    onClick={() => router.push("/pricing")}
                >
                    <div className="h-8 w-8 rounded-lg bg-gray-100 dark:bg-white/10 flex items-center justify-center text-gray-500 dark:text-gray-400">
                        <BookmarkIcon size={16} />
                    </div>
                    <span className="flex-1 font-medium">Üyelik Yönetimi</span>
                </DropdownMenuItem>

                {/* Settings */}
                <DropdownMenuItem
                    className="flex items-center gap-3 py-2.5 px-3 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5"
                >
                    <div className="h-8 w-8 rounded-lg bg-gray-100 dark:bg-white/10 flex items-center justify-center text-gray-500 dark:text-gray-400">
                        <SettingsIcon size={16} />
                    </div>
                    <span className="flex-1 font-medium">Ayarlar</span>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                {/* Preferences Section */}
                <DropdownMenuLabel className="text-xs font-bold tracking-wider text-gray-500 dark:text-gray-400 px-2">
                    Tercihler
                </DropdownMenuLabel>

                {/* Theme Submenu */}
                <DropdownMenuSub>
                    <DropdownMenuSubTrigger className="flex items-center gap-3 py-2.5 px-3 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5 outline-none focus:bg-gray-50 dark:focus:bg-white/5 data-[state=open]:bg-gray-50 dark:data-[state=open]:bg-white/5">
                        <div className="h-8 w-8 rounded-lg bg-gray-100 dark:bg-white/10 flex items-center justify-center text-gray-500 dark:text-gray-400">
                            {resolvedTheme === "dark" ? (
                                <Moon size={16} />
                            ) : (
                                <Sun size={16} />
                            )}
                        </div>
                        <span className="flex-1 font-medium">Tema</span>
                    </DropdownMenuSubTrigger>
                    <DropdownMenuPortal>
                        <DropdownMenuSubContent className="w-48 p-1 bg-[#f7f4e1]/95 dark:bg-[#374151]/95 backdrop-blur-xl border border-gray-200/50 dark:border-white/10 text-gray-900 dark:text-gray-100 shadow-xl">
                            <DropdownMenuRadioGroup value={resolvedTheme} onValueChange={setTheme}>
                                <DropdownMenuRadioItem value="light" className="flex items-center gap-3 py-2 px-3 rounded-lg cursor-pointer">
                                    <Sun size={16} className="text-amber-500" />
                                    <span className="flex-1">Aydınlık</span>
                                </DropdownMenuRadioItem>
                                <DropdownMenuRadioItem value="dark" className="flex items-center gap-3 py-2 px-3 rounded-lg cursor-pointer">
                                    <Moon size={16} className="text-indigo-500" />
                                    <span className="flex-1">Karanlık</span>
                                </DropdownMenuRadioItem>
                                <DropdownMenuRadioItem value="system" className="flex items-center gap-3 py-2 px-3 rounded-lg cursor-pointer">
                                    <Monitor size={16} className="text-gray-500" />
                                    <span className="flex-1">Sistem</span>
                                </DropdownMenuRadioItem>
                            </DropdownMenuRadioGroup>
                        </DropdownMenuSubContent>
                    </DropdownMenuPortal>
                </DropdownMenuSub>

                {/* Notifications Submenu */}
                <DropdownMenuSub>
                    <DropdownMenuSubTrigger className="flex items-center gap-3 py-2.5 px-3 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5 outline-none focus:bg-gray-50 dark:focus:bg-white/5 data-[state=open]:bg-gray-50 dark:data-[state=open]:bg-white/5">
                        <div className="h-8 w-8 rounded-lg bg-gray-100 dark:bg-white/10 flex items-center justify-center text-gray-500 dark:text-gray-400">
                            <Bell size={16} />
                        </div>
                        <span className="flex-1 font-medium">Bildirimler</span>
                    </DropdownMenuSubTrigger>
                    <DropdownMenuPortal>
                        <DropdownMenuSubContent className="w-48 p-1 bg-[#f7f4e1]/95 dark:bg-[#374151]/95 backdrop-blur-xl border border-gray-200/50 dark:border-white/10 text-gray-900 dark:text-gray-100 shadow-xl">
                            <DropdownMenuCheckboxItem checked className="flex items-center gap-2 py-2 px-3 rounded-lg cursor-pointer transition-colors">
                                <span className="flex-1">E-posta Bildirimleri</span>
                            </DropdownMenuCheckboxItem>
                            <DropdownMenuCheckboxItem className="flex items-center gap-2 py-2 px-3 rounded-lg cursor-pointer">
                                <span className="flex-1">Push Bildirimleri</span>
                            </DropdownMenuCheckboxItem>
                            <DropdownMenuCheckboxItem className="flex items-center gap-2 py-2 px-3 rounded-lg cursor-pointer">
                                <span className="flex-1">SMS Uyarıları</span>
                            </DropdownMenuCheckboxItem>
                        </DropdownMenuSubContent>
                    </DropdownMenuPortal>
                </DropdownMenuSub>

                <DropdownMenuSeparator />

                {/* Logout */}
                <DropdownMenuItem
                    onClick={handleSignOut}
                    className="flex items-center gap-3 py-2.5 px-3 rounded-lg cursor-pointer text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                    <div className="h-8 w-8 rounded-lg bg-red-50 dark:bg-red-900/20 flex items-center justify-center">
                        <LogOutIcon size={16} />
                    </div>
                    <span className="flex-1 font-medium">Çıkış Yap</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
