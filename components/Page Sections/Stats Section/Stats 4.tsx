"use client";

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartData = [
  { month: "Jan", value: 200 },
  { month: "Feb", value: 350 },
  { month: "Mar", value: 500 },
  { month: "Apr", value: 600 },
  { month: "May", value: 700 },
  { month: "Jun", value: 800 },
  { month: "Jul", value: 900 },
];

const chartConfig = {
  value: {
    label: "Value",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export function Component() {
  return (
    <section id="stats">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center space-y-4 py-6 mx-auto">
          <h2 className="text-[14px] text-primary font-mono font-medium tracking-tight">
            STATS
          </h2>
          <h4 className="text-[42px] font-medium mb-2 text-balance max-w-3xl mx-auto tracking-tighter">
            Prototyping for UI Design
          </h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <p className="text-lg">
              Such software is rarely accompanied by uninstall utility and even
              when it is it almost always leaves broken Windows Registry keys
              behind it. Even if you have an anti-spyware tool your Windows
              Registry might be broken.
            </p>
          </div>
          <ChartContainer config={chartConfig}>
            <BarChart accessibilityLayer data={chartData}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="month"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Bar dataKey="value" fill="var(--color-value)" radius={8} />
            </BarChart>
          </ChartContainer>
        </div>
      </div>
    </section>
  );
}
