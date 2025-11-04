"use client";
import { useState, useEffect } from 'react';
import Layout from "@/components/layout/Layout"
import HeroSection from '@/components/sections/home/HeroSection'
import Section1 from '@/components/sections/home/Section1'
import ArticlesSection from '@/components/sections/home/ArticlesSection'
import Section2 from '@/components/sections/home/Section2'
import Section3 from '@/components/sections/home/Section3'
import VideoSection from '@/components/sections/home/VideoSection'
import NewsletterModal from '@/components/NewsletterModal'

export default function Home() {
	const [showNewsletter, setShowNewsletter] = useState(false);

	useEffect(() => {
		// Show newsletter modal after 3 seconds (adjust as needed)
		const timer = setTimeout(() => {
			const hasSeenModal = localStorage.getItem('newsletter-modal-seen');
			if (!hasSeenModal) {
				setShowNewsletter(true);
			}
		}, 3000);

		return () => clearTimeout(timer);
	}, []);

	const handleCloseModal = () => {
		setShowNewsletter(false);
		localStorage.setItem('newsletter-modal-seen', 'true');
	};

	return (
		<>
			<Layout classList="home" onNewsletterClick={() => setShowNewsletter(true)}>
				<HeroSection />
				<Section1 />
				<ArticlesSection />
				<Section2 />
				<VideoSection />
				<Section3 />
			</Layout>

			<NewsletterModal
				isOpen={showNewsletter}
				onClose={handleCloseModal}
			/>
		</>
	)
}