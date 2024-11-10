// app/api/updateParty/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function PUT(request: NextRequest) {
  try {
    const {
      id,
      description,
      title,
      emoji,
      ctaText,
      ctaLink,
      content,
    } = await request.json();

    if (!id) {
      return NextResponse.json(
        { success: false, detail: 'Party ID is required' },
        { status: 400 }
      );
    }

    const updatedParty = await prisma.party.update({
      where: { id: Number(id) },
      data: {
        description,
        title,
        emoji,
        ctaText,
        ctaLink,
        content,
      },
    });

    return NextResponse.json(
      { success: true, data: updatedParty },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating party:', error);
    return NextResponse.json(
      { success: false, detail: 'Internal Server Error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
