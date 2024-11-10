// src/components/LedgerVoteResults.tsx

"use client";

import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card"; // Ensure these paths are correct
import { CheckCircle2 } from "lucide-react"; // Optional: Replace or remove if not needed

// Define interface for votes
interface Votes {
  [candidateName: string]: number;
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

  return (
    <div className="bg-gray-900 pb-40">
      <div className="max-w-7xl mx-auto">
        {/* Ledger Vote Results Card */}
        <Card className="bg-gray-800 p-6 shadow-lg mt-8">
          <CardHeader className="flex justify-between items-center">
            <CardTitle className="text-2xl font-semibold text-gray-100">
              Ledger Vote Results
            </CardTitle>
            <span className="text-sm text-gray-400">
              This data was pulled from the XRPL chain.
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
              <ul className="list-disc list-inside text-gray-100">
                {Object.entries(votes).map(([candidate, count]) => (
                  <li key={candidate}>
                    <span className="font-medium text-gray-200">{candidate}</span>:{" "}
                    <span className="text-green-400">{count}</span> votes
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LedgerVoteResults;
