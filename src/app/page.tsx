// File 2: app.tsx

"use client";

import React, { useState } from "react";
import { useRouter } from 'next/navigation';
import { VerificationLevel, IDKitWidget, useIDKit } from "@worldcoin/idkit";
import type { ISuccessResult } from "@worldcoin/idkit";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { UserCheck, UserPlus, AlertCircle, CheckCircle2, Loader2, Users } from "lucide-react";
import { verify } from "./actions/verify";
import { MultiStep } from "@/components/MultiStep"; // Adjust the path accordingly
import { Globe } from "@/components/Globe";

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
    // Optionally, you can trigger the loader here if you want it to appear immediately upon input
    // For example:
    // if (e.target.value) {
    //   setLoading(true);
    //   // Trigger any processing if needed
    // }
  };

  const handleCandidateSelect = (presidentName: string) => {
    setSelectedCandidate(presidentName);
    setWriteInName('');
    setVoteMethod('select');
  };

  const onSuccess = (result: ISuccessResult) => {
    // Handle success if needed
  };

  const handleProof = async (result: ISuccessResult) => {
    // Verify the World ID proof
    const data = await verify(result);
    if (data.success) {
      console.log("Successful response from backend:\n", JSON.stringify(data));
    } else {
      setError(`Verification failed: ${data.detail}`);
      return; // Exit if verification fails
    }
  
    try {
      // Start loading state and clear any previous errors
      setLoading(true);
      setError(null);
  
      // Get the selected candidate name based on vote method
      const candidateName = voteMethod === 'select' ? selectedCandidate : writeInName;
  
      // Save the vote to your database
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
        // If vote was saved successfully, process rewards if wallet address provided
        
        // 1. Send XRP
        if (walletAddress) {
          try {
            await handleSendXrp();
          } catch (err) {
            console.error('Error sending XRP:', err);
            // Continue even if XRP send fails
          }
        }
  
        // 2. Send NFT and get the response data
        let nftData = null;
        if (walletAddress) {
          try {
            nftData = await handleSendNFT();
          } catch (err) {
            console.error('Error sending NFT:', err);
          }
        }
        
  
        // 3. Build the success URL with parameters
        const successParams = new URLSearchParams();
        
        if (walletAddress) {
          // Add wallet address to URL params
          successParams.append('walletAddress', walletAddress);
        
          // Add sell offer index if NFT was successfully created
          if (nftData?.sellOfferIndex) {
            successParams.append('sellOfferIndex', nftData.sellOfferIndex);
          }
        }
        
        console.log('This is your nftData: ', nftData);
        
  
        // 4. Redirect to success page with parameters
        router.push(`/success?${successParams.toString()}`);
        
      } else {
        // If vote saving failed, show error
        setError(saveVoteData.detail || "Failed to save your vote.");
      }
  
    } catch (err) {
      // Handle any unexpected errors
      console.error("Error during voting:", err);
      setError("An unexpected error occurred.");
      
    } finally {
      // Always turn off loading state
      setLoading(false);
    }
  };

  const isVoteValid = voteMethod === 'select' ? selectedCandidate !== '' : writeInName.trim() !== '';

  const handleSendXrp = async () => {
    if (walletAddress) {
      try {
        console.log('Sending 5 XRP to:', walletAddress);
        const xrpResponse = await fetch('/api/sendXrp', {
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

  const handleSendNFT = async () => {
    if (walletAddress) {
      try {
        console.log('Sending NFT to:', walletAddress);
        const nftResponse = await fetch('/api/sendNFT', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            walletAddress,
            tokenUrl: 'https://example.com/nft-metadata' // Replace with your actual metadata URL
          }),
        });
  
        // Parse the response to get nftData
        const nftData = await nftResponse.json();
  
        console.log('NFT Transfer Response:', nftData);
  
        if (nftData.success) {
          console.log('NFT successfully minted and transferred!');
        } else {
          console.error('NFT minting failed:', nftData.detail);
          setError(`NFT minting failed: ${nftData.detail}`);
        }
  
        return nftData; // Return the parsed data
      } catch (error: any) {
        console.error('Error minting NFT:', error);
        setError(`Error minting NFT: ${error.message}`);
        throw error; // Re-throw the error to be caught in handleProof
      }
    } else {
      console.log('No wallet address provided, NFT not sent.');
      return null;
    }
  };
  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      {/* Integrate MultiStep Loader */}
      <MultiStep loading={loading} />

      <div className="max-w-3xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-100 mb-2">
            Secure Voting Platform
          </h1>
          <p className="text-lg text-gray-400">
            Select your preferred candidates
          </p>
        </div>
        <Globe />

        {/* Candidate Cards Grid */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Users className="h-6 w-6 text-blue-400" />
            <h2 className="text-xl font-semibold text-gray-100">
              Presidential Tickets
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {PREDEFINED_CANDIDATES.map((ticket) => (
              <Card
                key={ticket.id}
                className={`cursor-pointer transition-all hover:shadow-2xl ${
                  selectedCandidate === ticket.president
                    ? 'ring-2 ring-blue-500 shadow-2xl' 
                    : 'hover:border-blue-700'
                } bg-gray-800 border border-gray-700`}
                onClick={() => handleCandidateSelect(ticket.president)}
              >
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center justify-between">
                    <span className="text-gray-100">{ticket.president}</span>
                    {selectedCandidate === ticket.president && (
                      <CheckCircle2 className="text-blue-400 h-5 w-5" />
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-400">Vice President:</span>
                    <span className="text-sm font-medium text-gray-200">{ticket.vicePresident}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Write-in Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-100">
              Write-in Candidate
            </h2>
            <UserPlus className="h-5 w-5 text-gray-400" />
          </div>
          <div className="flex gap-4">
            <input
              type="text"
              value={writeInName}
              onChange={handleWriteInChange}
              className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter presidential candidate name..."
            />
          </div>
        </div>

        {/* Wallet Address Input */}
        <div className="mb-8">
          <label htmlFor="walletAddress" className="block text-sm font-medium text-gray-300">
            Wallet Address (optional)
          </label>
          <input
            type="text"
            id="walletAddress"
            value={walletAddress}
            onChange={handleWalletAddressChange}
            className="mt-1 block w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                : 'bg-gray-600 cursor-not-allowed'
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
            <div className="flex items-center gap-2 text-red-400 bg-red-900 p-4 rounded-lg">
              <AlertCircle className="h-5 w-5" />
              <p>{error}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}