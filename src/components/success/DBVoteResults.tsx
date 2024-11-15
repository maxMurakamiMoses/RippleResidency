// src/pages/Results.tsx

import React from "react";
import { PrismaClient } from "@prisma/client";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { VoteCountsPieChart } from "@/components/success/VoteCountsPieChart";
import Podium from "@/components/success/Podium";

interface VoteCount {
  candidateName: string;
  _count: {
    candidateName: number;
  };
}

const prisma = new PrismaClient();

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

const DBVoteResults = async () => {
  const voteCounts = await getVoteCounts();
  const topThree = voteCounts.slice(0, 3);

  return (
    <div className="bg-gray-900 pb-40">
      <div className="max-w-7xl mx-auto">
        <Card className="bg-gray-800 p-6 shadow-lg">
          <CardHeader className="flex justify-between items-center">
            <CardTitle className="text-2xl font-semibold text-gray-100">
              Voting Reslts
            </CardTitle>
            <span className="text-sm text-gray-400">
              This data was pulled from a centralized DB.
            </span>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row">
              <div className="w-full md:w-1/2 mb-8 md:mb-0 md:pr-4">
                <VoteCountsPieChart voteCounts={voteCounts} />
              </div>
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

export default DBVoteResults;
