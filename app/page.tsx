"use client";
import dynamic from 'next/dynamic';
import Layout from "@/components/layout/Layout";
import HeroSection from '@/components/sections/home/HeroSection';
import Section1 from '@/components/sections/home/Section1';
import NewsletterBanner from '@/components/sections/home/NewsletterBanner';
import { ArticleListSkeleton } from '@/components/ui/LoadingSkeletons';

const ArticlesSection = dynamic(
  () => import('@/components/sections/home/ArticlesSection'),
  {
    loading: () => <ArticleListSkeleton count={6} />,
    ssr: true,
  }
);

const Section2 = dynamic(
  () => import('@/components/sections/home/Section2'),
  {
    loading: () => <ArticleListSkeleton count={4} />,
    ssr: true,
  }
);

const VideoSection = dynamic(
  () => import('@/components/sections/home/VideoSection'),
  {
    loading: () => <ArticleListSkeleton count={3} />,
    ssr: true,
  }
);

const Section3 = dynamic(
  () => import('@/components/sections/home/Section3'),
  {
    loading: () => <ArticleListSkeleton count={5} />,
    ssr: true,
  }
);

import NewsletterPopup from '@/components/sections/home/NewsletterPopup';

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
