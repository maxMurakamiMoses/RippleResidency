// app/api/updateElectionInfo/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
export async function PUT(request: NextRequest) {
  try {
    const { id, title, description, emoji, ctaText, ctaLink, content } = await request.json();

    if (!id || !title || !description || !emoji || !ctaText || !ctaLink || !content) {
      return NextResponse.json(
        { success: false, detail: 'This endpoint is still underdevelopment.' },
        { status: 400 }
      );
    }

    const party = await prisma.party.findUnique({
      where: { id: Number(id) },
    });

    if (!party) {
      return NextResponse.json(
        { success: false, detail: 'Party not found.' },
        { status: 404 }
      );
    }

    const updatedParty = await prisma.party.update({
      where: { id: Number(id) },
      data: { title, description, emoji, ctaText, ctaLink, content },
    });

    return NextResponse.json(
      { success: true, data: { party: updatedParty } },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating Party:', error);
    return NextResponse.json(
      { success: false, detail: 'Internal Server Error' },
      { status: 500 }
    );
  }
}