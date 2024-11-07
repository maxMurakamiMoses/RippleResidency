// File 1: MultiStep.jsx or MultiStep.tsx

"use client";
import React from "react";
import { MultiStepLoader as Loader } from "./ui/multi-step-loader";

const loadingStates = [
  { text: "Validating your address..." },
  { text: "Looks like it was good to go!" },
  { text: "Sending you 5 XRP..." },
  { text: "We sent you 5 XRP, kaching!" },
  { text: "Minting your NFT..." },
  { text: "Sent you a NFT!" },
  { text: "Cleaning up loose ends..." },
  { text: "Awesome, we're done!" },
];

interface MultiStepProps {
  loading: boolean;
}

export function MultiStep({ loading }: MultiStepProps) {
  if (!loading) return null; 

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      {/* Core Loader Modal */}
      <Loader loadingStates={loadingStates} loading={loading} duration={2900} />
    </div>
  );
}
