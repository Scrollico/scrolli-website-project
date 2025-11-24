"use client";

import { useState } from "react";
import { Container } from "@/components/responsive";
import { Heading, Text } from "@/components/ui/typography";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  sectionPadding,
  gap,
  colors,
  typography,
  fontWeight,
  componentPadding,
  borderRadius,
} from "@/lib/design-tokens";
import Link from "next/link";

const navigationLinks = [
  { id: "our-role", label: "Our Privacy Policy" },
  { id: "data-collection", label: "When and how we collect data" },
  { id: "data-collection-time", label: "Data collection time and method" },
  { id: "types-of-data", label: "Types of data we collect" },
  { id: "how-we-use", label: "How and why we use your data" },
  { id: "privacy-rights", label: "Your privacy preferences and rights" },
  { id: "data-security", label: "Where do we store the data?" },
  { id: "data-storage", label: "How long do we store your data?" },
  { id: "third-parties", label: "Third parties processing your data" },
  { id: "cookies", label: "Cookies" },
  { id: "making-better", label: "To make this policy even better, but how" },
];

export default function TermsOfUseSection() {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set()
  );

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(sectionId)) {
        newSet.delete(sectionId);
      } else {
        newSet.add(sectionId);
      }
      return newSet;
    });
  };

  return (
    <section className={cn(sectionPadding.xl, colors.background.base)}>
      <Container size="lg" padding="lg">
        <div className={cn("flex flex-col lg:flex-row", gap.xl)}>
          {/* Left Sidebar - Navigation */}
          <motion.aside
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="lg:w-1/4 flex-shrink-0"
          >
            <div className={cn("sticky top-8", "flex flex-col", gap.md)}>
              <Heading level={3} variant="h3" color="primary" className="mb-4">
                Navigation
              </Heading>
              <nav className={cn("flex flex-col", gap.sm)}>
                {navigationLinks.map((link) => (
                  <Link
                    key={link.id}
                    href={`#${link.id}`}
                    className={cn(
                      typography.bodySmall,
                      colors.foreground.secondary,
                      "hover:text-primary transition-colors"
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>
          </motion.aside>

          {/* Right Side - Main Content */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex-1"
          >
            <div className={cn("flex flex-col", gap.xl)}>
              {/* Introduction */}
              <div id="introduction" className={cn("flex flex-col", gap.md)}>
                <Heading level={3} variant="h3" color="primary">
                  Terms of Use and Illumination Statement
                </Heading>
                <Text variant="body" color="secondary">
                  Hello. On this page you can find details of the disclosure
                  text, terms of use and our privacy policy. As Scrolli Media
                  Joint-Stock Company, a transparent experience is important to
                  us. (Known as scrolli).
                </Text>
              </div>

              {/* Our Role in Your Privacy */}
              <div id="our-role" className={cn("flex flex-col", gap.lg)}>
                <Heading level={4} variant="h4" color="primary">
                  Our Role in Your Privacy
                </Heading>
                <Text variant="body" color="secondary">
                  This policy applies to you if you are a customer, a
                  subscriber or simply a visitor to our website as Scrolli.
                </Text>

                <div className={cn("flex flex-col", gap.md)}>
                  <Heading level={5} variant="h5" color="primary">
                    Our Responsibilities
                  </Heading>
                  <Text variant="body" color="secondary">
                    As Scrolli, when you are a registered customer or a person
                    visiting our website, we act as a "data controller" of
                    personal data. This means that we determine how and why your
                    data is processed.
                  </Text>

                  <Heading level={5} variant="h5" color="primary">
                    Your Responsibilities
                  </Heading>
                  <ul className={cn("list-disc list-inside", gap.sm, "flex flex-col")}>
                    <li>
                      <Text variant="body" color="secondary">
                        Read this Privacy Policy.
                      </Text>
                    </li>
                    <li>
                      <Text variant="body" color="secondary">
                        If you are our customer, please also check the
                        agreements — they include the Data Processing Agreement
                        between us and may provide more details about how your
                        data is processed. This information can be obtained on
                        request at{" "}
                        <Link
                          href="mailto:info@scrolli.co"
                          className="text-primary hover:underline"
                        >
                          info@scrolli.co
                        </Link>
                        .
                      </Text>
                    </li>
                    <li>
                      <Text variant="body" color="secondary">
                        If you share personal information with us of others, you
                        inform us that we will use it for a specific reason, and
                        by providing this information to us, you consent to our
                        processing on your behalf in accordance with this Privacy
                        Policy.
                      </Text>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Data Collection Time and Methods */}
              <div id="data-collection" className={cn("flex flex-col", gap.lg)}>
                <Heading level={4} variant="h4" color="primary">
                  Data Collection Time and Methods
                </Heading>
                <Text variant="body" color="secondary">
                  If you are only a visitor to our website, please know that we
                  do not collect any personal data before you become a member of
                  Scrolli. We perform site measurements using the
                  privacy-focused analytics platform Google Analytics.
                </Text>
                <Text variant="body" color="secondary">
                  From the moment you become a member of Scrolli, we start
                  collecting data. Sometimes you share your data with us,
                  sometimes your data is collected automatically.
                </Text>
                <Text variant="body" color="secondary" className="font-medium">
                  Here are our data collection times and methods:
                </Text>

                <div className={cn("overflow-x-auto")}>
                  <table className={cn("w-full border-collapse", colors.border.DEFAULT, "border")}>
                    <thead>
                      <tr className={cn(colors.background.elevated)}>
                        <th className={cn(componentPadding.md, colors.border.DEFAULT, "border", "text-left", typography.bodySmall, fontWeight.medium)}>
                          Your data
                        </th>
                        <th className={cn(componentPadding.md, colors.border.DEFAULT, "border", "text-left", typography.bodySmall, fontWeight.medium)}>
                          What We Collect
                        </th>
                        <th className={cn(componentPadding.md, colors.border.DEFAULT, "border", "text-left", typography.bodySmall, fontWeight.medium)}>
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className={cn(componentPadding.md, colors.border.DEFAULT, "border")}>
                          <Text variant="bodySmall" color="secondary">
                            Website Visit
                          </Text>
                        </td>
                        <td className={cn(componentPadding.md, colors.border.DEFAULT, "border")}>
                          <Text variant="bodySmall" color="secondary">
                            -
                          </Text>
                        </td>
                        <td className={cn(componentPadding.md, colors.border.DEFAULT, "border")}>
                          <Text variant="bodySmall" color="secondary">
                            -
                          </Text>
                        </td>
                      </tr>
                      <tr>
                        <td className={cn(componentPadding.md, colors.border.DEFAULT, "border")}>
                          <Text variant="bodySmall" color="secondary">
                            Membership Procedures
                          </Text>
                        </td>
                        <td className={cn(componentPadding.md, colors.border.DEFAULT, "border")}>
                          <Text variant="bodySmall" color="secondary">
                            -
                          </Text>
                        </td>
                        <td className={cn(componentPadding.md, colors.border.DEFAULT, "border")}>
                          <Text variant="bodySmall" color="secondary">
                            -
                          </Text>
                        </td>
                      </tr>
                      <tr>
                        <td className={cn(componentPadding.md, colors.border.DEFAULT, "border")}>
                          <Text variant="bodySmall" color="secondary">
                            Use of the Service
                          </Text>
                        </td>
                        <td className={cn(componentPadding.md, colors.border.DEFAULT, "border")}>
                          <Text variant="bodySmall" color="secondary">
                            -
                          </Text>
                        </td>
                        <td className={cn(componentPadding.md, colors.border.DEFAULT, "border")}>
                          <Text variant="bodySmall" color="secondary">
                            -
                          </Text>
                        </td>
                      </tr>
                      <tr>
                        <td className={cn(componentPadding.md, colors.border.DEFAULT, "border")}>
                          <Text variant="bodySmall" color="secondary">
                            Contact & Support
                          </Text>
                        </td>
                        <td className={cn(componentPadding.md, colors.border.DEFAULT, "border")}>
                          <Text variant="bodySmall" color="secondary">
                            -
                          </Text>
                        </td>
                        <td className={cn(componentPadding.md, colors.border.DEFAULT, "border")}>
                          <Text variant="bodySmall" color="secondary">
                            -
                          </Text>
                        </td>
                      </tr>
                      <tr>
                        <td className={cn(componentPadding.md, colors.border.DEFAULT, "border")}>
                          <Text variant="bodySmall" color="secondary">
                            Marketing Events
                          </Text>
                        </td>
                        <td className={cn(componentPadding.md, colors.border.DEFAULT, "border")}>
                          <Text variant="bodySmall" color="secondary">
                            -
                          </Text>
                        </td>
                        <td className={cn(componentPadding.md, colors.border.DEFAULT, "border")}>
                          <Text variant="bodySmall" color="secondary">
                            -
                          </Text>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Types of Data We Collect */}
              <div id="types-of-data" className={cn("flex flex-col", gap.lg)}>
                <Heading level={4} variant="h4" color="primary">
                  Types of Data We Collect
                </Heading>

                <div className={cn("flex flex-col", gap.md)}>
                  <div>
                    <Text variant="body" color="secondary">
                      Your name, email address, etc.
                    </Text>
                    <Heading level={5} variant="h5" color="primary" className="mt-2">
                      Contact Details
                    </Heading>
                  </div>

                  <div>
                    <Text variant="body" color="secondary">
                      Your bank account number, sort code, credit/debit card
                      details, etc.
                    </Text>
                    <Heading level={5} variant="h5" color="primary" className="mt-2">
                      Financial Information
                    </Heading>
                  </div>

                  <div>
                    <Text variant="body" color="secondary">
                      Your IP address, login information, browser type and
                      version, time zone setting, browser plug-in types,
                      geolocation information about your location, operating
                      system and version, etc.
                    </Text>
                    <Heading level={5} variant="h5" color="primary" className="mt-2">
                      Data that Identifies You
                    </Heading>
                  </div>

                  <div>
                    <Text variant="body" color="secondary">
                      Your URL click flows (the path you follow on our site) on
                      the path you follow on our site, pages viewed, page
                      response times, download errors, how long you stay on our
                      site, what you do on those pages, how often, and other
                      actions.
                    </Text>
                    <Heading level={5} variant="h5" color="primary" className="mt-2">
                      Data on How You Use Scrolli
                    </Heading>
                  </div>
                </div>

                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="sensitive-data">
                    <AccordionTrigger>Read more</AccordionTrigger>
                    <AccordionContent>
                      <div className={cn("flex flex-col", gap.md)}>
                        <div>
                          <Text variant="body" color="secondary">
                            Scrolli does not collect "sensitive data" about you
                            (for example, data about race or ethnicity, political
                            views, religious/philosophical beliefs, union
                            membership, genetic data, biometric data, health
                            data, sex life or orientation, and allegations of
                            crimes or crimes).
                          </Text>
                          <Heading level={5} variant="h5" color="primary" className="mt-2">
                            What do we think about sensitive data?
                          </Heading>
                        </div>

                        <div>
                          <Text variant="body" color="secondary">
                            Scrolli is a public platform designed for
                            individuals aged 18 and over and also offers
                            business-to-business (B2B) services. We do not target
                            our services to children and do not knowingly collect
                            personal data from individuals under the age of 16.
                            In accordance with data protection laws, we avoid
                            collecting children's data without parental consent.
                          </Text>
                          <Heading level={5} variant="h5" color="primary" className="mt-2">
                            What do we think about children's data?
                          </Heading>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>

              {/* How and Why We Use Your Data */}
              <div id="how-we-use" className={cn("flex flex-col", gap.lg)}>
                <Heading level={4} variant="h4" color="primary">
                  How and Why We Use Your Data
                </Heading>
                <Text variant="body" color="secondary">
                  Data protection laws mean that we must only use your data for
                  specific reasons and on a legal basis. Here are our reasons
                  for processing your data:
                </Text>

                <div className={cn("flex flex-col", gap.md)}>
                  <div>
                    <Heading level={5} variant="h5" color="primary">
                      How to Keep Scrolli Working
                    </Heading>
                    <Text variant="body" color="secondary">
                      We use your personal data to perform basic functions such
                      as login and authentication, processing payments.
                    </Text>
                    <div className="mt-2">
                      <Text variant="bodySmall" color="muted" className="font-medium">
                        Legal Basis:
                      </Text>
                      <Link
                        href="#legitimate-interests"
                        className="text-primary hover:underline ml-2"
                      >
                        Legitimate Interests
                      </Link>
                    </div>
                  </div>

                  <div>
                    <Heading level={5} variant="h5" color="primary">
                      Improving Scrolli
                    </Heading>
                    <Text variant="body" color="secondary">
                      We process your data for product analytics, understanding
                      the use of our website, testing features and improving the
                      user experience.
                    </Text>
                    <div className="mt-2">
                      <Text variant="bodySmall" color="muted" className="font-medium">
                        Legal Basis:
                      </Text>
                      <Link
                        href="#legitimate-interests"
                        className="text-primary hover:underline ml-2"
                      >
                        Legitimate Interests
                      </Link>
                    </div>
                  </div>

                  <div>
                    <Heading level={5} variant="h5" color="primary">
                      Customer Support
                    </Heading>
                    <Text variant="body" color="secondary">
                      It includes notifying you of any changes to our service,
                      live chat support, resolving issues by phone or email, bug
                      fixes.
                    </Text>
                    <div className="mt-2">
                      <Text variant="bodySmall" color="muted" className="font-medium">
                        Legal Basis:
                      </Text>
                      <Link
                        href="#legitimate-interests"
                        className="text-primary hover:underline ml-2"
                      >
                        Legitimate Interests
                      </Link>
                    </div>
                  </div>

                  <div>
                    <Heading level={5} variant="h5" color="primary">
                      Marketing Purposes (With Your Consent)
                    </Heading>
                    <Text variant="body" color="secondary">
                      We send emails and messages about new features, products,
                      services and content.
                    </Text>
                    <div className="mt-2">
                      <Text variant="bodySmall" color="muted" className="font-medium">
                        Legal Basis:
                      </Text>
                      <Link
                        href="#legitimate-interests"
                        className="text-primary hover:underline ml-2"
                      >
                        Legitimate Interests
                      </Link>
                    </div>
                  </div>
                </div>

                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="legal-reasons">
                    <AccordionTrigger>More</AccordionTrigger>
                    <AccordionContent>
                      <div className={cn("flex flex-col", gap.lg)}>
                        <Heading level={5} variant="h5" color="primary">
                          What "Legal Reasons" Means:
                        </Heading>

                        <div className={cn("flex flex-col", gap.md)}>
                          <Heading level={5} variant="h5" color="primary">
                            Consent
                          </Heading>
                          <Text variant="body" color="secondary">
                            You give your explicit consent for us to process
                            your personal data for a specific purpose.
                          </Text>

                          <Heading level={5} variant="h5" color="primary">
                            You can change your mind!
                          </Heading>
                          <Text variant="body" color="secondary">
                            If you have previously consented to the processing
                            of your data, you can withdraw this consent at any
                            time. This{" "}
                            <Link
                              href="mailto:info@scrolli.co"
                              className="text-primary hover:underline"
                            >
                              info@scrolli.co
                            </Link>{" "}
                            You can do it by sending an email to the address.
                          </Text>
                          <Text variant="body" color="secondary">
                            If you withdraw your consent and there is no other
                            legal reason for us to process your information, then
                            we will stop the processing of your personal data. If
                            there is any other legal reason, we may continue to
                            operate subject to your legal rights.
                          </Text>

                          <Heading level={5} variant="h5" color="primary" id="legitimate-interests">
                            Legitimate Interests
                          </Heading>
                          <Text variant="body" color="secondary">
                            The processing of your data is necessary for our
                            legitimate interests or the legitimate interests of
                            a third party, unless these interests are balanced
                            by your rights and interests. These legitimate
                            interests include:
                          </Text>
                          <ul className={cn("list-disc list-inside", gap.sm, "flex flex-col")}>
                            <li>
                              <Text variant="body" color="secondary">
                                Gain understanding of your behavior on our
                                website or app.
                              </Text>
                            </li>
                            <li>
                              <Text variant="body" color="secondary">
                                To provide, develop and improve the Scrolli
                                service.
                              </Text>
                            </li>
                            <li>
                              <Text variant="body" color="secondary">
                                To provide, develop and adapt new features,
                                products, services and communications.
                              </Text>
                            </li>
                            <li>
                              <Text variant="body" color="secondary">
                                Determine whether marketing campaigns are
                                effective.
                              </Text>
                            </li>
                            <li>
                              <Text variant="body" color="secondary">
                                Improving data security.
                              </Text>
                            </li>
                          </ul>
                          <Text variant="body" color="secondary">
                            In any case, these legitimate interests only apply
                            as long as they are not outweighed by your rights
                            and interests.
                          </Text>
                          <Link
                            href="/global/hesap-silme"
                            className="text-primary hover:underline mt-4 inline-block"
                          >
                            Delete my account
                          </Link>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>

              {/* Your Privacy Options and Rights */}
              <div id="privacy-rights" className={cn("flex flex-col", gap.lg)}>
                <Heading level={4} variant="h4" color="primary">
                  Your Privacy Options and Rights
                </Heading>

                <div className={cn("flex flex-col", gap.md)}>
                  <Heading level={5} variant="h5" color="primary">
                    Your options
                  </Heading>

                  <div>
                    <Text variant="body" color="secondary">
                      You may continue to use our website and browse its pages,
                      but we may not be able to perform operations if you do
                      not provide personal data.
                    </Text>
                    <Heading level={5} variant="h5" color="primary" className="mt-2">
                      You Can Choose Not to Provide Personal Data
                    </Heading>
                  </div>

                  <div>
                    <Text variant="body" color="secondary">
                      You can block cookies by activating a setting in your
                      browser that will allow you to refuse cookies. You can
                      also delete cookies from your browser settings. If you
                      turn off cookies, you can continue to use Scrolli, but
                      some services (such as Google Analytics) may not work
                      actively.
                    </Text>
                    <Heading level={5} variant="h5" color="primary" className="mt-2">
                      You can turn off cookies by changing your browser settings
                    </Heading>
                  </div>

                  <div>
                    <Text variant="body" color="secondary">
                      Before we collect your data, we will notify you if we
                      plan to use your data for marketing purposes and where
                      third parties are involved. To opt out of marketing
                      activities, you can email us at{" "}
                      <Link
                        href="mailto:info@scrolli.co"
                        className="text-primary hover:underline"
                      >
                        info@scrolli.co
                      </Link>
                    </Text>
                    <Heading level={5} variant="h5" color="primary" className="mt-2">
                      You may ask us not to use your data for marketing purposes
                    </Heading>
                  </div>

                  <Heading level={5} variant="h5" color="primary">
                    Your rights
                  </Heading>
                  <Text variant="body" color="secondary">
                    As Scrolli, you are granted various rights under the
                    Personal Data Protection Law No. 6698. To exercise these
                    rights{" "}
                    <Link
                      href="mailto:info@scrolli.co"
                      className="text-primary hover:underline"
                    >
                      info@scrolli.co
                    </Link>{" "}
                    You can send an email at.
                  </Text>

                  <div>
                    <Text variant="body" color="secondary">
                      These rights include your right to request additional
                      information about the data processed by us:
                    </Text>
                    <ul className={cn("list-disc list-inside", gap.sm, "flex flex-col mt-2")}>
                      <li>
                        <Text variant="body" color="secondary">
                          Categories of data we process
                        </Text>
                      </li>
                      <li>
                        <Text variant="body" color="secondary">
                          Data processing purposes
                        </Text>
                      </li>
                      <li>
                        <Text variant="body" color="secondary">
                          Categories of third parties to which data may be
                          disclosed
                        </Text>
                      </li>
                      <li>
                        <Text variant="body" color="secondary">
                          How long the data will be stored or criteria for
                          determining this period
                        </Text>
                      </li>
                      <li>
                        <Text variant="body" color="secondary">
                          Your other rights in relation to our use of data
                        </Text>
                      </li>
                    </ul>
                    <Text variant="body" color="secondary" className="mt-2">
                      We will provide you with this information within one month
                      of receiving your request, but if this does not adversely
                      affect the rights and freedoms of others (such as another
                      person's privacy or intellectual property rights). If we
                      are unable to meet your request, we will inform you
                      accordingly.
                    </Text>
                    <Heading level={5} variant="h5" color="primary" className="mt-2">
                      Your Right to Access Information Held About You
                    </Heading>
                  </div>

                  <div>
                    <Text variant="body" color="secondary">
                      You can object to data being used for profiling or making
                      automated decisions about you. We may use your data to
                      determine whether we can learn information that may be
                      specific to you (for example, to send you emails that are
                      specific to you based on your behavior). Otherwise, we
                      will not be able to use your data except to provide the
                      Scrolli service to you.
                    </Text>
                    <Heading level={5} variant="h5" color="primary" className="mt-2">
                      Your Right to Rectify Incorrect Personal Data
                    </Heading>
                  </div>

                  <div>
                    <Text variant="body" color="secondary">
                      We enable you to export your data to another service by
                      providing a copy in CSV or JSON format. If you ask us, and
                      if technically possible, we will transfer the data
                      directly to the other service on your behalf. This is
                      carried out as long as it does not require the disclosure
                      of information about another individual.
                    </Text>
                    <Heading level={5} variant="h5" color="primary" className="mt-2">
                      Your Right to Transfer Your Data to Another Service
                    </Heading>
                  </div>

                  <div>
                    <Text variant="body" color="secondary">
                      If it is no longer necessary for us to keep your data with
                      us, you can request that we delete the personal data we
                      hold about you.
                    </Text>
                    <Heading level={5} variant="h5" color="primary" className="mt-2">
                      Your right to be forgotten
                    </Heading>
                  </div>

                  <div>
                    <Text variant="body" color="secondary">
                      Let us know first so we have a chance to address your
                      concerns. If your concerns are not resolved, you can
                      submit your complaint to the Personal Data Protection
                      Board (KVKK) by appropriate means.
                    </Text>
                    <Heading level={5} variant="h5" color="primary" className="mt-2">
                      Your right to complain about our use of data
                    </Heading>
                  </div>
                </div>
              </div>

              {/* Data Security */}
              <div id="data-security" className={cn("flex flex-col", gap.lg)}>
                <Heading level={4} variant="h4" color="primary">
                  How to ensure the security of the data we collect
                </Heading>
                <Text variant="body" color="secondary">
                  We ensure the security and protection of the information we
                  collect through our physical, electronic and administrative
                  procedures.
                </Text>
                <Text variant="body" color="secondary" className="font-medium">
                  And please remember:
                </Text>
                <ul className={cn("list-disc list-inside", gap.sm, "flex flex-col")}>
                  <li>
                    <Text variant="body" color="secondary">
                      You provide your personal data at your own risk;
                      unfortunately, data transmission cannot be 100% secure.
                    </Text>
                  </li>
                  <li>
                    <Text variant="body" color="secondary">
                      You are responsible for your username and password; keep
                      them private and secure!
                    </Text>
                  </li>
                  <li>
                    <Text variant="body" color="secondary">
                      If you think your privacy has been violated, please
                      immediately{" "}
                      <Link
                        href="mailto:info@scrolli.co"
                        className="text-primary hover:underline"
                      >
                        info@scrolli.co
                      </Link>{" "}
                      contact us at.
                    </Text>
                  </li>
                </ul>
              </div>

              {/* Where Do We Store Data */}
              <div id="data-storage" className={cn("flex flex-col", gap.lg)}>
                <Heading level={4} variant="h4" color="primary">
                  Where Do We Store Data?
                </Heading>
                <Text variant="body" color="secondary">
                  In order to securely store your data and increase its
                  accessibility, we use Cloudflare's globally distributed
                  content delivery network (CDN) points. This strategy stores
                  your data on servers in different geo-locations, providing both
                  redundancy and faster and more reliable access to our users.
                  Using Cloudflare's CDN infrastructure goes beyond our
                  processing of your data in the countries where we live
                  (including Belgium, France, the Netherlands, Poland, South
                  Africa, the United Kingdom, the United States) and in the
                  specified third-party facilities, providing a global access
                  network. In this way, we reinforce our commitment to
                  maintaining high standards of security and performance in data
                  transfer, storage or processing operations.
                </Text>
              </div>

              {/* How Long Do We Keep Your Data */}
              <div id="data-storage" className={cn("flex flex-col", gap.lg)}>
                <Heading level={4} variant="h4" color="primary">
                  How Long Do We Keep Your Data?
                </Heading>
                <Text variant="body" color="secondary">
                  We will continue to actively use your personally identifiable
                  information for a maximum of 3 months from the date you last
                  used Scrolli. We will delete your personal data in our
                  archives no later than 6 years from the date of your last use
                  of Scrolli or process it as we have agreed with you in a
                  separate contract.
                </Text>
              </div>

              {/* Third Parties Processing Your Data */}
              <div id="third-parties" className={cn("flex flex-col", gap.lg)}>
                <Heading level={4} variant="h4" color="primary">
                  Third Parties Processing Your Data
                </Heading>
                <Text variant="body" color="secondary">
                  Technology businesses often use third parties to host their
                  apps, communicate with customers, and manage their email. We
                  partner with third parties who are experts in these areas and
                  believe do their job best.
                </Text>
                <Text variant="body" color="secondary">
                  When we share your data, it is sometimes necessary for us to
                  share your data to ensure that these services work properly.
                  Your data will be shared within the framework of the security
                  measures and good practices outlined in this Privacy Policy
                  and only when strictly necessary. If personal data is
                  processed in the United States by a third party, standard
                  contractual clauses apply during the transfer of data. We
                  constantly monitor this transfer mechanism. Data transfers to
                  the US are usually encrypted and usually consist of
                  non-sensitive personal data.
                </Text>

                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="third-parties-details">
                    <AccordionTrigger>More</AccordionTrigger>
                    <AccordionContent>
                      <div className={cn("flex flex-col", gap.lg)}>
                        <Text variant="body" color="secondary">
                          Here are the details of our main third-party service
                          providers and the data we share with or collect from
                          them:
                        </Text>

                        <div className={cn("flex flex-col", gap.md)}>
                          <Heading level={5} variant="h5" color="primary">
                            Infrastructure:
                          </Heading>

                          <div className={cn("overflow-x-auto")}>
                            <table className={cn("w-full border-collapse", colors.border.DEFAULT, "border")}>
                              <thead>
                                <tr className={cn(colors.background.elevated)}>
                                  <th className={cn(componentPadding.md, colors.border.DEFAULT, "border", "text-left", typography.bodySmall, fontWeight.medium)}>
                                    Service Provider
                                  </th>
                                  <th className={cn(componentPadding.md, colors.border.DEFAULT, "border", "text-left", typography.bodySmall, fontWeight.medium)}>
                                    Data Collected or Shared
                                  </th>
                                  <th className={cn(componentPadding.md, colors.border.DEFAULT, "border", "text-left", typography.bodySmall, fontWeight.medium)}>
                                    Purpose
                                  </th>
                                  <th className={cn(componentPadding.md, colors.border.DEFAULT, "border", "text-left", typography.bodySmall, fontWeight.medium)}>
                                    Data Processing Place
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                  <td className={cn(componentPadding.md, colors.border.DEFAULT, "border")}>
                                    <Text variant="bodySmall" color="secondary" className="font-medium">
                                      Google Tag Manager
                                    </Text>
                                  </td>
                                  <td className={cn(componentPadding.md, colors.border.DEFAULT, "border")}>
                                    <ul className={cn("list-disc list-inside")}>
                                      <li>
                                        <Text variant="bodySmall" color="secondary">
                                          Contact information
                                        </Text>
                                      </li>
                                      <li>
                                        <Text variant="bodySmall" color="secondary">
                                          Metadata in your source code
                                        </Text>
                                      </li>
                                      <li>
                                        <Text variant="bodySmall" color="secondary">
                                          Data that defines you
                                        </Text>
                                      </li>
                                    </ul>
                                  </td>
                                  <td className={cn(componentPadding.md, colors.border.DEFAULT, "border")}>
                                    <Text variant="bodySmall" color="secondary">
                                      Allows you to manage tags for your
                                      website's various marketing and analytics
                                      services. This helps you easily add and
                                      update multiple tags, so you can speed up
                                      data collection and tracking without coding
                                      knowledge.
                                    </Text>
                                  </td>
                                  <td className={cn(componentPadding.md, colors.border.DEFAULT, "border")}>
                                    <Text variant="bodySmall" color="secondary">
                                      Asia, Europe
                                    </Text>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>

                          <Heading level={5} variant="h5" color="primary">
                            Entegrasyonlar
                          </Heading>

                          <div className={cn("overflow-x-auto")}>
                            <table className={cn("w-full border-collapse", colors.border.DEFAULT, "border")}>
                              <thead>
                                <tr className={cn(colors.background.elevated)}>
                                  <th className={cn(componentPadding.md, colors.border.DEFAULT, "border", "text-left", typography.bodySmall, fontWeight.medium)}>
                                    HİZMET SAĞLAYICI
                                  </th>
                                  <th className={cn(componentPadding.md, colors.border.DEFAULT, "border", "text-left", typography.bodySmall, fontWeight.medium)}>
                                    toplanan veya paylaşılan veriler
                                  </th>
                                  <th className={cn(componentPadding.md, colors.border.DEFAULT, "border", "text-left", typography.bodySmall, fontWeight.medium)}>
                                    Amaç
                                  </th>
                                  <th className={cn(componentPadding.md, colors.border.DEFAULT, "border", "text-left", typography.bodySmall, fontWeight.medium)}>
                                    veri işleme yeri
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                  <td className={cn(componentPadding.md, colors.border.DEFAULT, "border")}>
                                    <Text variant="bodySmall" color="secondary" className="font-medium">
                                      Mailchimp
                                    </Text>
                                  </td>
                                  <td className={cn(componentPadding.md, colors.border.DEFAULT, "border")}>
                                    <Text variant="bodySmall" color="secondary">
                                      Data that defines you
                                    </Text>
                                  </td>
                                  <td className={cn(componentPadding.md, colors.border.DEFAULT, "border")}>
                                    <Text variant="bodySmall" color="secondary">
                                      Used to manage your email marketing
                                      campaigns. It offers a number of tools for
                                      sending newsletters to your subscribers,
                                      setting up automated emails, and analyzing
                                      your email activity.
                                    </Text>
                                  </td>
                                  <td className={cn(componentPadding.md, colors.border.DEFAULT, "border")}>
                                    <Text variant="bodySmall" color="secondary">
                                      Asia, Europe
                                    </Text>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>

                          <Heading level={5} variant="h5" color="primary">
                            Communication
                          </Heading>

                          <div className={cn("overflow-x-auto")}>
                            <table className={cn("w-full border-collapse", colors.border.DEFAULT, "border")}>
                              <thead>
                                <tr className={cn(colors.background.elevated)}>
                                  <th className={cn(componentPadding.md, colors.border.DEFAULT, "border", "text-left", typography.bodySmall, fontWeight.medium)}>
                                    Service Provider
                                  </th>
                                  <th className={cn(componentPadding.md, colors.border.DEFAULT, "border", "text-left", typography.bodySmall, fontWeight.medium)}>
                                    Data Collected or Shared
                                  </th>
                                  <th className={cn(componentPadding.md, colors.border.DEFAULT, "border", "text-left", typography.bodySmall, fontWeight.medium)}>
                                    PURPOSE
                                  </th>
                                  <th className={cn(componentPadding.md, colors.border.DEFAULT, "border", "text-left", typography.bodySmall, fontWeight.medium)}>
                                    Data Processing Place
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                  <td className={cn(componentPadding.md, colors.border.DEFAULT, "border")}>
                                    <Text variant="bodySmall" color="secondary" className="font-medium">
                                      Google Analytics
                                    </Text>
                                  </td>
                                  <td className={cn(componentPadding.md, colors.border.DEFAULT, "border")}>
                                    <Text variant="bodySmall" color="secondary">
                                      Contact information
                                    </Text>
                                  </td>
                                  <td className={cn(componentPadding.md, colors.border.DEFAULT, "border")}>
                                    <Text variant="bodySmall" color="secondary">
                                      It helps you understand who comes to your
                                      website, how long visitors spend on your
                                      pages, and what content attracts the most
                                      attention. It also provides detailed
                                      analytics to understand user behavior and
                                      conversion rates.
                                    </Text>
                                  </td>
                                  <td className={cn(componentPadding.md, colors.border.DEFAULT, "border")}>
                                    <Text variant="bodySmall" color="secondary">
                                      Asia, Europe
                                    </Text>
                                  </td>
                                </tr>
                                <tr>
                                  <td className={cn(componentPadding.md, colors.border.DEFAULT, "border")}>
                                    <Text variant="bodySmall" color="secondary" className="font-medium">
                                      Meta Ads (also known as Facebook Ads)
                                    </Text>
                                  </td>
                                  <td className={cn(componentPadding.md, colors.border.DEFAULT, "border")}>
                                    <ul className={cn("list-disc list-inside")}>
                                      <li>
                                        <Text variant="bodySmall" color="secondary">
                                          Contact information
                                        </Text>
                                      </li>
                                      <li>
                                        <Text variant="bodySmall" color="secondary">
                                          How to use Scrolli
                                        </Text>
                                      </li>
                                      <li>
                                        <Text variant="bodySmall" color="secondary">
                                          Cookies
                                        </Text>
                                      </li>
                                    </ul>
                                  </td>
                                  <td className={cn(componentPadding.md, colors.border.DEFAULT, "border")}>
                                    <Text variant="bodySmall" color="secondary">
                                      It is used to manage advertising campaigns
                                      on Meta platforms such as Facebook and
                                      Instagram. It offers features such as
                                      audience selection, budget adjustment, and
                                      ad performance monitoring.
                                    </Text>
                                  </td>
                                  <td className={cn(componentPadding.md, colors.border.DEFAULT, "border")}>
                                    <Text variant="bodySmall" color="secondary">
                                      Asia, Europe
                                    </Text>
                                  </td>
                                </tr>
                                <tr>
                                  <td className={cn(componentPadding.md, colors.border.DEFAULT, "border")}>
                                    <Text variant="bodySmall" color="secondary" className="font-medium">
                                      Google Ads
                                    </Text>
                                  </td>
                                  <td className={cn(componentPadding.md, colors.border.DEFAULT, "border")}>
                                    <ul className={cn("list-disc list-inside")}>
                                      <li>
                                        <Text variant="bodySmall" color="secondary">
                                          Contact information
                                        </Text>
                                      </li>
                                      <li>
                                        <Text variant="bodySmall" color="secondary">
                                          Cookies
                                        </Text>
                                      </li>
                                    </ul>
                                  </td>
                                  <td className={cn(componentPadding.md, colors.border.DEFAULT, "border")}>
                                    <Text variant="bodySmall" color="secondary">
                                      Allows you to advertise on Search and
                                      Display networks. It offers a wide set of
                                      tools for appearing high on specific
                                      keywords, creating targeted ads, and
                                      tracking ad activity.
                                    </Text>
                                  </td>
                                  <td className={cn(componentPadding.md, colors.border.DEFAULT, "border")}>
                                    <Text variant="bodySmall" color="secondary">
                                      Asia, Europe
                                    </Text>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>

                          <Heading level={5} variant="h5" color="primary">
                            Payment Information
                          </Heading>

                          <div className={cn("overflow-x-auto")}>
                            <table className={cn("w-full border-collapse", colors.border.DEFAULT, "border")}>
                              <thead>
                                <tr className={cn(colors.background.elevated)}>
                                  <th className={cn(componentPadding.md, colors.border.DEFAULT, "border", "text-left", typography.bodySmall, fontWeight.medium)}>
                                    Hizmet Sağlayıcı
                                  </th>
                                  <th className={cn(componentPadding.md, colors.border.DEFAULT, "border", "text-left", typography.bodySmall, fontWeight.medium)}>
                                    Toplanan veya Paylaşılan Veriler
                                  </th>
                                  <th className={cn(componentPadding.md, colors.border.DEFAULT, "border", "text-left", typography.bodySmall, fontWeight.medium)}>
                                    PURPOSE
                                  </th>
                                  <th className={cn(componentPadding.md, colors.border.DEFAULT, "border", "text-left", typography.bodySmall, fontWeight.medium)}>
                                    Data Processing Place
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                  <td className={cn(componentPadding.md, colors.border.DEFAULT, "border")}>
                                    <Text variant="bodySmall" color="secondary" className="font-medium">
                                      Stripe, Inc.
                                    </Text>
                                  </td>
                                  <td className={cn(componentPadding.md, colors.border.DEFAULT, "border")}>
                                    <ul className={cn("list-disc list-inside")}>
                                      <li>
                                        <Text variant="bodySmall" color="secondary">
                                          Contact information
                                        </Text>
                                      </li>
                                      <li>
                                        <Text variant="bodySmall" color="secondary">
                                          Financial information
                                        </Text>
                                      </li>
                                    </ul>
                                  </td>
                                  <td className={cn(componentPadding.md, colors.border.DEFAULT, "border")}>
                                    <Text variant="bodySmall" color="secondary">
                                      It is a payment processing platform that
                                      allows you to accept online payments. It
                                      allows you to securely process customers'
                                      payment information and perform
                                      transactions.
                                    </Text>
                                  </td>
                                  <td className={cn(componentPadding.md, colors.border.DEFAULT, "border")}>
                                    <Text variant="bodySmall" color="secondary">
                                      Asia, Europe
                                    </Text>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>

              {/* Cookies */}
              <div id="cookies" className={cn("flex flex-col", gap.lg)}>
                <Heading level={4} variant="h4" color="primary">
                  Cookies
                </Heading>
                <Text variant="body" color="secondary">
                  When you interact with Bearer as a user, we (and these third
                  parties) will post cookies unless you change your browser
                  settings. These can be 'session' cookies, meaning they delete
                  themselves and when you leave Bearer, or they can be
                  'persistent' cookies, which do not delete themselves and help
                  us to recognise you and provide you with a tailored service.
                </Text>
                <Heading level={5} variant="h5" color="primary">
                  How do I block cookies?
                </Heading>
                <Text variant="body" color="secondary">
                  You can block cookies by activating a setting in your browser,
                  which gives you permission to refuse the setting of cookies.
                  You can also delete cookies through your browser settings. If
                  you disable cookies using your browser settings or refuse
                  non-mandatory cookies, some parts of our website may not be
                  fully functional. Please note that we have no control over our
                  use of third-party cookies.
                </Text>
              </div>

              {/* Making this policy even better */}
              <div id="making-better" className={cn("flex flex-col", gap.lg)}>
                <Heading level={4} variant="h4" color="primary">
                  Making this policy even better
                </Heading>
                <Text variant="body" color="secondary">
                  Please also visit this page later as we will post any changes
                  on this page — important changes will of course be notified to
                  you by email.
                </Text>
                <Text variant="body" color="secondary">
                  ❤️
                </Text>
              </div>
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}

