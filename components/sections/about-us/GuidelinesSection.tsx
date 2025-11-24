"use client";

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
} from "@/lib/design-tokens";

const guidelinesData = {
  intro:
    "Our next generation media direction focuses on different areas with a holistic approach. In this section, you can explore the principles that outline Scrolli's approach to new media.",
  sections: [
    {
      title: "Our publishing principles",
      items: [
        "Scrolli is based on the truth of the news. Allegations of dubious authenticity are not included in Scrolli's next-generation journalism practice. The facts are proven, fair, verified and presented to the reader as they are.",
        "The decision on whether a topic or event is newsworthy lies solely with Scrolli's editorial team and editor-in-chief.",
        "Scrolli maintains neutrality and equal distance in its relations with news sides. Interest, political bias and attitudes generated through news sources and news are not included in reporting processes.",
        "The basis of Scrolli's reporting activities is based on making sense of events and facts, rather than providing quick information. Scrolli therefore focuses on slow reporting and only confirmed information.",
        "The platform makes extensive use of the new generation of technological news presentation through its platform and social media channels. It considers storytelling as a tool to enhance reporting, not using it in a framework that would overshadow the value of objective reality. The principles for the use of artificial intelligence and technological products are set out in a directive.",
        "Scrolli's reporting activities and sponsored content and advertising processes are strictly separated from each other by separate team and organizational structure. Sponsorship and advertising activities are determined according to separate principles.",
        "Scrolli respects the privacy of private life. Unless there is a public interest in an emergency situation, hidden camera, unauthorized audio recording, disclosure of a secret identity, etc. cannot be included in the news.",
        "The elements that fall under the scope of terrorism, violence, hate speech and discrimination have no place in Scrolli's reporting activity. Expressions that magnify national identity, religion, ethnicity, gender-based hate speech and discrimination and denigrate disadvantaged groups cannot be used. In reporting activities with a public interest focus, human values are taken into account in all its scope.",
        "Scrolli observes the principles of democratic law. News activities and reporting do not include elements that form the basis for the principles of law and harm to democratic activities.",
        "Scrolli depends on a high level of editorial care in activities in which individuals and children under 18 years of age are directly covered or covered by the news. In a news and content that will negatively affect children, the necessary warnings are clearly given to the reader at the beginning of the news and content. In news about children, explicit names and photographs of children under the age of 18 cannot be published; no child may be used as a news source without the permission of the authorized parent.",
        "In the processes of Scrolli's reporting activities, in the event that the news undergoes current changes, the relevant news is modified and republished in the light of new evidence and sources. Apart from simple mistakes, elements that would directly change the essence or context of the news are added to the news along with the corresponding edit note, as readers can see.",
        "In the event that an error is found in any Scrolli report, in the case of a person or institution affected by it, a text of apology is published with the correction in the news. Depending on the nature of the mistake, the apology is also announced through the social media channels that the medium has. If a request for correction of any news transmitted to Scrolli was made by legal means, the policy of correction of counterfeiting is followed. The error is contradicted and the news or content is removed from the media.",
        "Blocking from the news or the Information Technologies and Communications Authority (BTK) channel published on Scrolli is presented to the reader together with the text that includes the judicial decision and with the same title.",
        "Current principles are critical to maintaining Scrolli's reliability and impartiality in its newsmaking and publishing processes. Treating readers, news sources and news subjects fairly and openly, in addition to maintaining the truth and integrity of the news, as well as strengthening Scrolli's reputation in the community, constitutes the fundamental objective of the principles.",
      ],
    },
    {
      title: "Sources of income and advertising",
      items: [
        "Scrolli is a media organization that provides a wide range of broadcasting services as Scrolli Media Joint-Stock Company apart from its reporting activities. The main purpose of the sources of income that Scrolli provides is for Scrolli to continue its operations. The main reason for the sources of income is the independent continuation of the new generation of journalistic activities.",
        "Scrolli's revenue sources are based on sponsored content and advertising collaborations, a subscription system, sponsored events, next-generation journalistic activities with external stakeholders, sales of technological products, and investment-grant relationships.",
        "Advertising and sponsored content collaborations with Scrolli's reporting activities are carried out separately within Scrolli's brand studio ScrollicolLabs, which leaves the newsroom as an organization and team.",
        "The relationships provided through Scrolli's sources of income are arranged in such a way as not to affect attitudes, impartiality and positions of interest that would affect Scrolli's reporting activities. Relationships established with advertisers are left solely to the representation of the brand studio.",
        "Scrolli operates on its platform in such a way that it does not focus on programmatic advertising and automated ad services. ScrollicolLabs does not offer advertising and sponsorship collaborations that are not involved in creative editorial and design processes.",
        "Scrolli clearly separates advertising content from news. Sponsored content created by Scrollicollabs for brands is published openly and prominently on the Scrolli platform and social media channels with the phrase \"Sponsored\". The logo and name of the brand with which cooperation is established within the scope of the content are necessarily indicated in the content or description.",
        "ScrolliCollabs studio serves as the creative content agency for content to be published outside of Scrolli's own platform. In external publishing collaborations with brands, the compliance of the advertiser and the publishing platform with Scrolli's corporate values and ethical principles is taken into account.",
        "Scrolli does not establish sponsorship or advertising collaborations for campaigns and promotions in the fields of health, law and policy through its brand studio ScrollicolLabs. Within the framework of ethical principles, ScrollicolLabs has the right to terminate the processes established with advertisers.",
        "The brand studio ScrolliCollabs is responsible for each content, publication schedule and related processes that will be created within the framework of sponsored content and advertising relationships.",
        "ScrolliCollabs contacts directly through the relevant advertiser or media buying agencies. It does not establish relationships within the process with people who have nothing to do with the brand or agency.",
        "ScrolliCollabs first asks the advertiser or agency for a detailed description of the campaign or promotion, routing information and visuals for minimal care of the content production processes.",
        "ScrolliCollabs prioritizes the relevant brand in brand collaborations in line with its corporate identity, mission and the area covered by the relevant campaign. The determination of strategies and campaign topics by advertisers on sustainable economy, equality of opportunity, social benefit, innovation forms the conditions for this.",
      ],
    },
    {
      title: "Artificial intelligence and product guideline",
      items: [
        "Scrolli's corporate strategy envisions AI as a central element in next-generation media. In the near future, it explores the integration of AI into production activities within the fields of innovation, media, and culture. The existing principles have been structured within this framework.",
        "The use of AI in Scrolli's journalism activities always requires human involvement. AI-generated news and content undergo additional editing and editorial review before publication. The final adjustments and the accurate presentation of objective facts are ensured through human oversight.",
        "Any AI-generated tools, materials, content, or branding used in Scrolli's operations are explicitly disclosed. The sources used in content creation are shared transparently with readers to maintain trust and openness.",
        "All branding, development, and business model rights of the Alara AI model-designed to enhance journalism and community engagement-belong to Scrolli Medya AŞ.",
        "The integrity and accuracy of data and sources used in AI tools for journalism are carefully examined. In generative AI applications, data coherence and logical consistency are verified through human supervision.",
        "AI professionals working within Scrolli are expected to have at least a basic level of education in AI. Individuals directly responsible for AI implementations are monitored in terms of their training and qualifications. If necessary, they receive or are provided with education to ensure ethical AI usage.",
        "AI-generated outputs are reviewed with the highest level of sensitivity. Content containing hate speech, violence, terrorism, or discrimination is strictly excluded from any news or media production.",
        "The primary goal of Scrolli's AI applications is to enhance the originality, quality, automation, and speed of news production, team management, and strategic objectives.",
        "Scrolli proactively collaborates with external stakeholders, academia, and industry experts on AI-related training, business development, and ecosystem building. Industrial partnerships may be considered for research purposes.",
        "Technological products developed by Scrolli's product team may be tested through pilot projects and prototypes within the platform and can also be commercially sold externally. These experiments contribute to the company's learning and innovation culture while prioritizing social benefit.",
      ],
    },
    {
      title: "Career",
      items: [
        "At Scrolli, we are a media startup with high growth potential. We position our team in dynamic groups equipped with next-generation technologies, under innovative and reliable leadership. We transform this dynamism and movement that encourages continuous development and creativity into a sustainable business environment.",
        "At Scrolli, we always prioritize human values to make the experience of our employees effective, efficient and enjoyable. By supporting their personal and professional development, we create a positive atmosphere in the workplace.",
        "Inter-team communication and cooperation, based on strategic thinking, creativity and continuous development. Our culture of open dialogue and collaboration enables everyone to share their ideas and grow together.",
        "We, Scrolli, adopt holistic production processes and act with innovation, courage and curiosity.",
        "We show equal respect and equal opportunity to individuals from all walks of life and from different backgrounds. Diversity and inclusion are among our core values.",
        "Creative productivity, which we set as the principle of our basic work, prepares the ground for continuous innovation and development. We focus on producing to thrive and communicating effectively to produce.",
        "We welcome applications from candidates who want to participate in Scrolli's career at info@scrolli.co.",
      ],
    },
  ],
};

export default function GuidelinesSection() {
  return (
    <section
      className={cn(sectionPadding.xl, colors.background.base)}
    >
      <Container size="lg" padding="lg">
        <div className={cn("flex flex-col lg:flex-row", gap.xl)}>
          {/* Left Side - Label */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="lg:w-1/4 flex-shrink-0"
          >
            <Heading level={2} variant="h2" color="primary" className="sticky top-8">
              Our guidelines
            </Heading>
            <Text variant="bodyLarge" color="secondary" className="mt-4 max-w-md">
              {guidelinesData.intro}
            </Text>
          </motion.div>

          {/* Right Side - Accordion */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex-1"
          >
            <Accordion type="single" collapsible className="w-full">
              {guidelinesData.sections.map((section, sectionIndex) => (
                <AccordionItem key={section.title} value={`section-${sectionIndex}`}>
                  <AccordionTrigger>
                    {section.title}
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className={cn("flex flex-col", gap.lg)}>
                      {section.items.map((item, itemIndex) => (
                        <div
                          key={itemIndex}
                          className={cn("flex gap-4 md:gap-6")}
                        >
                          {/* Big number */}
                          <div
                            className={cn(
                              "flex-shrink-0",
                              typography.h2,
                              colors.foreground.primary,
                              fontWeight.bold
                            )}
                          >
                            {itemIndex + 1}
                          </div>
                          {/* Text */}
                          <Text variant="body" color="secondary" className="flex-1">
                            {item}
                          </Text>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}

