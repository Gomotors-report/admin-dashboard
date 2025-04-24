import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { evaluations } from '@/lib/schema';
import { sql } from 'drizzle-orm';

export async function GET() {
  try {
    // Get all rating distributions
    const impressionData = await db.select({
      rating: evaluations.impressionRating,
      count: sql<number>`count(*)::int`,
    })
    .from(evaluations)
    .groupBy(evaluations.impressionRating)
    .orderBy(evaluations.impressionRating);

    const punctualityData = await db.select({
      rating: evaluations.punctualityRating,
      count: sql<number>`count(*)::int`,
    })
    .from(evaluations)
    .groupBy(evaluations.punctualityRating)
    .orderBy(evaluations.punctualityRating);

    const staffData = await db.select({
      rating: evaluations.staffRating,
      count: sql<number>`count(*)::int`,
    })
    .from(evaluations)
    .groupBy(evaluations.staffRating)
    .orderBy(evaluations.staffRating);

    const qualityData = await db.select({
      rating: evaluations.qualityRating,
      count: sql<number>`count(*)::int`,
    })
    .from(evaluations)
    .groupBy(evaluations.qualityRating)
    .orderBy(evaluations.qualityRating);

    const valueData = await db.select({
      rating: evaluations.valueRating,
      count: sql<number>`count(*)::int`,
    })
    .from(evaluations)
    .groupBy(evaluations.valueRating)
    .orderBy(evaluations.valueRating);

    const npsData = await db.select({
      rating: evaluations.npsRating,
      count: sql<number>`count(*)::int`,
    })
    .from(evaluations)
    .groupBy(evaluations.npsRating)
    .orderBy(evaluations.npsRating);

    // Get visit reasons distribution
    const visitReasonData = await db.select({
      reason: evaluations.visitReason,
      count: sql<number>`count(*)::int`,
    })
    .from(evaluations)
    .groupBy(evaluations.visitReason);

    // Get inspection offered distribution
    const inspectionData = await db.select({
      offered: evaluations.offeredInspection,
      count: sql<number>`count(*)::int`,
    })
    .from(evaluations)
    .groupBy(evaluations.offeredInspection);

    // Get post service contact distribution
    const postServiceData = await db.select({
      contact: evaluations.postServiceContact,
      count: sql<number>`count(*)::int`,
    })
    .from(evaluations)
    .groupBy(evaluations.postServiceContact);

    return NextResponse.json({
      impressionData,
      punctualityData,
      staffData,
      qualityData,
      valueData,
      npsData,
      visitReasonData,
      inspectionData,
      postServiceData,
    });
  } catch (error) {
    console.error('Error fetching analytics data:', error);
    return NextResponse.json(
      { error: 'Error al obtener los datos de analytics' },
      { status: 500 }
    );
  }
} 