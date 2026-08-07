import { NextRequest, NextResponse } from 'next/server';
import { createHmac, timingSafeEqual } from 'crypto';
import { z } from 'zod';
import { apiLimiter, isValidOrigin, withRateLimit } from '@/lib/rate-limiter';
import { sanitizeForLog } from '@/lib/sanitization';

// Newsletter subscription endpoint
// Replace with actual email service (Mailchimp, SendGrid, ConvertKit, etc.)

const subscribeSchema = z.object({
  email: z.string().email('Invalid email address'),
});

// In-memory storage for demo (replace with database)
const subscribers = new Set<string>();

const UNSUBSCRIBE_SECRET =
  process.env.NEWSLETTER_HMAC_SECRET || 'insecure-default-rotate-me';

function signEmail(email: string): string {
  return createHmac('sha256', UNSUBSCRIBE_SECRET).update(email).digest('hex');
}

function verifyEmail(email: string, token: string): boolean {
  const expected = signEmail(email);
  const a = Buffer.from(expected);
  const b = Buffer.from(token);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

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

    const text = await request.text();
    if (text.length > 1024) {
      return NextResponse.json({ error: 'Payload too large' }, { status: 413 });
    }

    const body = JSON.parse(text);
    const { email } = subscribeSchema.parse(body);

    // Check if already subscribed
    if (subscribers.has(email)) {
      return NextResponse.json(
        { error: 'Este email ya está suscrito' },
        { status: 400 }
      );
    }

    // TODO: Replace with actual email service integration
    // Example with SendGrid:
    // await sendgrid.send({
    //   to: email,
    //   from: 'newsletter@yoursite.com',
    //   subject: 'Confirma tu suscripción',
    //   html: '<p>Click here to confirm...</p>',
    // });

    // Example with Mailchimp:
    // await mailchimp.lists.addListMember(LIST_ID, {
    //   email_address: email,
    //   status: 'pending',
    // });

    // Add to subscribers (demo only)
    subscribers.add(email);

    // Log the subscription
    console.log(`New subscriber: ${sanitizeForLog(email)}`);

    return NextResponse.json(
      {
        success: true,
        message: 'Suscripción exitosa! Revisa tu email para confirmar.',
        unsubscribeUrl: `/api/newsletter/subscribe?email=${encodeURIComponent(email)}&token=${signEmail(email)}`,
      },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Email inválido' },
        { status: 400 }
      );
    }

    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: 'Invalid JSON payload' },
        { status: 400 }
      );
    }

    console.error('Newsletter subscription error:', error);
    return NextResponse.json(
      { error: 'Error al procesar la suscripción' },
      { status: 500 }
    );
  }
}

// Unsubscribe endpoint
export async function DELETE(request: NextRequest) {
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

    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    const token = searchParams.get('token');

    if (!email || !token) {
      return NextResponse.json(
        { error: 'Email y token requeridos' },
        { status: 400 }
      );
    }

    const { email: validEmail } = subscribeSchema.parse({ email });

    if (!verifyEmail(validEmail, token)) {
      return NextResponse.json(
        { error: 'Token inválido o expirado' },
        { status: 403 }
      );
    }

    // Remove from subscribers
    subscribers.delete(validEmail);

    // TODO: Update email service

    return NextResponse.json(
      { success: true, message: 'Desuscripción exitosa' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Newsletter unsubscribe error:', error);
    return NextResponse.json(
      { error: 'Error al procesar la desuscripción' },
      { status: 500 }
    );
  }
}
