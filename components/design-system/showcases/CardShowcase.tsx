"use client";

import ComponentShowcase from "../ComponentShowcase";
import {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { gap } from "@/lib/design-tokens";
import { cn } from "@/lib/utils";

export default function CardShowcase() {
  return (
    <>
      <ComponentShowcase
        id="cards"
        title="Cards"
        description="Card component with header, content, footer, title, and description sub-components. Perfect for content containers."
        demo={
          <div className={cn("w-full space-y-8", gap.lg)}>
            {/* Basic Card */}
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle>Card Title</CardTitle>
                <CardDescription>Card description goes here</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Card content area. This is where the main content goes.</p>
              </CardContent>
              <CardFooter>
                <Button>Action</Button>
              </CardFooter>
            </Card>

            {/* Card without Footer */}
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle>Simple Card</CardTitle>
                <CardDescription>Card without footer</CardDescription>
              </CardHeader>
              <CardContent>
                <p>This card only has header and content sections.</p>
              </CardContent>
            </Card>
          </div>
        }
        code={`import {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card description</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Card content</p>
  </CardContent>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>`}
        props={{
          "Card": {
            type: "React.HTMLAttributes<HTMLDivElement>",
            default: "—",
            description: "Main card container"
          },
          "CardHeader": {
            type: "React.HTMLAttributes<HTMLDivElement>",
            default: "—",
            description: "Card header section"
          },
          "CardTitle": {
            type: "React.HTMLAttributes<HTMLHeadingElement>",
            default: "—",
            description: "Card title heading"
          },
          "CardDescription": {
            type: "React.HTMLAttributes<HTMLParagraphElement>",
            default: "—",
            description: "Card description text"
          },
          "CardContent": {
            type: "React.HTMLAttributes<HTMLDivElement>",
            default: "—",
            description: "Card main content area"
          },
          "CardFooter": {
            type: "React.HTMLAttributes<HTMLDivElement>",
            default: "—",
            description: "Card footer section"
          }
        }}
      />
    </>
  );
}

















