"use client";

import blogData from "@/data/blog.json";
import { PodcastGallery } from "@/components/ui/podcast-gallery";

export default function PodcastSection() {
  const { podcast_section } = blogData;

  // Transform podcast data to match PodcastGallery interface
  const podcastItems = podcast_section.podcasts.map((podcast) => ({
    id: podcast.id,
    title: podcast.title,
    host: podcast.host,
    platform: podcast.platform,
    spotify_url: podcast.spotify_url,
    image_url: podcast.image_url,
  }));

  return (
    <PodcastGallery
      title={podcast_section.title}
      subtitle={podcast_section.subtitle}
      description={podcast_section.description}
      items={podcastItems}
    />
  );
}
