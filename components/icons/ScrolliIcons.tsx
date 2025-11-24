import React from 'react';
import { cn } from "@/lib/utils";

export interface ScrolliIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  accentColor?: string;
  strokeWidth?: number;
}

const DefaultIcon: React.FC<ScrolliIconProps> = ({
  size = 24,
  accentColor = "#374152", // Dark blue (main icon color)
  strokeWidth = 1.5,
  className,
  children,
  ...props
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("transition-all duration-200", className)}
      {...props}
    >
      {children}
    </svg>
  );
};

// News & Content Icons
export const NewsIcon: React.FC<ScrolliIconProps> = (props) => (
  <DefaultIcon {...props}>
    <path
      d="M19 20H5C3.89543 20 3 19.1046 3 18V6C3 4.89543 3.89543 4 5 4H19C20.1046 4 21 4.89543 21 6V18C21 19.1046 20.1046 20 19 20Z"
      stroke="currentColor"
      strokeWidth={props.strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M16 2H8"
      stroke="currentColor"
      strokeWidth={props.strokeWidth}
      strokeLinecap="round"
    />
    <path
      d="M7 8H11"
      stroke="currentColor"
      strokeWidth={props.strokeWidth}
      strokeLinecap="round"
    />
    <path
      d="M7 12H17"
      stroke="currentColor"
      strokeWidth={props.strokeWidth}
      strokeLinecap="round"
    />
    <path
      d="M7 16H13"
      stroke="currentColor"
      strokeWidth={props.strokeWidth}
      strokeLinecap="round"
    />
    {/* Meaningful fill: Newspaper header/title area */}
    <rect x="5" y="6" width="14" height="4" rx="0.5" fill={props.accentColor || "#374152"} />
  </DefaultIcon>
);

export const TrendIcon: React.FC<ScrolliIconProps> = (props) => (
  <DefaultIcon {...props}>
    <path
      d="M22 12H18L15 21L9 3L6 12H2"
      stroke="currentColor"
      strokeWidth={props.strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Meaningful fill: Chart area below the trend line (data visualization) */}
    <path d="M18 12L15 21L9 3L6 12L18 12Z" fill={props.accentColor || "#374152"} fillOpacity="0.25" />
  </DefaultIcon>
);

export const SearchIcon: React.FC<ScrolliIconProps> = (props) => (
  <DefaultIcon {...props}>
    <path
      d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z"
      stroke="currentColor"
      strokeWidth={props.strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M21 21L16.65 16.65"
      stroke="currentColor"
      strokeWidth={props.strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Meaningful fill: Lens center (search focus area) */}
    <circle cx="11" cy="11" r="4" fill={props.accentColor || "#374152"} />
  </DefaultIcon>
);

export const UserIcon: React.FC<ScrolliIconProps> = (props) => (
  <DefaultIcon {...props}>
    <path
      d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21"
      stroke="currentColor"
      strokeWidth={props.strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z"
      stroke="currentColor"
      strokeWidth={props.strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Meaningful fill: User's head (face/profile) */}
    <circle cx="12" cy="7" r="3" fill={props.accentColor || "#374152"} />
  </DefaultIcon>
);

export const ShareIcon: React.FC<ScrolliIconProps> = (props) => (
  <DefaultIcon {...props}>
    <path
      d="M4 12V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V12"
      stroke="currentColor"
      strokeWidth={props.strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M16 6L12 2L8 6"
      stroke="currentColor"
      strokeWidth={props.strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12 2V15"
      stroke="currentColor"
      strokeWidth={props.strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Meaningful fill: Document/paper content being shared */}
    <rect x="6" y="12" width="12" height="8" rx="1" fill={props.accentColor || "#374152"} />
  </DefaultIcon>
);

export const BookmarkIcon: React.FC<ScrolliIconProps> = (props) => (
  <DefaultIcon {...props}>
    <path
      d="M19 21L12 16L5 21V5C5 4.46957 5.21071 3.96086 5.58579 3.58579C5.96086 3.21071 6.46957 3 7 3H17C17.5304 3 18.0391 3.21071 18.4142 3.58579C18.7893 3.96086 19 4.46957 19 5V21Z"
      stroke="currentColor"
      strokeWidth={props.strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Meaningful fill: Bookmark interior (saved content area) */}
    <path d="M7 5L12 9L17 5V19L12 15L7 19V5Z" fill={props.accentColor || "#374152"} />
  </DefaultIcon>
);

export const BotIcon: React.FC<ScrolliIconProps> = (props) => (
  <DefaultIcon {...props}>
    <rect x="4" y="8" width="16" height="12" rx="2" stroke="currentColor" strokeWidth={props.strokeWidth} />
    <path d="M8 20V22" stroke="currentColor" strokeWidth={props.strokeWidth} strokeLinecap="round" />
    <path d="M16 20V22" stroke="currentColor" strokeWidth={props.strokeWidth} strokeLinecap="round" />
    <path d="M12 8V4" stroke="currentColor" strokeWidth={props.strokeWidth} strokeLinecap="round" />
    <circle cx="12" cy="3" r="1" stroke="currentColor" strokeWidth={props.strokeWidth} fill="none" />
    {/* Meaningful fill: Bot's screen/display (active interface) */}
    <rect x="6" y="10" width="12" height="8" rx="1" fill={props.accentColor || "#374152"} />
  </DefaultIcon>
);

export const VideoIcon: React.FC<ScrolliIconProps> = (props) => (
  <DefaultIcon {...props}>
    <rect x="2" y="4" width="20" height="16" rx="2" stroke="currentColor" strokeWidth={props.strokeWidth} />
    <path d="M12 20V22" stroke="currentColor" strokeWidth={props.strokeWidth} strokeLinecap="round" />
    <path d="M8 22H16" stroke="currentColor" strokeWidth={props.strokeWidth} strokeLinecap="round" />
    {/* Meaningful fill: Video screen content */}
    <rect x="4" y="6" width="16" height="12" rx="1" fill={props.accentColor || "#374152"} />
  </DefaultIcon>
);

export const PodcastIcon: React.FC<ScrolliIconProps> = (props) => (
  <DefaultIcon {...props}>
    <path d="M12 1C10.3431 1 9 2.34315 9 4V10C9 11.6569 10.3431 13 12 13C13.6569 13 15 11.6569 15 10V4C15 2.34315 13.6569 1 12 1Z" stroke="currentColor" strokeWidth={props.strokeWidth} />
    <path d="M19 10V12C19 15.866 15.866 19 12 19C8.13401 19 5 15.866 5 12V10" stroke="currentColor" strokeWidth={props.strokeWidth} strokeLinecap="round" />
    <path d="M12 19V23" stroke="currentColor" strokeWidth={props.strokeWidth} strokeLinecap="round" />
    <path d="M8 23H16" stroke="currentColor" strokeWidth={props.strokeWidth} strokeLinecap="round" />
    {/* Meaningful fill: Microphone body (recording device) */}
    <ellipse cx="12" cy="7" rx="2.5" ry="3.5" fill={props.accentColor || "#374152"} />
  </DefaultIcon>
);

export const ShieldIcon: React.FC<ScrolliIconProps> = (props) => (
  <DefaultIcon {...props}>
    <path d="M12 22C12 22 20 18 20 12V5L12 2L4 5V12C4 18 12 22 12 22Z" stroke="currentColor" strokeWidth={props.strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    {/* Meaningful fill: Shield center (protected area) */}
    <path d="M12 6C12 6 16 8 16 12C16 16 12 18 12 18C12 18 8 16 8 12C8 8 12 6 12 6Z" fill={props.accentColor || "#374152"} />
    <path d="M9 12L11 14L15 10" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </DefaultIcon>
);

export const LightningIcon: React.FC<ScrolliIconProps> = (props) => (
  <DefaultIcon {...props}>
    <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" stroke="currentColor" strokeWidth={props.strokeWidth} strokeLinejoin="round" />
    {/* Meaningful fill: Lightning bolt itself (energy/power) */}
    <path d="M13 6L7 14H12L11 18L17 10H12L13 6Z" fill={props.accentColor || "#374152"} />
  </DefaultIcon>
);

export const NewsletterIcon: React.FC<ScrolliIconProps> = (props) => (
  <DefaultIcon {...props}>
    <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="currentColor" strokeWidth={props.strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M22 6L12 13L2 6" stroke="currentColor" strokeWidth={props.strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    {/* Meaningful fill: Envelope interior (letter content) */}
    <path d="M6 8L12 13L18 8V16H6V8Z" fill={props.accentColor || "#374152"} />
  </DefaultIcon>
);

export const FilterIcon: React.FC<ScrolliIconProps> = (props) => (
  <DefaultIcon {...props}>
    <path d="M22 3H2L10 12.46V19L14 21V12.46L22 3Z" stroke="currentColor" strokeWidth={props.strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    {/* Meaningful fill: Filtered content area (active filter result) */}
    <path d="M10 12.46L14 12.46V21L10 19V12.46Z" fill={props.accentColor || "#374152"} />
  </DefaultIcon>
);

// AI Icon
export const AIIcon: React.FC<ScrolliIconProps> = (props) => (
  <DefaultIcon {...props}>
    {/* Sparkles/Stars representing AI Magic */}
    <path d="M12 2V6M12 18V22M4.9 4.9L7.7 7.7M16.3 16.3L19.1 19.1M2 12H6M18 12H22M4.9 19.1L7.7 16.3M16.3 7.7L19.1 4.9" stroke="currentColor" strokeWidth={props.strokeWidth} strokeLinecap="round" opacity="0.2" />
    {/* Meaningful fill: Main AI Spark/Star */}
    <path d="M12 6L14 10L18 12L14 14L12 18L10 14L6 12L10 10L12 6Z" fill={props.accentColor || "#374152"} />
    <path d="M19 2L20 4L22 5L20 6L19 8L18 6L16 5L18 4L19 2Z" fill="currentColor" />
  </DefaultIcon>
);

// Category Icon (Kept same, just context)
export const CategoryIcon: React.FC<ScrolliIconProps> = (props) => (
  <DefaultIcon {...props}>
    <rect x="3" y="3" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth={props.strokeWidth} />
    <rect x="13" y="3" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth={props.strokeWidth} />
    <rect x="3" y="13" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth={props.strokeWidth} />
    <rect x="13" y="13" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth={props.strokeWidth} />
    {/* Meaningful fill: Active/selected category (top-left) */}
    <rect x="3" y="3" width="8" height="8" rx="1.5" fill={props.accentColor || "#374152"} />
  </DefaultIcon>
);

// Subcategory Icons
export const FinanceIcon: React.FC<ScrolliIconProps> = (props) => (
  <DefaultIcon {...props}>
    {/* Dollar sign with chart */}
    <path d="M12 2V22" stroke="currentColor" strokeWidth={props.strokeWidth} strokeLinecap="round" />
    <path d="M15 5H10C8.89543 5 8 5.89543 8 7C8 8.10457 8.89543 9 10 9H14C15.1046 9 16 9.89543 16 11C16 12.1046 15.1046 13 14 13H8" stroke="currentColor" strokeWidth={props.strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M12 13V17" stroke="currentColor" strokeWidth={props.strokeWidth} strokeLinecap="round" />
    {/* Meaningful fill: Dollar sign center (money/value) */}
    <circle cx="12" cy="11" r="2.5" fill={props.accentColor || "#374152"} />
  </DefaultIcon>
);

export const AxiosIcon: React.FC<ScrolliIconProps> = (props) => (
  <DefaultIcon {...props}>
    {/* Network/API connections */}
    <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth={props.strokeWidth} />
    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth={props.strokeWidth} />
    {/* Connection lines */}
    <path d="M12 4V8M12 16V20M4 12H8M16 12H20" stroke="currentColor" strokeWidth={props.strokeWidth} strokeLinecap="round" />
    {/* Meaningful fill: Central hub (API endpoint/server) */}
    <circle cx="12" cy="12" r="3.5" fill={props.accentColor || "#374152"} />
  </DefaultIcon>
);

export const ZestIcon: React.FC<ScrolliIconProps> = (props) => (
  <DefaultIcon {...props}>
    {/* Daily energy/activity bars */}
    <rect x="5" y="4" width="4" height="16" rx="2" stroke="currentColor" strokeWidth={props.strokeWidth} />
    <rect x="10" y="7" width="4" height="13" rx="2" stroke="currentColor" strokeWidth={props.strokeWidth} />
    <rect x="15" y="10" width="4" height="10" rx="2" stroke="currentColor" strokeWidth={props.strokeWidth} />
    {/* Meaningful fill: Full energy bar (maximum zest/activity) */}
    <rect x="5" y="4" width="4" height="16" rx="2" fill={props.accentColor || "#374152"} />
  </DefaultIcon>
);

export const FutureIcon: React.FC<ScrolliIconProps> = (props) => (
  <DefaultIcon {...props}>
    {/* Planet with Orbit representing Future/Global */}
    <circle cx="12" cy="12" r="6" stroke="currentColor" strokeWidth={props.strokeWidth} />
    <path d="M2.5 12C2.5 7.5 12 2 12 2S21.5 7.5 21.5 12S12 22 12 22S2.5 16.5 2.5 12Z" stroke="currentColor" strokeWidth={props.strokeWidth} strokeLinecap="round" fill="none" opacity="0.5" />
    <path d="M19 12C19 15.866 15.866 19 12 19C8.13401 19 5 15.866 5 12" stroke="currentColor" strokeWidth={props.strokeWidth} strokeLinecap="round" />
    {/* Meaningful fill: The Planet itself */}
    <circle cx="12" cy="12" r="6" fill={props.accentColor || "#374152"} />
    {/* Ring cut-out effect */}
    <path d="M16 12C16 14.2091 14.2091 16 12 16C9.79086 16 8 14.2091 8 12C8 9.79086 9.79086 8 12 8" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
  </DefaultIcon>
);

// Additional Feature Icons
export const ReadersVoteIcon: React.FC<ScrolliIconProps> = (props) => (
  <DefaultIcon {...props}>
    {/* Hand with checkmark */}
    <path d="M12 2C10.3431 2 9 3.34315 9 5V11C9 12.6569 10.3431 14 12 14C13.6569 14 15 12.6569 15 11V5C15 3.34315 13.6569 2 12 2Z" stroke="currentColor" strokeWidth={props.strokeWidth} />
    <path d="M9 14V18C9 19.6569 10.3431 21 12 21C13.6569 21 15 19.6569 15 18V14" stroke="currentColor" strokeWidth={props.strokeWidth} strokeLinecap="round" />
    {/* Meaningful fill: Hand palm (voting gesture) */}
    <ellipse cx="12" cy="8" rx="3" ry="4" fill={props.accentColor || "#374152"} />
  </DefaultIcon>
);

export const AuthorIcon: React.FC<ScrolliIconProps> = (props) => (
  <DefaultIcon {...props}>
    {/* Author profile with pen */}
    <path
      d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21"
      stroke="currentColor"
      strokeWidth={props.strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z"
      stroke="currentColor"
      strokeWidth={props.strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Meaningful fill: Author's head (profile/identity) */}
    <circle cx="12" cy="7" r="3" fill={props.accentColor || "#374152"} />
  </DefaultIcon>
);

export const FeaturedIcon: React.FC<ScrolliIconProps> = (props) => (
  <DefaultIcon {...props}>
    {/* Star with badge */}
    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="currentColor" strokeWidth={props.strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    {/* Meaningful fill: Star center (featured highlight) */}
    <circle cx="12" cy="12" r="2.5" fill={props.accentColor || "#374152"} />
  </DefaultIcon>
);

// Badge Icons
export const FreeContentBadgeIcon: React.FC<ScrolliIconProps> = (props) => (
  <DefaultIcon {...props}>
    {/* Badge shape */}
    <path d="M12 2L18 6V12C18 16 15 19 12 21C9 19 6 16 6 12V6L12 2Z" stroke="currentColor" strokeWidth={props.strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    {/* Meaningful fill: Badge interior (badge content) */}
    <path d="M12 4L16 7V12C16 15 14 17 12 18C10 17 8 15 8 12V7L12 4Z" fill={props.accentColor || "#374152"} />
    {/* "FREE" text indicator */}
    <path d="M10 9H14M10 11H14" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
  </DefaultIcon>
);

export const PremiumContentBadgeIcon: React.FC<ScrolliIconProps> = (props) => {
  const goldColor = "#FFD700"; // Golden color for premium
  return (
    <DefaultIcon {...props}>
      {/* Badge shape */}
      <path d="M12 2L18 6V12C18 16 15 19 12 21C9 19 6 16 6 12V6L12 2Z" stroke="currentColor" strokeWidth={props.strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
      {/* Meaningful fill: Badge interior with gold (premium content) */}
      <path d="M12 4L16 7V12C16 15 14 17 12 18C10 17 8 15 8 12V7L12 4Z" fill={goldColor} />
      {/* Crown/Star indicator */}
      <path d="M12 7L13 9L15 9L13.5 10.5L14 12L12 11L10 12L10.5 10.5L9 9L11 9Z" fill="currentColor" />
    </DefaultIcon>
  );
};

export const NotificationBadgeIcon: React.FC<ScrolliIconProps> = (props) => (
  <DefaultIcon {...props}>
    {/* Bell shape */}
    <path d="M18 8C18 6.4087 17.3679 4.88258 16.2426 3.75736C15.1174 2.63214 13.5913 2 12 2C10.4087 2 8.88258 2.63214 7.75736 3.75736C6.63214 4.88258 6 6.4087 6 8C6 11.0902 5.22047 13.206 4.34966 14.6054C3.61513 15.7859 3.24786 16.3761 3.26134 16.5408C3.27624 16.7231 3.31488 16.7926 3.46178 16.9016C3.59446 17 4.19259 17 5.38885 17H18.6112C19.8074 17 20.4055 17 20.5382 16.9016C20.6851 16.7926 20.7238 16.7231 20.7387 16.5408C20.7521 16.3761 20.3849 15.7859 19.6503 14.6054C18.7795 13.206 18 11.0902 18 8Z" stroke="currentColor" strokeWidth={props.strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M13.73 21C13.5542 21.3031 13.3019 21.5547 12.9982 21.7295C12.6946 21.9044 12.3504 21.9965 12 21.9965C11.6496 21.9965 11.3054 21.9044 11.0018 21.7295C10.6982 21.5547 10.4458 21.3031 10.27 21" stroke="currentColor" strokeWidth={props.strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    {/* Meaningful fill: Bell interior (notification area) */}
    <ellipse cx="12" cy="12" rx="6" ry="7" fill={props.accentColor || "#374152"} />
  </DefaultIcon>
);

export const NotificationNotifiedBadgeIcon: React.FC<ScrolliIconProps> = (props) => (
  <DefaultIcon {...props}>
    {/* Bell shape */}
    <path d="M18 8C18 6.4087 17.3679 4.88258 16.2426 3.75736C15.1174 2.63214 13.5913 2 12 2C10.4087 2 8.88258 2.63214 7.75736 3.75736C6.63214 4.88258 6 6.4087 6 8C6 11.0902 5.22047 13.206 4.34966 14.6054C3.61513 15.7859 3.24786 16.3761 3.26134 16.5408C3.27624 16.7231 3.31488 16.7926 3.46178 16.9016C3.59446 17 4.19259 17 5.38885 17H18.6112C19.8074 17 20.4055 17 20.5382 16.9016C20.6851 16.7926 20.7238 16.7231 20.7387 16.5408C20.7521 16.3761 20.3849 15.7859 19.6503 14.6054C18.7795 13.206 18 11.0902 18 8Z" stroke="currentColor" strokeWidth={props.strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M13.73 21C13.5542 21.3031 13.3019 21.5547 12.9982 21.7295C12.6946 21.9044 12.3504 21.9965 12 21.9965C11.6496 21.9965 11.3054 21.9044 11.0018 21.7295C10.6982 21.5547 10.4458 21.3031 10.27 21" stroke="currentColor" strokeWidth={props.strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    {/* Meaningful fill: Bell interior (notification area) */}
    <ellipse cx="12" cy="12" rx="6" ry="7" fill={props.accentColor || "#374152"} />
    {/* Red notification dot on top - Larger */}
    <circle cx="18" cy="6" r="4" fill="#EF4444" stroke="white" strokeWidth="1.5" />
  </DefaultIcon>
);

export const InfoBadgeIcon: React.FC<ScrolliIconProps> = (props) => (
  <DefaultIcon {...props}>
    {/* Info circle */}
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth={props.strokeWidth} />
    {/* Meaningful fill: Circle interior (information area) */}
    <circle cx="12" cy="12" r="7" fill={props.accentColor || "#374152"} />
    {/* "i" letter */}
    <path d="M12 8V8.01M12 16V10" stroke="white" strokeWidth="2" strokeLinecap="round" />
  </DefaultIcon>
);

// Navigation & UI Icons
export const CloseIcon: React.FC<ScrolliIconProps> = (props) => (
  <DefaultIcon {...props}>
    <path d="M18 6L6 18" stroke="currentColor" strokeWidth={props.strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M6 6L18 18" stroke="currentColor" strokeWidth={props.strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    {/* Meaningful fill: Center interaction point */}
    <circle cx="12" cy="12" r="2" fill={props.accentColor || "#374152"} opacity="0.5" />
  </DefaultIcon>
);

export const ArrowRightIcon: React.FC<ScrolliIconProps> = (props) => (
  <DefaultIcon {...props}>
    <path d="M5 12H19" stroke="currentColor" strokeWidth={props.strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M12 5L19 12L12 19" stroke="currentColor" strokeWidth={props.strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    {/* Meaningful fill: Arrow head direction */}
    <path d="M15 9L18 12L15 15V9Z" fill={props.accentColor || "#374152"} />
  </DefaultIcon>
);

export const ArrowLeftIcon: React.FC<ScrolliIconProps> = (props) => (
  <DefaultIcon {...props}>
    <path d="M19 12H5" stroke="currentColor" strokeWidth={props.strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M12 19L5 12L12 5" stroke="currentColor" strokeWidth={props.strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    {/* Meaningful fill: Arrow head direction */}
    <path d="M9 15L6 12L9 9V15Z" fill={props.accentColor || "#374152"} />
  </DefaultIcon>
);

export const CheckIcon: React.FC<ScrolliIconProps> = (props) => (
  <DefaultIcon {...props}>
    <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth={props.strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    {/* Meaningful fill: Checkmark accent */}
    <circle cx="12" cy="12" r="8" fill={props.accentColor || "#374152"} opacity="0.1" />
  </DefaultIcon>
);

export const GlobeIcon: React.FC<ScrolliIconProps> = (props) => (
  <DefaultIcon {...props}>
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth={props.strokeWidth} />
    <path d="M2 12H22" stroke="currentColor" strokeWidth={props.strokeWidth} strokeLinecap="round" />
    <path d="M12 2C14.5013 4.73835 15.9228 8.29203 16 12C15.9228 15.708 14.5013 19.2616 12 22C9.49872 19.2616 8.07725 15.708 8 12C8.07725 8.29203 9.49872 4.73835 12 2Z" stroke="currentColor" strokeWidth={props.strokeWidth} strokeLinecap="round" />
    {/* Meaningful fill: Earth/Ocean */}
    <circle cx="12" cy="12" r="8" fill={props.accentColor || "#374152"} opacity="0.2" />
  </DefaultIcon>
);

export const HeartIcon: React.FC<ScrolliIconProps> = (props) => (
  <DefaultIcon {...props}>
    <path d="M20.84 4.61C20.3292 4.099 19.7228 3.69364 19.0554 3.41708C18.3879 3.14052 17.6725 2.99817 16.95 2.99817C16.2275 2.99817 15.5121 3.14052 14.8446 3.41708C14.1772 3.69364 13.5708 4.099 13.06 4.61L12 5.67L10.94 4.61C9.9083 3.5783 8.50903 2.9987 7.05 2.9987C5.59096 2.9987 4.19169 3.5783 3.16 4.61C2.1283 5.64169 1.54871 7.04096 1.54871 8.5C1.54871 9.95903 2.1283 11.3583 3.16 12.39L4.22 13.45L12 21.23L19.78 13.45L20.84 12.39C21.351 11.8792 21.7563 11.2728 22.0329 10.6053C22.3095 9.93789 22.4518 9.22248 22.4518 8.5C22.4518 7.77751 22.3095 7.0621 22.0329 6.39464C21.7563 5.72718 21.351 5.12075 20.84 4.61Z" stroke="currentColor" strokeWidth={props.strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    {/* Meaningful fill: Heart interior */}
    <path d="M12 7L15 10C15 10 17 8 18 7C19 6 20 6 20 8C20 10 18 12 12 18C6 12 4 10 4 8C4 6 5 6 6 7C7 8 9 10 9 10L12 7Z" fill={props.accentColor || "#374152"} />
  </DefaultIcon>
);

export const SettingsIcon: React.FC<ScrolliIconProps> = (props) => (
  <DefaultIcon {...props}>
    <path d="M12.22 2H11.78C11.2496 2.0026 10.7231 2.1268 10.2443 2.36236C9.76543 2.59792 9.34812 2.9381 9.027 3.355L8.793 3.667C8.58043 3.95043 8.30387 4.17699 7.989 4.325C7.67413 4.47301 7.33112 4.53754 6.992 4.512C6.46051 4.47203 5.93285 4.59623 5.46434 4.87179C4.99583 5.14735 4.60388 5.56466 4.33 6.08L4.11 6.5C3.84466 7.00512 3.73823 7.57987 3.805 8.147C3.87177 8.71413 4.10833 9.24557 4.482 9.67L4.717 9.982C5.0381 10.4089 5.2426 10.9144 5.312 11.452C5.3814 11.9896 5.3134 12.5424 5.114 13.06C4.9146 13.5776 4.5902 14.0434 4.17 14.415C3.7498 14.7866 3.2472 15.0521 2.71 15.187L2.27 15.3C1.70287 15.4418 1.18742 15.7482 0.79236 16.1786C0.3973 16.609 0.14112 17.1428 0.058 17.708L0.012 18.148C-0.0286 18.6784 0.0956 19.2049 0.37116 19.6734C0.64672 20.1419 1.06403 20.5339 1.57937 20.8095C2.09471 21.0851 2.68977 21.2331 3.298 21.237H3.738C4.2684 21.2344 4.7949 21.1102 5.2737 20.8746C5.7525 20.6391 6.16981 20.2989 6.491 19.882L6.725 19.57C6.93757 19.2866 7.21413 19.06 7.529 18.912C7.84387 18.764 8.18688 18.6995 8.526 18.725C9.05749 18.765 9.58515 18.6408 10.0537 18.3652C10.5222 18.0896 10.9141 17.6723 11.188 17.157L11.408 16.737C11.6733 16.2319 11.7798 15.6571 11.713 15.09C11.6462 14.5229 11.4097 13.9914 11.036 13.567L10.801 13.255C10.48 12.8281 10.2755 12.3226 10.206 11.785C10.1366 11.2474 10.2046 10.6946 10.404 10.177C10.6034 9.6594 10.9278 9.1936 11.348 8.822C11.7682 8.4504 12.2708 8.1849 12.808 8.05L13.248 7.94C13.8151 7.7982 14.3306 7.49177 14.7256 7.06136C15.1207 6.63096 15.3769 6.09717 15.46 5.532L15.506 5.092C15.5466 4.5616 15.4224 4.0351 15.1468 3.56659C14.8713 3.09808 14.454 2.70613 13.9386 2.43057C13.4233 2.15501 12.8282 2.00697 12.22 2.003V2Z" stroke="currentColor" strokeWidth={props.strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth={props.strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    {/* Meaningful fill: Gear center */}
    <circle cx="12" cy="12" r="1.5" fill={props.accentColor || "#374152"} />
  </DefaultIcon>
);

export const ThemeIcon: React.FC<ScrolliIconProps> = (props) => (
  <DefaultIcon {...props}>
    <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth={props.strokeWidth} />
    <path d="M12 1V3" stroke="currentColor" strokeWidth={props.strokeWidth} strokeLinecap="round" />
    <path d="M12 21V23" stroke="currentColor" strokeWidth={props.strokeWidth} strokeLinecap="round" />
    <path d="M4.22 4.22L5.64 5.64" stroke="currentColor" strokeWidth={props.strokeWidth} strokeLinecap="round" />
    <path d="M18.36 18.36L19.78 19.78" stroke="currentColor" strokeWidth={props.strokeWidth} strokeLinecap="round" />
    <path d="M1 12H3" stroke="currentColor" strokeWidth={props.strokeWidth} strokeLinecap="round" />
    <path d="M21 12H23" stroke="currentColor" strokeWidth={props.strokeWidth} strokeLinecap="round" />
    <path d="M4.22 19.78L5.64 18.36" stroke="currentColor" strokeWidth={props.strokeWidth} strokeLinecap="round" />
    <path d="M18.36 5.64L19.78 4.22" stroke="currentColor" strokeWidth={props.strokeWidth} strokeLinecap="round" />
    {/* Meaningful fill: Sun/Moon center */}
    <circle cx="12" cy="12" r="3" fill={props.accentColor || "#374152"} />
  </DefaultIcon>
);

export const CommunityIcon: React.FC<ScrolliIconProps> = (props) => (
  <DefaultIcon {...props}>
    <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="currentColor" strokeWidth={props.strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z" stroke="currentColor" strokeWidth={props.strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13" stroke="currentColor" strokeWidth={props.strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11684 19.0078 7.005C19.0078 7.89316 18.7122 8.75608 18.1676 9.45768C17.623 10.1593 16.8604 10.6597 16 10.88" stroke="currentColor" strokeWidth={props.strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    {/* Meaningful fill: Main user head */}
    <circle cx="9" cy="7" r="2" fill={props.accentColor || "#374152"} />
  </DefaultIcon>
);

export const PlayIcon: React.FC<ScrolliIconProps> = (props) => (
  <DefaultIcon {...props}>
    <path d="M5 3L19 12L5 21V3Z" stroke="currentColor" strokeWidth={props.strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    {/* Meaningful fill: Play button body */}
    <path d="M5 3L19 12L5 21V3Z" fill={props.accentColor || "#374152"} />
  </DefaultIcon>
);
