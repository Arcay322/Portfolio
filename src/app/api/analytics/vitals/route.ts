import { NextRequest, NextResponse } from 'next/server';

// Web Vitals endpoint
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, value, rating, delta, id, timestamp } = body;

    // Log metrics (in production, save to database or send to analytics service)
    console.log('Web Vital:', {
      name,
      value,
      rating,
      delta,
      id,
      timestamp,
    });

    // TODO: Save to database or send to analytics service
    // await db.metrics.create({
    //   data: {
    //     name,
    //     value,
    //     rating,
    //     delta,
    //     metricId: id,
    //     timestamp: new Date(timestamp),
    //   },
    // });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Metrics logging failed:', error);
    return NextResponse.json(
      { error: 'Failed to log metrics' },
      { status: 500 }
    );
  }
}
