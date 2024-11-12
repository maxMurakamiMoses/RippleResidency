// app/api/updateCandidate/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
export async function PUT(request: NextRequest) {
    try {
      const {
        id,
        presidentName,
        presidentAge,
        presidentSex,
        vicePresidentName,
        vicePresidentAge,
        vicePresidentSex,
      } = await request.json();
  
      if (
        !id ||
        !presidentName ||
        !presidentAge ||
        !presidentSex ||
        !vicePresidentName ||
        !vicePresidentAge ||
        !vicePresidentSex
      ) {
        return NextResponse.json(
          { success: false, detail: 'All fields are required' },
          { status: 400 }
        );
      }
  
      const candidate = await prisma.candidate.findUnique({
        where: { id: Number(id) },
      });
  
      if (!candidate) {
        return NextResponse.json(
          { success: false, detail: 'Candidate not found' },
          { status: 404 }
        );
      }
  
      const updatedPresident = await prisma.politician.update({
        where: { id: candidate.presidentId },
        data: {
          name: presidentName,
          age: Number(presidentAge),
          sex: presidentSex,
        },
      });
  
      const updatedVicePresident = await prisma.politician.update({
        where: { id: candidate.vicePresidentId },
        data: {
          name: vicePresidentName,
          age: Number(vicePresidentAge),
          sex: vicePresidentSex,
        },
      });
  
      return NextResponse.json(
        {
          success: true,
          data: {
            candidate,
            president: updatedPresident,
            vicePresident: updatedVicePresident,
          },
        },
        { status: 200 }
      );
    } catch (error) {
      console.error('Error updating candidate:', error);
      return NextResponse.json(
        { success: false, detail: 'Internal Server Error' },
        { status: 500 }
      );
    } finally {
      await prisma.$disconnect();
    }
  }
  