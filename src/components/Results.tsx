// src/pages/Results.tsx

import React from "react";
import { PrismaClient } from "@prisma/client";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react"; // Optional: Replace or remove if not needed
import { VoteCountsPieChart } from "@/components/VoteCountsPieChart";
import Podium from "@/components/Podium";

// Define interface for vote counts
interface VoteCount {
  candidateName: string;
  _count: {
    candidateName: number;
  };
}

const prisma = new PrismaClient();

// Function to fetch vote counts from the database
async function getVoteCounts(): Promise<VoteCount[]> {
  const votes = await prisma.vote.groupBy({
    by: ["candidateName"],
    _count: {
      candidateName: true,
    },
    orderBy: {
      _count: {
        candidateName: "desc",
      },
    },
  });

  return votes;
}

const ResultsPage = async () => {
  // Fetch vote counts
  const voteCounts = await getVoteCounts();

  // Extract top 3 candidates
  const topThree = voteCounts.slice(0, 3);

  return (
    <div className="bg-gray-900 pb-40">
      <div className="max-w-7xl mx-auto">

        {/* Results Card */}
        <Card className="bg-gray-800 p-6 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold text-gray-100">
              Vote Distribution & Top Candidates
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Flex Container to Arrange Components Side by Side */}
            <div className="flex flex-col md:flex-row">
              {/* Vote Counts Pie Chart */}
              <div className="w-full md:w-1/2 mb-8 md:mb-0 md:pr-4">
                <VoteCountsPieChart voteCounts={voteCounts} />
              </div>

              {/* Podium Display */}
              <div className="w-full md:w-1/2 md:pl-4">
                <Podium topThree={topThree} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ResultsPage;
