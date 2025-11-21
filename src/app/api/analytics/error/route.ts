import { NextRequest, NextResponse } from 'next/server';

// Analytics error endpoint
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { error, context, timestamp, userAgent, url } = body;

    // Log error (in production, save to database or send to monitoring service)
    console.error('Client error:', {
      error,
      context,
      timestamp,
      userAgent,
      url,
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
