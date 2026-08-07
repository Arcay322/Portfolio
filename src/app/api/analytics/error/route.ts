import { NextRequest, NextResponse } from 'next/server';
import { apiLimiter, isValidOrigin, withRateLimit } from '@/lib/rate-limiter';
import { analyticsErrorSchema, readValidatedBody } from '@/lib/api-validation';
import { sanitizeForLog } from '@/lib/sanitization';

// Analytics error endpoint
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

    const { data, error } = await readValidatedBody(request, analyticsErrorSchema);
    if (error === 'too_large') {
      return NextResponse.json({ error: 'Payload too large' }, { status: 413 });
    }
    if (!data) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    const { error: clientError, context, timestamp, userAgent, url } = data;

    // Log error (in production, save to database or send to monitoring service)
    console.error('Client error:', {
      error: sanitizeForLog(String(clientError ?? ''), 200),
      context: sanitizeForLog(String(context ?? ''), 200),
      timestamp,
      userAgent: sanitizeForLog(String(userAgent ?? ''), 100),
      url: sanitizeForLog(String(url ?? ''), 200),
    });

    // TODO: Save to database
    // await db.errors.create({
    //   data: {
    //     name: error.name,
    //     message: error.message,
    //     stack: error.stack,
    //     context: JSON.stringify(context),
    //     userAgent,
    //     url,
    //     timestamp: new Date(timestamp),
    //   },
    // });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error logging failed:', error);
    return NextResponse.json(
      { error: 'Failed to log error' },
      { status: 500 }
    );
  }
}
