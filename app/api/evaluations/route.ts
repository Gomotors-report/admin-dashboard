import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { evaluations } from '@/lib/schema';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    const evaluation = await db.insert(evaluations).values({
      impressionRating: parseInt(body.impressionRating),
      punctualityRating: parseInt(body.punctualityRating),
      staffRating: parseInt(body.staffRating),
      qualityRating: parseInt(body.qualityRating),
      valueRating: parseInt(body.valueRating),
      npsRating: parseInt(body.npsRating),
      offeredInspection: body.offeredInspection === 'yes',
      postServiceContact: body.postServiceContact,
      visitReason: body.visitReason,
      otherReason: body.otherReason || null,
    }).returning();

    return NextResponse.json({ success: true, data: evaluation[0] });
  } catch (error) {
    console.error('Error saving evaluation:', error);
    return NextResponse.json(
      { success: false, error: 'Error al guardar la evaluación' },
      { status: 500 }
    );
  }
} 