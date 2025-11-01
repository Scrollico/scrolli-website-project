"use client";

import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/responsive";

export default function HeroSection() {
  return (
    <section className="relative w-full min-h-screen md:h-screen flex items-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-10">
        <Image
          src="/assets/images/thumb/thumb-1400x778.jpg"
          alt="Featured article background"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/30 via-black/10 to-black/40 z-20" />
        {/* Bottom gradient transition */}
        <div className="absolute bottom-0 left-0 w-full h-[90%] bg-gradient-to-t from-white via-white/80 to-transparent z-20" />
      </div>

      {/* Content */}
      <Container className="relative z-30">
        <div className="max-w-2xl">
          {/* Featured Label */}
          <div className="mb-4 md:mb-8">
            <span className="inline-block px-3 py-2 text-xs md:text-sm font-normal text-white bg-black/30 backdrop-blur-sm rounded border border-white/20 uppercase tracking-wide cursor-default opacity-90 shadow-sm">
              Featured
            </span>
          </div>

          {/* Headline */}
          <h1 className="mb-6 md:mb-8 text-xl md:text-2xl lg:text-3xl xl:text-4xl font-semibold leading-tight text-white max-w-full font-cabin" style={{ textShadow: '0 2px 8px rgba(0, 0, 0, 0.5), 0 0 20px rgba(0, 0, 0, 0.3)' }}>
            Marco Grassi: 'A painting's months-long journey can't keep up with the pace of the digital world'
          </h1>

          {/* Read More Link */}
          <Link
            href="#"
            className="inline-flex items-center gap-3 px-6 py-4 md:px-8 md:py-5 text-base md:text-lg font-medium text-foreground no-underline bg-white/20 backdrop-blur-md rounded-full border border-white/30 hover:bg-white/30 hover:-translate-y-1 transition-all duration-300"
          >
            Read in-depth
            <svg
              className="h-5 w-5 md:h-6 md:w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        </div>
      </Container>
    </section>
  );
}
