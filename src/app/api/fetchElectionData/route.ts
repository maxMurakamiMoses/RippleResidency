// app/api/electionData/route.ts

import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    // Fetch all required data concurrently
    const [parties, politicians, candidates, electionInfo] = await Promise.all([
      prisma.party.findMany({
        include: {
          politicians: true, // Include associated politicians
        },
      }),
      prisma.politician.findMany({
        include: {
          party: true, // Include associated party
        },
      }),
      prisma.candidate.findMany({
        include: {
          president: {
            include: { party: true }, // Include president's party
          },
          vicePresident: {
            include: { party: true }, // Include vice president's party
          },
        },
      }),
      prisma.electionInfo.findMany(),
    ]);

    // Structure the response data
    const data = {
      parties,
      politicians,
      candidates,
      electionInfo,
    };

    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching election data:', error);

    return NextResponse.json(
      { error: 'Failed to fetch election data.' },
      { status: 500 }
    );
  }
}
