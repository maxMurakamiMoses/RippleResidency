// app/success/page.tsx

import { PrismaClient } from '@prisma/client';
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { CheckCircle2, Users } from "lucide-react";

const prisma = new PrismaClient();

async function getVoteCounts() {
  const votes = await prisma.vote.groupBy({
    by: ['candidateName'],
    _count: {
      candidateName: true,
    },
    orderBy: {
      _count: {
        candidateName: 'desc',
      },
    },
  });

  return votes;
}

export default async function SuccessPage() {
  const voteCounts = await getVoteCounts();

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <CheckCircle2 className="mx-auto h-12 w-12 text-green-500" />
          <h1 className="text-3xl font-bold text-gray-900 mt-4">
            Thank You for Voting!
          </h1>
          <p className="text-lg text-gray-600">
            Here are the current vote counts for each candidate.
          </p>
        </div>

        {/* Vote Counts Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {voteCounts.map((vote) => (
            <Card key={vote.candidateName} className="shadow-md">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-gray-800">
                  {vote.candidateName}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <Users className="h-5 w-5 text-blue-500 mr-2" />
                  <span className="text-gray-700">Votes: {vote._count.candidateName}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
