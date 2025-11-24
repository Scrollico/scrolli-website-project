import Layout from "@/components/layout/Layout"
import HeroSection from '@/components/sections/about-us/HeroSection'
import AboutSection2 from '@/components/sections/about-us/AboutSection2'
import ValuesSection from '@/components/sections/about-us/ValuesSection'
import TeamSection from '@/components/sections/about-us/TeamSection'
import GuidelinesSection from '@/components/sections/about-us/GuidelinesSection'

export default function AboutUs() {
  return (
    <>
      <Layout classList="single page-about-us">
        <HeroSection />
        <AboutSection2 />
        <ValuesSection />
        <TeamSection />
        <GuidelinesSection />
      </Layout>
    </>
  );
}
