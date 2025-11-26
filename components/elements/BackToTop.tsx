'use client';

import { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function BackToTop() {
	const [isVisible, setIsVisible] = useState(false);

	useEffect(() => {
		const handleScroll = () => {
			const scrollTop = window.scrollY || document.documentElement.scrollTop;
			setIsVisible(scrollTop > 300);
		};

		// Check on mount
		handleScroll();

		window.addEventListener('scroll', handleScroll, { passive: true });
		return () => window.removeEventListener('scroll', handleScroll);
	}, []);

	const scrollToTop = (e: React.MouseEvent) => {
		e.preventDefault();
		window.scrollTo({ top: 0, behavior: 'smooth' });
	};

	return (
		<button
			type="button"
			onClick={scrollToTop}
			aria-label="Scroll to top"
			className={cn(
				"fixed bottom-8 right-8 z-50",
				"flex items-center justify-center",
				"w-12 h-12 rounded-full",
				"bg-gray-900 dark:bg-gray-100",
				"text-white dark:text-gray-900",
				"shadow-lg hover:shadow-xl",
				"transition-all duration-300 ease-in-out",
				"hover:scale-110 active:scale-95",
				"focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2",
				"dark:focus:ring-gray-100",
				isVisible 
					? "opacity-100 translate-y-0 pointer-events-auto" 
					: "opacity-0 translate-y-4 pointer-events-none"
			)}
		>
			<ArrowUp className="w-5 h-5" />
		</button>
	);
}
