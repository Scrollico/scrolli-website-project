"use client";

import ComponentShowcase from "../ComponentShowcase";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card } from "@/components/ui/card";
import { Text } from "@/components/ui/typography";
import { gap } from "@/lib/design-tokens";
import { cn } from "@/lib/utils";

export default function CarouselShowcase() {
  const items = [
    { id: 1, title: "Slide 1", content: "First slide content" },
    { id: 2, title: "Slide 2", content: "Second slide content" },
    { id: 3, title: "Slide 3", content: "Third slide content" },
    { id: 4, title: "Slide 4", content: "Fourth slide content" },
  ];

  return (
    <>
      <ComponentShowcase
        id="carousel"
        title="Carousel"
        description="Carousel component built with Embla Carousel. Supports horizontal and vertical orientations, keyboard navigation, and custom controls."
        demo={
          <div className={cn("w-full space-y-8", gap.lg)}>
            <div className="max-w-2xl mx-auto">
              <Carousel className="w-full">
                <CarouselContent>
                  {items.map((item) => (
                    <CarouselItem key={item.id}>
                      <Card className={cn("p-6")}>
                        <Text variant="bodyLarge" className="font-semibold mb-2">
                          {item.title}
                        </Text>
                        <Text color="secondary">{item.content}</Text>
                      </Card>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
            </div>
          </div>
        }
        code={`import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

<Carousel className="w-full">
  <CarouselContent>
    <CarouselItem>
      <div>Slide 1</div>
    </CarouselItem>
    <CarouselItem>
      <div>Slide 2</div>
    </CarouselItem>
  </CarouselContent>
  <CarouselPrevious />
  <CarouselNext />
</Carousel>`}
        props={{
          "Carousel": {
            type: "React.HTMLAttributes<HTMLDivElement> & CarouselProps",
            default: "—",
            description: "Root carousel component"
          },
          "opts": {
            type: "CarouselOptions",
            default: "{}",
            description: "Embla carousel options"
          },
          "orientation": {
            type: "horizontal | vertical",
            default: "horizontal",
            description: "Carousel orientation"
          },
          "CarouselContent": {
            type: "React.HTMLAttributes<HTMLDivElement>",
            default: "—",
            description: "Carousel content container"
          },
          "CarouselItem": {
            type: "React.HTMLAttributes<HTMLDivElement>",
            default: "—",
            description: "Individual carousel slide"
          },
          "CarouselPrevious": {
            type: "React.ComponentProps<typeof Button>",
            default: "—",
            description: "Previous slide button"
          },
          "CarouselNext": {
            type: "React.ComponentProps<typeof Button>",
            default: "—",
            description: "Next slide button"
          }
        }}
      />
    </>
  );
}

















