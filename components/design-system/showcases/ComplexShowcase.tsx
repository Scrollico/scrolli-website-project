"use client";

import ComponentShowcase from "../ComponentShowcase";
import { News } from "@/components/ui/sidebar-news";
import { Text } from "@/components/ui/typography";
import { gap } from "@/lib/design-tokens";
import { cn } from "@/lib/utils";

export default function ComplexShowcase() {
  const sampleArticles = [
    {
      href: "#",
      title: "Sample News Article 1",
      summary: "This is a sample news article summary that demonstrates the sidebar news component.",
      image: "/assets/images/thumb/thumb-1400x778.jpg",
    },
    {
      href: "#",
      title: "Sample News Article 2",
      summary: "Another example article showing how the news component displays multiple items.",
      image: "/assets/images/thumb/thumb-1400x778.jpg",
    },
  ];

  return (
    <>
      <ComponentShowcase
        id="complex"
        title="Complex Components"
        description="Complex, composed components that combine multiple design system elements. These showcase real-world usage patterns."
        demo={
          <div className={cn("w-full space-y-12", gap.xl)}>
            {/* SidebarNews */}
            <div className="space-y-4">
              <Text variant="bodyLarge" className="font-semibold">SidebarNews Component</Text>
              <div className="max-w-md">
                <News articles={sampleArticles} />
              </div>
            </div>

            {/* Usage Example */}
            <div className={cn("p-6 rounded-lg border", "bg-gray-50 dark:bg-gray-800")}>
              <Text variant="bodySmall" color="muted">
                These components demonstrate how design tokens and base components are combined
                to create more complex, feature-rich components. They serve as examples of best
                practices for component composition.
              </Text>
            </div>
          </div>
        }
        code={`import { News } from "@/components/ui/sidebar-news";

const articles = [
  {
    href: "#",
    title: "Article Title",
    summary: "Article summary",
    image: "/path/to/image.jpg",
  },
];

<News articles={articles} />`}
        props={{
          "News": {
            type: "{ articles: NewsArticle[] }",
            default: "—",
            description: "Sidebar news component with dismissible cards"
          },
          "articles": {
            type: "NewsArticle[]",
            default: "[]",
            description: "Array of news articles to display"
          },
          "NewsArticle": {
            type: "{ href: string; title: string; summary: string; image: string; }",
            default: "—",
            description: "News article object"
          }
        }}
      />
    </>
  );
}

















