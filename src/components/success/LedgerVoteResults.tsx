"use client"

import React, { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { VoteCountsPieChart } from "@/components/success/VoteCountsPieChart";
import Podium from "@/components/success/Podium";

interface Votes {
  [candidateName: string]: number;
}

interface VoteCount {
  candidateName: string;
  _count: {
    candidateName: number;
  };
}

const LedgerVoteResults = () => {
  const [votes, setVotes] = useState<Votes>({});
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchVotes = async () => {
      try {
        const response = await fetch("/api/fetchVotes");
        const data = await response.json();

        if (data.success) {
          setVotes(data.votes);
        } else {
          setError(data.detail || "An error occurred while fetching votes.");
        }
      } catch (error) {
        setError("Failed to fetch vote results.");
      } finally {
        setLoading(false);
      }
    };

    fetchVotes();
  }, []);

  const transformVotes = (votesObj: Votes): VoteCount[] => {
    return Object.entries(votesObj).map(([candidateName, count]) => ({
      candidateName,
      _count: {
        candidateName: count,
      },
    }));
  };

  const voteCounts: VoteCount[] = transformVotes(votes);

  const topThree = [...voteCounts]
    .sort((a, b) => b._count.candidateName - a._count.candidateName)
    .slice(0, 3);

  return (
    <div className="bg-gray-900 pb-40">
      <div className="max-w-7xl mx-auto">
        <Card className="bg-gray-800 p-6 shadow-lg mt-8">
          <CardHeader className="flex justify-between items-center">
            <CardTitle className="text-2xl font-semibold text-gray-100">
              Voting Results
            </CardTitle>
            <span className="text-sm text-gray-400">
              This data was pulled from the XRP ledger.
            </span>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center items-center min-h-[280px]">
                <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
              </div>
            ) : error ? (
              <p className="text-red-500">Error: {error}</p>
            ) : Object.keys(votes).length === 0 ? (
              <p className="text-gray-300">No votes available.</p>
            ) : (
              <div className="flex flex-col md:flex-row">
                <div className="w-full md:w-1/2 mb-8 md:mb-0 md:pr-4">
                  <VoteCountsPieChart voteCounts={voteCounts} />
                </div>
                <div className="w-full md:w-1/2 md:pl-4">
                  <Podium topThree={topThree} />
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LedgerVoteResults; 