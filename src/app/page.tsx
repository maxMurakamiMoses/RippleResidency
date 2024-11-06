// app.tsx

"use client";

import { useState } from "react";
import { VerificationLevel, IDKitWidget, useIDKit } from "@worldcoin/idkit";
import type { ISuccessResult } from "@worldcoin/idkit";
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { UserCheck, UserPlus, AlertCircle, CheckCircle2, Loader2, Users } from "lucide-react";
import { verify } from "./actions/verify";

const PREDEFINED_CANDIDATES = [
  { 
    id: 1, 
    president: "John Smith",
    vicePresident: "Sarah Parker"
  },
  { 
    id: 2, 
    president: "Jane Doe",
    vicePresident: "Michael Chen"
  },
  { 
    id: 3, 
    president: "Alice Johnson",
    vicePresident: "David Rodriguez"
  },
  { 
    id: 4, 
    president: "Bob Wilson",
    vicePresident: "Maria Garcia"
  },
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
  const router = useRouter(); // Initialize router

  // State management
  const [voteMethod, setVoteMethod] = useState<'select' | 'writeIn'>('select');
  const [selectedCandidate, setSelectedCandidate] = useState<string>('');
  const [writeInName, setWriteInName] = useState('');
  const [walletAddress, setWalletAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleWriteInChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setWriteInName(e.target.value);
    setSelectedCandidate('');
    setVoteMethod('writeIn');
  };

  const handleWalletAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setWalletAddress(e.target.value);
  };

  const handleCandidateSelect = (presidentName: string) => {
    setSelectedCandidate(presidentName);
    setWriteInName('');
    setVoteMethod('select');
  };

  const onSuccess = (result: ISuccessResult) => {
    //nothing for now
  };

  const handleProof = async (result: ISuccessResult) => {
    const data = await verify(result);
    if (data.success) {
      console.log("Successful response from backend:\n", JSON.stringify(data));
    } else {
      setError(`Verification failed: ${data.detail}`);
    }

    try {
      setLoading(true);
      setError(null);

      const candidateName = voteMethod === 'select' ? selectedCandidate : writeInName;

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

      const saveVoteData = await response.json();

      if (response.ok && saveVoteData.success) {
        await handleSendXrp(); // Updated function
        router.push('/success');
      } else {
        setError(saveVoteData.detail || "Failed to save your vote.");
      }
    } catch (err) {
      console.error("Error during voting:", err);
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const isVoteValid = voteMethod === 'select' ? selectedCandidate !== '' : writeInName.trim() !== '';

  const handleSendXrp = async () => { // Updated function name
    if (walletAddress) {
      try {
        console.log('Sending 5 XRP to:', walletAddress);
        const xrpResponse = await fetch('/api/sendXrp', { // Updated endpoint
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ walletAddress }),
        });

        const xrpData = await xrpResponse.json();
        console.log('XRP Transfer Response:', xrpData);

        if (xrpData.success) {
          console.log('5 XRP successfully sent!');
        } else {
          console.error('XRP transfer failed:', xrpData.detail);
          setError(`XRP transfer failed: ${xrpData.detail}`);
        }
      } catch (error: any) {
        console.error('Error sending XRP:', error);
        setError(`Error sending XRP: ${error.message}`);
      }
    } else {
      console.log('No wallet address provided, XRP not sent.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Secure Voting Platform
          </h1>
          <p className="text-lg text-gray-600">
            Select your preferred candidates
          </p>
        </div>

        {/* Candidate Cards Grid */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Users className="h-6 w-6 text-blue-500" />
            <h2 className="text-xl font-semibold text-gray-800">
              Presidential Tickets
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {PREDEFINED_CANDIDATES.map((ticket) => (
              <Card 
                key={ticket.id}
                className={`cursor-pointer transition-all hover:shadow-lg ${
                  selectedCandidate === ticket.president 
                    ? 'ring-2 ring-blue-500 shadow-lg' 
                    : 'hover:border-blue-200'
                }`}
                onClick={() => handleCandidateSelect(ticket.president)}
              >
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center justify-between">
                    <span>{ticket.president}</span>
                    {selectedCandidate === ticket.president && (
                      <CheckCircle2 className="text-blue-500 h-5 w-5" />
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">Vice President:</span>
                    <span className="text-sm font-medium">{ticket.vicePresident}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Write-in Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800">
              Write-in Candidate
            </h2>
            <UserPlus className="h-5 w-5 text-gray-500" />
          </div>
          <div className="flex gap-4">
            <input
              type="text"
              value={writeInName}
              onChange={handleWriteInChange}
              className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter presidential candidate name..."
            />
          </div>
        </div>

        <div className="mb-8">
          <label htmlFor="walletAddress" className="block text-sm font-medium text-gray-700">
            Wallet Address (optional)
          </label>
          <input
            type="text"
            id="walletAddress"
            value={walletAddress}
            onChange={handleWalletAddressChange}
            className="mt-1 block w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter XRP wallet address..."
          />
        </div>

        {/* Verification Section */}
        <div className="space-y-4">
          <IDKitWidget
            action={action}
            app_id={app_id}
            onSuccess={onSuccess}
            handleVerify={handleProof}
            verification_level={VerificationLevel.Device}
          />

          <button
            className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg text-white font-medium transition-colors ${
              isVoteValid && !loading
                ? 'bg-blue-500 hover:bg-blue-600'
                : 'bg-gray-300 cursor-not-allowed'
            }`}
            onClick={() => setOpen(true)}
            disabled={!isVoteValid || loading}
          >
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <UserCheck className="h-5 w-5" />
            )}
            {loading ? "Processing..." : "Verify with World ID"}
          </button>

          {/* Error Message */}
          {error && (
            <div className="flex items-center gap-2 text-red-600 bg-red-50 p-4 rounded-lg">
              <AlertCircle className="h-5 w-5" />
              <p>{error}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
