"use client";
import { Container } from "@/components/responsive";
import { Heading, Text } from "@/components/ui/typography";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Article } from "@/types/content";
import Image from "next/image";
import Link from "next/link";
import { Calendar, Clock, ArrowRight, Play, Podcast } from "lucide-react";

interface DailyBriefingSectionProps {
    briefing: Article;
}

export default function DailyBriefingSection({ briefing }: DailyBriefingSectionProps) {
    if (!briefing) return null;

    return (
        <section className="bg-gray-50 dark:bg-gray-900/30 border-y border-gray-100 dark:border-gray-800 py-16">
            <Container>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

                    {/* Left Column: Briefing Content */}
                    <div className="space-y-6">
                        <div className="flex items-center space-x-3">
                            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800">
                                DAILY BRIEFING
                            </Badge>
                            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                <Calendar className="w-4 h-4 mr-1.5" />
                                <span>{briefing.date}</span>
                            </div>
                        </div>

                        <Heading level={2} variant="h2" className="text-gray-900 dark:text-white leading-tight">
                            {briefing.title}
                        </Heading>

                        {briefing.subtitle && (
                            <Heading level={3} variant="h4" className="text-gray-600 dark:text-gray-300 font-normal">
                                {briefing.subtitle}
                            </Heading>
                        )}

                        <div className="prose prose-lg dark:prose-invert text-gray-600 dark:text-gray-400 max-w-none line-clamp-3">
                            {briefing.excerpt}
                        </div>

                        <div className="flex flex-wrap items-center gap-4 pt-4">
                            <Link href={`/daily-briefing/${briefing.id}`} className="no-underline">
                                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-8">
                                    Read Full Briefing
                                    <ArrowRight className="w-4 h-4 ml-2" />
                                </Button>
                            </Link>

                            <Button variant="outline" size="lg" className="rounded-full border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800">
                                <Podcast className="w-4 h-4 mr-2" />
                                Listen
                            </Button>
                        </div>

                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 pt-2">
                            <Clock className="w-4 h-4 mr-1.5" />
                            <span>{briefing.readTime}</span>
                        </div>
                    </div>

                    {/* Right Column: Visual/Card */}
                    <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                        <div className="relative aspect-[4/3] w-full rounded-xl overflow-hidden shadow-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
                            {briefing.image ? (
                                <Image
                                    src={briefing.image}
                                    alt={briefing.title}
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800 text-gray-400">
                                    <span className="text-lg font-medium">Daily Briefing</span>
                                </div>
                            )}

                            {/* Play Button Overlay */}
                            <div className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-black/20 transition-colors">
                                <div className="w-16 h-16 bg-white/90 dark:bg-black/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                                    <Play className="w-6 h-6 text-blue-600 ml-1" fill="currentColor" />
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </Container>
        </section>
    );
}
