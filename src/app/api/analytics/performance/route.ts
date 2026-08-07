import { NextRequest, NextResponse } from 'next/server';
import { apiLimiter, isValidOrigin, withRateLimit } from '@/lib/rate-limiter';
import { analyticsPerformanceSchema, readValidatedBody } from '@/lib/api-validation';

// Performance metrics endpoint
export async function POST(request: NextRequest) {
  try {
    if (!isValidOrigin(request.headers.get('origin'))) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const rateLimit = await withRateLimit(request, apiLimiter);
    if (!rateLimit.success) {
      return NextResponse.json(
        { error: rateLimit.error },
        { status: 429, headers: rateLimit.headers }
      );
    }

    const { data, error } = await readValidatedBody(request, analyticsPerformanceSchema);
    if (error === 'too_large') {
      return NextResponse.json({ error: 'Payload too large' }, { status: 413 });
    }
    if (!data) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    const { type, duration, startTime, timestamp } = data;

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
