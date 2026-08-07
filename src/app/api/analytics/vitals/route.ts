import { NextRequest, NextResponse } from 'next/server';
import { apiLimiter, isValidOrigin, withRateLimit } from '@/lib/rate-limiter';
import { analyticsVitalsSchema, readValidatedBody } from '@/lib/api-validation';

// Web Vitals endpoint
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

    const { data, error } = await readValidatedBody(request, analyticsVitalsSchema);
    if (error === 'too_large') {
      return NextResponse.json({ error: 'Payload too large' }, { status: 413 });
    }
    if (!data) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    const { name, value, rating, delta, id, timestamp } = data;

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
