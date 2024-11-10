// src/pages/SuccessPage.tsx

import React from "react";
import { PrismaClient } from "@prisma/client";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { CheckCircle2, Users, Gift } from "lucide-react";
import DBVoteResults from "@/components/sucess/DBVoteResults";
import LedgerVoteResults from "@/components/sucess/LedgerVoteResults";

const prisma = new PrismaClient();

// Add interface for searchParams
interface SuccessPageProps {
  searchParams: {
    sellOfferIndex?: string;
    walletAddress?: string;
  };
}

// Define an interface for vote counts
interface VoteCount {
  candidateName: string;
  _count: {
    candidateName: number;
  };
}

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

export default async function SuccessPage({ searchParams }: SuccessPageProps) {
  const voteCounts = await getVoteCounts();
  const sellOfferIndex = searchParams.sellOfferIndex;
  const walletAddress = searchParams.walletAddress;

  // Extract top 3 candidates
  const topThree = voteCounts.slice(0, 3);

  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">

        {/* NFT Transfer Details */}
        {walletAddress && (
          <Card className="mb-8 bg-blue-900">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gift className="h-5 w-5 text-blue-300" />
                <span className="text-gray-100">NFT Transfer Details</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm text-gray-300">
                  Wallet Address:
                  <span className="ml-2 font-mono text-gray-100">
                    {walletAddress}
                  </span>
                </p>
                {sellOfferIndex && (
                  <p className="text-sm text-gray-300">
                    Sell Offer Index:
                    <span className="ml-2 font-mono text-gray-100">
                      {sellOfferIndex}
                    </span>
                  </p>
                )}
                <p className="text-xs text-gray-400 mt-2">
                  Please keep these details for your records.
                </p>
              </div>
            </CardContent>
          </Card>
        )}
        <div className="mb-8 flex flex-col items-start sm:flex-row sm:justify-start sm:space-x-4">
          <CheckCircle2 className="h-12 w-12 text-green-500" />
          <div className="mt-4 sm:mt-0">
            <h1 className="text-3xl font-bold text-gray-100">
              Election Results
            </h1>
            <p className="text-lg text-gray-300">
              Here are the TLDR election results.
            </p>
          </div>
        </div>

        {/* Vote Counts Chart and Podium */}
        <DBVoteResults />
        <LedgerVoteResults />

        <div className="mb-8 flex flex-col items-start sm:flex-row sm:justify-start sm:space-x-4">
          <CheckCircle2 className="h-12 w-12 text-green-500" />
          <div className="mt-4 sm:mt-0">
            <h1 className="text-3xl font-bold text-gray-100">
              Election Results
            </h1>
            <p className="text-lg text-gray-300">
              Here are the detailed election results.
            </p>
          </div>
        </div>
        {/* Vote Counts Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {voteCounts.map((vote) => (
            <Card key={vote.candidateName} className="shadow-md bg-gray-800">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-gray-100">
                  {vote.candidateName}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <Users className="h-5 w-5 text-blue-300 mr-2" />
                  <span className="text-gray-300">
                    Votes: {vote._count.candidateName}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
