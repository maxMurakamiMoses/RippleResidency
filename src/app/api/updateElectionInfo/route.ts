// app/api/updateElectionInfo/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function PUT(request: NextRequest) {
  try {
    const { id, title, description } = await request.json();

    // Validate input
    if (!id || !title || !description) {
      return NextResponse.json(
        { success: false, detail: 'All fields are required.' },
        { status: 400 }
      );
    }

    // Check if ElectionInfo exists
    const electionInfo = await prisma.electionInfo.findUnique({
      where: { id: Number(id) },
    });

    if (!electionInfo) {
      return NextResponse.json(
        { success: false, detail: 'ElectionInfo not found.' },
        { status: 404 }
      );
    }

    // Update ElectionInfo
    const updatedElectionInfo = await prisma.electionInfo.update({
      where: { id: Number(id) },
      data: { title, description },
    });

    return NextResponse.json(
      { success: true, data: updatedElectionInfo },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating ElectionInfo:', error);
    return NextResponse.json(
      { success: false, detail: 'Internal Server Error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
