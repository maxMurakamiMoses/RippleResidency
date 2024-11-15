// app.tsx

"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { VerificationLevel, IDKitWidget, useIDKit } from "@worldcoin/idkit";
import type { ISuccessResult } from "@worldcoin/idkit";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { UserCheck, UserPlus, AlertCircle, CheckCircle2, Loader2, Users } from "lucide-react";
import { verify } from "../actions/verify";
import { MultiStep } from "@/components/MultiStep";
import { MultiStepTwo } from "@/components/MultiStepTwo";
import { SubmitButton } from "@/components/SubmitButton";
import IntroSection from "@/components/hero/IntroSection";
import { Separator } from "@/components/ui/separator";

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
  const router = useRouter();

  const [voteMethod, setVoteMethod] = useState<'select' | 'writeIn'>('select');
  const [selectedCandidate, setSelectedCandidate] = useState<string>('');
  const [writeInName, setWriteInName] = useState('');
  const [walletAddress, setWalletAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingCandidates, setLoadingCandidates] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [candidates, setCandidates] = useState<CandidateTicket[]>([]);

  interface Politician {
    id: number;
    name: string;
    age: number;
    partyId: number;
  }

  interface Party {
    id: number;
    name: string;
  }

  interface Candidate {
    id: number;
    presidentId: number;
    vicePresidentId: number;
    partyId: number;
  }

  interface CandidateTicket {
    id: number;
    president: Politician;
    vicePresident: Politician;
    party: Party;
  }

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        setLoadingCandidates(true);
        const response = await fetch('/api/fetchElectionData');
        const data = await response.json();
        if (data.success) {
          const { parties, politicians, candidates } = data.data;
          const candidateTickets: CandidateTicket[] = candidates.map((candidate: Candidate) => {
            const president = politicians.find((p: Politician) => p.id === candidate.presidentId);
            const vicePresident = politicians.find((p: Politician) => p.id === candidate.vicePresidentId);
            const party = parties.find((p: Party) => p.id === candidate.partyId);
            return {
              id: candidate.id,
              president,
              vicePresident,
              party,
            };
          });

          setCandidates(candidateTickets);
        } else {
          setFetchError('Failed to fetch candidates');
        }
      } catch (error) {
        console.error('Error fetching candidates:', error);
        setFetchError('Error fetching candidates');
      } finally {
        setLoadingCandidates(false);
      }
    };
    fetchCandidates();
  }, []);

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
    // Handle success if needed
  };

  const handleProof = async (result: ISuccessResult) => {
    const data = await verify(result);
    if (data.success) {
      console.log("Successful response from backend:\n", JSON.stringify(data));
    } else {
      setError(`Verification failed: ${data.detail}`);
      return; 
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

      const responseLedger = await fetch("/api/saveVoteToLedger", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          candidateName,
        }),
      });

      const saveVoteData = await response.json();

      if (responseLedger.ok && response.ok && saveVoteData.success) {
        if (walletAddress) {
          try {
            await handleSendXrp();
          } catch (err) {
            console.error('Error sending XRP:', err);
          }
        }

        let nftData = null;
        if (walletAddress) {
          try {
            nftData = await handleSendNFT();
          } catch (err) {
            console.error('Error sending NFT:', err);
          }
        }

        const successParams = new URLSearchParams();

        if (walletAddress) {
          successParams.append('walletAddress', walletAddress);

          if (nftData?.sellOfferIndex) {
            successParams.append('sellOfferIndex', nftData.sellOfferIndex);
          }
        }

        console.log('This is your nftData: ', nftData);
        router.push(`/success?${successParams.toString()}`);

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
            tokenUrl: 'https://example.com/nft-metadata'
          }),
        });

        const nftData = await nftResponse.json();

        console.log('NFT Transfer Response:', nftData);

        if (nftData.success) {
          console.log('NFT successfully minted and transferred!');
        } else {
          console.error('NFT minting failed:', nftData.detail);
          setError(`NFT minting failed: ${nftData.detail}`);
        }

        return nftData; 
      } catch (error: any) {
        console.error('Error minting NFT:', error);
        setError(`Error minting NFT: ${error.message}`);
        throw error; 
      }
    } else {
      console.log('No wallet address provided, NFT not sent.');
      return null;
    }
  };

  return (
    <>
      <IntroSection />
      <div className='py-20 px-10 bg-gray-900'>
        <Separator />
      </div>
      <div className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        {walletAddress ? (
          <MultiStep loading={loading} />
        ) : (
          <MultiStepTwo loading={loading} />
        )}

        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Users className="h-6 w-6 text-blue-400" />
              <h2 className="text-xl font-semibold text-gray-100">
                Vote!
              </h2>
            </div>
            {loadingCandidates ? (
              <div className="text-gray-100">Loading candidates...</div>
            ) : fetchError ? (
              <div className="text-red-400">Error: {fetchError}</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {candidates.map((ticket: CandidateTicket) => (
                  <Card
                    key={ticket.id}
                    className={`cursor-pointer transition-all hover:shadow-2xl ${
                      selectedCandidate === ticket.president.name
                        ? 'ring-2 ring-blue-500 shadow-2xl' 
                        : 'hover:border-blue-700'
                    } bg-gray-800 border border-gray-700`}
                    onClick={() => handleCandidateSelect(ticket.president.name)}
                  >
                    <CardHeader className="pb-2">
                      <CardTitle className="flex items-center justify-between">
                        <span className="text-gray-100">{ticket.president.name}</span>
                        {selectedCandidate === ticket.president.name && (
                          <CheckCircle2 className="text-blue-400 h-5 w-5" />
                        )}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-400">Vice President:</span>
                        <span className="text-sm font-medium text-gray-200">{ticket.vicePresident.name}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
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
          <div className="space-y-4">
            <IDKitWidget
              action={action}
              app_id={app_id}
              onSuccess={onSuccess}
              handleVerify={handleProof}
              verification_level={VerificationLevel.Device}
            />

            <SubmitButton
              onClick={() => setOpen(true)}
              disabled={!isVoteValid || loading}
              loading={loading}
            />
            {error && (
              <div className="flex items-center gap-2 text-red-400 bg-red-900 p-4 rounded-lg">
                <AlertCircle className="h-5 w-5" />
                <p>{error}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
