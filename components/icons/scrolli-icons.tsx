/**
 * Scrolli Icons - Lucide React Wrapper
 * 
 * This file re-exports Lucide icons with Scrolli naming convention
 * for backwards compatibility during migration.
 * 
 * Custom icons (flags) are preserved from the original ScrolliIcons.tsx
 */

// Re-export Lucide icons with Scrolli naming
export {
  Newspaper as NewsIcon,
  TrendingUp as TrendIcon,
  Search as SearchIcon,
  User as UserIcon,
  Share2 as ShareIcon,
  Bookmark as BookmarkIcon,
  Bot as BotIcon,
  Video as VideoIcon,
  Mic as PodcastIcon,
  ShieldCheck as ShieldIcon,
  Zap as LightningIcon,
  Mail as NewsletterIcon,
  Filter as FilterIcon,
  Sparkles as AIIcon,
  LayoutGrid as CategoryIcon,
  DollarSign as FinanceIcon,
  Globe as AxiosIcon,
  BarChart3 as ZestIcon,
  Globe as FutureIcon,
  ThumbsUp as ReadersVoteIcon,
  UserPen as AuthorIcon,
  Star as FeaturedIcon,
  BadgeCheck as FreeContentBadgeIcon,
  Crown as PremiumContentBadgeIcon,
  Bell as NotificationBadgeIcon,
  BellDot as NotificationNotifiedBadgeIcon,
  Info as InfoBadgeIcon,
  X as CloseIcon,
  ArrowRight as ArrowRightIcon,
  ArrowLeft as ArrowLeftIcon,
  Check as CheckIcon,
  Globe as GlobeIcon,
  Heart as HeartIcon,
  Settings as SettingsIcon,
  Sun as ThemeIcon,
  Users as CommunityIcon,
  Play as PlayIcon,
  Mail as MailIcon,
  Calendar as CalendarIcon,
  LogOut as LogOutIcon,
} from "lucide-react";

// Also export commonly used Lucide icons directly for new code
export {
  Loader2,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Menu,
  MoreHorizontal,
  MoreVertical,
  Plus,
  Minus,
  Eye,
  EyeOff,
  Copy,
  Trash2,
  Edit,
  ExternalLink,
  Download,
  Upload,
  RefreshCw,
  AlertCircle,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Lock,
  Unlock,
  Gift,
  MessageCircle,
  Send,
  Image,
  FileText,
  Folder,
  Home,
  Building,
  MapPin,
  Phone,
  Link,
  Tag,
  Hash,
  AtSign,
} from "lucide-react";

// Type for Lucide icon props (convenience export)
export type { LucideProps as ScrolliIconProps } from "lucide-react";

// =============================================================================
// CUSTOM FLAG ICONS (Not available in Lucide)
// =============================================================================

import React from 'react';
import { cn } from "@/lib/utils";

interface FlagIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const TurkishFlagIcon: React.FC<FlagIconProps> = ({ size = 24, className, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={cn("transition-all duration-200", className)}
    {...props}
  >
    {/* Circular red background */}
    <circle cx="12" cy="12" r="11" fill="#E30A17" />
    {/* Crescent */}
    <circle cx="10" cy="12" r="5" fill="#ffffff" />
    <circle cx="11.5" cy="12" r="4" fill="#E30A17" />
    {/* Star */}
    <path
      d="M15.5 9.5L16.2 11.2L18 11.4L16.6 12.5L17 14.3L15.5 13.3L14 14.3L14.4 12.5L13 11.4L14.8 11.2L15.5 9.5Z"
      fill="#ffffff"
    />
  </svg>
);

export const EnglishFlagIcon: React.FC<FlagIconProps> = ({ size = 24, className, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={cn("transition-all duration-200", className)}
    {...props}
  >
    {/* Circular navy background */}
    <circle cx="12" cy="12" r="11" fill="#012169" />
    {/* White cross */}
    <path d="M7 11H17V13H7V11Z" fill="#ffffff" />
    <path d="M11 7H13V17H11V7Z" fill="#ffffff" />
    {/* Red cross */}
    <path d="M8.5 11.5H15.5V12.5H8.5V11.5Z" fill="#C8102E" />
    <path d="M11.5 8.5H12.5V15.5H11.5V8.5Z" fill="#C8102E" />
  </svg>
);
