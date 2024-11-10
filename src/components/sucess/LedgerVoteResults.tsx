// src/components/LedgerVoteResults.tsx

"use client";

import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card"; // Ensure these paths are correct
import { VoteCountsPieChart } from "@/components/sucess/VoteCountsPieChart"; // Import the Pie Chart component
import Podium from "@/components/sucess/Podium"; // Import the Podium component

// Define interface for votes
interface Votes {
  [candidateName: string]: number;
}

// Define interface for transformed vote counts
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
    // Fetch the vote results from the API
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

  // Transform votes object to VoteCount[] format
  const transformVotes = (votesObj: Votes): VoteCount[] => {
    return Object.entries(votesObj).map(([candidateName, count]) => ({
      candidateName,
      _count: {
        candidateName: count,
      },
    }));
  };

  // Prepare voteCounts for visualization
  const voteCounts: VoteCount[] = transformVotes(votes);

  // Extract top 3 candidates for the Podium
  const topThree = [...voteCounts]
    .sort((a, b) => b._count.candidateName - a._count.candidateName)
    .slice(0, 3);

  return (
    <div className="bg-gray-900 pb-40">
      <div className="max-w-7xl mx-auto">
        {/* Ledger Vote Results Card */}
        <Card className="bg-gray-800 p-6 shadow-lg mt-8">
          <CardHeader className="flex justify-between items-center">
            <CardTitle className="text-2xl font-semibold text-gray-100">
            Voting Reslts.
            </CardTitle>
            <span className="text-sm text-gray-400">
              This data was pulled from the XRP ledger.
            </span>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-gray-300">Loading vote results...</p>
            ) : error ? (
              <p className="text-red-500">Error: {error}</p>
            ) : Object.keys(votes).length === 0 ? (
              <p className="text-gray-300">No votes available.</p>
            ) : (
              // Flex Container to Arrange Components Side by Side
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
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LedgerVoteResults;
