"use client";

import { useState } from "react";
import { VerificationLevel, IDKitWidget, useIDKit } from "@worldcoin/idkit";
import type { ISuccessResult } from "@worldcoin/idkit";

// Define the candidates
const PREDEFINED_CANDIDATES = [
  { id: 1, name: "John Smith" },
  { id: 2, name: "Jane Doe" },
  { id: 3, name: "Alice Johnson" },
  { id: 4, name: "Bob Wilson" },
];

export default function Home() {
  const app_id = process.env.NEXT_PUBLIC_WLD_APP_ID as `app_${string}`;
  const action = process.env.NEXT_PUBLIC_WLD_ACTION;

  if (!app_id) {
    throw new Error("app_id is not set in environment variables!");
  }
  if (!action) {
    throw new Error("action is not set in environment variables!");
  }

  const { setOpen } = useIDKit();

  // State management
  const [voteMethod, setVoteMethod] = useState<'select' | 'writeIn'>('select');
  const [selectedCandidate, setSelectedCandidate] = useState<string>('');
  const [writeInName, setWriteInName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleWriteInChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setWriteInName(e.target.value);
  };

  const handleCandidateSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCandidate(e.target.value);
  };

  const onSuccess = (result: ISuccessResult) => {
    handleProof(result);
  };

  const handleProof = async (result: ISuccessResult) => {
    try {
      setLoading(true);
      setError(null);
      setSuccessMessage(null);

      const candidateName = voteMethod === 'writeIn' ? writeInName : selectedCandidate;

      const response = await fetch("/api/saveVote", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          candidateName,
          nullifierHash: result.nullifier_hash,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSuccessMessage("Your vote has been successfully recorded!");
        console.log("Vote saved:", data.vote);
      } else {
        setError(data.detail || "Failed to save your vote.");
        console.error("Error saving vote:", data.detail);
      }
    } catch (err) {
      setError("An unexpected error occurred.");
      console.error("Unexpected error:", err);
    } finally {
      setLoading(false);
    }
  };

  const isVoteValid = voteMethod === 'select' ? selectedCandidate !== '' : writeInName.trim() !== '';

  return (
    <div>
      <div className="flex flex-col items-center justify-center align-middle h-screen px-4">
        <p className="text-2xl mb-5">World ID Cloud Template</p>
        
        {/* Vote Method Selection */}
        <div className="mb-4 w-full max-w-sm">
          <label className="block text-gray-700 mb-2">Choose your voting method:</label>
          <div className="flex gap-4">
            <button
              onClick={() => setVoteMethod('select')}
              className={`px-4 py-2 rounded-md ${
                voteMethod === 'select' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              Select Candidate
            </button>
            <button
              onClick={() => setVoteMethod('writeIn')}
              className={`px-4 py-2 rounded-md ${
                voteMethod === 'writeIn' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              Write-in Candidate
            </button>
          </div>
        </div>

        {/* Candidate Selection or Write-in Input */}
        <div className="mb-4 w-full max-w-sm">
          {voteMethod === 'select' ? (
            <div>
              <label htmlFor="candidate" className="block text-gray-700 mb-2">
                Select a candidate:
              </label>
              <select
                id="candidate"
                value={selectedCandidate}
                onChange={handleCandidateSelect}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Choose a candidate</option>
                {PREDEFINED_CANDIDATES.map(candidate => (
                  <option key={candidate.id} value={candidate.name}>
                    {candidate.name}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div>
              <label htmlFor="writeIn" className="block text-gray-700 mb-2">
                Write in a candidate name:
              </label>
              <input
                type="text"
                id="writeIn"
                value={writeInName}
                onChange={handleWriteInChange}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Candidate Name"
              />
            </div>
          )}
        </div>

        {/* IDKit Verification Widget */}
        <IDKitWidget
          action={action}
          app_id={app_id}
          onSuccess={onSuccess}
          verification_level={VerificationLevel.Device}
        />

        {/* Verification Button */}
        <button
          className="mt-4 border border-black rounded-md px-4 py-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={() => setOpen(true)}
          disabled={!isVoteValid || loading}
          title={!isVoteValid ? "Please select or enter a candidate name" : "Verify with World ID"}
        >
          <div className="mx-3 my-1">
            {loading ? "Saving..." : "Verify with World ID"}
          </div>
        </button>

        {/* Success Message */}
        {successMessage && (
          <p className="mt-4 text-green-600">{successMessage}</p>
        )}

        {/* Error Message */}
        {error && (
          <p className="mt-4 text-red-600">{error}</p>
        )}
      </div>
    </div>
  );
}