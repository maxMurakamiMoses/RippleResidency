"use client";

import React from "react";
import { Globe } from "@/components/hero/Globe";
import { TextReveal } from "./TextReveal";
import { PartySection } from "./PartySection";

const IntroSection = () => {
  return (
    <div className="min-h-screen bg-gray-900 py-12 dark">
      {/* Header Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-100 mb-4">
          Secure Election Platform
        </h1>
        <p className="text-lg text-gray-400">
          Select your preferred candidates and make your voice heard in elections.
        </p>
      </div>

      {/* Content Section: TextReveal and Globe */}
      <div className="flex flex-col md:flex-row items-start gap-8">
        {/* TextReveal Column (2/3 width on medium and above screens) */}
        <div className="w-full md:w-1/2 pl-20">
          <TextReveal />
          <PartySection />
        </div>

        {/* Globe Column (1/3 width on medium and above screens) */}
        <div className="w-full md:w-1/2 flex justify-center items-center h-full sticky top-1/2">
          <Globe />
        </div>
      </div>
    </div>
  );
};

export default React.memo(IntroSection);