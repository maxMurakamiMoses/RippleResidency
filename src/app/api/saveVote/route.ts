// app/api/saveVote/route.ts

import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { candidateName, nullifierHash } = await request.json();

    // Input validation
    if (!candidateName || !nullifierHash) {
      return NextResponse.json(
        { success: false, detail: 'Missing candidateName or nullifierHash' },
        { status: 400 }
      );
    }

    // Create a new Vote record
    const vote = await prisma.vote.create({
      data: {
        candidateName,
        nullifierHash,
      },
    });

    return NextResponse.json({ success: true, vote }, { status: 201 });
  } catch (error: any) {
    // Handle unique constraint violation for nullifierHash
    if (error.code === 'P2002' && error.meta?.target?.includes('nullifierHash')) {
      return NextResponse.json(
        { success: false, detail: 'This vote has already been recorded.' },
        { status: 409 }
      );
    }

    console.error('Error saving vote:', error);
    return NextResponse.json(
      { success: false, detail: 'Internal Server Error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
