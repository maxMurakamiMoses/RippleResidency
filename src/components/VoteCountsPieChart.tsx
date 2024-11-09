// src/components/VoteCountsPieChart.tsx

"use client";

import React from "react";
import { Pie, PieChart, Tooltip, ResponsiveContainer } from "recharts";
import {
  ChartConfig,
  ChartContainer,
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
    <div className="w-full max-w-md mx-auto p-4 rounded-lg shadow-md">
      {/* Optional Header */}
      {/* If you still want to include a title or description, you can add them here */}
      {/* 
      <div className="mb-4 text-center">
        <h2 className="text-xl font-semibold text-gray-100">Vote Counts</h2>
        <p className="text-gray-400">Current Vote Distribution</p>
      </div>
      */}
      <ChartContainer
        config={chartConfig}
        className="relative mx-auto aspect-square max-h-[250px] [&_.recharts-pie-label-text]:fill-white"
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
    </div>
  );
};
