'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Plus, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { colors, gap } from '@/lib/design-tokens';

interface FollowButtonProps {
  topic: string;
  profileImage?: string;
  className?: string;
}

export default function FollowButton({ 
  topic, 
  profileImage = "/assets/images/alara-sm.webp",
  className 
}: FollowButtonProps) {
  const [isFollowing, setIsFollowing] = useState(false);

  const handleClick = () => {
    setIsFollowing(!isFollowing);
  };

  return (
    <div 
      data-test-id="tf-wrapper"
      className={cn(
        "w-full flex items-center py-3 px-4",
        gap.md,
        "border-t border-b",
        colors.border.DEFAULT,
        colors.background.base,
        "hover:opacity-90 transition-opacity duration-200",
        "cursor-pointer",
        className
      )}
      onClick={handleClick}
    >
      {/* Profile Icon - Centered */}
      <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0 flex items-center justify-center">
        <Image
          src={profileImage}
          alt={topic}
          width={40}
          height={40}
          className="object-cover rounded-full"
        />
      </div>

      {/* Text Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          {isFollowing ? (
            <>
              <span className={cn("font-semibold text-sm", colors.foreground.primary)}>
                Following
              </span>
              <span className={cn("text-sm", colors.foreground.primary)}>
                {topic}
              </span>
            </>
          ) : (
            <>
              <span className={cn("font-semibold text-sm", colors.foreground.primary)}>
                Subscribe
              </span>
              <span className={cn("text-sm", colors.foreground.primary)}>
                {topic}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Follow Icon - Circular with Plus/Check */}
      <div className="flex-shrink-0">
        {isFollowing ? (
          <div className={cn("w-6 h-6 rounded-full border flex items-center justify-center bg-transparent", colors.border.DEFAULT)}>
            <Check className={cn("w-3.5 h-3.5", colors.foreground.secondary)} />
          </div>
        ) : (
          <div className={cn("w-6 h-6 rounded-full border flex items-center justify-center bg-transparent", colors.border.DEFAULT)}>
            <Plus className={cn("w-3.5 h-3.5", colors.foreground.secondary)} />
          </div>
        )}
      </div>
    </div>
  );
}
