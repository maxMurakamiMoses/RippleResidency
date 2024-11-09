// File 1: MultiStep.jsx or MultiStep.tsx

"use client";
import React from "react";
import { MultiStepLoader as Loader } from "./ui/multi-step-loader";

const loadingStates = [
    { text: "Loading..." },
    { text: "Please wait..." },
    { text: "Processing..." },
    { text: "Almost there..." },
    { text: "Finalizing..." },
    { text: "Completing..." },
    { text: "Wrapping up..." },
    { text: "All done!" },
  ];

interface MultiStepProps {
  loading: boolean;
}

export function MultiStepTwo({ loading }: MultiStepProps) {
  if (!loading) return null; 

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      {/* Core Loader Modal */}
      <Loader loadingStates={loadingStates} loading={loading} duration={2900} />
    </div>
  );
}
