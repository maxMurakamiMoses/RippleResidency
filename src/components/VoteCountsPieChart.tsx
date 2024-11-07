// src/components/VoteCountsChart.tsx

"use client";

import React from "react";
import { TrendingUp } from "lucide-react";
import { Pie, PieChart, Tooltip, ResponsiveContainer } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface VoteCount {
  candidateName: string;
  _count: {
    candidateName: number;
  };
}

interface VoteCountsChartProps {
  voteCounts: VoteCount[];
}

export const VoteCountsPieChart: React.FC<VoteCountsChartProps> = ({
  voteCounts,
}) => {
  // Define a color palette. Extend or modify as needed.
  const colorPalette = [
    "var(--color-chart-1)",
    "var(--color-chart-2)",
    "var(--color-chart-3)",
    "var(--color-chart-4)",
    "var(--color-chart-5)",
    "var(--color-chart-6)",
    "var(--color-chart-7)",
    "var(--color-chart-8)",
  ];

  // Transform voteCounts data to fit the chart's expected format
  const chartData = voteCounts.map((vote, index) => ({
    name: vote.candidateName,
    value: vote._count.candidateName,
    fill: colorPalette[index % colorPalette.length],
  }));

  // Configure chart settings dynamically based on candidates
  const chartConfig: ChartConfig = voteCounts.reduce((config, vote, index) => {
    config[vote.candidateName] = {
      label: vote.candidateName,
      color: colorPalette[index % colorPalette.length],
    };
    return config;
  }, {} as ChartConfig);

  // Calculate total votes for trend calculation (optional)
  const totalVotes = chartData.reduce((sum, item) => sum + item.value, 0);
  const trendingPercentage = 5.2; // Replace with dynamic calculation if needed

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Vote Counts</CardTitle>
        <CardDescription>Current Vote Distribution</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px] pb-0 [&_.recharts-pie-label-text]:fill-foreground"
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip content={<ChartTooltipContent hideLabel />} />
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                label
                outerRadius="80%"
                innerRadius="40%"
                paddingAngle={5}
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};
