// app/api/election/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const [electionInfo, parties, politicians, candidates] = await Promise.all([
      prisma.electionInfo.findFirst(),
      prisma.party.findMany(),
      prisma.politician.findMany(),
      prisma.candidate.findMany(),
    ]);

    return NextResponse.json({
      success: true,
      data: { electionInfo, parties, politicians, candidates }
    }, { status: 200 });
  } catch (error) {
    console.error('Error fetching election data:', error);
    return NextResponse.json(
      { success: false, detail: 'Internal Server Error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}