// File: TextReveal.tsx

"use client";

import React, { useEffect, useState } from "react";
import { TextGenerateEffect } from "../ui/text-generate-effect";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface ElectionInfo {
  title: string;
  description: string;
}

interface ApiResponse {
  success: boolean;
  data?: {
    electionInfo: ElectionInfo;
    parties: any[]; 
    politicians: any[];
    candidates: any[];
  };
  detail?: string;
}

interface TextRevealProps {

}

export function TextReveal({}: TextRevealProps) {
  const [electionInfo, setElectionInfo] = useState<ElectionInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchElectionData = async () => {
      try {
        const response = await fetch("/api/fetchElectionData");
        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
        const data: ApiResponse = await response.json();
        if (data.success && data.data?.electionInfo) {
          setElectionInfo(data.data.electionInfo);
        } else {
          throw new Error(data.detail || "Failed to fetch election data.");
        }
      } catch (err) {
        console.error("Failed to fetch election data:", err);
        setError("Unable to load election information. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchElectionData();
  }, []);

  if (loading) {
    return (
      <Card className="bg-gray-800/50 border-gray-700 mb-20">
        <CardHeader>
          <CardTitle className="text-4xl font-bold text-gray-100">
            About this election
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg text-2xl text-gray-100">Loading...</div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="bg-gray-800/50 border-gray-700 mb-20">
        <CardHeader>
          <CardTitle className="text-4xl font-bold text-gray-100">
            About this election
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg text-2xl text-red-500">{error}</div>
        </CardContent>
      </Card>
    );
  }

  if (!electionInfo) {
    return null; // Or some fallback UI
  }

  return (
    <Card className="bg-gray-800/50 border-gray-700 mb-20">
      <CardHeader>
        <CardTitle className="text-4xl font-bold text-gray-100">
          About this election
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-lg text-2xl text-gray-100">
          {electionInfo.title}
          <TextGenerateEffect
            words={electionInfo.description}
            className="text-gray-500 leading-relaxed"
          />
        </div>
      </CardContent>
    </Card>
  );
}
