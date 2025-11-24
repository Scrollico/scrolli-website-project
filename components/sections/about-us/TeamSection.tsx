"use client";

import Image from "next/image";
import { Container } from "@/components/responsive";
import { Heading, Text } from "@/components/ui/typography";
import {
  sectionPadding,
  gap,
  colors,
  borderRadius,
} from "@/lib/design-tokens";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const teamMembers = [
  {
    name: "Ilgaz Fakıoğlu",
    role: "Co-Founder & CEO",
    image:
      "https://cdn.prod.website-files.com/63b053ef35937392bd426a55/679819dea5fc098630a3c2db_Ilgaz%20Fakioglu.webp",
  },
  {
    name: "Nihat Avcı",
    role: "Co-Founder & CMO",
    image:
      "https://cdn.prod.website-files.com/63b053ef35937392bd426a55/67981c148fd8a7ecc12dab6f_Nihat%20Avc%C4%B1.webp",
  },
  {
    name: "Mahir Boztepe",
    role: "Editor-in-Chief",
    image:
      "https://cdn.prod.website-files.com/63b053ef35937392bd426a55/67981c78639f491b1e2138a5_Mahir%20Boztepe%20Image.webp",
  },
  {
    name: "Ghassan Khalife",
    role: "Global Partner",
    image:
      "https://cdn.prod.website-files.com/63b053ef35937392bd426a55/67ad961b8037a76ce6020cc4_New%20Template%20Post%201080x1350.webp",
  },
  {
    name: "Ufuk Fakıoğlu",
    role: "CTO",
    image:
      "https://cdn.prod.website-files.com/63b053ef35937392bd426a55/67981c8dd1d71f867025613c_Ufuk%20Emre%20Fakioglu.webp",
  },
  {
    name: "Afşın Avcı",
    role: "Media Sales Partner",
    image:
      "https://cdn.prod.website-files.com/63b053ef35937392bd426a55/67981c9ff2f486d37e19b6e5_Afsin%20Avci.webp",
  },
  {
    name: "Anıl Basat",
    role: "Creative Director",
    image:
      "https://cdn.prod.website-files.com/63b053ef35937392bd426a55/6584c2caf1989cd92122c8e1_an%C4%B1l%20basat.webp",
  },
  {
    name: "Can Semercioğlu",
    role: "Comms Consultant",
    image:
      "https://cdn.prod.website-files.com/63b053ef35937392bd426a55/67981cb76da90c9ac4fa302c_Can%20Semercioglu.webp",
  },
  {
    name: "Zeynep Çakır",
    role: "Brand Consultant",
    image:
      "https://cdn.prod.website-files.com/63b053ef35937392bd426a55/67981ce1067c6294f7f9049c_IMG%209362.webp",
  },
  {
    name: "Ahmetcan Uzlaşık",
    role: "Global Representative",
    image:
      "https://cdn.prod.website-files.com/63b053ef35937392bd426a55/67981cf51cfe3558241451c6_Ahmetcan%20Uzlas%CC%A7%C4%B1k%20(1).webp",
  },
  {
    name: "Rıfat Özcan",
    role: "Media Partner",
    image:
      "https://cdn.prod.website-files.com/63b053ef35937392bd426a55/67a1530024732be37fe0a3f5_Rifat%20Ozcan.webp",
  },
];

export default function TeamSection() {
  return (
    <section
      className={cn(sectionPadding.xl, colors.background.base)}
    >
      <Container size="lg" padding="lg">
        <div className={cn("flex flex-col", gap.xl)}>
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className={cn("flex flex-col", gap.md)}
          >
            <Heading level={2} variant="h2" color="primary">
              Team
            </Heading>
            <Text variant="bodyLarge" color="secondary" className="max-w-3xl">
              Scrolli's organizational structure focuses on media professionals,
              expert names from different disciplines and industries.
            </Text>
          </motion.div>

          {/* Team Grid */}
          <div
            className={cn(
              "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
              gap.lg
            )}
          >
            {teamMembers.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className={cn("flex flex-col", gap.sm)}
              >
                <div
                  className={cn(
                    "relative aspect-square w-full overflow-hidden",
                    borderRadius.lg
                  )}
                >
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                </div>
                <div className={cn("flex flex-col", gap.xs)}>
                  <Heading level={4} variant="h5" color="primary">
                    {member.name}
                  </Heading>
                  <Text variant="bodySmall" color="secondary">
                    {member.role}
                  </Text>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}

