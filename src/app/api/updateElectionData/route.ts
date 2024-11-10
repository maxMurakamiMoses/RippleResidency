import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { type, id, updateData } = data;

    let updatedRecord;

    if (type === 'party') {
      updatedRecord = await prisma.party.update({
        where: { id },
        data: updateData,
      });
    } else if (type === 'politician') {
      updatedRecord = await prisma.politician.update({
        where: { id },
        data: updateData,
      });
    } else if (type === 'candidate') {
      updatedRecord = await prisma.candidate.update({
        where: { id },
        data: updateData,
      });
    } else if (type === 'electionInfo') {
      updatedRecord = await prisma.electionInfo.update({
        where: { id },
        data: updateData,
      });
    } else {
      return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
    }

    return NextResponse.json({ success: true, data: updatedRecord }, { status: 200 });
  } catch (error: any) {
    console.error('Error updating data:', error);

    return NextResponse.json(
      { error: 'Failed to update data.' },
      { status: 500 }
    );
  }
}
