import { NextRequest, NextResponse } from 'next/server';

// Performance metrics endpoint
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, duration, startTime, timestamp } = body;

    // Log performance metrics
    console.log('Performance metric:', {
      type,
      duration,
      startTime,
      timestamp,
    });

    // TODO: Save to database or send to analytics service

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Performance logging failed:', error);
    return NextResponse.json(
      { error: 'Failed to log performance' },
      { status: 500 }
    );
  }
}
