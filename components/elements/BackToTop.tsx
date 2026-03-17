'use client';

import { useEffect, useState, useRef } from 'react';
import { ArrowUp } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function BackToTop() {
	const [isVisible, setIsVisible] = useState(false);
	const [isHikayelerPage, setIsHikayelerPage] = useState(false);
	const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

	// Detect hikayeler-page class (set by InlineScriptRenderer when Instorier is active)
	useEffect(() => {
		const checkHikayelerPage = () => {
			setIsHikayelerPage(document.body.classList.contains('hikayeler-page'));
		};

		const observer = new MutationObserver(checkHikayelerPage);
		observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
		checkHikayelerPage();

		return () => observer.disconnect();
	}, []);

	useEffect(() => {
		let ticking = false;

		const handleScroll = () => {
			if (!ticking) {
				window.requestAnimationFrame(() => {
					const scrollTop = window.scrollY || document.documentElement.scrollTop;

					// Clear any existing timeout
					if (scrollTimeoutRef.current) {
						clearTimeout(scrollTimeoutRef.current);
					}

					// Show button when scrolled down more than 300px
					if (scrollTop > 300) {
						setIsVisible(true);
					} else {
						// Hide with a small delay to prevent flickering
						scrollTimeoutRef.current = setTimeout(() => {
							setIsVisible(false);
						}, 100);
					}

					ticking = false;
				});
				ticking = true;
			}
		};

		// Check on mount
		handleScroll();

		window.addEventListener('scroll', handleScroll, { passive: true });
		return () => {
			window.removeEventListener('scroll', handleScroll);
			if (scrollTimeoutRef.current) {
				clearTimeout(scrollTimeoutRef.current);
			}
		};
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
				isHikayelerPage
					? "hidden"
					: isVisible
						? "opacity-100 translate-y-0 pointer-events-auto"
						: "opacity-0 translate-y-4 pointer-events-none"
			)}
		>
			<ArrowUp className="w-5 h-5" />
		</button>
	);
}
