import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Heading } from "@/components/ui/typography/Heading";

export function CallToAction() {
  return (
    <section id="cta">
      <div className="py-14">
        <Card className="mx-auto max-w-5xl shadow-none">
          <CardContent className="p-7">
            <div className="flex flex-col items-center justify-between gap-y-3.5 md:flex-row">
              <div className="flex flex-col items-center gap-y-3 md:items-start">
                <Heading level={3} variant="h3" className="text-center md:text-left leading-[1.15]">
                  Pick your favourite React Library
                </Heading>
                <p className="mx-auto max-w-xs text-center text-muted-foreground md:mx-0 md:max-w-full md:text-left">
                  Here is your favourite React Library that you want to buy,
                  it's MagicUI.
                </p>
              </div>
              <Button asChild className="w-48">
                <Link href="/">Buy now</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
