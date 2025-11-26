'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Plus, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

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
        "w-full flex items-center gap-3 py-3 px-4",
        "border-t border-b border-gray-200 dark:border-gray-700",
        "bg-white dark:bg-gray-800",
        "hover:bg-gray-50 dark:hover:bg-gray-700",
        "transition-colors duration-200",
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
              <span className="font-semibold text-sm text-gray-900 dark:text-white">
                Following
              </span>
              <span className="text-sm text-gray-900 dark:text-white">
                {topic}
              </span>
            </>
          ) : (
            <>
              <span className="font-semibold text-sm text-gray-900 dark:text-white">
                Subscribe
              </span>
              <span className="text-sm text-gray-900 dark:text-white">
                {topic}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Follow Icon - Circular with Plus/Check */}
      <div className="flex-shrink-0">
        {isFollowing ? (
          <div className="w-6 h-6 rounded-full border border-gray-400 dark:border-gray-500 flex items-center justify-center bg-transparent">
            <Check className="w-3.5 h-3.5 text-gray-600 dark:text-gray-400" />
          </div>
        ) : (
          <div className="w-6 h-6 rounded-full border border-gray-400 dark:border-gray-500 flex items-center justify-center bg-transparent">
            <Plus className="w-3.5 h-3.5 text-gray-600 dark:text-gray-400" />
          </div>
        )}
      </div>
    </div>
  );
}
