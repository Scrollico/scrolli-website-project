"use client";
import dynamic from 'next/dynamic';
import Layout from "@/components/layout/Layout";
import HeroSection from '@/components/sections/home/HeroSection';
import Section1 from '@/components/sections/home/Section1';
import { ArticleListSkeleton } from '@/components/ui/LoadingSkeletons';

// Lazy load below-fold sections with no SSR for faster initial load
const ArticlesSection = dynamic(
  () => import('@/components/sections/home/ArticlesSection'),
  {
    loading: () => <ArticleListSkeleton count={6} />,
    ssr: false, // Disable SSR for below-fold content
  }
);

const NewsletterBanner = dynamic(
  () => import('@/components/sections/home/NewsletterBanner'),
  { ssr: false }
);

const Section2 = dynamic(
  () => import('@/components/sections/home/Section2'),
  {
    loading: () => <ArticleListSkeleton count={4} />,
    ssr: false,
  }
);

const VideoSection = dynamic(
  () => import('@/components/sections/home/VideoSection'),
  {
    loading: () => <ArticleListSkeleton count={3} />,
    ssr: false,
  }
);

const Section3 = dynamic(
  () => import('@/components/sections/home/Section3'),
  {
    loading: () => <ArticleListSkeleton count={5} />,
    ssr: false,
  }
);

const NewsletterPopup = dynamic(
  () => import('@/components/sections/home/NewsletterPopup'),
  { ssr: false }
);

export default function Home() {
  return (
    <Layout classList="home">
      <HeroSection />
      <Section1 />
      <ArticlesSection />
      <NewsletterBanner />
      <Section2 />
      <VideoSection />
      <Section3 />
      <NewsletterPopup />
    </Layout>
  );
}
