"use client";

import { Container } from "@/components/responsive";
import { Heading, Text } from "@/components/ui/typography";
import {
  sectionPadding,
  gap,
  colors,
} from "@/lib/design-tokens";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const imprintData = {
  publisher: {
    title: "Publisher Trade Title",
    value: "Scrolli Medya Anonim Şirketi",
  },
  managementPlace: {
    title: "Management Place",
    value: "Kadıköy, İstanbul",
  },
  editorInChief: {
    title: "Editor-in-Chief",
    value: "Mahir Boztepe",
  },
  boardOfDirectors: {
    title: "Board of Directors",
    members: [
      {
        role: "President",
        name: "Ilgaz Yalçın Fakıoğlu",
      },
      {
        role: "Vice President",
        name: "Nihat Avcı",
      },
    ],
  },
  legalEntityRepresentatives: {
    title: "Legal Entity Representatives",
    members: [
      "Ilgaz Yalçın Fakıoğlu",
      "Nihat Avcı",
    ],
  },
  corporateEmail: {
    title: "Corporate Email",
    value: "info@scrolli.co",
  },
  copyright: "All copyrights of articles, news, analysis and multimedia published on the www.scrolli.co website belong to Scrolli Media Inc. It cannot be acquired without permission, without showing the source.",
  rights: "© 2024 Scrolli. All Rights Reserved. Scrolli Media Inc.",
};

export default function ImprintSection() {
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
            <Heading level={1} variant="h1" color="primary">
              Imprint
            </Heading>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className={cn("flex flex-col", gap.lg)}
          >
            {/* Publisher */}
            <div className={cn("flex flex-col", gap.sm)}>
              <Text variant="bodySmall" color="muted" className="uppercase tracking-wide">
                {imprintData.publisher.title}
              </Text>
              <Text variant="body" color="primary">
                {imprintData.publisher.value}
              </Text>
            </div>

            {/* Management Place */}
            <div className={cn("flex flex-col", gap.sm)}>
              <Text variant="bodySmall" color="muted" className="uppercase tracking-wide">
                {imprintData.managementPlace.title}
              </Text>
              <Text variant="body" color="primary">
                {imprintData.managementPlace.value}
              </Text>
            </div>

            {/* Editor-in-Chief */}
            <div className={cn("flex flex-col", gap.sm)}>
              <Text variant="bodySmall" color="muted" className="uppercase tracking-wide">
                {imprintData.editorInChief.title}
              </Text>
              <Text variant="body" color="primary">
                {imprintData.editorInChief.value}
              </Text>
            </div>

            {/* Board of Directors */}
            <div className={cn("flex flex-col", gap.sm)}>
              <Text variant="bodySmall" color="muted" className="uppercase tracking-wide">
                {imprintData.boardOfDirectors.title}
              </Text>
              <div className={cn("flex flex-col", gap.md)}>
                {imprintData.boardOfDirectors.members.map((member, index) => (
                  <div key={index} className={cn("flex flex-col", gap.xs)}>
                    <Text variant="bodySmall" color="muted">
                      {member.role}:
                    </Text>
                    <Text variant="body" color="primary">
                      {member.name}
                    </Text>
                  </div>
                ))}
              </div>
            </div>

            {/* Legal Entity Representatives */}
            <div className={cn("flex flex-col", gap.sm)}>
              <Text variant="bodySmall" color="muted" className="uppercase tracking-wide">
                {imprintData.legalEntityRepresentatives.title}
              </Text>
              <div className={cn("flex flex-col", gap.xs)}>
                {imprintData.legalEntityRepresentatives.members.map((name, index) => (
                  <Text key={index} variant="body" color="primary">
                    {name}
                  </Text>
                ))}
              </div>
            </div>

            {/* Corporate Email */}
            <div className={cn("flex flex-col", gap.sm)}>
              <Text variant="bodySmall" color="muted" className="uppercase tracking-wide">
                {imprintData.corporateEmail.title}
              </Text>
              <Text variant="body" color="primary">
                <a 
                  href={`mailto:${imprintData.corporateEmail.value}`}
                  className="hover:text-primary transition-colors"
                >
                  {imprintData.corporateEmail.value}
                </a>
              </Text>
            </div>

            {/* Copyright */}
            <div className={cn("flex flex-col", gap.md, "pt-8 border-t", colors.border.DEFAULT)}>
              <Text variant="bodySmall" color="secondary" className="leading-relaxed">
                {imprintData.copyright}
              </Text>
              <Text variant="bodySmall" color="secondary">
                {imprintData.rights}
              </Text>
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}

