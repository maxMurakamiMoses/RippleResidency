// File: TextReveal.tsx

"use client";

import React from "react";
import { TextGenerateEffect } from "../ui/text-generate-effect";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { electionInfo } from "@/data/data";

interface TextRevealProps {
  title?: string;
  description?: string;
}

export function TextReveal({
  title = electionInfo.title,
  description = electionInfo.description,
}: TextRevealProps) {
  return (
    <Card className="bg-gray-800/50 border-gray-700 mb-20">
      <CardHeader>
        <CardTitle className="text-4xl font-bold text-gray-100">
          About this election
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="rounded-lg text-2xl text-gray-100">
          {title}
          <TextGenerateEffect 
            words={description}
            className="text-gray-500 leading-relaxed"
          />
        </div>
      </CardContent>
    </Card>
  );
}
