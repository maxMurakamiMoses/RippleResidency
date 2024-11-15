"use client";

import React from "react";
import { Globe } from "@/components/hero/Globe";
import { TextReveal } from "./TextReveal";
import { PartySection } from "./PartySection";

const IntroSection = () => {
  return (
    <div className="min-h-screen bg-gray-900 py-12 dark px-20">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-100 mb-4">
          Secure Election Platform
        </h1>
        <p className="text-lg text-gray-400">
          Select your preferred candidates and make your voice heard in elections.
        </p>
      </div>

      <div className="flex flex-col gap-8">
        <div className="w-full">
          <TextReveal />
        </div>

        <div className="flex flex-col md:flex-row items-start gap-8 w-full">
          <div className="w-full md:w-1/2">
            <PartySection />
          </div>
          <div className="w-full md:w-1/2 flex justify-center items-center h-full">
            <Globe />
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(IntroSection);
